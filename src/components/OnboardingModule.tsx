import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "../types";
import { 
  GraduationCap, 
  User, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  Briefcase,
  Upload,
  FileText,
  X,
  CalendarDays
} from "lucide-react";
import { motion } from "motion/react";

interface OnboardingModuleProps {
  onComplete: (data: {
    name: string;
    gender: string;
    age: number;
    isTeacher: string;
    studyHours: number;
    discipline: string;
    examDate?: string;
    studyStartDate?: string;
    hasEdital?: boolean;
    editalFileName?: string;
    editalTopics?: string[];
  }) => void;
}

export default function OnboardingModule({ onComplete }: OnboardingModuleProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [isTeacher, setIsTeacher] = useState("");
  const [studyHours, setStudyHours] = useState<number>(3);
  const [discipline, setDiscipline] = useState("Matemática");
  const [error, setError] = useState("");

  const [examDate, setExamDate] = useState("");
  const [studyStartDate, setStudyStartDate] = useState(() => {
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();
    const adjustedDate = new Date(localDate.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [processedTopics, setProcessedTopics] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCustomTopicsForDiscipline = (disc: string): string[] => {
    switch (disc) {
      case "Matemática":
        return [
          "[Edital] Álgebra, Funções (Exponenciais, Logarítmicas, Trigonométricas) e Progressões (PA e PG)",
          "[Edital] Geometria Euclidiana Plana e Espacial, Áreas, Volumes e Trigonometria",
          "[Edital] Geometria Analítica Avançada (Cônicas, Retas, Circunferência) e Números Complexos",
          "[Edital] Análise Combinatória, Probabilidade, Estatística Descritiva e Sistemas Lineares",
          "[Edital] Didática da Matemática: Transposição didática e competências dos PCN"
        ];
      case "Sociologia":
        return [
          "[Edital] Contexto histórico do surgimento da Sociologia: Racionalismo, Empirismo, Iluminismo",
          "[Edital] Teóricos Clássicos da Sociologia: Émile Durkheim, Karl Marx e Max Weber",
          "[Edital] Estrutura Social, Instituições Sociais, Socialização, Classes, Estratificação e Desigualdades",
          "[Edital] Problemas Contemporâneos: Gênero, Violência, Juventude, Mídia, Trabalho e Globalização",
          "[Edital] Ensino de Sociologia: Metodologia de Ensino de Sociologia e Sociologia no Nordeste"
        ];
      case "História":
        return [
          "[Edital] Concepções do pensamento histórico, historiografia, memória e diversidade étnico-racial",
          "[Edital] História do Ceará: Pecuária, Jangadeiros, Oligarquias, Seca de 1915 e Campos de Concentração",
          "[Edital] Brasil Colonial e Império: Economia açucareira/cafeeira, escravidão e lutas sociais",
          "[Edital] Brasil República: Da Proclamação à Era Vargas, Ditadura Militar e Redemocratização",
          "[Edital] História Geral: Antiguidade Clássica, Feudalismo, Islamismo e Reinos Africanos"
        ];
      case "Língua Portuguesa":
        return [
          "[Edital] Relações contextuais e intertextuais na Literatura Brasileira e autores cearenses",
          "[Edital] Escolas Literárias: Barroco, Romantismo, Realismo, Simbolismo, Modernismo e Contemporânea",
          "[Edital] Sintaxe Avançada: Modos de construção de orações, concordância e regência verbal/nominal",
          "[Edital] Leitura e Coesão: Relações coesivas, conectivos, propósitos do autor, coesão e coerência",
          "[Edital] Análise Linguística, Variação Linguística, Tecnologias de Comunicação e PCN"
        ];
      case "Biologia":
        return [
          "[Edital] Identidade dos Seres Vivos: Estrutura celular, organelas, divisão celular e evolução",
          "[Edital] Diversidade da Vida: Classificação dos cinco reinos, nomenclatura e biodiversidade",
          "[Edital] Anatomia e Fisiologia Humana: Sistemas digestório, respiratório, cardiovascular e outros",
          "[Edital] Transmissão da Vida: Genética mendeliana/molecular, Leis de Mendel e Biotecnologia",
          "[Edital] Ecologia e Ensino de Biologia: Cadeias alimentares, ciclos biogeoquímicos e bioma Caatinga"
        ];
      case "Geografia":
        return [
          "[Edital] Concepções do pensamento geográfico, sociedade, lugar, paisagem e territorialidade",
          "[Edital] Geopolítica e Globalização: Capitalismo, divisão do trabalho e economia mundial/brasileira",
          "[Edital] Geografia Física do Ceará e do Brasil: Relevo, clima (semiaridez), solos e hidrografia",
          "[Edital] Geografia da População e do Espaço Urbano/Agrário: Contrastes regionais e metropolização",
          "[Edital] Linguagem Cartográfica, Geoprocessamento, Metodologia de Ensino e Diretrizes PCN"
        ];
      case "Arte-Educação":
        return [
          "[Edital] A Arte na Educação para todos: Diretrizes LDB, PCN, RCB e tendências pedagógicas",
          "[Edital] Linguagens Artísticas e Estética: Artes visuais, música, dança e teatro",
          "[Edital] Artes Visuais no Brasil e Ceará: Do Barroco colonial aos movimentos do século XX",
          "[Edital] Artes Audiovisuais e Novas Linguagens: TV, cinema, fotografia e recursos tecnológicos",
          "[Edital] História da Música e do Teatro no Brasil/Ceará, Ensino de Música (Lei 11.769/2009)"
        ];
      case "Educação Física":
        return [
          "[Edital] Histórico da Educação Física, concepções metodológicas e linguagem corporal",
          "[Edital] Processo ensino-aprendizagem, avaliação e fundamentos didático-pedagógicos",
          "[Edital] Atividade Física e Saúde: Crescimento, desenvolvimento e fisiologia do exercício",
          "[Edital] Educação Física e Sociedade: Aspectos sócio-históricos, cultura e políticas",
          "[Edital] Diretrizes dos Parâmetros Curriculares Nacionais (PCN) para Educação Física"
        ];
      case "Filosofia":
        return [
          "[Edital] A emergência da filosofia grega: Filosofia, cidade, democracia e narrativas míticas",
          "[Edital] Ética e Felicidade na antiguidade e modernidade (Platão, Aristóteles, Spinoza, Nietzsche)",
          "[Edital] Ética, autonomia da razão e dignidade em Immanuel Kant e contextualização histórica",
          "[Edital] Teorias do Conhecimento e Ciência: Racionalismo (Descartes) e Empirismo (Bacon)",
          "[Edital] Experiência Estética (Hegel, Gadamer, Adorno, Horkheimer) e Ensino de Filosofia"
        ];
      case "Física":
        return [
          "[Edital] História e evolução das ideias da Física: Cosmologia antiga, Galileu/Newton e Relatividade",
          "[Edital] Mecânica Escalar e Vetorial: Leis de Newton, Trabalho, Energia, Estática e Gravitação",
          "[Edital] Termodinâmica e Ondulatória: Calorimetria, termodinâmica, ondas e óptica geométrica/física",
          "[Edital] Eletromagnetismo: Lei de Coulomb, potencial elétrico, circuitos, campo magnético e Faraday",
          "[Edital] Física Moderna: Relatividade especial, teoria quântica e física nuclear"
        ];
      case "Química":
        return [
          "[Edital] História da Química, leis ponderais, cálculos estequiométricos e reações químicas",
          "[Edital] Estrutura Atômica e Tabela Periódica: Modelos atômicos, propriedades periódicas, ligações",
          "[Edital] Estados Físicos e Soluções: Comportamento dos gases, forças intermoleculares e coligativas",
          "[Edital] Físico-Química: Termoquímica, cinética química, catalisadores e equilíbrio químico",
          "[Edital] Química Orgânica (nomenclatura, funções e reações) e Didática da Química"
        ];
      case "Língua Espanhola":
        return [
          "[Edital] Leitura, compreensão e interpretação de textos literários e informativos em Espanhol",
          "[Edital] Estratégias de leitura avançadas, falsos amigos (heterosemánticos) e vocabulário",
          "[Edital] Aspectos Morfossintáticos: Alfabeto, substantivos, pronomes, artigos (neutro lo) e preposições",
          "[Edital] Morfologia Verbal: Conjugação e uso de verbos regulares e irregulares e perífrases",
          "[Edital] Língua, cultura e sociedade, tratamento da produção escrita e PCN de Espanhol"
        ];
      case "Língua Inglesa":
        return [
          "[Edital] Leitura, compreensão e interpretação de textos acadêmicos, literários e informativos",
          "[Edital] Estratégias de leitura aplicadas (skimming, scanning) e identificação de termos",
          "[Edital] Aspectos Gramaticais: Tempos/modos verbais, voz passiva, condicionais e modais",
          "[Edital] Sintaxe e Morfologia: Pronomes, adjetivos (comparativo/superlativo), preposições",
          "[Edital] Sociolinguística: Relação entre língua, cultura e sociedade e diretrizes dos PCN"
        ];
      case "Libras":
        return [
          "[Edital] História da Educação de Surdos, teorias de aprendizagem e bilinguismo",
          "[Edital] Identidades Surdas, cultura surda, comunidade e aspectos sócio-antropológicos",
          "[Edital] Políticas Públicas de Inclusão Escolar, legislação de acessibilidade e papel do Intérprete",
          "[Edital] Estrutura Linguística da Libras: Fonologia, Morfologia e Sintaxe",
          "[Edital] Semântica e Pragmática aplicadas à Libras e metodologia de ensino como L1/L2"
        ];
      default:
        return [
          "[Edital] Tendências pedagógicas, transposição didática e metodologia aplicada",
          "[Edital] Análise de recursos didáticos, novas tecnologias e planejamento curricular na rede",
          "[Edital] Avaliação formativa, diagnóstica e somativa no Ensino Médio",
          "[Edital] Competências e Habilidades propostas pelas diretrizes do Ceará (DCC)"
        ];
    }
  };

  useEffect(() => {
    if (attachedFile) {
      setProcessedTopics(generateCustomTopicsForDiscipline(discipline));
    } else {
      setProcessedTopics([]);
    }
  }, [discipline, attachedFile]);

  const handleFileChange = (file: File) => {
    setAttachedFile(file);
    setIsProcessingFile(true);
    setTimeout(() => {
      setIsProcessingFile(false);
      setProcessedTopics(generateCustomTopicsForDiscipline(discipline));
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Por favor, digite seu nome.");
      return;
    }
    if (!gender) {
      setError("Por favor, selecione seu gênero.");
      return;
    }
    if (!age || Number(age) <= 0) {
      setError("Por favor, insira uma idade válida.");
      return;
    }
    if (!isTeacher) {
      setError("Por favor, responda se você já atua como professor.");
      return;
    }

    onComplete({
      name: name.trim(),
      gender,
      age: Number(age),
      isTeacher,
      studyHours,
      discipline,
      examDate: examDate || undefined,
      studyStartDate: studyStartDate || undefined,
      hasEdital: !!attachedFile,
      editalFileName: attachedFile ? attachedFile.name : undefined,
      editalTopics: processedTopics.length > 0 ? processedTopics : undefined
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  } as const;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-50/40 rounded-full filter blur-3xl -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xl shadow-slate-100/50"
      >
        {/* Header Logo & Welcomes */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-gradient-to-tr from-emerald-600 to-emerald-500 rounded-2xl items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Seja bem-vindo ao <span className="text-emerald-600">Aprova Seduc</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Personalize sua experiência para que nossa mentoria pedagógica e cronograma de estudos preparem o plano ideal para sua aprovação no concurso Seduc-CE.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* Nome Completo */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Seu Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Maria Silva"
                className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-100 focus:border-emerald-500 rounded-2xl p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-medium"
              />
            </motion.div>

            {/* Sexo e Idade em Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  Gênero / Sexo
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-100 focus:border-emerald-500 rounded-2xl p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-medium appearance-none cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não responder">Prefiro não responder</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Idade (anos)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Ex: 32"
                  min="18"
                  max="100"
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-100 focus:border-emerald-500 rounded-2xl p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-medium"
                />
              </div>
            </motion.div>

            {/* Já Atua como Professor */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Já atua como professor em sala de aula?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "yes_public", label: "Sim, na rede pública" },
                  { id: "yes_private", label: "Sim, na rede privada" },
                  { id: "no", label: "Ainda não atuo" }
                ].map((option) => {
                  const selected = isTeacher === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setIsTeacher(option.id)}
                      className={`p-3.5 rounded-2xl text-xs font-bold border transition-all text-center flex items-center justify-center ${
                        selected
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm"
                          : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Disciplina de Foco e Horas de Estudo em Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Sua Área / Disciplina
                </label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-100 focus:border-emerald-500 rounded-2xl p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-medium cursor-pointer"
                >
                  <option value="Sociologia">Sociologia</option>
                  <option value="Matemática">Matemática</option>
                  <option value="História">História</option>
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Biologia">Biologia</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Arte-Educação">Arte-Educação</option>
                  <option value="Educação Física">Educação Física</option>
                  <option value="Filosofia">Filosofia</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                  <option value="Língua Espanhola">Língua Espanhola</option>
                  <option value="Língua Inglesa">Língua Inglesa</option>
                  <option value="Libras">Libras</option>
                  <option value="Geral / Outros">Geral / Outros</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Tempo de Estudo Diário
                  </span>
                  <span className="text-emerald-600 font-mono text-xs">{studyHours} {studyHours === 1 ? 'hora' : 'horas'}</span>
                </label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-2.5">
                  {[1, 2, 3, 4, 5, 6].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setStudyHours(h)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        studyHours === h
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* NOVO: Data da Prova e Anexo do Edital */}
            <motion.div variants={itemVariants} className="border-t border-slate-100 pt-5 mt-5 space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-600 animate-pulse" />
                Planejamento do Concurso (Opcional)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Informe a data prevista da prova e anexe o edital para que possamos estruturar seu conteúdo programático personalizado e distribuir os tópicos até o grande dia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Data de Início dos Estudos */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Início dos Estudos
                  </label>
                  <input
                    type="date"
                    value={studyStartDate}
                    onChange={(e) => setStudyStartDate(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-100 focus:border-emerald-500 rounded-2xl p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-medium cursor-pointer font-sans"
                  />
                </div>

                {/* Data da Prova */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Previsão da Prova
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-100 focus:border-emerald-500 rounded-2xl p-4 text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-medium cursor-pointer font-sans"
                  />
                </div>
              </div>

              {/* Anexo de Edital */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Anexar Edital / Conteúdo
                </label>
                
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      handleFileChange(files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[105px] ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-50/30"
                      : attachedFile
                      ? "border-emerald-500 bg-emerald-50/10"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                  }`}
                >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleFileChange(files[0]);
                        }
                      }}
                      accept=".pdf,.txt,.doc,.docx"
                      className="hidden"
                    />

                    {isProcessingFile ? (
                      <div className="space-y-2 flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[11px] font-bold text-emerald-800 animate-pulse">Lendo conteúdo do edital...</p>
                      </div>
                    ) : attachedFile ? (
                      <div className="space-y-1 w-full flex flex-col items-center">
                        <FileText className="w-6 h-6 text-emerald-600" />
                        <p className="text-xs font-bold text-emerald-800 truncate max-w-[200px]">{attachedFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAttachedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="text-[10px] text-rose-500 hover:text-rose-700 font-bold underline mt-1"
                        >
                          Remover arquivo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                        <p className="text-[11px] font-bold text-slate-600">Arraste o edital aqui ou clique</p>
                        <p className="text-[9px] text-slate-400 font-medium">Aceita PDF, TXT ou Word (Opcional)</p>
                      </div>
                    )}
                  </div>
                </div>

              {/* Se o Edital foi processado, mostrar os tópicos identificados com animação */}
              {processedTopics.length > 0 && !isProcessingFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4.5 space-y-2"
                >
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-600 fill-emerald-100" />
                    Edital Mapeado por Inteligência Artificial!
                  </p>
                  <p className="text-slate-600 text-xxs leading-relaxed">
                    Identificamos {processedTopics.length} blocos programáticos prioritários no arquivo anexado. Nós reconstruímos seu cronograma até {examDate ? new Date(examDate + "T12:00:00").toLocaleDateString('pt-BR') : "a data da prova"}!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
                    {processedTopics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-semibold text-slate-750 bg-white/80 border border-emerald-100/50 rounded-lg p-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="truncate">{topic}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-4.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 transition-all"
          >
            <Sparkles className="w-5 h-5 fill-white/10" />
            <span>Criar Meu Perfil de Estudos</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
