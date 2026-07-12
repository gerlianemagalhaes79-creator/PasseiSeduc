export interface StudyGuide {
  topicName: string;
  subtopics: string[];
  theorySummary: string;
  pitfalls: string;
  references: string;
  strategy: string;
}

export const TOPIC_STUDY_GUIDES: Record<string, StudyGuide> = {
  // --- TEMAS EDUCACIONAIS E PEDAGÓGICOS ---
  "História do pensamento pedagógico brasileiro, teoria da educação e correntes pedagógicas": {
    topicName: "História do pensamento pedagógico brasileiro, teoria da educação e correntes pedagógicas",
    subtopics: [
      "A pedagogia jesuítica e o Ratio Studiorum",
      "As reformas pombalinas e o subsídio literário",
      "Tendências Pedagógicas Liberais (Tradicional, Renovada Diretiva, Renovada Não-Diretiva, Tecnicista)",
      "Tendências Pedagógicas Progressistas (Libertadora, Libertária, Crítico-Social dos Conteúdos)",
      "História da escola pública e as correntes pedagógicas contemporâneas"
    ],
    theorySummary: "A história do pensamento pedagógico brasileiro divide-se principalmente em dois grandes grupos de tendências: as Liberais (que justificam o sistema capitalista vigente, focando no indivíduo) e as Progressistas (que buscam a transformação social através da análise crítica da realidade). Conhecer as diferenças de objetivos, papel da escola, conteúdos, métodos, relação professor-aluno e avaliação de cada uma é o segredo para gabaritar.",
    pitfalls: "A banca costuma confundir o candidato trocando as características da Renovada Não-Diretiva (foco terapêutico, Carl Rogers) com as da Renovada Diretiva (foco na ação, Dewey). Cuidado também com a tendência Crítico-Social dos Conteúdos, que defende a difusão dos conteúdos universais e científicos como ferramenta de emancipação, diferente da Libertadora (Paulo Freire), que foca na alfabetização via temas geradores.",
    references: "Libâneo, J. C. (Didática); Saviani, D. (Escola e Democracia).",
    strategy: "Construa uma tabela comparativa com as 7 principais tendências pedagógicas, preenchendo as colunas: Papel da Escola, Conteúdos, Métodos e Avaliação."
  },
  "Projeto político pedagógico (PPP)": {
    topicName: "Projeto político pedagógico (PPP)",
    subtopics: [
      "Conceito e dimensões do PPP: por que político e por que pedagógico?",
      "Princípios norteadores: igualdade, qualidade, gestão democrática, valorização do magistério e liberdade",
      "Processo de elaboração, execução e avaliação do PPP de forma participativa",
      "O PPP como instrumento de autonomia e identidade da escola pública",
      "A articulação entre escola, família e comunidade local"
    ],
    theorySummary: "O Projeto Político Pedagógico é o documento que define a identidade da escola e indica os caminhos para o ensino e aprendizagem. É Político por formar cidadãos conscientes e ativos, e Pedagógico por organizar as ações educativas. Segundo Veiga, o PPP não deve ser uma gaveta burocrática, mas sim um projeto vivo, construído de forma democrática e participativa por toda a comunidade escolar.",
    pitfalls: "Cuidado com afirmativas que trazem o PPP como um documento rígido elaborado apenas pela equipe gestora (direção/coordenação) ou por consultores externos. O PPP deve ser obrigatoriamente participativo, reflexivo e flexível.",
    references: "Veiga, Ilma Passos Alencastro. 'Projeto Político-Pedagógico da escola: uma construção coletiva'.",
    strategy: "Revise os cinco princípios fundamentais de Veiga para a construção do PPP e responda a questões focando no caráter emancipatório e participativo do documento."
  },
  "A didática, organização do processo didático, planejamento, estratégias, metodologias e avaliação": {
    topicName: "A didática, organização do processo didático, planejamento, estratégias, metodologias e avaliação",
    subtopics: [
      "Didática como teoria do ensino e fundamento epistemológico",
      "Níveis de Planejamento: Plano de Escola, Plano de Ensino e Plano de Aula",
      "Os elementos do planejamento: objetivos, conteúdos, metodologias, recursos e avaliação",
      "Metodologias de ensino: aulas expositivas, trabalhos em grupo, estudo de caso, metodologias ativas",
      "Funções da avaliação: Diagnóstica (início/analítica), Formativa (durante/processual/mediadora) e Somativa (final/classificatória)"
    ],
    theorySummary: "A didática estuda o processo de ensino em sua totalidade, interligando a teoria da aprendizagem à prática de sala de aula. O planejamento organiza essa ação, garantindo a articulação entre objetivos e métodos. A avaliação, por sua vez, deve servir como um termômetro formativo e contínuo para reorientar a prática pedagógica, e não apenas para rotular ou classificar o educando.",
    pitfalls: "A banca adora cobrar as funções da avaliação. Eles associam a avaliação formativa a termos classificatórios ou punitivos, ou afirmam que a diagnóstica serve para atribuir notas. Lembre-se: formativa = processo, melhoria, mediação; somativa = produto, resultado, classificação.",
    references: "Libâneo, José Carlos (Didática); Luckesi, Cipriano (Avaliação da Aprendizagem).",
    strategy: "Crie um fluxograma mostrando a interdependência dos componentes didáticos: como os Objetivos determinam os Conteúdos, que exigem Métodos específicos, avaliados de forma Formativa."
  },
  "A sala de aula como espaço de aprendizagem, interação e fundamento epistemológico do fazer docente": {
    topicName: "A sala de aula como espaço de aprendizagem, interação e fundamento epistemológico do fazer docente",
    subtopics: [
      "A sala de aula como ambiente sociorrelacional e de mediação cultural",
      "Relação professor-aluno: autoridade versus autoritarismo e afetividade",
      "Fundamentos epistemológicos da prática docente: racionalidade técnica, reflexiva e crítica",
      "Indisciplina escolar: causas, reflexões pedagógicas e formas de mediação de conflitos",
      "Novas formas de interação mediadas por tecnologias digitais em sala de aula"
    ],
    theorySummary: "A sala de aula não é neutra; é um espaço socialmente construído repleto de interações cognitivas e socioafetivas. A prática docente fundamenta-se na epistemologia do fazer profissional, superando a mera transmissão técnica para tornar-se uma prática reflexiva sobre a ação cotidiana, onde o conflito é oportunidade de aprendizagem e cidadania.",
    pitfalls: "Cuidado com abordagens meramente punitivas de controle de indisciplina em sala de aula. A pedagogia moderna e as bancas consideram a gestão da sala de aula como processo relacional centrado no diálogo e na corresponsabilidade de regras.",
    references: "Moretto, Vasco Pedro. 'Construtivismo em sala de aula'; Freire, Paulo. 'Pedagogia da Autonomia'.",
    strategy: "Foque em questões que discutam casos práticos de conflitos ou impasses em sala de aula, priorizando soluções cooperativas e de acolhimento reflexivo do docente."
  },
  "Principais teorias da aprendizagem (Inatismo, comportamentalismo, behaviorismo, interacionismo, cognitivismo)": {
    topicName: "Principais teorias da aprendizagem (Inatismo, comportamentalismo, behaviorismo, interacionismo, cognitivismo)",
    subtopics: [
      "Inatismo/Apriorismo: a herança biológica e o desenvolvimento predeterminado",
      "Comportamentalismo/Behaviorismo (Watson, Skinner): estímulo-resposta, reforço positivo e modelagem",
      "Cognitivismo e teorias de processamento de informação",
      "Interacionismo/Construtivismo: a aprendizagem resultante da interação sujeito-objeto",
      "As bases empíricas, metodológicas e epistemológicas que diferenciam cada teoria"
    ],
    theorySummary: "As teorias de aprendizagem explicam como o conhecimento é assimilado. O inatismo crê que nascemos prontos; o empirismo/behaviorismo sustenta que somos uma 'tábula rasa' moldada por estímulos e reforços ambientais; o interacionismo (Piaget/Vygotsky) demonstra que o conhecimento é construído na relação ativa entre o sujeito cognitivo e o meio físico/social.",
    pitfalls: "Não confunda behaviorismo com inatismo. No behaviorismo, o ambiente é tudo (controle externo); no inatismo, o indivíduo já nasce com o potencial determinado (interno). Fique atento aos termos 'estímulo', 'reforço' e 'condicionamento' associados estritamente ao Comportamentalismo.",
    references: "Giusta, Agnela da Silva. 'Concepções de aprendizagem e práticas pedagógicas'.",
    strategy: "Elabore um quadro-resumo com três colunas: Inatismo (hereditariedade), Empirismo/Behaviorismo (meio externo) e Interacionismo (interação sujeito e objeto)."
  },
  "Contribuições de Piaget, Vygotsky e Wallon para a psicologia e pedagogia": {
    topicName: "Contribuições de Piaget, Vygotsky e Wallon para a psicologia e pedagogia",
    subtopics: [
      "Epistemologia Genética de Jean Piaget: assimilação, acomodação, equilibração e estágios",
      "Teoria Sócio-Histórica de Lev Vygotsky: ZDP, mediação simbólica e internalização",
      "Teoria Psicogenética de Henri Wallon: afetividade, inteligência, motricidade e pessoa",
      "Comparações fundamentais entre as teorias do desenvolvimento de Piaget e Vygotsky",
      "Implicações pedagógicas das teorias para a organização da escola pública"
    ],
    theorySummary: "Piaget foca na maturação biológica e na autoconstrução cognitiva através de estágios (sensório-motor, pré-operatório, operatório concreto e operatório formal). Vygotsky enfatiza a mediação social, na qual a aprendizagem impulsiona o desenvolvimento na Zona de Desenvolvimento Proximal (ZDP). Wallon apresenta uma visão holística da criança, destacando o papel da afetividade no desenvolvimento da inteligência.",
    pitfalls: "A banca costuma inverter o papel do desenvolvimento e da aprendizagem: para Piaget, o desenvolvimento biológico determina o limite da aprendizagem; para Vygotsky, a aprendizagem escolar antecipa e impulsiona o desenvolvimento cognitivo do estudante.",
    references: "La Taille, Yves de; Dantas, Heloysa; Oliveira, Marta Kohl de. 'Piaget, Vygotsky, Wallon: teorias psicogenéticas em discussão'.",
    strategy: "Lembre-se da fórmula: Piaget = Sujeito Ativo + Maturação + Equilíbrio; Vygotsky = Mediação + Cultura + ZDP; Wallon = Afetividade + Movimento + Eu Inteiro."
  },
  "Teoria das inteligências múltiplas de Gardner": {
    topicName: "Teoria das inteligências múltiplas de Gardner",
    subtopics: [
      "Crítica ao conceito unilateral de Q.I. (Quociente de Inteligência)",
      "As 8 inteligências de Gardner: linguística, lógico-matemática, espacial, musical, cinestésica, interpessoal, intrapessoal e naturalista",
      "A inteligência existencial (nona inteligência proposta)",
      "Implicações para o planejamento escolar: valorização das múltiplas potencialidades",
      "Avaliação formativa e plural versus avaliações padronizadas unilaterais"
    ],
    theorySummary: "Howard Gardner contestou a visão tradicional de inteligência como uma capacidade única e mensurável por testes lógicos e verbais de Q.I. Ele propõe que o cérebro humano possui múltiplos sistemas cognitivos semi-independentes (inteligências), cada qual responsável por processar tipos de informações e resolver problemas práticos e criativos.",
    pitfalls: "A banca pode afirmar que Gardner reduziu o papel das disciplinas tradicionais ou defendeu a exclusão da matemática. Ao contrário, ele prega metodologias plurais para que o mesmo conteúdo seja ensinado por diferentes caminhos cognitivos.",
    references: "Gardner, Howard. 'Estruturas da Mente: a teoria das inteligências múltiplas'.",
    strategy: "Memorize as inteligências pessoais (intrapessoal = autocompreensão, sentimentos próprios; interpessoal = liderança, empatia com os outros) pois a banca costuma inverter as suas definições."
  },
  "Psicologia do desenvolvimento: aspectos históricos e biopsicossociais": {
    topicName: "Psicologia do desenvolvimento: aspectos históricos e biopsicossociais",
    subtopics: [
      "Conceituação histórica de infância e adolescência nas diferentes sociedades",
      "Aspectos Biológicos: maturação neurológica, alterações hormonais e desenvolvimento motor",
      "Aspectos Cognitivos: transição do pensamento concreto para o abstrato formal",
      "Aspectos Sociais: formação de identidade, grupo de pares e inserção na cultura",
      "O papel protetivo do ambiente escolar no desenvolvimento saudável do jovem"
    ],
    theorySummary: "O desenvolvimento humano é um processo contínuo, dinâmico e multidimensional que ocorre ao longo do ciclo vital. Ele é influenciado por fatores biopsicossociais (genéticos, neurológicos, cognitivos, emocionais, familiares, escolares e socioculturais), exigindo uma escola integradora e sensível às especificidades de cada faixa etária.",
    pitfalls: "Cuidado com visões estritamente deterministas que atribuem o fracasso ou sucesso escolar unicamente a fatores biológicos ou genéticos, esquecendo a influência das mediações pedagógicas e socioeconômicas.",
    references: "Papalia, Diane E. 'Desenvolvimento Humano'; Cole, Michael. 'O Desenvolvimento da Criança'.",
    strategy: "Conecte as fases de transição biológica às necessidades socioafetivas dos estudantes de Ensino Médio, que estão na transição para o pensamento formal abstrato."
  },
  "Temas contemporâneos (bullying, papel da escola, escolha profissional, transtornos alimentares, família, escolhas sexuais)": {
    topicName: "Temas contemporâneos (bullying, papel da escola, escolha profissional, transtornos alimentares, família, escolhas sexuais)",
    subtopics: [
      "Bullying e Cyberbullying: caracterização, prevenção e canais de intervenção pedagógica (Lei nº 13.185/2015)",
      "Vulnerabilidades do adolescente: transtornos alimentares (anorexia, bulimia) e ansiedade",
      "Acolhimento da diversidade de identidades de gênero e escolhas sexuais na escola",
      "Parceria escola-família e a construção de redes de apoio socioemocional",
      "Orientação profissional e o projeto de vida no Ensino Médio"
    ],
    theorySummary: "Os temas transversais contemporâneos representam a conexão necessária entre a teoria escolar e os problemas cotidianos dos estudantes. A promoção da saúde física e mental, o acolhimento respeitoso da diversidade sexual, o combate incansável ao bullying e a estruturação de itinerários profissionais são pilares para a permanência e formação cidadã.",
    pitfalls: "A banca tenta sugerir soluções estritamente criminais ou punitivas unilaterais em casos de bullying ou escolhas sexuais. Lembre-se de que a escola deve atuar primordialmente no campo pedagógico, protetivo, ético e de mediação dialógica.",
    references: "Temas Contemporâneos Transversais da BNCC; Lei Federal nº 13.185/2015.",
    strategy: "Sempre opte por alternativas que privilegiem a inclusão, o diálogo intersetorial, a saúde integral e o respeito às diferenças."
  },
  "Teorias do currículo, acesso, permanência e sucesso do aluno na escola": {
    topicName: "Teorias do currículo, acesso, permanência e sucesso do aluno na escola",
    subtopics: [
      "Teorias Tradicionais do Currículo: eficiência, técnica, objetivos comportamentais, memorização",
      "Teorias Críticas: ideologia, poder, reprodução cultural, classes sociais, currículo oculto",
      "Teorias Pós-Críticas: gênero, sexualidade, etnia, subjetividade, diferença, multiculturalismo",
      "Políticas de Acesso e Democratização da escola pública",
      "Estratégias de permanência e sucesso do educando: combate à evasão e reprovação"
    ],
    theorySummary: "O currículo é um campo de disputa social e política. As teorias Tradicionais focam na técnica e na neutralidade ilusória; as Críticas denunciam a reprodução das desigualdades sociais e o papel do currículo oculto; as Pós-Críticas enfocam o multiculturalismo e as subjetividades. Superar barreiras de exclusão exige um currículo flexível que promova não só o acesso, mas a permanência e o sucesso escolar.",
    pitfalls: "Pegadinha comum: associar o conceito de 'currículo oculto' (atitudes e valores implícitos na vivência escolar) às teorias tradicionais. Ele é um conceito eminentemente formulado pelas teorias Críticas para desmascarar a reprodução do poder dominante.",
    references: "Silva, Tomaz Tadeu da. 'Documentos de Identidade: uma introdução às teorias do currículo'.",
    strategy: "Associe as palavras-chave: Tradicionais = eficiência/conteúdo; Críticas = poder/ideologia/classes; Pós-Críticas = identidade/gênero/diferença."
  },
  "Gestão da aprendizagem, planejamento educacional e avaliação institucional, de desempenho e de aprendizagem": {
    topicName: "Gestão da aprendizagem, planejamento educacional e avaliação institucional, de desempenho e de aprendizagem",
    subtopics: [
      "Gestão da aprendizagem em sala de aula: foco na mediação ativa e recuperação contínua",
      "Avaliação da aprendizagem: características diagnóstica, formativa e somativa",
      "Avaliação de Desempenho Escolar (avaliações externas e de larga escala)",
      "Avaliação Institucional participativa: autoavaliação e avaliação externa da escola",
      "Planejamento educacional estratégico e sua integração com as metas do PPP"
    ],
    theorySummary: "A avaliação deve ser vista sob três prismas complementares. No microssistema, a avaliação da aprendizagem deve ser formativa e reguladora do ensino; no mesossistema, a avaliação institucional permite analisar a gestão global da escola; no macrossistema, a avaliação de desempenho (SAEB, SPAECE) afere a eficácia das políticas educacionais nacionais e estaduais.",
    pitfalls: "A banca costuma distorcer o caráter da avaliação formativa, associando-a a cobranças punitivas, ou dizendo que a autoavaliação institucional substitui integralmente os exames externos (ambas visões se complementam).",
    references: "Luckesi, Cipriano. 'Avaliação da aprendizagem escolar'; Saul, Ana Maria. 'Avaliação Institucional'.",
    strategy: "Estude o caráter processual e integrado do ciclo planejar-avaliar-replanejar. A avaliação diagnóstica, formativa e somativa constituem uma unidade funcional."
  },
  "O Professor: formação, profissão, pesquisa na prática docente e dimensão ética da profissão": {
    topicName: "O Professor: formação, profissão, pesquisa na prática docente e dimensão ética da profissão",
    subtopics: [
      "A formação docente inicial e continuada no cenário contemporâneo",
      "O conceito de 'Professor Reflexivo' e 'Professor Pesquisador' (Donald Schön)",
      "Saberes docentes: saberes da experiência, profissionais, disciplinares e curriculares (Tardif)",
      "Dimensão ética e política do magistério: o compromisso social com a emancipação",
      "Profissionalização, valorização da carreira e saúde mental dos professores"
    ],
    theorySummary: "A docência é uma prática social complexa baseada em saberes plurais e em uma dimensão ética indiscutível. Superando a visão de 'técnico aplicador', o professor atua como pesquisador de sua própria prática por meio da ação-reflexão-ação, mediando saberes curriculares e experiências vitais para formar cidadãos críticos e autônomos.",
    pitfalls: "Pegadinha comum: afirmar que os saberes teóricos acadêmicos são os únicos legítimos para a docência, negligenciando os 'saberes da experiência' cotidianos construídos de forma prática pelos professores e analisados por Tardif.",
    references: "Tardif, Maurice. 'Saberes docentes e formação profissional'; Schön, Donald. 'O profissional reflexivo'.",
    strategy: "Conecte a reflexão de Schön sobre o fazer docente com a necessidade de formação continuada participativa no local de trabalho (a escola)."
  },
  "Aspectos legais e políticos da organização da educação brasileira e políticas para a educação básica": {
    topicName: "Aspectos legais e políticos da organização da educação brasileira e políticas para a educação básica",
    subtopics: [
      "Estrutura federativa e a divisão de encargos educacionais entre os entes da União",
      "Financiamento da Educação Básica e políticas de equalização de oportunidades",
      "Direito público subjetivo à educação básica obrigatória",
      "Políticas públicas de inclusão, diversidade, correção de fluxo e erradicação do analfabetismo",
      "As diretrizes do Conselho Nacional de Educação para a organização curricular"
    ],
    theorySummary: "A organização educacional brasileira estrutura-se sob o regime de colaboração federativo. O direito à educação obrigatória (dos 4 aos 17 anos) é um direito público subjetivo, significando que qualquer cidadão, group ou associação pode acionar o Poder Judiciário para exigir o seu cumprimento, sendo o Estado civil e administrativamente responsável.",
    pitfalls: "Não confunda a obrigatoriedade da Educação Básica (4 a 17 anos) com a totalidade da educação pública (que inclui creches e ensino superior, que possuem regras de universalização ou acesso diferenciadas).",
    references: "Constituição Federal de 1988; LDB Artigo 4º e 5º.",
    strategy: "Memorize o conceito de 'direito público subjetivo' e as responsabilidades dos municípios (infantil e fundamental) e dos estados (fundamental e médio)."
  },
  "Ensino Médio: Diretrizes, Parâmetros Curriculares, currículo, avaliação, interdisciplinaridade e contextualização": {
    topicName: "Ensino Médio: Diretrizes, Parâmetros Curriculares, currículo, avaliação, interdisciplinaridade e contextualização",
    subtopics: [
      "Diretrizes Curriculares Nacionais para o Ensino Médio (DCNEM)",
      "A interdisciplinaridade como diálogo integrador de saberes de diferentes áreas",
      "A contextualização como estratégia para conectar o conteúdo à realidade vivida",
      "Organização curricular por áreas do conhecimento na Formação Geral Básica",
      "Avaliação formativa aplicada às competências do Ensino Médio"
    ],
    theorySummary: "O Ensino Médio deve garantir o desenvolvimento de competências cognitivas e socioemocionais. Seus dois grandes eixos metodológicos são a interdisciplinaridade (que supera a fragmentação disciplinar) e a contextualização (que confere sentido prático e histórico aos conteúdos, aproximando a escola do mundo real do jovem).",
    pitfalls: "Cuidado: a banca costuma confundir interdisciplinaridade (integração e diálogo mútuo entre as disciplinas mantendo suas identidades) com multidisciplinaridade (justaposição de matérias sem relação explícita) ou transdisciplinaridade (completa diluição das fronteiras disciplinares).",
    references: "Diretrizes Curriculares Nacionais para o Ensino Médio; Parâmetros Curriculares Nacionais (PCN).",
    strategy: "Associe interdisciplinaridade ao diálogo de saberes e a contextualização à significação prática e vivência histórica do educando."
  },
  "Ensino Médio Integrado, Educação Inclusiva, transformações do Ensino Médio, protagonismo juvenil e cidadania": {
    topicName: "Ensino Médio Integrado, Educação Inclusiva, transformações do Ensino Médio, protagonismo juvenil e cidadania",
    subtopics: [
      "Conceito de Ensino Médio Integrado: integração entre trabalho, ciência, tecnologia e cultura",
      "Educação Inclusiva no Ensino Médio: adaptações de acessibilidade e Atendimento Especializado",
      "As transformações legais do Novo Ensino Médio (FGB e Itinerários Formativos)",
      "Protagonismo Juvenil e o Projeto de Vida como indutores da escolha consciente",
      "Formação profissional articulada à cidadania ativa na escola pública cearense"
    ],
    theorySummary: "O Ensino Médio Integrado busca a formação humana unilateral de superação da divisão histórica entre trabalho manual e intelectual. Alinhado às diretrizes inclusivas, assegura o atendimento especializado às necessidades dos estudantes. Fortalece o protagonismo juvenil por meio do Projeto de Vida, garantindo que o estudante seja o centro crítico de sua trajetória escolar e social.",
    pitfalls: "Atenção máxima às mudanças recentes na legislação do Novo Ensino Médio, as quais redefiniram limites de horas da Formação Geral Básica (máximo 2.400 horas no total) e tornaram obrigatórias disciplinas essenciais em todos os três anos letivos.",
    references: "Lei Federal nº 13.415/2017 e modificações legais posteriores; Diretrizes de Educação Inclusiva.",
    strategy: "Conecte o conceito de protagonismo juvenil à participação democrática no grêmio estudantil, conselhos de escola e no planejamento coletivo dos itinerários."
  },

  // --- ADMINISTRAÇÃO PÚBLICA ---
  "Conceito de administração pública, servidor público e princípios da administração pública": {
    topicName: "Conceito de administração pública, servidor público e princípios da administração pública",
    subtopics: [
      "Conceitos de Administração Pública em sentido amplo e estrito, formal e material",
      "Agentes públicos e a classificação doutrinária dos servidores públicos",
      "Princípios expressos constitucionais (Art. 37): Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (LIMPE)",
      "Princípios implícitos/infraconstitucionais: Supremacia do Interesse Público, Razoabilidade",
      "Diferença entre cargos públicos efetivos (concurso) e cargos em comissão (livre nomeação)"
    ],
    theorySummary: "A Administração Pública é o conjunto de órgãos, serviços e agentes do Estado destinados à execução das políticas públicas e satisfação das necessidades coletivas. Rege-se estritamente pela legalidade (fazer apenas o que a lei autoriza). Os servidores públicos detêm vínculo estatutário com a administração e ingressam em cargos permanentes após concurso de provas ou provas e títulos.",
    pitfalls: "Lembre-se: o princípio da publicidade não é absoluto. Ele cede diante do interesse social relevante, da segurança do Estado ou em casos de defesa estrita da intimidade dos envolvidos.",
    references: "Constituição Federal de 1988 (Art. 37); Meirelles, Hely Lopes (Direito Administrativo).",
    strategy: "Grave o mnemônico LIMPE e entenda a diferença prática entre impessoalidade (proibições de promoção pessoal de autoridades) e moralidade (ética e boa-fé)."
  },
  "Direitos, deveres e responsabilidade dos servidores públicos": {
    topicName: "Direitos, deveres e responsabilidade dos servidores públicos",
    subtopics: [
      "Direitos Constitucionais do Trabalhador estendidos aos servidores (Art. 39)",
      "Deveres fundamentais do servidor: assiduidade, disciplina, lealdade, obediência",
      "Proibições e condutas vedadas ao funcionalismo público civil",
      "Responsabilidade Tríplice: Penal, Civil e Administrativa (independência de instâncias)",
      "Direito de regresso da Administração Pública contra o servidor em caso de dolo ou culpa"
    ],
    theorySummary: "Os servidores públicos gozam de direitos fundamentais (estabilidade, férias remuneradas, licenças, vencimento digno) e submetem-se a severos deveres funcionais. Caso causem danos a terceiros no exercício de suas funções, o Estado responde objetivamente perante a vítima, mas possui direito de regresso contra o servidor caso reste comprovado dolo (intenção) ou culpa (negligência, imprudência ou imperícia).",
    pitfalls: "A responsabilidade civil, penal e administrativa são independentes entre si e podem ser cumuladas. A absolvição penal apenas repercute na esfera administrativa se negar a existência do fato ou afastar categoricamente a autoria do servidor.",
    references: "Constituição Federal (Art. 37, § 6º e Art. 41); Doutrina de Direito Administrativo Brasileiro.",
    strategy: "Estude o conceito de independência das esferas civil, penal e administrativa. Esta dinâmica é muito cobrada nas cascas de banana das bancas."
  },
  "Estatuto dos Funcionários Públicos Civis do Estado do Ceará (Lei nº 9.826/1974 - Provimento, Direitos, Vantagens e Regime Disciplinar)": {
    topicName: "Estatuto dos Funcionários Públicos Civis do Estado do Ceará (Lei nº 9.826/1974 - Provimento, Direitos, Vantagens e Regime Disciplinar)",
    subtopics: [
      "Formas de Provimento: nomeação (única originária), reintegração, recondução, aproveitamento",
      "Investidura pelo ato de Posse e início do efetivo Exercício com respectivos prazos legais",
      "Direitos funcionais: férias, licenças para tratamento de saúde, maternidade, prêmio",
      "Regime Disciplinar do Ceará: deveres, proibições e gradação de penalidades (repreensão, suspensão, demissão)",
      "O rito do Processo Administrativo Disciplinar (PAD) e Sindicância no âmbito estadual"
    ],
    theorySummary: "A Lei Estadual nº 9.826/1974 dispõe sobre o estatuto dos servidores públicos civis do Ceará. Regula desde o nascimento do vínculo (Nomeação -> Posse -> Exercício) até as penalidades e ritos processuais disciplinares de Sindicância e PAD, que exigem contraditório e ampla defesa sob pena de nulidade absoluta das punições.",
    pitfalls: "Memorize os prazos do estatuto: após nomeado, o prazo para a Posse é de 30 dias (prorrogável por mais 30 se requerido); após a posse, o prazo para entrar em Exercício é de 30 dias (não prorrogável). Trocar esses prazos é a pegadinha favorita das bancas do Ceará.",
    references: "Lei Estadual do Ceará nº 9.826/1974 (Título VI - Regime Disciplinar e Capítulos de Provimento, Direitos e Vantagens).",
    strategy: "Escreva em ordem cronológica o caminho de ingresso e anote os prazos correspondentes a cada ato legal."
  },
  "Estágio Probatório do Servidor Estadual (Leis nº 9.826/1974, nº 13.092/2001, nº 15.744/2014 e nº 15.909/2015)": {
    topicName: "Estágio Probatório do Servidor Estadual (Leis nº 9.826/1974, nº 13.092/2001, nº 15.744/2014 e nº 15.909/2015)",
    subtopics: [
      "O prazo constitucional do Estágio Probatório de 3 anos (36 meses) de efetivo exercício",
      "Fatores de Avaliação Especial de Desempenho: assiduidade, disciplina, produtividade, responsabilidade",
      "A comissão especial de avaliação e os prazos de homologação dos resultados",
      "Regras de suspensão do período avaliativo devido a afastamentos ou licenças específicos",
      "Aquisição da Estabilidade e o rito em caso de reprovação na avaliação de desempenho"
    ],
    theorySummary: "O estágio probatório é o período de avaliação do servidor recém-nomeado. A Constituição Federal estabelece o prazo de 3 anos de efetivo exercício. No Ceará, leis complementares regulamentam a Avaliação Especial de Desempenho (AED), realizada por comissões setoriais com critérios objetivos. Afastamentos decorrentes de licenças específicas suspendem o curso do estágio.",
    pitfalls: "Atenção: embora a redação antiga do estatuto cearense mencionasse 2 anos, a Constituição de 1988 (com alteração da EC 19/98) sobrepôs-se exigindo expressamente 3 anos (36 meses) para a aquisição de estabilidade. As bancas usam leis específicas cearenses atualizadas para testar essa conformidade.",
    references: "Constituição Federal Art. 41; Leis Estaduais do Ceará nº 13.092/2001, nº 15.744/2014 e nº 15.909/2015.",
    strategy: "Conheça os fatores tradicionais avaliados (assiduidade, pontualidade, disciplina, eficiência) e guarde que qualquer licença para tratar de interesses particulares suspende o estágio probatório."
  },
  "Carreira do Magistério (Concurso, provimento, carga horária e jornada - Leis nº 10.884/1984, nº 12.066/1993, nº 14.404/2009)": {
    topicName: "Carreira do Magistério (Concurso, provimento, carga horária e jornada - Leis nº 10.884/1984, nº 12.066/1993, nº 14.404/2009)",
    subtopics: [
      "O Estatuto do Magistério do Ceará e a estruturação da carreira de professor",
      "Exigência de concurso público de provas e títulos para provimento efetivo",
      "Composição da jornada de trabalho do professor: horas de regência versus horas de planejamento (extraclasse)",
      "Afastamentos permitidos para qualificação profissional (Mestrado/Doutorado) e licença sabática",
      "Deveres específicos e infrações administrativas do profissional da educação"
    ],
    theorySummary: "A Lei nº 10.884/1984 instituiu o Estatuto do Magistério Oficial do Ceará. Ela normatiza a carreira docente, dividindo-a em cargos, classes e referências. Regula as jornadas de trabalho típicas de 20h ou 40h semanais, assegurando a reserva constitucional de pelo menos 1/3 da carga horária para atividades extraclasse de planejamento, correção e estudo.",
    pitfalls: "As bancas tentam afirmar que o tempo de planejamento (atividade extraclasse) é discricionário do diretor da escola ou pode ser reduzido sem compensação financeira. Ele é um direito legal irredutível do professor.",
    references: "Lei Estadual do Ceará nº 10.884/1984 e alterações (Lei nº 12.066/1993 e Lei nº 14.404/2009).",
    strategy: "Estude o percentual de 1/3 para atividades de planejamento (estabelecido nacionalmente pela Lei do Piso e incorporado pela Seduc) e como ele se aplica à jornada semanal."
  },
  "Ampliação da carga horária de trabalho do Grupo MAG (Lei nº 15.451/2013 e Decreto nº 31.458/2014)": {
    topicName: "Ampliação da carga horária de trabalho do Grupo MAG (Lei nº 15.451/2013 e Decreto nº 31.458/2014)",
    subtopics: [
      "Critérios e condições para a ampliação temporária da carga horária de 20h para 40h",
      "Processo de ampliação definitiva (incorporação) de carga horária para o professor do Ceará",
      "Requisitos de carência na escola, concordância do docente e avaliação de desempenho favorável",
      "O papel do comitê de controle e o impacto da ampliação na remuneração e na aposentadoria",
      "Cessação da ampliação temporária: hipóteses legais de retorno à jornada original de 20h"
    ],
    theorySummary: "A Lei nº 15.451/2013 regulamenta a ampliação da carga horária de trabalho dos professores estaduais do Ceará (Grupo MAG). Permite a ampliação temporária em caso de carência comprovada na escola de lotação do docente e possibilita, preenchidos requisitos estritos de tempo de efetivo exercício contínuo em ampliação e avaliação especial, a consolidação definitiva dessa carga horária.",
    pitfalls: "Não confunda ampliação temporária (que cessa quando a carência escolar é suprida por concurso ou retorno de licença) com o direito de ampliação definitiva, que exige carência estável na disciplina e tempo de serviço em regime ampliado.",
    references: "Lei Estadual do Ceará nº 15.451/2013 e Decreto Executivo nº 31.458/2014.",
    strategy: "Anote os requisitos de tempo mínimo necessários em regime ampliado temporário para fins de incorporação ou cômputo de benefícios na aposentadoria."
  },
  "Promoção dos profissionais do Grupo MAG (Lei nº 15.901/2015 e Decreto nº 32.103/2016)": {
    topicName: "Promoção dos profissionais do Grupo MAG (Lei nº 15.901/2015 e Decreto nº 32.103/2016)",
    subtopics: [
      "Diferença entre promoção (mudança de classe/nível) e progressão funcional",
      "Promoção por Titulação (elevação de nível baseada em Especialização, Mestrado ou Doutorado)",
      "Promoção por Desempenho e Antiguidade (critérios alternados e avaliação periódica)",
      "Processo de interstício de tempo mínimo exigido para pleitear a promoção no Ceará",
      "O papel das comissões setoriais de avaliação de desempenho e recursos administrativos"
    ],
    theorySummary: "A Lei Estadual nº 15.901/2015 reorganiza o plano de carreiras do Grupo MAG do Ceará. A promoção representa a evolução vertical e horizontal do docente. Ocorre por critérios de titulação acadêmica (sem limite de vagas, concedida ao protocolar o diploma válido) ou por avaliação especial de desempenho e tempo de efetivo exercício, respeitados os interstícios de permanência em cada degrau da carreira.",
    pitfalls: "A banca costuma cobrar a diferença entre promoção por titulação (que independe de vagas ou antiguidade, dependendo apenas do título acadêmico alcançado) e promoção por desempenho (que se submete a limites orçamentários, pontuações e prazos coletivos).",
    references: "Lei Estadual do Ceará nº 15.901/2015 e Decreto Regulamentador nº 32.103/2016.",
    strategy: "Conecte os conceitos de evolução funcional por titulação aos níveis acadêmicos correspondentes: Graduação, Especialização, Mestrado e Doutorado."
  },
  "Sistema Remuneratório dos profissionais MAG (Leis nº 15.243/2012, nº 15.901/2015, nº 16.104/2016, nº 16.513/2018 e nº 16.536/2018)": {
    topicName: "Sistema Remuneratório dos profissionais MAG (Leis nº 15.243/2012, nº 15.901/2015, nº 16.104/2016, nº 16.513/2018 e nº 16.536/2018)",
    subtopics: [
      "Composição do vencimento básico dos professores e gratificações de regência de classe",
      "O Piso Salarial Profissional Nacional e sua aplicação proporcional na tabela salarial do Ceará",
      "Gratificações por titulação (Especialização, Mestrado, Doutorado) acumuladas ou não",
      "Regras de remuneração em regime de Dedicação Exclusiva (D.E.) ou Tempo Integral",
      "Evolução histórica do vencimento do Grupo MAG e as leis de reajuste pecuniário"
    ],
    theorySummary: "O sistema remuneratório dos professores do Ceará é composto pelo Vencimento Básico estruturado em tabelas de classes e níveis, acrescido de vantagens pecuniárias e gratificações específicas. Destacam-se a gratificação por atividade extraclasse ou regência de classe e os adicionais percentuais por qualificação acadêmica (titulação), que estimulam o aperfeiçoamento contínuo.",
    pitfalls: "Fique alerta à proibição de acumulação de gratificações de mesma natureza ou à forma de cálculo dos percentuais de titulação, que incidem diretamente sobre o vencimento básico do cargo ocupado pelo docente.",
    references: "Leis Estaduais do Ceará nº 15.243/2012, nº 15.901/2015, nº 16.104/2016, nº 16.513/2018 e nº 16.536/2018.",
    strategy: "Foque nos direitos e nas gratificações de regência e titulação, lembrando que elas se calculam sobre o vencimento padrão e não sobre o teto do cargo."
  },

  // --- LEGISLAÇÃO BÁSICA DA EDUCAÇÃO ---
  "LDB - Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996 e alterações)": {
    topicName: "LDB - Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996 e alterações)",
    subtopics: [
      "Princípios e fins da educação nacional (Art. 3º) e Dever do Estado (Art. 4º)",
      "Composição dos níveis escolares: Educação Básica e Educação Superior",
      "Incumbências recíprocas da União, Estados, Municípios e Escolas (Art. 8º ao 15)",
      "Docentes: incumbências e participação na elaboração do PPP",
      "Modalidades de Ensino: EJA, Educação Especial, Profissional, Indígena, Quilombola, Bilíngue de Surdos"
    ],
    theorySummary: "A LDB é a principal lei ordinária da educação brasileira. Define que a educação básica é obrigatória e gratuita dos 4 aos 17 anos. Organiza o ano letivo com mínimo de 200 dias de trabalho escolar e 800 horas (ampliado para o Ensino Médio). Garante a gestão democrática do ensino público.",
    pitfalls: "As bancas trocam 'preferencialmente' por 'exclusivamente' ao falar do Atendimento Educacional Especializado regular. Outra pegadinha comum é tentar colocar que os exames finais contam dentro dos 200 dias letivos obrigatórios (vedado pelo artigo 24).",
    references: "Lei Federal nº 9.394/1996 atualizada.",
    strategy: "Escreva cartões de estudo (flashcards) com os princípios do Art. 3º e as incumbências dos docentes descritas no Art. 13 da LDB."
  },
  "ECA - Estatuto da Criança e do Adolescente (Lei nº 8.069/1990 e alterações)": {
    topicName: "ECA - Estatuto da Criança e do Adolescente (Lei nº 8.069/1990 e alterações)",
    subtopics: [
      "Direito à Educação, Cultura, Esporte e Lazer (Arts. 53 a 59)",
      "Dever do Estado de garantir vagas escolares na proximidade da residência dos irmãos",
      "Casos de notificação compulsória ao Conselho Tutelar pelos dirigentes (Art. 56)",
      "Direito de contestar critérios avaliativos e recorrer às instâncias superiores",
      "Medidas protetivas e o papel preventivo da comunidade escolar"
    ],
    theorySummary: "O ECA estabelece os direitos fundamentais das crianças e adolescentes. Na educação, assegura o acesso, a permanência, o respeito mútuo com educadores e a organização em agremiações. Obriga os diretores a notificarem o Conselho Tutelar em casos de maus-tratos, faltas reiteradas/evasão esgotados os recursos da escola, ou altos níveis de repetência.",
    pitfalls: "Uma grande casca de banana das bancas é dizer que a escola deve comunicar o Conselho Tutelar à menor falta do aluno ou em qualquer ocorrência de indisciplina. A lei é clara: esgotados os recursos escolares para as faltas, e apenas repetência elevada, não qualquer repetência.",
    references: "Lei Federal nº 8.069/1990 (Artigos 53 ao 59 e Artigo 56).",
    strategy: "Leia atentamente os incisos do Artigo 56 e guarde a tríade de obrigações de notificação compulsória. Ela despenca em provas de pedagogia."
  },
  "Constituição da República Federativa do Brasil (Artigos 205 a 214 - Da Educação)": {
    topicName: "Constituição da República Federativa do Brasil (Artigos 205 a 214 - Da Educação)",
    subtopics: [
      "A educação como direito de todos e dever do Estado e da Família (Art. 205)",
      "Princípios do Ensino (Art. 206) - Gratuidade, pluralismo, gestão democrática",
      "Dever do Estado: garantias de creches, AEE, transporte, material suplementar",
      "Financiamento da Educação: Vinculação constitucional de impostos na educação",
      "O Plano Nacional de Educação (PNE) plurianual com metas articuladas"
    ],
    theorySummary: "A Constituição estabelece as diretrizes magnas da educação nacional. Fixa o dever do Estado, regulamenta a aplicação mínima obrigatória de impostos (União aplica no mínimo 18% e Estados/Municípios aplicam 25%), e institui a colaboração recíproca dos sistemas de ensino.",
    pitfalls: "A banca adora trocar os percentuais obrigatórios de aplicação (trocando os 18% da União pelos 25% dos Estados e Municípios). Cuidado também ao ler sobre as garantias suplementares (transporte, saúde, alimentação, material): elas destinam-se a todas as etapas da Educação Básica.",
    references: "Constituição Federal de 1988 (Seção I - Da Educação).",
    strategy: "Faça um resumo contendo a divisão de verbas vinculadas à educação, pois é um tema muito cobrado em legislação."
  },
  "Normas da Educação Básica (Emenda nº 53/2006, Lei nº 11.494/2007 e alterações, Lei nº 11.114/2005 e Lei nº 11.274/2006)": {
    topicName: "Normas da Educação Básica (Emenda nº 53/2006, Lei nº 11.494/2007 e alterações, Lei nº 11.114/2005 e Lei nº 11.274/2006)",
    subtopics: [
      "A Emenda Constitucional nº 53/2006 e a instituição histórica do FUNDEB",
      "A Lei nº 11.494/2007 e a regulamentação do fundo nacional de manutenção da educação básica",
      "A implantação do Ensino Fundamental de 9 anos de duração (Leis nº 11.114/2005 e nº 11.274/2006)",
      "Regras de matrícula obrigatória aos 6 anos de idade no Ensino Fundamental",
      "Critérios de distribuição dos recursos vinculados do FUNDEB e valorização do piso"
    ],
    theorySummary: "Estas normas consolidaram marcos essenciais da redemocratização educacional recente. O FUNDEB assegura o financiamento intersetorial equalizador da educação pública; por sua vez, a transição legislativa de 2005 e 2006 reorganizou o Ensino Fundamental para a duração obrigatória de 9 anos, fixando o ingresso compulsório da criança aos 6 anos de idade.",
    pitfalls: "Cuidado ao ler leis antigas sobre o Fundeb. Embora a Lei nº 11.494/2007 tenha sido o marco inicial, o novo Fundeb permanente foi inserido na Constituição pela EC 108/2020 e regulamentado pela Lei nº 14.113/2020, o que anula questões baseadas puramente nas regras de subvinculação originais obsoletas.",
    references: "Leis Federais nº 11.114/2005, nº 11.274/2006, Emenda Constitucional nº 53/2006 e Lei nº 11.494/2007.",
    strategy: "Associe a ampliação do Ensino Fundamental para 9 anos com a inclusão de crianças de 6 anos e as regras de custeio social do FUNDEB."
  },
  "Reforma do Ensino Médio (Lei Federal nº 13.415/2017)": {
    topicName: "Reforma do Ensino Médio (Lei Federal nº 13.415/2017)",
    subtopics: [
      "Alterações na LDB relativas à organização curricular da etapa do Ensino Médio",
      "A ampliação progressiva da carga horária anual mínima para 1.000 horas",
      "A divisão estrutural entre Formação Geral Básica (FGB) e os Itinerários Formativos",
      "Os eixos estruturantes dos itinerários: investigação científica, processos criativos",
      "O reconhecimento do saber notório para profissionais da educação profissional"
    ],
    theorySummary: "A Lei Federal nº 13.415/2017 introduziu a Reforma do Ensino Médio. Ela dividiu o currículo em duas partes: a Formação Geral Básica (alinhada à BNCC) e os Itinerários Formativos (que facultam a escolha do estudante por áreas do conhecimento ou formação técnica e profissional), com foco na flexibilização e autonomia escolar.",
    pitfalls: "Atenção máxima: leis recentes de revisão do Novo Ensino Médio de 2024 limitaram a carga horária da Formação Geral Básica (FGB) em até 2.400 horas, restabelecendo a obrigatoriedade integral de disciplinas clássicas (química, física, biologia, sociologia, filosofia) em todos os anos da etapa.",
    references: "Lei Federal nº 13.415/2017 e respectivas atualizações curriculares nacionais.",
    strategy: "Conecte a estruturação do Novo Ensino Médio com o conceito de flexibilidade curricular e o fomento ao projeto de vida do estudante."
  },
  "Plano Nacional de Educação (Lei nº 13.005/2014) e Plano Estadual de Educação do Ceará (Lei nº 16.025/2016)": {
    topicName: "Plano Nacional de Educação (Lei nº 13.005/2014) e Plano Estadual de Educação do Ceará (Lei nº 16.025/2016)",
    subtopics: [
      "Diretrizes comuns do PNE e do PEE-CE: erradicação do analfabetismo e valorização",
      "Metas de Universalização (Educação Infantil, Fundamental e Ensino Médio)",
      "Estratégias específicas do PEE-CE para a expansão do Ensino Médio em tempo integral no Ceará",
      "Mecanismos de monitoramento contínuo e avaliação periódica das metas",
      "Financiamento educacional local e valorização das carreiras de magistério regionais"
    ],
    theorySummary: "Os planos de educação (PNE e PEE-CE) são instrumentos decenais de planejamento de Estado. No Ceará, o PEE-CE (Lei Estadual nº 16.025/2016) possui metas idênticas e estratégias adaptadas ao território cearense, com forte ênfase na universalização do Ensino Médio (população de 15 a 17 anos) e na expansão vigorosa das escolas estaduais em Tempo Integral.",
    pitfalls: "Bancas gostam de testar se você sabe quais são as instâncias responsáveis por monitorar os planos ou induzir o candidato ao erro alterando os prazos específicos ou percentuais de metas de escolarização do Ceará.",
    references: "Lei Federal nº 13.005/2014; Lei Estadual do Ceará nº 16.025/2016 (PEE-CE).",
    strategy: "Conecte as metas do PEE-CE que focam na formação de professores (Metas 15 e 16) e na expansão do Ensino Médio integral, pois o Ceará é referência nacional nesse modelo."
  },

  // --- LÍNGUA PORTUGUESA ---
  "Compreensão e interpretação de textos e Tipologia textual": {
    topicName: "Compreensão e interpretação de textos e Tipologia textual",
    subtopics: [
      "Diferença entre compreensão (o que está escrito) e interpretação (conclusões fora do texto)",
      "Tipos textuais: Narração, Descrição, Dissertação (Argumentativa e Expositiva), Injunção",
      "Gêneros textuais contemporâneos e suas esferas de circulação social",
      "Ideia central e secundárias, propósitos comunicativos do autor",
      "Coesão textual (mecanismos de referência e substituição) e Coerência semântica"
    ],
    theorySummary: "A leitura proficiente envolve identificar a tipologia textual (como se organiza o texto) e o gênero (qual a sua função comunicativa na sociedade). Compreender é decodificar a informação explícita; interpretar exige inferir intenções implícitas e associar o texto ao seu contexto de produção.",
    pitfalls: "O maior erro em provas é a extrapolação (trazer ideias próprias que não encontram amparo no texto) ou a contradição. Foque sempre na literalidade e nos limites lógicos fornecidos pelas passagens escritas.",
    references: "Koch, Ingedore Villaça. 'A coesão textual' e 'A coerência textual'.",
    strategy: "Sublinhe os conectivos e as palavras-chave do texto durante a leitura inicial. Identifique o tipo predominante (dissertativo-argumentativo é o favorito da FUNECE)."
  },
  "Ortografia oficial e Acentuação gráfica": {
    topicName: "Ortografia oficial e Acentuação gráfica",
    subtopics: [
      "Regras gerais de acentuação: oxítonas, paroxítonas e proparoxítonas",
      "Acentuação de ditongos abertos (éi, ói, éu) e hiatos (i, u)",
      "O uso do hífen em prefixos (regras de letras iguais e diferentes)",
      "Grafia de palavras homônimas, parônimas e expressões problemáticas (porquês, mal/mau, onde/aonde)",
      "Alterações introduzidas pelo Novo Acordo Ortográfico da Língua Portuguesa"
    ],
    theorySummary: "A acentuação gráfica baseia-se na posição da sílaba tônica das palavras. O Novo Acordo Ortográfico retirou acentos de paroxítonas com ditongos abertos (ex: ideia, plateia), de hiatos 'oo' e 'ee' (ex: voo, veem), e o trema. O hífen é usado quando o prefixo termina com a mesma letra que inicia a palavra seguinte (ex: micro-ondas) ou diante de 'h' (ex: super-homem).",
    pitfalls: "A banca adora cobrar palavras que perderam o acento com o novo acordo (como 'heroico', 'ideia', 'voo') tentando convencer o candidato de que ainda mantêm a grafia antiga. Cuidado com o uso do hífen em 'autoescola' (letras diferentes se unem) e 'antissocial' (duplica-se o s).",
    references: "Vocabulário Ortográfico da Língua Portuguesa (VOLP); Manual de Redação Oficial.",
    strategy: "Crie cartões rápidos para memorizar os casos de perda de acento e as 4 regras fundamentais de uso do hífen."
  },
  "Emprego das classes de palavras e Concordância nominal e verbal": {
    topicName: "Emprego das classes de palavras e Concordância nominal e verbal",
    subtopics: [
      "Classes gramaticais: substantivo, adjetivo, pronome, artigo, numeral, verbo, advérbio, conjunção, preposição e interjeição",
      "Concordância Verbal: regras gerais do sujeito simples, composto e orações sem sujeito",
      "Concordância Verbal com verbos impessoais (Haver e Fazer)",
      "Concordância Nominal: adjetivos modificando múltiplos substantivos, expressões como 'é proibido', 'anexo', 'meio', 'bastante'",
      "Substituição pronominal e o valor semântico dos conectivos"
    ],
    theorySummary: "A concordância verbal garante que o verbo concorde em número e pessoa com o seu sujeito. A concordância nominal regula a harmonia entre o substantivo e seus determinantes (adjetivos, artigos, pronomes). Verbos impessoais (Haver no sentido de existir/ocorrer e Fazer indicando tempo decorrido) não possuem sujeito e ficam obrigatoriamente na 3ª pessoa do singular.",
    pitfalls: "A banca explora muito o verbo haver. Eles colocam sentenças longas como 'Houveram muitos incidentes...' tentando enganar pelo plural. O correto é 'Houve muitos incidentes'. Cuidado também com 'anexo' (concorda: as fotos seguem anexas) e 'em anexo' (invariável).",
    references: "Cunha, Celso; Cintra, Lindley. Nova Gramática do Português Contemporâneo.",
    strategy: "Pratique exercícios isolados reescrevendo frases trocando os sujeitos por sujeitos compostos ou substituindo 'existir' por 'haver' para dominar a concordância."
  },
  "Sintaxe da oração e do período e Pontuação": {
    topicName: "Sintaxe da oração e do período e Pontuação",
    subtopics: [
      "Termos integrantes e essenciais da oração: sujeito, predicado, objeto direto, objeto indireto",
      "Termos acessórios da oração: adjunto adnominal, adjunto adverbial, aposto, vocativo",
      "Período Composto por Coordenação (orações assindéticas e sindéticas)",
      "Período Composto por Subordinação (orações substantivas, adjetivas e adverbiais)",
      "Regras de uso da vírgula: enumerações, adjuntos adverbiais deslocados, orações explicativas e vocativos"
    ],
    theorySummary: "A sintaxe analisa a relação estrutural das palavras na oração. A pontuação serve para marcar essas relações sintáticas no papel, e não pausas de respiração. A vírgula é proibida entre os termos essenciais: nunca separa Sujeito de Predicado ou Verbo de seus Objetos diretos/indiretos.",
    pitfalls: "A vírgula separando sujeito de verbo é o erro mais clássico cobrado pelas bancas. Eles colocam sujeitos imensos para tentar confundir o candidato e enfiam uma vírgula antes do verbo. Não caia nessa!",
    references: "Bechara, Evanildo. Moderna Gramática Portuguesa.",
    strategy: "Use períodos complexos, identificando a oração principal e separando as orações coordenadas e subordinadas antes de analisar as vírgulas."
  },
  "Regência nominal e verbal, Emprego do sinal indicativo de crase e Significação das palavras": {
    topicName: "Regência nominal e verbal, Emprego do sinal indicativo de crase e Significação das palavras",
    subtopics: [
      "Regência Verbal: verbos de regência problemática (assistir, aspirar, visar, querer, preferir)",
      "Regência Nominal: nomes que exigem preposições específicas",
      "O fenômeno da Crase: regras gerais de ocorrência (fusão da preposição A com o artigo feminino A)",
      "Casos obrigatórios, proibidos e facultativos de uso da crase",
      "Significação das palavras: sinônimos, antônimos, homônimos, parônimos e figuras de linguagem"
    ],
    theorySummary: "A regência estuda os termos regentes e regidos, determinando o uso correto de preposições. A crase é a contração da preposição 'a' com outro 'a' (artigo ou pronome demonstrativo). Ocorre diante de palavras femininas que exigem o artigo, após verbos que exigem a preposição. É proibida antes de palavras masculinas, verbos, pronomes pessoais e de tratamento.",
    pitfalls: "Fique alerta à regência de verbos como 'assistir' no sentido de ver (exige preposição a: assisti ao jogo) e 'aspirar' no sentido de desejar (exige preposição a: aspiro ao cargo). A crase é facultativa antes de nomes próprios femininos, pronomes possessivos femininos singulares e após a palavra 'até'.",
    references: "Sacconi, Luiz Antonio. Nossa Gramática Teórica e Prática.",
    strategy: "Use o teste prático de substituição para a crase: troque a palavra feminina por uma masculina correspondente; se surgir 'ao', a crase é confirmada (ex: vou à feira / vou ao mercado)."
  },

  // --- LEITURA E INTERPRETAÇÃO DE DADOS ---
  "Leitura de dados e informações de matrícula, taxa de atendimento escolar e escolarização líquida e bruta": {
    topicName: "Leitura de dados e informações de matrícula, taxa de atendimento escolar e escolarização líquida e bruta",
    subtopics: [
      "Análise de dados quantitativos de matrícula e taxas de cobertura",
      "Taxa de Escolarização Bruta versus Taxa de Escolarização Líquida",
      "A taxa de atendimento escolar nas diferentes regiões do Estado do Ceará",
      "Uso de indicadores sociais e demográficos aplicados à gestão das escolas",
      "Resolução de problemas que envolvem taxas de crescimento de matrículas"
    ],
    theorySummary: "Estes indicadores dimensionam a cobertura e a inclusão educacional do Estado. A taxa de escolarização bruta mede a proporção de estudantes matriculados em relação à faixa etária ideal geral; a líquida limita-se estritamente à contagem de educandos na faixa etária correta da etapa. Dados do Censo Escolar revelam a eficiência e gargalos das matrículas.",
    pitfalls: "Não confunda taxa bruta com taxa líquida. A taxa bruta pode ser maior do que 100% (caso haja muitos alunos atrasados em relação à idade ideal), enquanto a taxa líquida nunca ultrapassa 100%.",
    references: "INEP (Metodologias do Censo Escolar); IPECE (Indicadores Sociais do Ceará).",
    strategy: "Aprenda a deduzir a fórmula: Taxa Líquida = Matriculados na idade adequada / População na mesma idade. Taxa Bruta inclui todos na série."
  },
  "Taxa de distorção idade-série e taxas de rendimento (aprovação, reprovação e abandono)": {
    topicName: "Taxa de distorção idade-série e taxas de rendimento (aprovação, reprovação e abandono)",
    subtopics: [
      "Cálculo e interpretação da distorção idade-série (atraso escolar igual ou superior a 2 anos)",
      "Taxas de Rendimento Escolar: aprovação, reprovação e abandono temporário",
      "Impacto do rendimento no fluxo escolar global e na distorção idade-série",
      "Diferença teórica e metodológica entre 'abandono' e 'evasão escolar'",
      "Fatores associados ao fracasso e sucesso na transição entre etapas da educação"
    ],
    theorySummary: "A distorção idade-série indica o percentual de alunos matriculados com idade superior à recomendada para a série (atraso de 2 ou mais anos). As taxas de rendimento medem a eficiência do sistema. O fluxo escolar equilibrado é caracterizado por altos índices de aprovação e baixos índices de reprovação e abandono.",
    pitfalls: "Atenção: o 'abandono' refere-se ao estudante que desiste de frequentar a escola dentro do ano letivo corrente; a 'evasão' é quando o aluno que concluiu ou não o ano anterior deixa de efetuar sua matrícula no ano letivo subsequente.",
    references: "Censo Escolar e Estatísticas de Fluxo Escolar do INEP.",
    strategy: "Sempre observe que a redução da taxa de distorção idade-série é um sinal inequívoco de melhoria no rendimento global e na redução do abandono escolar."
  },
  "Resultados de sistemas de avaliação educacional: SPAECE, SAEB, ENEM, IDEB e PISA": {
    topicName: "Resultados de sistemas de avaliação educacional: SPAECE, SAEB, ENEM, IDEB e PISA",
    subtopics: [
      "SPAECE (Sistema Permanente de Avaliação da Educação Básica do Ceará) e escala de proficiência",
      "SAEB (Sistema de Avaliação da Educação Básica) e avaliação nacional",
      "ENEM (Exame Nacional do Ensino Médio): finalidades e leitura de matrizes de proficiência",
      "IDEB (Índice de Desenvolvimento da Educação Básica): fórmula de cálculo (fluxo x proficiência)",
      "PISA: avaliação comparada internacional de leitura, matemática e ciências"
    ],
    theorySummary: "As avaliações em larga escala produzem dados diagnósticos cruciais. O SPAECE avalia os alunos do Ceará em Língua Portuguesa e Matemática. O IDEB é calculado multiplicando-se a nota média de proficiência nas avaliações do Saeb pela taxa média de aprovação do Censo Escolar, variando de 0 a 10.",
    pitfalls: "Atenção máxima: o IDEB não mede apenas o desempenho em provas (proficiência), ele obrigatoriamente combina o desempenho com o fluxo escolar (aprovação). Uma escola com nota alta no Saeb, mas com altos índices de reprovação, terá seu IDEB reduzido.",
    references: "Seduc Ceará (Diretrizes SPAECE); INEP (Indicadores e Notas do IDEB).",
    strategy: "Escreva a fórmula simples do IDEB: IDEB = Nota do Saeb (proficiência) × Taxa de Aprovação (fluxo). Lembre-se desse binômio para as provas."
  },
  "Interpretação de dados em tabelas, gráficos e mapas, e resolução de problemas envolvendo cálculo de porcentagem": {
    topicName: "Interpretação de dados em tabelas, gráficos e mapas, e resolução de problemas involving cálculo de porcentagem",
    subtopics: [
      "Leitura crítica de dados tabulados e análise de cabeçalhos e fontes de dados",
      "Tipos de gráficos: colunas, barras, setores (pizza), linhas e gráficos de radar",
      "Resolução de problemas matemáticos envolvendo cálculos de porcentagem aplicados a indicadores",
      "Interpretação de infográficos, mapas temáticos educacionais e cartogramas",
      "Taxa de variação e cálculo de aumento ou desconto percentual de dados educacionais"
    ],
    theorySummary: "A interpretação de dados exige atenção aos elementos visuais e textuais que acompanham os dados. O cálculo de porcentagem relaciona partes a um todo de referência de 100 unidades. A análise gráfica permite identificar tendências históricas (gráficos de linha), distribuições (gráficos de setor) e comparações diretas (gráficos de barra/coluna).",
    pitfalls: "As pegadinhas de porcentagem costumam induzir ao erro confundindo o 'ponto percentual' com 'porcentagem de crescimento'. Por exemplo, se uma taxa de atendimento sobe de 10% para 20%, ela cresceu 10 pontos percentuais, mas o aumento relativo foi de 100%.",
    references: "IBGE (Normas de Apresentação Tabular); Estatística Descritiva Básica.",
    strategy: "Sempre identifique o valor base (referência) de qualquer cálculo de porcentagem. Analise as fontes e as escalas dos eixos dos gráficos antes de marcar as alternativas."
  }
};

export function getStudyGuideForTopic(topicName: string, category?: string): StudyGuide {
  // Try to find direct match in TOPIC_STUDY_GUIDES
  const directMatch = TOPIC_STUDY_GUIDES[topicName];
  if (directMatch) {
    return directMatch;
  }

  // Try a partial/case-insensitive match
  const lowerTopic = topicName.toLowerCase();
  for (const key of Object.keys(TOPIC_STUDY_GUIDES)) {
    if (key.toLowerCase() === lowerTopic || key.toLowerCase().includes(lowerTopic) || lowerTopic.includes(key.toLowerCase())) {
      return TOPIC_STUDY_GUIDES[key];
    }
  }

  // Fallback default guide based on category
  let defaultSubtopics = [
    "Principais conceitos e definições do tema",
    "Estudo aprofundado dos eixos norteadores",
    "Metodologias e práticas de resolução de questões",
    "Leitura e análise crítica das diretrizes oficiais"
  ];
  let defaultSummary = `Este guia de estudos foca no tópico "${topicName}". Estude as definições principais deste assunto, seus fundamentos teóricos básicos, e a aplicação prática no dia a dia do magistério do Ceará.`;
  let defaultPitfalls = "As bancas costumam fazer pegadinhas invertendo conceitos correlatos ou trocando nomenclaturas técnicas por termos de senso comum. Fique atento aos termos exatos do edital.";
  let defaultReferences = "Diretrizes Curriculares Nacionais; Bibliografia básica sugerida no Edital Seduc-CE.";
  let defaultStrategy = "Faça resumos esquemáticos (mapas mentais) focados nos eixos estruturantes e pratique exaustivamente com questões anteriores da banca FUNECE.";

  return {
    topicName,
    subtopics: defaultSubtopics,
    theorySummary: defaultSummary,
    pitfalls: defaultPitfalls,
    references: defaultReferences,
    strategy: defaultStrategy
  };
}
