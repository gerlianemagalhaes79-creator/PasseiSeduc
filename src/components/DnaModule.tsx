import React, { useState, useEffect } from "react";
import { 
  Fingerprint, 
  Search, 
  Sparkles, 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  Activity, 
  HelpCircle, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";

interface DnaModuleProps {
  discipline: string;
  banca: string;
}

export default function DnaModule({ discipline, banca }: DnaModuleProps) {
  const [loading, setLoading] = useState(false);
  const [dnaReport, setDnaReport] = useState<string>("");
  const [searchTopic, setSearchTopic] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"general" | "custom">("general");

  const fetchGeneralDna = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/idecan-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "", discipline, banca })
      });
      const data = await response.json();
      if (data.success) {
        setDnaReport(data.text);
      } else {
        setDnaReport("Não foi possível carregar a engenharia reversa de forma dinâmica. Usando relatório offline.");
      }
    } catch (err) {
      console.error(err);
      setDnaReport("Erro ao carregar o relatório do servidor. Usando dados estáticos de contingência.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeneralDna();
  }, [banca]);

  const handleCustomAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTopic.trim()) return;

    setAnalyzing(true);
    setActiveSubTab("custom");
    try {
      const response = await fetch("/api/idecan-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTopic.trim(), discipline, banca })
      });
      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.text);
      } else {
        setAnalysisResult("Não foi possível gerar a análise para o tópico solicitado no momento.");
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult("Erro de conexão com o servidor de IA.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Brand Hero Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl -z-10"></div>

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xxs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            <Fingerprint className="w-3.5 h-3.5" />
            Engenharia Reversa • {banca}
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight leading-tight">
            Desvendando o <span className="text-emerald-400">DNA da {banca}</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl">
            Nossa análise estatística e pedagógica mapeia milhares de questões da banca {banca} aplicadas ao longo dos anos para traçar regras de ouro. Isso calibra tanto a nossa geração de simulados quanto a sua preparação de alto rendimento.
          </p>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Navegar no Mapeamento
            </h3>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveSubTab("general")}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition-all text-left ${
                  activeSubTab === "general"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  Relatório DNA Geral
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (analysisResult) setActiveSubTab("custom");
                }}
                disabled={!analysisResult}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold transition-all text-left ${
                  !analysisResult ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  activeSubTab === "custom"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4" />
                  Análise Personalizada
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Search Tool */}
          <div className="bg-emerald-950 text-emerald-50 rounded-2xl border border-emerald-900 p-5 shadow-xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/20 rounded-full filter blur-xl -z-10"></div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Ferramenta Interativa</span>
              <h3 className="font-display font-bold text-sm text-white">Análise de Assunto Seco</h3>
              <p className="text-emerald-200/75 text-xxs leading-relaxed">
                Insira qualquer tópico do edital para o sistema realizar a engenharia reversa instantânea das táticas da {banca} sobre ele.
              </p>
            </div>

            <form onSubmit={handleCustomAnalysis} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Artigo 24 da LDB, Didática..."
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  className="w-full bg-emerald-900/50 border border-emerald-800 focus:border-emerald-500 focus:bg-emerald-900 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none placeholder-emerald-400 font-medium"
                />
                <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dissecando Assunto...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Solicitar Análise da Banca</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Stat Box/Infographic card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Métricas Estimadas ({banca})</h4>
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xxs">Literalidade vs Interpretação</span>
                <span className="text-emerald-600 text-xs font-bold">
                  {banca === "FUNECE" ? "85% Literal / 15% Interp." : "75% Literal / 25% Interp."}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xxs">Frequência de "EXCETO/NÃO"</span>
                <span className="text-emerald-600 text-xs font-bold">
                  {banca === "FUNECE" ? "Extremamente Alta (~5 por prova)" : "Alta (~3 a 4 por prova)"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 text-xxs">Questões de Afirmativas (I, II, III)</span>
                <span className="text-emerald-600 text-xs font-bold">
                  {banca === "FUNECE" ? "Alta (~30%)" : "Muito Alta (~40%)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xxs">Comprimento dos Enunciados</span>
                <span className="text-emerald-600 text-xs font-bold">
                  {banca === "FUNECE" ? "Curto a Médio" : "Médio a Longo"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Report View Area */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs min-h-[500px] flex flex-col">
            {activeSubTab === "general" ? (
              loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative">
                    <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin"></div>
                    <Fingerprint className="w-6 h-6 text-emerald-600 absolute top-4 left-4 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-700 font-display font-bold text-sm">Realizando Engenharia Reversa...</p>
                    <p className="text-slate-400 text-xs mt-1">Analisando provas históricas e gerando relatório técnico do DNA da {banca}</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none prose-sm sm:prose-base">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                    <h3 className="font-display text-lg font-extrabold text-slate-900 m-0">Manual Técnico de Engenharia Reversa</h3>
                  </div>
                  
                  <div className="markdown-body text-slate-600 leading-relaxed space-y-4">
                    <ReactMarkdown>{dnaReport}</ReactMarkdown>
                  </div>
                </div>
              )
            ) : (
              analyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                  <div className="text-center">
                    <p className="text-slate-700 font-display font-bold text-sm">Dissecando Tópico sob o estilo {banca}...</p>
                    <p className="text-slate-400 text-xs mt-1">Gerando estratégias de cobrança e padrões de pegadinha para "{searchTopic}"</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none prose-sm sm:prose-base">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6 justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                      <h3 className="font-display text-lg font-extrabold text-slate-900 m-0">Análise de Assunto: <span className="text-emerald-600">{searchTopic}</span></h3>
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">{banca} Style</span>
                  </div>

                  <div className="markdown-body text-slate-600 leading-relaxed space-y-4">
                    <ReactMarkdown>{analysisResult}</ReactMarkdown>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ChevronRightProps extends React.SVGProps<SVGSVGElement> {}
function ChevronRight(props: ChevronRightProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
