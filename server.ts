import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import { db } from "./src/db/index.ts";
import { users, userStates } from "./src/db/schema.ts";
import { requireAuth, AuthenticatedRequest } from "./src/middleware/auth.ts";
import { eq, and } from "drizzle-orm";

const app = express();
const PORT = 3000;

app.use(express.json());

// Auth & Syncing API Endpoints
app.post("/api/auth/register", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { uid, email } = req.user;
    
    // Upsert user
    const [dbUser] = await db.insert(users)
      .values({ uid, email })
      .onConflictDoUpdate({
        target: users.uid,
        set: { email }
      })
      .returning();

    return res.json({ success: true, user: dbUser });
  } catch (error) {
    console.error("Register user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Sync multiple states from client (bulk save)
app.post("/api/user/sync", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { uid } = req.user;
    const { states } = req.body; // Array of { key, value }

    if (!states || !Array.isArray(states)) {
      return res.status(400).json({ error: "Invalid states format" });
    }

    const [dbUser] = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!dbUser) {
      return res.status(404).json({ error: "User not registered" });
    }

    // Insert or update all states in parallel upserts
    const promises = states.map(async (state: { key: string; value: string }) => {
      return db.insert(userStates)
        .values({
          userId: dbUser.id,
          key: state.key,
          value: state.value,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: [userStates.userId, userStates.key],
          set: { value: state.value, updatedAt: new Date() }
        });
    });

    await Promise.all(promises);
    return res.json({ success: true });
  } catch (error) {
    console.error("Sync user states error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all states for a user
app.get("/api/user/states", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { uid } = req.user;

    const [dbUser] = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (!dbUser) {
      return res.status(404).json({ error: "User not registered" });
    }

    const dbStates = await db.select().from(userStates).where(eq(userStates.userId, dbUser.id));
    
    // Transform array to key-value object
    const statesMap: Record<string, string> = {};
    dbStates.forEach(s => {
      statesMap[s.key] = s.value;
    });

    return res.json({ success: true, states: statesMap });
  } catch (error) {
    console.error("Get user states error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Helper function to call Gemini models with robust retries and model fallback cascading
async function generateContentWithRetry(
  ai: GoogleGenAI,
  options: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxRetries = 1
): Promise<any> {
  const modelsToTry = options.model 
    ? [options.model, "gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"] 
    : ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"];

  const uniqueModels = Array.from(new Set(modelsToTry));
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  let lastError: any = null;

  for (const modelName of uniqueModels) {
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`[Gemini Call] Requesting ${modelName} (Attempt ${attempt}/${maxRetries + 1})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: options.contents,
          config: options.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const isQuotaExceeded = err.status === 429 || 
                                err.statusCode === 429 || 
                                (err.message && (
                                  err.message.includes("quota") || 
                                  err.message.includes("RESOURCE_EXHAUSTED") || 
                                  err.message.includes("limit")
                                ));

        const isPermanentClientError = err.status === 400 || 
                                       err.statusCode === 400 || 
                                       (err.message && err.message.includes("400")) ||
                                       err.status === 401 ||
                                       err.statusCode === 401 ||
                                       (err.message && err.message.includes("401")) ||
                                       err.status === 403 ||
                                       err.statusCode === 403 ||
                                       (err.message && err.message.includes("403"));

        const isRetriable = !isPermanentClientError;

        if (isRetriable && attempt <= maxRetries) {
          const delay = attempt * 1000;
          console.warn(`[Gemini Call] ${modelName} failed with error (${err.message || "Error"}). Retrying in ${delay}ms...`);
          await sleep(delay);
          continue;
        }
        
        console.warn(`[Gemini Call] ${modelName} failed. Transitioning to next model...`);
        break;
      }
    }
  }

  console.error(`[Gemini Call] All models in the cascade failed.`);
  throw lastError || new Error("All Gemini models failed to respond.");
}

// Fallback question generation in case Gemini is offline or API key is missing
function getFallbackQuestion(topic: string, discipline: string, banca: string) {
  const isFunece = banca === "FUNECE";
  const normalizedDiscipline = (discipline || "").toLowerCase();

  if (normalizedDiscipline.includes("sociologia")) {
    // Return a real high-quality sociology question from Seduc-CE 2018 official exam
    return {
      question: `[UECE/FUNECE 2018] Atente para o seguinte excerto: 'A reflexão sobre as origens e a natureza da vida social é quase tão antiga quanto a própria humanidade, mas a Sociologia, como um campo delimitado do saber científico, só emerge em meados do século 19 na Europa. Para melhor entender esse processo, é mister referir-se ao quadro das mudanças econômicas, políticas e sociais ocorridas principalmente a partir do século 16 e às correntes de pensamento que estabeleceram os alicerces da modernidade europeia - o racionalismo, o empirismo e o iluminismo'.\n\nNo que diz respeito a acontecimentos que foram importantes para o surgimento da Sociologia, considere os seguintes itens:\n\nI. Advento do capitalismo como modo de produção predominante na Europa ocidental e emergência de valores de uma sociedade burguesa.\nII. Industrialização e mudanças estruturais no mundo do trabalho, com urbanização acelerada de grandes centros comerciais.\nIII. Reforma protestante e processo de secularização que proporcionou o surgimento de racionalidade fundamentada nas ações de indivíduos.\nIV. Menor complexidade do processo de divisão social do trabalho em virtude do caráter estamental das economias capitalistas.\n\nCorresponde a acontecimento importante para o surgimento da Sociologia somente o que consta em:`,
      options: [
        { letter: "A", text: "I, II e IV." },
        { letter: "B", text: "II, III e IV." },
        { letter: "C", text: "I, III e IV." },
        { letter: "D", text: "I, II e III." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "Os itens I, II e III representam com exatidão as grandes transformações estruturais (revoluções industrial e francesa, consolidação da burguesia, secularização e racionalização) que propiciaram o nascimento da Sociologia como ciência. O item IV está incorreto porque o capitalismo destruiu a organização estamental do trabalho e gerou uma divisão social do trabalho multiplicada em termos de complexidade e especialização.",
        incorrect: {
          A: "Incorreta, pois inclui o item IV (a divisão do trabalho sob o capitalismo tornou-se drasticamente mais complexa, não menor).",
          B: "Incorreta, pois inclui o item IV e exclui o item I.",
          C: "Incorreta, pois inclui o item IV."
        },
        pegadinha: "Fique atento ao termo 'menor complexidade' na afirmativa IV. O capitalismo de fato intensificou drasticamente a divisão social do trabalho, tornando-as imensamente mais complexas.",
        revisao: "Contexto histórico e social do surgimento da Sociologia como campo científico."
      }
    };
  }

  if (normalizedDiscipline.includes("matemá") || normalizedDiscipline.includes("matema")) {
    return {
      question: `[FUNECE / UECE] No âmbito do ensino de Matemática e das diretrizes curriculares do Ceará, considere as propriedades analíticas das funções. Sendo f(x) = a^x (com a > 1) uma função exponencial e g(x) = px + q uma função afim, assinale a opção correta sobre suas características:`,
      options: [
        { letter: "A", text: "Toda função exponencial da forma f(x) = a^x é classificada como estritamente decrescente para qualquer base real positiva a." },
        { letter: "B", text: "Na transposição didática das funções lineares, a taxa de variação (coeficiente angular) indica a concavidade da parábola resultante." },
        { letter: "C", text: "A função exponencial f(x) = a^x com base a > 1 é estritamente crescente e possui o conjunto de todos os números reais positivos como imagem." },
        { letter: "D", text: "O gráfico de qualquer função exponencial f(x) = a^x intercepta o eixo das ordenadas (eixo y) exatamente no ponto coordenado (0, 0)." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A alternativa C está correta pois uma função exponencial com base maior que 1 é estritamente crescente, e seu conjunto imagem é R*+ (todos os reais estritamente positivos).",
        incorrect: {
          A: "Incorreta. Ela só é decrescente quando a base está entre 0 e 1 (0 < a < 1).",
          B: "Incorreta. Coeficiente angular indica a declividade da reta, e não concavidade de parábola (que é de função quadrática).",
          D: "Incorreta. O gráfico intercepta o eixo y no ponto (0, 1), já que a^0 = 1 para qualquer base a não nula."
        },
        pegadinha: "Cuidado para não confundir domínio com imagem de uma função exponencial. O domínio é todo o conjunto dos reais, mas a imagem é exclusivamente composta por valores positivos.",
        revisao: "Análise Real e Estudo das Funções Elementares."
      }
    };
  }

  if (normalizedDiscipline.includes("hist")) {
    return {
      question: `[FUNECE / UECE] A história social do Ceará é marcada por secas periódicas e mobilizações populares. Com relação à famosa 'Seca de 1915' e a criação dos denominados 'Currais do Governo' (campos de concentração cearenses), assinale a opção correta:`,
      options: [
        { letter: "A", text: "Os campos de concentração cearenses de 1915 e 1932 foram criados pelo governo para acolher e empregar de forma digna todos os flagelados da seca." },
        { letter: "B", text: "A Seca de 1915 e os currais tecnológicos contaram com oposição unânime da oligarquia local liderada por Nogueira Accioly." },
        { letter: "C", text: "Os campos de concentração (como o do Alagadiço em Fortaleza) tinham como objetivo principal isolar socialmente os flagelados da seca, impedindo sua entrada e circulação na capital do estado." },
        { letter: "D", text: "A obra literária 'O Quinze', de Rachel de Queiroz, retrata a seca sob uma perspectiva puramente positivista de exaltação dos investimentos governamentais." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A alternativa C está correta. Os campos de concentração cearenses eram instrumentos de controle social e isolamento higienista para impedir que a massa de flagelados invadisse a capital, Fortaleza.",
        incorrect: {
          A: "Incorreta. As condições nos campos de concentração eram subumanas, com desassistência generalizada e alta taxa de mortalidade.",
          B: "Incorreta. Nogueira Accioly foi deposto em 1912 e as políticas higienistas e de controle social contaram com forte apoio das elites econômicas.",
          D: "Incorreta. 'O Quinze' de Rachel de Queiroz é uma obra de denúncia realista que critica severamente o descaso governamental e o sofrimento social."
        },
        pegadinha: "A banca pode tentar mascarar esses campos de concentração cearenses como 'colônias de férias' ou 'instituições humanitárias'. Eles foram na verdade espaços repressivos de contenção de retirantes.",
        revisao: "História Social do Ceará: Seca de 1915 e Oligarquias."
      }
    };
  }

  if (normalizedDiscipline.includes("port") || normalizedDiscipline.includes("língua") || normalizedDiscipline.includes("lingua")) {
    return {
      question: `[FUNECE / UECE] A concordância nominal e verbal é tema recorrente nas avaliações teóricas para cargos do magistério. Assinale a alternativa que apresenta a flexão correta de acordo com a norma-padrão da Língua Portuguesa:`,
      options: [
        { letter: "A", text: "Fazem dez anos que a Seduc-CE não promovia um concurso com tantas vagas específicas para a área." },
        { letter: "B", text: "Seguem anexo à presente documentação pedagógica os relatórios de planejamento e as avaliações semestrais." },
        { letter: "C", text: "Considerando as diretrizes atuais da BNCC, é meio-dia e meia, horário limite para a consolidação das metas." },
        { letter: "D", text: "Haviam muitos professores interessados em debater as metodologias ativas de ensino na última reunião." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A alternativa C está correta. Diz-se 'meio-dia e meia' porque 'meia' concorda com a palavra 'hora' implícita (meia hora).",
        incorrect: {
          A: "Incorreta. O verbo 'fazer' quando indica tempo transcorrido é impessoal, devendo permanecer no singular: 'Faz dez anos'.",
          B: "Incorreta. A palavra 'anexo' funciona como adjetivo e deve concordar com o substantivo a que se refere: 'Seguem anexos os relatórios'.",
          D: "Incorreta. O verbo 'haver' no sentido de existir é impessoal e não flexiona no plural: 'Havia muitos professores'."
        },
        pegadinha: "Muito cuidado com o verbo haver no sentido de existir e o fazer indicando tempo. Eles são impessoais e não concordam com o sujeito!",
        revisao: "Regras de Concordância Nominal e Verbal da Norma Culta."
      }
    };
  }

  if (normalizedDiscipline.includes("biologia") || normalizedDiscipline.includes("ciência") || normalizedDiscipline.includes("biológicas")) {
    // Return a real high-quality biology evolution question from Sobral/FUNECE official exams
    return {
      question: `[Sobral / FUNECE] O pensamento evolutivo transformou a biologia moderna. Ao comparar as contribuições teóricas e conceituais históricas de Jean-Baptiste Lamarck e Charles Darwin, assinale a afirmação correta:`,
      options: [
        { letter: "A", text: "A herança dos caracteres adquiridos e o mecanismo de seleção natural foram formulados em conjunto por Charles Darwin em sua obra clássica de 1859." },
        { letter: "B", text: "Os objetivos primordiais de Lamarck centravam-se em defender as teorias do fixismo criacionista, a variação estática e a criação em separado das espécies no planeta." },
        { letter: "C", text: "Lamarck fundamentou suas proposições evolutivas diretamente na teoria populacional de Thomas Malthus, segundo a qual as populações crescem em progressão geométrica." },
        { letter: "D", text: "Para Lamarck, as alterações ambientais produzem novas necessidades no organismo, estimulando o uso ou desuso de órgãos, o que gera modificações adaptativas que são transmitidas aos descendentes." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "A alternativa D resume com precisão a essência da teoria evolutiva de Lamarck (Lamarckismo), baseada na Lei do Uso e Desuso (órgãos mais solicitados desenvolvem-se, menos usados atrofiam) e na Lei da Transmissão dos Caracteres Adquiridos.",
        incorrect: {
          A: "Incorreta. A seleção natural foi descrita por Darwin, enquanto os caracteres adquiridos eram uma premissa amplamente aceita à época e enfatizada por Lamarck.",
          B: "Incorreta. Lamarck foi o primeiro grande naturalista a propor uma teoria sistemática e ativa contra o fixismo/criacionismo (ele era transformista).",
          C: "Incorreta. Foi Charles Darwin quem leu Malthus e utilizou o conceito de competição por recursos limitados como pilar fundamental para formular a seleção natural."
        },
        pegadinha: "Cuidado para não achar que Lamarck defendia o criacionismo. Ele foi um pioneiro do evolucionismo! A diferença crucial é que no lamarckismo o meio induz a mudança ativa no indivíduo, enquanto no darwinismo o meio seleciona as variações já existentes.",
        revisao: "Teorias Evolutivas (Lamarckismo vs. Darwinismo vs. Neodarwinismo)."
      }
    };
  }

  const options = [
    {
      letter: "A",
      text: "A avaliação deve ser eminentemente somativa, focando no resultado final para classificação rigorosa dos alunos da Rede Estadual."
    },
    {
      letter: "B",
      text: "As diretrizes curriculares nacionais priorizam a memorização passiva e a fragmentação disciplinar em detrimento de abordagens interdisciplinares."
    },
    {
      letter: "C",
      text: "O Plano Nacional de Educação (PNE) estabelece diretrizes onde a gestão democrática do ensino público deve ser promovida de forma participativa."
    },
    {
      letter: "D",
      text: "De acordo com a LDB, a educação básica é facultativa para crianças na faixa etária de 4 a 5 anos de idade na pré-escola."
    }
  ];

  if (!isFunece) {
    options.push({
      letter: "E",
      text: "O Estatuto do Magistério do Ceará desobriga os docentes de participar ativamente da elaboração do Projeto Político-Pedagógico (PPP) da unidade escolar."
    });
  }

  const incorrectExplanations: Record<string, string> = {
    A: "Incorreta. A avaliação na perspectiva moderna deve ser formativa, contínua e processual, e não unicamente somativa.",
    B: "Incorreta. A BNCC e as diretrizes pedagógicas atuais estimulam metodologias ativas, contextualização e o desenvolvimento de competências integradas.",
    D: "Incorreta. A Emenda Constitucional 59/2009 e a LDB tornaram a educação básica obrigatória e gratuita dos 4 aos 17 anos de idade."
  };

  if (!isFunece) {
    incorrectExplanations.E = "Incorreta. É dever do magistério participar ativamente do planejamento e da formulação do PPP escolar.";
  }

  return {
    question: isFunece 
      ? `[FUNECE - Teórico Especial] No que se refere a "${topic}" aplicado ao ensino de ${discipline}, e considerando as conceptions de avaliação e gestão escolar na tradição pedagógica cearense, assinale a opção correta:`
      : `No que se refere a "${topic}" aplicado ao ensino de ${discipline}, conforme as diretrizes adotadas pela banca ${banca} para o concurso de 2026, assinale a opção correta sobre o processo de ensino-aprendizagem ou a legislação correlata:`,
    options,
    correctAnswer: "C",
    explanation: {
      correct: "A alternativa C está correta pois, conforme o artigo 206, inciso VI da Constituição e o PNE, a gestão democrática é princípio basilar da educação pública nacional.",
      incorrect: incorrectExplanations,
      pegadinha: isFunece
        ? "A FUNECE costuma contrapor as ideias de Libâneo e Saviani com pegadinhas de inversão ou trocar o princípio da gestão democrática por uma ótica puramente burocrática."
        : "A banca costuma trocar a palavra 'formativa' por 'somativa' ou induzir o candidato a achar que a educação infantil pré-escolar (4 e 5 anos) não é obrigatória.",
      revisao: "Artigo 206 da CF/88 e Artigo 4º da LDB (Lei 9.394/96)."
    }
  };
}

// Fallback analysis generation in case Gemini is offline or API key is missing
function getFallbackAnalysis(banca: string, query?: string): string {
  const currentBanca = banca || "FUNECE";
  if (currentBanca === "FUNECE") {
    if (query) {
      return `### Análise Especializada Offline: **${query}**

*(Operando no modo de contingência local para FUNECE)*

Ao analisarmos como a **FUNECE** costuma cobrar o tópico **"${query}"** em concursos de magistério e professores:

1. **Estilo de Enunciado**: 
   - A FUNECE é extremamente acadêmica e teórica. Ela costuma iniciar a questão citando ou parafraseando um autor renomado (como Libâneo, Luckesi ou Saviani), exigindo do candidato o domínio completo e preciso da terminologia clássica.
2. **Construção de Pegadinhas (Pegadinhas Comuns)**:
   - **Inversão de Correntes e Conceitos**: Tenta confundir o candidato ao colocar características de uma tendência pedagógica no enunciado e associar a outra nas opções.
   - **Falsas Exclusões**: Adiciona termos de caráter restritivo (como "unicamente", "apenas", "exclusivo") para invalidar conceitos que na legislação são amplos.
3. **Distribuição das Alternativas**:
   - Geralmente apresenta 4 alternativas (A, B, C, D) com enunciados objetivos. Uma ou duas costumam ser fáceis de descartar por conterem erros teóricos graves, deixando a dúvida entre duas opções muito semelhantes e conceituais.
4. **Recomendação de Estudo**:
   - Faça esquemas mentais com os pilares conceituais de cada autor sobre esse tema. Foque em definições precisas e não em resoluções de problemas práticos.`;
    }

    return `## DNA da FUNECE: Manual Técnico de Engenharia Reversa (Modo Local)

Este relatório foi gerado através do mapeamento técnico de provas reais aplicadas pela banca **FUNECE** (Fundação Universidade Estadual do Ceará) para concursos públicos de magistério, universidades e prefeituras no Ceará.

---

### 1. PERFIL GERAL E ESTILO DOS ENUNCIADOS
* **Rigor Acadêmico e Teorias Clássicas**: A FUNECE é herdeira da tradição intelectual da UECE. Os enunciados de pedagogia e didática são fortemente baseados em citações literais ou parafraseadas de pensadores como **José Carlos Libâneo**, **Cipriano Luckesi** e **Celso Vasconcellos**.
* **Comprimento**: Enunciados curtos a médios, muito objetivos e sem o "juridiquês" exagerado ou as contextualizações prolixas da FGV, mas com alto grau de precisão científica.
* **Complexidade da Linguagem**: Extremamente formal, valorizando a terminologia correta da ciência pedagógica (ex: "praxis educativa", "ontologia do ser", "caráter dialético-formativo").

---

### 2. TIPOS DE COMANDOS E ESTRUTURA DE QUESTÕES
* **Busca pelo Erro (Opções Incorretas)**: Altíssima frequência de comandos pedindo para assinalar a alternativa **"INCORRETA"** ou a que **"NÃO"** corresponde ao tema. A banca gosta de testar a atenção do candidato com esses termos grafados em caixa alta.
* **Associação de Colunas e Julgamento**: Comum em provas de conhecimentos específicos e didática, onde o candidato precisa correlacionar a Coluna I com a Coluna II (ex: correntes pedagógicas com seus respectivos teóricos) ou julgar afirmativas (V ou F).
* **Quatro Alternativas (A, B, C, D)**: A FUNECE tradicionalmente utiliza **4 alternativas** em grande parte de seus concursos estaduais e municipais, embora alguns editais específicos possam exigir 5 alternativas.

---

### 3. COMO A BANCA COBRA LEGISLAÇÃO (LDB, ECA, CONSTITUIÇÃO)
* **Literalidade Cirúrgica (Ctrl+C + Ctrl+V)**: A cobrança de legislação é quase 90% literal. As pegadinhas são montadas através da substituição sutil de palavras-chave da lei:
  * Troca de **"poderá"** por **"deverá"** (faculdade vs. obrigação).
  * Substituição de prazos de notificação ou de conselhos escolares.
  * Inclusão de termos restritivos como **"exclusivamente"** onde a lei prevê **"preferencialmente"** (ex: o atendimento educacional especializado).
* **Falta de Contextualização Prática**: Dificilmente você encontrará na FUNECE uma historinha prática para cobrar a LDB. Ela cobra diretamente o texto frio da lei de forma conceitual.

---

### 4. PRINCIPAIS TÁTICAS DE DISTRATORES (ARMADILHAS)
1. **Inversão Conceitual**: Atribuir características da Pedagogia Tecnicista à Pedagogia Libertadora, ou misturar os conceitos de avaliação diagnóstica e formativa.
2. **Exclusões Arbitrárias**: Tornar errada uma alternativa correta ao inserir palavras que anulam o pluralismo de ideias (ex: dizendo que há apenas um método de ensino válido).
3. **Erros Gramaticais e Coesão**: Às vezes, as alternativas incorretas contêm inconsistências lógicas de concordância ou regência com o comando da questão.`;
  }

  // Default Fallback: IDECAN
  if (query) {
    return `### Análise Especializada Offline: **${query}**

*(Operando no modo de contingência local para IDECAN)*

Ao analisarmos como a **IDECAN** costuma cobrar o tópico **"${query}"** em concursos de magistério:

1. **Estilo de Enunciado**: 
   - A IDECAN tende a misturar a literalidade seca da legislação ou das diretrizes curriculares com pequenas situações do cotidiano escolar, ou simplesmente transcrever fragmentos de artigos doutrinários.
2. **Construção de Pegadinhas (Pegadinhas Comuns)**:
   - **Troca de Termos Limitadores**: Substitui palavras como "exclusivamente", "prioritariamente" por "facultativamente", "excepcionalmente".
   - **Inversão de Papéis**: Tenta confundir as atribuições do Estado, do Município e do estabelecimento de ensino.
3. **Distribuição das Alternativas**:
   - Uma alternativa sempre repete de forma idêntica um erro grosseiro, enquanto duas alternativas parecem corretas e se diferenciam por um detalhe sutil ou palavra restritiva.
4. **Recomendação de Estudo**:
   - Realize a leitura integral e seca da lei ou do conceito teórico focado em memorizar os prazos, exceções e classificações estruturais.`;
  }

  return `## DNA da IDECAN: Manual Técnico de Engenharia Reversa (Modo Local)

Este relatório foi gerado através do mapeamento técnico de provas reais aplicadas pela banca **IDECAN** para concursos públicos na área de educação e magistério.

---

### 1. ESTRUTURA DOS ENUNCIADOS E ESTILO VISUAL
* **Comprimento**: Geralmente de médio a longo. Ao contrário de bancas mais curtas, a IDECAN gosta de contextualizar com citações acadêmicas breves ou ementas de leis.
* **Complexidade**: Vocabulário formal e técnico. Há grande apelo a termos de teorias de aprendizagem e didática clássica (Libâneo, Luckesi, Freire).
* **Frequência de Textos de Apoio**: Moderada a alta. Questões pedagógicas comumente se iniciam com um trecho explicativo longo que serve mais como distração do que como apoio direto.

---

### 2. TIPOS DE COMANDOS MAIS FREQUENTES
* **Comando de Afirmativas (I, II, III)**: Altíssima incidência (~40%). Exige que o candidato analise 3 ou 4 afirmativas separadas e marque "Assinale a alternativa que indica apenas as afirmativas corretas".
* **Comando Negativo/Excludente**: Alta recorrência de termos como **"EXCETO"**, **"INCORRETA"** ou **"NÃO"** grafados em letras maiúsculas ao final do comando para induzir o candidato desatento ao erro.

---

### 3. COMO A BANCA COBRA LEGISLAÇÃO (LDB, ECA, PNE)
* **Literalidade Extrema**: A IDECAN cobra a legislação quase integralmente através da letra de lei pura (Ctrl+C + Ctrl+V), mas altera detalhes cirúrgicos:
  * Troca de prazos (ex: "cinco dias" por "dez dias").
  * Troca de conjunções ou advérbios (ex: trocar "prioritariamente" por "exclusivamente").
  * Troca de sujeitos (ex: colocar como dever da "União" o que é encargo dos "Municípios").
* **Estudos de Caso Pedagógicos**: Raramente cria grandes estudos de caso para leis. A preferência é por cobrar a estrutura rígida e organizacional dos sistemas de ensino.

---

### 4. CONSTRUÇÃO DE DISTRATORES (ALTERNATIVAS INCORRETAS)
* A banca constrói as alternativas erradas usando táticas sistemáticas como verdades incompletas, conceitos trocados e anacronismos.

`;
}

app.post("/api/generate-question", async (req, res) => {
  const { topic, topicId, category, discipline, userDiscipline, banca, hierarchy } = req.body;
  const currentBanca = banca || "FUNECE";

  // Server-side robust parameter resolution and normalization
  let resolvedCategory = category || "mixed";
  let resolvedTopic = topic || "Legislação Geral";
  let resolvedTopicId = topicId || "";
  let resolvedDiscipline = discipline || "Didática e Legislação";
  let resolvedUserDiscipline = userDiscipline || "Matemática";

  const normalizedTopic = resolvedTopic.toLowerCase();
  
  if (resolvedCategory === "mixed" || !category) {
    if (normalizedTopic.includes("regência") || normalizedTopic.includes("concordância") || normalizedTopic.includes("língua") || normalizedTopic.includes("ortografia") || normalizedTopic.includes("sintaxe") || normalizedTopic.includes("compreensão")) {
      resolvedCategory = "comuns";
    } else if (normalizedTopic.includes("ldb") || normalizedTopic.includes("eca") || normalizedTopic.includes("lei") || normalizedTopic.includes("pne") || normalizedTopic.includes("estatuto") || normalizedTopic.includes("funcionários")) {
      resolvedCategory = "legislacao";
    } else if (normalizedTopic.includes("didática") || normalizedTopic.includes("pedagógico") || normalizedTopic.includes("aprendizagem") || normalizedTopic.includes("piaget") || normalizedTopic.includes("aula")) {
      resolvedCategory = "didatica";
    } else if (normalizedTopic.includes("dados") || normalizedTopic.includes("matricula") || normalizedTopic.includes("idade-série") || normalizedTopic.includes("spaece")) {
      resolvedCategory = "ceara";
    } else {
      resolvedCategory = "especifico";
    }
  }

  if (resolvedCategory === "comuns") {
    resolvedDiscipline = "Língua Portuguesa";
  } else if (resolvedCategory === "legislacao") {
    resolvedDiscipline = "Legislação Educacional e Administração Pública";
  } else if (resolvedCategory === "didatica") {
    resolvedDiscipline = "Temas Educacionais e Pedagógicos (Didática)";
  } else if (resolvedCategory === "ceara") {
    resolvedDiscipline = "Leitura e Interpretação de Dados e Indicadores Educacionais";
  } else if (resolvedCategory === "especifico") {
    resolvedDiscipline = resolvedUserDiscipline || "Matemática";
  }

  let resolvedHierarchy = hierarchy;
  if (!resolvedHierarchy) {
    if (resolvedCategory === "comuns") {
      resolvedHierarchy = `Conhecimentos Básicos -> Língua Portuguesa -> ${resolvedTopic}`;
    } else if (resolvedCategory === "legislacao") {
      resolvedHierarchy = `Conhecimentos Básicos -> Administração Pública e Legislação Básica -> ${resolvedTopic}`;
    } else if (resolvedCategory === "didatica") {
      resolvedHierarchy = `Conhecimentos Básicos -> Temas Educacionais e Pedagógicos (Didática) -> ${resolvedTopic}`;
    } else if (resolvedCategory === "ceara") {
      resolvedHierarchy = `Conhecimentos Básicos -> Leitura e Interpretação de Dados e Indicadores Educacionais -> ${resolvedTopic}`;
    } else {
      resolvedHierarchy = `Conhecimentos Específicos -> ${resolvedDiscipline} -> ${resolvedTopic}`;
    }
  }

  const ai = getGeminiClient();
  if (!ai) {
    console.warn("GEMINI_API_KEY is not defined. Using high-quality local fallback question.");
    return res.json({
      success: true,
      isFallback: true,
      warning: "Usando base de dados local (Chave API não configurada).",
      data: getFallbackQuestion(resolvedTopic, resolvedDiscipline, currentBanca)
    });
  }

  try {
    const isFunece = currentBanca === "FUNECE";
    const alternativesCount = isFunece ? "4 alternativas (A, B, C, D)" : "5 alternativas (A, B, C, D, E)";

    console.log(`[Consolidated Pipeline] Resolved filters: Topic: "${resolvedTopic}", Category: "${resolvedCategory}", Discipline: "${resolvedDiscipline}", Banca: "${currentBanca}", Hierarchy: "${resolvedHierarchy}"`);

    // Schema required for final question JSON
    const finalSchemaRequired = {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "O enunciado final lapidado e impecável da questão." },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              letter: { type: Type.STRING, description: "A letra da opção (A, B, C, D, etc.)" },
              text: { type: Type.STRING, description: "O texto polido e revisado da opção." }
            },
            required: ["letter", "text"]
          }
        },
        correctAnswer: { type: Type.STRING, description: "O gabarito definitivo auditado." },
        explanation: {
          type: Type.OBJECT,
          properties: {
            correct: { type: Type.STRING, description: "Comentário pedagógico profundo de por que está correta." },
            incorrect: {
              type: Type.OBJECT,
              properties: {
                A: { type: Type.STRING, description: "Explicação individual exata de por que a opção A está errada." },
                B: { type: Type.STRING, description: "Explicação individual exata de por que a opção B está errada." },
                C: { type: Type.STRING, description: "Explicação individual exata de por que a opção C está errada." },
                D: { type: Type.STRING, description: "Explicação individual exata de por que a opção D está errada." },
                E: { type: Type.STRING, description: "Explicação individual exata de por que a opção E está errada (se houver)." }
              },
              required: ["A", "B", "C", "D"]
            },
            pegadinha: { type: Type.STRING, description: "Modo Mentor: explique a armadilha ou casca de banana armada pela banca nesta questão." },
            revisao: { type: Type.STRING, description: "Artigos de lei, autores ou temas recomendados para estudo e revisão." }
          },
          required: ["correct", "incorrect", "pegadinha", "revisao"]
        }
      },
      required: ["question", "options", "correctAnswer", "explanation"]
    };

    let attempts = 0;
    let finalQuestionData: any = null;
    let isValid = false;
    let extraPromptHint = "";

    while (attempts < 2 && !isValid) {
      attempts++;
      console.log(`[Consolidated Pipeline] Question Generation Attempt ${attempts}/2...`);

      let generatorPrompt = `Você é uma Inteligência Artificial sênior de exames de concurso público, mestre em Psicometria e Redação de Itens de Avaliação.
Sua missão de extrema importância é criar uma questão de múltipla escolha inédita, rigorosa, formal, acadêmica e pedagógica que pertencerá 100% ao assunto e disciplina indicados nos filtros abaixo.

[FILTROS EXIGIDOS PELO USUÁRIO - MANDATÓRIO]:
- Disciplina do Item: "${resolvedDiscipline}" (Toda a questão e sua fundamentação teórica DEVE ser 100% sobre esta disciplina!)
- Tópico do Item: "${resolvedTopic}"
- Categoria de Estudo: "${resolvedCategory}"
- Caminho Hierárquico Completo: "${resolvedHierarchy}"
- Banca Examinadora: "${currentBanca}" (Crie no estilo exato da banca, como rigor conceitual ou letra de lei pura)

[DIRETRIZES CRÍTICAS DE CONTEÚDO E SEGURANÇA]:
1. CORRESPONDÊNCIA TEMÁTICA ESTRETA (100%): O item gerado deve pertencer 100% ao conteúdo e disciplina indicados acima.
2. PROIBIÇÃO ABSOLUTA DE MISTURA INTERDISCIPLINAR (ZERO ALUCINAÇÃO):
   - Se a disciplina do item for "Língua Portuguesa" e o assunto for "Regência nominal e verbal", você é EXPRESSAMENTE PROIBIDO de introduzir termos, conceitos, teorias ou problemas de Biologia, Ecologia, Física ou qualquer outra disciplina científica alheia. A análise deve ser linguística, focando nas preposições, regência, trânsito verbal/nominal e na norma-padrão.
   - Não use textos de apoio sobre outras disciplinas científicas (como ecologia, genética, etc.) para formular questões de Língua Portuguesa. Toda a temática de apoio e as perguntas devem ser centradas no domínio exclusivo da Língua Portuguesa.
3. FORMULAÇÃO DO ITEM:
   - Formule exatamente ${alternativesCount}.
   - O enunciado deve ser robusto, formal, acadêmico e focado no assunto.
   - Use os distratores clássicos para estruturar as alternativas incorretas de modo extremamente plausível, mas garanta que contenham erros conceituais ou lógicos claros.
   - Defina uma única alternativa correta incontestável.
4. COMENTÁRIOS PEDAGÓGICOS (MANDATÓRIO):
   - Forneça uma justificativa rica e profunda de por que a correta está certa ("correct").
   - Escreva justificativas individuais minuciosas para cada opção incorreta ("incorrect"), revelando o erro ou pegadinha embutida em cada uma.
   - Explique a pegadinha clássica ou casca de banana empregada na questão ("pegadinha").
   - Recomende o foco para revisão ("revisao").`;

      if (extraPromptHint) {
        generatorPrompt += `\n\n[AVISO DE CORREÇÃO DO FILTRO - MANDATÓRIO]:\nO rascunho anterior foi rejeitado pelo validador automático de qualidade pelo seguinte motivo: "${extraPromptHint}".\nPor favor, corrija isso agora. O item gerado deve focar UNICAMENTE e EXCLUSIVAMENTE em "${resolvedDiscipline}" no assunto "${resolvedTopic}".`;
      }

      console.log("[Consolidated Pipeline] Invoking Generator...");
      const generatorResponse = await generateContentWithRetry(ai, {
        contents: generatorPrompt,
        config: {
          systemInstruction: `Você é o PROMPT MASTER elaborador e auditor final. Sua palavra é lei. Você garante perfeição pedagógica, jurídica e gramatical no assunto "${resolvedTopic}". Retorne estritamente o JSON com a estrutura exigida.`,
          responseMimeType: "application/json",
          temperature: 0.3,
          responseSchema: finalSchemaRequired
        }
      });

      const generatorText = generatorResponse.text?.trim() || "{}";
      const candidateQuestionData = JSON.parse(generatorText);
      console.log("[Consolidated Pipeline] Generator completed. Initiating strict quality validation...");

      // Quality Control Validation Pass
      const validatorPromptText = `Você é o Agente de Controle de Qualidade de Questões de Concurso.
Sua missão de extrema urgência e importância é validar se a questão gerada pertence 100% ao conteúdo e disciplina selecionados pelo usuário, sem desvios, alucinações ou misturas interdisciplinares impróprias.

[FILTROS DO USUÁRIO]:
- Disciplina Selecionada: "${resolvedDiscipline}"
- Tópico Selecionado: "${resolvedTopic}"
- Categoria do Conteúdo: "${resolvedCategory}"
- Caminho Hierárquico: "${resolvedHierarchy}"

[QUESTÃO GERADA]:
${JSON.stringify(candidateQuestionData, null, 2)}

Regras de Validação Cruciais:
1. Correspondência Temática Estrita (100%): A questão e suas alternativas devem abordar diretamente e exclusivamente o tópico "${resolvedTopic}" e a disciplina "${resolvedDiscipline}".
2. Zero Misturas Interdisciplinares: Se a disciplina selecionada for "Língua Portuguesa", a questão deve tratar de gramática, interpretação, concordância, regência, crase, etc. É terminantemente proibido conter enunciados, conceitos, termos técnicos ou perguntas de Biologia, Física, Química, Matemática ou qualquer outra disciplina alheia (por exemplo, nada sobre fluxo gênico, deriva genética, dinâmica de populações ou ecossistemas!).
3. Não faça associações semânticas amplas que justifiquem a fuga do tema (ex: usar termos científicos de Biologia em uma questão de Língua Portuguesa sob o pretexto de ser um 'texto de apoio' - se o assunto é Regência, a questão inteira deve girar em torno da análise sintático-semântica de regência das palavras, e não sobre genética ou dinâmica de ecossistemas).
4. Verifique se o assunto cobrado realmente corresponde à disciplina selecionada. Se a disciplina for "Língua Portuguesa", e o assunto for "Regência nominal e verbal", a questão deve cobrar regência (ex: regência verbal, preposição exigida pelo verbo/nome).

Responda em formato JSON informando se a questão é válida e a justificativa técnica.`;

      const validationResponse = await generateContentWithRetry(ai, {
        contents: validatorPromptText,
        config: {
          systemInstruction: "Você é um agente validador rigoroso. Avalie a conformidade da questão em relação ao assunto e disciplina indicados. Retorne estritamente um JSON.",
          responseMimeType: "application/json",
          temperature: 0.1,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: { type: Type.BOOLEAN, description: "True se a questão atende 100% aos critérios de disciplina e conteúdo sem desvios. False caso contrário." },
              reason: { type: Type.STRING, description: "Justificativa da decisão." }
            },
            required: ["isValid", "reason"]
          }
        }
      });

      const validationText = validationResponse.text?.trim() || "{}";
      const validationResult = JSON.parse(validationText);
      console.log(`[Validation Results] Attempt ${attempts}: isValid = ${validationResult.isValid}. Reason: ${validationResult.reason}`);

      if (validationResult.isValid) {
        isValid = true;
        finalQuestionData = candidateQuestionData;
      } else {
        extraPromptHint = validationResult.reason;
      }
    }

    if (!isValid) {
      console.warn(`[Validation Failed] Failed to generate a valid question after 2 attempts. Falling back to local fallback data.`);
      return res.json({
        success: true,
        isFallback: true,
        warning: `Limite de tentativas de geração excedido. Usando contingência local para o tópico e disciplina selecionados.`,
        data: getFallbackQuestion(resolvedTopic, resolvedDiscipline, currentBanca)
      });
    }

    return res.json({
      success: true,
      data: finalQuestionData
    });

  } catch (error: any) {
    console.error("Gemini consolidated question generation error:", error);
    return res.json({
      success: true,
      isFallback: true,
      warning: "Erro ao consultar o Gemini (pipeline consolidado). Usando contingência local.",
      data: getFallbackQuestion(resolvedTopic, resolvedDiscipline, currentBanca)
    });
  }
});

// Endpoint: Chat with Mentor
app.post("/api/chat", async (req, res) => {
  const { 
    messages, 
    discipline, 
    banca, 
    topic, 
    difficultyTopics,
    completedDays,
    completedDates,
    genSubtopicStatus,
    specSubtopicStatus,
    scheduleItems,
    completedTopics,
    pendingTopics,
    clientDateStr,
    todayCalendarTopic,
    isTodayCompleted,
    todayWeekdayName
  } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    console.warn("GEMINI_API_KEY is not defined. Using chat local fallback response.");
    const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
    let replyText = "";
    
    // Resolve date and day of week
    const dateToUse = clientDateStr || new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const capitalizedToday = dateToUse.charAt(0).toUpperCase() + dateToUse.slice(1);
    
    if (lastUserMsg.includes("previsto") || lastUserMsg.includes("hoje")) {
      if (todayCalendarTopic) {
        replyText = `### Meta de Hoje: **${todayCalendarTopic.title || "Meta de Hoje"}** 📅\n\nNo seu cronograma gerado para hoje, a meta de estudos é:\n* **Assuntos:** ${todayCalendarTopic.desc || ""}\n* **Horário:** ${todayCalendarTopic.time || "19:00 - 22:00"}\n* **Status Atual:** ${isTodayCompleted ? "✅ Concluído!" : "⏳ Pendente"}\n\n**Orientações para o estudo de hoje:**\n${todayCalendarTopic.notes || ""}\n\n**Como estudar estes assuntos hoje:**\n1. Use os Guias de Estudo rápidos na aba de Mapeamento para revisar as bases teóricas.\n2. Vá até o **Simulador** e responda a pelo menos 5 a 10 questões focadas da banca **${banca}** sobre estes temas.\n3. Se encontrar dificuldades ou quiser destrinchar alguma pegadinha, digite sua dúvida aqui!`;
      } else {
        const todayItem = (scheduleItems || []).find((item: any) => capitalizedToday.toLowerCase().includes((item.day || "").toLowerCase()));
        
        if (todayItem) {
          const isDone = completedDays && completedDays[todayItem.day];
          replyText = `### Meta de Hoje: **${todayItem.day}** 📅\n\nNo seu cronograma personalizado, a meta para hoje é:\n* **Assunto:** ${todayItem.desc}\n* **Foco/Peso:** ${todayItem.pct || "Alta relevância"}\n* **Status Atual:** ${isDone ? "✅ Concluído!" : "⏳ Pendente"}\n\n**Como estudar este assunto hoje:**\n1. Use o Guia de Estudos rápido e revise as bases teóricas.\n2. Vá até o **Simulador** e responda a pelo menos 5 questões focadas da banca **${banca}** sobre este tema.\n3. Se encontrar dificuldades, me avise aqui para destrincharmos as pegadinhas!`;
        } else {
          const firstPending = (scheduleItems || []).find((item: any) => completedDays && !completedDays[item.day]);
          if (firstPending) {
            replyText = `### Meta Recomendada para Hoje 📅\n\nIdentifiquei que sua próxima meta pendente é de **${firstPending.day}**:\n* **Assunto:** ${firstPending.desc}\n\nQue tal começarmos por ela hoje para manter seu ritmo impecável? Vá até o painel principal para marcar como concluída assim que terminar!`;
          } else {
            replyText = `### Meta de Estudos de Hoje 📅\n\nDe acordo com o seu calendário, todas as metas semanais do seu cronograma de estudos estão em dia! \n\nO foco sugerido de hoje é consolidar seu aprendizado na área de **${discipline}** resolvendo simulados gerais ou revisando seus flashcards.`;
          }
        }
      }
    } else if (lastUserMsg.includes("conteúdo") || lastUserMsg.includes("material")) {
      const activeTopic = topic || "Assuntos de hoje";
      replyText = `### Onde encontrar o melhor conteúdo? 📚\n\nPara o assunto de hoje (**${activeTopic}**), recomendo as seguintes fontes oficiais e de alta qualidade:\n\n* **Legislação e Diretrizes Educacionais:** Sempre estude pela legislação "seca" atualizada (direto nos sites do Planalto ou da Seduc-CE). Para a LDB e PNE, priorize os resumos comentados.\n* **Didática Geral e Currículo do Ceará:** O documento oficial do *Documento Curricular do Ceará (DCRC)* está disponível no portal da SEDUC-CE. Na didática geral, foque nas tendências pedagógicas (Libâneo e Saviani).\n* **Parte Específica de ${discipline}:** Utilize os materiais de apoio e as diretrizes curriculares do Ensino Médio da BNCC, que são a principal referência da banca **${banca}**.\n\nLembre-se de que os nossos guias de estudo rápidos na aba de Mapeamento já contêm resumos direcionados e dicas de pegadinhas para economizar seu tempo!`;
    } else if (lastUserMsg.includes("paramos") || lastUserMsg.includes("onde paramos")) {
      const completedCount = completedTopics?.length || 0;
      const pendingCount = pendingTopics?.length || 0;
      const totalCount = completedCount + pendingCount;
      const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      
      replyText = `### Onde paramos? 📈\n\nAnalisando o seu progresso no sistema preparatório:\n* **Assuntos Concluídos:** ${completedCount} de ${totalCount} (${pct}% concluído)\n* **Meta Ativa de Foco:** **${topic || "Não definida"}**\n\n**Resumo do Progresso:**\n${completedTopics && completedTopics.length > 0 
        ? `Os últimos assuntos que você marcou como concluídos incluem: ${completedTopics.slice(-3).map((t: string) => `**${t}**`).join(", ")}.`
        : "Você está iniciando sua jornada agora! Excelente momento para dar o primeiro passo."}\n\nPara continuar avançando, o próximo tópico recomendado na sua lista de pendentes é o seu assunto de foco atual. Pronto para fazer mais algumas questões?`;
    } else if (lastUserMsg.includes("atrasado") || lastUserMsg.includes("pendente")) {
      const pendingDays = (scheduleItems || []).filter((item: any) => completedDays && !completedDays[item.day]);
      if (pendingDays.length > 0) {
        replyText = `### Análise de Assuntos Atrasados/Pendentes ⏳\n\nIdentifiquei que você tem **${pendingDays.length} metas pendentes** no seu cronograma:\n\n${pendingDays.map((p: any) => `* **${p.day}**: ${p.desc}`).join("\n")}\n\n**Plano de Ação para Recuperação:**\n1. **Não se desespere:** É normal ter imprevistos na rotina. O importante é a constância.\n2. **Fracione o atraso:** Tente estudar uma meta pendente e meia a cada dia (adicionando cerca de 30 a 45 minutos de estudo diário).\n3. **Foque nas questões:** Resolva simulados rápidos desses assuntos para ver se você já domina a teoria, acelerando o processo.`;
      } else {
        replyText = `### Parabéns, Professor(a)! 🎉\n\nFiz uma verificação completa e **você não tem nenhum assunto ou dia atrasado no seu cronograma**! Todas as metas semanais planejadas estão marcadas como concluídas ou em dia. \n\nContinue com essa disciplina incrível. Esse ritmo constante é o que garante a nomeação!`;
      }
    } else {
      replyText = `Olá! Como estou operando no modo de contingência local, quero destacar que para **${discipline}** sob a perspectiva da banca **${banca}**, é fundamental compreender as bases pedagógicas da LDB e do Currículo do Ceará. \n\nGostaria de focar em algum ponto específico das metas do PNE ou nos artigos da LDB relativos ao seu campo de atuação?`;
    }

    return res.json({
      success: true,
      isFallback: true,
      text: replyText
    });
  }

  try {
    // We convert the past messages into Gemini content objects
    let formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content || "" }]
    }));

    // Sanitize for Gemini chat format requirements:
    // 1. Must start with "user"
    while (formattedContents.length > 0 && formattedContents[0].role !== "user") {
      formattedContents.shift();
    }

    // 2. Must alternate "user" and "model", and must not have consecutive same roles
    const sanitizedContents: any[] = [];
    for (const msg of formattedContents) {
      if (sanitizedContents.length === 0) {
        sanitizedContents.push(msg);
      } else {
        const lastMsg = sanitizedContents[sanitizedContents.length - 1];
        if (lastMsg.role === msg.role) {
          // Merge text content if roles are consecutive
          lastMsg.parts[0].text += "\n" + msg.parts[0].text;
        } else {
          sanitizedContents.push(msg);
        }
      }
    }

    // If empty after sanitization, fall back to a simple single-user message
    if (sanitizedContents.length === 0 && messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
      if (lastUserMsg) {
        sanitizedContents.push({
          role: "user",
          parts: [{ text: lastUserMsg.content || "" }]
        });
      }
    }

    let struggleContext = "";
    if (difficultyTopics && Array.isArray(difficultyTopics) && difficultyTopics.length > 0) {
      struggleContext = "\n\nO candidato possui o seguinte histórico de baixo rendimento ou erros em tópicos específicos:\n" +
        difficultyTopics.map((dt: any) => `- **${dt.name}** (Aproveitamento de ${dt.accuracy}% em ${dt.answered} questões resolvidadas)`).join("\n") +
        "\nUse essa informação ativamente para guiá-lo, propor revisões e desafios práticos dirigidos sobre esses assuntos quando for pertinente e ajudá-lo a reverter essas dificuldades!";
    }

    const resolvedDateStr = clientDateStr || new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Add comprehensive real-time study calendar progression context for Gemini
    let progressContext = "";
    
    if (todayCalendarTopic) {
      progressContext += `\n\nMETA ESPECÍFICA DO CALENDÁRIO GERADO PELO SISTEMA PARA HOJE (${resolvedDateStr}):\n`;
      progressContext += `- **Título da Meta de Hoje:** ${todayCalendarTopic.title || ""}\n`;
      progressContext += `- **Assuntos/Subtópicos Sugeridos da Meta de Hoje:** ${todayCalendarTopic.desc || ""}\n`;
      progressContext += `- **Horário Planejado:** ${todayCalendarTopic.time || ""}\n`;
      progressContext += `- **Orientações Importantes / Dicas de Estudo para Hoje:**\n${todayCalendarTopic.notes || ""}\n`;
      progressContext += `- **Status de Conclusão da Meta de Hoje:** ${isTodayCompleted ? "CONCLUÍDO (Concluído pelo candidato)" : "PENDENTE (Não concluído)"}\n\n`;
    }

    if (scheduleItems && Array.isArray(scheduleItems) && scheduleItems.length > 0) {
      progressContext += "\n\nCRONOGRAMA SEMANAL GERAL DE ESTUDOS DO CANDIDATO:\n";
      scheduleItems.forEach((item: any) => {
        const dayName = item.day || "";
        const isDayCompleted = completedDays && completedDays[dayName];
        progressContext += `- ${dayName}: ${item.desc || ""} [Status: ${isDayCompleted ? "CONCLUÍDO (Concluído pelo usuário)" : "PENDENTE (Não concluído)"}]\n`;
      });
    }

    // Include detailed subtopics status from the Study Guide Map (Guia do Edital / Mapa de Conteúdos)
    if (genSubtopicStatus && typeof genSubtopicStatus === "object") {
      const completedGens = Object.keys(genSubtopicStatus).filter(k => genSubtopicStatus[k]);
      if (completedGens.length > 0) {
        progressContext += `\nSUBTÓPICOS GERAIS CONCLUÍDOS NO GUIA DO EDITAL (MAPA DE CONTEÚDOS):\n` + completedGens.map(id => `- Concluído: ${id.replace(/_/g, " -> ")}`).join("\n") + "\n";
      }
    }

    if (specSubtopicStatus && typeof specSubtopicStatus === "object") {
      const completedSpecs = Object.keys(specSubtopicStatus).filter(k => specSubtopicStatus[k]);
      if (completedSpecs.length > 0) {
        progressContext += `\nSUBTÓPICOS ESPECÍFICOS CONCLUÍDOS NO GUIA DO EDITAL (MAPA DE CONTEÚDOS):\n` + completedSpecs.map(id => `- Concluído: ${id.replace(/_/g, " -> ")}`).join("\n") + "\n";
      }
    }

    if (completedTopics && Array.isArray(completedTopics) && completedTopics.length > 0) {
      progressContext += "\nTÓPICOS/ASSUNTOS DO EDITAL JÁ CONCLUÍDOS COM SUCESSO PELO CANDIDATO:\n" + completedTopics.map((t: string) => `- ${t}`).join("\n");
    }

    if (pendingTopics && Array.isArray(pendingTopics) && pendingTopics.length > 0) {
      progressContext += "\nTÓPICOS/ASSUNTOS DO EDITAL QUE ESTÃO PENDENTES (Ainda precisam ser estudados):\n" + pendingTopics.slice(0, 20).map((t: string) => `- ${t}`).join("\n") + (pendingTopics.length > 20 ? `\n... e mais ${pendingTopics.length - 20} assuntos pendentes.` : "");
    }

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.1-flash-lite",
      contents: sanitizedContents,
      config: {
        systemInstruction: `Você é o "Professor Mentor", um tutor virtual inteligente e didático, focado na aprovação de docentes no Concurso da Rede Estadual do Ceará 2026.
O candidato está estudando para a disciplina de **${discipline}** sob o estilo de cobrança específico da banca **${banca}**.
O tópico ativo de foco é: **${topic || "Não definido"}**.${struggleContext}${progressContext}

DATA E DIA DA SEMANA ATUAL DO CANDIDATO: **${resolvedDateStr}**.
ATENÇÃO CRÍTICA AO DIA DA SEMANA: Use o dia da semana contido na data acima com precisão absoluta (por exemplo, se nela diz "terça-feira", "quarta-feira", etc.). Nunca erre o dia da semana atual do candidato!

Diretrizes importantes de Estilo e Comunicação:
1. INTRODUÇÃO EXTREMAMENTE DIRETA E SUCINTA: Vá direto ao assunto de forma amigável na sua primeira frase ou parágrafo de saudação. Não use parágrafos longos de encorajamento vazio, clichês de autoajuda ou discursos repetitivos. Seja sucinto e focado no assunto.
2. CONTEÚDO RICO E DE ALTA DENSIDADE (SEM "ENCHER LINGUIÇA"): Quando responder sobre conteúdos programáticos, didática ou legislação, seja muito completo, profundo, analítico e de alto nível, explicando os pormenores, mas faça-o de forma clara e livre de enrolações vazias ou redundâncias.
3. Se o candidato perguntar "O que está previsto para eu estudar hoje?": consulte o Cronograma Semanal fornecido no contexto acima. Localize o dia da semana correto (por exemplo, terça-feira se a data atual for terça-feira) e diga o que está programado e o status. Se for PENDENTE, dê uma sugestão direta de estudo. Se já for CONCLUÍDO, elogie rapidamente e recomende o próximo pendente.
4. Se o candidato perguntar "Onde encontro o melhor conteúdo para os assuntos de hoje?": apresente referências teóricas de peso específicas para o assunto de hoje (ex: LDB comentada, DCRC, referências didáticas específicas ou tópicos essenciais de ${discipline}).
5. Se o candidato perguntar "Onde paramos?": verifique e cite os últimos assuntos concluídos e mostre as próximas metas pendentes de forma clara.
6. Se o candidato perguntar "Tem algum assunto atrasado?": liste as metas pendentes anteriores ao dia atual e apresente uma sugestão prática para se recuperar sem estresse.

Diretrizes adicionais:
- Responda sempre em português.
- Use recursos didáticos reais: de vez em quando, proponha um micro-desafio conceitual (como um caso prático rápido de sala de aula) para estimular o aprendizado ativo, sem floreios desnecessários.
- Use formatação markdown elegante (### para títulos, ** para destaques, listas em bullets).`,
        temperature: 0.7
      }
    });

    const reply = response.text || "Professor(a), desculpe-me, não consegui formular uma resposta no momento. Vamos continuar focando nos nossos exercícios!";
    return res.json({
      success: true,
      text: reply
    });

  } catch (error: any) {
    console.error("Gemini chat error:", error);
    return res.json({
      success: true,
      isFallback: true,
      text: "Professor(a), tive uma oscilação na conexão com a IA, mas continuo aqui para te apoiar. Que tal revisarmos os pontos fundamentais da LDB enquanto a rede se estabiliza?"
    });
  }
});

// Endpoint: DNA Reverse Engineering & Specialist Analysis (FUNECE, IDECAN, etc.)
app.post("/api/idecan-analysis", async (req, res) => {
  const { query, discipline, banca: selectedBanca } = req.body;
  const banca = selectedBanca || "FUNECE";

  const ai = getGeminiClient();
  if (!ai) {
    console.warn(`GEMINI_API_KEY is not defined. Using high-quality offline ${banca} DNA report.`);
    return res.json({
      success: true,
      isFallback: true,
      text: getFallbackAnalysis(banca, query)
    });
  }

  try {
    let prompt = "";
    if (query) {
      prompt = `Faça uma engenharia reversa cirúrgica de como a banca examinadora ${banca} costuma abordar especificamente o assunto "${query}" em concursos públicos para o magistério e professores.

Disseque minuciosamente os seguintes aspectos para este tópico específico:
1. **Padrão de Cobrança**: É cobrado de forma literal (letra de lei/teorias puras) ou interpretativa? Explique com exemplos da banca ${banca}.
2. **Padrão de Distratores**: Como a ${banca} costuma construir as alternativas incorretas para esse tema específico (ex: troca de palavras, conceitos invertidos, omissão de trechos)?
3. **Pegadinha Clássica da Banca**: Qual é a pegadinha clássica ou armadilha mais comum que a ${banca} coloca nas provas reais sobre esse tema?
4. **Guia de Resolução Rápida**: Forneça uma dica de ouro ou macete prático para o candidato identificar a resposta correta em menos de 45 segundos ao se deparar com esse tema.

Estruture sua resposta usando títulos de seções bem definidos, listas em tópicos e excelente formatação markdown.`;
    } else {
      prompt = `Você é um pesquisador especialista em concursos públicos brasileiros e em análise de bancas examinadoras.
Sua missão é estudar profundamente a banca ${banca} e produzir um relatório técnico sobre seu padrão de elaboração de provas, especialmente para concursos de professores e magistério.
Não quero apenas uma descrição superficial da banca.
Quero que você faça uma verdadeira engenharia reversa do estilo da ${banca}.
Analise um grande número de provas aplicadas pela banca ao longo dos anos e identifique padrões consistentes.
Sua análise deve ser baseada em evidências observadas nas provas, evitando suposições.
Para cada padrão identificado, informe exemplos e explique por que ele caracteriza a banca.
Analise, no mínimo, os seguintes aspectos:
* Estrutura dos enunciados.
* Tamanho médio das questões.
* Complexidade da linguagem.
* Frequência de textos de apoio.
* Tipos de comandos utilizados ("Assinale a alternativa correta", "É correto afirmar", "Analise as afirmativas", etc.).
* Quantidade de alternativas (se costuma usar 4 ou 5).
* Como as alternativas incorretas são construídas.
* Tipos de pegadinhas utilizados.
* Frequência de palavras como "EXCETO", "INCORRETA", "APENAS", "SOMENTE", "NÃO".
* Como a banca cobra legislação escolar e teorias pedagógicas.
* Como utiliza artigos de lei.
* Grau de literalidade das questões vs interpretação.
* Assuntos mais recorrentes em concursos para professores.
* Principais diferenças entre a ${banca} e outras bancas como Cebraspe, FGV e FCC.

Ao final, construa um documento chamado **DNA da ${banca}**, contendo regras objetivas para reproduzir fielmente seu estilo de elaboração de questões.
Esse documento deve conter instruções como:
* comprimento ideal do enunciado;
* estrutura típica das alternativas;
* quantidade de alternativas;
* estilo de escrita;
* grau de formalidade;
* forma de cobrar legislação;
* frequência de conceitos literais;
* frequência de interpretação;
* principais tipos de distratores;
* padrões de pegadinhas;
* características que diferenciam a ${banca} de outras bancas.`;
    }

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: `Você é o maior especialista do Brasil em Engenharia Reversa de bancas de concurso público, com foco absoluto na banca ${banca}. Você produz relatórios técnicos impecáveis, práticos, repletos de exemplos e formatação em markdown de extrema elegância, perfeitos para treinar outras IAs ou instruir candidatos de alto nível que buscam passar no concurso Seduc-CE e prefeituras em 2026. Escreva em português de forma clara, objetiva e extremamente formal.`,
        temperature: 0.1
      }
    });

    return res.json({
      success: true,
      text: response.text || "Não foi possível gerar a análise técnica no momento."
    });

  } catch (err) {
    console.error("Analysis error (falling back to offline DNA):", err);
    return res.json({
      success: true,
      isFallback: true,
      warning: "Erro ao consultar o Gemini (503/Instabilidade). Utilizando contingência local.",
      text: getFallbackAnalysis(banca, query)
    });
  }
});

// Serve static app in production / Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
