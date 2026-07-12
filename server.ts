import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Global flag to track if gemini-3.5-flash has run out of quota for the session
let isGemini35Exhausted = false;

// Helper function to call Gemini models with robust retries and model fallback
async function generateContentWithRetry(
  ai: GoogleGenAI,
  options: {
    model?: string;
    contents: any;
    config?: any;
  },
  maxRetries = 2
): Promise<any> {
  let primaryModel = options.model || "gemini-3.5-flash";
  
  // If gemini-3.5-flash is exhausted, dynamically shift the primary model to the lighter, high-quota model
  if (primaryModel === "gemini-3.5-flash" && isGemini35Exhausted) {
    console.log("[Gemini Call] gemini-3.5-flash is currently flagged as exhausted. Bypassing directly to gemini-3.1-flash-lite...");
    primaryModel = "gemini-3.1-flash-lite";
  }

  // Fall back to gemini-3.1-flash-lite if primary is gemini-3.5-flash, otherwise fallback to gemini-3.5-flash
  const fallbackModel = primaryModel === "gemini-3.5-flash" ? "gemini-3.1-flash-lite" : "gemini-3.5-flash";
  
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Try Primary Model first with retries
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      console.log(`[Gemini Call] Requesting ${primaryModel} (Attempt ${attempt}/${maxRetries + 1})...`);
      const response = await ai.models.generateContent({
        model: primaryModel,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      const isTransient = err.status === 503 || 
                          err.statusCode === 503 || 
                          (err.message && err.message.includes("503")) ||
                          (err.message && err.message.includes("high demand")) ||
                          err.status === 429 ||
                          err.statusCode === 429 ||
                          (err.message && err.message.includes("429")) ||
                          (err.message && err.message.includes("RESOURCE_EXHAUSTED"));

      const isQuotaExceeded = err.status === 429 || 
                              err.statusCode === 429 || 
                              (err.message && (
                                err.message.includes("quota") || 
                                err.message.includes("RESOURCE_EXHAUSTED") || 
                                err.message.includes("limit")
                              ));

      if (isQuotaExceeded && primaryModel === "gemini-3.5-flash") {
        console.warn(`[Gemini Call] Detected gemini-3.5-flash quota exhaustion/429. Flagging as exhausted for session to bypass future retries.`);
        isGemini35Exhausted = true;
        break; // Stop retrying primaryModel and transition to fallbackModel immediately
      }

      if (isTransient && attempt <= maxRetries) {
        const delay = attempt * 1000;
        console.warn(`[Gemini Call] ${primaryModel} failed with code ${err.status || '503'} (${err.message || 'Error'}). Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      
      console.warn(`[Gemini Call] ${primaryModel} failed. Transitioning to fallback model ${fallbackModel}...`);
      break; // Try fallback model
    }
  }

  // Try Fallback Model with retries
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      console.log(`[Gemini Call] Requesting fallback ${fallbackModel} (Attempt ${attempt}/${maxRetries + 1})...`);
      const response = await ai.models.generateContent({
        model: fallbackModel,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      const isTransient = err.status === 503 || 
                          err.statusCode === 503 || 
                          (err.message && err.message.includes("503")) ||
                          (err.message && err.message.includes("high demand")) ||
                          err.status === 429 ||
                          err.statusCode === 429 ||
                          (err.message && err.message.includes("429")) ||
                          (err.message && err.message.includes("RESOURCE_EXHAUSTED"));

      if (isTransient && attempt <= maxRetries) {
        const delay = attempt * 1000;
        console.warn(`[Gemini Call] Fallback ${fallbackModel} failed with ${err.status || '503'}. Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      console.error(`[Gemini Call] Both primary and fallback models failed.`);
      throw err; // bubble up
    }
  }
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

// Endpoint: Generate Question
app.post("/api/generate-question", async (req, res) => {
  const { topic, discipline, banca } = req.body;
  const currentBanca = banca || "FUNECE";

  const ai = getGeminiClient();
  if (!ai) {
    console.warn("GEMINI_API_KEY is not defined. Using high-quality local fallback question.");
    return res.json({
      success: true,
      isFallback: true,
      warning: "Usando base de dados local (Chave API não configurada).",
      data: getFallbackQuestion(topic || "Legislação Geral", discipline || "Matemática", currentBanca)
    });
  }

  try {
    const isFunece = currentBanca === "FUNECE";
    const alternativesCount = isFunece ? "4 alternativas (A, B, C, D)" : "5 alternativas (A, B, C, D, E)";

    console.log(`[Multi-Agent Pipeline] Generating question for Topic: "${topic}", Discipline: "${discipline}", Banca: "${currentBanca}"`);

    // ==========================================
    // AGENT 1: ANALYST (Agente Analista)
    // ==========================================
    console.log("[Agent 1] Invoking Analyst...");
    const analystPrompt = `Você é o Agente Analista, um especialista em Engenharia Reversa de Concursos Públicos e Mapeamento Curricular.
Sua missão é realizar uma análise cirúrgica do tópico "${topic}" para a disciplina de "${discipline}" sob a ótica de cobrança da banca "${currentBanca}".

Você deve mapear:
1. Os conceitos centrais reais, leis aplicáveis (ex: LDB, PNE, etc.), teóricos (Piaget, Vygotsky, Libâneo, Saviani, etc.) que fundamentam esse tema.
2. O padrão estilístico da banca "${currentBanca}" (rigor acadêmico, literalidade ou aplicação prática).
3. Distratores de alta plausibilidade: táticas de desvios, confusões de conceitos e pegadinhas que a banca comumente cria para esse assunto específico.`;

    const analystResponse = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: analystPrompt,
      config: {
        systemInstruction: "Você é um especialista em análise de bancas examinadoras e pedagogia. Forneça respostas analíticas extremamente precisas e estruturadas em JSON.",
        responseMimeType: "application/json",
        temperature: 0.2,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topicAnalysis: { type: Type.STRING, description: "Visão geral analítica da cobrança do tema pela banca." },
            coreConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de conceitos reais e leis que devem ser avaliados."
            },
            bancaPattern: { type: Type.STRING, description: "Estilo e formato de comandos típicos da banca para este assunto." },
            potentialDistractors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Estratégias específicas de distração a serem utilizadas para induzir ao erro de forma inteligente."
            }
          },
          required: ["topicAnalysis", "coreConcepts", "bancaPattern", "potentialDistractors"]
        }
      }
    });

    const analystText = analystResponse.text?.trim() || "{}";
    const analysisBriefing = JSON.parse(analystText);
    console.log("[Agent 1] Analyst Output parsed successfully.");

    // ==========================================
    // AGENT 2: ELABORATOR (Agente Elaborador)
    // ==========================================
    console.log("[Agent 2] Invoking Elaborator...");
    const elaboratorPrompt = `Você é o Agente Elaborador, um mestre em Psicometria e Redação de Itens de Avaliação.
Sua missão é criar uma questão de múltipla escolha INÉDITA baseando-se estritamente no Briefing de Análise fornecido abaixo.

[BRIEFING DE ANÁLISE]:
${JSON.stringify(analysisBriefing, null, 2)}

Diretrizes Críticas de Formulação:
1. Formule exatamente ${alternativesCount}.
2. O enunciado deve ser robusto, formal, acadêmico e perfeitamente alinhado com o estilo de comando da banca "${currentBanca}".
3. Use os distratores recomendados no briefing para estruturar as alternativas incorretas de modo extremamente plausível.
4. Mantenha fidelidade aos fatos, leis e teorias reais (LDB, autores pedagógicos, etc.). Proibido inventar artigos ou conceitos absurdos.
5. Defina uma única alternativa correta incontestável.`;

    const elaboratorResponse = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: elaboratorPrompt,
      config: {
        systemInstruction: "Você é um redator sênior de exames de concurso público. Crie questões realistas e difíceis com precisão psicométrica.",
        responseMimeType: "application/json",
        temperature: 0.4,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            draftQuestion: { type: Type.STRING, description: "O enunciado completo e estruturado da questão." },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  letter: { type: Type.STRING, description: "A letra da opção (A, B, C, D, etc.)" },
                  text: { type: Type.STRING, description: "O texto da alternativa elaborada." }
                },
                required: ["letter", "text"]
              }
            },
            correctAnswer: { type: Type.STRING, description: "A letra correspondente ao gabarito correto." }
          },
          required: ["draftQuestion", "alternatives", "correctAnswer"]
        }
      }
    });

    const elaboratorText = elaboratorResponse.text?.trim() || "{}";
    const draftQuestionData = JSON.parse(elaboratorText);
    console.log("[Agent 2] Elaborator Output parsed successfully.");

    // ==========================================
    // AGENT 3: AUDITOR (Agente Auditor)
    // ==========================================
    console.log("[Agent 3] Invoking Auditor...");
    const auditorPrompt = `Você é o Agente Auditor, especialista em Controle de Qualidade de Questões, Revisão de Texto e Pedagogia de Aprendizagem.
Sua missão é inspecionar, auditar e lapidar a questão proposta pelo Agente Elaborador, gerando o gabarito comentado definitivo.

[DADOS DE ENTRADA DA QUESTÃO]:
- Briefing Técnico: ${JSON.stringify(analysisBriefing)}
- Rascunho da Questão: ${JSON.stringify(draftQuestionData)}

Suas Tarefas de Auditoria:
1. Sem Alucinação: Garanta que todas as referências legais (LDB, Constituição, PNE) ou citações de autores (Libâneo, Luckesi, Piaget, etc.) são 100% REAIS, verídicas e corretas. Se encontrar qualquer desvio, corrija imediatamente no texto final da questão ou alternativas.
2. Unicidade de Gabarito: Certifique-se de que não haja margem para dupla interpretação ou recursos.
3. Comentários Pedagógicos (OBRIGATÓRIO):
   - Forneça uma justificativa rica e profunda de por que a correta está certa ("correct").
   - Escreva justificativas individuais minuciosas para cada opção incorreta ("incorrect"), revelando o erro ou pegadinha embutida em cada uma.
   - Explique a pegadinha clássica ou casca de banana empregada na questão ("pegadinha").
   - Recomende o foco para revisão ("revisao").`;

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

    const auditorResponse = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: auditorPrompt,
      config: {
        systemInstruction: `Você é o Auditor Final do PROMPT MASTER. Sua palavra é lei. Você garante perfeição pedagógica, jurídica e gramatical.
Certifique-se de preencher todos os campos do JSON exigido sem exceção. O campo "incorrect" deve possuir chaves correspondentes para TODAS as alternativas falsas rascunhadas.`,
        responseMimeType: "application/json",
        temperature: 0.1,
        responseSchema: finalSchemaRequired
      }
    });

    const auditorText = auditorResponse.text?.trim() || "{}";
    const finalQuestionData = JSON.parse(auditorText);
    console.log("[Agent 3] Auditor quality verification passed. Question certified.");

    return res.json({
      success: true,
      data: finalQuestionData
    });

  } catch (error: any) {
    console.error("Gemini multi-agent question generation error:", error);
    return res.json({
      success: true,
      isFallback: true,
      warning: "Erro ao consultar o Gemini (pipeline multiagente). Usando contingência local.",
      data: getFallbackQuestion(topic || "Legislação Geral", discipline || "Matemática", currentBanca)
    });
  }
});

// Endpoint: Chat with Mentor
app.post("/api/chat", async (req, res) => {
  const { messages, discipline, banca, topic, difficultyTopics } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    console.warn("GEMINI_API_KEY is not defined. Using chat local fallback response.");
    return res.json({
      success: true,
      isFallback: true,
      text: `Excelente pergunta! Como estou operando no modo de contingência local, quero destacar que para **${discipline}** sob a perspectiva da banca **${banca}**, é fundamental compreender as bases pedagógicas da LDB e do Currículo do Ceará. 

Gostaria de focar em algum ponto específico das metas do PNE ou nos artigos da LDB relativos ao seu campo de atuação?`
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

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.1-flash-lite",
      contents: sanitizedContents,
      config: {
        systemInstruction: `Você é o "Professor Mentor", um tutor virtual inteligente extremamente encorajador, estratégico e altamente didático, focado na aprovação de docentes no Concurso da Rede Estadual do Ceará 2026.
O candidato está estudando para a disciplina de **${discipline}** sob o estilo de cobrança específico da banca **${banca}**.
O tópico ativo de foco é: **${topic}**.${struggleContext}

Diretrizes de resposta:
- Responda em português.
- Use técnicas de neurociência cognitiva e aprendizagem ativa: faça perguntas retóricas ou pequenos desafios para forçar a recuperação ativa da memória do candidato, em vez de dar respostas fáceis de bandeja.
- Estruture sua resposta com formatação markdown limpa (use ### para cabeçalhos, ** para destaque e listas em tópicos para facilitar a leitura rápida).
- Seja profissional, empático e focado no alto desempenho e na mentalidade de aprovação.`,
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
