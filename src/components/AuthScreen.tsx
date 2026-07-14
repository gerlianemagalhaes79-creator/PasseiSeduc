import React, { useState } from "react";
import { 
  auth, 
  db 
} from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";
import { 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Key, 
  GraduationCap, 
  AlertCircle,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";

interface AuthScreenProps {
  onAuthSuccess: (userData: { uid: string; email: string; role: string; status: string }) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedKey = licenseKey.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const uid = userCredential.user.uid;
        
        // Fetch user metadata from Firestore
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          onAuthSuccess({
            uid,
            email: trimmedEmail,
            role: data.role || "student",
            status: data.status || "pending",
          });
        } else {
          // If Firestore document doesn't exist for some reason, create it
          const isMasterAdmin = trimmedEmail.toLowerCase() === "gerlianemagalhaes79@gmail.com";
          const defaultRole = isMasterAdmin ? "admin" : "student";
          const defaultStatus = isMasterAdmin ? "active" : "pending";
          
          await setDoc(userDocRef, {
            uid,
            email: trimmedEmail,
            role: defaultRole,
            status: defaultStatus,
            createdAt: new Date().toISOString(),
          });

          onAuthSuccess({
            uid,
            email: trimmedEmail,
            role: defaultRole,
            status: defaultStatus,
          });
        }
      } else {
        // --- SIGN UP / REGISTER FLOW ---
        if (trimmedPassword.length < 6) {
          setError("A senha deve ter pelo menos 6 caracteres.");
          setLoading(false);
          return;
        }

        // Check license key validity if provided
        let isKeyValid = false;
        let keyDocRef: any = null;

        if (trimmedKey) {
          keyDocRef = doc(db, "licenseKeys", trimmedKey);
          const keySnap = await getDoc(keyDocRef);
          
          if (!keySnap.exists()) {
            setError("Chave de acesso inválida ou inexistente.");
            setLoading(false);
            return;
          }

          const keyData = keySnap.data() as any;
          if (keyData && keyData.status !== "unused") {
            setError("Esta chave de acesso já foi resgatada.");
            setLoading(false);
            return;
          }
          isKeyValid = true;
        }

        // Create user authentication record
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const uid = userCredential.user.uid;

        // Determine initial role and status
        const isMasterAdmin = trimmedEmail.toLowerCase() === "gerlianemagalhaes79@gmail.com";
        const initialRole = isMasterAdmin ? "admin" : "student";
        const initialStatus = (isMasterAdmin || isKeyValid) ? "active" : "pending";

        // Save profile in Firestore
        await setDoc(doc(db, "users", uid), {
          uid,
          email: trimmedEmail,
          role: initialRole,
          status: initialStatus,
          createdAt: new Date().toISOString(),
          redeemedKey: isKeyValid ? trimmedKey : null,
        });

        // Mark license key as redeemed if used
        if (isKeyValid && keyDocRef) {
          await updateDoc(keyDocRef, {
            status: "redeemed",
            redeemedBy: trimmedEmail,
            redeemedAt: new Date().toISOString(),
          });
        }

        setSuccessMsg(
          isKeyValid 
            ? "Cadastro realizado com sucesso! Sua conta foi ativada automaticamente com a chave de acesso."
            : "Cadastro realizado com sucesso! Sua conta está aguardando liberação de acesso."
        );

        // Auto-login after registration
        setTimeout(() => {
          onAuthSuccess({
            uid,
            email: trimmedEmail,
            role: initialRole,
            status: initialStatus,
          });
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso por outro cadastro.");
      } else if (err.code === "auth/invalid-email") {
        setError("O endereço de e-mail inserido é inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha é muito fraca. Escolha outra mais forte.");
      } else if (err.code === "auth/invalid-credential") {
        setError("E-mail ou senha incorretos.");
      } else {
        setError(`Ocorreu um erro ao realizar a autenticação: ${err.message || err.code || err}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-sm mb-4">
          <GraduationCap className="w-6 h-6" />
        </div>
        
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Aprova Professor
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Sistema de preparação de alto rendimento para concursos do magistério.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          {/* Tabs */}
          <div className="grid grid-cols-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100/60">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isLogin 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isLogin 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xxs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Endereço de E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xxs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Optional License Key field (Only on registration) */}
            {!isLogin && (
              <div className="pt-1.5 border-t border-slate-50 mt-3">
                <label className="flex items-center justify-between block text-xxs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  <span>Chave de Acesso (Opcional)</span>
                  <span className="text-[9px] font-bold text-emerald-600 tracking-normal lowercase italic">Ativação instantânea</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    placeholder="Cole sua chave de acesso aqui..."
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono uppercase"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-850 text-xxs rounded-xl p-3 flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-850 text-xxs rounded-xl p-3 flex gap-2.5 items-start">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{successMsg}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  {isLogin ? "Acessar Plataforma" : "Criar Minha Conta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Value proposition for potential buyers */}
          <div className="pt-4 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-medium">
              Ao adquirir o acesso, você desbloqueia o Guia Completo do Edital, Simulador de Provas Oficial, Mentor IA exclusivo e muito mais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
