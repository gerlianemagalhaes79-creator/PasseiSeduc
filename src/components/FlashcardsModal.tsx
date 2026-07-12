import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flashcard, StudyTopic } from "../types";
import { 
  X, 
  Layers, 
  Brain, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Play,
  HelpCircle
} from "lucide-react";

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  onDeleteFlashcard: (id: string) => void;
  topics: StudyTopic[];
  onPracticeTopic: (topicName: string) => void;
}

export default function FlashcardsModal({
  isOpen,
  onClose,
  flashcards,
  onDeleteFlashcard,
  topics,
  onPracticeTopic,
}: FlashcardsModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Identify general subjects they have difficulty with from topics
  const difficultyTopics = topics.filter(
    (t) => 
      t.questionsAnswered > 0 && 
      (t.questionsCorrect / t.questionsAnswered < 0.7 || t.confidence === "low")
  );

  if (!isOpen) return null;

  const currentCard = flashcards[activeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const handleDelete = (id: string) => {
    setIsFlipped(false);
    onDeleteFlashcard(id);
    if (activeIndex >= flashcards.length - 1 && activeIndex > 0) {
      setActiveIndex(flashcards.length - 2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">
                Flashcards de Fixação Cognitiva
              </h3>
              <p className="text-slate-400 text-xs">
                Mecanismo de repetição espaçada para reter os assuntos mais difíceis
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {flashcards.length > 0 ? (
            <div className="space-y-6">
              {/* Progress counter */}
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Cartão {activeIndex + 1} de {flashcards.length}</span>
                <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-100">
                  {currentCard?.banca}
                </span>
              </div>

              {/* Interactive Flashcard with flips */}
              <div 
                className="w-full h-72 cursor-pointer relative"
                style={{ perspective: "1000px" }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* FRONT SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-md flex flex-col justify-between text-white overflow-hidden"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono tracking-wider font-extrabold text-amber-400 bg-amber-950/75 border border-amber-900 px-2 py-0.5 rounded-full uppercase">
                        Pergunta Ativa 🧠
                      </span>
                      <Brain className="w-4.5 h-4.5 text-amber-400" />
                    </div>

                    <div className="text-center py-4 space-y-2">
                      <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Reflita sobre o conceito:</p>
                      <h4 className="font-sans text-sm md:text-base font-medium leading-relaxed text-slate-100 px-2">
                        {currentCard?.front}
                      </h4>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-950/40 py-2.5 rounded-xl border border-amber-900/40 hover:bg-amber-950/60 transition-colors">
                      <RotateCw className="w-4 h-4" />
                      Clique para Revelar a Resposta
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-600/30 shadow-md flex flex-col justify-between text-white overflow-hidden"
                    style={{ 
                      backfaceVisibility: "hidden", 
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)" 
                    }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono tracking-wider font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-850 px-2 py-0.5 rounded-full uppercase">
                        Resposta Consolidada 💡
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-300 truncate max-w-[200px]">
                        Tópico: {currentCard?.topic}
                      </span>
                    </div>

                    <div className="py-2 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                      <div>
                        <p className="text-emerald-300 text-[9px] uppercase tracking-wider font-black">Conceito de Gabarito:</p>
                        <p className="font-sans text-xs text-emerald-50 leading-relaxed">
                          {currentCard?.back}
                        </p>
                      </div>
                      {currentCard?.pegadinha && (
                        <div className="bg-amber-950/30 border border-amber-900/30 p-2.5 rounded-xl">
                          <p className="text-amber-300 text-[9px] uppercase tracking-wider font-black flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" /> Pegadinha a evitar:
                          </p>
                          <p className="font-sans text-[11px] text-amber-100 leading-normal">
                            {currentCard?.pegadinha}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-200 font-bold bg-emerald-950/40 py-2.5 rounded-xl border border-emerald-800/20 hover:bg-emerald-950/60 transition-colors">
                      <RotateCw className="w-4 h-4" />
                      Clique para Virar Novamente
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Navigation and Actions */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentCard) handleDelete(currentCard.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
                    title="Remover após dominar"
                  >
                    <Trash2 className="w-4 h-4" />
                    Dominei! (Remover)
                  </button>

                  <button
                    onClick={() => {
                      if (currentCard) {
                        onClose();
                        onPracticeTopic(currentCard.topic);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-emerald-600" />
                    Simular Tema
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150 flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto border border-slate-100">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-slate-800 text-base">Nenhum Flashcard Manual Salvo</h4>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Futuro Professor, quando você errar alguma questão no Simulador de Provas, clique no botão para salvar um Flashcard automático sobre o assunto!
                </p>
              </div>
            </div>
          )}

          {/* Difficulty Topics / Struggle areas section */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h5 className="font-display font-bold text-slate-800 text-xs md:text-sm">
                  Temas Críticos Detectados (Assuntos de Dificuldade)
                </h5>
                <p className="text-slate-400 text-[10px]">Identificados dinamicamente através do seu rendimento nos simulados</p>
              </div>
            </div>

            {difficultyTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {difficultyTopics.map((topic) => {
                  const accuracy = Math.round((topic.questionsCorrect / topic.questionsAnswered) * 100);
                  return (
                    <div 
                      key={topic.id}
                      className="bg-slate-50/60 hover:bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                          Aproveitamento: {accuracy}%
                        </span>
                        <h6 className="font-sans text-xs font-semibold text-slate-700 line-clamp-2">
                          {topic.name}
                        </h6>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onPracticeTopic(topic.name);
                        }}
                        className="w-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xxs py-2 px-3 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-600" />
                        Gerar Simulado Deste Tema
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-500">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>
                  Excelente! Você não possui nenhum assunto crítico (abaixo de 70% de acerto) registrado. Continue praticando para manter sua alta performance!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
