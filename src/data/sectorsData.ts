export interface SectorPoint {
  num: number;
  title: string;
  desc: string;
}

export interface Sector {
  id: string;
  code: number;
  name: string;
  unit: string;
  regime: string;
  requirements: string;
  points: SectorPoint[];
}

export const sectors: Sector[] = [
  {
    id: "matematica",
    code: 29,
    name: "Conhecimentos Específicos: Matemática",
    unit: "Centro de Ciências e Tecnologia - CCT",
    regime: "40h",
    requirements: "Licenciatura em Matemática com Pós-graduação",
    points: [
      { num: 1, title: "Números", desc: "Números inteiros, divisibilidade, números racionais, números irracionais e reais." },
      { num: 2, title: "Funções: Conceitos e Tipos", desc: "Igualdade de funções, determinação do domínio de uma função. Função injetiva, sobrejetiva e bijetiva. Função inversa. Composição de funções. Funções crescentes, decrescentes, pares e ímpares; os zeros e o sinal de uma função." },
      { num: 3, title: "Classes de Funções", desc: "Funções lineares, constantes do 1º e 2º graus, modulares, polinomiais, logarítmicas e exponenciais." },
      { num: 4, title: "Equações", desc: "Desigualdades e inequações algébricas." },
      { num: 5, title: "Geometria", desc: "Geometria plana, espacial e analítica." },
      { num: 6, title: "Trigonometria", desc: "Triângulo retângulo, estudo do seno, cosseno e tangente." },
      { num: 7, title: "Sequências", desc: "Sequências de Fibonacci, sequências numéricas. Progressão aritmética e geométrica." },
      { num: 8, title: "Matrizes e Sistemas", desc: "Determinantes. Sistemas lineares. Análise combinatória. Binômio de Newton." },
      { num: 9, title: "Noções de Estatística", desc: "Medidas de tendência central. Medidas de dispersão, distribuição de frequência. Gráficos e tabelas." },
      { num: 10, title: "Matemática Financeira: Fundamentos", desc: "Proporção, porcentagem, juros e taxas de juros, juro exato e juro comercial, sistemas de capitalização, descontos simples, desconto racional, desconto bancário." },
      { num: 11, title: "Matemática Financeira: Aplicações", desc: "Taxa efetiva, equivalência de capitais." },
      { num: 12, title: "Cálculo de Probabilidade", desc: "Espaço amostral, probabilidade condicional, eventos independentes e teoremas de probabilidade." },
      { num: 13, title: "Números Complexos", desc: "Forma algébrica, trigonométrica, operações com complexos e raízes." },
      { num: 14, title: "Cálculo Diferencial e Integral", desc: "Cálculo diferencial e integral das funções de uma variável." },
      { num: 15, title: "Ensino de Matemática: Didática", desc: "Noções de história da Matemática. Avaliação e educação matemática: formas e instrumentos. Transposição didática. Uso de material concreto e aplicativos digitais." },
      { num: 16, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a disciplina de Matemática." }
    ]
  },
  {
    id: "arte-educacao",
    code: 15,
    name: "Conhecimentos Específicos: Arte-Educação",
    unit: "Centro de Humanidades - CH",
    regime: "40h",
    requirements: "Graduação em Arte / Educação Artística com Pós-graduação",
    points: [
      { num: 1, title: "A Arte na Educação para todos", desc: "Diretrizes legais e parâmetros curriculares sob a LDB/PCN/RCB." },
      { num: 2, title: "Fundamentos e Tendências Pedagógicas", desc: "Fundamentos e tendências pedagógicas do ensino de Arte no Brasil." },
      { num: 3, title: "A Arte e Cidadania", desc: "A arte e o processo de construção da cidadania." },
      { num: 4, title: "As Diversas Linguagens Artísticas", desc: "Estudo das diversas linguagens artísticas; Estética - conceitos e contextos." },
      { num: 5, title: "Cultura Popular e Manifestações Populares", desc: "Aspectos da cultura popular brasileira e as manifestações populares: formação histórica, multiculturalismo." },
      { num: 6, title: "A Arte da Pré-História Brasileira e Cearense", desc: "Histórico rupestre local, Arte Indígena (6.1) e Arte Africana (6.2)." },
      { num: 7, title: "As Artes Visuais no Brasil e no Ceará", desc: "Evolução histórica do barroco colonial brasileiro aos dias atuais." },
      { num: 8, title: "As Artes Audiovisuais", desc: "Linguagens da TV, cinema, fotografia, multimídia - novos recursos/novas linguagens." },
      { num: 9, title: "A Música no Brasil e Contribuição Cearense", desc: "A música no Brasil e a contribuição cearense, partindo do período colonial aos nossos dias." },
      { num: 10, title: "O Teatro no Brasil e no Ceará", desc: "O teatro no Brasil e no Ceará: história e movimentos." },
      { num: 11, title: "A Dança no Brasil e no Ceará", desc: "A dança no Brasil e no Ceará: dramática e folclórica, popular e erudita." },
      { num: 12, title: "Principais Movimentos Artísticos do Século XX", desc: "Principais movimentos artísticos do século XX no Brasil." },
      { num: 13, title: "Lei nº 11.769/2009", desc: "Lei n° 11.769/2009 - Ensino e aprendizagem da Música na Escola." },
      { num: 14, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a Disciplina de Arte." }
    ]
  },
  {
    id: "biologia",
    code: 60,
    name: "Conhecimentos Específicos: Biologia",
    unit: "Centro de Ciências da Saúde - CCS",
    regime: "40h",
    requirements: "Licenciatura ou Bacharelado em Ciências Biológicas com Pós-graduação",
    points: [
      { num: 1, title: "Identidade dos Seres Vivos", desc: "Aspectos físicos, químicos e estruturais da célula. Organelas. Organização celular: seres procariontes, eucariontes e sem organização celular. Funções celulares: síntese, transporte, eliminação de substâncias e processos de obtenção de energia (fermentação, fotossíntese e respiração celular). Ciclo celular." },
      { num: 2, title: "Noções Básicas de Microscopia", desc: "Princípios de microscopia e sua utilização prática e didática." },
      { num: 3, title: "Origem e Evolução da Vida", desc: "Hipóteses sobre a origem da vida. Teoria de Lamarck e teoria de Darwin. Origem do homem." },
      { num: 4, title: "Diversidade da Vida", desc: "Principais características dos representantes de cada domínio e de cada reino da natureza. Regras de nomenclatura. Biodiversidade no planeta e no Brasil." },
      { num: 5, title: "Características Anatômicas e Fisiológicas do Homem", desc: "Fisiologia dos sistemas biológicos (digestório, respiratório, cardiovascular, urinário, nervoso, endócrino, imunológico, reprodutor e locomotor)." },
      { num: 6, title: "Transmissão da Vida: Hereditariedade", desc: "Fundamentos da hereditariedade: gene e código genético, cálculos com probabilidade. Primeira e segunda leis de Mendel." },
      { num: 7, title: "Transmissão da Vida: Engenharia Genética", desc: "Aplicações da engenharia genética: clonagem, transgênicos." },
      { num: 8, title: "Interação Entre os Seres Vivos", desc: "Conceitos básicos em ecologia. Relações tróficas (cadeias e teias alimentares; distribuição natural da matéria e da energia e concentração de pesticidas e de subprodutos radiativos). Relações ecológicas limitadoras do crescimento populacional. Ecossistemas do Brasil." },
      { num: 10, title: "Ensino de Biologia: Metodologias", desc: "Ensino de Biologia: conhecimento científico e habilidade didática no ensino de Biologia. A construção do conhecimento no ensino de Biologia: abordagens metodológicas." },
      { num: 11, title: "Recursos Didáticos no Ensino de Biologia", desc: "Recursos didáticos utilizados em sala de aula e laboratório, incluindo conhecimentos básicos de técnicas, materiais e normas de segurança laboratoriais." },
      { num: 12, title: "O Ensino de Biologia e Novas Tecnologias", desc: "O ensino de Biologia e as novas tecnologias da informação e comunicação." },
      { num: 13, title: "Avaliação de Aprendizagem", desc: "Avaliação de aprendizagem do conhecimento biológico." },
      { num: 14, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a Disciplina de Biologia." }
    ]
  },
  {
    id: "educacao-fisica",
    code: 22,
    name: "Conhecimentos Específicos: Educação Física",
    unit: "Centro de Educação - CED",
    regime: "40h",
    requirements: "Licenciatura em Educação Física com Pós-graduação",
    points: [
      { num: 1, title: "Histórico da Educação Física", desc: "Evolução histórica da Educação Física escolar e social." },
      { num: 2, title: "Educação Física enquanto Linguagem", desc: "O movimento humano como expressão corporal de linguagem." },
      { num: 3, title: "Processo Ensino-Aprendizagem", desc: "Abordagens didático-pedagógicas aplicadas no ensino escolar." },
      { num: 4, title: "Construindo Competências e Habilidades", desc: "Habilidades psicomotoras e competências cognitivo-afetivas na escola." },
      { num: 5, title: "Avaliação em Educação Física", desc: "Formatos de avaliação qualitativos e de progresso motor." },
      { num: 6, title: "Educação Física e Sociedade", desc: "Interação sociocultural, inclusão, gênero e diversidade corporal." },
      { num: 7, title: "Fundamentos Didático-Pedagógicos", desc: "Bases teóricas da prática pedagógica em Educação Física." },
      { num: 8, title: "Atividade Física e Saúde", desc: "Saúde, qualidade de vida, sedentarismo e promoção de hábitos ativos." },
      { num: 9, title: "Crescimento e Desenvolvimento", desc: "Crescimento e desenvolvimento físico infantil e adolescente." },
      { num: 10, title: "Aspectos da Aprendizagem Motora", desc: "Estágios de aprendizagem, controle motor e retenção de habilidades." },
      { num: 11, title: "Aspectos Sócio-Históricos da Educação Física", desc: "Origem das modalidades, ginásticas, lutas e esportivização." },
      { num: 12, title: "Política Educacional e Educação Física", desc: "Legislação educacional nacional e o papel do componente curricular." },
      { num: 13, title: "Cultura e Educação Física", desc: "O patrimônio da cultura corporal de movimento: danças, jogos e lazer." },
      { num: 14, title: "Competição e Cooperação Escolar", desc: "Aspectos da competição e cooperação no cenário escolar." },
      { num: 15, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a Disciplina de Educação Física." }
    ]
  },
  {
    id: "filosofia",
    code: 18,
    name: "Conhecimentos Específicos: Filosofia",
    unit: "Centro de Humanidades - CH",
    regime: "40h",
    requirements: "Licenciatura em Filosofia com Pós-graduação",
    points: [
      { num: 1, title: "A Emergência da Filosofia Grega", desc: "Filosofia e a cidade. Filosofia e a democracia. Filosofia e a universalização da palavra. Filosofia, verdade e argumentação." },
      { num: 2, title: "Conhecimentos Tradicionais", desc: "Filosofia e os conhecimentos tradicionais (narrativas/mitos). Filosofia e a consciência cotidiana. Filosofia, a arte e as ciências." },
      { num: 3, title: "Filosofia e Ação: Ética e Moral", desc: "Moral, ética e política. Filosofia, ética e felicidade (Platão, Aristóteles, Agostinho de Hipona e Spinoza). Ética, autonomia da razão e dignidade (Kant). Crítica e genealogia da moral (Nietzsche). Contextualização histórica dessas questões e principais argumentos." },
      { num: 4, title: "Filosofia e Conhecimento Científico", desc: "Racionalismo (Descartes) e empirismo (Bacon). Filosofia, Ciência e técnica (Descartes, Bacon). Filosofia e crítica da técnica (Heidegger, Benjamin). Contextualização histórica dessas questões e principais argumentos." },
      { num: 5, title: "Filosofia e Experiência Estética", desc: "Arte e absoluto (Hegel), arte e afirmação da vida (Nietzsche). Arte e sentido (Heidegger e Gadamer). Arte e capitalismo (Benjamin, Adorno e Horkheimer). Contextualização histórica dessas questões e principais argumentos." },
      { num: 6, title: "Ensino de Filosofia: Determinações Legais", desc: "Ensino de Filosofia no Ensino Médio: determinações legais nacionais e marcos estruturais." },
      { num: 7, title: "Reflexões Acerca do Ensino de Filosofia", desc: "Ensino de Filosofia e interdisciplinaridade. Estratégias didáticas e a seleção de conteúdos curriculares." },
      { num: 8, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a Disciplina de Filosofia." }
    ]
  },
  {
    id: "fisica",
    code: 45,
    name: "Conhecimentos Específicos: Física",
    unit: "Centro de Ciências e Tecnologia - CCT",
    regime: "40h",
    requirements: "Licenciatura ou Bacharelado em Física com Pós-graduação",
    points: [
      { num: 1, title: "História e Evolução das Ideias da Física", desc: "Cosmologia antiga. Física de Aristóteles. Origens da mecânica. Surgimento da teoria da relatividade e da teoria quântica." },
      { num: 2, title: "Mecânica: Cinemática e Dinâmica", desc: "Cinemática escalar e vetorial. Movimento circular. Leis de Newton e suas aplicações. Trabalho. Potência." },
      { num: 3, title: "Mecânica: Conservação e Fluidos", desc: "Energia, conservação e suas transformações, impulso. Quantidade de movimento, conservação da quantidade de movimento. Gravitação universal. Estática dos corpos rígidos. Estática dos fluidos. Princípios de Pascal, Arquimedes e Stevin." },
      { num: 4, title: "Termodinâmica: Calor e Estados", desc: "Calor e temperatura. Temperatura e dilatação térmica. Calor específico. Trocas de calor. Mudança de fase e diagramas de fases. Propagação do calor." },
      { num: 5, title: "Termodinâmica: Teoria dos Gases e Leis", desc: "Teoria cinética dos gases. Energia interna. Lei de Joule. Transformações gasosas. Leis da termodinâmica: entropia e entalpia. Máquinas térmicas. Ciclo de Carnot." },
      { num: 6, title: "Eletromagnetismo: Eletricidade e Circuitos", desc: "Introdução à eletricidade. Campo elétrico. Lei de Gauss. Potencial elétrico. Corrente elétrica. Potência elétrica e resistores. Circuitos elétricos." },
      { num: 7, title: "Eletromagnetismo: Campo Magnético e Radiação", desc: "Campo magnético. Lei de Ampère. Lei de Faraday. Propriedades elétricas e magnéticas dos materiais. Equações de Maxwell. Radiação." },
      { num: 8, title: "Ondulatória e Fenômenos", desc: "Movimento harmônico simples. Oscilações livres, amortecidas e forçadas. Ondas. Ondas sonoras e eletromagnéticas. Frequências naturais e ressonância." },
      { num: 9, title: "Ótica Geométrica e Física", desc: "Ótica geométrica: reflexão e refração da luz. Instrumentos ópticos - características e aplicações. Ótica Física: interferência; difração; polarização." },
      { num: 10, title: "Física Moderna", desc: "Introdução a Relatividade Especial, transformação de Lorentz. Equivalência Massa-Energia. Natureza ondulatória-corpuscular da matéria. Teoria quântica da matéria e da radiação. Modelo do átomo de hidrogênio. Núcleo atômico. Energia nuclear, relatividade geral." },
      { num: 11, title: "Ensino de Física e Competências", desc: "Conhecimento científico e habilidade didática. Construção do conhecimento: abordagens metodológicas. Recursos didáticos (sala/laboratório, técnicas, segurança). Novas tecnologias da informação. Avaliação. Competências do PCN-EM." }
    ]
  },
  {
    id: "geografia",
    code: 6,
    name: "Conhecimentos Específicos: Geografia",
    unit: "Faculdade de Educação do Sertão Central - FECLESC",
    regime: "40h",
    requirements: "Licenciatura ou Bacharelado em Geografia com Pós-graduação",
    points: [
      { num: 1, title: "Concepções do Pensamento Geográfico", desc: "Concepções do pensamento geográfico e sua influência no ensino da Geografia. Sociedade, lugar e paisagem no ensino da Geografia. Currículo: cultura e territorialidade no ensino da Geografia. Novas abordagens teóricas e metodológicas. Novas tecnologias. Aspectos avaliativos." },
      { num: 2, title: "Geopolítica e Geografia Econômica", desc: "O espaço como produto do homem. Capitalismo; Desenvolvimento e subdesenvolvimento. Economia do pós-guerra. O Brasil, a nova ordem mundial e a globalização. O comércio internacional. O MERCOSUL. A economia mundial e do Brasil. O problema da dívida externa. Energia e transporte. A agropecuária. O comércio. A indústria. Os serviços. Relações de trabalho, desigualdades sociais e exploração humana. A revolução técnico-científica." },
      { num: 3, title: "Geografia da População", desc: "A população e as formas de ocupação do espaço. Os contrastes regionais do Brasil. Urbanização e metropolização." },
      { num: 4, title: "Ecologia e Políticas Ambientais", desc: "Ecossistemas naturais. Impactos ambientais. Recursos naturais e devastação histórica. Política ambiental." },
      { num: 5, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a disciplina de Geografia." }
    ]
  },
  {
    id: "historia",
    code: 73,
    name: "Conhecimentos Específicos: História",
    unit: "Faculdade de Educação de Crateús - FAEC",
    regime: "40h",
    requirements: "Licenciatura ou Bacharelado em História com Pós-graduação",
    points: [
      { num: 1, title: "Pensamento Histórico e Ensino de História", desc: "Concepções do pensamento histórico, a dinâmica historiográfica e sua influência no ensino: Memória, oralidade, cotidiano, currículo, cultura, gênero, direitos humanos, meio ambiente, história local, diversidade étnico-racial, abordagens teóricas, novas tecnologias e avaliação." },
      { num: 2, title: "Pré-História e Antiguidade", desc: "História Natural e História Social. O processo de humanização e a dinâmica da formação das sociedades humanas na Pré-história. Organização sócio-política, econômica, cultural e religiosa do Egito, Núbia, Kush, Méroe, Napata, Mesopotâmia, Palestina, Fenícia, Pérsia, Grécia e Roma, sua dinâmica, relações, rupturas e transformações." },
      { num: 3, title: "Sociedade Medieval (V ao XV)", desc: "A organização sócio-política, econômica, cultural e religiosa da sociedade europeia do século V ao XV. A Cristianização da Europa. A sociedade Oriental, o Islamismo e a islamização da Arábia e África. Os reinos africanos no século V ao XV." },
      { num: 4, title: "Idade Moderna (XV ao XVIII)", desc: "Dinâmica, relações, rupturas e transformações da sociedade europeia do século XV ao XVIII. As civilizações e organizações políticas pré-coloniais (Mali, Congo e Zimbabwe). Escravidão e diáspora dos povos africanos." },
      { num: 5, title: "Idade Contemporânea (XVIII aos dias atuais)", desc: "Dinâmica, relações, rupturas e transformações da sociedade europeia, americana, africana e asiática do século XVIII à contemporaneidade." },
      { num: 6, title: "Brasil e Ceará Colonial e Império", desc: "Dinâmica, relações, rupturas e transformações no Brasil e Ceará Colonial. Escravidão e resistência. Tecnologias de agricultura, cultivo, mineração e edificações trazidas pelos escravizados, produções científicas/artísticas (artes plásticas, literatura, música, dança, teatro) e política. Cultura e religiosidade. Movimento de independência. Organização no Império (1º e 2º Reinado e participação do Ceará). Revoluções sociais (Cabanagem, Balaiada, Farroupilha, Sabinada, Malês, Quebra Quilo, Abolição e República)." },
      { num: 7, title: "Brasil e Ceará Republicano e Atualidades", desc: "Dinâmica, relações, rupturas e transformações da organização sócio-política, econômica e cultural no Brasil e Ceará na República. Atualidades." },
      { num: 8, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a disciplina de História." }
    ]
  },
  {
    id: "libras",
    code: 12,
    name: "Conhecimentos Específicos: Libras",
    unit: "Centro de Humanidades - CH",
    regime: "40h",
    requirements: "Licenciatura em Letras Libras com Pós-graduação",
    points: [
      { num: 1, title: "Educação de Surdos: História e Teorias", desc: "Educação de surdos: história e teorias educacionais norteadoras." },
      { num: 2, title: "Identidades e Cultura Surda", desc: "Identidades e cultura surda, comunidade, representações e aspectos socioculturais." },
      { num: 3, title: "Políticas Educacionais e Processos Inclusivos", desc: "Políticas educacionais para surdos e processos inclusivos na educação básica." },
      { num: 4, title: "Fonologia da Libras", desc: "Fonologia e Língua Brasileira de Sinais: configurações de mão, ponto de articulação, movimento e expressões não manuais." },
      { num: 5, title: "Morfologia da Libras", desc: "Morfologia e Língua Brasileira de Sinais: formação de sinais, morfemas e classificadores." },
      { num: 6, title: "Sintaxe da Libras", desc: "Sintaxe e Língua Brasileira de Sinais: ordem frasal, tipos de frases e concordância verbal no espaço." },
      { num: 7, title: "Semântica e Pragmática", desc: "Semântica e pragmática e Língua Brasileira de Sinais: estudo da significação e uso em contextos discursivos." },
      { num: 8, title: "Ensino de Libras como Primeira Língua", desc: "Ensino da Língua Brasileira de Sinais como primeira língua (L1)." },
      { num: 9, title: "Ensino de Libras como Segunda Língua", desc: "Ensino da Língua Brasileira de Sinais como segunda língua (L2)." }
    ]
  },
  {
    id: "espanhol",
    code: 34,
    name: "Conhecimentos Específicos: Língua Espanhola",
    unit: "Centro de Humanidades - CH",
    regime: "40h",
    requirements: "Licenciatura em Letras Espanhol com Pós-graduação",
    points: [
      { num: 1, title: "Leitura e Compreensão de Textos", desc: "Leitura e compreensão de textos em Língua Espanhola considerando os diversos gêneros textuais." },
      { num: 2, title: "Tendências Pedagógicas", desc: "Tendências pedagógicas sobre o ensino de Língua Espanhola: abordagem da linguagem sob novos enfoques." },
      { num: 3, title: "Estratégias de Leitura", desc: "Uso e domínio das estratégias de leitura (skimming, scanning, prediction e outras). Compreensão geral do texto. Reconhecimento de informações específicas. Inferência e predição. Palavras cognatas e falsos cognatos." },
      { num: 4, title: "Vocabulário", desc: "Vocabulário: domínio de vocabulário compatível com a interpretação de texto dentro do conteúdo exigido." },
      { num: 5, title: "Aspectos Linguísticos e Gramaticais I", desc: "El alfabeto gráfico y oral. Artículos. Pronombres personales y de tratamiento. Presente de indicativo: ser, estar y tener. Adjetivos posesivos. Contracciones. Combinaciones. Perífrasis de futuro. Los numerales." },
      { num: 6, title: "Aspectos Linguísticos e Gramaticais II", desc: "El artículo neutro LO. Adverbios y expresiones de tiempo. Verbos. Pronombres demostrativos. Adverbios y pronombres interrogativos. Formación del plural. Lugares (establecimientos comerciales) y medios de transporte. La familia. Los colores. Objetos variados." },
      { num: 7, title: "Divergências Léxicas", desc: "Divergências léxicas (heterosemánticos, heterotónicos, heterogenéricos)." },
      { num: 8, title: "Apócope", desc: "Conceito, classificação e aplicação prática da apócope na Língua Espanhola." },
      { num: 9, title: "Relação entre Língua, Cultura e Sociedade", desc: "Língua, cultura e sociedade na formação linguística do estudante." },
      { num: 10, title: "Tratamento da Produção Escrita", desc: "O tratamento da produção escrita como processo (revisão/correção e reescrita)." },
      { num: 11, title: "Compreensão de Literatura e Avaliação", desc: "Compreensão de textos de autores modernos e/ou contemporâneos. Avaliação no ensino e aprendizagem da Língua Espanhola na educação básica." },
      { num: 12, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a disciplina de Língua Espanhola." }
    ]
  },
  {
    id: "ingles",
    code: 35,
    name: "Conhecimentos Específicos: Língua Inglesa",
    unit: "Centro de Humanidades - CH",
    regime: "40h",
    requirements: "Licenciatura em Letras Inglês com Pós-graduação",
    points: [
      { num: 1, title: "Leitura e Compreensão de Textos", desc: "Leitura e compreensão de textos em Língua Inglesa considerando os diversos gêneros textuais." },
      { num: 2, title: "Tendências Pedagógicas", desc: "Tendências pedagógicas do ensino de Língua Inglesa: abordagem da linguagem sob novos enfoques." },
      { num: 3, title: "Estratégias de Leitura", desc: "Uso e domínio das estratégias de leitura (skimming, scanning, prediction e outras). Compreensão geral do texto. Reconhecimento de informações específicas. Inferência e predição. Palavras cognatas e falsos cognatos, entre outros." },
      { num: 4, title: "Vocabulário", desc: "Vocabulário. Domínio de vocabulário compatível com a interpretação de texto, dentro do conteúdo exigido." },
      { num: 5, title: "Aspectos Linguísticos e Gramaticais I", desc: "Conhecimento dos tempos e modos verbais. Verb 'to be'. Regular/irregular verbs (simple present and simple past). Present and past continuous. Present and past perfect. Present perfect continuous. Future tense: will. Going to - nas diversas formas (afirmativa, negativa e interrogativa)." },
      { num: 6, title: "Aspectos Linguísticos e Gramaticais II", desc: "Imperative. Modals: can, could, should, must, have, may. Passive voice. Uso de preposições e conjunções. Formação e classe de palavras. Pronomes: personal pronouns (object pronouns, subject pronouns). Possessive pronouns. Possessive adjectives. Relative clauses: who/that/which/whose/whom/where. Comparatives and superlatives. Possessive case." },
      { num: 7, title: "Língua, Cultura, Escrita e Avaliação", desc: "Relação entre língua, cultura e sociedade. O tratamento da produção escrita como processo (revisão/correção e reescrita). Compreensão de textos de autores modernos e/ou contemporâneos. Avaliação no ensino e aprendizagem da Língua Inglesa na Educação Básica." },
      { num: 8, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a disciplina de Língua Inglesa." }
    ]
  },
  {
    id: "portugues",
    code: 42,
    name: "Conhecimentos Específicos: Língua Portuguesa",
    unit: "Centro de Humanidades - CH",
    regime: "40h",
    requirements: "Licenciatura em Letras Português com Pós-graduação",
    points: [
      { num: 1, title: "Teoria Literária, Barroco e Arcadismo", desc: "Relações contextuais e intertextuais entre gêneros, épocas e mídias. Elementos da teoria literária. Barroco no Brasil (Gregório de Matos Guerra, problemas sociais, contexto). Arcadismo no Brasil (Inconfidência Mineira, transição pré-romântica)." },
      { num: 2, title: "Romantismo, Realismo, Naturalismo e Simbolismo", desc: "Romantismo no Brasil (Burguesia, estereótipos). Autores realistas-naturalistas (comportamento, contexto). Estrutura, temas parnasianos. Simbolismo no Brasil (Cruz e Souza, Alphonsus de Guimaraens, transcendental e imaginação)." },
      { num: 3, title: "Modernismo, Pós-Modernismo e Aspectos Étnicos", desc: "Revolução artística do início do século XX e Pré-Modernismo. Vanguardas Europeias. Trajetória modernista (primeira, segunda e terceira gerações, poesia e prosa). Problemática do pós-moderno. Influências étnicas na literatura brasileira (cultura africana e indígena nas obras)." },
      { num: 4, title: "Compreensão Literal e Relações de Coerência", desc: "Compreensão literal. Relações de coerência: ideia principal, detalhes de apoio, causa e efeito, sequência temporal e espacial, comparação e contraste." },
      { num: 5, title: "Relações Coesivas e Semântica", desc: "Coesão: referência, substituição, elipse e repetição. Indícios contextuais. Relações de sentido entre palavras: Sinonímia/antonímia, hiperonímia/hiponímia, Campo semântico." },
      { num: 6, title: "Compreensão Interpretativa e Retórica", desc: "Compreensão textual versus interpretação. Propósito do autor. Informações implícitas. Fato e opinião. Organização retórica: generalização, exemplificação, descrição, definição, classificação e elaboração. Seleção de Inferência: compreensão crítica." },
      { num: 7, title: "Análise Linguística: Estrutura da Frase", desc: "Recursos estilísticos e estruturais, convenções da escrita. Fatores de relevância: coerência e coesão. Estrutura da frase: modos de construção de orações segundo diferentes perspectivas de ordenação, aspectos semânticos. Significação e valor do vocábulo no texto." },
      { num: 8, title: "Análise Linguística: Concordância, Regência e Colocação", desc: "Concordância, regência e colocação como fatores de modificação e geração de sentido do texto." },
      { num: 9, title: "Análise Linguística: Estruturas Morfossintáticas", desc: "Uso de estruturas verbais e nominais (pronomes, conjunções, preposições, etc). Descrição linguística aplicada ao texto: orações, sintagmas, palavras, morfemas." },
      { num: 10, title: "Variação, Gêneros Textuais e Tecnologias", desc: "Variação e preconceito linguístico. Gêneros Textuais: identificação, função social, confrontação de semelhanças/diferenças. Tecnologias da comunicação no ensino da Língua Portuguesa (hipertexto, condições de textualidade, linguagem virtual e semiótica). PCN-EM de Língua Portuguesa." }
    ]
  },
  {
    id: "quimica",
    code: 50,
    name: "Conhecimentos Específicos: Química",
    unit: "Centro de Ciências e Tecnologia - CCT",
    regime: "40h",
    requirements: "Licenciatura ou Bacharelado em Química com Pós-graduação",
    points: [
      { num: 1, title: "História da Química", desc: "A Alquimia como precursora da ciência Química, o nascimento da Química moderna, Química e sociedade." },
      { num: 2, title: "O Mundo e Suas Transformações", desc: "Leis ponderais (Lavoisier, Proust, Dalton, Richter). Leis das reações gasosas de Gay-Lussac. Hipótese de Avogadro, mol, molécula. Cálculos Estequiométricos. Natureza elétrica da matéria (trabalhos de Faraday)." },
      { num: 3, title: "Ligações Químicas e Geometria", desc: "Iônica, covalente, eletronegatividade. Repulsão de pares eletrônicos (VSEPR), geometria molecular. Teoria da ligação de valência e a sobreposição de orbitais. Orbitais híbridos e moleculares." },
      { num: 4, title: "Sólidos, Líquidos e Gases Ideais", desc: "Evolução do conceito de matéria. Características e propriedades. Líquidos e sólidos ideais, ligações químicas nos sólidos e líquidos." },
      { num: 5, title: "Mudanças de Estado e Gases Reais", desc: "Sólidos, líquidos e gases reais: mudança de estado, diagrama de fase." },
      { num: 6, title: "Soluções e Propriedades Coligativas", desc: "Misturas, tipos de solução, concentração e solubilidade. Propriedades coligativas, eletrólitos, íons em solução aquosa." },
      { num: 7, title: "Modelo Atômico", desc: "Evolução dos conceitos de átomo. Propriedades dos átomos (eletronegatividade, afinidade eletrônica e suas dimensões)." },
      { num: 8, title: "Funções Químicas Inorgânicas", desc: "Estudo das funções inorgânicas fundamentais e suas principais aplicações: Ácidos, Bases, Sais e Óxidos." },
      { num: 9, title: "Reações e Equilíbrios em Solução Aquosa", desc: "Reações de ácido-base, precipitação e complexação. Equilíbrio de dissociação, hidrólise, indicadores, titulação, tampões e estequiometria de soluções." },
      { num: 10, title: "A Tabela Periódica", desc: "Histórico da tabela e sua construção. O problema da classificação (metais, não metais e semi-metais), gases nobres e química do carbono." },
      { num: 11, title: "Cinética e Equilíbrio Químico", desc: "Velocidades e mecanismos de reação. Equação de velocidade, teoria de colisões, complexo ativado, catálise." },
      { num: 12, title: "Química Orgânica", desc: "Princípios básicos da nomenclatura orgânica. Funções orgânicas, reações e mecanismos de reação orgânica." },
      { num: 13, title: "Ensino de Química: Conhecimento e Didática", desc: "Conhecimento científico e habilidade didática no ensino de Química. A construção do conhecimento: abordagens metodológicas." },
      { num: 14, title: "Recursos Didáticos e Laboratório", desc: "Recursos didáticos utilizados em sala de aula e laboratório, incluindo conhecimentos básicos de técnicas, materiais e normas de segurança laboratoriais." },
      { num: 15, title: "Novas Tecnologias e Avaliação", desc: "O ensino de Química e as novas tecnologias da informação e comunicação. Avaliação de aprendizagem do conhecimento químico." },
      { num: 16, title: "Competências e Habilidades PCN-EM", desc: "Competências e habilidades propostas pelos Parâmetros Curriculares Nacionais do Ensino Médio para a disciplina de Química." }
    ]
  },
  {
    id: "sociologia",
    code: 14,
    name: "Conhecimentos Específicos: Sociologia",
    unit: "Centro de Humanidades - CH",
    regime: "40h",
    requirements: "Licenciatura em Ciências Sociais ou Sociologia com Pós-graduação",
    points: [
      { num: 1, title: "Surgimento da Sociologia", desc: "Contexto histórico do surgimento da Sociologia. A constituição do saber sociológico. A sociologia como ciência. Sociologia e sociedade: conceitos, desenvolvimento da Sociologia." },
      { num: 2, title: "Condicionamentos Sócio-Culturais", desc: "Condicionamentos sócio-culturais da personalidade do indivíduo. Relação entre subjetividade e objetividade." },
      { num: 3, title: "Estrutura e Organização Social", desc: "Estrutura da sociedade. Estudo das principais instituições sociais." },
      { num: 4, title: "Pensamento Sociológico Clássico", desc: "Teorias clássicas de Durkheim, Marx e Weber. Classes sociais, estratificação e desigualdade social. Classe social na sociedade ocidental atual: classes e estilos de vida." },
      { num: 5, title: "Problemas Sociais Contemporâneos", desc: "As desigualdades sociais. Exclusão social. Escola, juventude e violência; a escola e o tratamento das diferenças sociais." },
      { num: 6, title: "Preconceito, Discriminação e Direitos", desc: "Preconceito e discriminação. Movimentos sociais tradicionais e novos. Gênero e envelhecimento. Gênero e violência. Violência e Estado. Migrações." },
      { num: 7, title: "Cultura, Consumo e Cidadania", desc: "Cultura e consumo. Ética e Cidadania." },
      { num: 8, title: "Sociedade, Trabalho e Emprego", desc: "Trabalho e emprego, relações sociais e transformações do trabalho." },
      { num: 9, title: "Meios de Comunicação e Ideologia", desc: "Os meios de comunicação de massa e a questão ideológica." },
      { num: 10, title: "Meio Ambiente e Desenvolvimento", desc: "O meio ambiente e o desenvolvimento tecnológico." },
      { num: 11, title: "Globalização e Estados Nacionais", desc: "A globalização econômica e os Estados nacionais." },
      { num: 12, title: "Metodologia de Ensino de Sociologia", desc: "Didática e abordagens pedagógicas do ensino de sociologia no Ensino Médio." },
      { num: 13, title: "Desafios Contemporâneos Globais", desc: "A globalização e os novos desafios da sociedade contemporânea." },
      { num: 14, title: "Cultura, Socialização e Instituições", desc: "Cultura e sociedade: o Estado, a família, a religião, as instituições sociais e o processo de socialização." },
      { num: 15, title: "Trabalho, Sindicalismo e Direitos", desc: "O novo mundo do trabalho e a história do sindicalismo no Brasil." },
      { num: 16, title: "Novos Movimentos Sociais", desc: "A configuração e as pautas dos novos movimentos sociais contemporâneos." },
      { num: 17, title: "Sociologia no Brasil e Nordeste", desc: "Sociologia no Brasil: cultura e identidade. Sociologia no Nordeste: cultura, identidade, religiosidade." }
    ]
  }
];
