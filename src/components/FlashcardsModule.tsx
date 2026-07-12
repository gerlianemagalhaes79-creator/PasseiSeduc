import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flashcard, StudyTopic } from "../types";
import { 
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

interface FlashcardsModuleProps {
  flashcards: Flashcard[];
  onDeleteFlashcard: (id: string) => void;
  topics: StudyTopic[];
  onPracticeTopic: (topicName: string) => void;
}

export default function FlashcardsModule({
  flashcards,
  onDeleteFlashcard,
  topics,
  onPracticeTopic,
}: FlashcardsModuleProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Identify general subjects they have difficulty with from topics
  const difficultyTopics = topics.filter(
    (t) => 
      t.questionsAnswered > 0 && 
      (t.questionsCorrect / t.questionsAnswered < 0.7 || t.confidence === "low")
  );

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
    <div className="space-y-6">
      {/* Upper Module Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/15 rounded-2xl flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/10">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-amber-500/10">
                Fixação por Repetição Espaçada
              </span>
              <h2 className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-white mt-1">
                Pasta de Flashcards Ativos
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed max-w-xl">
                Memorização ativa focada em reter os conceitos mais complexos, termos legais da LDB, estatutos e distratores clássicos da sua banca organizadora.
              </p>
            </div>
          </div>
          <div className="bg-slate-800/80 border border-slate-750 p-4 rounded-2xl flex items-center gap-4 shrink-0 self-start md:self-center">
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flashcards</span>
              <span className="text-xl font-black text-amber-400">{flashcards.length}</span>
            </div>
            <div className="w-px h-8 bg-slate-700"></div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temas Críticos</span>
              <span className="text-xl font-black text-rose-400">{difficultyTopics.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Column: Flashcard Study Experience */}
        <div className="lg:col-span-2 space-y-6">
          {flashcards.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
              {/* Progress and card metadata */}
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Cartão {activeIndex + 1} de {flashcards.length}</span>
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-extrabold border border-amber-100">
                  Banca: {currentCard?.banca || "Seduc-CE"}
                </span>
              </div>

              {/* Flashcard Component */}
              <div 
                className="w-full h-80 cursor-pointer relative"
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
                    className="absolute inset-0 w-full h-full rounded-2xl p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 shadow-md flex flex-col justify-between text-white overflow-hidden"
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold text-amber-400 bg-amber-950/70 border border-amber-900/60 px-2.5 py-1 rounded-full uppercase">
                        Pergunta / Percepção Ativa 🧠
                      </span>
                      <Brain className="w-5 h-5 text-amber-400" />
                    </div>

                    <div className="text-center py-4 space-y-2">
                      <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">REFLITA SOBRE O TEMA:</p>
                      <h4 className="font-sans text-base md:text-lg font-medium leading-relaxed text-slate-100 px-4">
                        {currentCard?.front}
                      </h4>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-bold bg-amber-950/40 py-3 rounded-xl border border-amber-900/40 hover:bg-amber-950/60 transition-colors w-full">
                      <RotateCw className="w-4 h-4" />
                      Clique para Revelar o Conceito
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-2xl p-6 md:p-8 bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-800/30 shadow-md flex flex-col justify-between text-white overflow-hidden"
                    style={{ 
                      backfaceVisibility: "hidden", 
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)" 
                    }}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12"></div>

                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono tracking-wider font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-850 px-2.5 py-1 rounded-full uppercase">
                        Conceito Consolidado 💡
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 truncate max-w-[240px] bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded">
                        Tópico: {currentCard?.topic}
                      </span>
                    </div>

                    <div className="py-2 overflow-y-auto space-y-4 pr-1 scrollbar-thin max-h-40">
                      <div>
                        <p className="text-emerald-300 text-[10px] uppercase tracking-wider font-black mb-1">Gabarito Teórico:</p>
                        <p className="font-sans text-xs md:text-sm text-emerald-50 leading-relaxed">
                          {currentCard?.back}
                        </p>
                      </div>
                      {currentCard?.pegadinha && (
                        <div className="bg-amber-950/35 border border-amber-900/30 p-3 rounded-xl">
                          <p className="text-amber-300 text-[10px] uppercase tracking-wider font-black flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Cuidado com o Distrator:
                          </p>
                          <p className="font-sans text-xs text-amber-100 leading-relaxed mt-1">
                            {currentCard?.pegadinha}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-emerald-200 font-bold bg-emerald-950/40 py-3 rounded-xl border border-emerald-800/20 hover:bg-emerald-950/60 transition-colors w-full">
                      <RotateCw className="w-4 h-4" />
                      Clique para Ocultar Gabarito
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
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
                    className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 flex items-center gap-2 text-xs font-extrabold transition-all cursor-pointer shadow-3xs"
                    title="Remover este cartão dos estudos ativos após dominar o assunto"
                  >
                    <Trash2 className="w-4.5 h-4.5 text-rose-600" />
                    <span>Já Dominei! (Remover)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (currentCard) {
                        onPracticeTopic(currentCard.topic);
                      }
                    }}
                    className="px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 flex items-center gap-2 text-xs font-extrabold transition-all cursor-pointer shadow-3xs"
                  >
                    <Play className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Praticar no Simulador</span>
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-5 shadow-xs">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto border border-slate-100">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="font-display font-extrabold text-slate-800 text-base md:text-lg">Sua Pasta de Flashcards está Vazia</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Futuro Professor, revise e resolva questões no **Simulador de Provas**. Sempre que errar ou quiser destacar um detalhe importante, clique em **"Salvar na Minha Pasta ⚡"** na explicação pedagógica para criar seus cartões de estudo!
                </p>
              </div>
              <button
                onClick={() => onPracticeTopic("mixed")}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Começar Simulado Geral</span>
              </button>
            </div>
          )}
        </div>

        {/* Right/Side Column: Critical subjects / Struggle topics */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm">
                  Temas Críticos Detectados
                </h3>
                <p className="text-slate-400 text-[10px]">Identificados dinamicamente de acordo com seus erros</p>
              </div>
            </div>

            {difficultyTopics.length > 0 ? (
              <div className="space-y-3">
                <p className="text-slate-500 text-xxs leading-relaxed">
                  Estes tópicos registraram rendimento **abaixo de 70%**. Recomendamos gerar simulados direcionados para reverter este quadro:
                </p>
                <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                  {difficultyTopics.map((topic) => {
                    const accuracy = Math.round((topic.questionsCorrect / topic.questionsAnswered) * 100);
                    return (
                      <div 
                        key={topic.id}
                        className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                            Aproveitamento: {accuracy}%
                          </span>
                          <h6 className="font-sans text-xs font-bold text-slate-700 line-clamp-2">
                            {topic.name}
                          </h6>
                        </div>
                        <button
                          onClick={() => onPracticeTopic(topic.name)}
                          className="w-full bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xxs py-2.5 px-3 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Gerar Simulado Deste Tema</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto border border-emerald-100">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-slate-800 text-xs">Aproveitamento Perfeito!</h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs mx-auto">
                    Nenhum assunto crítico registrado abaixo de 70%. Continue resolvendo simulados para manter o ritmo!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cognitive Tip Bento Box */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <Sparkles className="w-6 h-6 text-amber-200 animate-bounce" />
            <h4 className="font-display font-extrabold text-sm tracking-tight">O Segredo Neurocognitivo ⚡</h4>
            <p className="text-amber-50 text-[11px] leading-relaxed">
              O estudo por **Flashcards** estimula o cérebro através do "Active Recall" (recordação ativa). Ao tentar lembrar a resposta antes de virar o cartão, você fortalece as conexões sinápticas associadas àquele assunto, reduzindo as chances de esquecimento no dia da prova!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
