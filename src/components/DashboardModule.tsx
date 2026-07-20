import React, { useState, useEffect, useMemo } from "react";
import { UserProfile, StudyTopic } from "../types";
import { Award, BookOpen, Clock, Flame, GraduationCap, TrendingUp, CheckCircle, ListChecks, Calendar, CheckSquare, Check, Edit3, Plus, Trash2, RotateCcw, Info, X, Save, ChevronDown, ChevronUp, Brain, Search, Sparkles, Target, Filter, HelpCircle, ChevronLeft, ChevronRight, CalendarDays, ExternalLink, Lightbulb, BookOpenCheck, HelpCircle as QuestionIcon, Printer, LayoutDashboard, Layers } from "lucide-react";
import { motion } from "motion/react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getStudyGuideForTopic, TOPIC_STUDY_GUIDES } from "../data/topicStudyGuides";
import { getSectorForDiscipline, getPointSubtopics } from "../data/sectorsData";

interface DashboardProps {
  profile: UserProfile;
  topics: StudyTopic[];
  onChangeModule: (moduleName: string) => void;
  onTopicClick: (topicName: string) => void;
  onUpdateTopicStats?: (topicId: string, deltaAnswered: number, deltaCorrect: number, toggleCompleted?: boolean) => void;
  activeTab?: "mapping" | "schedule";
  setActiveTab?: (tab: "mapping" | "schedule") => void;
  flashcards?: any[];
  onOpenFlashcards?: () => void;
}

interface ScheduleItem {
  day: string;
  desc: string;
  pct: string; // Focus relevance percentage (e.g. "75%")
  color: string;
  time?: string;
  notes?: string;
}

const getCleanTopicInfo = (topicName: string, color: string = "") => {
  if (!topicName) return { subject: "", subtopic: "" };
  
  let subject = "";
  let subtopic = topicName;
  
  const colonIndex = topicName.indexOf(":");
  if (colonIndex !== -1) {
    subject = topicName.substring(0, colonIndex).trim();
    subtopic = topicName.substring(colonIndex + 1).trim();
  } else {
    if (color.includes("indigo")) {
      subject = "Legislação";
    } else if (color.includes("emerald")) {
      subject = "Didática";
    } else if (color.includes("purple")) {
      subject = "História CE";
    } else if (color.includes("amber")) {
      subject = "Específica";
    } else {
      subject = "Geral";
    }
  }

  // Shorten subject names to keep them ultra-neat and compact in the calendar grid
  if (subject.toLowerCase().includes("portuguesa")) {
    subject = "Português";
  } else if (subject.toLowerCase().includes("raciocínio") || subject.toLowerCase().includes("rlm")) {
    subject = "RLM";
  } else if (subject.toLowerCase().includes("constituição")) {
    subject = "Const. Federal";
  } else if (subject.toLowerCase().includes("ldb")) {
    subject = "LDB";
  } else if (subject.toLowerCase().includes("pne")) {
    subject = "PNE";
  } else if (subject.toLowerCase().includes("eca")) {
    subject = "ECA";
  } else if (subject.toLowerCase().includes("didática")) {
    subject = "Didática";
  } else if (subject.toLowerCase().includes("ceará") || subject.toLowerCase().includes("história do ce")) {
    subject = "História CE";
  } else if (subject.toLowerCase().includes("específico") || subject.toLowerCase().includes("específica")) {
    subject = "Específica";
  }
  
  if (subtopic.startsWith("Foco: ")) {
    subtopic = subtopic.replace("Foco: ", "");
  }
  
  return { subject, subtopic };
};

export default function DashboardModule({
  profile,
  topics,
  onChangeModule,
  onTopicClick,
  onUpdateTopicStats,
  activeTab: controlledActiveTab,
  setActiveTab: controlledSetActiveTab,
  flashcards = [],
  onOpenFlashcards
}: DashboardProps) {
  // Compute metrics
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.completed).length;
  const progressPercent = Math.round((completedTopics / totalTopics) * 100) || 0;

  // Study Topics Search, Status Filters & Accordion states
  const [topicSearch, setTopicSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "in_practice">("all");
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    legislacao: false,
    didatica: false,
    ceara: false,
    comuns: false,
    especifico: false
  });

  const hitRate = profile.totalQuestions > 0 
    ? Math.round((profile.totalCorrect / profile.totalQuestions) * 100) 
    : 0;

  // Persistent local state for the suggested weekly schedule completion
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("ia_aprova_completed_days");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      "Segunda": false,
      "Terça": false,
      "Quarta": false,
      "Quinta": false,
      "Sexta": false,
      "Sábado": false,
      "Domingo": false
    };
  });

  useEffect(() => {
    localStorage.setItem("ia_aprova_completed_days", JSON.stringify(completedDays));
  }, [completedDays]);

  // Persistent local state for specific calendar date completion (to prevent checking off all Mondays across the year)
  const [completedDates, setCompletedDates] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("ia_aprova_completed_dates_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("ia_aprova_completed_dates_v1", JSON.stringify(completedDates));
  }, [completedDates]);

  // Persistent state for individual item check-ins on specific calendar dates
  const [completedDateItems, setCompletedDateItems] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem("ia_aprova_completed_date_items_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("ia_aprova_completed_date_items_v1", JSON.stringify(completedDateItems));
  }, [completedDateItems]);

  const [selectedCheckInDate, setSelectedCheckInDate] = useState<{
    year: number;
    month: number;
    day: number;
    timeKey: string;
    weekdayName: string;
    scheduleItem: any;
  } | null>(null);

  const toggleDateItemCompletion = (timeKey: string, itemLabel: string, scheduleItemsList: any[]) => {
    setCompletedDateItems(prev => {
      const currentDayItems = prev[timeKey] ? { ...prev[timeKey] } : {};
      currentDayItems[itemLabel] = !currentDayItems[itemLabel];
      
      const newItems = {
        ...prev,
        [timeKey]: currentDayItems
      };
      
      // Determine if ALL items for this date are now completed
      const allCompleted = scheduleItemsList.every(it => !!currentDayItems[it.label]);
      setCompletedDates(prevDates => ({
        ...prevDates,
        [timeKey]: allCompleted
      }));
      
      return newItems;
    });
  };

  const toggleFullDateCompletion = (timeKey: string, scheduleItemsList: any[]) => {
    const nextCompleted = !completedDates[timeKey];
    setCompletedDates(prev => ({
      ...prev,
      [timeKey]: nextCompleted
    }));
    
    // Automatically check or uncheck all individual sub-items
    setCompletedDateItems(prev => {
      const dayItems: Record<string, boolean> = {};
      scheduleItemsList.forEach(it => {
        dayItems[it.label] = nextCompleted;
      });
      return {
        ...prev,
        [timeKey]: dayItems
      };
    });
  };

  // System recommended default schedule helper
  const getSystemDefaults = (): ScheduleItem[] => {
    const disciplineName = profile.discipline;
    const hours = profile.studyHours || 3;

    // Helper to extract first few subtopics for each category to show as specific examples
    const getSubtopicsForCategory = (cat: string, maxCount = 2): string[] => {
      const catTopics = topics.filter(t => t.category === cat);
      if (catTopics.length === 0) return ["Estudo dos tópicos gerais do edital"];
      
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

      const all = catTopics.flatMap(getSubtopicsForTopic);
      return all.slice(0, maxCount);
    };

    const portSubs = getSubtopicsForCategory("comuns", 2);
    const didacticaSubs = getSubtopicsForCategory("didatica", 2);
    const legSubs = getSubtopicsForCategory("legislacao", 2);
    const cearaSubs = getSubtopicsForCategory("ceara", 2);
    const indSubs = getSubtopicsForCategory("ceara", 2);
    const specSubs = getSubtopicsForCategory("especifico", 2);

    return [
      { 
        day: "Segunda", 
        desc: `Português + Didática + Específico // ${[portSubs[0], didacticaSubs[0], specSubs[0]].filter(Boolean).join(" + ")}`, 
        pct: "85%", 
        color: "bg-sky-600", 
        time: "19:00 - " + (19 + Math.round(hours)) + ":00", 
        notes: `📚 **PROGRAMAÇÃO DE SEGUNDA-FEIRA (Estudo Intercalado)**\n\n📘 **Língua Portuguesa**\n* Subtópicos hoje:\n${portSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Leitura teórica e resolução de 10 questões da FUNECE.\n\n🟢 **Didática & Temas Pedagógicos**\n* Subtópicos hoje:\n${didacticaSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Fixação ativa dos conceitos por meio de resumos.\n\n🟡 **Conhecimentos Específicos**\n* Subtópicos hoje:\n${specSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Estudo focado em problemas e teoria essencial.`
      },
      { 
        day: "Terça", 
        desc: `Legislação + Ceará + Específico // ${[legSubs[0], cearaSubs[0], specSubs[1] || specSubs[0]].filter(Boolean).join(" + ")}`, 
        pct: "75%", 
        color: "bg-indigo-600", 
        time: "19:00 - " + (19 + Math.round(hours)) + ":00", 
        notes: `📚 **PROGRAMAÇÃO DE TERÇA-FEIRA (Estudo Intercalado)**\n\n⚖️ **Legislação Educacional Nacional**\n* Subtópicos hoje:\n${legSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Leitura focada em prazos e definições da LDB/ECA.\n\n🏛️ **Administração Pública & Ceará**\n* Subtópicos hoje:\n${cearaSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Análise de artigos do Estatuto dos Servidores Públicos Civis do Ceará.\n\n🟡 **Conhecimentos Específicos**\n* Subtópicos hoje:\n${specSubs.slice(1).map(s => `  - ${s}`).join("\n") || "  - Aprofundamento teórico-prático do conteúdo do edital"}\n* Orientação: Prática focada e resolução de exercícios do tema.`
      },
      { 
        day: "Quarta", 
        desc: `Português + Didática + Indicadores // ${[portSubs[0], didacticaSubs[0], indSubs[0]].filter(Boolean).join(" + ")}`, 
        pct: "80%", 
        color: "bg-emerald-500", 
        time: "19:00 - " + (19 + Math.round(hours)) + ":00", 
        notes: `📚 **PROGRAMAÇÃO DE QUARTA-FEIRA (Estudo Intercalado)**\n\n📘 **Língua Portuguesa**\n* Subtópicos hoje:\n${portSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Análise de textos e resoluções sintáticas.\n\n🟢 **Didática & Temas Pedagógicos**\n* Subtópicos hoje:\n${didacticaSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Consolidação de correntes pedagógicas e didática.\n\n📊 **Dados e Indicadores Educacionais**\n* Subtópicos hoje:\n${indSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Memorização de siglas, fórmulas de fluxo do IDEB e indicators do SPAECE.`
      },
      { 
        day: "Quinta", 
        desc: `Legislação + Ceará + Específico // ${[legSubs[1] || legSubs[0], cearaSubs[1] || cearaSubs[0], specSubs[0]].filter(Boolean).join(" + ")}`, 
        pct: "95%", 
        color: "bg-purple-600", 
        time: "19:00 - " + (19 + Math.round(hours)) + ":00", 
        notes: `📚 **PROGRAMAÇÃO DE QUINTA-FEIRA (Estudo Intercalado)**\n\n⚖️ **Legislação Educacional Nacional**\n* Subtópicos hoje:\n${legSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Estudo das diretrizes nacionais e reformas do Ensino Médio.\n\n🏛️ **Administração Pública & Ceará**\n* Subtópicos hoje:\n${cearaSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Direitos, deveres e plano de carreira do Magistério do Ceará.\n\n🟡 **Conhecimentos Específicos**\n* Subtópicos hoje:\n${specSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Aprofundamento conceitual e resolução de simulados de ${disciplineName}.`
      },
      { 
        day: "Sexta", 
        desc: `Didática + Indicadores + Específico // ${[didacticaSubs[1] || didacticaSubs[0], indSubs[1] || indSubs[0], specSubs[1] || specSubs[0]].filter(Boolean).join(" + ")}`, 
        pct: "70%", 
        color: "bg-amber-500", 
        time: "19:00 - " + (19 + Math.round(hours)) + ":00", 
        notes: `📚 **PROGRAMAÇÃO DE SEXTA-FEIRA (Estudo Intercalado)**\n\n🟢 **Didática & Temas Pedagógicos**\n* Subtópicos hoje:\n${didacticaSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Estudo do papel do professor e dimensão ética da docência.\n\n📊 **Dados e Indicadores Educacionais**\n* Subtópicos hoje:\n${indSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Exercícios práticos sobre as estatísticas educacionais do Ceará.\n\n🟡 **Conhecimentos Específicos**\n* Subtópicos hoje:\n${specSubs.map(s => `  - ${s}`).join("\n")}\n* Orientação: Revisão de fórmulas e conceitos da sua disciplina específica.`
      },
      { 
        day: "Sábado", 
        desc: "Simulado Geral Seduc-CE", 
        pct: "95%", 
        color: "bg-rose-500 font-semibold text-white", 
        time: "09:00 - 12:00", 
        notes: "🎯 **SIMULADO DE SÁBADO**\n\nResolva questões de todas as disciplinas estudadas ao longo da semana para consolidar o aprendizado sob pressão de tempo (3 minutos por questão)."
      },
      { 
        day: "Domingo", 
        desc: "Revisão de Erros & Descanso 🌿", 
        pct: "35%", 
        color: "bg-teal-500", 
        time: "10:00 - 11:30", 
        notes: "🧠 **ATIVIDADE DE DOMINGO: APRENDIZAGEM COM ERROS**\n\nAnalise detalhadamente cada erro cometido no simulado de sábado, registre em seu caderno de erros e descanse no período da tarde para renovar as energias."
      }
    ];
  };

  // Persistent custom schedule items
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem("ia_aprova_custom_schedule_v5");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && typeof item === "object" && typeof item.day === "string");
        }
      } catch (e) {}
    }
    return getSystemDefaults();
  });

  useEffect(() => {
    localStorage.setItem("ia_aprova_custom_schedule_v5", JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "true") {
      // Remove query parameter from URL so it doesn't print again on reload
      const search = window.location.search.replace(/[?&]print=true/, "").replace(/^&/, "?");
      const cleanSearch = search === "?" ? "" : search;
      const newUrl = window.location.pathname + cleanSearch;
      window.history.replaceState({}, document.title, newUrl);
      
      // Small timeout to allow the layout to render completely before printing
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle re-trigger defaults if discipline changes and user has not customized yet
  const [hasCustomized, setHasCustomized] = useState(() => {
    return localStorage.getItem("ia_aprova_has_customized_schedule") === "true";
  });

  useEffect(() => {
    if (!hasCustomized) {
      setScheduleItems(getSystemDefaults());
    } else {
      // If customized, just update the specific discipline day (which represents Quinta or contains "Específico" / "Sociologia")
      setScheduleItems(prev => prev.map(item => {
        if (item.day === "Quinta" || item.desc.includes("Específico") || item.desc.includes("Clássicos da Sociologia")) {
          if (profile.discipline === "Sociologia") {
            return {
              day: "Quinta",
              desc: "Clássicos da Sociologia (Marx, Durkheim, Weber)",
              pct: "95%",
              color: "bg-amber-500",
              time: "19:00 - 21:00",
              notes: "Conceitos fundamentais: mais-valia, fatos sociais, ação social e racionalização."
            };
          } else {
            return {
              day: "Quinta",
              desc: `Conhecimentos Específicos de ${profile.discipline}`,
              pct: "95%",
              color: "bg-amber-500",
              time: "19:00 - 21:00",
              notes: `Aprofundamento em tópicos fundamentais de edital para ${profile.discipline}.`
            };
          }
        }
        return item;
      }));
    }
  }, [profile.discipline, hasCustomized]);

  // Calendar Modal & Editing States
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [calendarView, setCalendarView] = useState<"month" | "list">("month");
  
  // Tab Switcher between "mapping" (Mapeamento de Conteúdo) and "schedule" (Cronograma)
  const [activeTab, setActiveTab] = useState<"mapping" | "schedule">(controlledActiveTab || "mapping");

  useEffect(() => {
    if (controlledActiveTab !== undefined) {
      setActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  // Study Guide Modal States
  const [isStudyGuideOpen, setIsStudyGuideOpen] = useState(false);
  const [selectedGuideTopic, setSelectedGuideTopic] = useState<string | null>(null);
  const [selectedGuideCategory, setSelectedGuideCategory] = useState<string | null>(null);

  // Print Helper Modal States
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Dynamic monthly navigation for the calendar view
  const [currentCalendarYear, setCurrentCalendarYear] = useState(() => {
    const start = profile.studyStartDate ? new Date(profile.studyStartDate + "T12:00:00") : new Date();
    return start.getFullYear();
  });
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => {
    const start = profile.studyStartDate ? new Date(profile.studyStartDate + "T12:00:00") : new Date();
    return start.getMonth();
  });

  // Pre-calculate the entire interleaved schedule for the active study period
  const examSchedule = useMemo(() => {
    if (!profile.examDate) return {};
    
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const startDateObj = new Date((profile.studyStartDate || todayStr) + "T12:00:00");
    startDateObj.setHours(0, 0, 0, 0);
    
    const examDateObj = new Date(profile.examDate + "T12:00:00");
    examDateObj.setHours(0, 0, 0, 0);
    
    const totalDaysAvailable = Math.max(0, Math.round((examDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)));
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

    // Count active study sessions precisely by simulating the actual schedule dates
    let tempCurrent = new Date(startDateObj);
    while (tempCurrent <= examDateObj) {
      const daysToExam = Math.round((examDateObj.getTime() - tempCurrent.getTime()) / (1000 * 60 * 60 * 24));
      if (daysToExam > 0 && daysToExam > reviewDays) {
        const wkday = tempCurrent.getDay();
        if (wkday >= 1 && wkday <= 5) {
          const cats = weekdayCategories[wkday] || [];
          cats.forEach(cat => {
            if (sessionCounts[cat] !== undefined) sessionCounts[cat]++;
          });
        }
      }
      tempCurrent.setDate(tempCurrent.getDate() + 1);
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
      const daysToExam = Math.round((examDateObj.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      
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
              notes: "Fase de Revisão Final: Utilize seus resumos, mapas mentais e faça questões rápidas de fixação sobre os Temas Pedagógicos do edital.",
              items: [{ label: "Didática", subtopics: ["Revisão Geral de Didática e Temas Pedagógicos"], category: "didatica", topicName: "Didática Geral" }]
            };
          } else if (daysToExam === 6) {
            scheduleMap[timeKey] = {
              title: "Revisão: Legislação & Admin.",
              desc: "Revisão Ativa: Administração Pública e Legislação Básica",
              color: "bg-indigo-600",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: "Fase de Revisão Final: Revise a LDB, o Estatuto do Ceará e o Estatuto do Magistério. Foque em prazos e regras específicas!",
              items: [{ label: "Legislação", subtopics: ["Revisão de LDB, ECA e Estatuto do Magistério do CE"], category: "legislacao", topicName: "Legislação de Ensino" }]
            };
          } else if (daysToExam === 5) {
            scheduleMap[timeKey] = {
              title: "Revisão: Língua Portuguesa",
              desc: "Revisão Ativa: Língua Portuguesa Básica",
              color: "bg-blue-500",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: "Fase de Revisão Final: Faça questões sobre concordância, regência, pontuação e crase da banca FUNECE.",
              items: [{ label: "Português", subtopics: ["Revisão de Concordância, Regência, Crase e Pontuação"], category: "comuns", topicName: "Língua Portuguesa (Leitura, Compreensão e Gramática)" }]
            };
          } else if (daysToExam === 4) {
            scheduleMap[timeKey] = {
              title: "Revisão: Dados & Indicadores",
              desc: "Revisão Ativa: Leitura e Interpretação de Dados e Indicadores",
              color: "bg-purple-600",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: "Fase de Revisão Final: Revise fórmulas do IDEB, distorção idade-série e taxas de fluxo escolar (abandono, evasão).",
              items: [{ label: "Indicadores", subtopics: ["Revisão de Fórmulas de IDEB, SPAECE, Fluxo Escolar"], category: "ceara", topicName: "Leitura e Interpretação de Dados e Indicadores Educacionais" }]
            };
          } else if (daysToExam === 3) {
            scheduleMap[timeKey] = {
              title: `Revisão: Específico (${profile.discipline})`,
              desc: `Revisão Ativa: Conhecimentos Específicos de ${profile.discipline}`,
              color: "bg-amber-500",
              time: "19:00 - " + (19 + Math.round(hours)) + ":00",
              notes: `Fase de Revisão Final: Dedique este dia para consolidar as fórmulas, teorias e conceitos mais cobrados de ${profile.discipline}.`,
              items: [{ label: "Específico", subtopics: [`Revisão Geral e Resolução de Questões de ${profile.discipline}`], category: "especifico", topicName: "Conhecimentos Específicos" }]
            };
          } else if (daysToExam === 2) {
            scheduleMap[timeKey] = {
              title: "Simulado Geral Seduc-CE",
              desc: "Simulado Final Completo Seduc-CE",
              color: "bg-teal-600 font-semibold",
              time: "08:00 - 12:00",
              notes: "Simulado Geral Final: Reserve 4 horas ininterruptas e resolva uma prova completa simulando as condições reais do concurso.",
              items: [{ label: "Simulado Final", subtopics: ["Simulação completa das condições e tempo de prova"], category: "comuns", topicName: "Simulado Geral" }]
            };
          } else if (daysToExam === 1) {
            scheduleMap[timeKey] = {
              title: "Descanso e Preparação Mental 🌿",
              desc: "Sem estudos: Descanso absoluto e controle de ansiedade",
              color: "bg-teal-500 font-bold",
              time: "Livre",
              notes: "Sem estudos hoje! Durma cedo, mantenha-se hidratado, separe o documento com foto, caneta preta e descanse o cérebro para o grande dia.",
              items: [{ label: "Descanso Geral", subtopics: ["Relaxamento, hidratação, sono adequado e preparação de materiais"], category: "comuns", topicName: "Descanso" }]
            };
          }
        } else {
          scheduleMap[timeKey] = {
            title: "Descanso e Preparação Mental 🌿",
            desc: "Sem estudos: Descanso absoluto e controle de ansiedade",
            color: "bg-teal-500 font-bold",
            time: "Livre",
            notes: "Sem estudos hoje! Descanse bem, separe canetas e documentos e prepare a mente para a prova amanhã.",
            items: [{ label: "Descanso Geral", subtopics: ["Preparação mental e relaxamento antes do exame"], category: "comuns", topicName: "Descanso" }]
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
            notes: "🎯 **ATIVIDADE DE SÁBADO: SIMULADO DE FIXAÇÃO**\n\nResolva 30 a 40 questões focadas nos temas estudados de segunda a sexta desta semana.\n\nFoque em reproduzir o ambiente de prova: sem celular, sem consultas, cronometrando o tempo médio de 3 minutos por questão.",
            items: [
              {
                label: "Simulado de Fixação",
                subtopics: ["Foco: Temas estudados durante a semana (30-40 questões)"],
                category: "comuns",
                topicName: "Simulado Geral"
              }
            ]
          };
        } else if (wkday === 0) {
          scheduleMap[timeKey] = {
            title: "Revisão de Erros e Descanso 🌿",
            desc: "Análise ativa do simulado e descanso restaurador",
            color: "bg-teal-500 text-white",
            time: "10:00 - 12:00",
            notes: "🧠 **ATIVIDADE DE DOMINGO: APRENDIZAGEM COM ERROS**\n\n1. Abra o gabarito do simulado de ontem.\n2. Para cada erro, identifique se foi por falta de atenção, pressa, ou desconhecimento teórico.\n3. Revise as regras ou pontos correspondentes por 1 hora.\n4. Tire o restante do dia livre para lazer e descanso. Você merece!",
            items: [
              {
                label: "Análise de Erros",
                subtopics: ["Análise ativa dos erros do simulado e revisão conceitual rápida"],
                category: "comuns",
                topicName: "Revisão de Erros"
              },
              {
                label: "Descanso Restaurador",
                subtopics: ["Tempo livre de lazer e descanso para a saúde mental"],
                category: "comuns",
                topicName: "Descanso"
              }
            ]
          };
        } else {
          const cats = weekdayCategories[wkday] || [];
          const notesParts: string[] = [];
          const descParts: string[] = [];
          const subtopicsForDesc: string[] = [];
          const items: any[] = [];
          
          cats.forEach(cat => {
            const s_idx = categorySessionIndices[cat];
            const slices = categorySlices[cat] || [];
            const subtopicsToday = slices[s_idx] || [];
            
            categorySessionIndices[cat]++;
            
            let catName = "";
            let emoji = "";
            let orientation = "";
            let topicName = "";
            
            if (cat === "comuns") {
              catName = "Português";
              emoji = "📘";
              orientation = "Estudo teórico, análise de regras gerais e resolução de 10 a 15 questões da banca FUNECE.";
              topicName = "Língua Portuguesa (Leitura, Compreensão e Gramática)";
            } else if (cat === "didatica") {
              catName = "Didática";
              emoji = "🟢";
              orientation = "Fichamento rápido dos conceitos, mapas mentais e memorização das correntes/autores pedagógicos.";
              topicName = "Didática Geral";
            } else if (cat === "legislacao") {
              catName = "Legislação";
              emoji = "⚖️";
              orientation = "Leitura atenta da letra da lei (LDB/ECA) destacando prazos, responsabilidades e exceções.";
              topicName = "Legislação de Ensino";
            } else if (cat === "ceara") {
              catName = "Indicadores";
              emoji = "📊";
              orientation = "Interpretação ativa de tabelas, siglas e fórmulas do IDEB, taxas de transição e SPAECE.";
              topicName = "Leitura e Interpretação de Dados e Indicadores Educacionais";
            } else if (cat === "especifico") {
              catName = "Específico";
              emoji = "🟡";
              orientation = "Aprofundamento teórico-prático do conteúdo com dedicação especial a resolução de problemas.";
              topicName = "Conhecimentos Específicos";
            }
            
            descParts.push(catName);
            if (subtopicsToday && subtopicsToday.length > 0) {
              subtopicsForDesc.push(subtopicsToday[0]);
              items.push({
                label: catName,
                subtopics: subtopicsToday,
                category: cat,
                topicName: topicName
              });
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
            notes: `📚 **PROGRAMAÇÃO DE ESTUDOS DO DIA**\n\nHoje o seu estudo segue uma estratégia de aprendizagem intercalada (interleaving). Estude os seguintes conteúdos:\n\n${notesParts.join("\n")}`,
            items: items
          };
        }
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return scheduleMap;
  }, [profile, topics]);

  useEffect(() => {
    if (profile.studyStartDate) {
      const start = new Date(profile.studyStartDate + "T12:00:00");
      setCurrentCalendarYear(start.getFullYear());
      setCurrentCalendarMonth(start.getMonth());
    }
  }, [profile.studyStartDate]);

  const studyDatesList = useMemo(() => {
    if (!profile.examDate) return [];
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const start = new Date((profile.studyStartDate || todayStr) + "T12:00:00");
    start.setHours(0, 0, 0, 0);
    const end = new Date(profile.examDate + "T12:00:00");
    end.setHours(0, 0, 0, 0);
    
    const dates: Date[] = [];
    let current = new Date(start);
    let maxIterations = 365;
    while (current <= end && maxIterations > 0) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
      maxIterations--;
    }
    return dates;
  }, [profile.studyStartDate, profile.examDate]);

  const getTopicForDate = (year: number, month: number, day: number) => {
    if (!profile.examDate) return null;
    const timeKey = `${year}-${month}-${day}`;
    return examSchedule[timeKey] || null;
  };

  // Form Fields for editing
  const [formDay, setFormDay] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPct, setFormPct] = useState("50");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formColor, setFormColor] = useState("bg-emerald-500");

  const startEditing = (index: number) => {
    const item = scheduleItems[index];
    if (!item) return;
    setEditingDayIndex(index);
    setFormDay(item.day || "");
    setFormDesc(item.desc || "");
    setFormPct(item.pct ? item.pct.replace("%", "") : "50");
    setFormTime(item.time || "19:00 - 21:00");
    setFormNotes(item.notes || "");
    setFormColor(item.color || "bg-emerald-500");
  };

  const saveEditedDay = () => {
    if (editingDayIndex === null) return;
    const updated = [...scheduleItems];
    updated[editingDayIndex] = {
      day: formDay || "Dia",
      desc: formDesc || "Estudo",
      pct: formPct.includes("%") ? formPct : `${formPct}%`,
      color: formColor,
      time: formTime || "19:00 - 21:00",
      notes: formNotes
    };
    setScheduleItems(updated);
    setEditingDayIndex(null);
    setHasCustomized(true);
    localStorage.setItem("ia_aprova_has_customized_schedule", "true");
  };

  const addNewDay = () => {
    const newDayItem: ScheduleItem = {
      day: "Novo Dia",
      desc: "Novo Conteúdo de Estudo",
      pct: "50%",
      color: "bg-blue-500",
      time: "19:00 - 21:00",
      notes: "Adicione anotações extras aqui."
    };
    const updated = [...scheduleItems, newDayItem];
    setScheduleItems(updated);
    startEditing(updated.length - 1);
    setHasCustomized(true);
    localStorage.setItem("ia_aprova_has_customized_schedule", "true");
  };

  const deleteDay = (index: number) => {
    if (confirm("Deseja realmente remover este dia do seu cronograma?")) {
      const updated = scheduleItems.filter((_, i) => i !== index);
      setScheduleItems(updated);
      setEditingDayIndex(null);
      setHasCustomized(true);
      localStorage.setItem("ia_aprova_has_customized_schedule", "true");
    }
  };

  const resetToSystemSuggestions = () => {
    if (confirm("Isso irá substituir o seu cronograma atual pelas sugestões originais do sistema preparatório Seduc-CE. Deseja continuar?")) {
      const defaults = getSystemDefaults();
      setScheduleItems(defaults);
      setEditingDayIndex(null);
      setHasCustomized(false);
      localStorage.removeItem("ia_aprova_has_customized_schedule");
    }
  };

  const totalScheduleDays = scheduleItems.filter(item => item && item.day).length || 1;
  const completedScheduleDaysCount = scheduleItems.filter(item => item && item.day && completedDays && completedDays[item.day]).length;
  const scheduleProgressPercent = Math.round((completedScheduleDaysCount / totalScheduleDays) * 100);


  // Seduc category totals
  const categories = {
    didatica: { name: "Temas Educacionais e Pedagógicos", icon: GraduationCap, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    legislacao: { name: "Administração Pública e Legislação Básica", icon: ListChecks, color: "text-blue-600 bg-blue-50 border-blue-100" },
    comuns: { name: "Língua Portuguesa (Básico)", icon: Award, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    ceara: { name: "Leitura e Interpretação de Dados e Indicadores", icon: BookOpen, color: "text-purple-600 bg-purple-50 border-purple-100" },
    especifico: { name: `Conhecimentos Específicos: ${profile.discipline}`, icon: Award, color: "text-amber-600 bg-amber-50 border-amber-100" }
  };

  const [chartViewMode, setChartViewMode] = useState<"count" | "percent">("count");

  // Calculate stats for each category
  const chartData = Object.entries(categories).map(([key, value]) => {
    const categoryTopics = topics.filter(t => t.category === key);
    const answered = categoryTopics.reduce((acc, curr) => acc + (curr.questionsAnswered || 0), 0);
    const correct = categoryTopics.reduce((acc, curr) => acc + (curr.questionsCorrect || 0), 0);
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    
    let shortName = "Geral";
    if (key === "didatica") shortName = "Temas Pedag.";
    else if (key === "legislacao") shortName = "Legis. & Admin.";
    else if (key === "comuns") shortName = "Português";
    else if (key === "ceara") shortName = "Interp. Dados";
    else if (key === "especifico") shortName = "Específico";

    return {
      key,
      category: shortName,
      fullName: value.name,
      "Respondidas": answered,
      "Corretas": correct,
      "Aproveitamento": pct,
    };
  });

  const trendData = (profile.history || []).map((entry) => {
    const accuracy = entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0;
    return {
      date: entry.date,
      "Acertos": entry.score,
      "Questões": entry.total,
      "Aproveitamento": accuracy,
      "Assunto": entry.topic
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800 shadow-xl space-y-1.5 text-xs">
          <p className="font-bold text-slate-200">{data.fullName}</p>
          <div className="space-y-1 font-mono text-[11px]">
            <p className="flex justify-between gap-6">
              <span className="text-slate-400">Respondidas:</span>
              <span className="font-bold text-slate-300">{data.Respondidas}</span>
            </p>
            <p className="flex justify-between gap-6">
              <span className="text-emerald-400">Acertos:</span>
              <span className="font-bold text-emerald-300">{data.Corretas}</span>
            </p>
            <div className="pt-1.5 border-t border-slate-800 flex justify-between gap-6 items-center">
              <span className="text-amber-400 font-sans font-semibold">Aproveitamento:</span>
              <span className="font-bold text-amber-300 text-xs">{data.Aproveitamento}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getCategoryStats = (catKey: string) => {
    const catTopics = topics.filter(t => t.category === catKey);
    const total = catTopics.length;
    const completed = catTopics.filter(t => t.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
  };

  const getFilteredTopics = (catKey: string) => {
    return topics.filter(topic => {
      if (topic.category !== catKey) return false;

      if (topicSearch.trim() !== "") {
        const query = topicSearch.toLowerCase();
        if (!topic.name.toLowerCase().includes(query)) return false;
      }

      if (statusFilter === "completed") {
        return topic.completed;
      } else if (statusFilter === "pending") {
        return !topic.completed && topic.questionsAnswered === 0;
      } else if (statusFilter === "in_practice") {
        return topic.questionsAnswered > 0;
      }

      return true;
    });
  };

  const getDaysRemaining = () => {
    if (!profile.examDate) return null;
    const examDateObj = new Date(profile.examDate + "T12:00:00");
    examDateObj.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = examDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <div className="space-y-8 print:hidden">
      {/* Welcome Banner */}
      {activeTab === "mapping" && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-xl p-4 sm:p-5 text-slate-800 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full filter blur-3xl -z-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-emerald-200/50">
                Perfil Ativo • Seduc-CE 2026
              </span>
              <h2 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-950 mt-0.5">
                Olá, {profile.name || "Gerliane"}! 👋
              </h2>
              <p className="text-slate-600 text-xxs sm:text-xs max-w-lg leading-relaxed">
                Pronto para os estudos de hoje? Seu cronograma personalizado de <strong className="text-emerald-800 font-bold">{profile.studyHours || "2"}h</strong> está focado na área de <strong className="text-emerald-850 font-bold">{profile.discipline || "Biologia"}</strong>. Perfil de atuação cadastrado: <strong className="text-slate-700 font-semibold">{!profile.isTeacher || profile.isTeacher === 'no' || profile.isTeacher === 'none' ? 'Ainda não atua como professor' : profile.isTeacher === 'yes_public' ? 'Professor na Rede Pública' : 'Professor na Rede Privada'}</strong>.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white border border-emerald-100/85 rounded-2xl p-4 shadow-xxs shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 overflow-hidden border border-emerald-100 shrink-0">
                {profile.squareLogo ? (
                  <img src={profile.squareLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
                )}
              </div>
              <div>
                <p className="text-emerald-800 text-[10px] uppercase tracking-wider font-bold">Idade & Perfil</p>
                <p className="font-mono font-bold text-xs sm:text-sm text-slate-850 mt-0.5">{profile.age || "26"} anos • {profile.gender || "Feminino"}</p>
                <p className="text-slate-400 text-[10px] font-mono mt-0.5">Banca: {profile.banca || "FUNECE"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOVO: Banner de Contagem Regressiva para a Prova e Edital (Luminoso, Compacto e Minimalista) */}
      {profile.examDate && activeTab === "mapping" && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans shadow-3xs"
        >
          <div className="flex items-center gap-3 shrink-1">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50 shrink-0">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded tracking-wider font-mono">
                  FOCO NO GRANDE DIA • CRONOGRAMA DE RETA FINAL
                </span>
                <span className="text-slate-500 font-medium text-xxs font-mono bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                  Data Prevista da Prova: <span className="font-bold text-slate-700">{new Date(profile.examDate + "T12:00:00").toLocaleDateString('pt-BR')}</span>
                </span>
              </div>
              <p className="text-slate-500 text-xxs leading-normal font-medium max-w-xl">
                {profile.hasEdital ? (
                  <span>Edital <strong>{profile.editalFileName}</strong> ativo.</span>
                ) : (
                  <span>Cronograma de preparação diária active.</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center min-w-[150px] text-center shrink-0">
            {(() => {
              const daysLeft = getDaysRemaining();
              if (daysLeft === null) return null;
              if (daysLeft < 0) {
                return (
                  <>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">CONTAGEM REGRESSIVA</span>
                    <span className="text-xs font-black text-slate-500 font-mono mt-0.5">PROVA CONCLUÍDA</span>
                  </>
                );
              } else if (daysLeft === 0) {
                return (
                  <>
                    <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest font-mono animate-pulse">É HOJE! 🎉</span>
                    <span className="text-xs font-black text-rose-600 font-mono mt-0.5">DIA DA PROVA</span>
                  </>
                );
              } else {
                return (
                  <>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">CONTAGEM REGRESSIVA</span>
                    <span className="text-sm font-black text-slate-800 font-mono mt-0.5">
                      <strong className="text-emerald-600 font-black text-base">{daysLeft}</strong> {daysLeft === 1 ? 'Dia' : 'Dias'}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">restante{daysLeft !== 1 ? 's' : ''} de estudo</span>
                  </>
                );
              }
            })()}
          </div>
        </motion.div>
      )}

      {/* Metrics Banner */}
      {activeTab === "mapping" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Duração do Estudo",
              value: `${Math.round(profile.totalSeconds / 60)} min`,
              sub: "Tempo ativo hoje",
              icon: Clock,
              color: "text-indigo-600 bg-indigo-50 border-indigo-100/50"
            },
            {
              label: "Questões Respondidas",
              value: profile.totalQuestions,
              sub: `${profile.totalCorrect} acertos`,
              icon: Award,
              color: "text-emerald-600 bg-emerald-50 border-emerald-100/50"
            },
            {
              label: "Aproveitamento",
              value: `${hitRate}%`,
              sub: hitRate >= 70 ? "Zona de Aprovação 🎯" : "Meta: Mínimo 75%",
              icon: TrendingUp,
              color: "text-amber-600 bg-amber-50 border-amber-100/50"
            },
            {
              label: "Estudos Consecutivos",
              value: `${profile.streak} Dias`,
              sub: "Ritmo de aprovação",
              icon: Flame,
              color: "text-rose-600 bg-rose-50 border-rose-100/50"
            }
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-100 p-3.5 shadow-xs flex items-center gap-3 hover:shadow-md transition-all"
            >
              <div className={`p-2 rounded-lg border shrink-0 ${metric.color}`}>
                <metric.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">{metric.label}</p>
                <h4 className="font-mono text-base font-extrabold text-slate-800 mt-0.5">{metric.value}</h4>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">{metric.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {activeTab === "mapping" ? (
          <>
            {/* Main section: Study Progress & Content Map */}
            <div className="lg:col-span-3 space-y-6">
              {/* Grid de Gráficos de Alto Desempenho */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Gráfico 1: Desempenho por Categoria (Barras) */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider">Progresso de Acertos por Categoria</h3>
                      <p className="text-slate-400 text-xxs">Desempenho comparativo de acertos nas provas e simulados</p>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => setChartViewMode("count")}
                        className={`px-2.5 py-1 text-xxs font-semibold rounded-lg transition-all cursor-pointer ${
                          chartViewMode === "count"
                            ? "bg-white text-slate-800 shadow-xxs"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        Quantidade
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartViewMode("percent")}
                        className={`px-2.5 py-1 text-xxs font-semibold rounded-lg transition-all cursor-pointer ${
                          chartViewMode === "percent"
                            ? "bg-white text-slate-800 shadow-xxs"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        Aproveitamento (%)
                      </button>
                    </div>
                  </div>

                  {/* Recharts Container */}
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                          dataKey="category"
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                          tickFormatter={(val) => chartViewMode === "percent" ? `${val}%` : val}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        {chartViewMode === "count" ? (
                          <>
                            <Bar dataKey="Respondidas" name="Respondidas" radius={[4, 4, 0, 0]} maxBarSize={20} fill="#64748b">
                              {chartData.map((entry, index) => {
                                let color = "#64748b"; // solid default slate
                                if (entry.key === "legislacao") color = "#3b82f6"; // blue-500
                                if (entry.key === "didatica") color = "#10b981"; // emerald-500
                                if (entry.key === "ceara") color = "#a855f7"; // purple-500
                                if (entry.key === "comuns") color = "#6366f1"; // indigo-500
                                if (entry.key === "especifico") color = "#f59e0b"; // amber-500
                                return <Cell key={`cell-resp-${index}`} fill={color} fillOpacity={0.6} />;
                              })}
                            </Bar>
                            <Bar dataKey="Corretas" name="Corretas" radius={[4, 4, 0, 0]} maxBarSize={20} fill="#334155">
                              {chartData.map((entry, index) => {
                                let color = "#334155"; // dark slate
                                if (entry.key === "legislacao") color = "#1d4ed8"; // blue-700
                                if (entry.key === "didatica") color = "#047857"; // emerald-700
                                if (entry.key === "ceara") color = "#7e22ce"; // purple-700
                                if (entry.key === "comuns") color = "#4338ca"; // indigo-700
                                if (entry.key === "especifico") color = "#b45309"; // amber-700
                                return <Cell key={`cell-corr-${index}`} fill={color} />;
                              })}
                            </Bar>
                          </>
                        ) : (
                          <Bar dataKey="Aproveitamento" name="Aproveitamento (%)" radius={[5, 5, 0, 0]} maxBarSize={28} fill="#2563eb">
                            {chartData.map((entry, index) => {
                              let barColor = "#2563eb"; // blue-600
                              if (entry.key === "legislacao") barColor = "#1d4ed8"; // blue-700
                              if (entry.key === "didatica") barColor = "#059669"; // emerald-600
                              if (entry.key === "ceara") barColor = "#7e22ce"; // purple-700
                              if (entry.key === "comuns") barColor = "#4338ca"; // indigo-700
                              if (entry.key === "especifico") barColor = "#d97706"; // amber-700
                              return <Cell key={`cell-${index}`} fill={barColor} />;
                            })}
                          </Bar>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Chart Legend Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5 border-t border-slate-100">
                    {chartData.map((item, index) => {
                      let badgeColor = "bg-blue-500";
                      let bgBadge = "bg-blue-50/20 text-blue-700 border-blue-100/40";
                      if (item.key === "legislacao") {
                        badgeColor = "bg-blue-500";
                        bgBadge = "bg-blue-50/25 text-blue-700 border-blue-100/30";
                      } else if (item.key === "didatica") {
                        badgeColor = "bg-emerald-500";
                        bgBadge = "bg-emerald-50/25 text-emerald-700 border-emerald-100/30";
                      } else if (item.key === "ceara") {
                        badgeColor = "bg-purple-500";
                        bgBadge = "bg-purple-50/25 text-purple-700 border-purple-100/30";
                      } else if (item.key === "comuns") {
                        badgeColor = "bg-indigo-500";
                        bgBadge = "bg-indigo-50/25 text-indigo-700 border-indigo-100/30";
                      } else if (item.key === "especifico") {
                        badgeColor = "bg-amber-500";
                        bgBadge = "bg-amber-50/25 text-amber-700 border-amber-100/30";
                      }

                      return (
                        <div 
                          key={index} 
                          className={`flex flex-col justify-between p-3 rounded-xl border ${bgBadge} transition-all hover:bg-white`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${badgeColor}`}></span>
                            <span className="text-[10px] font-extrabold tracking-tight truncate uppercase font-sans">{item.category}</span>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-mono font-bold">
                              {item.Corretas} / {item.Respondidas} <span className="text-[9px] font-semibold opacity-70">acertos</span>
                            </p>
                            <p className="text-[10px] font-bold opacity-80">
                              Rendimento: <span className="font-mono font-extrabold">{item.Aproveitamento}%</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gráfico 2: Evolução de Acertos e Rendimento (Linha) */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider">Evolução do Rendimento</h3>
                      <p className="text-slate-400 text-xxs">Histórico cronológico de acertos e aproveitamento (%) nos simulados</p>
                    </div>
                  </div>

                  {trendData.length > 0 ? (
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            yAxisId="left"
                          />
                          <YAxis
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            orientation="right"
                            yAxisId="right"
                            tickFormatter={(val) => `${val}%`}
                            domain={[0, 100]}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800 shadow-xl space-y-1.5 text-xs font-sans">
                                    <p className="font-bold text-slate-200">Sessão: {data.date}</p>
                                    <p className="text-slate-400 font-semibold text-[10px] truncate max-w-[200px]">Último tema: {data.Assunto}</p>
                                    <div className="space-y-1 font-mono text-[11px] pt-1 border-t border-slate-800">
                                      <p className="flex justify-between gap-6">
                                        <span className="text-slate-400">Total Respondidas:</span>
                                        <span className="font-bold text-slate-300">{data.Questões}</span>
                                      </p>
                                      <p className="flex justify-between gap-6">
                                        <span className="text-emerald-400">Total Acertos:</span>
                                        <span className="font-bold text-emerald-300">{data.Acertos}</span>
                                      </p>
                                      <p className="flex justify-between gap-6">
                                        <span className="text-indigo-400">Aproveitamento:</span>
                                        <span className="font-bold text-indigo-300">{data.Aproveitamento}%</span>
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Acertos"
                            name="Acertos (Qtd)"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="Aproveitamento"
                            name="Aproveitamento (%)"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-56 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-150 rounded-2xl bg-slate-50/30">
                      <p className="text-xs font-semibold">Nenhum dado histórico registrado ainda</p>
                      <p className="text-[10px] text-slate-400 mt-1">Conclua simulados para traçar seu progresso cronológico!</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                      <span>Qtd de Acertos (Eixo Esq.)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span>
                      <span>% Aproveitamento (Eixo Dir.)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>


          </>
        ) : (
          /* Full Width Cronograma section */
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">Meu Cronograma de Estudos Personalizado</h3>
                  <p className="text-slate-500 text-xs font-sans">Visualize e ajuste seu planejamento de acordo com suas necessidades diárias</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Imprimir calendário de estudos ou salvar como PDF"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  Imprimir Cronograma (PDF)
                </button>
              </div>
            </div>

            {profile.examDate && (
              <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 flex gap-3 text-left">
                <div className="p-2 bg-white rounded-xl shadow-xxs self-start shrink-0">
                  <span className="text-lg">📅</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Divisão Estratégica do Conteúdo</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Seu cronograma cobre <strong>100% do edital</strong>. Todo o conteúdo programático foi dividido de forma proporcional entre os dias restantes até a prova. A <strong>última semana antes da prova ({new Date(new Date(profile.examDate + "T12:00:00").getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} a {new Date(new Date(profile.examDate + "T12:00:00").getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')})</strong> está reservada exclusivamente para <strong>revisão geral e descanso mental</strong>, otimizando sua fixação.
                  </p>
                </div>
              </div>
            )}

            {/* Calendar Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: List of Days / Weekly Grid */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* View Selector and Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCalendarView("month")}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        calendarView === "month"
                          ? "bg-white text-emerald-800 shadow-xxs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Calendário Mensal (Grade)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarView("list")}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        calendarView === "list"
                          ? "bg-white text-emerald-800 shadow-xxs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <ListChecks className="w-3.5 h-3.5" />
                      Lista de Dias (Editor)
                    </button>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={resetToSystemSuggestions}
                      className="text-[10px] font-semibold bg-white hover:bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Redefinir para as sugestões originais do sistema"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Sugerir Padrão
                    </button>
                    <button
                      type="button"
                      onClick={addNewDay}
                      className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xxs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Novo Dia
                    </button>
                  </div>
                </div>

                {calendarView === "month" ? (
                  <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-4 space-y-4 font-sans">
                    {/* Month Name & Year with Nav arrows */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentCalendarMonth(prev => {
                              if (prev === 0) {
                                setCurrentCalendarYear(y => y - 1);
                                return 11;
                              }
                              return prev - 1;
                            });
                          }}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 min-w-[125px] justify-center font-sans">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          {(() => {
                            const months = [
                              "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                            ];
                            return `${months[currentCalendarMonth]} de ${currentCalendarYear}`;
                          })()}
                        </h4>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentCalendarMonth(prev => {
                              if (prev === 11) {
                                setCurrentCalendarYear(y => y + 1);
                                return 0;
                              }
                              return prev + 1;
                            });
                          }}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                        {profile.hasEdital ? "Edital Customizado 📑" : "Simulação Ceará"}
                      </span>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider font-sans">
                      <div>Dom</div>
                      <div>Seg</div>
                      <div>Ter</div>
                      <div>Qua</div>
                      <div>Qui</div>
                      <div>Sex</div>
                      <div>Sáb</div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {/* Empty cells for the start day of week */}
                      {Array.from({ length: new Date(currentCalendarYear, currentCalendarMonth, 1).getDay() }).map((_, i) => (
                        <div key={`empty-fs-${i}`} className="aspect-square bg-slate-100/30 border border-slate-100/50 rounded-xl opacity-40"></div>
                      ))}

                      {/* Render all days of the current month */}
                      {Array.from({ length: new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate() }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateTopic = getTopicForDate(currentCalendarYear, currentCalendarMonth, dayNum);
                        const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                        const weekdayIndex = new Date(currentCalendarYear, currentCalendarMonth, dayNum).getDay();
                        const weekdayName = weekdayNames[weekdayIndex];
                        const timeKey = `${currentCalendarYear}-${currentCalendarMonth}-${dayNum}`;
                        
                        const itemIndex = scheduleItems.findIndex(item => {
                          if (!item || !item.day) return false;
                          return item.day.toLowerCase().startsWith(weekdayName.toLowerCase().substring(0, 3));
                        });
                        
                        const scheduleItem = dateTopic ? {
                          day: dateTopic.title,
                          desc: dateTopic.desc,
                          color: dateTopic.color,
                          time: dateTopic.time,
                          notes: dateTopic.notes,
                          isExam: (dateTopic as any).isExam
                        } : (profile.examDate ? null : (itemIndex !== -1 ? scheduleItems[itemIndex] : null));
                        
                        const cleanInfo = dateTopic ? {
                          subject: "Estudo Intercalado",
                          subtopic: dateTopic.desc
                        } : (scheduleItem ? getCleanTopicInfo(scheduleItem.day, scheduleItem.color) : { subject: "", subtopic: "" });
                        const isSelected = !profile.examDate && editingDayIndex === itemIndex && itemIndex !== -1;
                        const isDone = profile.examDate 
                          ? !!completedDates[timeKey] 
                          : (scheduleItem ? !!completedDays[weekdayName] : false);
                        const isExam = scheduleItem && (scheduleItem as any).isExam;

                        return (
                          <div
                            key={`day-fs-${dayNum}`}
                            onClick={() => {
                              if (isExam) return;
                              if (scheduleItem) {
                                setSelectedCheckInDate({
                                  year: currentCalendarYear,
                                  month: currentCalendarMonth,
                                  day: dayNum,
                                  timeKey,
                                  weekdayName,
                                  scheduleItem
                                });
                              } else if (!profile.examDate && itemIndex !== -1) {
                                startEditing(itemIndex);
                              }
                            }}
                            className={`min-h-[110px] sm:min-h-[120px] p-2 border rounded-xl flex flex-col justify-between transition-all cursor-pointer relative group text-left ${
                              isExam 
                                ? "bg-rose-50 border-rose-300 ring-1 ring-rose-300/30 text-rose-950 animate-pulse"
                                : isSelected
                                ? "bg-slate-100 border-emerald-500 ring-1 ring-emerald-500/20"
                                : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 shadow-xxs"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-mono font-bold ${
                                isDone ? "text-slate-400 line-through" : isExam ? "text-rose-600 font-black" : "text-slate-700"
                              }`}>
                                {dayNum}
                              </span>
                              
                              {!isExam && scheduleItem && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (profile.examDate) {
                                      setCompletedDates(prev => ({
                                        ...prev,
                                        [timeKey]: !prev[timeKey]
                                      }));
                                    } else {
                                      setCompletedDays(prev => ({
                                        ...prev,
                                        [weekdayName]: !prev[weekdayName]
                                      }));
                                    }
                                  }}
                                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
                                    isDone
                                      ? "bg-emerald-600 border-emerald-600 text-white"
                                      : "border-slate-200 hover:border-slate-400 bg-slate-50"
                                  }`}
                                >
                                  {isDone && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                </button>
                              )}
                            </div>

                            {scheduleItem ? (
                              <div className="space-y-0.5 mt-1 min-w-0">
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${scheduleItem.color || "bg-emerald-500"}`}></span>
                                  <span className={`text-[8px] font-bold truncate max-w-full block font-mono uppercase tracking-tight leading-tight ${isExam ? "text-rose-700 font-black" : "text-slate-700"}`}>
                                    {isExam ? "PROVA! 🏁" : cleanInfo.subject}
                                  </span>
                                </div>
                                <span className={`text-[8px] block leading-snug font-sans font-medium line-clamp-3 text-left ${isDone ? "text-slate-400 line-through font-normal" : "text-slate-600"}`} title={scheduleItem.day}>
                                  {isExam ? "Hoje é o grande dia da sua aprovação no Concurso Seduc-CE!" : cleanInfo.subtopic}
                                </span>
                              </div>
                            ) : (
                              <div className="text-[7px] text-slate-400 italic mt-auto">Livre</div>
                            )}

                            {scheduleItem && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-40 bg-white border border-slate-150 text-slate-700 text-[10px] p-2.5 rounded-lg shadow-xl w-48 pointer-events-none transition-all font-sans">
                                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${scheduleItem.color}`}></span>
                                  {scheduleItem.day} • {scheduleItem.time || "19:00 - 21:00"}
                                </p>
                                <p className="font-semibold text-slate-600 mt-1">{scheduleItem.desc}</p>
                                {scheduleItem.notes && (
                                  <p className="text-[9px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1 leading-normal font-sans">
                                    {scheduleItem.notes}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : profile.examDate ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 font-sans">
                    {studyDatesList.map((date, idx) => {
                      const dayNum = date.getDate();
                      const dateTopic = getTopicForDate(date.getFullYear(), date.getMonth(), dayNum);
                      const weekdayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
                      const weekdayIndex = date.getDay();
                      const weekdayName = weekdayNames[weekdayIndex];
                      const timeKey = `${date.getFullYear()}-${date.getMonth()}-${dayNum}`;
                      
                      const scheduleItem = dateTopic ? {
                        day: dateTopic.title,
                        desc: dateTopic.desc,
                        color: dateTopic.color,
                        time: dateTopic.time,
                        notes: dateTopic.notes,
                        isExam: (dateTopic as any).isExam
                      } : null;

                      const isDone = !!completedDates[timeKey];
                      const isExam = scheduleItem && (scheduleItem as any).isExam;
                      const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

                      const cleanInfo = scheduleItem 
                        ? (scheduleItem.desc && scheduleItem.desc.includes(" // ")
                            ? { subject: scheduleItem.desc.split(" // ")[0].trim(), subtopic: scheduleItem.desc.split(" // ")[1].trim() }
                            : { subject: "Estudo", subtopic: scheduleItem.desc })
                        : { subject: "Revisão / Livre", subtopic: "Folga programada ou revisão de pontos fracos" };

                      return (
                        <div
                          key={`list-item-${idx}`}
                          onClick={() => {
                            if (isExam) return;
                            if (scheduleItem) {
                              setSelectedCheckInDate({
                                year: date.getFullYear(),
                                month: date.getMonth(),
                                day: dayNum,
                                timeKey,
                                weekdayName,
                                scheduleItem
                              });
                            }
                          }}
                          className={`group border rounded-2xl p-4 transition-all text-left cursor-pointer relative ${
                            isExam 
                              ? "bg-rose-50 border-rose-300 ring-1 ring-rose-300/30 text-rose-950 animate-pulse"
                              : "bg-white border-slate-150 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-bold text-xs text-slate-800 flex items-center gap-1.5 font-sans">
                              <span className={`w-2 h-2 rounded-full ${scheduleItem?.color || "bg-emerald-500"}`}></span>
                              {formattedDate} - {weekdayName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {scheduleItem?.time || "Meta Livre"}
                            </span>
                          </div>
                          
                          <p className="font-semibold text-slate-700 text-xs mb-1.5 line-clamp-3 font-sans">
                            {isExam ? "PROVA! 🏁" : cleanInfo.subject}
                          </p>
                          <p className="text-slate-500 text-xxs font-sans">
                            {isExam ? "Hoje é o grande dia da sua aprovação no Concurso Seduc-CE!" : cleanInfo.subtopic}
                          </p>
                          
                          {scheduleItem?.notes && (
                            <p className="text-slate-500 text-[10px] line-clamp-2 bg-slate-50 p-1.5 rounded-md mt-2 italic font-sans">
                              {scheduleItem.notes}
                            </p>
                          )}

                          {isDone && (
                            <span className="absolute top-2.5 right-2.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border border-emerald-100">
                              Feito!
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1 font-sans">
                    {scheduleItems.map((item, index) => {
                      if (!item || !item.day) return null;
                      const isSelected = editingDayIndex === index;
                      const isDone = completedDays ? !!completedDays[item.day] : false;
                      return (
                        <div
                          key={`item-fs-${index}`}
                          onClick={() => startEditing(index)}
                          className={`group border rounded-2xl p-4 transition-all text-left cursor-pointer relative ${
                            isSelected 
                              ? "bg-slate-50/70 border-emerald-500 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/10" 
                              : "bg-white border-slate-150 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-bold text-xs text-slate-800 flex items-center gap-1.5 font-sans">
                              <span className={`w-2 h-2 rounded-full ${item.color || "bg-emerald-500"}`}></span>
                              {item.day}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.time || "19:00 - 21:00"}
                            </span>
                          </div>
                          
                          <p className="font-semibold text-slate-700 text-xs mb-1.5 line-clamp-3 font-sans">{item.desc}</p>
                          
                          {item.notes && (
                            <p className="text-slate-500 text-[10px] line-clamp-2 bg-slate-50 p-1.5 rounded-md mb-2 italic font-sans">
                              {item.notes}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xxs font-sans">
                            <span className="text-slate-500 font-mono font-sans">
                              Peso/Relevância: <strong className="text-emerald-600">{item.pct}</strong>
                            </span>
                            <span className="text-slate-500 hover:text-emerald-600 font-semibold transition-colors flex items-center gap-1 font-sans">
                              <Edit3 className="w-3 h-3" /> Editar
                            </span>
                          </div>

                          {isDone && (
                            <span className="absolute top-2.5 right-2.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border border-emerald-100">
                              Feito!
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Customizer Editor Form */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-150">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    {editingDayIndex !== null ? "Customizar Dia" : "Selecione um Dia"}
                  </h4>
                  {editingDayIndex !== null && (
                    <button
                      type="button"
                      onClick={() => deleteDay(editingDayIndex)}
                      className="text-rose-500 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir este dia do cronograma"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {editingDayIndex !== null ? (
                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Dia da Semana / Atividade</label>
                      <input
                        type="text"
                        value={formDay}
                        onChange={(e) => setFormDay(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Ex: Segunda-feira, Sábado..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Assunto ou Foco do Dia</label>
                      <textarea
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
                        placeholder="Ex: Didática e Planejamento..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1" title="Peso de importância ou porcentagem de tempo recomendada font-sans">
                          Peso/Foco (%) 💡
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formPct}
                          onChange={(e) => setFormPct(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Horário Previsto</label>
                        <input
                          type="text"
                          value={formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Ex: 19:00 - 21:00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Dicas ou Notas Extras</label>
                      <textarea
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
                        placeholder="Ex: Focar no artigo 24 da LDB ou fazer 20 questões."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Cor de Marcação</label>
                      <div className="flex gap-2">
                        {[
                          { val: "bg-blue-500", name: "Azul" },
                          { val: "bg-emerald-500", name: "Verde" },
                          { val: "bg-purple-500", name: "Roxo" },
                          { val: "bg-amber-500", name: "Laranja" },
                          { val: "bg-rose-500", name: "Rosa" }
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() => setFormColor(c.val)}
                            className={`w-6 h-6 rounded-full ${c.val} transition-all cursor-pointer flex items-center justify-center`}
                            title={c.name}
                          >
                            {formColor === c.val && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={saveEditedDay}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Save className="w-4 h-4 text-emerald-400" />
                      Salvar Alterações
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 font-sans">
                    {/* Weights Indicator */}
                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xxs space-y-3 font-sans">
                      <h5 className="font-bold text-slate-800 text-xs font-sans">Pesos sugeridos (Edital)</h5>
                      
                      <div className="space-y-2.5 font-sans">
                        {/* Didática */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700 font-sans">
                            <span>Didática e Planejamento</span>
                            <span className="text-emerald-600 font-mono font-sans">Relevância: Alta</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal font-sans">Foco: Tendências pedagógicas, avaliação e LDB.</p>
                        </div>

                        {/* Legislação */}
                        <div className="space-y-1 font-sans">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700 font-sans">
                            <span>Legislação Básica</span>
                            <span className="text-indigo-600 font-mono font-sans">Relevância: Média</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal font-sans">Foco: CF/88 (art. 205 a 214), ECA e PNE.</p>
                        </div>

                        {/* Aspectos Culturais */}
                        <div className="space-y-1 font-sans">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700 font-sans">
                            <span>História e Cultura do Ceará</span>
                            <span className="text-purple-600 font-mono font-sans">Relevância: Média-Alta</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal font-sans">Foco: Formação socioeconômica e cultura cearense.</p>
                        </div>

                        {/* Conhecimentos Específicos */}
                        <div className="space-y-1 font-sans">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700 font-sans">
                            <span>Conhecimentos Específicos (Área)</span>
                            <span className="text-amber-600 font-mono font-sans">Relevância: Máxima</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal font-sans">Foco: Tópicos da sua disciplina ({profile.discipline}).</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-4 text-slate-400 space-y-2 border-t border-slate-100 pt-4 font-sans">
                      <Calendar className="w-6 h-6 mx-auto text-slate-300 animate-pulse" />
                      <p className="text-xxs font-sans">Selecione qualquer dia da grade ou clique em um item da lista para customizar os seus horários e anotações.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar & Customizable Weekly Plan Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-100 text-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">Meu Cronograma de Estudos Personalizado</h3>
                  <p className="text-slate-500 text-xs font-sans">Visualize e ajuste seu planejamento de acordo com suas necessidades diárias</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCalendarModalOpen(false);
                  setEditingDayIndex(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-150/40 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {profile.examDate && (
                <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 flex gap-3 text-left">
                  <div className="p-2 bg-white rounded-xl shadow-xxs self-start shrink-0">
                    <span className="text-lg">📅</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Divisão Estratégica do Conteúdo</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Seu cronograma cobre <strong>100% do edital</strong>. Todo o conteúdo programático foi dividido de forma proporcional entre os dias restantes até a prova. A <strong>última semana antes da prova ({new Date(new Date(profile.examDate + "T12:00:00").getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} a {new Date(new Date(profile.examDate + "T12:00:00").getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')})</strong> está reservada exclusivamente para <strong>revisão geral e descanso mental</strong>, otimizando sua fixação.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: List of Days / Weekly Grid */}
              <div className="md:col-span-2 space-y-4">
                
                {/* View Selector and Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCalendarView("month")}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        calendarView === "month"
                          ? "bg-white text-emerald-800 shadow-xxs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Calendário Mensal (Grade)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarView("list")}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        calendarView === "list"
                          ? "bg-white text-emerald-800 shadow-xxs border border-slate-200/40"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <ListChecks className="w-3.5 h-3.5" />
                      Lista de Dias (Editor)
                    </button>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPrintModalOpen(true)}
                      className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xxs"
                      title="Imprimir calendário de estudos ou salvar como PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                      Imprimir (PDF)
                    </button>
                    <button
                      type="button"
                      onClick={resetToSystemSuggestions}
                      className="text-[10px] font-semibold bg-white hover:bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                      title="Redefinir para as sugestões originais do sistema"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Sugerir Padrão
                    </button>
                    <button
                      type="button"
                      onClick={addNewDay}
                      className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xxs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Novo Dia
                    </button>
                  </div>
                </div>

                {calendarView === "month" ? (
                  <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-4 space-y-4 font-sans">
                    {/* Month Name & Year with Nav arrows */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentCalendarMonth(prev => {
                              if (prev === 0) {
                                setCurrentCalendarYear(y => y - 1);
                                return 11;
                              }
                              return prev - 1;
                            });
                          }}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-1.5 min-w-[125px] justify-center">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          {(() => {
                            const months = [
                              "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                            ];
                            return `${months[currentCalendarMonth]} de ${currentCalendarYear}`;
                          })()}
                        </h4>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentCalendarMonth(prev => {
                              if (prev === 11) {
                                setCurrentCalendarYear(y => y + 1);
                                return 0;
                              }
                              return prev + 1;
                            });
                          }}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                        {profile.hasEdital ? "Edital Customizado 📑" : "Simulação Ceará"}
                      </span>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                      <div>Dom</div>
                      <div>Seg</div>
                      <div>Ter</div>
                      <div>Qua</div>
                      <div>Qui</div>
                      <div>Sex</div>
                      <div>Sáb</div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {/* Empty cells for the start day of week */}
                      {Array.from({ length: new Date(currentCalendarYear, currentCalendarMonth, 1).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square bg-slate-100/30 border border-slate-100/50 rounded-xl opacity-40"></div>
                      ))}

                      {/* Render all days of the current month */}
                      {Array.from({ length: new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate() }).map((_, i) => {
                        const dayNum = i + 1;
                        const timeKey = `${currentCalendarYear}-${currentCalendarMonth}-${dayNum}`;
                        
                        // Check if we have a tailored topic or exam date
                        const dateTopic = getTopicForDate(currentCalendarYear, currentCalendarMonth, dayNum);
                        
                        // Fallback if not custom exam schedule
                        const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                        const weekdayIndex = new Date(currentCalendarYear, currentCalendarMonth, dayNum).getDay();
                        const weekdayName = weekdayNames[weekdayIndex];
                        
                        const itemIndex = scheduleItems.findIndex(item => {
                          if (!item || !item.day) return false;
                          return item.day.toLowerCase().startsWith(weekdayName.toLowerCase().substring(0, 3));
                        });
                        
                        const scheduleItem = dateTopic ? {
                          day: dateTopic.title,
                          desc: dateTopic.desc,
                          color: dateTopic.color,
                          time: dateTopic.time,
                          notes: dateTopic.notes,
                          isExam: (dateTopic as any).isExam
                        } : (profile.examDate ? null : (itemIndex !== -1 ? scheduleItems[itemIndex] : null));
                        
                        const cleanInfo = dateTopic ? {
                          subject: "Estudo Intercalado",
                          subtopic: dateTopic.desc
                        } : (scheduleItem ? getCleanTopicInfo(scheduleItem.day, scheduleItem.color) : { subject: "", subtopic: "" });
                        const isSelected = !profile.examDate && editingDayIndex === itemIndex && itemIndex !== -1;
                        const isDone = profile.examDate 
                          ? !!completedDates[timeKey] 
                          : (scheduleItem ? !!completedDays[weekdayName] : false);
                        const isExam = scheduleItem && (scheduleItem as any).isExam;

                        return (
                          <div
                            key={`day-${dayNum}`}
                            onClick={() => {
                              if (isExam) return;
                              if (scheduleItem) {
                                setSelectedCheckInDate({
                                  year: currentCalendarYear,
                                  month: currentCalendarMonth,
                                  day: dayNum,
                                  timeKey,
                                  weekdayName,
                                  scheduleItem
                                });
                              } else if (!profile.examDate && itemIndex !== -1) {
                                startEditing(itemIndex);
                              }
                            }}
                            className={`min-h-[110px] sm:min-h-[120px] p-2 border rounded-xl flex flex-col justify-between transition-all cursor-pointer relative group text-left ${
                              isExam 
                                ? "bg-rose-50 border-rose-300 ring-1 ring-rose-300/30 text-rose-950 animate-pulse"
                                : isSelected
                                ? "bg-slate-100 border-emerald-500 ring-1 ring-emerald-500/20"
                                : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 shadow-xxs"
                            }`}
                          >
                            {/* Day Number and Completion Checkbox */}
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-mono font-bold ${
                                isDone ? "text-slate-400 line-through" : isExam ? "text-rose-600 font-black" : "text-slate-700"
                              }`}>
                                {dayNum}
                              </span>
                              
                              {!isExam && scheduleItem && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation(); // prevent opening the editor
                                    if (profile.examDate) {
                                      setCompletedDates(prev => ({
                                        ...prev,
                                        [timeKey]: !prev[timeKey]
                                      }));
                                    } else {
                                      setCompletedDays(prev => ({
                                        ...prev,
                                        [weekdayName]: !prev[weekdayName]
                                      }));
                                    }
                                  }}
                                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
                                    isDone
                                      ? "bg-emerald-600 border-emerald-600 text-white"
                                      : "border-slate-200 hover:border-slate-400 bg-slate-50"
                                  }`}
                                >
                                  {isDone && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                                </button>
                              )}
                            </div>

                            {/* Subject Color Indicator / Mini-label */}
                            {scheduleItem ? (
                              <div className="space-y-0.5 mt-1 min-w-0">
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${scheduleItem.color || "bg-emerald-500"}`}></span>
                                  <span className={`text-[8px] font-bold truncate max-w-full block font-mono uppercase tracking-tight leading-tight ${isExam ? "text-rose-700 font-black" : "text-slate-700"}`}>
                                    {isExam ? "PROVA! 🏁" : cleanInfo.subject}
                                  </span>
                                </div>
                                <span className={`text-[8px] block leading-snug font-sans font-medium line-clamp-3 text-left ${isDone ? "text-slate-400 line-through font-normal" : "text-slate-600"}`} title={scheduleItem.day}>
                                  {isExam ? "Hoje é o grande dia da sua aprovação no Concurso Seduc-CE!" : cleanInfo.subtopic}
                                </span>
                              </div>
                            ) : (
                              <div className="text-[7px] text-slate-400 italic mt-auto">Livre</div>
                            )}

                            {/* Tooltip on hover */}
                            {scheduleItem && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-40 bg-white border border-slate-150 text-slate-700 text-[10px] p-2.5 rounded-lg shadow-xl w-48 pointer-events-none transition-all">
                                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${scheduleItem.color}`}></span>
                                  {scheduleItem.day} • {scheduleItem.time || "19:00 - 21:00"}
                                </p>
                                <p className="font-semibold text-slate-600 mt-1">{scheduleItem.desc}</p>
                                {scheduleItem.notes && (
                                  <p className="text-[9px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1 leading-normal font-sans">
                                    {scheduleItem.notes}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {scheduleItems.map((item, index) => {
                      if (!item || !item.day) return null;
                      const isSelected = editingDayIndex === index;
                      const isDone = completedDays ? !!completedDays[item.day] : false;
                      return (
                        <div
                          key={index}
                          onClick={() => startEditing(index)}
                          className={`group border rounded-2xl p-4 transition-all text-left cursor-pointer relative ${
                            isSelected 
                              ? "bg-slate-50/70 border-emerald-500 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/10" 
                              : "bg-white border-slate-150 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-bold text-xs text-slate-800 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${item.color || "bg-emerald-500"}`}></span>
                              {item.day}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.time || "19:00 - 21:00"}
                            </span>
                          </div>
                          
                          <p className="font-semibold text-slate-700 text-xs mb-1.5 line-clamp-3">{item.desc}</p>
                          
                          {item.notes && (
                            <p className="text-slate-500 text-[10px] line-clamp-2 bg-slate-50 p-1.5 rounded-md mb-2 italic">
                              {item.notes}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-xxs">
                            <span className="text-slate-500 font-mono">
                              Peso/Relevância: <strong className="text-emerald-600">{item.pct}</strong>
                            </span>
                            <span className="text-slate-500 hover:text-emerald-600 font-semibold transition-colors flex items-center gap-1">
                              <Edit3 className="w-3 h-3" /> Editar
                            </span>
                          </div>

                          {/* Status absolute indicator */}
                          {isDone && (
                            <span className="absolute top-2.5 right-2.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border border-emerald-100">
                              Feito!
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Customizer Editor Form */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-150">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    {editingDayIndex !== null ? "Customizar Dia" : "Selecione um Dia"}
                  </h4>
                  {editingDayIndex !== null && (
                    <button
                      onClick={() => deleteDay(editingDayIndex)}
                      className="text-rose-500 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir este dia do cronograma"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {editingDayIndex !== null ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Dia da Semana / Atividade</label>
                      <input
                        type="text"
                        value={formDay}
                        onChange={(e) => setFormDay(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder="Ex: Segunda-feira, Sábado..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Assunto ou Foco do Dia</label>
                      <textarea
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
                        placeholder="Ex: Didática e Planejamento..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1" title="Peso de importância ou porcentagem de tempo recomendada">
                          Peso/Foco (%) 💡
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formPct}
                          onChange={(e) => setFormPct(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Horário Previsto</label>
                        <input
                          type="text"
                          value={formTime}
                          onChange={(e) => setFormTime(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Ex: 19:00 - 21:00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Dicas ou Notas Extras</label>
                      <textarea
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 h-16 resize-none"
                        placeholder="Ex: Focar no artigo 24 da LDB ou fazer 20 questões."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Cor de Marcação</label>
                      <div className="flex gap-2">
                        {[
                          { val: "bg-blue-500", name: "Azul" },
                          { val: "bg-emerald-500", name: "Verde" },
                          { val: "bg-purple-500", name: "Roxo" },
                          { val: "bg-amber-500", name: "Laranja" },
                          { val: "bg-rose-500", name: "Rosa" }
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() => setFormColor(c.val)}
                            className={`w-5.5 h-5.5 rounded-full ${c.val} border-2 transition-all ${
                              formColor === c.val ? "border-slate-800 scale-110 shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={saveEditedDay}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xxs"
                      >
                        <Save className="w-4 h-4" />
                        Salvar no Meu Calendário
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-3 text-left">
                      <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Composição do Edital FUNECE
                      </h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        A banca <strong className="text-slate-800">FUNECE</strong> para a SEDUC-CE divide a prova em duas grandes frentes. O nosso cronograma cobre integralmente ambas as partes:
                      </p>
                      
                      <div className="space-y-2.5 pt-1">
                        {/* Português */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>Língua Portuguesa (Básico)</span>
                            <span className="text-indigo-600">Relevância: Alta</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal">Foco: Sintaxe, concordância, interpretação e coesão textual.</p>
                        </div>

                        {/* Raciocínio Lógico */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>Raciocínio Lógico-Matemático (Básico)</span>
                            <span className="text-blue-600">Relevância: Média-Alta</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal">Foco: Lógica sentencial, conjuntos e problemas aritméticos.</p>
                        </div>

                        {/* Didática e Legislação */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>Didática & Legislação (Básico)</span>
                            <span className="text-emerald-600">Relevância: Alta</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal">Foco: LDB, ECA, PNE, Plano Estadual e Estatuto Seduc-CE.</p>
                        </div>

                        {/* Conhecimentos Específicos */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>Conhecimentos Específicos (Área)</span>
                            <span className="text-amber-600">Relevância: Máxima</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-normal">Foco: Tópicos da sua disciplina ({profile.discipline}).</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-4 text-slate-400 space-y-2 border-t border-slate-100 pt-4">
                      <Calendar className="w-6 h-6 mx-auto text-slate-300 animate-pulse" />
                      <p className="text-xxs">Selecione qualquer dia da grade ou clique em um item da lista para customizar os seus horários e anotações.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-150 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                Os dados são salvos de forma segura localmente no seu dispositivo.
              </span>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-6 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-xxs"
              >
                Concluir Customização
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Detailed Study Guide Modal (Área de Estudo e Revisão) */}
      {isStudyGuideOpen && selectedGuideTopic && (() => {
        const guide = getStudyGuideForTopic(selectedGuideTopic, selectedGuideCategory || undefined);
        const matchedTopic = topics.find(t => t.name === selectedGuideTopic);
        const categoryColor = selectedGuideCategory === "legislacao" ? "bg-indigo-50 text-indigo-700 border-indigo-150" :
                              selectedGuideCategory === "didatica" ? "bg-emerald-50 text-emerald-700 border-emerald-150" :
                              selectedGuideCategory === "ceara" ? "bg-purple-50 text-purple-700 border-purple-150" :
                              selectedGuideCategory === "especifico" ? "bg-amber-50 text-amber-700 border-amber-150" :
                              "bg-indigo-50 text-indigo-700 border-indigo-150"; // default or commons

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-100 text-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 shrink-0">
                    <BookOpenCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        Área de Estudo e Revisão 💡
                      </span>
                      {selectedGuideCategory && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${categoryColor}`}>
                          {selectedGuideCategory === "legislacao" ? "Legislação" :
                           selectedGuideCategory === "didatica" ? "Didática" :
                           selectedGuideCategory === "ceara" ? "Especificidades CE" :
                           selectedGuideCategory === "especifico" ? `Específica: ${profile.discipline}` : "Geral"}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 mt-1 line-clamp-1">
                      {guide.topicName}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsStudyGuideOpen(false);
                    setSelectedGuideTopic(null);
                    setSelectedGuideCategory(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-150/40 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto font-sans">
                
                {/* 1. Exactly What to Study List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Target className="w-4 h-4 text-emerald-600" />
                    O que você deve estudar exatamente (Subtópicos de Edital):
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/30">
                    {guide.subtopics.map((sub, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-emerald-500 font-extrabold text-sm leading-none">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Theory Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Resumo Direto da Teoria & Conceitos-Chave:
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/10 p-4 rounded-2xl border border-amber-100/30 font-sans">
                    {guide.theorySummary}
                  </p>
                </div>

                {/* 3. Common Pitfalls / Pegadinhas */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Info className="w-4 h-4 text-rose-500" />
                    ⚠️ Pegadinhas de Bancas para Ficar Alerta:
                  </h4>
                  <p className="text-xs text-rose-950 leading-relaxed bg-rose-50/40 p-4 rounded-2xl border border-rose-100/30">
                    {guide.pitfalls}
                  </p>
                </div>

                {/* 4. Strategy & References Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Estratégia de Foco:
                    </h4>
                    <p className="text-xxs text-slate-500 leading-normal bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      {guide.strategy}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Bibliografia de Referência:
                    </h4>
                    <p className="text-xxs text-slate-500 leading-normal bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      {guide.references}
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Mark as Completed Toggle directly in guide! */}
                {matchedTopic ? (
                  <button
                    onClick={() => {
                      if (onUpdateTopicStats) {
                        onUpdateTopicStats(matchedTopic.id, 0, 0, true);
                      }
                    }}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                      matchedTopic.completed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    <CheckSquare className={`w-4 h-4 ${matchedTopic.completed ? "text-emerald-600 fill-emerald-150" : "text-slate-400"}`} />
                    <span>{matchedTopic.completed ? "Tópico Concluído! ✓" : "Marcar como Estudado"}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">Cronograma sugerido de estudos</span>
                )}

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      // Navigate to Mentor Chat and ask about this topic
                      setIsStudyGuideOpen(false);
                      onTopicClick(guide.topicName);
                      onChangeModule("chat");
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xxs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    Perguntar ao Mentor IA
                  </button>

                  <button
                    onClick={() => {
                      // Launch direct simulator question
                      setIsStudyGuideOpen(false);
                      onTopicClick(guide.topicName);
                      onChangeModule("simulator");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    Gerar Questões do Assunto
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* Daily Check-In & Topic Detail Modal */}
      {selectedCheckInDate && (() => {
        const { year, month, day, timeKey, weekdayName, scheduleItem } = selectedCheckInDate;
        const itemsList = scheduleItem.items || [];
        const isFullyDone = !!completedDates[timeKey];
        const formattedDate = `${weekdayName}, ${day} de ${new Date(year, month, day).toLocaleDateString("pt-BR", { month: "long" })} de ${year}`;
        
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-100 text-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${isFullyDone ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-sky-50 border-sky-100 text-sky-600"}`}>
                    {isFullyDone ? <CheckCircle className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      Check-in Diário de Estudos 🎯
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900 mt-1 line-clamp-1">
                      {formattedDate}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCheckInDate(null)}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-150/40 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto font-sans">
                
                {/* Main Day Program Info */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-150/50">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${scheduleItem.color || "bg-sky-600"}`}>
                      {scheduleItem.time || "19:00 - 21:00"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {timeKey}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {scheduleItem.title || "Estudo Diário"}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {scheduleItem.desc}
                  </p>
                  {scheduleItem.notes && (
                    <div className="text-xxs text-slate-500 bg-white p-3 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed">
                      {scheduleItem.notes}
                    </div>
                  )}
                </div>

                {/* Subtopics and Items Checklist */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <ListChecks className="w-4 h-4 text-emerald-600" />
                    Tópicos de Estudo para Concluir:
                  </h5>

                  {itemsList.length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      Sem tópicos formais de edital cadastrados para este dia.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {itemsList.map((it: any, idx: number) => {
                        const isItemDone = !!completedDateItems[timeKey]?.[it.label];
                        const categoryBadgeColor = it.category === "legislacao" ? "bg-indigo-50 text-indigo-700 border-indigo-150" :
                                                   it.category === "didatica" ? "bg-emerald-50 text-emerald-700 border-emerald-150" :
                                                   it.category === "ceara" ? "bg-purple-50 text-purple-700 border-purple-150" :
                                                   it.category === "especifico" ? "bg-amber-50 text-amber-700 border-amber-150" :
                                                   "bg-sky-50 text-sky-700 border-sky-150";

                        return (
                          <div key={idx} className={`p-4 rounded-2xl border transition-all ${isItemDone ? "bg-emerald-50/15 border-emerald-200" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                            <div className="flex items-start gap-3 justify-between">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => toggleDateItemCompletion(timeKey, it.label, itemsList)}
                                  className={`w-5 h-5 rounded-md border mt-0.5 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                                    isItemDone
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                                      : "bg-white border-slate-300 hover:border-emerald-500 text-transparent"
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                                
                                <div className="min-w-0 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-xs text-slate-800">
                                      {it.label}
                                    </span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${categoryBadgeColor}`}>
                                      {it.category === "legislacao" ? "Legislação" :
                                       it.category === "didatica" ? "Didática" :
                                       it.category === "ceara" ? "Especificidades CE" :
                                       it.category === "especifico" ? `Específica: ${profile.discipline}` : "Geral"}
                                    </span>
                                  </div>
                                  <div className="text-xxs text-slate-500 leading-normal pl-0.5">
                                    {it.subtopics && it.subtopics.map((sub: string, sidx: number) => (
                                      <div key={sidx} className="flex gap-1.5 items-start mt-1">
                                        <span className="text-emerald-500">•</span>
                                        <span>{sub}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Interactive Shortcut Tools for this specific topic */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  title="Ver Guia de Estudos Completo"
                                  onClick={() => {
                                    setSelectedGuideTopic(it.topicName);
                                    setSelectedGuideCategory(it.category);
                                    setIsStudyGuideOpen(true);
                                    setSelectedCheckInDate(null);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                                >
                                  <BookOpenCheck className="w-4 h-4" />
                                </button>
                                
                                <button
                                  title="Gerar Questões no Simulador"
                                  onClick={() => {
                                    onTopicClick(it.topicName);
                                    onChangeModule("simulator");
                                    setSelectedCheckInDate(null);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
                                >
                                  <Brain className="w-4 h-4" />
                                </button>

                                <button
                                  title="Perguntar ao Mentor IA"
                                  onClick={() => {
                                    onTopicClick(it.topicName);
                                    onChangeModule("chat");
                                    setSelectedCheckInDate(null);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Master Full Completion Switch */}
                <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 block">Concluir Todo o Dia?</span>
                    <span className="text-[10px] text-slate-500 leading-none">Marcar todos os tópicos planejados para hoje como estudados de uma só vez.</span>
                  </div>
                  
                  <button
                    onClick={() => toggleFullDateCompletion(timeKey, itemsList)}
                    className={`text-xs font-bold py-2 px-4 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                      isFullyDone
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm shadow-emerald-500/20"
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isFullyDone ? (
                      <>
                        <CheckSquare className="w-4 h-4 fill-white text-emerald-600" />
                        <span>Dia Concluído! ✓</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded border border-slate-300 shrink-0 bg-white" />
                        <span>Concluir Dia</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCheckInDate(null)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Fechar
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Print Instructions / Redirect Helper Modal */}
      {isPrintModalOpen && (() => {
        const inIframe = typeof window !== "undefined" && window.self !== window.top;
        
        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-100 text-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 shrink-0">
                    <Printer className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                      Imprimir Cronograma
                    </h3>
                    <p className="text-xxs text-slate-500 font-mono mt-0.5">SEDUC-CE 2026</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-150/40 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-600 font-sans">
                {inIframe ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 border border-amber-100 text-amber-900 rounded-2xl flex gap-3 items-start">
                      <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-xs font-bold text-amber-950">Visualização Protegida</strong>
                        Navegadores bloqueiam a impressão direta de aplicativos rodando dentro de painéis integrados (iframe) para proteger sua segurança.
                      </div>
                    </div>
                    
                    <p>
                      Para imprimir com perfeição ou salvar em PDF, clique no botão abaixo para abrir seu cronograma em uma <strong>nova aba cheia</strong>. O diálogo de impressão abrirá automaticamente!
                    </p>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] space-y-1">
                      <strong className="text-slate-800 block">Dica de Ouro no Painel de Impressão:</strong>
                      <p>
                        Para sair com as cores das matérias organizadas, ative a opção <strong>"Gráficos de segundo plano"</strong> (ou "Background graphics") nas configurações de impressão!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p>
                      Seu cronograma completo até o dia previsto da prova (<strong>{profile.examDate ? new Date(profile.examDate + "T12:00:00").toLocaleDateString('pt-BR') : "26/09/2026"}</strong>) foi formatado especialmente para folhas de papel <strong>A4</strong> ou para salvar diretamente como arquivo <strong>PDF</strong>.
                    </p>

                    <div className="p-4 bg-emerald-50/25 border border-emerald-100/50 rounded-2xl space-y-2.5">
                      <strong className="text-emerald-900 block font-semibold text-xs flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
                        Configurações de Impressão Recomendadas:
                      </strong>
                      <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside pl-1">
                        <li>
                          <strong>Gráficos de Segundo Plano:</strong> Ative esta opção (Background graphics) nas configurações avançadas para que as cores de cada matéria saiam destacadas!
                        </li>
                        <li>
                          <strong>Margens:</strong> Defina como "Padrão" ou "Nenhuma".
                        </li>
                        <li>
                          <strong>Escala:</strong> Escolha "Ajustar à área de impressão" ou 100% para um alinhamento perfeito.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                {inIframe ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrintModalOpen(false);
                      const printUrl = window.location.href + (window.location.href.includes("?") ? "&" : "?") + "print=true";
                      window.open(printUrl, "_blank");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir e Imprimir (PDF)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrintModalOpen(false);
                      window.print();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimir Agora (PDF)
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}
      </div>

      {/* Print-Only Layout */}
      <div className="hidden print:block bg-white text-slate-950 p-6 font-sans w-full max-w-4xl mx-auto">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body {
              background-color: #ffffff !important;
              color: #020617 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: A4 portrait;
              margin: 1.2cm;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            thead {
              display: table-header-group;
            }
          }
        `}} />

        {/* Official Header - Elegant, Minimalist, Professional */}
        <div className="border-b-2 border-slate-200 pb-5 mb-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Educational Emblem */}
              <div className="w-20 h-20 bg-emerald-50 border border-emerald-200/60 rounded-2xl flex items-center justify-center text-emerald-700 shrink-0 shadow-xxs overflow-hidden">
                {profile.squareLogo ? (
                  <img src={profile.squareLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-10 h-10" />
                )}
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900 font-sans">
                  Aprova Professor • SEDUC CE 2026
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  Diretoria de Planejamento de Metas • Cronograma de Estudos Individualizado
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Documento Técnico de Preparação de Alto Rendimento • Baseado na Recorrência FUNECE
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block text-[10px] font-bold font-sans bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-md uppercase tracking-wider">
                {profile.examDate 
                  ? `${new Date((profile.studyStartDate || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]) + "T12:00:00").toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')} - ${new Date(profile.examDate + "T12:00:00").toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}`.toUpperCase()
                  : "ESTUDO VIGENTE"
                }
              </span>
              <p className="text-[9px] text-slate-400 font-mono mt-1">Ref: FUNECE/SEDUC</p>
            </div>
          </div>
        </div>

        {/* Candidate & Plan Metadata Grid */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl mb-5 text-xs text-slate-800">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block font-sans">Estudante / Candidato(a)</span>
            <strong className="text-slate-800 block text-[13px] font-sans mt-0.5">{profile.name || "Candidato(a) de Elite"}</strong>
            <span className="text-[10px] text-slate-500 block">
              {profile.level === "advanced" ? "Nível Avançado" : profile.level === "intermediate" ? "Nível Intermediário" : "Nível Iniciante"}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block font-sans">Cargo & Disciplina Alvo</span>
            <strong className="text-slate-800 block text-[13px] font-sans mt-0.5">Professor Seduc-CE</strong>
            <span className="text-[10px] font-semibold text-slate-600 block">{profile.discipline}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block font-sans">Metas & Planejamento</span>
            <strong className="text-slate-800 block text-[13px] font-sans mt-0.5">{profile.studyHours || 3} Horas Diárias</strong>
            <span className="text-[10px] text-slate-500 block">Estudo Teórico + Questões Diárias</span>
          </div>
        </div>

        {/* Methodological & General Guidance Grid - Compact, 3-Column, Elegant & Minimalist */}
        <div className="grid grid-cols-3 gap-3 mb-5 text-[9px] text-slate-600 leading-relaxed page-break-inside-avoid">
          <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50/30">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 font-sans text-[9.5px] mb-1">
              💡 Metodologia Ativa
            </h4>
            <p className="text-slate-500">
              Estudo teórico rápido (20%) seguido de resolução intensiva (80%) de questões FUNECE. Use o simulador para autoavaliação contínua.
            </p>
          </div>
          <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50/30">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 font-sans text-[9.5px] mb-1">
              🔄 Revisão e Controle
            </h4>
            <p className="text-slate-500">
              Marque <strong>T</strong> (Teoria), <strong>Q</strong> (Questões) e <strong>R</strong> (Erros) ao lado de cada dia estudado. Revise anotações anteriores por 10min diários.
            </p>
          </div>
          <div className="p-2.5 border border-slate-200/80 rounded-xl bg-slate-50/30">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1 font-sans text-[9.5px] mb-1">
              📌 Orientação Geral
            </h4>
            <p className="text-slate-500">
              Siga a sequência proposta. Estude a teoria correspondente na bibliografia essencial e resolva ativamente blocos de exercícios da FUNECE.
            </p>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-hidden border border-slate-200 rounded-xl">
          <table className="w-full border-collapse text-[10px] text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-sans uppercase tracking-wider text-[9px] border-b border-slate-200">
                <th className="p-2.5 font-bold w-12 text-slate-700 text-center">Data</th>
                <th className="p-2.5 font-bold w-24 text-slate-700">Semana</th>
                <th className="p-2.5 font-bold w-40 text-slate-700">Área / Disciplina</th>
                <th className="p-2.5 font-bold text-slate-700">Conteúdo Programático Detalhado</th>
                <th className="p-2.5 font-bold w-20 text-slate-700 text-center">Horário</th>
                <th className="p-2.5 font-bold w-20 text-slate-700 text-center">Progresso</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const printDates: Date[] = [];
                if (profile.examDate) {
                  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
                  const start = new Date((profile.studyStartDate || todayStr) + "T12:00:00");
                  start.setHours(0, 0, 0, 0);
                  const end = new Date(profile.examDate + "T12:00:00");
                  end.setHours(0, 0, 0, 0);
                  
                  let current = new Date(start);
                  let maxIterations = 365;
                  while (current <= end && maxIterations > 0) {
                    printDates.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                    maxIterations--;
                  }
                } else {
                  const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
                  for (let i = 1; i <= daysInMonth; i++) {
                    printDates.push(new Date(currentCalendarYear, currentCalendarMonth, i));
                  }
                }

                return printDates.map((date, idx) => {
                  const dayNum = date.getDate();
                  const dateTopic = getTopicForDate(date.getFullYear(), date.getMonth(), dayNum);
                  
                  const weekdayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
                  const weekdayIndex = date.getDay();
                  const weekdayName = weekdayNames[weekdayIndex];
                  
                  const itemIndex = scheduleItems.findIndex(item => {
                    if (!item || !item.day) return false;
                    return item.day.toLowerCase().startsWith(weekdayName.toLowerCase().substring(0, 3));
                  });
                  
                  const scheduleItem = dateTopic ? {
                    day: dateTopic.title,
                    desc: dateTopic.desc,
                    color: dateTopic.color,
                    time: dateTopic.time,
                    notes: dateTopic.notes,
                    isExam: (dateTopic as any).isExam
                  } : (profile.examDate ? null : (itemIndex !== -1 ? scheduleItems[itemIndex] : null));

                  const isExam = scheduleItem && (scheduleItem as any).isExam;

                  let subjectVal = "Livre / Revisão";
                  let subtopicVal = "Folga programada, simulados ou revisão de pontos fracos";

                  if (isExam) {
                    subjectVal = "SEDUC CE";
                    subtopicVal = "GRANDE DIA DA SUA APROVAÇÃO! PROVA OFICIAL SEDUC-CE 2026";
                  } else if (scheduleItem) {
                    if (scheduleItem.desc && scheduleItem.desc.includes(" // ")) {
                      const parts = scheduleItem.desc.split(" // ");
                      subjectVal = parts[0].trim();
                      subtopicVal = parts[1].trim();
                    } else {
                      subjectVal = scheduleItem.day || "Geral";
                      subtopicVal = scheduleItem.desc || "";
                    }
                  }

                  const cleanInfo = {
                    subject: subjectVal,
                    subtopic: subtopicVal
                  };

                  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

                  return (
                    <tr key={idx} className={`border-b border-slate-150 ${isExam ? "bg-rose-50" : dayNum % 2 === 0 ? "bg-slate-50/20" : "bg-white"}`}>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-center font-bold text-slate-800 text-xs">
                        {formattedDate}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-600">
                        {weekdayName}
                      </td>
                      <td className="p-2.5 border-r border-slate-200">
                        {isExam ? (
                          <span className="inline-block px-2 py-1 text-[9px] rounded-md font-extrabold uppercase border border-rose-300 bg-rose-100 text-rose-950 tracking-wide">
                            🏁 CONCURSO
                          </span>
                        ) : scheduleItem ? (
                          <div className="flex flex-wrap gap-1">
                            {cleanInfo.subject.split(" + ").map((subj, subIdx) => {
                              // Determine color based on subject name
                              let tagClass = "border border-slate-200 bg-slate-50 text-slate-600";
                              const lowerSubj = subj.toLowerCase();
                              if (lowerSubj.includes("português") || lowerSubj.includes("portugues")) {
                                tagClass = "border border-sky-200 bg-sky-50 text-sky-800 font-bold";
                              } else if (lowerSubj.includes("didática") || lowerSubj.includes("didatica")) {
                                tagClass = "border border-emerald-250 bg-emerald-50 text-emerald-800 font-bold";
                              } else if (lowerSubj.includes("específico") || lowerSubj.includes("específica") || lowerSubj.includes("especifico") || lowerSubj.includes("especifica")) {
                                tagClass = "border border-amber-200 bg-amber-50 text-amber-800 font-bold";
                              } else if (lowerSubj.includes("legislação") || lowerSubj.includes("legislacao")) {
                                tagClass = "border border-indigo-200 bg-indigo-50 text-indigo-800 font-bold";
                              } else if (lowerSubj.includes("ceará") || lowerSubj.includes("ceara") || lowerSubj.includes("indicadores")) {
                                tagClass = "border border-purple-200 bg-purple-50 text-purple-800 font-bold";
                              }
                              return (
                                <span key={subIdx} className={`inline-block px-1.5 py-0.5 text-[8px] rounded-md uppercase tracking-tight ${tagClass}`}>
                                  {subj.trim()}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[8px] rounded-md uppercase tracking-tight font-medium border border-slate-200 bg-slate-100 text-slate-500">
                            Livre
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 leading-normal">
                        <div className="text-slate-900 text-xs font-semibold">
                          {isExam ? (
                            <span className="font-bold text-rose-700">GRANDE DIA DA SUA APROVAÇÃO! PROVA OFICIAL SEDUC-CE 2026</span>
                          ) : (
                            <div className="space-y-1">
                              {cleanInfo.subtopic.split(" + ").map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-1 text-[10.5px] font-medium text-slate-600">
                                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                                  <span>{sub}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-mono text-[9.5px] text-slate-600 font-medium">
                        {scheduleItem ? scheduleItem.time : "Meta Livre"}
                      </td>
                      <td className="p-2.5 text-center text-[10px] text-slate-400 font-mono font-bold">
                        <div className="flex justify-center gap-1">
                          <span className="border border-slate-200 w-5 h-5 flex items-center justify-center text-[8px] text-slate-500 rounded bg-white">T</span>
                          <span className="border border-slate-200 w-5 h-5 flex items-center justify-center text-[8px] text-slate-500 rounded bg-white">Q</span>
                          <span className="border border-slate-200 w-5 h-5 flex items-center justify-center text-[8px] text-slate-500 rounded bg-white">R</span>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>

        {/* Commitment Agreement Section */}
        <div className="mt-6 p-4 border border-slate-300 border-dashed rounded-2xl bg-white page-break-inside-avoid">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 font-mono mb-2">
            🤝 COMPROMISSO DE HONRA COM A MINHA CARREIRA
          </h4>
          <p className="text-[10px] text-slate-600 leading-relaxed italic">
            "Eu assumo o compromisso de seguir este planejamento com determinação, ética e foco. Cada dia concluído me aproxima de vestir o crachá de servidor público do Estado do Ceará e fazer a diferença na educação pública de nossos jovens."
          </p>
          <div className="mt-5 flex justify-between items-end text-xs pt-2">
            <div>
              <p className="text-[9px] text-slate-400 font-mono">Assinado em {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="text-right w-80">
              <div className="border-b border-slate-300 w-full mb-1 h-8"></div>
              <p className="text-[9px] uppercase tracking-wide font-bold text-slate-500 font-mono">
                Assinatura do(a) Futuro(a) Professor(a) Seduc-CE
              </p>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="mt-8 text-center text-[9px] text-slate-400 border-t border-slate-200 pt-4 font-mono font-bold flex justify-between items-center">
          <span>SISTEMA DE PREPARAÇÃO INTELIGENTE • APROVA PROFESSOR SEDUC CE 2026</span>
          <span>ESTADO DO CEARÁ • SEDUC-CE 2026</span>
          <span>PÁGINA 1 DE 1</span>
        </div>
      </div>
    </>
  );
}
