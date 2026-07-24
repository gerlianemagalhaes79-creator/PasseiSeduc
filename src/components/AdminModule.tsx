import React, { useState } from "react";
import { RegisteredTeacher } from "../types";
import { 
  UserPlus, 
  Users, 
  Key, 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  UserCheck, 
  Search, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Calendar, 
  AlertCircle,
  Share2,
  CheckCircle2,
  Filter,
  UserX,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminModuleProps {
  teachers: RegisteredTeacher[];
  onAddTeacher: (teacher: Omit<RegisteredTeacher, "id" | "createdAt">) => void;
  onUpdateTeacher: (id: string, updated: Partial<RegisteredTeacher>) => void;
  onDeleteTeacher: (id: string) => void;
  currentLoginUser?: { role: string; fullName: string };
  onSwitchToTeacherLogin?: (teacher: RegisteredTeacher) => void;
}

export default function AdminModule({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  currentLoginUser,
  onSwitchToTeacherLogin
}: AdminModuleProps) {
  // Form State
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [discipline, setDiscipline] = useState("Língua Portuguesa");
  const [customDiscipline, setCustomDiscipline] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("all");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit Modal State
  const [editingTeacher, setEditingTeacher] = useState<RegisteredTeacher | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editDiscipline, setEditDiscipline] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  // Generate strong random password helper
  const handleGeneratePassword = () => {
    const prefixes = ["Prof", "Aprova", "Seduc", "Ceara", "Mestre", "Funece", "Idecan"];
    const numbers = Math.floor(1000 + Math.random() * 9000);
    const symbols = ["!", "@", "#", "$", "%", "*"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    setPassword(`${randomPrefix}${numbers}${randomSymbol}`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert("Por favor, digite o nome completo do professor.");
      return;
    }
    if (!password.trim()) {
      alert("Por favor, digite ou gere uma senha para o professor.");
      return;
    }

    const finalDiscipline = discipline === "Outra" ? (customDiscipline || "Geral") : discipline;

    onAddTeacher({
      fullName: fullName.trim(),
      password: password.trim(),
      discipline: finalDiscipline,
      status: status,
      notes: notes.trim()
    });

    setSuccessMessage(`Professor(a) ${fullName.trim()} cadastrado(a) com sucesso!`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset Form
    setFullName("");
    setPassword("");
    setNotes("");
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (teacher: RegisteredTeacher) => {
    const text = `🎓 *CONVITE DE ACESSO - PLATAFORMA IA APROVA 2026*\n\nOlá, Prof. ${teacher.fullName}!\nSeu cadastro no sistema preparatório para o Concurso SEDUC-CE foi liberado.\n\n👤 *Nome Completo:* ${teacher.fullName}\n🔑 *Senha de Acesso:* ${teacher.password}\n📚 *Disciplina:* ${teacher.discipline}\n\nBons estudos e excelente preparação!`;
    
    navigator.clipboard.writeText(text);
    setCopiedId(teacher.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleOpenEdit = (teacher: RegisteredTeacher) => {
    setEditingTeacher(teacher);
    setEditPassword(teacher.password);
    setEditDiscipline(teacher.discipline);
    setEditStatus(teacher.status);
  };

  const handleSaveEdit = () => {
    if (!editingTeacher) return;
    onUpdateTeacher(editingTeacher.id, {
      password: editPassword,
      discipline: editDiscipline,
      status: editStatus
    });
    setEditingTeacher(null);
    setSuccessMessage("Dados do professor atualizados com sucesso!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Filtered teachers
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.discipline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDisc = filterDiscipline === "all" || t.discipline === filterDiscipline;
    return matchesSearch && matchesDisc;
  });

  const activeCount = teachers.filter(t => t.status === "active").length;
  const uniqueDisciplines = Array.from(new Set(teachers.map(t => t.discipline)));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-widest font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Painel do Administrador
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-700">
                Acesso Master
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gestão de Professores & Credenciais
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Cadastre novos professores para liberá-los na plataforma. Defina o nome completo e a senha de acesso para que eles possam utilizar os simulados, inteligência artificial e cronograma personalizado.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Professores Cadastrados</p>
              <p className="text-2xl font-black text-white">{teachers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between gap-3 font-semibold text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Form on Left, List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Registration Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  Cadastrar Novo Professor
                </h2>
                <p className="text-slate-400 text-xs">
                  Informe o nome e defina a senha de login
                </p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nome Completo do Professor *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Prof. Carlos Eduardo de Souza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Senha de Acesso *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/70 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Gerar Senha
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Prof2026!"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-2xl px-4 py-3 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                  />
                  <div className="absolute right-3 top-3 text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Discipline Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Disciplina Principal
                </label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none"
                >
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Matemática">Matemática</option>
                  <option value="História">História</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Biologia">Biologia</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                  <option value="Sociologia">Sociologia</option>
                  <option value="Filosofia">Filosofia</option>
                  <option value="Pedagogia / Conhecimentos Pedagógicos">Pedagogia / Conhecimentos Pedagógicos</option>
                  <option value="Outra">Outra Disciplina...</option>
                </select>
              </div>

              {discipline === "Outra" && (
                <div>
                  <input
                    type="text"
                    placeholder="Especifique a disciplina..."
                    value={customDiscipline}
                    onChange={(e) => setCustomDiscipline(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Status da Conta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("active")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      status === "active"
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Ativo
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("inactive")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      status === "inactive"
                        ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Inativo
                  </button>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Observações / Turma (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Polo Juazeiro - Turma SEDUC 2026"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4" />
                Cadastrar Professor
              </button>
            </form>
          </div>

          {/* Master Admin Security Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Acesso de Acompanhamento</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Os professores cadastrados aqui poderão entrar na plataforma informando o seu <strong>Nome Completo</strong> e a <strong>Senha</strong> definida no cadastro.
            </p>
          </div>
        </div>

        {/* Teachers List Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* List Header and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Professores Cadastrados ({teachers.length})
                </h2>
                <p className="text-slate-400 text-xs">
                  {activeCount} ativos • {uniqueDisciplines.length} disciplinas
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar por nome ou matéria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Teachers List / Cards */}
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-700 font-bold text-sm">Nenhum professor encontrado</p>
                <p className="text-slate-400 text-xs mt-1">
                  {searchTerm ? "Tente buscar com outro termo." : "Cadastre o primeiro professor utilizando o formulário ao lado."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTeachers.map((teacher) => {
                  const isVisible = showPasswords[teacher.id];
                  const isCopied = copiedId === teacher.id;

                  return (
                    <motion.div
                      key={teacher.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-200">
                            {teacher.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                {teacher.fullName}
                              </h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                teacher.status === "active" 
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}>
                                {teacher.status === "active" ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {teacher.discipline}
                              </span>
                              <span>•</span>
                              <span className="text-slate-400">
                                Cadastrado em {new Date(teacher.createdAt).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => handleCopyCredentials(teacher)}
                            title="Copiar Convite Pronto"
                            className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isCopied
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                            }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[11px]">{isCopied ? "Copiado!" : "Copiar"}</span>
                          </button>

                          <button
                            onClick={() => handleOpenEdit(teacher)}
                            title="Editar Professor"
                            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Tem certeza que deseja remover o cadastro do professor(a) ${teacher.fullName}?`)) {
                                onDeleteTeacher(teacher.id);
                              }
                            }}
                            title="Excluir Cadastro"
                            className="p-2 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Password Info Box */}
                      <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Key className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-500 font-medium">Senha:</span>
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                            {isVisible ? teacher.password : "••••••••"}
                          </span>
                        </div>

                        <button
                          onClick={() => togglePasswordVisibility(teacher.id)}
                          className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isVisible ? "Ocultar" : "Mostrar"}</span>
                        </button>
                      </div>

                      {teacher.notes && (
                        <p className="text-[11px] text-slate-500 bg-amber-50/60 border border-amber-100/80 rounded-lg px-3 py-1.5 italic">
                          📝 {teacher.notes}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-slate-900 text-base">
                Editar Cadastro: {editingTeacher.fullName}
              </h3>
              <button
                onClick={() => setEditingTeacher(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nova Senha de Acesso
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Disciplina Principal
                </label>
                <input
                  type="text"
                  value={editDiscipline}
                  onChange={(e) => setEditDiscipline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
