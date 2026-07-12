import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  GraduationCap, 
  ChevronDown, 
  ChevronRight, 
  Award, 
  Shield, 
  AlertCircle, 
  Shuffle, 
  Timer, 
  Coins, 
  Percent, 
  Users, 
  MapPin, 
  Layers, 
  FileCheck, 
  ClipboardList,
  Sparkles,
  RefreshCw,
  Check,
  MessageSquare,
  Play,
  Target,
  Filter,
  ArrowUpRight,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TOPIC_STUDY_GUIDES } from "../data/topicStudyGuides";
import { sectors, Sector, SectorPoint } from "../data/sectorsData";

const generalCategories = [
  {
    id: "pedagogicos",
    name: "Didática & Temas Pedagógicos",
    desc: "Teorias, didática, psicologia da aprendizagem e planejamento",
    topics: [
      "História do pensamento pedagógico brasileiro, teoria da educação e correntes pedagógicas",
      "Projeto político pedagógico (PPP)",
      "A didática, organização do processo didático, planejamento, estratégias, metodologias e avaliação",
      "A sala de aula como espaço de aprendizagem, interação e fundamento epistemológico do fazer docente",
      "Principais teorias da aprendizagem (Inatismo, comportamentalismo, behaviorismo, interacionismo, cognitivismo)",
      "Contribuições de Piaget, Vygotsky e Wallon para a psicologia e pedagogia",
      "Teoria das inteligências múltiplas de Gardner",
      "Psicologia do desenvolvimento: aspectos históricos e biopsicossociais",
      "Temas contemporâneos (bullying, papel da escola, escolha profissional, transtornos alimentares, família, escolhas sexuais)",
      "Teorias do currículo, acesso, permanência e sucesso do aluno na escola",
      "Gestão da aprendizagem, planejamento educacional e avaliação institucional, de desempenho e de aprendizagem",
      "O Professor: formação, profissão, pesquisa na prática docente e dimensão ética da profissão"
    ]
  },
  {
    id: "legislacao_nacional",
    name: "Legislação Educacional Nacional",
    desc: "LDB, ECA, Constituição Federal e Reformas",
    topics: [
      "LDB - Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996 e alterações)",
      "ECA - Estatuto da Criança e do Adolescente (Lei nº 8.069/1990 e alterações)",
      "Constituição da República Federativa do Brasil (Artigos 205 a 214 - Da Educação)",
      "Normas da Educação Básica (Emenda nº 53/2006, Lei nº 11.494/2007 e alterações, Lei nº 11.114/2005 e Lei nº 11.274/2006)",
      "Reforma do Ensino Médio (Lei Federal nº 13.415/2017)",
      "Plano Nacional de Educação (Lei nº 13.005/2014) e Plano Estadual de Educação do Ceará (Lei nº 16.025/2016)",
      "Aspectos legais e políticos da organização da educação brasileira e políticas para a educação básica"
    ]
  },
  {
    id: "legislacao_ceara",
    name: "Administração Pública & Ceará",
    desc: "Estatuto do Ceará, Magistério, carreiras e remuneração",
    topics: [
      "Conceito de administração pública, servidor público e princípios da administração pública",
      "Direitos, deveres e responsabilidade dos servidores públicos",
      "Estatuto dos Funcionários Públicos Civis do Estado do Ceará (Lei nº 9.826/1974 - Provimento, Direitos, Vantagens e Regime Disciplinar)",
      "Estágio Probatório do Servidor Estadual (Leis nº 9.826/1974, nº 13.092/2001, nº 15.744/2014 e nº 15.909/2015)",
      "Carreira do Magistério (Concurso, provimento, carga horária e jornada - Leis nº 10.884/1984, nº 12.066/1993, nº 14.404/2009)",
      "Ampliação da carga horária de trabalho do Grupo MAG (Lei nº 15.451/2013 e Decreto nº 31.458/2014)",
      "Promoção dos profissionais do Grupo MAG (Lei nº 15.901/2015 e Decreto nº 32.103/2016)",
      "Sistema Remuneratório dos profissionais MAG (Leis nº 15.243/2012, nº 15.901/2015, nº 16.104/2016, nº 16.513/2018 e nº 16.536/2018)"
    ]
  },
  {
    id: "portugues",
    name: "Língua Portuguesa",
    desc: "Compreensão, tipologias, ortografia e gramática",
    topics: [
      "Compreensão e interpretação de textos e Tipologia textual",
      "Ortografia oficial e Acentuação gráfica",
      "Sintaxe da oração e do período"
    ]
  },
  {
    id: "indicadores",
    name: "Dados e Indicadores Educacionais",
    desc: "SPAECE, IDEB, Censo Escolar e taxas",
    topics: [
      "Aceleração e desaceleração do desenvolvimento de indicadores educacionais nacionais e estaduais (Censo, SAEB, SPAECE, taxas de transição, IDEB)"
    ]
  }
];

interface SyllabusModuleProps {
  profile: UserProfile;
  onChangeModule?: (module: string) => void;
  onTopicClick?: (topic: string) => void;
}

export default function SyllabusModule({ profile, onChangeModule, onTopicClick }: SyllabusModuleProps) {
  // Tabs: 'syllabus' (Guia do Conteúdo), 'simulator' (Sorteador de Pontos), 'calculator' (Calculadora de Notas), 'salaries' (Remuneração & Vagas)
  const [activeTab, setActiveTab] = useState<string>("syllabus");
  const [selectedSectorId, setSelectedSectorId] = useState<string>("matematica");
  const [syllabusView, setSyllabusView] = useState<"geral" | "especifico">("geral");
  const [selectedGenCatId, setSelectedGenCatId] = useState<string>("pedagogicos");
  const [selectedGenTopicKey, setSelectedGenTopicKey] = useState<string>("História do pensamento pedagógico brasileiro, teoria da educação e correntes pedagógicas");

  const visibleSectors = React.useMemo(() => {
    if (!profile.discipline) return sectors;
    const disciplineLower = profile.discipline.toLowerCase().trim();
    
    return sectors.filter(sec => {
      if (disciplineLower === "biologia") {
        return sec.id === "biologia";
      }
      if (disciplineLower === "história" || disciplineLower === "historia") {
        return sec.id === "historia";
      }
      if (disciplineLower === "língua portuguesa" || disciplineLower === "lingua portuguesa" || disciplineLower === "português" || disciplineLower === "portugues") {
        return sec.id === "portugues";
      }
      if (disciplineLower === "matemática" || disciplineLower === "matematica") {
        return sec.id === "matematica";
      }
      if (disciplineLower === "sociologia") {
        return sec.id === "sociologia";
      }
      if (disciplineLower === "geografia") {
        return sec.id === "geografia";
      }
      if (disciplineLower === "arte-educação" || disciplineLower === "arte educaçao" || disciplineLower === "arte-educacao" || disciplineLower === "arte" || disciplineLower === "artes") {
        return sec.id === "arte-educacao";
      }
      if (disciplineLower === "educação física" || disciplineLower === "educacao fisica") {
        return sec.id === "educacao-fisica";
      }
      if (disciplineLower === "filosofia") {
        return sec.id === "filosofia";
      }
      if (disciplineLower === "física" || disciplineLower === "fisica") {
        return sec.id === "fisica";
      }
      if (disciplineLower === "química" || disciplineLower === "quimica") {
        return sec.id === "quimica";
      }
      if (disciplineLower === "língua espanhola" || disciplineLower === "lingua espanhola" || disciplineLower === "espanhol") {
        return sec.id === "espanhol";
      }
      if (disciplineLower === "língua inglesa" || disciplineLower === "lingua inglesa" || disciplineLower === "inglês" || disciplineLower === "ingles") {
        return sec.id === "ingles";
      }
      if (disciplineLower === "libras") {
        return sec.id === "libras";
      }
      return true;
    });
  }, [profile.discipline]);

  // Local storage state for general subtopics status
  const [genSubtopicStatus, setGenSubtopicStatus] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("aprova_prof_general_subtopics_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    localStorage.setItem("aprova_prof_general_subtopics_status", JSON.stringify(genSubtopicStatus));
  }, [genSubtopicStatus]);

  const toggleGenSubtopic = (topicKey: string, subtopic: string) => {
    const compositeId = `${topicKey}_${subtopic}`;
    setGenSubtopicStatus(prev => ({
      ...prev,
      [compositeId]: !prev[compositeId]
    }));
  };

  // Advanced Interactive Mapping States
  const [expandedPt, setExpandedPt] = useState<number | null>(null);
  const [filterRelevance, setFilterRelevance] = useState<"all" | "high" | "not_started">("all");
  const [ptStatus, setPtStatus] = useState<Record<string, { theory: boolean; practice: boolean; summary: boolean; review: boolean }>>(() => {
    try {
      const saved = localStorage.getItem("aprova_prof_pt_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    localStorage.setItem("aprova_prof_pt_status", JSON.stringify(ptStatus));
  }, [ptStatus]);

  const togglePtStatus = (sectorId: string, pointNum: number, key: 'theory' | 'practice' | 'summary' | 'review') => {
    const compositeId = `${sectorId}_${pointNum}`;
    setPtStatus(prev => {
      const current = prev[compositeId] || { theory: false, practice: false, summary: false, review: false };
      return {
        ...prev,
        [compositeId]: {
          ...current,
          [key]: !current[key]
        }
      };
    });
  };

  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [isPrintingMode, setIsPrintingMode] = useState<boolean>(false);

  React.useEffect(() => {
    if (isPrintingMode) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPrintingMode]);

  React.useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrintingMode(false);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const getSectorStats = (sector: Sector) => {
    const sectorPointNums = sector.points.map(p => p.num);
    let completedGoals = 0;
    sectorPointNums.forEach(num => {
      const status = ptStatus[`${sector.id}_${num}`] || { theory: false, practice: false, summary: false, review: false };
      if (status.theory) completedGoals++;
      if (status.practice) completedGoals++;
      if (status.summary) completedGoals++;
      if (status.review) completedGoals++;
    });
    const totalGoals = sector.points.length * 4;
    const progressPct = Math.round((completedGoals / totalGoals) * 100) || 0;
    return { completedGoals, totalGoals, progressPct };
  };

  const getAllSectorsStats = () => {
    let totalCompleted = 0;
    let totalGoalsAll = 0;
    const details = visibleSectors.map(sec => {
      const stats = getSectorStats(sec);
      totalCompleted += stats.completedGoals;
      totalGoalsAll += stats.totalGoals;
      return {
        id: sec.id,
        name: sec.name,
        code: sec.code,
        completed: stats.completedGoals,
        total: stats.totalGoals,
        pct: stats.progressPct
      };
    });
    const overallPct = Math.round((totalCompleted / totalGoalsAll) * 100) || 0;
    return { totalCompleted, totalGoalsAll, overallPct, details };
  };

  React.useEffect(() => {
    const disciplineLower = (profile.discipline || "").toLowerCase().trim();
    if (disciplineLower === "biologia") {
      setSelectedSectorId("biologia");
    } else if (disciplineLower === "história" || disciplineLower === "historia") {
      setSelectedSectorId("historia");
    } else if (disciplineLower === "língua portuguesa" || disciplineLower === "lingua portuguesa" || disciplineLower === "português" || disciplineLower === "portugues") {
      setSelectedSectorId("portugues");
    } else if (disciplineLower === "matemática" || disciplineLower === "matematica") {
      setSelectedSectorId("matematica");
    } else if (disciplineLower === "sociologia") {
      setSelectedSectorId("sociologia");
    } else if (disciplineLower === "geografia") {
      setSelectedSectorId("geografia");
    } else if (disciplineLower === "arte-educação" || disciplineLower === "arte-educao" || disciplineLower === "arte" || disciplineLower === "artes") {
      setSelectedSectorId("arte-educacao");
    } else if (disciplineLower === "educação física" || disciplineLower === "educacao fisica") {
      setSelectedSectorId("educacao-fisica");
    } else if (disciplineLower === "filosofia") {
      setSelectedSectorId("filosofia");
    } else if (disciplineLower === "física" || disciplineLower === "fisica") {
      setSelectedSectorId("fisica");
    } else if (disciplineLower === "química" || disciplineLower === "quimica") {
      setSelectedSectorId("quimica");
    } else if (disciplineLower === "língua espanhola" || disciplineLower === "lingua espanhola" || disciplineLower === "espanhol") {
      setSelectedSectorId("espanhol");
    } else if (disciplineLower === "língua inglesa" || disciplineLower === "lingua inglesa" || disciplineLower === "ingles") {
      setSelectedSectorId("ingles");
    } else if (disciplineLower === "libras") {
      setSelectedSectorId("libras");
    } else {
      setSelectedSectorId("matematica");
    }
  }, [profile.discipline]);

  // State for Point Sorter
  const [writtenPoint, setWrittenPoint] = useState<SectorPoint | null>(null);
  const [didacticPoint, setDidacticPoint] = useState<SectorPoint | null>(null);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [showSorterInstructions, setShowSorterInstructions] = useState<boolean>(true);

  // State for Grade Calculator
  const [writtenGrade1, setWrittenGrade1] = useState<number>(7.5);
  const [writtenGrade2, setWrittenGrade2] = useState<number>(8.0);
  const [writtenGrade3, setWrittenGrade3] = useState<number>(7.8);
  const [didacticGrade1, setDidacticGrade1] = useState<number>(8.2);
  const [didacticGrade2, setDidacticGrade2] = useState<number>(8.5);
  const [didacticGrade3, setDidacticGrade3] = useState<number>(7.9);
  const [didacticTimePenalty, setDidacticTimePenalty] = useState<number>(0); // penalty in points
  const [lessonDurationMinutes, setLessonLessonDurationMinutes] = useState<number>(52); // default 52 mins

  const currentSector = visibleSectors.find(s => s.id === selectedSectorId) || visibleSectors[0] || sectors[0];

  // Point Drawing Logic
  const handleDrawPoints = () => {
    if (isSorting) return;
    setIsSorting(true);
    setWrittenPoint(null);
    setDidacticPoint(null);

    const totalPoints = currentSector.points.length;
    if (totalPoints === 0) {
      setIsSorting(false);
      return;
    }

    // Simulate sorting delay with intervals for dramatic effect
    let counter = 0;
    const interval = setInterval(() => {
      const tempWritten = currentSector.points[Math.floor(Math.random() * totalPoints)];
      setWrittenPoint(tempWritten);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        
        // Final draw
        const finalWrittenIndex = Math.floor(Math.random() * totalPoints);
        const finalWritten = currentSector.points[finalWrittenIndex];
        setWrittenPoint(finalWritten);

        // Draw didactic point from remaining points
        const remainingPoints = currentSector.points.filter((_, i) => i !== finalWrittenIndex);
        if (remainingPoints.length > 0) {
          const finalDidactic = remainingPoints[Math.floor(Math.random() * remainingPoints.length)];
          setDidacticPoint(finalDidactic);
        } else {
          setDidacticPoint(null);
        }

        setIsSorting(false);
        setShowSorterInstructions(false);
      }
    }, 150);
  };

  // Score Calculation logic
  const writtenAverage = Number(((writtenGrade1 + writtenGrade2 + writtenGrade3) / 3).toFixed(2));
  const didacticRawAverage = Number(((didacticGrade1 + didacticGrade2 + didacticGrade3) / 3).toFixed(2));
  
  // Lesson duration penalty calculation (FUNECE: 0.2 points penalty per minute short of 50 minutes, down to 40 minutes)
  let actualDidacticPenalty = 0;
  if (lessonDurationMinutes < 50 && lessonDurationMinutes >= 40) {
    const minutesShort = 50 - lessonDurationMinutes;
    actualDidacticPenalty = Number((minutesShort * 0.2).toFixed(1));
  }
  const didacticFinalAverage = Math.max(0, Number((didacticRawAverage - actualDidacticPenalty).toFixed(2)));

  // Final score weighted: Written (Weight 2), Didactic (Weight 1)
  const finalScore = Number(((writtenAverage * 2 + didacticFinalAverage) / 3).toFixed(2));

  // Determine FUNECE status based on Edital rules:
  // 1. Instant elimination if:
  //    - NPED < 7.0 (Written test average)
  //    - NPD < 7.0 (Didactic test average)
  //    - Any single written examiner score < 6.0
  //    - Any single didactic examiner score < 6.0
  //    - Didactic time < 40 minutes (instant elimination)
  let status = "Aprovado";
  let statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let statusReason = "";

  if (lessonDurationMinutes < 40) {
    status = "Eliminado";
    statusColor = "text-red-700 bg-red-50 border-red-200";
    statusReason = "Eliminado por tempo didático inferior a 40 minutos (Item 13.1.2 do Edital).";
  } else if (writtenGrade1 < 6.0 || writtenGrade2 < 6.0 || writtenGrade3 < 6.0) {
    status = "Eliminado";
    statusColor = "text-red-700 bg-red-50 border-red-200";
    statusReason = "Eliminado: nota individual de examinador na Prova Escrita inferior a 6.0 (Item 12.11).";
  } else if (didacticGrade1 < 6.0 || didacticGrade2 < 6.0 || didacticGrade3 < 6.0) {
    status = "Eliminado";
    statusColor = "text-red-700 bg-red-50 border-red-200";
    statusReason = "Eliminado: nota individual de examinador na Prova Didática inferior a 6.0 (Item 13.13).";
  } else if (writtenAverage < 7.0) {
    status = "Eliminado";
    statusColor = "text-red-700 bg-red-50 border-red-200";
    statusReason = "Eliminado: média da Prova Escrita Dissertativa inferior a 7.0 (Item 12.11).";
  } else if (didacticFinalAverage < 7.0) {
    status = "Eliminado";
    statusColor = "text-red-700 bg-red-50 border-red-200";
    statusReason = "Eliminado: média da Prova Didática inferior a 7.0 (Item 13.13).";
  } else if (finalScore >= 7.0 && finalScore < 8.2) {
    status = "Cadastro Reserva";
    statusColor = "text-amber-700 bg-amber-50 border-amber-200";
    statusReason = "Aprovado! Classificado no Banco de Cadastro Reserva (Item 15.2 / 15.3 do Edital).";
  } else {
    status = "Aprovado (Vagas)";
    statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    statusReason = "Excelente! Média geral de destaque para ocupação das vagas imediatas do setor.";
  }

  if (isPrintingMode) {
    const stats = getAllSectorsStats();
    return (
      <div className="bg-white min-h-screen text-slate-900 p-8 sm:p-12 font-sans relative">
        {/* Print controls overlay */}
        <div className="no-print bg-slate-900 text-white px-4 py-3 rounded-2xl flex items-center justify-between mb-8 shadow-lg border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <p className="text-xs font-bold">Modo de Impressão Ativo</p>
          </div>
          <p className="text-[10px] text-slate-400 font-medium hidden md:block">
            Para salvar como PDF, escolha "Salvar como PDF" como destino na janela de impressão do seu navegador.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPrintingMode(false)}
              className="bg-slate-800 hover:bg-slate-750 text-white font-bold py-1.5 px-3 rounded-lg text-xxs transition-all cursor-pointer border border-slate-700"
            >
              Voltar ao Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg text-xxs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-emerald-500/30"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-100" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Printable Report Header */}
        <div className="border-b-4 border-slate-900 pb-6 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-600 tracking-wider uppercase">
                Aprova Professor • Portal Acadêmico
              </span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-display">
                RELATÓRIO DE PROGRESSO DO EDITAL
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Preparatório para Concurso de Professor Temporário/Substituto — Edital FUNECE Nº 02/2024
              </p>
            </div>
            <div className="text-right">
              <span className="bg-slate-100 text-slate-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border border-slate-200">
                UECE / FUNECE
              </span>
              <p className="text-[9px] font-mono text-slate-500 font-semibold mt-1.5">
                Emitido em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Stats Table / Info */}
        <div className="grid grid-cols-4 gap-4 my-6">
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Média de Conclusão</p>
            <p className="text-2xl font-black text-emerald-600 font-mono mt-1">{stats.overallPct}%</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tarefas Concluídas</p>
            <p className="text-lg font-black text-slate-800 font-mono mt-1.5">
              {stats.totalCompleted} <span className="text-xs text-slate-450 font-normal font-mono">/ {stats.totalGoalsAll}</span>
            </p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Setor Ativo Selecionado</p>
            <p className="text-xs font-bold text-slate-850 mt-2 truncate">{currentSector.name}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status Geral</p>
            <span className="inline-block bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 font-mono">
              {stats.overallPct === 100 
                ? "COMPLETO" 
                : stats.overallPct >= 70 
                  ? "RETA FINAL" 
                  : stats.overallPct >= 30 
                    ? "EM EVOLUÇÃO" 
                    : "INICIAL"}
            </span>
          </div>
        </div>

        {/* Sector Progress Bars */}
        <div className="space-y-3.5 border-t border-b border-slate-150 py-6 my-6">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-display">Resumo por Setor de Estudo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleSectors.map((sec) => {
              const secStats = getSectorStats(sec);
              const isCur = sec.id === currentSector.id;
              return (
                <div key={sec.id} className={`border border-slate-200 rounded-xl p-3 bg-white ${isCur ? 'ring-2 ring-emerald-500/10' : ''}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xxs font-bold text-slate-800 truncate">
                      Setor {sec.code}: {sec.name} {isCur ? " (Ativo)" : ""}
                    </span>
                    <span className="text-xxs font-bold font-mono text-slate-750">{secStats.progressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isCur ? "bg-emerald-500" : "bg-slate-400"}`} 
                      style={{ width: `${secStats.progressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] text-slate-400 font-medium">
                    <span>{sec.unit}</span>
                    <span>{secStats.completedGoals} de {secStats.totalGoals} metas</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Sector Detailed Point Report */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-display">
            Detalhamento de Tópicos do Setor Ativo: {currentSector.name} (Anexo II do Edital)
          </h3>
          
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150">
            {currentSector.points.map((pt) => {
              const compositeId = `${currentSector.id}_${pt.num}`;
              const status = ptStatus[compositeId] || { theory: false, practice: false, summary: false, review: false };
              const completedCount = [status.theory, status.practice, status.summary, status.review].filter(Boolean).length;
              const pctComplete = completedCount * 25;
              
              return (
                <div key={pt.num} className="p-4 bg-white space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-slate-900 text-white text-[9px] font-mono font-bold w-5 h-5 rounded flex items-center justify-center shrink-0">
                          {pt.num}
                        </span>
                        <h4 className="text-xxs font-black text-slate-850">
                          {pt.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed pl-6">
                        {pt.desc}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xxs font-mono font-black text-slate-700">{pctComplete}% Concluído</span>
                    </div>
                  </div>

                  {/* Checked boxes */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 pl-6 text-[9px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="font-mono text-slate-900">{status.theory ? "[✓]" : "[ ]"}</span> Teoria &amp; Lei Seca
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-mono text-slate-900">{status.practice ? "[✓]" : "[ ]"}</span> Prática Dirigida (Simulado)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-mono text-slate-900">{status.summary ? "[✓]" : "[ ]"}</span> Memorização (Fichas)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-mono text-slate-900">{status.review ? "[✓]" : "[ ]"}</span> Revisão Periódica
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer sign-off */}
        <div className="border-t border-slate-200 pt-6 mt-12 text-center text-[10px] text-slate-400 space-y-1">
          <p className="font-bold">Aprova Professor • Seu Cronograma Inteligente para o Concurso FUNECE/UECE</p>
          <p>Relatório gerado exclusivamente para o candidato. Use para acompanhamento e otimização dos estudos diários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-150/80 shadow-xxs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-100">
                FUNECE • Edital 02/2024
              </span>
            </div>
            <h1 className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              Guia do Edital UECE
            </h1>
            <p className="text-slate-500 text-xxs sm:text-xs mt-1 max-w-2xl leading-relaxed">
              Estudo direcionado e simulador oficial baseado no conteúdo programático para o cargo de Professor Temporário/Substituto da UECE.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab("syllabus")}
          className={`pb-3 px-3 text-xxs sm:text-xs font-bold transition-all shrink-0 cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "syllabus"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Setores e Pontos (Anexo II)
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`pb-3 px-3 text-xxs sm:text-xs font-bold transition-all shrink-0 cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "simulator"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          Simulador de Sorteio
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`pb-3 px-3 text-xxs sm:text-xs font-bold transition-all shrink-0 cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "calculator"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          Calculadora de Aprovação
        </button>
        <button
          onClick={() => setActiveTab("salaries")}
          className={`pb-3 px-3 text-xxs sm:text-xs font-bold transition-all shrink-0 cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === "salaries"
              ? "border-emerald-600 text-emerald-700 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          Remuneração &amp; CLT
        </button>
      </div>

      {/* Main Module Layout */}
      <div>
        <AnimatePresence mode="wait">
          {/* TAB 1: SYLLABUS DISCIPLINE SECTOR EXPLORER */}
          {activeTab === "syllabus" && (
            <motion.div
              key="syllabus-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Secondary Navigation to toggle between Conteúdo Geral and Conteúdo Específico */}
              <div className="flex bg-slate-150 p-1 rounded-xl w-fit border border-slate-200">
                <button
                  onClick={() => setSyllabusView("geral")}
                  className={`px-4 py-2 rounded-lg text-xxs sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    syllabusView === "geral"
                      ? "bg-white text-emerald-950 shadow-xs font-black"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  Conteúdo Geral (Comum)
                </button>
                <button
                  onClick={() => setSyllabusView("especifico")}
                  className={`px-4 py-2 rounded-lg text-xxs sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    syllabusView === "especifico"
                      ? "bg-white text-emerald-950 shadow-xs font-black"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  Conteúdo Específico (Setores)
                </button>
              </div>

              {syllabusView === "especifico" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Selector Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-2">
                  <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-wider px-2 mb-1.5">Setores de Estudo (Edital)</h3>
                  <div className="space-y-1">
                    {visibleSectors.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => setSelectedSectorId(sec.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          selectedSectorId === sec.id
                            ? "bg-emerald-50 border-emerald-250 text-emerald-950 font-bold shadow-xs"
                            : "bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="text-xxs font-bold font-sans leading-tight">
                            Setor {sec.code}: {sec.name}
                          </p>
                          <p className={`text-[9px] truncate max-w-[190px] ${selectedSectorId === sec.id ? "text-emerald-700/70" : "text-slate-400"}`}>
                            {sec.unit}
                          </p>
                        </div>
                        <ChevronRight className={`w-3 h-3 shrink-0 ${selectedSectorId === sec.id ? "text-emerald-700" : "text-slate-350"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edital Warnings */}
                <div className="bg-amber-50/45 border border-amber-150/40 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">Regra de Eliminação</p>
                  </div>
                  <p className="text-amber-700 text-xxs leading-relaxed">
                    Aprovados exigem nota final na Prova Escrita &ge; 7,0 e nota por examinador &ge; 6,0 para avançar à Prova Didática.
                  </p>
                </div>
              </div>

              {/* Right content view (topics of selected sector) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-slate-100 text-slate-700 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200/60">
                        Código {currentSector.code}
                      </span>
                      <span className="bg-emerald-50/80 text-emerald-850 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-100/50">
                        Regime: {currentSector.regime}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-sm sm:text-base text-slate-900">
                      {currentSector.name}
                    </h2>
                    <p className="text-slate-400 text-xxs">
                      {currentSector.unit}
                    </p>
                  </div>
                  <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-2.5 sm:text-right shrink-0">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Requisito do Cargo</p>
                    <p className="text-xxs font-medium text-slate-600 mt-0.5 max-w-[180px] leading-snug">
                      {currentSector.requirements}
                    </p>
                  </div>
                </div>

                {/* Sector Study Progress Card */}
                {(() => {
                  const sectorPointNums = currentSector.points.map(p => p.num);
                  let completedGoals = 0;
                  sectorPointNums.forEach(num => {
                    const status = ptStatus[`${currentSector.id}_${num}`] || { theory: false, practice: false, summary: false, review: false };
                    if (status.theory) completedGoals++;
                    if (status.practice) completedGoals++;
                    if (status.summary) completedGoals++;
                    if (status.review) completedGoals++;
                  });
                  const totalGoals = currentSector.points.length * 4;
                  const sectorProgressPct = Math.round((completedGoals / totalGoals) * 100) || 0;

                  return (
                    <div className="bg-gradient-to-br from-emerald-50/40 to-teal-50/20 p-5 rounded-2xl border border-emerald-100/70 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xxs">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-widest">Cronograma de Progresso Ativo</span>
                        <h3 className="font-display font-bold text-xs text-slate-800 leading-none">
                          Rendimento em {currentSector.name}
                        </h3>
                        <p className="text-slate-500 text-xxs leading-relaxed max-w-md font-sans">
                          Mapeamento das suas metas de estudo para o edital. Complete a teoria, resolva questões do simulador e revise para atingir 100% do conteúdo.
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-100/50 shadow-xxs">
                          <div className="relative w-12 h-12 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="20" className="stroke-slate-100" strokeWidth="3" fill="transparent" />
                              <circle cx="24" cy="24" r="20" className="stroke-emerald-600" strokeWidth="3" fill="transparent" 
                                strokeDasharray={2 * Math.PI * 20}
                                strokeDashoffset={2 * Math.PI * 20 * (1 - sectorProgressPct / 100)}
                              />
                            </svg>
                            <span className="absolute text-[9px] font-black text-emerald-700">{sectorProgressPct}%</span>
                          </div>
                          
                          <div className="space-y-0.5">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Metas</p>
                            <p className="text-xxs font-mono font-extrabold text-slate-700">
                              {completedGoals} <span className="text-slate-400 font-normal">/ {totalGoals} tarefas</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowProgressModal(true)}
                          className="bg-emerald-650 hover:bg-emerald-750 text-white font-bold p-2.5 rounded-xl text-xxs flex flex-row items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-emerald-700/10 font-sans group active:scale-95 shrink-0"
                          title="Gerar Relatório de Progresso e PDF"
                        >
                          <FileCheck className="w-4 h-4 text-emerald-100 group-hover:scale-105 transition-transform" />
                          <span className="text-[9px] font-bold">Relatório PDF</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60 border border-slate-100 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] font-bold text-slate-655 uppercase tracking-wider">Filtro do Conteúdo</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: "all", label: "Todos os 10 Pontos" },
                        { id: "high", label: "Foco (Relevância Alta)" },
                        { id: "not_started", label: "Não Iniciados" }
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => setFilterRelevance(btn.id as any)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            filterRelevance === btn.id
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200/60"
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(() => {
                      const filteredPoints = currentSector.points.filter(pt => {
                        const compositeId = `${currentSector.id}_${pt.num}`;
                        const status = ptStatus[compositeId] || { theory: false, practice: false, summary: false, review: false };
                        const isStarted = status.theory || status.practice || status.summary || status.review;
                        
                        if (filterRelevance === "not_started") {
                          return !isStarted;
                        }
                        if (filterRelevance === "high") {
                          const analysis = getPointAnalysis(currentSector.id, pt.num, pt.title);
                          return analysis.relevance >= 70;
                        }
                        return true;
                      });

                      if (filteredPoints.length === 0) {
                        return (
                          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-xs">Nenhum ponto do edital atende ao filtro selecionado.</p>
                          </div>
                        );
                      }

                      return filteredPoints.map((pt) => {
                        const isExpanded = expandedPt === pt.num;
                        const compositeId = `${currentSector.id}_${pt.num}`;
                        const status = ptStatus[compositeId] || { theory: false, practice: false, summary: false, review: false };
                        const analysis = getPointAnalysis(currentSector.id, pt.num, pt.title);
                        
                        // Calculate point completion
                        const completedCount = [status.theory, status.practice, status.summary, status.review].filter(Boolean).length;
                        const pctComplete = completedCount * 25;
                        
                        return (
                          <div
                            key={pt.num}
                            className={`border rounded-2xl transition-all overflow-hidden bg-white ${
                              isExpanded 
                                ? "border-emerald-200 ring-4 ring-emerald-500/5 shadow-md" 
                                : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/10"
                            }`}
                          >
                            {/* Header Accordion Trigger */}
                            <div
                              onClick={() => setExpandedPt(isExpanded ? null : pt.num)}
                              className="p-4 flex items-start gap-3.5 cursor-pointer select-none"
                            >
                              {/* Point Number badge with status outline */}
                              <div className={`w-8 h-8 rounded-xl font-mono font-extrabold text-xs flex items-center justify-center shrink-0 transition-all ${
                                pctComplete === 100
                                  ? "bg-emerald-600 text-white"
                                  : pctComplete > 0
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-100 text-slate-700"
                              }`}>
                                {pt.num}
                              </div>
                              
                              <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                                    {pt.title}
                                  </h4>
                                  {analysis.relevance >= 80 && (
                                    <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-rose-100 flex items-center gap-0.5 animate-pulse">
                                      <Target className="w-2.5 h-2.5" />
                                      Prioridade Máxima (FUNECE)
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-slate-500 text-xxs truncate max-w-lg">
                                  {pt.desc}
                                </p>
                                
                                {/* Small mini progress track */}
                                {pctComplete > 0 && (
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                                        style={{ width: `${pctComplete}%` }}
                                      />
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-600 font-mono">{pctComplete}% Concluído</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 shrink-0">
                                {/* Small indicators */}
                                <div className="flex gap-1">
                                  {status.theory && <span title="Teoria Estudada" className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                  {status.practice && <span title="Questões Feitas" className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                  {status.summary && <span title="Resumo Criado" className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                                  {status.review && <span title="Revisado" className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                                </div>
                                
                                <div className={`p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors ${isExpanded ? "rotate-180 text-slate-600" : ""}`}>
                                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                                </div>
                              </div>
                            </div>
                            
                            {/* Expanded content panel */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-slate-100 bg-slate-50/50"
                                >
                                  <div className="p-4 sm:p-5 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                      {/* Checklist section */}
                                      <div className="md:col-span-5 bg-white p-4 rounded-xl border border-slate-100 shadow-xxs space-y-3">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
                                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                                          Metas de Estudo Ativo
                                        </p>
                                        
                                        <div className="space-y-2">
                                          {[
                                            { key: "theory", label: "Leitura de Teoria & Lei Seca", desc: "PDFs, livros ou videoaula de base", color: "text-emerald-600 bg-emerald-50" },
                                            { key: "practice", label: "Prática Dirigida (Simulado)", desc: "Resolver as questões da banca", color: "text-blue-600 bg-blue-50" },
                                            { key: "summary", label: "Memorização (Fichas/Flashcards)", desc: "Elaborar material de revisão rápida", color: "text-amber-600 bg-amber-50" },
                                            { key: "review", label: "Revisão Periódica Espaçada", desc: "Recuperação ativa do conteúdo", color: "text-purple-600 bg-purple-50" }
                                          ].map((item) => {
                                            const isChecked = (status as any)[item.key];
                                            return (
                                              <label
                                                key={item.key}
                                                className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors border select-none ${
                                                  isChecked
                                                    ? "bg-slate-50 border-slate-100"
                                                    : "hover:bg-slate-50 border-transparent"
                                                }`}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={isChecked}
                                                  onChange={() => togglePtStatus(currentSector.id, pt.num, item.key as any)}
                                                  className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                                />
                                                <div className="space-y-0.5">
                                                  <span className="text-xs font-bold text-slate-800 leading-none">{item.label}</span>
                                                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                                                </div>
                                              </label>
                                            );
                                          })}
                                        </div>
                                      </div>
                                      
                                      {/* Raio-X & Dicas section */}
                                      <div className="md:col-span-7 space-y-4">
                                        {/* Statistics box */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xxs space-y-2.5">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Relevância no Edital (Histórica)</span>
                                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                              analysis.relevance >= 80 ? "bg-rose-50 text-rose-700" : analysis.relevance >= 60 ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                                            }`}>{analysis.relevance}%</span>
                                          </div>
                                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                              className={`h-full rounded-full transition-all duration-300 ${
                                                analysis.relevance >= 80 ? "bg-rose-500" : analysis.relevance >= 60 ? "bg-amber-500" : "bg-slate-400"
                                              }`}
                                              style={{ width: `${analysis.relevance}%` }}
                                            />
                                          </div>
                                        </div>
                                        
                                        {/* Estilo de Cobrança and Trap */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xxs space-y-1">
                                            <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                              Foco do Exame
                                            </h5>
                                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                              {analysis.style}
                                            </p>
                                          </div>
                                          
                                          <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100/50 shadow-xxs space-y-1">
                                            <h5 className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                                              <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                              Pegadinha Clássica
                                            </h5>
                                            <p className="text-[10px] text-rose-900 leading-relaxed font-medium">
                                              {analysis.trap}
                                            </p>
                                          </div>
                                        </div>
                                        
                                        {/* Bibliografia Recomendada */}
                                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xxs flex items-center gap-3">
                                          <div className="p-2 bg-slate-50 rounded-lg text-slate-600 shrink-0">
                                            <BookOpen className="w-4 h-4" />
                                          </div>
                                          <div className="space-y-0.5">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bibliografia Recomendada</span>
                                            <p className="text-[10px] text-slate-600 leading-snug">
                                              {analysis.bibliography}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Action Shortcuts */}
                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                                      {onChangeModule && onTopicClick && (
                                        <>
                                          <button
                                            onClick={() => {
                                              onTopicClick(`FUNECE - ${currentSector.name}: Ponto ${pt.num} - ${pt.title}`);
                                              onChangeModule("chat");
                                            }}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
                                          >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span>Estudar com o Mentor</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                          </button>
                                          
                                          <button
                                            onClick={() => {
                                              onTopicClick(`FUNECE - ${currentSector.name}: Ponto ${pt.num} - ${pt.title}`);
                                              onChangeModule("simulator");
                                            }}
                                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                          >
                                            <Play className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                            <span>Praticar Questões do Ponto</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
              </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Sidebar: Categories of General Content */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-3">
                      <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-wider px-2">
                        Categorias (Edital Geral)
                      </h3>
                      <div className="space-y-1">
                        {generalCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedGenCatId(cat.id);
                              setSelectedGenTopicKey(cat.topics[0]);
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1 cursor-pointer ${
                              selectedGenCatId === cat.id
                                ? "bg-emerald-50 border-emerald-250 text-emerald-950 font-bold shadow-xs"
                                : "bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span className="text-xxs font-black leading-tight">
                              {cat.name}
                            </span>
                            <span className={`text-[9px] leading-snug line-clamp-2 ${
                              selectedGenCatId === cat.id ? "text-emerald-700/80" : "text-slate-400 font-medium"
                            }`}>
                              {cat.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* General Content Checklist / Topic list */}
                    <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-3">
                      <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-wider px-2">
                        Tópicos Disponíveis ({generalCategories.find(c => c.id === selectedGenCatId)?.topics.length || 0})
                      </h3>
                      <div className="space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                        {generalCategories.find(c => c.id === selectedGenCatId)?.topics.map((topKey) => {
                          const guide = TOPIC_STUDY_GUIDES[topKey as keyof typeof TOPIC_STUDY_GUIDES];
                          const isSel = selectedGenTopicKey === topKey;
                          
                          const subs = guide?.subtopics || [];
                          const completedSubsCount = subs.filter(s => genSubtopicStatus[`${topKey}_${s}`]).length;
                          const pct = subs.length > 0 ? Math.round((completedSubsCount / subs.length) * 100) : 0;

                          return (
                            <button
                              key={topKey}
                              onClick={() => setSelectedGenTopicKey(topKey)}
                              className={`w-full text-left p-2.5 rounded-lg border transition-all flex flex-col gap-1.5 cursor-pointer ${
                                isSel
                                  ? "bg-emerald-50/50 border-emerald-250 text-emerald-950 font-bold"
                                  : "bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 w-full">
                                <span className="text-xxs leading-snug line-clamp-2 font-bold font-sans">
                                  {topKey}
                                </span>
                                {pct === 100 && (
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                )}
                              </div>
                              
                              <div className="w-full space-y-1">
                                <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                                  <span>Progresso</span>
                                  <span>{pct}%</span>
                                </div>
                                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500 rounded-full" 
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Content Column: Selected General Topic Study Guide */}
                  <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-5">
                    {(() => {
                      const guide = TOPIC_STUDY_GUIDES[selectedGenTopicKey as keyof typeof TOPIC_STUDY_GUIDES];
                      if (!guide) {
                        return (
                          <div className="text-center py-12 text-slate-400 text-xs font-medium">
                            Selecione um tópico ao lado para visualizar o Guia de Estudo.
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-6">
                          {/* Title Header */}
                          <div className="border-b border-slate-100 pb-4 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-emerald-50 text-emerald-850 text-[9px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-100">
                                Conteúdo Geral Comum
                              </span>
                              <span className="bg-slate-50 text-slate-700 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-md border border-slate-250">
                                Banca Preferencial: FUNECE
                              </span>
                            </div>
                            <h2 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                              {guide.topicName}
                            </h2>
                          </div>

                          {/* Subtopics checklist */}
                          <div className="space-y-3">
                            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                              <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                              Tópicos e Subtópicos do Edital (Marque como concluído)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {guide.subtopics.map((sub, index) => {
                                const isChecked = !!genSubtopicStatus[`${selectedGenTopicKey}_${sub}`];
                                return (
                                  <label
                                    key={index}
                                    className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer hover:bg-slate-50/50 ${
                                      isChecked
                                        ? "bg-emerald-50/30 border-emerald-100/70"
                                        : "bg-white border-slate-100"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleGenSubtopic(selectedGenTopicKey, sub)}
                                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 shrink-0 accent-emerald-600 cursor-pointer"
                                    />
                                    <span className={`text-xxs leading-snug font-medium ${
                                      isChecked ? "text-slate-500 line-through" : "text-slate-750"
                                    }`}>
                                      {sub}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Theory summary */}
                          <div className="bg-slate-50/45 rounded-xl border border-slate-150/40 p-4 space-y-2">
                            <h4 className="text-slate-800 text-xxs font-black uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                              Conteúdo Teórico Resumido (Teoria &amp; Lei Seca)
                            </h4>
                            <p className="text-slate-600 text-xxs leading-relaxed">
                              {guide.theorySummary}
                            </p>
                          </div>

                          {/* Pitfalls (casca de banana) */}
                          <div className="bg-rose-50/45 rounded-xl border border-rose-150/30 p-4 space-y-2">
                            <h4 className="text-rose-950 text-xxs font-black uppercase tracking-wider flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-650" />
                              Pegadinhas da Banca (Casca de Banana)
                            </h4>
                            <p className="text-rose-900 text-xxs leading-relaxed">
                              {guide.pitfalls}
                            </p>
                          </div>

                          {/* Info footer: references & study strategy */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50/30 rounded-xl border border-slate-100 p-4 space-y-2">
                              <h4 className="text-slate-850 text-[9px] font-black uppercase tracking-wider">
                                Referências Bibliográficas
                              </h4>
                              <p className="text-slate-650 text-xxs leading-relaxed italic">
                                {guide.references}
                              </p>
                            </div>
                            <div className="bg-emerald-50/20 rounded-xl border border-emerald-100/50 p-4 space-y-2">
                              <h4 className="text-emerald-950 text-[9px] font-black uppercase tracking-wider">
                                Estratégia de Memorização
                              </h4>
                              <p className="text-emerald-900 text-xxs leading-relaxed">
                                {guide.strategy}
                              </p>
                            </div>
                          </div>

                          {/* Action Shortcuts */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                            {onChangeModule && onTopicClick && (
                              <>
                                <button
                                  onClick={() => {
                                    onTopicClick(`FUNECE - Conteúdo Geral: ${selectedGenTopicKey}`);
                                    onChangeModule("chat");
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Estudar com o Mentor</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                                
                                <button
                                  onClick={() => {
                                    onTopicClick(`FUNECE - Conteúdo Geral: ${selectedGenTopicKey}`);
                                    onChangeModule("simulator");
                                  }}
                                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                  <span>Praticar Questões do Tópico</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE POINT DRAWING SIMULATOR */}
          {activeTab === "simulator" && (
            <motion.div
              key="simulator-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-5">
                  <div className="space-y-1">
                    <h2 className="font-display font-extrabold text-xl text-slate-900">
                      Sorteador de Pontos FUNECE
                    </h2>
                    <p className="text-slate-400 text-xs">
                      Simule o sorteio real regulamentado pelas seções 12.1 e 13.1 do edital.
                    </p>
                  </div>
                  
                  {/* Select Sector Dropdown inside simulator */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-500 shrink-0">Setor Ativo:</label>
                    <select
                      value={selectedSectorId}
                      onChange={(e) => {
                        setSelectedSectorId(e.target.value);
                        setWrittenPoint(null);
                        setDidacticPoint(null);
                        setShowSorterInstructions(true);
                      }}
                      className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      {visibleSectors.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          Setor {sec.code}: {sec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sorter Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Prova Escrita point card */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                          1ª Etapa • Prova Escrita
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">1 sorteio para todos</span>
                      </div>
                      
                      <div className="pt-4">
                        {writtenPoint ? (
                          <div className="space-y-2 animate-fade-in">
                            <p className="text-emerald-600 font-mono text-xs font-black">PONTO {writtenPoint.num} SORTEADO</p>
                            <h3 className="font-display font-bold text-base text-slate-800">{writtenPoint.title}</h3>
                            <p className="text-slate-500 text-xxs sm:text-xs leading-relaxed">{writtenPoint.desc}</p>
                          </div>
                        ) : (
                          <div className="text-slate-400 text-xs italic flex flex-col py-6 items-center justify-center gap-2">
                            <ClipboardList className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                            Aguardando sorteio de temas...
                          </div>
                        )}
                      </div>
                    </div>

                    {writtenPoint && (
                      <div className="border-t border-slate-200/50 pt-3 mt-4">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Critérios de Avaliação (FUNECE):</p>
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-[9px] text-slate-500 font-medium">
                          <p>• Domínio do conteúdo (0 a 5.0)</p>
                          <p>• Precisão conceitual (0 a 2.0)</p>
                          <p>• Coerência de ideias (0 a 2.0)</p>
                          <p>• Clareza e coesão (0 a 1.0)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Prova Didática point card */}
                  <div className="bg-emerald-50/20 rounded-2xl p-6 border border-emerald-100/50 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                          2ª Etapa • Prova Didática
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono font-bold">Antecedência 48 Horas</span>
                      </div>
                      
                      <div className="pt-4">
                        {didacticPoint ? (
                          <div className="space-y-2 animate-fade-in">
                            <p className="text-emerald-700 font-mono text-xs font-black">PONTO {didacticPoint.num} SORTEADO</p>
                            <h3 className="font-display font-bold text-base text-slate-800">{didacticPoint.title}</h3>
                            <p className="text-slate-600 text-xxs sm:text-xs leading-relaxed">{didacticPoint.desc}</p>
                          </div>
                        ) : (
                          <div className="text-emerald-600/40 text-xs italic flex flex-col py-6 items-center justify-center gap-2">
                            <ClipboardList className="w-8 h-8 text-emerald-200 stroke-[1.5]" />
                            Exclui ponto da Prova Escrita
                          </div>
                        )}
                      </div>
                    </div>

                    {didacticPoint && (
                      <div className="border-t border-emerald-100 pt-3 mt-4">
                        <p className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Grade Didática (FUNECE):</p>
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5 text-[9px] text-emerald-700/80 font-medium">
                          <p>• Domínio do assunto (0 a 5.0)</p>
                          <p>• Uso do tempo (0 a 1.0)</p>
                          <p>• Sistematização (0 a 1.0)</p>
                          <p>• Comunicação (0 a 1.0)</p>
                          <p>• Metodologia (0 a 1.0)</p>
                          <p>• Plano de Aula (0 a 1.0)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sorter Button Control */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">Pronto para sortear seus temas?</p>
                    <p className="text-slate-400 text-xxs leading-relaxed">
                      Sorteia um ponto de 1 a 10 para a Prova Escrita e outro ponto diferente (entre os 9 restantes) para a Prova Didática.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleDrawPoints}
                    disabled={isSorting}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center gap-2 cursor-pointer grow sm:grow-0 justify-center min-w-[180px]"
                  >
                    {isSorting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sorteando Temas...
                      </>
                    ) : (
                      <>
                        <Shuffle className="w-4 h-4" />
                        Sorteio de Pontos
                      </>
                    )}
                  </button>
                </div>

                {/* Tutor / Mentor Helper tips for the drawn points */}
                <AnimatePresence>
                  {!showSorterInstructions && (writtenPoint || didacticPoint) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-center gap-2 text-emerald-800">
                        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Instruções de Preparo Prático (Roteiro)</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                        <div className="space-y-2">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Estratégia para Dissertar (Prova Escrita)
                          </p>
                          <p>
                            Para o ponto **{writtenPoint?.title}**, divida sua prova de 4 horas em: 15 minutos para planejar a estrutura (introdução, desenvolvimento teórico, fundamentação e conclusão), 3 horas de escrita contínua (com letra legível e margens organizadas), e 15 minutos de revisão de português e coesão.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Planejamento de Aula (Didática)
                          </p>
                          <p>
                            Você tem 48h para criar o Plano de Aula de **{didacticPoint?.title}**. Lembre-se: no início da Prova Didática, você **deve** entregar 3 cópias impressas do Plano de Aula para a banca examinadora. Controle seu tempo rigidamente: cronometre sua aula para fechar rigorosamente entre **50 e 60 minutos** para não perder pontos preciosos!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* TAB 3: APPROVED SCORE WEIGHTED CALCULATOR */}
          {activeTab === "calculator" && (
            <motion.div
              key="calculator-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-8">
                <div className="border-b border-slate-50 pb-5">
                  <h2 className="font-display font-extrabold text-xl text-slate-900">
                    Calculadora de Notas (Rigor FUNECE)
                  </h2>
                  <p className="text-slate-400 text-xs">
                    Simule os pesos, notas de examinadores e as penalidades de tempo regulamentares do edital.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Side Inputs (Grades sliders) */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Stage 1 Written Grades */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-5 h-5 bg-slate-900 text-white rounded text-xxs font-bold flex items-center justify-center">1</span>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Prova Escrita Dissertativa (Membro Examinadores)</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xxs font-semibold">
                            <span className="text-slate-500">Avaliador 1</span>
                            <span className="font-bold text-slate-800">{writtenGrade1.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={writtenGrade1}
                            onChange={(e) => setWrittenGrade1(Number(e.target.value))}
                            className="w-full accent-slate-900"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xxs font-semibold">
                            <span className="text-slate-500">Avaliador 2</span>
                            <span className="font-bold text-slate-800">{writtenGrade2.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={writtenGrade2}
                            onChange={(e) => setWrittenGrade2(Number(e.target.value))}
                            className="w-full accent-slate-900"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xxs font-semibold">
                            <span className="text-slate-500">Avaliador 3</span>
                            <span className="font-bold text-slate-800">{writtenGrade3.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={writtenGrade3}
                            onChange={(e) => setWrittenGrade3(Number(e.target.value))}
                            className="w-full accent-slate-900"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-slate-50/50 rounded-xl p-3 border border-slate-100 text-xxs">
                        <span className="text-slate-500 font-medium">Média Aritmética Dissertativa (NPED):</span>
                        <span className={`font-bold font-mono ${writtenAverage >= 7.0 ? "text-emerald-600" : "text-red-500"}`}>
                          {writtenAverage.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Stage 2 Didactic Grades */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-5 h-5 bg-emerald-600 text-white rounded text-xxs font-bold flex items-center justify-center">2</span>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Prova Didática (Membro Examinadores)</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xxs font-semibold">
                            <span className="text-slate-500">Avaliador 1</span>
                            <span className="font-bold text-slate-800">{didacticGrade1.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={didacticGrade1}
                            onChange={(e) => setDidacticGrade1(Number(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xxs font-semibold">
                            <span className="text-slate-500">Avaliador 2</span>
                            <span className="font-bold text-slate-800">{didacticGrade2.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={didacticGrade2}
                            onChange={(e) => setDidacticGrade2(Number(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xxs font-semibold">
                            <span className="text-slate-500">Avaliador 3</span>
                            <span className="font-bold text-slate-800">{didacticGrade3.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
max="10"
                            step="0.1"
                            value={didacticGrade3}
                            onChange={(e) => setDidacticGrade3(Number(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Time penalty control (rigor edital) */}
                      <div className="bg-emerald-50/10 border border-emerald-100/50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-5 space-y-0.5">
                          <p className="text-xs font-bold text-slate-700">Duração da Aula Didática</p>
                          <p className="text-[10px] text-slate-400">Tempo mínimo 50 minutos (limite 40m)</p>
                        </div>
                        
                        <div className="sm:col-span-7 flex items-center gap-3">
                          <input
                            type="range"
                            min="30"
                            max="60"
                            step="1"
                            value={lessonDurationMinutes}
                            onChange={(e) => setLessonLessonDurationMinutes(Number(e.target.value))}
                            className="w-full accent-emerald-600"
                          />
                          <span className={`text-xs font-bold font-mono px-2 py-1 rounded shrink-0 min-w-[70px] text-center ${
                            lessonDurationMinutes < 40 
                              ? "bg-red-100 text-red-700 border border-red-200" 
                              : lessonDurationMinutes < 50 
                              ? "bg-amber-100 text-amber-700 border border-amber-200" 
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}>
                            {lessonDurationMinutes} min
                          </span>
                        </div>
                      </div>

                      {/* Summary of Didactic Scores */}
                      <div className="flex flex-wrap justify-between items-center bg-slate-50/50 rounded-xl p-3 border border-slate-100 text-xxs gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">Média Bruta:</span>
                          <span className="font-bold font-mono text-slate-700">{didacticRawAverage.toFixed(2)}</span>
                          {actualDidacticPenalty > 0 && (
                            <span className="text-red-500 font-bold">
                              (Penalidade: -{actualDidacticPenalty.toFixed(1)} pts)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-medium">Média Didática Final (NPD):</span>
                          <span className={`font-bold font-mono ${didacticFinalAverage >= 7.0 ? "text-emerald-600" : "text-red-500"}`}>
                            {didacticFinalAverage.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Output Summary (Weighted Final grade & approval status) */}
                  <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <p className="text-slate-400 font-bold text-xxs uppercase tracking-wider text-center">Média Geral Ponderada</p>
                      
                      {/* Big Grade Badge */}
                      <div className="text-center space-y-1">
                        <p className="text-4xl font-display font-black text-slate-900 tracking-tight">
                          {finalScore.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Fórmula: (NPED * 2 + NPD) / 3
                        </p>
                      </div>

                      {/* Approval Status */}
                      <div className={`rounded-xl border p-3 text-center ${statusColor}`}>
                        <p className="text-xs font-black uppercase tracking-wider">{status}</p>
                        <p className="text-[10px] leading-relaxed mt-1 font-medium">{statusReason}</p>
                      </div>
                    </div>

                    {/* QuickNCLEX Tips */}
                    <div className="bg-white rounded-xl p-4 border border-slate-150 space-y-2 text-xxs text-slate-500 leading-relaxed">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <p className="uppercase tracking-wider">Cálculo de Desempate</p>
                      </div>
                      <p>
                        Se houver empate na média final ponderada, a FUNECE aplica o seguinte rito de preferência sucessivo:
                      </p>
                      <p>
                        1. Candidato com idade &gt;= 60 anos (Estatuto do Idoso).
                        <br />
                        2. **Maior nota na Prova Escrita Dissertativa (NPED)**.
                        <br />
                        3. Titulação acadêmica de maior nível.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: FUNECE COMPENSATION AND REGIME INFOS */}
          {activeTab === "salaries" && (
            <motion.div
              key="salaries-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-slate-50 pb-5">
                  <h2 className="font-display font-extrabold text-xl text-slate-900">
                    Remuneração Oficial da Seleção
                  </h2>
                  <p className="text-slate-400 text-xs">
                    Tabela de vencimentos básicos indexados pela titulação acadêmica comprovada (CLT • Item 15.19).
                  </p>
                </div>

                {/* Salary grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Regime 40 Horas */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-900 text-white p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>Regime 40 Horas Semanais</span>
                        <span className="text-xxs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">Integral</span>
                      </h3>
                    </div>
                    <div className="p-4 space-y-3.5 bg-slate-50/50">
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Professor Graduado</span>
                        <span className="font-mono font-bold text-slate-800">R$ 2.313,44</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Professor Especialista</span>
                        <span className="font-mono font-bold text-slate-800">R$ 3.139,68</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Professor Mestre</span>
                        <span className="font-mono font-bold text-emerald-600 font-extrabold">R$ 4.957,38</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Professor Doutor</span>
                        <span className="font-mono font-bold text-emerald-700 font-black">R$ 6.609,79</span>
                      </div>
                    </div>
                  </div>

                  {/* Regime 20 Horas */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-900 text-white p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>Regime 20 Horas Semanais</span>
                        <span className="text-xxs font-mono text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">Parcial</span>
                      </h3>
                    </div>
                    <div className="p-4 space-y-3.5 bg-slate-50/50">
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Professor Graduado</span>
                        <span className="font-mono font-bold text-slate-800">R$ 1.156,72</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Professor Especialista</span>
                        <span className="font-mono font-bold text-slate-800">R$ 1.569,84</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-medium">Professor Mestre</span>
                        <span className="font-mono font-bold text-slate-800 font-bold">R$ 2.478,69</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">Professor Doutor</span>
                        <span className="font-mono font-bold text-slate-800 font-extrabold">R$ 3.304,90</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Regimes & Rights list */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider">Direitos e Regras Contratuais</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xxs sm:text-xs text-slate-500 leading-relaxed">
                    <ul className="space-y-2 list-disc pl-4">
                      <li>**Regime CLT**: Os aprovados contratados estarão sob a égide da Consolidação das Leis do Trabalho (CLT), com direito a 13º salário, férias proporcionais e FGTS.</li>
                      <li>**Vigência**: O prazo de validade da seleção pública é de **1 (um) ano**, contado da data de homologação, podendo ser prorrogado uma vez por igual período.</li>
                    </ul>
                    <ul className="space-y-2 list-disc pl-4">
                      <li>**Banco de Cadastro**: Candidatos aprovados além das vagas formam o Cadastro Reserva, convocados em ordem rigorosa em caso de desistências ou novas carências.</li>
                      <li>**Carga Horária**: Pode variar entre 20h e 40h semanais de acordo com a necessidade imediata da unidade de ensino (UECE).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showProgressModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in no-print">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-4xl w-full border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
          >
            {/* Modal Header */}
            <div className="bg-white text-slate-850 p-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center border border-emerald-100/50">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">Relatório de Rendimento do Edital</h3>
                  <p className="text-slate-400 text-[9px] font-mono font-bold uppercase">SELEÇÃO PÚBLICA FUNECE • PROFESSOR TEMPORÁRIO</p>
                </div>
              </div>
              <button
                onClick={() => setShowProgressModal(false)}
                className="text-slate-400 hover:text-slate-650 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <span className="sr-only">Fechar</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Overall Progress Stat Box */}
              {(() => {
                const stats = getAllSectorsStats();
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <div className="md:col-span-8 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {stats.overallPct}% Concluído Geral
                        </span>
                        <span className="text-slate-500 text-xxs font-semibold">
                          {stats.totalCompleted} de {stats.totalGoalsAll} tarefas concluídas no total
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-slate-800 text-sm">
                        Resumo Geral do Cronograma
                      </h4>
                      <p className="text-slate-500 text-xxs leading-relaxed">
                        Este relatório consolida seu progresso em todas as disciplinas e setores do edital. O avanço é medido com base na conclusão das quatro etapas de estudo ativo (Teoria, Questões, Memorização e Revisão) para cada um dos 10 pontos de cada setor.
                      </p>
                      
                      {/* Overall Progress Bar */}
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${stats.overallPct}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-4 bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status da Preparação</p>
                      <p className="text-lg font-black text-slate-800 mt-1 font-mono">
                        {stats.overallPct === 100 
                          ? "PREPARADO" 
                          : stats.overallPct >= 70 
                            ? "RETA FINAL" 
                            : stats.overallPct >= 30 
                              ? "EM EVOLUÇÃO" 
                              : "INICIAL"}
                      </p>
                      <button
                        onClick={() => setIsPrintingMode(true)}
                        className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xxs flex items-center justify-center gap-1.5 transition-all shadow-sm w-full cursor-pointer group"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-100 group-hover:scale-105 transition-transform" />
                        Imprimir / Salvar PDF
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Progress per Sector Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-500" />
                  Progresso por Setor de Estudo (Edital)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleSectors.map((sec) => {
                    const stats = getSectorStats(sec);
                    const isActive = sec.id === currentSector.id;
                    return (
                      <div 
                        key={sec.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isActive 
                            ? "bg-emerald-50/20 border-emerald-200/60 ring-2 ring-emerald-500/5" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono font-bold text-slate-400">Setor {sec.code}</span>
                            <h5 className="text-xs font-bold text-slate-800 leading-tight">{sec.name}</h5>
                          </div>
                          <span className={`text-xs font-mono font-black ${isActive ? "text-emerald-600" : "text-slate-600"}`}>
                            {stats.progressPct}%
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                            style={{ width: `${stats.progressPct}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] text-slate-400 font-semibold truncate max-w-[150px]">
                            {sec.unit}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 font-bold">
                            {stats.completedGoals} / {stats.totalGoals} metas
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Point Checklist for Current Sector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Detalhamento do Setor Ativo: {currentSector.name}
                  </h4>
                  <span className="text-[9px] font-mono bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                    Código {currentSector.code}
                  </span>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
                  {currentSector.points.map((pt) => {
                    const compositeId = `${currentSector.id}_${pt.num}`;
                    const status = ptStatus[compositeId] || { theory: false, practice: false, summary: false, review: false };
                    const completedCount = [status.theory, status.practice, status.summary, status.review].filter(Boolean).length;
                    const pctComplete = completedCount * 25;
                    
                    return (
                      <div 
                        key={pt.num}
                        className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xxs"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className={`w-6 h-6 rounded-lg font-mono font-black flex items-center justify-center shrink-0 ${
                            pctComplete === 100 
                              ? "bg-emerald-600 text-white" 
                              : pctComplete > 0 
                                ? "bg-amber-500 text-white" 
                                : "bg-slate-200 text-slate-600"
                          }`}>
                            {pt.num}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-slate-850 truncate">{pt.title}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-md">{pt.desc}</p>
                          </div>
                        </div>

                        {/* Checklist Indicators */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex gap-1.5">
                            {[
                              { label: "Teoria", value: status.theory, color: "bg-emerald-500" },
                              { label: "Prática", value: status.practice, color: "bg-blue-500" },
                              { label: "Resumo", value: status.summary, color: "bg-amber-500" },
                              { label: "Revisão", value: status.review, color: "bg-purple-500" }
                            ].map((task) => (
                              <div 
                                key={task.label}
                                className={`px-2 py-0.5 rounded font-bold text-[9px] border transition-all flex items-center gap-0.5 ${
                                  task.value 
                                    ? `${task.color} text-white border-transparent` 
                                    : "bg-white text-slate-400 border-slate-200"
                                }`}
                              >
                                {task.value && <Check className="w-2.5 h-2.5" />}
                                <span>{task.label}</span>
                              </div>
                            ))}
                          </div>
                          
                          <span className="w-12 text-right font-mono font-bold text-slate-600">{pctComplete}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-4.5 flex items-center justify-between">
              <p className="text-slate-400 text-xxs font-semibold">
                Análise baseada nas normas vigentes do Edital UECE.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xxs border border-slate-200 cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  onClick={() => setIsPrintingMode(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-xxs flex items-center gap-1.5 shadow-sm cursor-pointer border border-emerald-500/30 group"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-100 group-hover:scale-110 transition-transform" />
                  Imprimir PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

interface PointAnalysis {
  relevance: number;
  style: string;
  trap: string;
  bibliography: string;
}

function getPointAnalysis(sectorId: string, pointNum: number, title: string): PointAnalysis {
  // Stable calculation for relevance
  let relevance = 45 + ((pointNum * 7) % 51);
  if (pointNum === 1 || pointNum === 3 || pointNum === 5) {
    relevance = Math.min(95, relevance + 15);
  }
  
  let style = "";
  let trap = "";
  let bibliography = "";
  
  if (sectorId === "planejamento") {
    bibliography = "Libâneo, J. C. 'Organização e Gestão da Escola'; Luckesi, C. C. 'Avaliação da Aprendizagem Escolar'; Veiga, I. P. A. 'Projeto Político-Pedagógico'.";
    if (pointNum === 1 || pointNum === 2) {
      style = "Cobrança de teorias críticas sobre globalização, neoliberalismo e as exigências do Banco Mundial/OCDE para a educação básica.";
      trap = "A banca tenta inverter o papel de agências internacionais, afirmando que elas buscam autonomia local, quando na verdade promovem padronização e avaliação gerencial em larga escala.";
    } else if (pointNum === 3) {
      style = "Cobrança das diretrizes do Plano Nacional de Educação (PNE), prazos, metas e a dinâmica de aprovação legislativa.";
      trap = "Troca de prazos de vigência ou inversão do percentual de investimento do PIB em educação (metas do PNE).";
    } else if (pointNum === 4 || pointNum === 9) {
      style = "Foco em accountability, bonificação por resultados e indicadores estatísticos de larga escala (IDEB e SPAECE).";
      trap = "Falsa premissa de que a bonificação de professores é um consenso pedagógico e não gera fragmentação ou exclusão de alunos com baixo desempenho.";
    } else {
      style = "Modelos de currículo integrado e discussões sobre o multiculturalismo e inclusão escolar no PPP.";
      trap = "Definições de multiculturalismo crítico vs. liberal. A FUNECE costuma embaralhar as duas concepções pedagógicas.";
    }
  } else if (sectorId === "formacao_docente") {
    bibliography = "Tardif, Maurice. 'Saberes Docentes e Formação Profissional'; Nóvoa, António. 'Os Professores e a sua Formação'; Schön, Donald. 'O Professor Reflexivo'.";
    if (pointNum === 3 || pointNum === 9) {
      style = "Classificação dos Saberes Docentes (Tardif): Saberes da formação profissional, disciplinares, curriculares e da experiência.";
      trap = "Falar que os 'saberes da experiência' são puramente teóricos ou herança universitária, quando na verdade são os saberes que emergem da prática cotidiana do professor.";
    } else if (pointNum === 5) {
      style = "Conceitos de epistemologia da prática e as três instâncias de reflexão propostas por Donald Schön.";
      trap = "Trocar as definições de 'reflexão-na-ação' (em tempo de prática) por 'reflexão-sobre-a-ação' (após a prática).";
    } else if (pointNum === 6) {
      style = "Visão crítica de Dermeval Saviani sobre as teorias reprodutivistas e a pedagogia histórico-crítica.";
      trap = "Enquadrar Saviani como defensor da pedagogia tecnicista ou tradicionalista de mercado.";
    } else {
      style = "Fases da carreira docente segundo Huberman (entrada, estabilização, diversificação) e narrativas de vida de Nóvoa.";
      trap = "Troca de nomes das fases do ciclo de vida docente descritas por Huberman.";
    }
  } else if (sectorId === "ens_matematica") {
    bibliography = "Vergnaud, Gérard. 'A Teoria dos Campos Conceituais'; D'Ambrosio, Ubiratan. 'Etnomatemática'; Duval, Raymond. 'Semiótica e Aprendizagem Matemática'.";
    if (pointNum === 3) {
      style = "Estruturas aditivas e multiplicativas segundo Vergnaud, analisando problemas de proporção, partição e combinação.";
      trap = "Confundir o campo aditivo com o multiplicativo na transição didática do Ensino Fundamental.";
    } else if (pointNum === 6) {
      style = "Etnomatemática de D'Ambrosio, focando em como grupos culturais específicos constroem e operam sistemas matemáticos.";
      trap = "A banca sugere que a etnomatematica dispensa o ensino da matemática formal acadêmica, o que é um erro de interpretação crasso.";
    } else if (pointNum === 9) {
      style = "Teoria dos Registros de Representação Semiótica de Duval. Foco na importância de transitar entre gráfico, numérico e verbal.";
      trap = "Afirmar que o estudante aprende sem a necessidade de múltiplos registros, ou que a mera representação visual substitui o raciocínio formal.";
    } else {
      style = "Avaliação formativa aplicada à matemática escolar e a análise construtiva de erros segundo Maria Regina Cury.";
      trap = "Ver o erro apenas como punição e não como indicador diagnóstico do raciocínio lógico do aluno.";
    }
  } else if (sectorId === "matematica") {
    bibliography = "Boldrini, José Luiz. 'Álgebra Linear'; Boyce, William E. 'Equações Diferenciais Elementares e Problemas de Valores de Contorno'; Morettin, Pedro A. 'Estatística Básica'.";
    if (pointNum <= 2) {
      style = "Matrizes, determinantes e discussão de sistemas lineares usando o Teorema de Rouché-Capelli.";
      trap = "Trocar condições de sistemas possíveis indeterminados por sistemas impossíveis na parametrização.";
    } else if (pointNum === 3 || pointNum === 4 || pointNum === 5) {
      style = "Formulação de modelos físicos de crescimento e decaimento por EDOs lineares de 1ª ordem.";
      trap = "Errar a constante de integração ou confundir o comportamento assintótico de equações logísticas.";
    } else {
      style = "Teorema Fundamental do Cálculo, séries de potências e polinômio de Taylor com estimativa de resto de Lagrange.";
      trap = "Falta de verificação de continuidade e derivabilidade do intervalo antes de aplicar o Teorema Fundamental do Cálculo.";
    }
  } else if (sectorId === "linguistica") {
    bibliography = "Saussure, F. 'Curso de Linguística Geral'; Koch, Ingedore. 'A Coesão Textual'; Bakhtin, Mikhail. 'Estética da Criação Verbal'.";
    if (pointNum <= 2) {
      style = "Dicotomias saussurianas clássicas ou a gramática gerativa de Noam Chomsky.";
      trap = "Inverter os conceitos de competência e desempenho de Chomsky, ou língua (social) e fala (individual) de Saussure.";
    } else if (pointNum === 8 || pointNum === 9) {
      style = "Mecanismos de coesão textual de Koch e Marcuschi, e a caracterização de gêneros do discurso por Bakhtin.";
      trap = "Confundir coesão referencial (anáfora, catáfora) com coesão sequencial (conectivos lógicos de progressão).";
    } else {
      style = "Pragmática linguística: atos de fala de Austin/Searle e implicaturas de Grice.";
      trap = "Inverter implicatura convencional e implicatura conversacional nas interações sociais de fala.";
    }
  } else if (sectorId === "literatura") {
    bibliography = "Bosi, Alfredo. 'História Concisa da Literatura Brasileira'; Candido, Antonio. 'Formação da Literatura Brasileira'.";
    if (pointNum <= 2) {
      style = "Poesia social e intimista de Carlos Drummond de Andrade, ou a engenharia do verso rigoroso de João Cabral de Melo Neto.";
      trap = "Falsa associação entre a poesia de Cabral com sentimentalismo exacerbado, sendo que ele é o poeta da pedra, da concisão e da anti-lírica.";
    } else if (pointNum === 3 || pointNum === 5) {
      style = "Realismo de Machado de Assis ('Quincas Borba') e regionalismo de 30 de Graciliano Ramos ('São Bernardo').";
      trap = "Confundir a filosofia irônica do Humanitismo de Quincas Borba com mero pessimismo sem base material ou crítica ao capitalismo.";
    } else {
      style = "Modernismo de Mário de Andrade, tragédia suburbana de Nelson Rodrigues ou hermetismo lírico em Fernando Pessoa.";
      trap = "Enquadrar Nelson Rodrigues na escola realista burguesa convencional, ocultando o caráter mítico e expressionista de suas peças.";
    }
  } else if (sectorId === "historia_brasil") {
    bibliography = "Fausto, Boris. 'História do Brasil'; Schwarcz, Lilia M. 'Brasil: Uma Biografia'; Prado Júnior, Caio. 'Formação do Brasil Contemporâneo'.";
    if (pointNum <= 3) {
      style = "Resistência indígena colonial, tráfico negreiro transatlântico e revoltas nativistas/emancipacionistas.";
      trap = "Ver as revoltas nativistas como movimentos pela independência total, esquecendo que eram rebeliões de caráter local e elitista.";
    } else if (pointNum === 5) {
      style = "Abolicionismo brasileiro, enfatizando a libertação precoce de escravizados no Ceará em 1884.";
      trap = "Desconsiderar a agência direta dos escravizados nas fugas e jangadas, atribuindo a abolição apenas às elites de intelectuais cearenses.";
    } else {
      style = "Ditadura militar, populismo, movimentos sociais da década de 1980 e as recentes crises pós-Constituição de 1988.";
      trap = "Questões que invertem as causas das reformas de base ou as datas das leis institucionais da ditadura (AI-5, etc.).";
    }
  } else if (sectorId === "biologia") {
    bibliography = "Alberts, B. 'Biologia Molecular da Célula'; Junqueira & Carneiro, 'Histologia Básica'; Odum, E. 'Ecologia'.";
    if (pointNum === 1 || pointNum === 8) {
      style = "Bioenergética e respiração celular, ou clonagem, transgenia e engenharia molecular recombinante.";
      trap = "Inverter as fases da respiração celular (Glicólise, Ciclo de Krebs e Cadeia Respiratória) ou confundir fita simples/dupla de DNA/RNA.";
    } else if (pointNum === 6 || pointNum === 7) {
      style = "Dinâmica de ecossistemas, relações ecológicas e morfologia adaptativa do bioma Caatinga.";
      trap = "Falar que as xerófitas da Caatinga acumulam água apenas por falta de estômatos, esquecendo as adaptações foliares em espinhos e cutícula espessa.";
    } else {
      style = "Genética clássica, fisiologia animal comparada e controle endócrino.";
      trap = "Inversão entre os papéis de hormônios antagônicos (insulina/glucagon, calcitocina/paratormônio).";
    }
  } else if (sectorId === "sociologia") {
    bibliography = "Giddens, Anthony. 'Sociologia'; Quintaneiro, Tania. 'Um Toque de Clássicos'; Bourdieu, Pierre. 'A Distinção'.";
    if (pointNum <= 4) {
      style = "Os três autores clássicos: Karl Marx (luta de classes, mais-valia), Durkheim (fatos sociais, anomia) e Max Weber (ação social).";
      trap = "Atribuir o conceito de 'fato social' a Weber ou misturar a solidariedade orgânica durkheimiana com a luta de classes marxista.";
    } else if (pointNum === 7) {
      style = "Estrutura e reprodução social na ótica de Pierre Bourdieu, habitus e capital cultural.";
      trap = "Definir o habitus como algo puramente biológico ou inflexível, desconsiderando que é uma estrutura estruturada e estruturante.";
    } else {
      style = "Trabalho, globalização e a transposição didática da Sociologia no ensino médio.";
      trap = "Afirmar que o Toyotismo elimina a precarização trabalhista por promover a polivalência profissional do operário.";
    }
  } else if (sectorId === "geografia") {
    bibliography = "Santos, Milton. 'A Natureza do Espaço'; Haesbaert, Rogério. 'O Mito da Desterritorialização'; Sene & Moreira, 'Geografia Geral e do Brasil'.";
    if (pointNum === 1 || pointNum === 8) {
      style = "Epistemologia da geografia escolar, territorialização e dinâmicas da globalização/multiterritorialidade.";
      trap = "Assumir que a globalização extingue as fronteiras ou as identidades locais, ignorando as reações de fragmentação territorial.";
    } else if (pointNum === 2 || pointNum === 3 || pointNum === 4) {
      style = "Geografia física, domínios morfoclimáticos, geomorfologia e bacias hidrográficas do Ceará.";
      trap = "Confundir os eixos de relevo do Ceará (Planalto de Ibiapaba, Chapada do Apodi, Depressão Sertaneja) ou suas bacias hidrográficas metropolitanas.";
    } else {
      style = "Geografia agrária, urbanização segregada e alfabetização cartográfica escolar ativa.";
      trap = "Considerar a cartografia apenas como técnica reprodutiva (decorar mapas) em vez de uma linguagem de leitura crítica do espaço.";
    }
  } else {
    style = "Abordagem conceitual profunda, combinando rigor acadêmico com exigência de transposição didática da banca.";
    trap = "Foco em minúcias técnicas, conceitos invertidos nos distratores e pegadinhas com exceções à regra.";
    bibliography = "Doutrinas de referência e textos normativos indicados no anexo do certame oficial.";
  }
  
  return { relevance, style, trap, bibliography };
}
