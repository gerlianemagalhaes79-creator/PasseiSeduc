import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Question, UserProfile, StudyTopic, Flashcard } from "../types";
import { BookOpen, Sparkles, AlertCircle, HelpCircle, ArrowRight, CheckCircle2, XCircle, RotateCcw, Lightbulb, Layers, Flame, RotateCw, Award, Brain, Save } from "lucide-react";
import { getLocalFallbackQuestion } from "../data/fallbackQuestions";

interface SimulatorProps {
  profile: UserProfile;
  topics: StudyTopic[];
  onAnswerRecorded: (category: string, isCorrect: boolean, timeSpent: number, topicName?: string) => void;
  currentTopic?: string;
  setCurrentTopic?: (topic: string) => void;
  flashcards?: Flashcard[];
  onSaveFlashcard?: (flashcard: Omit<Flashcard, "id" | "createdAt">) => void;
  onOpenFlashcards?: () => void;
}

export default function SimulatorModule({ 
  profile, 
  topics, 
  onAnswerRecorded, 
  currentTopic, 
  setCurrentTopic,
  flashcards = [],
  onSaveFlashcard,
  onOpenFlashcards
}: SimulatorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("mixed");
  const [selectedTopicName, setSelectedTopicName] = useState<string>("Conhecimentos Gerais & Legislação");
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [errorWarning, setErrorWarning] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [flashcardSaved, setFlashcardSaved] = useState(false);

  const lastGeneratedTopicRef = React.useRef<string | null>(null);

  // Pre-fetching states
  const [preFetchedQuestion, setPreFetchedQuestion] = useState<Question | null>(null);
  const [preFetchedTopic, setPreFetchedTopic] = useState<string | null>(null);
  const [preFetchLoading, setPreFetchLoading] = useState<boolean>(false);

  // Rotating loading messages
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const loadingMessages = [
    "Analisando o Edital da Seduc-CE 2026...",
    "Consultando a legislação e diretrizes curriculares...",
    "Modelando alternativas no estilo exato da banca...",
    "Estruturando pegadinhas e cascas de banana típicas...",
    "Preparando feedback neurocognitivo do Professor Mentor...",
    "Ajustando nível de complexidade teórico-prático..."
  ];

  const getTargetDisciplineForTopic = (topicName: string, category: string, userDiscipline: string): string => {
    if (category === "especifico") {
      return userDiscipline;
    }
    if (category === "comuns") {
      return "Língua Portuguesa";
    }
    if (category === "legislacao") {
      return "Legislação Educacional e Administração Pública";
    }
    if (category === "didatica") {
      return "Temas Educacionais e Pedagógicos (Didática)";
    }
    if (category === "ceara") {
      return "Leitura e Interpretação de Dados e Indicadores Educacionais";
    }
    return "Didática e Legislação";
  };

  const getHierarchyForTopic = (topicName: string, category: string, userDiscipline: string): string => {
    switch (category) {
      case "comuns":
        return `Conhecimentos Básicos -> Língua Portuguesa -> ${topicName}`;
      case "legislacao":
        return `Conhecimentos Básicos -> Administração Pública e Legislação Básica -> ${topicName}`;
      case "didatica":
        return `Conhecimentos Básicos -> Temas Educacionais e Pedagógicos (Didática) -> ${topicName}`;
      case "ceara":
        return `Conhecimentos Básicos -> Leitura e Interpretação de Dados e Indicadores Educacionais -> ${topicName}`;
      case "especifico":
        return `Conhecimentos Específicos -> ${userDiscipline} -> ${topicName}`;
      default:
        return `Conhecimentos Gerais -> ${topicName}`;
    }
  };

  const triggerPreFetch = async (topicName: string) => {
    if (preFetchLoading) return;
    if (preFetchedQuestion && preFetchedTopic === topicName) return;

    setPreFetchLoading(true);
    let fetchUrl = "/api/generate-question";
    try {
      fetchUrl = new URL("/api/generate-question", window.location.origin).href;
    } catch (urlErr) {
      fetchUrl = "/api/generate-question";
    }

    try {
      const matchedTopic = topics.find(t => t.name === topicName);
      const category = matchedTopic ? matchedTopic.category : "mixed";
      const targetDiscipline = getTargetDisciplineForTopic(topicName, category, profile.discipline);
      const hierarchy = getHierarchyForTopic(topicName, category, profile.discipline);

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          topic: topicName,
          topicId: matchedTopic?.id || "",
          category: category,
          discipline: targetDiscipline,
          userDiscipline: profile.discipline,
          banca: profile.banca,
          hierarchy: hierarchy
        })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setPreFetchedQuestion(result.data);
        setPreFetchedTopic(topicName);
      }
    } catch (error) {
      console.error("Error pre-fetching question in background:", error);
    } finally {
      setPreFetchLoading(false);
    }
  };

  // Group topics for select dropdown or category filters
  const legislationTopics = topics.filter(t => t.category === "legislacao");
  const didaticaTopics = topics.filter(t => t.category === "didatica");
  const cearaTopics = topics.filter(t => t.category === "ceara");
  const comunsTopics = topics.filter(t => t.category === "comuns");
  const especificoTopics = topics.filter(t => t.category === "especifico");

  // Pre-fetch when selected topic changes
  React.useEffect(() => {
    if (selectedTopicName) {
      if (preFetchedTopic !== selectedTopicName) {
        setPreFetchedQuestion(null);
        setPreFetchedTopic(null);
      }
      triggerPreFetch(selectedTopicName);
    }
  }, [selectedTopicName, profile.discipline, profile.banca]);

  // Rotate loading messages when loading is active
  React.useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingMessageIdx(0);
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 1800);
    }
    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  // Auto-start generation when currentTopic matches a specific study focus
  React.useEffect(() => {
    if (currentTopic && currentTopic !== "Legislação Educacional Geral e Didática" && currentTopic !== "Conhecimentos Gerais & Legislação") {
      const matchedTopic = topics.find(t => t.name === currentTopic);
      if (matchedTopic && lastGeneratedTopicRef.current !== matchedTopic.name) {
        setSelectedCategory(matchedTopic.category);
        setSelectedTopicName(matchedTopic.name);
        startGeneration(matchedTopic.id, matchedTopic.name);
      }
    }
  }, [currentTopic]);

  const startGeneration = async (topicId: string, topicName: string) => {
    if (loading) return;

    let actualTopicName = topicName;
    let actualTopicId = topicId;

    if (topicId === "mixed" || topicName === "Conhecimentos Gerais & Legislação") {
      const eligibleTopics = topics.filter(t => t.name !== "Conhecimentos Gerais & Legislação" && t.name !== "Legislação Educacional Geral e Didática");
      if (eligibleTopics.length > 0) {
        const randomTopic = eligibleTopics[Math.floor(Math.random() * eligibleTopics.length)];
        actualTopicName = randomTopic.name;
        actualTopicId = randomTopic.id;
        
        // Update states so we track the selected topic name!
        setSelectedTopicName(randomTopic.name);
        if (setCurrentTopic) {
          setCurrentTopic(randomTopic.name);
        }
      }
    }

    lastGeneratedTopicRef.current = actualTopicName;

    // Use pre-fetched question if available for this exact topic
    if (preFetchedQuestion && preFetchedTopic === actualTopicName) {
      setCurrentQuestion(preFetchedQuestion);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsCardFlipped(false);
      setFlashcardSaved(false);
      setErrorWarning(null);
      setStartTime(Date.now());
      
      // Clear/consume the pre-fetched question
      setPreFetchedQuestion(null);
      setPreFetchedTopic(null);

      if (setCurrentTopic && currentTopic !== actualTopicName) {
        setCurrentTopic(actualTopicName);
      }
      return;
    }

    setLoading(true);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCardFlipped(false);
    setFlashcardSaved(false);
    setErrorWarning(null);
    setStartTime(Date.now());

    if (setCurrentTopic && currentTopic !== actualTopicName) {
      setCurrentTopic(actualTopicName);
    }

    let fetchUrl = "/api/generate-question";
    try {
      fetchUrl = new URL("/api/generate-question", window.location.origin).href;
    } catch (urlErr) {
      fetchUrl = "/api/generate-question";
    }

    try {
      const matchedTopic = topics.find(t => t.name === actualTopicName);
      const category = matchedTopic ? matchedTopic.category : selectedCategory;
      const targetDiscipline = getTargetDisciplineForTopic(actualTopicName, category, profile.discipline);
      const hierarchy = getHierarchyForTopic(actualTopicName, category, profile.discipline);

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          topic: actualTopicName,
          topicId: matchedTopic?.id || actualTopicId,
          category: category,
          discipline: targetDiscipline,
          userDiscipline: profile.discipline,
          banca: profile.banca,
          hierarchy: hierarchy
        })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setCurrentQuestion(result.data);
        if (result.isFallback) {
          console.log(result.warning || "Modo de contingência local ativo.");
        }
      } else {
        throw new Error("Erro de resposta do servidor");
      }
    } catch (error: any) {
      console.error("Error fetching question:", error);
      const fallback = getLocalFallbackQuestion(actualTopicId, actualTopicName, profile.discipline, profile.banca);
      setCurrentQuestion(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopicAndGenerate = (catId: string, topicName: string) => {
    setSelectedCategory(catId);
    setSelectedTopicName(topicName);
    if (setCurrentTopic) {
      setCurrentTopic(topicName);
    }
    const matchedTopic = topics.find(t => t.name === topicName);
    startGeneration(matchedTopic?.id || catId, topicName);
  };

  const handleAnswerClick = (letter: string) => {
    if (selectedAnswer) return; // Prevent multiple clicks
    setSelectedAnswer(letter);
    setShowExplanation(true);

    const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 10;
    const isCorrect = letter === currentQuestion?.correctAnswer;

    // Record progress dynamically based on the actual selectedTopicName
    const matchedTopic = topics.find((t) => t.name === selectedTopicName);
    const category = matchedTopic ? matchedTopic.category : "didatica";

    onAnswerRecorded(category, isCorrect, timeSpent, selectedTopicName);

    // Pre-fetch the next question of the same topic in the background!
    triggerPreFetch(selectedTopicName);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Compact Top Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-3xs space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-50 text-emerald-850 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-100">
              Filtro de Conteúdo
            </span>
            <span className="text-slate-400 text-[10px] font-bold">
              Foco: {profile.banca}
            </span>
            {onOpenFlashcards && (
              <button
                onClick={onOpenFlashcards}
                className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xxs transition-all flex items-center gap-1.5 cursor-pointer ml-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Estudar Flashcards ({flashcards.length})</span>
              </button>
            )}
          </div>
          
          {/* Stats: total questions, correct rate */}
          <div className="flex items-center gap-4 text-[10px] font-extrabold text-slate-500">
            <span className="flex items-center gap-1.5">
              Total Respondidas: <span className="text-slate-800 font-mono font-black">{profile.totalQuestions}</span>
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1.5">
              Taxa de Acerto: <span className="text-emerald-600 font-mono font-black">{profile.totalQuestions > 0 ? `${Math.round((profile.totalCorrect / profile.totalQuestions) * 100)}%` : "0%"}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
          {/* Category buttons in a row */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: "mixed", label: "Misto Geral" },
              { id: "legislacao", label: "Legislação" },
              { id: "didatica", label: "Didática" },
              { id: "ceara", label: "Seduc-CE" },
              { id: "comuns", label: "Port. / Mat." },
              { id: "especifico", label: profile.discipline || "Específica" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  let tName = "Conhecimentos Gerais & Legislação";
                  if (cat.id === "legislacao") tName = legislationTopics[0]?.name || "LDB (Lei nº 9.394/1996) e suas atualizações";
                  else if (cat.id === "didatica") tName = didaticaTopics[0]?.name || "Planejamento Didático: Objetivos, Conteúdos, Métodos e Recursos";
                  else if (cat.id === "ceara") tName = cearaTopics[0]?.name || "Estatuto do Magistério do Ceará (Lei nº 10.884/1984)";
                  else if (cat.id === "comuns") tName = comunsTopics[0]?.name || "Língua Portuguesa: Leitura, Compreensão e Interpretação de Textos (Básico)";
                  else if (cat.id === "especifico") {
                    tName = especificoTopics[0]?.name || `Conhecimentos Específicos: ${profile.discipline}`;
                  }
                  handleSelectTopicAndGenerate(cat.id, tName);
                }}
                className={`px-3 py-1.5 text-xxs font-bold rounded-lg cursor-pointer transition-all ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-xs font-black"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Inline dropdown selector for subtopics */}
          {selectedCategory !== "mixed" && (
            <div className="flex-1 min-w-[200px]">
              {selectedCategory === "legislacao" && (
                <select
                  value={selectedTopicName}
                  onChange={(e) => handleSelectTopicAndGenerate(selectedCategory, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg py-1 px-2.5 text-xxs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {legislationTopics.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              )}
              {selectedCategory === "didatica" && (
                <select
                  value={selectedTopicName}
                  onChange={(e) => handleSelectTopicAndGenerate(selectedCategory, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg py-1 px-2.5 text-xxs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {didaticaTopics.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              )}
              {selectedCategory === "ceara" && (
                <select
                  value={selectedTopicName}
                  onChange={(e) => handleSelectTopicAndGenerate(selectedCategory, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg py-1 px-2.5 text-xxs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {cearaTopics.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              )}
              {selectedCategory === "comuns" && (
                <select
                  value={selectedTopicName}
                  onChange={(e) => handleSelectTopicAndGenerate(selectedCategory, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg py-1 px-2.5 text-xxs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {comunsTopics.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              )}
              {selectedCategory === "especifico" && (
                <select
                  value={selectedTopicName}
                  onChange={(e) => handleSelectTopicAndGenerate(selectedCategory, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-lg py-1 px-2.5 text-xxs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {especificoTopics.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {currentQuestion && (
            <button
              onClick={() => startGeneration(selectedCategory, selectedTopicName)}
              disabled={loading}
              className="ml-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-850 border border-emerald-250 py-1.5 px-3 rounded-lg text-xxs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Próxima</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulator Board */}
      <div className="space-y-6">
        {errorWarning && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorWarning}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xs text-center py-20 flex flex-col items-center justify-center space-y-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
              </div>
              <p className="font-display font-semibold text-slate-700 text-base transition-all duration-300">
                {loadingMessages[loadingMessageIdx]}
              </p>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                O Professor Mentor está formatando um problema real no modelo da banca {profile.banca} sobre "{selectedTopicName}".
              </p>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key="question-board"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Question Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Banca: {profile.banca}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-mono">
                      Prof. Ceará 2026
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Disciplina: {profile.discipline}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-500 font-mono text-xs uppercase tracking-wider font-semibold">Enunciado</p>
                  <h3 className="font-sans text-base md:text-lg text-slate-800 leading-relaxed font-medium">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Alternatives */}
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedAnswer === option.letter;
                    const isCorrect = option.letter === currentQuestion.correctAnswer;
                    const showSuccess = selectedAnswer && isCorrect;
                    const showDanger = selectedAnswer && isSelected && !isCorrect;

                    let btnClass = "border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700 hover:bg-slate-50";
                    if (selectedAnswer) {
                      if (isCorrect) {
                        btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
                      } else if (isSelected) {
                        btnClass = "border-rose-400 bg-rose-50 text-rose-900";
                      } else {
                        btnClass = "border-slate-100 bg-white text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={option.letter}
                        onClick={() => handleAnswerClick(option.letter)}
                        disabled={!!selectedAnswer}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex gap-3 items-start ${btnClass}`}
                      >
                        <span className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-slate-800 text-white"
                            : showSuccess
                            ? "bg-emerald-600 text-white"
                            : showDanger
                            ? "bg-rose-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}>
                          {option.letter}
                        </span>
                        <span className="leading-relaxed font-sans">{option.text}</span>
                        
                        {selectedAnswer && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto shrink-0 mt-0.5" />
                        )}
                        {selectedAnswer && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 ml-auto shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Drawer (Neuroscience-based explanations) */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
                  >
                    <div className="p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-2.5 border-b border-slate-50 pb-4">
                        <div className={`p-2 rounded-lg ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-slate-800 text-base">
                            {selectedAnswer === currentQuestion.correctAnswer ? "Parabéns, Excelente Acerto! 🎉" : "Identificamos uma lacuna de conhecimento 🧠"}
                          </h4>
                          <p className="text-slate-400 text-xs">Análise neurocognitiva do Professor Mentor</p>
                        </div>
                      </div>

                      {/* Explanation details */}
                      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                          <h5 className="font-bold text-emerald-900 mb-1">Gabarito Comentado (Alternativa {currentQuestion.correctAnswer})</h5>
                          <p>{currentQuestion.explanation.correct}</p>
                        </div>

                        {/* Trap Banner */}
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                          <div className="bg-amber-100 text-amber-800 p-1.5 rounded-lg shrink-0 h-fit">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-amber-900 mb-0.5">⚠️ A Pegadinha da Banca ({profile.banca})</h5>
                            <p className="text-amber-800 text-xs">{currentQuestion.explanation.pegadinha}</p>
                          </div>
                        </div>

                        {/* EXCLUSIVE ERROR FEEDBACK: COMMENTARY, MINI-AULA & FLASHCARD */}
                        {selectedAnswer !== currentQuestion.correctAnswer && (
                          <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 pt-2"
                          >
                            {/* Error Commentary Block */}
                            <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-5 md:p-6 space-y-3 shadow-xs">
                              <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-rose-600 animate-pulse shrink-0" />
                                <h5 className="font-display font-bold text-rose-950 text-sm md:text-base">
                                  Por que você escolheu a Alternativa {selectedAnswer}?
                                </h5>
                              </div>
                              <p className="text-rose-900 text-sm leading-relaxed">
                                Você assinalou a opção <strong className="font-bold underline">{selectedAnswer}</strong>. 
                                O Professor Mentor analisou sua escolha: {currentQuestion.explanation.incorrect[selectedAnswer || ""] || "Esta opção contém distorções conceituais frequentes criadas pela banca para confundir candidatos."}
                              </p>
                              <div className="border-t border-rose-200/40 pt-3 flex items-start gap-2.5 text-xs text-rose-800">
                                <Brain className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                                <span>
                                  <strong>Dica do Mentor:</strong> Errar faz parte da jornada rumo à posse! Analisar o distrator de sua escolha ensina ao cérebro o caminho correto.
                                </span>
                              </div>
                            </div>

                            {/* Ask future teacher if they want to save this flashcard */}
                            <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl p-5 md:p-6 space-y-3 shadow-xxs flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h5 className="font-display font-black text-amber-950 text-sm flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                                  Futuro Professor, deseja salvar este Flashcard?
                                </h5>
                                <p className="text-amber-900 text-xs leading-relaxed max-w-md">
                                  Salvar este assunto criará um flashcard de fixação ativa automática do tema <strong className="font-bold">"{currentQuestion.explanation.revisao || selectedTopicName}"</strong> na sua seção de dificuldades.
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (onSaveFlashcard && !flashcardSaved) {
                                    onSaveFlashcard({
                                      topic: currentQuestion.explanation.revisao || selectedTopicName,
                                      front: `Qual é o conceito-chave cobrado pela banca ${profile.banca} sobre "${currentQuestion.explanation.revisao || selectedTopicName}"?`,
                                      back: currentQuestion.explanation.correct,
                                      pegadinha: currentQuestion.explanation.pegadinha,
                                      banca: profile.banca
                                    });
                                    setFlashcardSaved(true);
                                  }
                                }}
                                disabled={flashcardSaved}
                                className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs ${
                                  flashcardSaved 
                                    ? "bg-emerald-600 text-white border-none cursor-default"
                                    : "bg-amber-600 hover:bg-amber-700 text-white border-none"
                                }`}
                              >
                                {flashcardSaved ? (
                                  <>
                                    <CheckCircle2 className="w-4.5 h-4.5" />
                                    <span>Flashcard Salvo!</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4.5 h-4.5" />
                                    <span>Salvar na Minha Pasta ⚡</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Mini-Aula Box */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-xs">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -mr-6 -mt-6"></div>
                              <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
                                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                                  <BookOpen className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">Mini-Aula do Mentor</span>
                                  <h5 className="font-display font-bold text-slate-850 text-sm md:text-base">
                                    Tópico: {currentQuestion.explanation.revisao}
                                  </h5>
                                </div>
                              </div>

                              <div className="space-y-4 text-slate-700 text-xs md:text-sm leading-relaxed">
                                <div>
                                  <h6 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
                                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                                    Conceito Fundamental
                                  </h6>
                                  <p className="bg-white p-3.5 rounded-xl border border-slate-100 text-slate-600 shadow-3xs leading-relaxed">
                                    {currentQuestion.explanation.correct}
                                  </p>
                                </div>

                                <div>
                                  <h6 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
                                    <Flame className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                                    Evite as Pegadinhas da {profile.banca}
                                  </h6>
                                  <p className="bg-amber-50/50 border border-amber-100/50 p-3.5 rounded-xl text-amber-900 text-xs leading-relaxed">
                                    {currentQuestion.explanation.pegadinha}
                                  </p>
                                </div>

                                <div className="bg-emerald-50/60 border border-emerald-100/50 p-3.5 rounded-xl space-y-1.5">
                                  <h6 className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5" /> Resumo Estratégico de Memorização:
                                  </h6>
                                  <ul className="list-disc pl-4 space-y-1 text-xs text-emerald-800">
                                    <li>A alternativa de gabarito definitivo é a <strong className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-950 font-mono">{currentQuestion.correctAnswer}</strong>.</li>
                                    <li>Anote as palavras-chave do tópico para sua revisão ativa em 24 horas.</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Interactive Flash Card Component */}
                            <div className="space-y-3 pt-1">
                              <div className="text-center">
                                <h5 className="font-display font-bold text-slate-800 text-sm flex items-center justify-center gap-1.5">
                                  <Layers className="w-4 h-4 text-emerald-600" />
                                  Flash Card de Fixação Cognitiva ⚡
                                </h5>
                                <p className="text-[11px] text-slate-400">Toque no card para virar e testar sua capacidade de recuperação ativa!</p>
                              </div>

                              <div 
                                className="w-full max-w-sm mx-auto h-60 cursor-pointer relative"
                                style={{ perspective: "1000px" }}
                                onClick={() => setIsCardFlipped(!isCardFlipped)}
                              >
                                <motion.div
                                  className="w-full h-full relative"
                                  style={{ transformStyle: "preserve-3d" }}
                                  animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                                  transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                  {/* FRENTE DO FLASH CARD */}
                                  <div 
                                    className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 shadow-md flex flex-col justify-between text-white overflow-hidden"
                                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                                  >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -mr-8 -mt-8"></div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-mono tracking-wider font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-900/50 px-2 py-0.5 rounded-full uppercase">
                                        Frente • Pergunta Ativa 🧠
                                      </span>
                                      <Brain className="w-4 h-4 text-emerald-400" />
                                    </div>

                                    <div className="text-center py-3 space-y-2">
                                      <p className="text-slate-400 text-[9px] uppercase tracking-wider font-semibold">Tente responder mentalmente:</p>
                                      <h6 className="font-sans text-xs md:text-sm font-medium leading-relaxed px-1 text-slate-100">
                                        Qual é a regra ou diretriz basilar sobre "{currentQuestion.explanation.revisao}" cobrada pelo estilo {profile.banca}?
                                      </h6>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/50 py-2 rounded-xl border border-emerald-900/40 hover:bg-emerald-950/70 transition-colors">
                                      <RotateCw className="w-3.5 h-3.5" />
                                      Clique para Virar e Ver
                                    </div>
                                  </div>

                                  {/* VERSO DO FLASH CARD */}
                                  <div 
                                    className="absolute inset-0 w-full h-full rounded-2xl p-5 bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-600/30 shadow-md flex flex-col justify-between text-white overflow-hidden"
                                    style={{ 
                                      backfaceVisibility: "hidden", 
                                      WebkitBackfaceVisibility: "hidden",
                                      transform: "rotateY(180deg)" 
                                    }}
                                  >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl -mr-8 -mt-8"></div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-mono tracking-wider font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                                        Verso • Conceito Fixado 💡
                                      </span>
                                      <Lightbulb className="w-4 h-4 text-amber-300" />
                                    </div>

                                    <div className="py-1 space-y-2.5">
                                      <div>
                                        <p className="text-emerald-300 text-[9px] uppercase tracking-wider font-bold">Resposta do Flash Card:</p>
                                        <p className="font-sans text-xs text-emerald-50 leading-relaxed font-normal line-clamp-3">
                                          {currentQuestion.explanation.correct}
                                        </p>
                                      </div>
                                      <div className="border-t border-emerald-800/40 pt-1.5">
                                        <p className="text-amber-300 text-[9px] uppercase tracking-wider font-bold">Pegadinha a Evitar:</p>
                                        <p className="font-sans text-[10px] text-amber-100 leading-normal line-clamp-2">
                                          {currentQuestion.explanation.pegadinha}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-200 font-semibold bg-emerald-950/50 py-2 rounded-xl border border-emerald-800/30 hover:bg-emerald-950/70 transition-colors">
                                      <RotateCw className="w-3.5 h-3.5" />
                                      Clique para Virar Novamente
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Review suggestions */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <h5 className="font-bold text-slate-800 mb-1">🎯 Plano de Revisão Recomendado</h5>
                          <p className="text-slate-600 text-xs mb-2">Tópico: <span className="font-semibold text-emerald-600">{currentQuestion.explanation.revisao}</span></p>
                          <p className="text-xs text-slate-500">Agende uma revisão ativa para esse assunto nas próximas 24h utilizando autoexplicação ou flashcards.</p>
                        </div>

                        {/* Individual Distractors Analysis */}
                        <div className="space-y-3 pt-2">
                          <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Por que as outras estão incorretas?</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(currentQuestion.explanation.incorrect).map(([letter, text]) => (
                              <div key={letter} className="bg-slate-50/40 border border-slate-100 p-3.5 rounded-xl text-xs">
                                <span className="font-bold font-mono text-slate-800 mr-2 bg-slate-200/60 px-1.5 py-0.5 rounded">
                                  {letter}
                                </span>
                                <span className="text-slate-500">{text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Simulator actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
                        <button
                          onClick={() => startGeneration(selectedCategory, selectedTopicName)}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                        >
                          Próxima Questão
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startGeneration(selectedCategory, currentQuestion.explanation.revisao)}
                          className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Praticar Semelhante (Reforçar Conceito)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 text-center py-16 md:py-20 space-y-6 flex flex-col items-center justify-center max-w-2xl mx-auto shadow-xxs">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                <Brain className="w-7 h-7" />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-display font-extrabold text-slate-800 text-lg md:text-xl">Pronto para iniciar?</h3>
                <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                  Selecione um assunto do edital ao lado e clique em <strong className="text-emerald-700 font-bold">Gerar Questão Inteligente</strong>. O Professor Mentor irá formatar uma questão inédita com gabarito comentado passo a passo para você.
                </p>
              </div>

              <div className="w-full max-w-md bg-slate-50/50 border border-slate-150 rounded-xl p-4 text-left space-y-2.5 text-[10px] leading-relaxed text-slate-500 font-medium">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-2 py-0.5 rounded">
                    Alinhado ao Edital
                  </span>
                  <span className="text-slate-700 font-bold">
                    Foco na Banca: <strong className="text-emerald-700 font-bold">{profile.banca}</strong>
                  </span>
                </div>
                <p>
                  As questões propostas simulam rigorosamente a extensão dos enunciados, o grau de complexidade e as principais cascas de banana utilizadas em concursos da Rede Estadual.
                </p>
              </div>

              <button
                onClick={() => startGeneration(selectedCategory, selectedTopicName)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-xs md:text-sm cursor-pointer min-w-[240px] justify-center"
              >
                {preFetchedQuestion && preFetchedTopic === selectedTopicName ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                    <span>Iniciar Treinamento (Carregamento Instantâneo ⚡)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Gerar Questão Inteligente</span>
                  </>
                )}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
