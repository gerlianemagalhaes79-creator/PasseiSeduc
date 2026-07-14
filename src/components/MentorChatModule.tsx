import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Cpu,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TOPIC_STUDY_GUIDES } from "../data/topicStudyGuides";
import { getSectorForDiscipline, getPointSubtopics } from "../data/sectorsData";

interface MentorChatProps {
  profile: UserProfile;
  currentTopic: string;
  topics?: StudyTopic[];
}

export default function MentorChatModule({ profile, currentTopic, topics = [] }: MentorChatProps) {
  // Pre-calculate the entire interleaved schedule for the active study period (mirrors DashboardModule.tsx)
  const examSchedule = useMemo(() => {
    if (!profile.examDate) return {};
    
    const startDateObj = new Date((profile.studyStartDate || "2026-07-09") + "T12:00:00");
    startDateObj.setHours(0, 0, 0, 0);
    
    const examDateObj = new Date(profile.examDate + "T12:00:00");
    examDateObj.setHours(0, 0, 0, 0);
    
    const totalDaysAvailable = Math.max(0, Math.floor((examDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)));
    const reviewDays = totalDaysAvailable >= 10 ? 7 : (totalDaysAvailable >= 2 ? 1 : 0);
    const totalActiveStudyDays = totalDaysAvailable - reviewDays;
    
    const getSubtopicsForTopic = (top: StudyTopic): string[] => {
      if (top.category === "especifico") {
        const sector = getSectorForDiscipline(profile.discipline);
        if (sector) {
          const match = top.name.match(/Ponto\s+(\d+)/i);
          const ptNum = match ? parseInt(match[1]) : null;
          let point = sector.points.find(p => p.num === ptNum);
          if (!point) {
            point = sector.points.find(p => top.name.toLowerCase().includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(top.name.toLowerCase()));
          }
          if (point) {
            return getPointSubtopics(point.desc, point.title);
          }
        }
        return getPointSubtopics("", top.name);
      } else {
        let guide = TOPIC_STUDY_GUIDES[top.name];
        if (!guide) {
          guide = Object.values(TOPIC_STUDY_GUIDES).find(g => 
            g.topicName.toLowerCase().includes(top.name.toLowerCase()) || 
            top.name.toLowerCase().includes(g.topicName.toLowerCase())
          );
        }
        if (guide && guide.subtopics && guide.subtopics.length > 0) {
          return guide.subtopics;
        }
        return getPointSubtopics("", top.name);
      }
    };

    const portuguesSubtopics = topics.filter(t => t.category === "comuns").flatMap(getSubtopicsForTopic);
    const didaticaSubtopics = topics.filter(t => t.category === "didatica").flatMap(getSubtopicsForTopic);
    const legislacaoSubtopics = topics.filter(t => t.category === "legislacao").flatMap(getSubtopicsForTopic);
    const cearaSubtopics = topics.filter(t => t.category === "ceara").flatMap(getSubtopicsForTopic);
    const especificoSubtopics = topics.filter(t => t.category === "especifico").flatMap(getSubtopicsForTopic);

    const weekdayCategories: Record<number, string[]> = {
      1: ["comuns", "didatica", "especifico"],
      2: ["legislacao", "especifico"],
      3: ["comuns", "didatica", "ceara"],
      4: ["legislacao", "especifico"],
      5: ["didatica", "ceara", "especifico"]
    };

    const sessionCounts: Record<string, number> = {
      comuns: 0,
      didatica: 0,
      legislacao: 0,
      ceara: 0,
      especifico: 0
    };

    for (let dayIdx = 0; dayIdx < totalActiveStudyDays; dayIdx++) {
      const d = new Date(startDateObj);
      d.setDate(startDateObj.getDate() + dayIdx);
      const wkday = d.getDay();
      if (wkday >= 1 && wkday <= 5) {
        const cats = weekdayCategories[wkday] || [];
        cats.forEach(cat => {
          if (sessionCounts[cat] !== undefined) sessionCounts[cat]++;
        });
      }
    }

    const categorySlices: Record<string, string[][]> = {
      comuns: [],
      didatica: [],
      legislacao: [],
      ceara: [],
      especifico: []
    };

    const distributeSubtopics = (allSubs: string[], sessionsCount: number): string[][] => {
      const slices: string[][] = [];
      if (sessionsCount <= 0) return slices;
      const L = allSubs.length;
      if (L === 0) {
        return Array.from({ length: sessionsCount }, () => ["Revisão de conceitos essenciais"]);
      }
      
      const base = Math.floor(L / sessionsCount);
      const extra = L % sessionsCount;
      
      for (let s = 0; s < sessionsCount; s++) {
        const start = s * base + Math.min(s, extra);
        const end = (s + 1) * base + Math.min(s + 1, extra);
        let slice = allSubs.slice(start, end);
        if (slice.length === 0) {
          slice = [allSubs[s % L] || "Revisão Geral"];
        }
        slices.push(slice);
      }
      return slices;
    };

    categorySlices.comuns = distributeSubtopics(portuguesSubtopics, sessionCounts.comuns);
    categorySlices.didatica = distributeSubtopics(didaticaSubtopics, sessionCounts.didatica);
    categorySlices.legislacao = distributeSubtopics(legislacaoSubtopics, sessionCounts.legislacao);
    categorySlices.ceara = distributeSubtopics(cearaSubtopics, sessionCounts.ceara);
    categorySlices.especifico = distributeSubtopics(especificoSubtopics, sessionCounts.especifico);

    const categorySessionIndices: Record<string, number> = {
      comuns: 0,
      didatica: 0,
      legislacao: 0,
      ceara: 0,
      especifico: 0
    };

    const hours = profile.studyHours || 3;
    const scheduleMap: Record<string, any> = {};

    let current = new Date(startDateObj);
    while (current <= examDateObj) {
      const timeKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
      const daysToExam = Math.floor((examDateObj.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToExam === 0) {
        scheduleMap[timeKey] = {
          title: "🏁 DIA DA PROVA!",
          desc: "Hoje é o grande dia da sua aprovação no Concurso Seduc-CE!",
          isExam: true,
          color: "bg-rose-600 font-bold text-white",
          time: "08:00 - 13:00",
          notes: "Realize a prova com calma. Você se preparou até o fim! Confie no seu processo."
        };
      } else if (daysToExam <= reviewDays) {
        if (reviewDays === 7) {
          if (daysToExam === 7) {
            scheduleMap[timeKey] = {
              title: "Revisão: Temas Pedagógicos",
              desc: "Revisão Ativa: Temas Educacionais e Pedagógicos",
              color: "bg-emerald-500",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: "Fase de Revisão Final: Utilize seus resumos, mapas mentais e faça questões rápidas de fixação sobre os Temas Pedagógicos do edital."
            };
          } else if (daysToExam === 6) {
            scheduleMap[timeKey] = {
              title: "Revisão: Legislação & Admin.",
              desc: "Revisão Ativa: Administração Pública e Legislação Básica",
              color: "bg-indigo-600",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: "Fase de Revisão Final: Revise a LDB, o Estatuto do Ceará e o Estatuto do Magistério. Foque em prazos e regras específicas!"
            };
          } else if (daysToExam === 5) {
            scheduleMap[timeKey] = {
              title: "Revisão: Língua Portuguesa",
              desc: "Revisão Ativa: Língua Portuguesa Básica",
              color: "bg-blue-500",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: "Fase de Revisão Final: Faça questões sobre concordância, regência, pontuação e crase da banca FUNECE."
            };
          } else if (daysToExam === 4) {
            scheduleMap[timeKey] = {
              title: "Revisão: Dados & Indicadores",
              desc: "Revisão Ativa: Leitura e Interpretação de Dados e Indicadores",
              color: "bg-purple-600",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: "Fase de Revisão Final: Revise fórmulas do IDEB, distorção idade-série e taxas de fluxo escolar (abandono, evasão)."
            };
          } else if (daysToExam === 3) {
            scheduleMap[timeKey] = {
              title: `Revisão: Específico (${profile.discipline})`,
              desc: `Revisão Ativa: Conhecimentos Específicos de ${profile.discipline}`,
              color: "bg-amber-500",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: `Fase de Revisão Final: Dedique este dia para consolidar as fórmulas, teorias e conceitos mais cobrados de ${profile.discipline}.`
            };
          } else if (daysToExam === 2) {
            scheduleMap[timeKey] = {
              title: "Simulado Geral Seduc-CE",
              desc: "Simulado Final Completo Seduc-CE",
              color: "bg-teal-600 font-semibold",
              time: "08:00 - 12:00",
              notes: "Simulado Geral Final: Reserve 4 horas ininterruptas e resolva uma prova completa simulando as condições reais do concurso."
            };
          } else if (daysToExam === 1) {
            scheduleMap[timeKey] = {
              title: "Descanso e Preparação Mental 🌿",
              desc: "Sem estudos: Descanso absoluto e controle de ansiedade",
              color: "bg-teal-500 font-bold",
              time: "Livre",
              notes: "Sem estudos hoje! Durma cedo, mantenha-se hidratado, separe o documento com foto, caneta preta e descanse o cérebro para o grande dia."
            };
          }
        } else {
          scheduleMap[timeKey] = {
            title: "Descanso e Preparação Mental 🌿",
            desc: "Sem estudos: Descanso absoluto e controle de ansiedade",
            color: "bg-teal-500 font-bold",
            time: "Livre",
            notes: "Sem estudos hoje! Descanse bem, separe canetas e documentos e prepare a mente para a prova amanhã."
          };
        }
      } else {
        const wkday = current.getDay();
        if (wkday === 6) {
          scheduleMap[timeKey] = {
            title: "Simulado Geral + Revisão",
            desc: "Simulado Geral Temático de Sábado",
            color: "bg-rose-500 font-semibold text-white",
            time: "09:00 - 12:00",
            notes: "🎯 **ATIVIDADE DE SÁBADO: SIMULADO DE FIXAÇÃO**\n\nResolva 30 a 40 questões focadas nos temas estudados de segunda a sexta desta semana.\n\nFoque em reproduzir o ambiente de prova: sem celular, sem consultas, cronometrando o tempo médio de 3 minutos por questão."
          };
        } else if (wkday === 0) {
          scheduleMap[timeKey] = {
            title: "Revisão de Erros e Descanso 🌿",
            desc: "Análise ativa do simulado e descanso restaurador",
            color: "bg-teal-500 text-white",
            time: "10:00 - 12:00",
            notes: "🧠 **ATIVIDADE DE DOMINGO: APRENDIZAGEM COM ERROS**\n\n1. Abra o gabarito do simulado de ontem.\n2. Para cada erro, identifique se foi por falta de atenção, pressa, ou desconhecimento teórico.\n3. Revise as regras ou pontos correspondentes por 1 hora.\n4. Tire o restante do dia livre para lazer e descanso. Você merece!"
          };
        } else {
          const cats = weekdayCategories[wkday] || [];
          const notesParts: string[] = [];
          const descParts: string[] = [];
          const subtopicsForDesc: string[] = [];
          
          cats.forEach(cat => {
            const s_idx = categorySessionIndices[cat];
            const slices = categorySlices[cat] || [];
            const subtopicsToday = slices[s_idx] || [];
            
            categorySessionIndices[cat]++;
            
            let catName = "";
            let emoji = "";
            let orientation = "";
            
            if (cat === "comuns") {
              catName = "Português";
              emoji = "📘";
              orientation = "Estudo teórico, análise de regras gerais e resolução de 10 a 15 questões da banca FUNECE.";
            } else if (cat === "didatica") {
              catName = "Didática";
              emoji = "🟢";
              orientation = "Fichamento rápido dos conceitos, mapas mentais e memorização das correntes/autores pedagógicos.";
            } else if (cat === "legislacao") {
              catName = "Legislação";
              emoji = "⚖️";
              orientation = "Leitura atenta da letra da lei (LDB/ECA) destacando prazos, responsabilidades e exceções.";
            } else if (cat === "ceara") {
              catName = "Indicadores";
              emoji = "📊";
              orientation = "Interpretação ativa de tabelas, siglas e fórmulas do IDEB, taxas de transição e SPAECE.";
            } else if (cat === "especifico") {
              catName = "Específico";
              emoji = "🟡";
              orientation = "Aprofundamento teórico-prático do conteúdo com dedicação especial a resolução de problemas.";
            }
            
            descParts.push(catName);
            if (subtopicsToday && subtopicsToday.length > 0) {
              subtopicsForDesc.push(subtopicsToday[0]);
            }
            notesParts.push(`${emoji} **${catName}**\n* **Subtópicos a estudar hoje:**\n${subtopicsToday.map(s => `  - ${s}`).join("\n")}\n* **Orientação de Estudo:** ${orientation}\n`);
          });
          
          const title = cats.map(cat => {
            if (cat === "comuns") return "Português";
            if (cat === "didatica") return "Didática";
            if (cat === "legislacao") return "Legislação";
            if (cat === "ceara") return "Indicadores";
            return "Específico";
          }).join(" • ");
          
          const color = wkday === 1 ? "bg-sky-600" :
                        wkday === 2 ? "bg-indigo-600" :
                        wkday === 3 ? "bg-emerald-500" :
                        wkday === 4 ? "bg-purple-600" : "bg-amber-500";
          
          const combinedDesc = subtopicsForDesc.length > 0
            ? `${descParts.join(" + ")} // ${subtopicsForDesc.join(" + ")}`
            : descParts.join(" + ");

          scheduleMap[timeKey] = {
            title: title,
            desc: combinedDesc,
            color: color,
            time: "19:00 - " + (19 + Math.round(hours)) + ":00",
            notes: `📚 **PROGRAMAÇÃO DE ESTUDOS DO DIA**\n\nHoje o seu estudo segue uma estratégia de aprendizagem intercalada (interleaving). Estude os seguintes conteúdos:\n\n${notesParts.join("\n")}`
          };
        }
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return scheduleMap;
  }, [profile, topics]);

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

    // Retrieve calendar and schedule items from localStorage to send as context
    const savedCompletedDays = localStorage.getItem("ia_aprova_completed_days");
    let completedDaysObj = {};
    if (savedCompletedDays) {
      try {
        completedDaysObj = JSON.parse(savedCompletedDays);
      } catch (e) {}
    }

    const savedSchedule = localStorage.getItem("ia_aprova_custom_schedule_v5");
    let scheduleList = [];
    if (savedSchedule) {
      try {
        scheduleList = JSON.parse(savedSchedule);
      } catch (e) {}
    }

    const completedTopicsList = topics.filter(t => t.completed).map(t => t.name);
    const pendingTopicsList = topics.filter(t => !t.completed).map(t => t.name);

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

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const clientDateStr = new Date().toLocaleDateString('pt-BR', options);

    // Calculate today's dynamic calendar topic exactly matching what is rendered on the calendar
    const todayDateObjForSchedule = new Date();
    const todayScheduleKey = `${todayDateObjForSchedule.getFullYear()}-${todayDateObjForSchedule.getMonth()}-${todayDateObjForSchedule.getDate()}`;
    const todayCalendarTopic = examSchedule[todayScheduleKey] || null;

    const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    const todayWeekdayName = weekdayNames[todayDateObjForSchedule.getDay()];
    const isTodayCompleted = todayCalendarTopic ? !!(completedDaysObj as any)[todayWeekdayName] : false;

    try {
      const response = await fetch(fetchUrl, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
           discipline: profile.discipline,
           banca: profile.banca,
           topic: currentTopic,
           difficultyTopics: difficultyList,
           completedDays: completedDaysObj,
           scheduleItems: scheduleList,
           completedTopics: completedTopicsList,
           pendingTopics: pendingTopicsList,
           clientDateStr: clientDateStr,
           todayCalendarTopic: todayCalendarTopic,
           isTodayCompleted: isTodayCompleted,
           todayWeekdayName: todayWeekdayName
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
      id: "today_forecast",
      label: "O que está previsto para eu estudar hoje?",
      icon: Calendar,
      color: "bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100/50",
      iconColor: "text-emerald-600",
      query: "O que está previsto para eu estudar hoje no meu cronograma?",
      desc: "Consulte a meta e assunto programados para hoje"
    },
    {
      id: "best_content",
      label: "Onde encontro o melhor conteúdo para hoje?",
      icon: BookOpen,
      color: "bg-blue-50 border-blue-100 text-blue-800 hover:bg-blue-100/50",
      iconColor: "text-blue-500",
      query: "Onde encontro o melhor conteúdo de estudos para os assuntos de hoje?",
      desc: "Indicação de livros, artigos e guias de referência"
    },
    {
      id: "where_we_stopped",
      label: "Onde paramos nos meus estudos?",
      icon: CheckSquare,
      color: "bg-purple-50 border-purple-100 text-purple-800 hover:bg-purple-100/50",
      iconColor: "text-purple-500",
      query: "Onde paramos nos meus estudos? Faça um balanço das metas concluídas",
      desc: "Verifique os últimos tópicos concluídos com sucesso"
    },
    {
      id: "delayed_subjects",
      label: "Tem algum assunto atrasado?",
      icon: AlertCircle,
      color: "bg-amber-50 border-amber-100 text-amber-800 hover:bg-amber-100/50",
      iconColor: "text-amber-600",
      query: "Tem algum assunto atrasado ou pendente no meu cronograma?",
      desc: "Análise de tópicos acumulados ou esquecidos"
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
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Base Local</span>
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
