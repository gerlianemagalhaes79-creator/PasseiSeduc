import React, { useState } from "react";
import { RegisteredTeacher, SystemUserSession } from "../types";
import { 
  ShieldCheck, 
  GraduationCap, 
  Key, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: RegisteredTeacher[];
  onLoginSuccess: (session: SystemUserSession) => void;
}

export default function UserAuthModal({
  isOpen,
  onClose,
  teachers,
  onLoginSuccess
}: UserAuthModalProps) {
  const [authMode, setAuthMode] = useState<"teacher" | "admin">("teacher");
  
  // Teacher Login Form
  const [fullNameInput, setFullNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Admin Login Form
  const [adminPassInput, setAdminPassInput] = useState("");

  if (!isOpen) return null;

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nameTrimmed = fullNameInput.trim().toLowerCase();
    const passTrimmed = passwordInput.trim();

    if (!nameTrimmed || !passTrimmed) {
      setErrorMessage("Por favor, preencha o seu nome completo e a senha de acesso.");
      return;
    }

    // Match teacher
    const teacherMatch = teachers.find(t => 
      t.fullName.trim().toLowerCase() === nameTrimmed && 
      t.password.trim() === passTrimmed
    );

    if (!teacherMatch) {
      setErrorMessage("Nome completo ou senha incorretos. Solicite suas credenciais ao administrador.");
      return;
    }

    if (teacherMatch.status === "inactive") {
      setErrorMessage("Este perfil de professor encontra-se inativo no momento. Entre em contato com o administrador.");
      return;
    }

    // Success login
    onLoginSuccess({
      role: "teacher",
      fullName: teacherMatch.fullName,
      id: teacherMatch.id,
      discipline: teacherMatch.discipline
    });
    
    // Reset and close
    setFullNameInput("");
    setPasswordInput("");
    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Default admin pass can be 'admin', 'admin123' or '2026'
    if (adminPassInput.trim() === "admin" || adminPassInput.trim() === "admin123" || adminPassInput.trim() === "2026") {
      onLoginSuccess({
        role: "admin",
        fullName: "Administrador do Sistema"
      });
      setAdminPassInput("");
      onClose();
    } else {
      setErrorMessage("Senha de Administrador incorreta.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-full font-bold text-sm cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Acesso ao Sistema
            </span>
          </div>
          <h2 className="font-display font-black text-xl text-white">
            Identificação do Usuário
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            Entre com suas credenciais de professor ou acesse o painel de administração
          </p>

          {/* Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-5 bg-white/10 p-1 rounded-2xl backdrop-blur-xs">
            <button
              onClick={() => {
                setAuthMode("teacher");
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "teacher"
                  ? "bg-emerald-500 text-white shadow-xs font-extrabold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Sou Professor
            </button>

            <button
              onClick={() => {
                setAuthMode("admin");
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "admin"
                  ? "bg-slate-800 text-white shadow-xs font-extrabold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Administrador
            </button>
          </div>
        </div>

        {/* Modal Body Forms */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === "teacher" ? (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nome Completo do Professor *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Digite seu nome conforme cadastrado"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Senha de Acesso *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Sua senha fornecida pelo administrador"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none transition-all"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Acessar Minha Conta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Senha de Administrador Master *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Senha do Administrador (Padrão: admin)"
                    value={adminPassInput}
                    onChange={(e) => setAdminPassInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Dica de primeiro acesso: a senha padrão de administrador é <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono font-bold">admin</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Entrar no Painel do Administrador</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
