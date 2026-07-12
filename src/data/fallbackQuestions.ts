import { Question } from "../types";

export const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  legislacao: [
    {
      question: "Com relação ao dever do Estado com a educação escolar pública, expresso na LDB (Lei nº 9.394/1996) e suas atualizações, assinale a alternativa que descreve corretamente uma das garantias previstas:",
      options: [
        { letter: "A", text: "Educação básica obrigatória e gratuita dos 6 (seis) aos 18 (dezoito) anos de idade." },
        { letter: "B", text: "Atendimento educacional especializado gratuito aos educandos com deficiência, transtornos globais do desenvolvimento e altas habilidades ou superdotação, transversal a todos os níveis, etapas e modalidades, preferencialmente na rede regular de ensino." },
        { letter: "C", text: "Acesso público e gratuito aos ensinos fundamental e médio para todos os que não os concluíram na idade própria, restrito aos menores de 21 anos." },
        { letter: "D", text: "Oferta de educação escolar regular para jovens e adultos, com características e modalidades adequadas às suas necessidades, vedando-se a oferta de cursos noturnos." },
        { letter: "E", text: "Atendimento ao educando, em todas as etapas da educação básica, por meio de programas suplementares de material didático-escolar, transporte, alimentação e assistência médica, de forma integralmente privatizada." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "A alternativa B reproduz exatamente o Art. 4º, inciso III da LDB, assegurando o atendimento educacional especializado transversal a todos os níveis, preferencialmente na rede regular de ensino.",
        incorrect: {
          A: "Incorreta. O correto é dos 4 (quatro) aos 17 (dezessete) anos de idade (Art. 4º, I).",
          B: "Esta é a alternativa correta.",
          C: "Incorreta. O acesso público e gratuito é direito público subjetivo e não possui limite de idade (Art. 5º).",
          D: "Incorreta. O poder público deve viabilizar e estimular o acesso e a permanência do jovem e adulto na escola, mediante a oferta de ações apropriadas, incluindo cursos noturnos regulares (Art. 4º, VII).",
          E: "Incorreta. Os programas suplementares são dever do Estado e prestados de forma pública, não privatizada."
        },
        pegadinha: "A banca costuma alterar a faixa etária da educação obrigatória (colocando 6 a 18 anos) ou trocar a palavra 'preferencialmente' por 'exclusivamente' no atendimento especializado.",
        revisao: "Artigo 4º da LDB (Lei nº 9.394/1996) atualizado."
      }
    },
    {
      question: "Conforme o Artigo 206 da Constituição Federal de 1988, o ensino será ministrado com base em vários princípios. Assinale a alternativa que NÃO corresponde a um desses princípios constitucionais:",
      options: [
        { letter: "A", text: "Igualdade de condições para o acesso e permanência na escola." },
        { letter: "B", text: "Pluralismo de ideias e de concepções pedagógicas, e coexistência de instituições públicas e privadas de ensino." },
        { letter: "C", text: "Gratuidade do ensino público em estabelecimentos oficiais." },
        { letter: "D", text: "Gestão centralizada e tecnocrática do ensino público, sob controle estrito e exclusivo do Ministério da Educação." },
        { letter: "E", text: "Valorização dos profissionais da educação escolar, garantidos, na forma da lei, planos de carreira, com ingresso exclusivamente por concurso público de provas e títulos, aos das redes públicas." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "A alternativa D está correta para responder à questão porque é a incorreta: o princípio constitucional estabelece a 'gestão democrática do ensino público, na forma da lei' (Art. 206, VI), e não uma gestão centralizada ou tecnocrática.",
        incorrect: {
          A: "Incorreta. Este é um princípio plenamente assegurado pelo Artigo 206, inciso I.",
          B: "Incorreta. Trata-se de princípio explícito no Artigo 206, inciso III.",
          C: "Incorreta. A gratuidade em estabelecimentos oficiais é garantia fundamental expressa no Artigo 206, inciso IV.",
          D: "Esta é a alternativa correta (que descreve o princípio incorreto solicitado pela questão).",
          E: "Incorreta. A valorização e o ingresso por concurso público constituem o inciso V do Artigo 206."
        },
        pegadinha: "Bancas adoram trocar 'gestão democrática' por termos de controle hierárquico como 'gestão centralizada' ou colocar que o concurso pode ser apenas de 'provas' em vez de 'provas e títulos'.",
        revisao: "Artigos 205 a 214 da Constituição Federal de 1988."
      }
    },
    {
      question: "Em se tratando de Administração Pública e do Estatuto dos Funcionários Públicos Civis do Estado do Ceará, os cargos efetivos consideram-se providos com o(a):",
      options: [
        { letter: "A", text: "assinatura do termo de posse oficial." },
        { letter: "B", text: "início do exercício efetivo das atividades no cargo." },
        { letter: "C", text: "publicação oficial do ato de nomeação." },
        { letter: "D", text: "divulgação do resultado homologado do concurso público." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "Segundo as normas da administração do Ceará, o provimento de cargos públicos efetivos faz-se mediante ato de nomeação (publicação no Diário Oficial), caracterizando o ato de provimento propriamente dito, enquanto a posse completa a investidura.",
        incorrect: {
          A: "Incorreta. A posse representa a aceitação expressa das atribuições e deveres do cargo, consolidando a investidura, mas o provimento ocorre no ato de nomeação.",
          B: "Incorreta. O exercício é o efetivo desempenho das atribuições do cargo pelo funcionário.",
          D: "Incorreta. O concurso público habilita o candidato ao provimento, mas a homologação não constitui o ato de provimento em si."
        },
        pegadinha: "Não confunda provimento (nomeação) com investidura (posse) ou exercício (trabalho de fato).",
        revisao: "Regime Jurídico Único e Estatuto dos Servidores do Ceará."
      }
    },
    {
      question: "[FUNECE / UECE] À luz das normas legais brasileiras relativas à organização da educação nacional (Lei de Diretrizes e Bases - LDB nº 9.394/1996), é correto afirmar que:",
      options: [
        { letter: "A", text: "A carga horária mínima anual será de oitocentas horas para o ensino fundamental, distribuídas por um mínimo de duzentos dias de efetivo trabalho escolar, incluído o tempo reservado aos exames finais." },
        { letter: "B", text: "O direito à educação infantil pré-escolar será assegurado às crianças até o término do ano letivo em que completarem sete anos de idade." },
        { letter: "C", text: "É dever dos pais ou responsáveis efetuar a matrícula dos menores no ensino fundamental a partir dos sete anos de idade." },
        { letter: "D", text: "O ensino fundamental obrigatório, com duração de nove anos, gratuito na escola pública, iniciando-se aos seis anos de idade, terá por objetivo a formação básica do cidadão." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "A alternativa D reproduz com exatidão o Art. 32 da LDB, o qual prescreve que o ensino fundamental obrigatório inicia-se aos seis anos de idade, tem duração de nove anos e é gratuito na escola pública.",
        incorrect: {
          A: "Incorreta. Conforme o Art. 24, inciso I, os exames finais devem ser EXCLUÍDOS da contagem dos duzentos dias mínimos de efetivo trabalho escolar.",
          B: "Incorreta. O direito à educação infantil (creche e pré-escola) é assegurado até os 5 (cinco) anos de idade, conforme alteração trazida pela Lei nº 12.796/2013.",
          C: "Incorreta. A matrícula é obrigatória a partir dos 4 (quatro) anos de idade na educação básica (Art. 6º da LDB)."
        },
        pegadinha: "A FUNECE adora cobrar a contagem dos dias letivos tentando incluir os exames finais na contagem do mínimo de duzentos dias, o que é vedado por lei.",
        revisao: "Artigo 24, 32 e 6º da LDB (Lei nº 9.394/1996)."
      }
    },
    {
      question: "[FUNECE / UECE] Por determinação da Lei de Diretrizes e Bases da Educação Nacional (LDB nº 9.394/1996), incumbe especificamente ao Estado do Ceará e aos demais estados federados:",
      options: [
        { letter: "A", text: "autorizar, credenciar e supervisionar de forma exclusiva todos os estabelecimentos do sistema de ensino de seus municípios." },
        { letter: "B", text: "elaborar e executar políticas e planos educacionais, em consonância com as diretrizes e planos nacionais de educação, integrando e coordenando as suas ações e as dos seus municípios." },
        { letter: "C", text: "oferecer, em caráter suplementar, a educação infantil em creches e pré-escolas, e, com absoluta prioridade, o ensino fundamental." },
        { letter: "D", text: "prestar assistência técnica e financeira aos municípios para o desenvolvimento de seus sistemas de ensino e o atendimento prioritário à escolaridade obrigatória, exercendo sua função supletiva." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "A alternativa B reproduz literalmente o Art. 10, inciso II da LDB, descrevendo o encargo político-pedagógico dos Estados de formular e implementar seus planos educacionais em cooperação com as redes municipais.",
        incorrect: {
          A: "Incorreta. Cabe aos municípios autorizar, credenciar e supervisionar os estabelecimentos do seu próprio sistema de ensino (Art. 11, IV).",
          C: "Incorreta. A oferta de educação infantil é incumbência prioritária dos Municípios, cabendo ao Estado focar prioritariamente no Ensino Médio e compartilhar o Ensino Fundamental (Art. 10, VI).",
          D: "Incorreta. A assistência técnica e financeira aos sistemas estaduais e municipais é incumbência prioritária da União em sua função supletiva e redistributiva (Art. 9º, III)."
        },
        pegadinha: "Preste muita atenção na distribuição de competências (União, Estados e Municípios). A FUNECE costuma embaralhar os deveres prioritários do Município (educação infantil) com os do Estado (ensino médio).",
        revisao: "Artigos 9º, 10 e 11 da LDB (Competências Federativas)."
      }
    }
  ],
  didatica: [
    {
      question: "Na perspectiva da avaliação formativa e mediadora, defendida por autores como Jussara Hoffmann e Cipriano Luckesi, o papel do erro no processo de ensino-aprendizagem é compreendido como:",
      options: [
        { letter: "A", text: "Um indicador final de incapacidade cognitiva do aluno, justificando reprovações e punições pedagógicas." },
        { letter: "B", text: "Um desvio prejudicial que deve ser ignorado para evitar constranger o candidato em avaliações somativas." },
        { letter: "C", text: "Um trampolim pedagógico e uma pista de investigação para o professor compreender as hipóteses de raciocínio construídas pelo educando e intervir de forma mediadora." },
        { letter: "D", text: "Um elemento irrelevante, já que as diretrizes curriculares nacionais preveem apenas testes objetivos padronizados." },
        { letter: "E", text: "Uma falha de planejamento metodológico unicamente atribuível à falta de recursos multimídia da escola." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A avaliação formativa enxerga o erro não como punição, mas como pista do processo de apropriação do saber pelo educando. Ele revela onde a intervenção didática ativa deve focar.",
        incorrect: {
          A: "Incorreta. Esta é la visão tradicionalista/somativa classificatória, superada pelas teorias pedagógicas contemporâneas.",
          B: "Incorreta. Ignorar o erro impede a regulação ativa do aprendizado.",
          C: "Esta é a alternativa correta.",
          D: "Incorreta. A BNCC e a LDB estimulam a avaliação formativa contínua de competências complexas.",
          E: "Incorreta. O erro faz parte natural de qualquer processo de construção de conhecimentos."
        },
        pegadinha: "Cuidado! Bancas tentam romantizar a avaliação somativa ou sugerir que a avaliação formativa exclui qualquer registro ou rigor de acompanhamento.",
        revisao: "Teoria da Avaliação Mediadora (Jussara Hoffmann) e Avaliação Diagnóstica (Luckesi)."
      }
    },
    {
      question: "As metodologias ativas de aprendizagem deslocam o centro da atividade docente para a ação investigativa do estudante. Em relação ao Ensino Híbrido (Blended Learning) no Ensino Médio, assinale a afirmativa correta:",
      options: [
        { letter: "A", text: "O Ensino Híbrido consiste na substituição completa de aulas prepara-se por videoaulas gravadas, reduzindo custos operacionais." },
        { letter: "B", text: "Modelos como a 'Sala de Aula Invertida' (Flipped Classroom) preconizam que o estudante tenha contato prévio com conceitos básicos em plataformas digitais, reservando o tempo presencial para discussões ativas, resolução de problemas e projetos práticos." },
        { letter: "C", text: "A rotação por estações exige obrigatoriamente que todas as estações tenham computadores conectados à internet de alta velocidade, inviabilizando escolas públicas." },
        { letter: "D", text: "O ensino híbrido reduz a autonomia do estudante, visto que o cronograma é estritamente controlado por algoritmos e inteligências artificiais de monitoramento remoto." },
        { letter: "E", text: "De acordo com a BNCC, metodologias híbridas são proibidas nas áreas de Ciências Humanas e Sociais Aplicadas." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "A Sala de Aula Invertida é um modelo de ensino híbrido onde o estudante estuda o material básico assincronamente e usa a sala presencial para atividades colaborativas e reflexão ativa de alto nível cognitivo.",
        incorrect: {
          A: "Incorreta. O ensino híbrido integra experiências online e presenciais de forma integrada, não é EaD puro.",
          B: "Esta é a alternativa correta.",
          C: "Incorreta. Pelo menos uma das estações deve conter ferramentas digitais, mas outras estações podem usar materiais físicos, leitura ou trabalho coletivo sem telas.",
          D: "Incorreta. Ao contrário, o ensino híbrido fomenta fortemente o protagonismo e a autorregulação do estudante.",
          E: "Incorreta. A BNCC estimula o uso integrado de tecnologias digitais de informação e comunicação em todas as áreas."
        },
        pegadinha: "Bancas frequentemente tentam definir Ensino Híbrido apenas como 'metade presencial, metade online' sem a integração pedagógica que dá nexo e sentido à experiência do aluno.",
        revisao: "Metodologias Ativas de Aprendizagem (Lilian Bacich e José Moran)."
      }
    },
    {
      question: "A escola é uma instituição utilizada pela sociedade para oferecer, aos membros das novas gerações, as experiências de aprendizagem que lhes permitam incorporar-se a essa sociedade ativa e criticamente. A escola assim entendida, determina que a escolarização seja considerada:",
      options: [
        { letter: "A", text: "um benefício de governos democráticos temporários." },
        { letter: "B", text: "uma expectativa comum de muitas famílias." },
        { letter: "C", text: "um direito a ser garantido a todo cidadão." },
        { letter: "D", text: "um projeto social dos mais esclarecidos da elite intelectual." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A escolarização, na perspectiva de uma escola democrática e inclusiva, é um direito subjetivo público fundamental de todo cidadão e dever do Estado, conforme as bases legais da educação brasileira (CF/88 e LDB).",
        incorrect: {
          A: "Incorreta. A escolarização não é mero benefício temporário concedido por governantes, mas um direito inalienável.",
          B: "Incorreta. Ainda que seja uma expectativa das famílias, juridicamente e socialmente ela se constitui como direito fundamental garantido.",
          D: "Incorreta. Não se limita a um projeto social de um grupo de esclarecidos, mas a uma garantia universal de desenvolvimento humano."
        },
        pegadinha: "Bancas costumam colocar termos como 'benefício' ou 'projeto social' para desviar o candidato da natureza de 'direito fundamental universal'.",
        revisao: "Função social da escola e bases legais da educação."
      }
    },
    {
      question: "Os estímulos e o ambiente social são importantes no desenvolvimento de determinadas inteligências. Tendo em vista os diferentes tipos de inteligência estudados por Howard Gardner, relacione-os corretamente com o que se diz sobre eles, numerando a Coluna II de acordo com a Coluna I:\n\nColuna I\n1. Lógica\n2. Corporal\n3. Espacial\n4. Intrapessoal\n5. Interpessoal\n\nColuna II\n( ) Pessoas que possuem facilidade para conclusões baseadas na razão.\n( ) Têm a capacidade de se autoconhecerem, tomando atitudes capazes de melhorar a vida com base nestes conhecimentos.\n( ) Presentes em dançarinos famosos e campeões de ginástica olímpica.\n( ) Costumam ser ótimos líderes e atuam facilmente em trabalhos em equipe.\n( ) Interpretam e reconhecem fenômenos que envolvem movimentos e posicionamento de objetos.\n\nA sequência correta, de cima para baixo, é:",
      options: [
        { letter: "A", text: "1, 5, 3, 4, 2" },
        { letter: "B", text: "3, 4, 5, 1, 2" },
        { letter: "C", text: "4, 5, 2, 1, 3" },
        { letter: "D", text: "1, 4, 2, 5, 3" }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "A correlação direta é: (1) lógica para conclusões baseadas na razão; (4) intrapessoal para autoconhecimento; (2) corporal para dança e esporte; (5) interpessoal para liderança e trabalhos em equipe; (3) espacial para movimentos e posicionamento de objetos.",
        incorrect: {
          A: "Incorreta, pois confunde a sequência das inteligências interpessoal, espacial e corporal.",
          B: "Incorreta, inicia associando lógica à inteligência espacial.",
          C: "Incorreta, inverte totalmente os conceitos de inteligência lógica e intrapessoal."
        },
        pegadinha: "Diferenciar claramente Inteligência Intrapessoal (autocompreensão) de Interpessoal (relação com o outro) é o ponto onde a maioria se confunde.",
        revisao: "Teoria das Inteligências Múltiplas de Howard Gardner."
      }
    },
    {
      question: "A teoria crítica de currículo, nos anos de 1980, no Brasil, compreende duas vertentes que caracterizam a produção pedagógica brasileira da época, quais sejam:",
      options: [
        { letter: "A", text: "Educação Popular e Abordagens de Cunho Tecnicista." },
        { letter: "B", text: "Pedagogia Crítico-Social dos Conteúdos e Educação Popular." },
        { letter: "C", text: "Neo-marxismo e Teorias da Reprodução." },
        { letter: "D", text: "Teorias da Reprodução e Marxismo Culturalista." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "A produção pedagógica crítica brasileira da década de 1980 foi fortemente marcada pela Pedagogia Crítico-Social dos Conteúdos (que defendia a apropriação dos conteúdos científicos pela classe trabalhadora) e pela Educação Popular (com forte base freireana de diálogo e libertação).",
        incorrect: {
          A: "Incorreta. O tecnicismo é uma vertente instrumental e não-crítica herdada do período militar, oposta à teoria crítica.",
          C: "Incorreta. O Neo-marxismo e as teorias da reprodução influenciaram as bases teóricas, mas não descrevem as duas vertentes de produção pedagógica prática no Brasil.",
          D: "Incorreta. Marxismo culturalista é uma corrente historiográfica e sociológica, não uma vertente pedagógica de currículo propriamente dita."
        },
        pegadinha: "A banca pode induzir o candidato a marcar 'Teorias da Reprodução' pelo fato de serem teorias críticas, porém elas possuem caráter reprodutivista, enquanto a vertente crítica propositiva focou na Pedagogia Crítico-Social e Educação Popular.",
        revisao: "Tendências Pedagógicas no Brasil e Teorias do Currículo."
      }
    },
    {
      question: "O currículo escolar é um dos mecanismos que compõem o caminho que nos torna o que somos. Nesse sentido, atente para as seguintes afirmações:\n\nI. O currículo escolar é um campo importante da política cultural, porquanto, é um lugar de circulação das narrativas, além de lugar privilegiado dos processos de subjetivação e da socialização dirigida.\nII. O currículo escolar é um instrumento que pode nos contar muitas histórias sobre indivíduos, grupos, sociedades, culturas, tradições, e histórias que relatam como as coisas são ou como deveriam ser.\nIII. O currículo e seus componentes constituem um conjunto articulado de saberes, regidos por uma determinada ordem, em que estão em luta diferentes visões de mundo.\nIV. É intenção curricular a concretização de um projeto de indivíduo para um projeto de sociedade, que independe do projeto político pedagógico da escola.\n\nEstá correto o que se afirma em:",
      options: [
        { letter: "A", text: "I, II e III apenas." },
        { letter: "B", text: "I, II, III e IV." },
        { letter: "C", text: "II, III e IV apenas." },
        { letter: "D", text: "I, III e IV apenas." }
      ],
      correctAnswer: "A",
      explanation: {
        correct: "Os itens I, II e III expressam com precisão as concepções contemporâneas e críticas de currículo. O item IV é incorreto porque o projeto de indivíduo e sociedade buscado pelo currículo não independe do Projeto Político-Pedagógico (PPP) da escola; na verdade, o currículo é a própria materialização prática do PPP.",
        incorrect: {
          B: "Incorreta porque inclui a afirmativa IV.",
          C: "Incorreta porque inclui a afirmativa IV e exclui a I.",
          D: "Incorreta porque inclui a afirmativa IV e exclui a II."
        },
        pegadinha: "Afirmativas longas e muito bonitas como a IV frequentemente trazem pequenas expressões como 'independe' ou 'exclui' no final para invalidar o texto.",
        revisao: "Teorias do Currículo (Tradicional, Crítica e Pós-Crítica)."
      }
    },
    {
      question: "O Projeto Político Pedagógico (PPP) é o conjunto de concepções pedagógicas que a escola adota, a explicitação da sua função social e a definição de procedimentos didático-metodológicos que serão desenvolvidos no processo educativo de seus alunos. Levando em consideração tal definição, analise as seguintes afirmações:\n\nI. A dimensão administrativo-financeira não deve ser contemplada no processo de elaboração e execução do PPP.\nII. O PPP deve ser elaborado coletivamente por representantes de todos os segmentos da comunidade escolar, como pais, alunos, professores e demais funcionários da escola.\nIII. O planejamento do PPP envolve pensar a organização do trabalho pedagógico da escola como um todo e da sala de aula em particular.\nIV. O PPP de uma escola pode ser implementado por outra escola, desde que ambas façam parte do mesmo contexto territorial e, consequentemente, social.\n\nEstá correto somente o que se afirma em:",
      options: [
        { letter: "A", text: "I e IV." },
        { letter: "B", text: "II e IV." },
        { letter: "C", text: "I e III." },
        { letter: "D", text: "II e III." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "Estão corretas as afirmativas II e III. O PPP é um documento de construção coletiva e participativa, englobando a organização do trabalho pedagógico da escola inteira e de cada sala de aula. O item I é falso porque a dimensão administrativa e financeira apoia e viabiliza as ações pedagógicas, devendo estar integrada ao plano. O item IV é falso porque o PPP confere identidade única à escola; ele não pode ser copiado ou simplesmente transplantado para outra escola.",
        incorrect: {
          A: "Incorreta, pois ambas as afirmativas I e IV são falsas.",
          B: "Incorreta, pois a afirmativa IV é falsa.",
          C: "Incorreta, pois a afirmativa I é falsa."
        },
        pegadinha: "Sugerir que escolas do mesmo bairro podem compartilhar o mesmo PPP é uma pegadinha clássica para testar se o candidato entende que o PPP expressa a identidade singular de cada comunidade escolar.",
        revisao: "Elaboração e estrutura do Projeto Político-Pedagógico (Ilma Passos Veiga)."
      }
    },
    {
      question: "[FUNECE / UECE] Abramovay, Andrade e Esteves (2007) destacam que o protagonismo juvenil na área educacional tem relação direta com a cidadania e a emancipação social dos estudantes, em virtude de:",
      options: [
        { letter: "A", text: "orientar a prática pedagógica exclusivamente para o desenvolvimento de competências conceituais abstratas." },
        { letter: "B", text: "favorecer os automatismos de aprendizagem relacionados com o contexto de inovações tecnológicas digitais." },
        { letter: "C", text: "possibilitar o desenvolvimento de atividades que valorizam a participação real e a escuta pedagógica dos jovens." },
        { letter: "D", text: "fortalecer atitudes meramente reprodutivas das práticas curriculares tradicionais da escola." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "Segundo os autores, o protagonismo juvenil se consolida quando a escola abre espaços reais para a participação ativa e democrática e para a escuta qualificada dos estudantes, transformando-os em sujeitos de suas próprias trajetórias.",
        incorrect: {
          A: "Incorreta. Competências puramente conceituais abstratas sem vinculação prática e social não promovem o protagonismo juvenil.",
          B: "Incorreta. Automatismos e respostas prontas anulam o espírito crítico e investigativo exigido pelo protagonismo.",
          D: "Incorreta. Atitudes reprodutivas consolidam a passividade acadêmica, que é o oposto do protagonismo."
        },
        pegadinha: "Bancas tradicionais tentam reduzir o protagonismo a um adereço de projetos isolados ou à mera utilização passiva de computadores/internet na sala de aula.",
        revisao: "Juventude, Cidadania e Protagonismo Juvenil na Escola."
      }
    },
    {
      question: "[FUNECE / UECE] Para Jan Amos Komensky ou Comenius, considerado o pai da Didática Moderna, o processo educativo seria estruturado em três fases fundamentais: a Escola Materna, a Escola Elementar e a Escola Latina. Com base nessa concepção pedagógica, analise as seguintes afirmações:\n\nI. A Escola Materna cultivaria os sentidos e ensinaria a criança a falar.\nII. A Escola Materna introduziria a criança no ensino formal e sistemático das primeiras letras escritas.\nIII. A Escola Elementar sugeria o ensino da língua materna, a memória, as ciências sociais e a aritmética básica.\nIV. A Escola Elementar e a Escola Latina se destinariam prioritariamente ao estudo de ciências aplicadas de caráter puramente instrumental.\nV. A Escola Latina se destinaria ao estudo das ciências naturais e das artes liberais de forma mais aprofundada.\n\nEstá correto somente o que se afirma em:",
      options: [
        { letter: "A", text: "I, II e III." },
        { letter: "B", text: "I, III e V." },
        { letter: "C", text: "II, IV e V." },
        { letter: "D", text: "II, III e IV." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "Apenas as afirmações I, III e V estão corretas. A Escola Materna (infância) foca no cultivo dos sentidos e da linguagem falada. A Escola Elementar foca no vernáculo, memória e fundamentos matemáticos/sociais. A Escola Latina aprofunda o conhecimento das ciências e humanidades.",
        incorrect: {
          A: "Incorreta. A introdução formal das letras (II) não é a ênfase primordial da Escola Materna para Comenius, que privilegia a educação sensorial.",
          C: "Incorreta. A Escola Elementar não se destina a um caráter puramente instrumental (IV), mas à formação integral em língua materna e civismo.",
          D: "Incorreta. Contém os erros dos itens II e IV descritos anteriormente."
        },
        pegadinha: "Comenius estruturou a educação acompanhando o desenvolvimento natural do ser humano. A casca de banana é achar que a Escola Materna já incluía a alfabetização mecânica e formal em vez do desenvolvimento sensorial e da linguagem oral.",
        revisao: "A Didática Magna de Jan Amos Comenius e a História da Didática."
      }
    },
    {
      question: "[FUNECE / UECE] Atente para o seguinte excerto sobre avaliação da aprendizagem: 'A avaliação praticada nas escolas é a avaliação da culpa e as notas praticadas são utilizadas para classificar os alunos, onde são comparados desempenhos e não os objetivos que se pretende atingir. Esta prática de avaliação se explicita por uma relação autoritária e conservadora que permite ao professor manter a disciplina e atenção dos alunos...'.\n\nUtilizando-se como referência a análise conceitual do autor Cipriano Carlos Luckesi, é correto concluir que a avaliação de aprendizagem autêntica é caracterizada como:",
      options: [
        { letter: "A", text: "um juízo de qualidade sobre dados relevantes do processo de aprendizagem, tendo em vista uma tomada de decisão inclusiva." },
        { letter: "B", text: "uma verificação empírica dos objetivos não alcançados pelos alunos, tendo em vista determinar o grau de fracasso do professor." },
        { letter: "C", text: "um instrumento de triagem para organizar as turmas em salas seletivas, tendo em vista a formação de grupos homogêneos." },
        { letter: "D", text: "um processo técnico de controle dos níveis de aprendizagem, focado puramente em coletar informações e selecionar os indivíduos." }
      ],
      correctAnswer: "A",
      explanation: {
        correct: "Para Luckesi, a avaliação autêntica e diagnóstica consiste em um juízo de valor sobre o estágio de desenvolvimento do aluno, gerando dados que orientam intervenções e tomadas de decisão pedagógicas para acolher e impulsionar a aprendizagem.",
        incorrect: {
          B: "Incorreta. O foco da avaliação nunca deve ser a culpabilização ou determinação do fracasso de docentes ou discentes.",
          C: "Incorreta. A avaliação classificatória/excludente visa rotular e separar os estudantes por desempenho, o que Luckesi condena.",
          D: "Incorreta. A mera coleta de dados para seleção e controle caracteriza exames seletivos tradicionais, e não a avaliação formativa e democrática."
        },
        pegadinha: "Não confunda exames (que são pontuais, classificatórios e excludentes) com avaliação (que é processual, diagnóstica, dialógica e inclusiva).",
        revisao: "Avaliação da Aprendizagem Escolar (Cipriano Carlos Luckesi)."
      }
    },
    {
      question: "[FUNECE / UECE] De acordo com as diretrizes e pressupostos teóricos que regem a organização curricular no Brasil, o ensino médio integrado é caracterizado essencialmente pela integração estrutural da:",
      options: [
        { letter: "A", text: "cultura geral acadêmica com a educação tecnológica instrumental aplicada ao mercado de trabalho." },
        { letter: "B", text: "educação geral (propedêutica) com a educação profissional de forma articulada e orgânica." },
        { letter: "C", text: "educação geral básica com o modelo de tempo integral sob regime de dedicação exclusiva." },
        { letter: "D", text: "educação propedêutica aplicada com a cultura geral voltada à formação técnica e corporativa." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "O Ensino Médio Integrado propõe superar a dualidade histórica entre a formação de elite (geral/propedêutica) e a formação da classe trabalhadora (técnica/profissional), fundindo-as organicamente em um único currículo onde ciência, cultura e trabalho se integram.",
        incorrect: {
          A: "Incorreta. A integração tecnológica não deve ser meramente instrumental ou voltada à mera adaptação ao mercado.",
          C: "Incorreta. O ensino em tempo integral é uma modalidade de jornada de tempo, mas não define por si só a integração curricular propedêutica-profissional.",
          D: "Incorreta. A cultura geral corporativa desvia-se do ideal de formação humana omnilateral (integral) pretendido pelo ensino integrado."
        },
        pegadinha: "Cuidado para não confundir 'ensino médio integrado' (integração curricular orgânica propedêutica e técnica) com 'ensino de tempo integral' (que diz respeito à ampliação da jornada escolar para 7h ou mais por dia).",
        revisao: "Bases conceituais do Ensino Médio Integrado e Trabalho como Princípio Educativo."
      }
    }
  ],
  ceara: [
    {
      question: "O Estatuto do Magistério do Ceará (Lei nº 10.884/1984 e alterações) dispõe sobre o regime jurídico dos profissionais do magistério público estadual. Sobre os direitos e deveres assegurados pela legislação do Ceará, assinale a opção correta:",
      options: [
        { letter: "A", text: "O regime de dedicação exclusiva é compulsório para todos os professores, sendo expressamente proibido o acúmulo lícito de dois cargos públicos de professor." },
        { letter: "B", text: "A evolução na carreira dos docentes estaduais cearenses dá-se exclusivamente por progressão de tempo de serviço, não havendo critérios de qualificação acadêmica ou avaliação de desempenho." },
        { letter: "C", text: "É dever do profissional do magistério estadual planejar e ministrar as aulas, além de participar obrigatoriamente do processo de planejamento e avaliação da unidade escolar e da elaboração do Projeto Político-Pedagógico." },
        { letter: "D", text: "A licença prêmio por assiduidade foi extinta sem qualquer direito adquirido para os servidores que ingressarem na Seduc-CE a partir de 2020." },
        { letter: "E", text: "O Estatuto proíbe os docentes temporários de receber remuneração equivalente ao vencimento básico da classe inicial da carreira." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A alternativa C descreve as obrigações fundamentais e legais do magistério do Ceará, alinhadas às diretrizes nacionais e estaduais sobre gestão democrática e planejamento escolar participativo.",
        incorrect: {
          A: "Incorreta. O acúmulo de dois cargos públicos de professor é constitucionalmente permitido se houver compatibilidade de horários (Art. 37, XVI da CF/88).",
          B: "Incorreta. A promoção na carreira ocorre tanto por antiguidade quanto por merecimento (desempenho e titulação acadêmica).",
          C: "Esta é a alternativa correta.",
          D: "Incorreta. Embora existam reformas previdenciárias e estatutárias, direitos adquiridos e licenças especiais possuem regras de transição específicas reguladas por lei.",
          E: "Incorreta. A remuneração de contratados temporariamente deve ser compatível com a função desempenhada conforme editais de seleção da Seduc."
        },
        pegadinha: "O IDECAN/UECE costuma cobrar questões sobre direitos específicos do professor cearense, misturando diretrizes federais gerais com a letra fria da Lei Estadual nº 10.884/1984.",
        revisao: "Estatuto do Magistério do Ceará (Lei Estadual nº 10.884/1984)."
      }
    },
    {
      question: "O Documento Curricular do Ceará (DCC) para o Ensino Médio orienta a reestruturação curricular das escolas da rede estadual. Qual das seguintes opções descreve um dos pilares estruturantes das trilhas de aprofundamento nos Itinerários Formativos do DCC?",
      options: [
        { letter: "A", text: "A fragmentação disciplinar absoluta com eliminação total das Ciências Humanas do currículo comum." },
        { letter: "B", text: "Os quatro eixos estruturantes definidos nacionalmente: Investigação Científica, Processos Criativos, Mediação e Intervenção Sociocultural, e Empreendedorismo." },
        { letter: "C", text: "A exclusão de projetos de vida, transferindo a responsabilidade de orientação profissional apenas para empresas privadas parceiras." },
        { letter: "D", text: "A obrigatoriedade de todas as escolas do Ceará oferecerem exatamente as mesmas 12 trilhas de aprofundamento, independentemente da infraestrutura regional." },
        { letter: "E", text: "A substituição total da Formação Geral Básica (FGB) por cursos técnicos autônomos de curta duração." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "As trilhas e itinerários previstos no DCC-CE baseiam-se obrigatoriamente nos quatro eixos estruturantes nacionais do Novo Ensino Médio, assegurando uma formação integral e investigativa.",
        incorrect: {
          A: "Incorreta. O DCC preza pela integração entre as áreas do conhecimento e mantém todas as áreas conectadas à formação geral básica.",
          B: "Esta é a alternativa correta.",
          C: "Incorreta. O componente curricular 'Projeto de Vida' é central e obrigatório no DCC para orientar os estudantes de forma integral.",
          D: "Incorreta. Os itinerários dependem do contexto socioeconômico e da infraestrutura da escola e do município de forma flexível.",
          E: "Incorreta. A Formação Geral Básica (FGB) é obrigatória e delimitada pelo limite de 1.800 horas máximas no currículo."
        },
        pegadinha: "Fique atento: a banca pode confundir as competências gerais da educação básica com os eixos específicos dos itinerários formativos do Ensino Médio.",
        revisao: "Documento Curricular do Ceará (DCC) - Etapa do Ensino Médio."
      }
    }
  ],
  especifico_sociologia: [
    {
      question: "Atente para o seguinte excerto: 'A reflexão sobre as origens e a natureza da vida social é quase tão antiga quanto a própria humanidade, mas a Sociologia, como um campo delimitado do saber científico, só emerge em meados do século 19 na Europa. Para melhor entender esse processo, é mister referir-se ao quadro das mudanças econômicas, políticas e sociais ocorridas principalmente a partir do século 16 e às correntes de pensamento que estabeleceram os alicerces da modernidade europeia - o racionalismo, o empirismo e o iluminismo'.\n\nNo que diz respeito a acontecimentos que foram importantes para o surgimento da Sociologia, considere os seguintes itens:\n\nI. Advento do capitalismo como modo de produção predominante na Europa ocidental e emergência de valores de uma sociedade burguesa.\nII. Industrialização e mudanças estruturais no mundo do trabalho, com urbanização acelerada de grandes centros comerciais.\nIII. Reforma protestante e processo de secularização que proporcionou o surgimento de racionalidade fundamentada nas ações de indivíduos.\nIV. Menor complexidade do processo de divisão social do trabalho em virtude do caráter estamental das economias capitalistas.\n\nCorresponde a acontecimento importante para o surgimento da Sociologia somente o que consta em:",
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
          A: "Incorreta, pois inclui o item IV.",
          B: "Incorreta, pois inclui o item IV e exclui o item I.",
          C: "Incorreta, pois inclui o item IV."
        },
        pegadinha: "Fique atento ao termo 'menor complexidade' na afirmativa IV. O capitalismo de fato intensificou drasticamente a divisão social do trabalho, tornando-a imensamente mais complexa.",
        revisao: "Contexto histórico e social do surgimento da Sociologia como campo científico."
      }
    },
    {
      question: "Atente para o que se diz a seguir sobre Sociologia: 'A sociologia se distingue por observar as ações humanas como elementos de figurações mais amplas; ou seja, de uma montagem não aleatória de atores reunidos em rede de dependência mútua (dependência considerada o estado no qual a probabilidade de que a ação seja empreendida e as chances de seu sucesso se alterem em função do que sejam os atores, do que façam ou possam fazer). Assim, figurações, redes de dependência mútua, condicionamentos recíprocos da ação e expansão ou confinamento da liberdade dos atores estão entre as mais preeminentes preocupações da sociologia' (Zygmunt Bauman e Tim May).\n\nA análise de Bauman e May compreende que a Sociologia é uma ciência que:",
      options: [
        { letter: "A", text: "se preocupa em compreender os homens em seus processos de interações, entre liberdade e dependência, construídos socialmente de diferentes maneiras, possibilidades e condicionamentos mútuos." },
        { letter: "B", text: "estuda os atores sociais em suas vivências individualizadas, em que cada indivíduo constitui seus interesses e posições sociais, constituindo, assim, o sentido de sua existência individual." },
        { letter: "C", text: "busca apreender as coletividades sociais autônomas em seus processos de reprodução e de afirmação regidos por leis autogeridas que estabelecem e definem a ação de cada indivíduo." },
        { letter: "D", text: "se preocupa com a vida de cada sujeito social e de sua ação livre autônoma no mundo a partir da qual afirma seus interesses individuais sobre os demais em um sistema de gestão dos egoísmos." }
      ],
      correctAnswer: "A",
      explanation: {
        correct: "A sociologia, segundo Bauman e May, foca nas interdependências humanas, onde os sujeitos não agem isoladamente nem são totalmente determinados por estruturas rígidas, mas se movem dentro de redes de dependência mútua e interações sociais fluidas.",
        incorrect: {
          B: "Incorreta. Estudar vivências puramente individualizadas é escopo mais próximo da psicologia individual; a sociologia foca nas figurações coletivas.",
          C: "Incorreta. Falar em leis autogeridas rígidas remete a uma visão hiper-estruturalista e mecanicista rejeitada pela análise flexível de Bauman.",
          D: "Incorreta. O individualismo metodológico e a gestão de egoísmos puramente individuais não representam o cerne do pensamento sociológico aqui defendido."
        },
        pegadinha: "O texto usa palavras difíceis como 'figurações' e 'dependência mútua' para testar se o candidato reconhece que a sociologia estuda a conexão recíproca entre o indivíduo e o tecido social.",
        revisao: "Zygmunt Bauman e o Pensamento Sociológico contemporâneo."
      }
    },
    {
      question: "Atente para o seguinte trecho: '“Estrutura” e “acção” estão necessariamente relacionadas entre si. As sociedades, comunidades ou grupos apenas têm uma “estrutura” na medida em que as pessoas agem de um modo regular e previsível. Por outro lado, a “acção” apenas é possível na medida em que cada um de nós, como indivíduo, possui uma enorme quantidade de conhecimento socialmente estruturado' (Anthony Giddens).\n\nConsoante a perspectiva de análise de Anthony Giddens, assinale a afirmação verdadeira.",
      options: [
        { letter: "A", text: "Os indivíduos, por serem criaturas da sociedade, estão subsumidos ao poder criador da estrutura social, internalizado em suas subjetividades individuais e agem conforme as determinações que lhes são impostas." },
        { letter: "B", text: "A interpretação sociológica contemporânea tem fundamento na primazia da sociedade sobre os indivíduos, que exerce sobre estes constrangimentos sociais definidores das ações dos sujeitos na sociedade." },
        { letter: "C", text: "Os seres humanos fazem escolhas e não reagem passivamente aos acontecimentos do seu tempo, sendo capazes de construir e reconstruir, ativa e reflexivamente, a estrutura social no curso das suas atividades individuais e coletivas." },
        { letter: "D", text: "Os indivíduos se constituem autonomamente e agem na sociedade conforme seus sentidos e perspectivas individuais, com liberdade de decidir suas ações cujo corolário é a própria sociedade." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "Anthony Giddens desenvolve a Teoria da Estruturação, cujo conceito central é a dualidade da estrutura. Ela defende que a estrutura não é apenas uma barreira externa (coerção), mas é simultaneamente o meio e o resultado da agência reflexiva dos indivíduos, que ativamente constroem e transformam seu meio.",
        incorrect: {
          A: "Incorreta. Descreve uma visão puramente determinista estruturalista, onde o indivíduo não tem poder de agência.",
          B: "Incorreta. Esta é a visão clássica durkheimiana do fato social coercitivo, diferente do modelo reflexivo de Giddens.",
          D: "Incorreta. Esta alternativa pende para o polo oposto do individualismo puro, ignorando as restrições da estrutura social descritas por Giddens."
        },
        pegadinha: "Cuidado para não confundir o modelo integrador de Giddens com o estruturalismo clássico de Durkheim (alternativa B) ou com o subjetivismo voluntarista radical (alternativa D).",
        revisao: "Teoria da Estruturação de Anthony Giddens."
      }
    },
    {
      question: "Leia atentamente o seguinte trecho: 'É fato social toda maneira de fazer, fixada ou não, susceptível de exercer sobre o indivíduo uma coerção exterior, ou ainda, toda maneira de fazer que é geral na extensão numa sociedade dada e, ao mesmo tempo, possui uma existência própria independente de suas manifestações individuais' (Durkheim).\n\nSobre o conceito de fato social desenvolvido por Émile Durkheim, é correto afirmar que:",
      options: [
        { letter: "A", text: "as maneiras de sentir, pensar e agir dos indivíduos são manifestações particulares próprias que formam as individualidades e a experiência de cada pessoa na sociedade." },
        { letter: "B", text: "a sociedade é produto das vontades dos indivíduos a partir das quais se constituem o sentimento coletivo que vão formar o corpo social." },
        { letter: "C", text: "existe uma ordem de fatos que se impõe ao indivíduo independentemente da sua vontade, cujo poder coativo deixa de ser sentido pelo indivíduo em nome do respeito e dos ideais coletivos." },
        { letter: "D", text: "os indivíduos atuam uns sobre os outros e é nesta interação que estabelecem as regras de funcionamento social." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "Para Durkheim, os fatos sociais caracterizam-se por sua exterioridade e poder de coerção (coação moral e social). Esse poder coativo muitas vezes é internalizado pelo indivíduo na forma de respeito às normas sociais e costumes coletivos, parecendo natural.",
        incorrect: {
          A: "Incorreta. Durkheim foca no caráter coletivo e supra-individual das maneiras de sentir, pensar e agir, e não na subjetividade atomizada.",
          B: "Incorreta. Descreve a visão individualista ou contratualista. Para Durkheim, a sociedade precede o indivíduo e possui primazia sobre as vontades individuais.",
          D: "Incorreta. Esta visão remete mais à sociologia compreensiva ou à microssociologia interacionista de Georg Simmel."
        },
        pegadinha: "Bancas costumam misturar as abordagens de Weber (ação social baseada no sentido individual) e de Durkheim (primazia do coletivo/coercitivo) para confundir o candidato.",
        revisao: "As Regras do Método Sociológico de Émile Durkheim."
      }
    },
    {
      question: "“A ‘função’ de reprodução da escola é uma invariante das sociedades modernas, que precisam encontrar nos veredictos escolares, ratificando as competências e o mérito das pessoas, a justificativa das hierarquias sociais produzidas pelas desigualdades escolares. Consequentemente, a reprodução passaria, primeiro, pela transformação das desigualdades sociais em desigualdades escolares de mesma extensão e, depois, das desigualdades escolares em desigualdades sociais em um circuito idêntico de repetição” (Dubet; Duru-Bellat; Vérétout).\n\nConsiderando o excerto acima, assinale a afirmação verdadeira.",
      options: [
        { letter: "A", text: "A escola possibilita aos indivíduos crescimento intelectual e autonomia como meio de resolução das desigualdades escolares e, com isto, superar as diferenças sociais." },
        { letter: "B", text: "A escola integra os indivíduos à sociedade valorizando suas diferentes trajetórias que e os distintos lugares sociais que ocupam, promovendo, deste modo, a superação das diferenças de cada aluno." },
        { letter: "C", text: "A escola reproduz as hierarquias sociais pela valorização dos méritos e competências socialmente dominantes, cabendo-lhe, por meio da certificação do conhecimento, legitimar a reprodução das desigualdades sociais." },
        { letter: "D", text: "É pela escola que o indivíduo adquire capital cultural e simbólico diferenciado da hierarquização dos valores que organizam a ordem simbólica da sociedade e de seus diferentes lugares." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "O excerto fundamenta-se nas teorias crítico-reprodutivistas da educação. Sob essa ótica, a escola converte privilégios sociais e econômicos em 'mérito acadêmico' e competências certificadas por diplomas, ocultando a origem social das desigualdades e, assim, legitimando a sua própria reprodução social.",
        incorrect: {
          A: "Incorreta. Esta é a visão otimista liberal/funcionalista clássica da escola como canal direto de ascensão social igualitária.",
          B: "Incorreta. Ignora o caráter reprodutor e excludente apontado pelo texto crítico.",
          D: "Incorreta. O indivíduo adquire capital cultural primariamente no seio familiar, e a escola replica a hierarquização desse capital, em vez de se diferenciar dele para neutralizá-lo."
        },
        pegadinha: "Esta questão exige que o candidato perceba o tom crítico do enunciado. Marcar uma alternativa romântica ou idealista (como A ou B) contraria totalmente o pressuposto teórico de reprodução das desigualdades estabelecido no excerto.",
        revisao: "A Sociologia da Educação e as Teorias de Reprodução Social (Pierre Bourdieu, Jean-Claude Passeron)."
      }
    },
    {
      question: "Sobre o conceito de habitus desenvolvido por Pierre Bourdieu, é correto afirmar que:",
      options: [
        { letter: "A", text: "trata de como a economia é um aspecto determinante em gradações diferentes dependendo do contexto analisado em seu devir histórico." },
        { letter: "B", text: "reflete sobre como a identidade nacional reverbera em maneiras de agir e pensar dos agentes em culturas socialmente constituídas." },
        { letter: "C", text: "contribui para observar as relações entre as condições historicamente construídas da prática e os sistemas simbólicos que compõem a vida social." },
        { letter: "D", text: "constitui uma maneira de observar as determinações subjetivas da prática pelas quais o agente atua de maneira performática e reflexiva." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "O conceito de habitus de Pierre Bourdieu liga a dimensão objetiva das estruturas sociais (condições materiais e históricas de existência de uma classe) às disposições incorporadas pelos indivíduos que orientam as suas escolhas, gostos e práticas cotidianas, integrando-as aos sistemas simbólicos.",
        incorrect: {
          A: "Incorreta. Reduz o conceito de habitus a um mero determinismo econômico marxista clássico.",
          B: "Incorreta. O habitus não se restringe à identidade nacional de um país, mas sim à posição ocupada pelos agentes nos campos sociais.",
          D: "Incorreta. O habitus é caracterizado por ações estruturadas incorporadas de forma semi-inconsciente, e não por uma ação puramente performática ou reflexiva constante."
        },
        pegadinha: "Não confunda a ação reflexiva constante de Giddens com o habitus de Bourdieu. O habitus opera em um nível de disposições estruturadas e incorporadas que agem de forma prática, quase naturalizada, sem exigir deliberação constante.",
        revisao: "Pierre Bourdieu: Habitus, Campo e Capitais."
      }
    }
  ],
  especifico_biologia: [
    {
      question: "[Sobral / FUNECE] Considere as seguintes afirmações sobre o estudo ecológico das populações e de suas dinâmicas de crescimento:\n\nI. Imigração, emigração, natalidade e mortalidade são fatores ecológicos fundamentais utilizados para o estudo e determinação do tamanho populacional.\nII. As taxas de migração, de natalidade e de mortalidade de uma população podem sofrer alteração direta em função da disponibilidade de recursos, condições ambientais, predadores e reprodução.\nIII. O tamanho populacional equilibrado de uma espécie é definido quando se associa um modelo de crescimento puramente linear seguido por um crescimento exponencial infinito.\nIV. Uma população possui o potencial de crescer de forma ilimitada sob condições ideais (potencial biótico), o que na natureza não ocorre continuamente em função da capacidade limite ou de carga (k) do ambiente e da resistência ambiental.\n\nEstá correto o que se afirma em:",
      options: [
        { letter: "A", text: "I, III e IV." },
        { letter: "B", text: "I, II e III." },
        { letter: "C", text: "I, II e IV." },
        { letter: "D", text: "II, III e IV." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "Estão corretos os itens I, II e IV. O crescimento de uma população depende do saldo entre natalidade/imigração e mortalidade/emigração. Sob condições ideais, ela tem potencial biótico para crescer exponencialmente, mas na natureza a resistência do meio (espaço, alimento, predação, doenças) estabelece um limite de carga sustentável (k).",
        incorrect: {
          A: "Incorreta. O item III está incorreto pois o crescimento populacional equilibrado na natureza segue uma curva sigmoide (logística) que se estabiliza no limite de carga (k), e nunca um crescimento exponencial infinito.",
          B: "Incorreta. Contém o erro do item III.",
          D: "Incorreta. Exclui o item I, que traz os fatores demográficos corretos, e inclui o incorreto item III."
        },
        pegadinha: "Bancas gostam de misturar potencial biótico (crescimento teórico máximo) com crescimento real (que é limitado pela resistência do meio). Fique atento à palavra 'infinito' no item III.",
        revisao: "Ecologia de Populações (Curvas de Crescimento J e S, Resistência do Meio, Capacidade de Carga)."
      }
    },
    {
      question: "[Sobral / FUNECE] As células eucarióticas apresentam um alto grau de compartimentação membranosa e especialização funcional de suas organelas. Em relação às características e diferenças celulares estruturais, assinale a opção correta:",
      options: [
        { letter: "A", text: "A parede celular rígida garante resistência estrutural e define a forma externa da célula animal, além de protegê-la contra patógenos ambientais." },
        { letter: "B", text: "Tanto a célula animal quanto a célula vegetal apresentam ribossomos funcionais, mitocôndrias produtoras de ATP e o complexo golgiense para empacotamento e secreção celular." },
        { letter: "C", text: "O principal armazenamento de reserva de energia a curto e médio prazo na célula vegetal ocorre sob a forma de glicogênio citoplasmático." },
        { letter: "D", text: "Plastos (como os cloroplastos), glioxissomos e vacúolos de grande volume central são organelas típicas e abundantes presentes exclusivamente na célula animal." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "A alternativa B está perfeitamente correta. Ribossomos, mitocôndrias e complexo de Golgi são organelas eucarióticas fundamentais compartilhadas tanto por animais quanto por vegetais.",
        incorrect: {
          A: "Incorreta. Células animais NÃO possuem parede celular rígida; essa estrutura é típica de vegetais (celulose), fungos (quitina) e bactérias (peptidioglicano).",
          C: "Incorreta. O principal polissacarídeo de reserva energética nas plantas é o AMIDO, enquanto o glicogênio é a reserva de animais e fungos.",
          D: "Incorreta. Plastos, glioxissomos e vacúolos de suco celular central são organelas típicas de células VEGETAIS, e não animais."
        },
        pegadinha: "A pegadinha clássica é tentar induzir o candidato ao erro afirmando que células vegetais não têm mitocôndrias por realizarem fotossíntese (cloroplastos). Lembre-se: plantas respiram e, portanto, possuem mitocôndrias!",
        revisao: "Biologia Celular e Citologia (Estrutura e Fisiologia das Organelas Celulares)."
      }
    },
    {
      question: "[Sobral / FUNECE] O pensamento evolutivo transformou a biologia moderna. Ao comparar as contribuições teóricas e conceituais históricas de Jean-Baptiste Lamarck e Charles Darwin, assinale a afirmação correta:",
      options: [
        { letter: "A", text: "A herança dos caracteres adquiridos e o mecanismo de seleção natural foram formulados em conjunto por Charles Darwin em sua obra clássica de 1859." },
        { letter: "B", text: "Os objetivos primordiais de Lamarck centravam-se em defender as teorias do fixismo criacionista, a variação estática e a criação em separado das espécies no planeta." },
        { letter: "C", text: "Lamarck fundamentou suas proposições evolutivas diretamente na teoria populacional de Thomas Malthus, segundo a qual as populações crescem em progressão geométrica." },
        { letter: "D", text: "Para Lamarck, as alterações ambientais produzem novas necessidades no organismo, estimulando o uso ou desuso de órgãos, o que gera modificações adaptativas que são transmitidas aos descendentes." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "A alternativa D resume com precisão a essência da teoria evolutiva de Lamarck (Lamarckismo), baseada em duas leis: a Lei do Uso e Desuso (órgãos mais solicitados desenvolvem-se, menos usados atrofiam) e a Lei da Transmissão dos Caracteres Adquiridos.",
        incorrect: {
          A: "Incorreta. A seleção natural foi descrita por Darwin (e Wallace), enquanto os caracteres adquiridos eram uma premissa amplamente aceita à época e enfatizada por Lamarck.",
          B: "Incorreta. Lamarck foi o primeiro grande naturalista a propor uma teoria sistemática e ativa contra o fixismo/criacionismo (ele era transformista).",
          C: "Incorreta. Foi Charles Darwin quem leu Malthus e utilizou o conceito de competição por recursos limitados como pilar fundamental para formular a seleção natural."
        },
        pegadinha: "Cuidado para não achar que Lamarck defendia o criacionismo. Ele foi um pioneiro do evolucionismo! A diferença crucial é que no lamarckismo o meio induz a mudança ativa no indivíduo, enquanto no darwinismo o meio seleciona as variações já existentes.",
        revisao: "Teorias Evolutivas (Lamarckismo vs. Darwinismo vs. Neodarwinismo)."
      }
    },
    {
      question: "[Sobral / FUNECE] Os tecidos humanos desempenham papéis biológicos altamente coordenados. Assinale a opção que descreve corretamente um tecido do corpo humano e sua respectiva especificação anatômica e funcional:",
      options: [
        { letter: "A", text: "O tecido epitelial apresenta ausência de espaço intercelular significativo (células justapostas), total ausência de vascularização direta (avascular) e tem como função principal a proteção física e barreira contra patógenos." },
        { letter: "B", text: "O tecido conjuntivo possui células alongadas especializadas em contrações rápidas e lentas, sendo responsável direto pelo batimento cardíaco e movimentos voluntários." },
        { letter: "C", text: "O tecido muscular apresenta amplo espaço intercelular preenchido por rica substância fundamental amorfa e fibras elásticas, atuando na conexão e preenchimento de outros órgãos." },
        { letter: "D", text: "O tecido nervoso é especializado no transporte ativo e passivo de macromoléculas de glicose por todo o organismo, sendo formado exclusivamente por hemácias e glóbulos brancos." }
      ],
      correctAnswer: "A",
      explanation: {
        correct: "O tecido epitelial é caracterizado por células muito próximas (justapostas) com pouquíssima matriz extracelular, sendo avascular (recebe nutrientes por difusão a partir do tecido conjuntivo subjacente) e exercendo papel primordial de revestimento e proteção.",
        incorrect: {
          B: "Incorreta. Quem possui células alongadas contráteis é o tecido muscular, não o conjuntivo.",
          C: "Incorreta. Quem apresenta ampla matriz extracelular, fibras colágenas e elásticas é o tecido conjuntivo, não o muscular.",
          D: "Incorreta. O tecido nervoso é formado por neurônios e células da glia para transmissão de impulsos elétricos, e não por células sanguíneas (hemácias/leucócitos)."
        },
        pegadinha: "Fique esperto! As bancas adoram trocar as definições de tecido conjuntivo e muscular para confundir o candidato, ou afirmar que o tecido epitelial é altamente vascularizado devido ao sangramento de cortes superficiais.",
        revisao: "Histologia Humana (Características e Funções dos Quatro Tecidos Básicos)."
      }
    },
    {
      question: "[FUNECE / UECE] Os avanços tecnológicos na microscopia foram fundamentais para a consolidação da biologia celular. Relacione, corretamente, os microscópios óptico e eletrônico com suas respectivas características funcionais, numerando os parênteses abaixo:\n\n1. Óptico\n2. Eletrônico\n\n( ) Possui limite de resolução prático de, aproximadamente, 0,2 µm.\n( ) Possui limite de resolução de, aproximadamente, 0,2 nm.\n( ) Direciona feixes de elétrons para uma tela fluorescente ou filme fotográfico a fim de gerar a imagem.\n( ) Utiliza um conjunto de lentes de vidro e feixe de luz visível para formar a imagem ampliada.\n\nA sequência correta, de cima para baixo, é:",
      options: [
        { letter: "A", text: "2, 1, 1, 2." },
        { letter: "B", text: "1, 2, 1, 2." },
        { letter: "C", text: "2, 1, 2, 1." },
        { letter: "D", text: "1, 2, 2, 1." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "A sequência correta é 1, 2, 2, 1 (Microscópio Óptico possui resolução máxima de ~0,2 µm e usa luz/lentes de vidro; o Microscópio Eletrônico atinge ~0,2 nm usando feixes de elétrons e bobinas eletromagnéticas).",
        incorrect: {
          A: "Incorreta. O microscópio óptico não possui resolução nanométrica.",
          B: "Incorreta. Inverte o papel das lentes e do limite de resolução.",
          C: "Incorreta. Atribui incorretamente a resolução de 0,2 µm ao microscópio eletrônico."
        },
        pegadinha: "A FUNECE costuma testar a atenção do candidato com a escala das unidades de medida (micrômetros 'µm' para o óptico vs. nanômetros 'nm' para o eletrônico).",
        revisao: "Métodos de Estudo da Célula: Microscopia Óptica e Eletrônica."
      }
    },
    {
      question: "[FUNECE / UECE] A biodiversidade brasileira é considerada uma das maiores do planeta, exigindo dos docentes uma compreensão aprofundada dos seus ecossistemas. Atente às seguintes afirmações sobre os biomas brasileiros:\n\nI. A Mata Atlântica e a Floresta Amazônica apresentam fisionomia florestal com múltiplos estratos vegetais, onde a penetração e a distribuição vertical e horizontal de luz atuam como forte fator limitante para as espécies arbustivas e herbáceas do sub-bosque.\nII. O Cerrado é classificado como um hotspot de biodiversidade global devido à sua elevada riqueza biológica e ao alarmante nível de ameaça antrópica, abrigando fitofisionomias que variam do campo limpo ao cerradão.\nIII. A Caatinga é um bioma exclusivamente brasileiro caracterizado por vegetação decídua espinhosa e, ao contrário do senso comum, apresenta uma rica biodiversidade, com estimativas de milhares de espécies vegetais, muitas delas endêmicas.\nIV. Os Pampas sulistas caracterizam-se por plantas com adaptações severas ao fogo e solos ricos em alumínio, com presença de caules tortuosos, xilopódios e cutículas extremamente espessas para conter a perda hídrica.\n\nEstá correto o que se afirma em:",
      options: [
        { letter: "A", text: "I, III e IV apenas." },
        { letter: "B", text: "I, II e III apenas." },
        { letter: "C", text: "II, III e IV apenas." },
        { letter: "D", text: "I, II, III e IV." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "Estão corretas as afirmativas I, II e III. A afirmativa IV está incorreta porque as adaptações ao fogo (como xilopódios, caules com cortiça espessa e toxicidade por alumínio) são típicas e exclusivas do bioma Cerrado, e não dos Pampas (que consistem predominantemente em campos limpos e gramíneas sob clima temperado/frio).",
        incorrect: {
          A: "Incorreta. Exclui a afirmativa II (Cerrado) e inclui a incorreta IV.",
          C: "Incorreta. Inclui a incorreta afirmativa IV.",
          D: "Incorreta. Considera todas corretas, mas o pampa não possui adaptações xerófilas e pirofíticas como o Cerrado e a Caatinga."
        },
        pegadinha: "Bancas de concurso frequentemente transplantam as famosas adaptações adaptativas e ecológicas do Cerrado (casca grossa, xilopódios) para outros biomas herbáceos como os Pampas ou Pantanal.",
        revisao: "Biomas Brasileiros e Adaptações Ecológicas da Flora."
      }
    }
  ],
  especifico_matematica: [
    {
      question: "[FUNECE / UECE] No âmbito do ensino de Matemática e das diretrizes curriculares do Ceará, considere as propriedades analíticas das funções. Sendo f(x) = a^x (com a > 1) uma função exponencial e g(x) = px + q uma função afim, assinale a opção correta sobre suas características:",
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
          C: "Esta é a alternativa correta.",
          D: "Incorreta. O gráfico intercepta o eixo y no ponto (0, 1), já que a^0 = 1 para qualquer base a não nula."
        },
        pegadinha: "Cuidado para não confundir domínio com imagem de uma função exponencial. O domínio é todo o conjunto dos reais, mas a imagem é exclusivamente composta por valores positivos.",
        revisao: "Análise Real e Estudo das Funções Elementares."
      }
    },
    {
      question: "[FUNECE / UECE] A Geometria Euclidiana Plana e Espacial constitui um eixo central no currículo de Matemática. No que diz respeito às propriedades de polígonos regulares e poliedros convexos, de acordo com a famosa Relação de Euler para poliedros, assinale a afirmação correta:",
      options: [
        { letter: "A", text: "Para qualquer poliedro convexo, a relação clássica estabelecida por Leonhard Euler entre o número de vértices (V), arestas (A) e faces (F) é expressa por V + F = A + 2." },
        { letter: "B", text: "Soma dos ângulos internos de qualquer polígono regular convexo de n lados é constante e dada por S = (n - 2) * 90 graus." },
        { letter: "C", text: "Um poliedro regular convexo possui obrigatoriamente faces de formatos geométricos distintos e ângulos poliédricos desiguais." },
        { letter: "D", text: "A relação de Euler V + F = A + 2 aplica-se estritamente e unicamente a figuras geométricas bidimensionais como triângulos e quadriláteros." }
      ],
      correctAnswer: "A",
      explanation: {
        correct: "A relação clássica de Euler estabelece que para poliedros convexos (e alguns não convexos de gênero zero), o número de vértices mais o de faces é igual ao número de arestas mais dois: V + F = A + 2.",
        incorrect: {
          A: "Esta é a alternativa correta.",
          B: "Incorreta. A soma dos ângulos internos de um polígono convexo é dada por S = (n - 2) * 180 graus.",
          C: "Incorreta. Um poliedro regular possui todas as suas faces formadas pelo mesmo polígono regular e ângulos poliédricos todos congruentes.",
          D: "Incorreta. A Relação de Euler se aplica a sólidos tridimensionais (poliedros), e não a polígonos bidimensionais simples."
        },
        pegadinha: "A banca pode tentar mudar os sinais da fórmula para V - A + F = 2 ou inventar relações não lineares. Memorize a clássica: Vamos Fazer Amor a Dois (V + F = A + 2)!",
        revisao: "Geometria Espacial: Poliedros Convexos e Relação de Euler."
      }
    }
  ],
  especifico_historia: [
    {
      question: "[FUNECE / UECE] A história social do Ceará é marcada por secas periódicas e mobilizações populares. Com relação à famosa 'Seca de 1915' e a criação dos denominados 'Currais do Governo' (campos de concentração cearenses), assinale a opção correta:",
      options: [
        { letter: "A", text: "Os campos de concentração cearenses de 1915 e 1932 foram criados pelo governo para acolher e empregar de forma digna todos os flagelados da seca." },
        { letter: "B", text: "A Seca de 1915 e os currais tecnológicos contaram com oposição unânime da oligarquia local liderada por Nogueira Accioly." },
        { letter: "C", text: "Os campos de concentração (como o do Alagadiço em Fortaleza) tinham como objetivo principal isolar socialmente os flagelados da seca, impedindo sua entrada e circulação na capital do estado." },
        { letter: "D", text: "A obra literária 'O Quinze', de Rachel de Queiroz, retrata a seca sob uma perspectiva puramente positivista de exaltação dos investimentos governamentais." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "Os campos de concentração cearenses eram instrumentos de controle social e isolamento higienista para impedir que a massa de flagelados famintos invadisse Fortaleza.",
        incorrect: {
          A: "Incorreta. As condições nos campos eram terríveis e subumanas, gerando milhares de óbitos por fome e infecções.",
          B: "Incorreta. As políticas de controle e contenção tinham amplo respaldo das elites para proteger os centros urbanos.",
          D: "Incorreta. Rachel de Queiroz expôs a miséria e a desumanidade das políticas públicas face à vulnerabilidade social cearense."
        },
        pegadinha: "Bancas usam narrativas humanitárias para tentar disfarçar a função de contenção e isolamento forçado que esses espaços repressivos exerciam contra os sertanejos pobres.",
        revisao: "História do Ceará: Secas e Conflitos Sociais no Século XX."
      }
    },
    {
      question: "[FUNECE / UECE] No Ceará, a eclosão da Revolução Pernambucana de 1817 constituiu um dos marcos dos movimentos de contestação ao absolutismo monárquico na província. Sobre o desenrolar desse movimento revolucionário em terras cearenses, é correto afirmar que:",
      options: [
        { letter: "A", text: "A revolta ficou restrita às vilas litorâneas e contou com o apoio militar imediato das forças navais enviadas pela Coroa portuguesa sediada no Rio de Janeiro." },
        { letter: "B", text: "Teve caráter estritamente oligárquico e conservador, buscando a consolidação dos privilégios tributários dos grandes proprietários de engenho contra as ideias liberais e iluministas." },
        { letter: "C", text: "A revolução foi proclamada no Cariri pelo Capitão-Mor José Pereira Filgueiras, sob a influência direta de lideranças locais como o seminarista José Martiniano de Alencar e sua mãe, Bárbara de Alencar." },
        { letter: "D", text: "O movimento cearense fracassou imediatamente após a sua proclamação em virtude da ausência completa de adesão de militares locais e de membros do clero secular." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A alternativa C está correta. No Ceará, a Revolução de 1817 teve como centro a Vila do Crato (região do Cariri), sendo liderada ativamente pela família Alencar (Bárbara de Alencar, a primeira presa política do Brasil, e seu filho José Martiniano de Alencar) e pelo militar José Pereira Filgueiras.",
        incorrect: {
          A: "Incorreta. O movimento eclodiu na região do Cariri, no interior sul do Ceará, longe do litoral da província.",
          B: "Incorreta. A Revolução de 1817 foi profundamente influenciada pelos ideais liberais, republicanos e iluministas.",
          D: "Incorreta. Houve forte adesão de parcelas expressivas do clero local (inclusive o Crato era celeiro de padres republicanos) e de tropas locais."
        },
        pegadinha: "A FUNECE costuma tentar inverter o papel de José Pereira Filgueiras em 1817 (revolucionário) ou os ideais defendidos pela histórica família Alencar no Cariri.",
        revisao: "História do Ceará: A Revolução de 1817 e a Confederação do Equador (1824)."
      }
    }
  ],
  especifico_portugues: [
    {
      question: "[FUNECE / UECE] A concordância nominal e verbal é tema recorrente nas avaliações teóricas para cargos do magistério. Assinale a alternativa que apresenta a flexão correta de acordo com a norma-padrão da Língua Portuguesa:",
      options: [
        { letter: "A", text: "Fazem dez anos que a Seduc-CE não promovia um concurso com tantas vagas específicas para a área." },
        { letter: "B", text: "Seguem anexo à presente documentação pedagógica os relatórios de planejamento e as avaliações semestrais." },
        { letter: "C", text: "Considerando as diretrizes atuais da BNCC, é meio-dia e meia, horário limite para a consolidação das metas." },
        { letter: "D", text: "Haviam muitos professores interessados em debater as metodologias ativas de ensino na última reunião." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A alternativa C está correta. 'Meio-dia e meia' expressa metade de um dia mais metade de uma hora (meia hora), concordando perfeitamente.",
        incorrect: {
          A: "Incorreta. O verbo 'fazer' indicando tempo cronológico é impessoal: 'Faz dez anos'.",
          B: "Incorreta. O vocábulo 'anexo' atua como adjetivo, concordando com o nome ao qual se refere: 'Seguem anexos os relatórios'.",
          D: "Incorreta. O verbo 'haver' no sentido de existir permanece obrigatoriamente no singular: 'Havia muitos'."
        },
        pegadinha: "Cuidado com verbos impessoais (haver/fazer) que as bancas costumam flexionar indevidamente no plural para testar a atenção.",
        revisao: "Sintaxe de Concordância Verbal e Nominal da Língua Portuguesa."
      }
    }
  ],
  especifico_geral: [
    {
      question: "[FUNECE / UECE] No que se refere ao processo de ensino-aprendizagem e às metodologias ativas de ensino conforme as diretrizes adotadas no Ceará, assinale a opção correta sobre o planejamento e avaliação didática:",
      options: [
        { letter: "A", text: "A avaliação formativa deve centrar-se exclusivamente em testes somativos classificatórios ao final do semestre letivo." },
        { letter: "B", text: "A transposição didática consiste na transmissão literal de conceitos científicos avançados sem contextualização ou simplificação metodológica." },
        { letter: "C", text: "O planejamento escolar participativo e democrático promove a colaboração entre os docentes e valoriza as trajetórias formativas e sociais dos alunos." },
        { letter: "D", text: "De acordo com as leis educacionais, o Projeto Político-Pedagógico (PPP) deve ser elaborado por agentes externos e imposto de forma vertical à escola." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A alternativa C está correta pois a moderna gestão educacional democrática preconiza que a construção do PPP e o planejamento sejam processos coletivos que consideram a realidade sociocultural discente.",
        incorrect: {
          A: "Incorreta. A avaliação formativa é contínua e processual, visando o diagnóstico e regulação ativa do aprendizado.",
          B: "Incorreta. Transposição didática refere-se à transformação do saber científico em saber ensinável, adaptado ao nível cognitivo do aluno.",
          D: "Incorreta. O PPP deve ser elaborado participativamente pela comunidade interna e externa da própria escola."
        },
        pegadinha: "A FUNECE costuma contrapor as metodologias democráticas participativas com visões puramente burocráticas ou hierárquicas.",
        revisao: "Planejamento Curricular e Concepções Pedagógicas Democráticas."
      }
    }
  ],
  especifico_geografia: [
    {
      question: "[FUNECE / UECE] A construção do conhecimento geográfico pressupõe a escolha de um corpo conceitual e metodológico específico. Para isso, usa a Geografia conceitos-chave como instrumentos capazes de realizar uma análise científica do espaço. Relacione os conceitos propostos a seguir com suas respectivas caracterizações estruturais, numerando a segunda coluna de acordo com a primeira:\n\n1. Lugar\n2. Território\n3. Paisagem\n4. Escala\n5. Globalização\n\n( ) Porção do espaço apropriável para a vida, que é vivido, reconhecido e cria identidade.\n( ) Aborda os fenômenos decorrentes da implementação de novas tecnologias de comunicação e informação.\n( ) Compreende o visível do arranjo espacial possuindo um caráter social, pois também é formada de movimentos impostos pelo homem.\n( ) Espaço definido e delimitado por e a partir das relações de poder.\n( ) Compreende não apenas a questão dimensional (geométrica), mas também fenomenal, quando dedicada ao fenômeno espacial que se discute.\n\nA sequência correta, de cima para baixo, é:",
      options: [
        { letter: "A", text: "1, 5, 3, 2, 4." },
        { letter: "B", text: "3, 5, 4, 2, 1." },
        { letter: "C", text: "3, 2, 5, 4, 1." },
        { letter: "D", text: "2, 4, 1, 5, 3." }
      ],
      correctAnswer: "A",
      explanation: {
        correct: "A sequência correta é 1, 5, 3, 2, 4. (1) Lugar representa o espaço vivido e afetivo; (5) Globalização vincula-se aos fluxos de informação tecnológicos; (3) Paisagem é o arranjo espacial visível; (2) Território expressa as relações de poder e soberania; (4) Escala aborda a dimensão espacial de abrangência dos fenômenos.",
        incorrect: {
          B: "Incorreta. Atribui a definição de lugar à paisagem e inverte as demais.",
          C: "Incorreta. Confunde a caracterização afetiva e espacial de lugar com a de paisagem.",
          D: "Incorreta. Apresenta uma ordenação conceitual totalmente discrepante das definições canônicas da geografia humana."
        },
        pegadinha: "Muito cuidado: a banca UECE adora cobrar a escala não apenas como um fator matemático (proporção cartográfica), mas também como uma dimensão de análise fenomenal e ontológica dos processos geográficos.",
        revisao: "Epistemologia da Geografia: Conceitos-Chave (Espaço, Território, Lugar, Paisagem e Região)."
      }
    },
    {
      question: "[FUNECE / UECE] A urbanização brasileira é caracterizada por intensos processos de reestruturação produtiva, desigualdades socioespaciais e formação de metrópoles. Escreva V ou F conforme seja verdadeiro ou falso o que se afirma a seguir sobre a urbanização no Brasil:\n\n( ) Nos grandes centros urbanos, o aumento da degradação ambiental é consequência exclusiva da ação dos grupos mais pobres da sociedade, que poluem lagoas e lançam resíduos domésticos de forma ilegal.\n( ) Destaca as grandes cidades como palco de profundas contradições sociais entre inovações tecnológicas, modernização econômica e pobreza estrutural.\n( ) A primazia recente de metrópoles regionais como Manaus, Fortaleza e Curitiba se acentua de tal forma que rebaixou por completo o comando econômico e político nacional historicamente exercido por São Paulo e Rio de Janeiro.\n( ) Conjuntos habitacionais, favelas e cortiços, de um lado, e condomínios exclusivos, murados e rigidamente controlados, de outro, demarcam os extremos da diferenciação espacial da habitação nas cidades brasileiras.\n\nA sequência correta, de cima para baixo, é:",
      options: [
        { letter: "A", text: "V, F, V, F." },
        { letter: "B", text: "V, V, F, F." },
        { letter: "C", text: "F, V, F, V." },
        { letter: "D", text: "F, F, V, V." }
      ],
      correctAnswer: "C",
      explanation: {
        correct: "A sequência correta é F, V, F, V. O primeiro item é falso porque a poluição urbana decorre de múltiplos agentes, incluindo indústrias e saneamento deficiente, não sendo 'exclusiva dos pobres'. O terceiro item é falso porque Manaus, Fortaleza e Curitiba são metrópoles influentes regionalmente, mas NÃO desbancaram ou rebaixaram o tradicional comando global de São Paulo e Rio de Janeiro na rede urbana nacional.",
        incorrect: {
          A: "Incorreta. Considera verdadeiras afirmativas com vieses excludentes ou análises de rede urbana equivocadas.",
          B: "Incorreta. Ignora a falsidade do primeiro e do terceiro item.",
          D: "Incorreta. Considera falsa a descrição clássica e verídica da segregação e fragmentação socioespacial residencial brasileira."
        },
        pegadinha: "Vieses sociais elitistas culpando unicamente a população vulnerável pela poluição são distratores recorrentes. Além disso, as metrópoles regionais crescem muito, mas a hierarquia de comando ainda é amplamente centrada nas metrópoles globais (SP/RJ).",
        revisao: "Urbanização Brasileira: Rede Urbana, Metropolização, Segregação Socioespacial e Impactos Ambientais."
      }
    },
    {
      question: "[FUNECE / UECE] Sob o impacto dos processos de globalização que 'comprimiram' o espaço e o tempo na transição para o século XXI, o geógrafo Rogério Haesbaert indaga se o mundo estaria vivenciando um processo de 'desterritorialização'. No debate geográfico contemporâneo sobre territorialização, desterritorialização e reterritorialização, conclui-se corretamente que existe:",
      options: [
        { letter: "A", text: "Uma tendência definitiva ao enfraquecimento absoluto e desaparecimento de qualquer controle territorial, em consequência da aceleração das velocidades na sociedade em movimento." },
        { letter: "B", text: "O predomínio completo da fluidez virtual sobre a estabilidade espacial, resultando em uma sociedade de fluxos instantâneos sem qualquer necessidade de bases materiais ou físicas terrestres." },
        { letter: "C", text: "Um esvaziamento completo e irreversível dos territórios locais devido à hibridização cultural global e à perda generalizada de identidades regionais e nacionais." },
        { letter: "D", text: "A constituição de uma multiplicidade complexa de territorialidades (multiterritorialidade), que engloba desde os limites físicos e fixos do gueto até as estruturas flexíveis de territórios-rede." }
      ],
      correctAnswer: "D",
      explanation: {
        correct: "A alternativa D está correta. Rogério Haesbaert defende que a 'desterritorialização' é um mito se entendida como perda de territórios. O que ocorre, na verdade, é uma complexificação e diversificação do território, caracterizando a MULTITERRITORIALIDADE, na qual sujeitos transitam entre territórios-rede flexíveis e territórios-zona fixos.",
        incorrect: {
          A: "Incorreta. O controle territorial não desaparece; ele apenas se reorganiza em novas formas corporativas ou estatais de poder.",
          B: "Incorreta. Todos os fluxos virtuais exigem uma densa infraestrutura material física de cabos de fibra óptica, servidores e energia.",
          C: "Incorreta. O local reage ativamente à globalização, gerando revalorizações identitárias e culturais específicas."
        },
        pegadinha: "Evite assinalar alternativas radicais e niilistas na geografia de Milton Santos e Haesbaert. A globalização cria novas redes, mas não elimina a necessidade existencial e o poder soberano exercido nos territórios concretos.",
        revisao: "Geografia Política: Globalização, Território, Territorialidades e Multiterritorialidade."
      }
    }
  ],
  comuns: [
    {
      question: "[FUNECE / UECE] Leia o período a seguir: 'Embora o planejamento escolar seja essencial, muitos professores alegam que a falta de tempo impossibilita a reflexão profunda sobre suas práticas pedagógicas.'\n\nA oração iniciada pela conjunção 'Embora' estabelece com a oração principal uma relação de sentido de:",
      options: [
        { letter: "A", text: "Concessão, indicando uma ideia de contraste ou compensação em relação à principal." },
        { letter: "B", text: "Causa, justificando o motivo pelo qual os professores não conseguem refletir." },
        { letter: "C", text: "Condição, expressando uma premissa indispensável para que o planejamento ocorra." },
        { letter: "D", text: "Consequência, apresentando o resultado direto de as práticas pedagógicas falharem." }
      ],
      correctAnswer: "A",
      explanation: {
        correct: "A conjunção subordinativa 'embora' introduz uma oração subordinada adverbial concessiva, que expressa um contraste ou oposição em relação à oração principal, sem, contudo, invalidar ou impedir a sua realização.",
        incorrect: {
          B: "Incorreta. Conjunções causais seriam 'porque', 'visto que', 'já que'.",
          C: "Incorreta. Conjunções condicionais seriam 'se', 'caso', 'contanto que'.",
          D: "Incorreta. Conjunções consecutivas seriam 'de modo que', 'de sorte que', 'tanto que'."
        },
        pegadinha: "A banca FUNECE costuma cobrar o valor semântico de conjunções (adversativas, concessivas, condicionais). Concessão indica um obstáculo superado, uma quebra de expectativa esperada.",
        revisao: "Orações Subordinadas Adverbiais Concessivas e Conjunções Coordenativas e Subordinativas."
      }
    },
    {
      question: "[FUNECE / UECE] Um professor organizou seu cronograma de modo que a cada 3 dias ele estuda Legislação e a cada 5 dias ele pratica questões de Conhecimentos Específicos. Se hoje ele realizou ambas as atividades conjuntamente, após quantos dias ele voltará a coincidir as duas rotinas no mesmo dia?",
      options: [
        { letter: "A", text: "Após 8 dias." },
        { letter: "B", text: "Após 15 dias." },
        { letter: "C", text: "Após 30 dias." },
        { letter: "D", text: "Após 12 dias." }
      ],
      correctAnswer: "B",
      explanation: {
        correct: "Este é um clássico problema de Mínimo Múltiplo Comum (MMC). Como os números 3 e 5 são primos entre si, o MMC(3, 5) = 3 * 5 = 15. Portanto, as duas atividades coincidirão novamente a cada 15 dias.",
        incorrect: {
          A: "Incorreta. 8 é apenas a soma direta de 3 e 5, não o menor múltiplo comum.",
          C: "Incorreta. 30 é um múltiplo comum, mas não é o mínimo (menor intervalo).",
          D: "Incorreta. 12 não é divisível por 5."
        },
        pegadinha: "Cuidado ao confundir problemas de encontros simultâneos periódicos (MMC) com problemas de contagem ou divisibilidade simples.",
        revisao: "Mínimo Múltiplo Comum (MMC) e aplicações práticas de lógica matemática."
      }
    }
  ]
};

function getEspecificoKey(discipline: string): string {
  const discLower = (discipline || "").toLowerCase();
  if (discLower.includes("matemá") || discLower.includes("matema")) return "especifico_matematica";
  if (discLower.includes("biol")) return "especifico_biologia";
  if (discLower.includes("sociol")) return "especifico_sociologia";
  if (discLower.includes("hist")) return "especifico_historia";
  if (discLower.includes("geo")) return "especifico_geografia";
  if (discLower.includes("port") || discLower.includes("língua") || discLower.includes("lingua")) return "especifico_portugues";
  return "especifico_geral";
}

export function getLocalFallbackQuestion(category: string, topicName: string, discipline: string, banca: string): Question {
  // Map selected category to keys
  let catKey = "legislacao";
  if (category === "didatica") catKey = "didatica";
  else if (category === "ceara") catKey = "ceara";
  else if (category === "comuns") catKey = "comuns";
  else if (category === "especifico") {
    catKey = getEspecificoKey(discipline);
  } else {
    // If mixed, pick a random category
    const keys = ["legislacao", "didatica", "ceara", "comuns", getEspecificoKey(discipline)];
    catKey = keys[Math.floor(Math.random() * keys.length)];
  }

  const list = FALLBACK_QUESTIONS[catKey] || FALLBACK_QUESTIONS.legislacao;
  // Pick a random question from list
  const baseQuestion = list[Math.floor(Math.random() * list.length)];

  // Personalize question a bit with the user's variables so it looks customized!
  const personalizedQuestion = { ...baseQuestion };
  
  // Custom substitution if topic is not matching exactly
  if (topicName && topicName !== "Conhecimentos Gerais & Legislação" && !personalizedQuestion.question.includes(topicName)) {
    // We can inject a subtle mention of the topic and discipline to make it perfectly integrated
    personalizedQuestion.question = `[TÓPICO: ${topicName}] ` + personalizedQuestion.question;
  }

  // Inject user's custom disciplines and banca where applicable
  if (banca && personalizedQuestion.question.includes("IDECAN") && banca !== "IDECAN") {
    personalizedQuestion.question = personalizedQuestion.question.replace(/IDECAN/g, banca);
    personalizedQuestion.explanation.pegadinha = personalizedQuestion.explanation.pegadinha.replace(/IDECAN/g, banca);
  }

  return personalizedQuestion;
}
