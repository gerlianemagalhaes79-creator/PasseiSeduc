import React, { useState, useRef, useEffect } from "react";
import { Message, UserProfile, StudyTopic } from "../types";
import { 
  Send, 
  Sparkles, 
  User, 
  GraduationCap, 
  RefreshCw, 
  AlertCircle, 
  Calendar, 
  BookOpen, 
  BrainCircuit, 
  Trash2, 
  ChevronRight,
  Lightbulb,
  HelpCircle,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MentorChatProps {
  profile: UserProfile;
  currentTopic: string;
  topics?: StudyTopic[];
}

export default function MentorChatModule({ profile, currentTopic, topics = [] }: MentorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: `**Olá, futuro(a) Professor(a) Aprovado(a)!** 🌟

Eu sou o seu **Professor Mentor**, especialista na sua aprovação para o Concurso da Rede Estadual do Ceará 2026 (Seduc-CE). 

Minha missão é guiar seus estudos de forma inteligente, focando no estilo de cobrança teórica da banca **${profile.banca || "FUNECE"}** e na sua disciplina de **${profile.discipline || "Biologia"}**.

Como posso impulsionar sua preparação hoje? Selecione um dos comandos rápidos abaixo ou digite sua dúvida no campo de texto!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dynamically tailor greeting based on struggle areas
  useEffect(() => {
    const struggleTopics = topics.filter(
      (t) => 
        t.questionsAnswered > 0 && 
        (t.questionsCorrect / t.questionsAnswered < 0.7 || t.confidence === "low")
    );

    if (messages.length === 1 && messages[0].id === "initial") {
      let content = `**Olá, futuro(a) Professor(a) Aprovado(a)!** 🌟\n\nEu sou o seu **Professor Mentor**, especialista na sua aprovação para o Concurso da Rede Estadual do Ceará 2026 (Seduc-CE). \n\nMinha missão é guiar seus estudos de forma de alta performance, focando no estilo de cobrança teórica da banca **${profile.banca || "FUNECE"}** e na sua área de **${profile.discipline || "Biologia"}**.\n\n`;

      if (struggleTopics.length > 0) {
        content += `🔍 **Raio-X de Pontos Fracos:** Analisei seus simulados e notei que você errou questões ou está com rendimento abaixo do ideal em alguns temas críticos:\n`;
        struggleTopics.forEach((t) => {
          const acc = Math.round((t.questionsCorrect / t.questionsAnswered) * 100);
          content += `• **${t.name}** (Aproveitamento de ${acc}% em ${t.questionsAnswered} questões)\n`;
        });
        content += `\n**Vamos reverter isso juntos!** Que tal começarmos detalhando as pegadinhas clássicas e consolidando o conteúdo de um desses temas? Digite qual do que você quer desmistificar agora para garantir a questão na prova!`;
      } else {
        content += `Como posso impulsionar sua preparação hoje? Selecione um dos comandos rápidos abaixo ou digite sua dúvida no campo de texto!`;
      }

      setMessages([
        {
          id: "initial",
          role: "assistant",
          content,
          timestamp: messages[0].timestamp
        }
      ]);
    }
  }, [topics]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) {
      setInput("");
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    let fetchUrl = "/api/chat";
    try {
      fetchUrl = new URL("/api/chat", window.location.origin).href;
    } catch (urlErr) {
      fetchUrl = "/api/chat";
    }

    // Filter down to struggling topics to send as helpful context
    const difficultyList = topics
      .filter(
        (t) => 
          t.questionsAnswered > 0 && 
          (t.questionsCorrect / t.questionsAnswered < 0.7 || t.confidence === "low")
      )
      .map(t => ({
        name: t.name,
        accuracy: Math.round((t.questionsCorrect / t.questionsAnswered) * 100),
        answered: t.questionsAnswered
      }));

    try {
      const response = await fetch(fetchUrl, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
           discipline: profile.discipline,
           banca: profile.banca,
           topic: currentTopic,
           difficultyTopics: difficultyList
         })
      });

      const result = await response.json();
      if (result.success && result.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: result.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsFallback(!!result.isFallback);
      } else {
        throw new Error("Erro de resposta do servidor");
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback message locally
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Professor(a), tive uma pequena oscilação na conexão com os servidores do Gemini. Mas não se preocupe! 

Deixe-me propor um desafio ativo baseado na **LDB**: O artigo 4º prevê que o dever do Estado com a educação escolar pública será efetivado mediante a garantia de educação básica obrigatória e gratuita dos 4 aos 17 anos de idade. 

Você sabe me dizer quais etapas do ensino compõem essa faixa obrigatória? Vamos exercitar isso!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = () => {
    if (window.confirm("Deseja realmente reiniciar o chat com o Professor Mentor?")) {
      setMessages([
        {
          id: "initial",
          role: "assistant",
          content: `**Chat reiniciado com sucesso!** 🔄\n\nPronto para um novo ciclo de estudos para o concurso Seduc-CE 2026. Como posso guiar você hoje?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsFallback(false);
    }
  };

  // Advanced layout custom parser for beautiful structured bubbles
  function renderMessageContent(content: string, isAssistant: boolean) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const flushList = (key: string | number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="space-y-2 my-3 list-none pl-1">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const parseInlineBold = (text: string) => {
      const parts = [];
      let current = text;
      let boldIdx = current.indexOf("**");
      let keyIdx = 0;

      while (boldIdx !== -1) {
        if (boldIdx > 0) {
          parts.push(current.substring(0, boldIdx));
        }
        const endBoldIdx = current.indexOf("**", boldIdx + 2);
        if (endBoldIdx !== -1) {
          parts.push(
            <strong key={`bold-${keyIdx++}`} className={isAssistant ? "font-bold text-slate-950" : "font-extrabold text-white"}>
              {current.substring(boldIdx + 2, endBoldIdx)}
            </strong>
          );
          current = current.substring(endBoldIdx + 2);
        } else {
          parts.push(current.substring(boldIdx));
          current = "";
        }
        boldIdx = current.indexOf("**");
      }
      if (current) {
        parts.push(current);
      }
      return parts.length > 0 ? parts : text;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        flushList(i);
        continue;
      }

      // Headers
      if (line.startsWith("### ")) {
        flushList(i);
        elements.push(
          <h5 key={i} className="font-display font-extrabold text-slate-900 mt-4 mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-3 bg-emerald-500 rounded-full inline-block"></span>
            {parseInlineBold(line.substring(4))}
          </h5>
        );
      } else if (line.startsWith("## ")) {
        flushList(i);
        elements.push(
          <h4 key={i} className="font-display font-bold text-slate-950 mt-5 mb-2 text-sm border-b border-slate-100 pb-1 flex items-center gap-2">
            {parseInlineBold(line.substring(3))}
          </h4>
        );
      } else if (line.startsWith("# ")) {
        flushList(i);
        elements.push(
          <h3 key={i} className="font-display font-black text-slate-950 mt-6 mb-3 text-base">
            {parseInlineBold(line.substring(2))}
          </h3>
        );
      }
      // Blockquotes / Warnings
      else if (line.startsWith("> ")) {
        flushList(i);
        elements.push(
          <div key={i} className="my-3 pl-3.5 py-2 border-l-4 border-emerald-500 bg-emerald-50/50 rounded-r-xl text-slate-800 text-xs leading-relaxed font-medium">
            {parseInlineBold(line.substring(2))}
          </div>
        );
      }
      // List Items (bully/number)
      else if (line.startsWith("* ") || line.startsWith("- ") || line.match(/^\d+\.\s/)) {
        inList = true;
        let text = line;
        let bulletIcon = <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />;
        
        if (line.startsWith("* ") || line.startsWith("- ")) {
          text = line.substring(2);
        } else {
          const match = line.match(/^(\d+)\.\s(.*)/);
          if (match) {
            bulletIcon = (
              <span className="font-mono font-bold text-[10px] text-emerald-700 bg-emerald-50 w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100/65 shadow-xxs">
                {match[1]}
              </span>
            );
            text = match[2];
          }
        }

        listItems.push(
          <li key={`li-${i}`} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed py-0.5">
            {bulletIcon}
            <div className="flex-1">{parseInlineBold(text)}</div>
          </li>
        );
      }
      // Standard Paragraph
      else {
        flushList(i);
        elements.push(
          <p key={i} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans [&:not(:first-child)]:mt-2.5">
            {parseInlineBold(line)}
          </p>
        );
      }
    }

    flushList("end");
    return elements;
  }

  // Preset commands that appear as dynamic choices
  const suggestions = [
    {
      id: "study_plan",
      label: "Criar Plano de Estudos",
      icon: Calendar,
      color: "bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100/50",
      iconColor: "text-emerald-600",
      query: "Monte um plano de estudos semanal estruturado para mim",
      desc: "Plano sob medida focado no edital"
    },
    {
      id: "ldb_tricks",
      label: "Pegadinhas da LDB",
      icon: AlertCircle,
      color: "bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100/50",
      iconColor: "text-amber-600",
      query: "Quais são as principais pegadinhas sobre a LDB?",
      desc: "Evite as armadilhas comuns da banca"
    },
    {
      id: "didactic",
      label: "Exercitar Didática Geral",
      icon: BookOpen,
      color: "bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100/50",
      iconColor: "text-blue-500",
      query: `Gere uma questão de didática no estilo da banca ${profile.banca || "FUNECE"}`,
      desc: "Treino focado com questões exclusivas"
    },
    {
      id: "bncc",
      label: "BNCC e Minha Disciplina",
      icon: Lightbulb,
      color: "bg-purple-50 border-purple-100 text-purple-800 hover:bg-purple-100/50",
      iconColor: "text-purple-500",
      query: `Explique como a BNCC impacta o Ensino Médio de ${profile.discipline || "Biologia"}`,
      desc: "Conexão direta com a área de atuação"
    }
  ];

  const hasChatted = messages.length > 1;

  return (
    <div className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-[72vh] min-h-[550px] max-h-[800px] relative">
      {/* Top Bar / Header */}
      <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-slate-950 text-sm sm:text-base flex items-center gap-2">
              Professor Mentor IA
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-400 text-[10px] font-mono mt-0.5">
              <span>Foco: {profile.discipline || "Geral"}</span>
              <span className="text-slate-300">•</span>
              <span>Banca: {profile.banca || "FUNECE"}</span>
              {isFallback && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-600 font-bold bg-amber-50 px-1 rounded">Modo Contingência</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Clear chat button */}
        {hasChatted && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 text-xxs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 border border-slate-100 hover:border-rose-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xxs"
            title="Wipe chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar Conversa</span>
          </button>
        )}
      </div>

      {/* Message and Launcher Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50/20 to-white">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xxs text-white font-bold text-xs ${
                  isAssistant ? "bg-emerald-600" : "bg-slate-900"
                }`}>
                  {isAssistant ? <GraduationCap className="w-4.5 h-4.5" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xxs border ${
                    isAssistant
                      ? "bg-white text-slate-800 rounded-tl-none border-slate-100"
                      : "bg-emerald-600 text-white border-emerald-600 rounded-tr-none"
                  }`}>
                    {renderMessageContent(message.content, isAssistant)}
                  </div>
                  <p className={`text-[9px] text-slate-400 font-mono px-1.5 ${!isAssistant && "text-right"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[80%] mr-auto"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xxs">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xxs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Preset Launcher Launcher (Only shown when there is only the initial message) */}
      {!hasChatted && (
        <div className="px-6 pb-6 bg-white shrink-0 border-t border-slate-50 pt-5">
          <p className="text-xxs font-extrabold uppercase tracking-widest text-slate-400 mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" /> Atravessar atalhos de preparação rápida
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSuggestionClick(s.query)}
                className="group text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-100 hover:border-emerald-150 transition-all cursor-pointer flex gap-3 shadow-xxs"
              >
                <div className={`p-2.5 rounded-xl ${s.color.split(" ")[0]} flex items-center justify-center shrink-0`}>
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <h5 className="font-sans font-bold text-slate-800 group-hover:text-emerald-950 text-xs transition-colors">
                    {s.label}
                  </h5>
                  <p className="text-slate-400 text-[10px] truncate leading-normal mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Suggestions List (Only shown once chat is active, above input) */}
      {hasChatted && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0">
            <Cpu className="w-3 h-3 text-emerald-600" /> Sugeridos:
          </span>
          <div className="flex gap-2 pb-0.5">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSuggestionClick(s.query)}
                className="text-xxs font-bold text-slate-600 hover:text-emerald-800 bg-white hover:bg-emerald-50/30 border border-slate-200/80 hover:border-emerald-200 px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer shadow-xxs"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Text Input Field */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida ou responda ao Mentor aqui..."
            disabled={loading}
            className="flex-1 bg-slate-50 border border-slate-200/80 focus:border-emerald-500 focus:bg-white rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 flex items-center justify-center transition-all disabled:bg-slate-200 disabled:text-slate-400 shadow-sm cursor-pointer active:scale-98"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 font-sans mt-2.5">
          O Professor Mentor estimula o aprendizado ativo. Responda com suas próprias palavras para reforçar sinapses!
        </p>
      </div>
    </div>
  );
}
