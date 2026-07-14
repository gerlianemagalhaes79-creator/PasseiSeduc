import React, { useState } from "react";
import { 
  auth, 
  db 
} from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  deleteDoc
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const uid = user.uid;
      const userEmail = user.email || "";

      if (!userEmail) {
        throw new Error("Não foi possível obter o e-mail da sua conta Google.");
      }

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const isMasterAdmin = userEmail.toLowerCase() === "gerlianemagalhaes79@gmail.com";
        let role = data.role || "student";
        let status = data.status || "pending";

        if (isMasterAdmin && (role !== "admin" || status !== "active")) {
          role = "admin";
          status = "active";
          try {
            await updateDoc(userDocRef, { role: "admin", status: "active" });
          } catch (updateErr) {
            console.error("Erro ao atualizar status do administrador:", updateErr);
          }
        }

        onAuthSuccess({
          uid,
          email: userEmail,
          role,
          status,
        });
      } else {
        const q = query(collection(db, "users"), where("email", "==", userEmail.toLowerCase().trim()));
        const querySnapshot = await getDocs(q);
        
        let initialRole = "student";
        let initialStatus = "pending";
        let preApprovedDocIdToDelete: string | null = null;

        const isMasterAdmin = userEmail.toLowerCase() === "gerlianemagalhaes79@gmail.com";
        if (isMasterAdmin) {
          initialRole = "admin";
          initialStatus = "active";
        } else if (!querySnapshot.empty) {
          const preApprovedDoc = querySnapshot.docs[0];
          const preApprovedData = preApprovedDoc.data();
          initialRole = preApprovedData.role || "student";
          initialStatus = preApprovedData.status || "active";
          preApprovedDocIdToDelete = preApprovedDoc.id;
        }

        await setDoc(userDocRef, {
          uid,
          email: userEmail,
          role: initialRole,
          status: initialStatus,
          createdAt: new Date().toISOString(),
        });

        if (preApprovedDocIdToDelete && preApprovedDocIdToDelete !== uid) {
          try {
            await deleteDoc(doc(db, "users", preApprovedDocIdToDelete));
          } catch (deleteErr) {
            console.error("Erro ao deletar documento pré-aprovado temporário:", deleteErr);
          }
        }

        onAuthSuccess({
          uid,
          email: userEmail,
          role: initialRole,
          status: initialStatus,
        });
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-blocked") {
        setError("O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups para este site.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("O login com Google não está ativo. Ative-o na aba Sign-in Method do Firebase Console.");
      } else {
        setError(`Erro ao autenticar com o Google: ${err.message || err.code || err}`);
      }
    } finally {
      setLoading(false);
    }
  };

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
          const isMasterAdmin = trimmedEmail.toLowerCase() === "gerlianemagalhaes79@gmail.com";
          let role = data.role || "student";
          let status = data.status || "pending";

          if (isMasterAdmin && (role !== "admin" || status !== "active")) {
            role = "admin";
            status = "active";
            try {
              await updateDoc(userDocRef, { role: "admin", status: "active" });
            } catch (updateErr) {
              console.error("Erro ao atualizar status do administrador:", updateErr);
            }
          }

          onAuthSuccess({
            uid,
            email: trimmedEmail,
            role,
            status,
          });
        } else {
          // If Firestore document doesn't exist for some reason, check pre-approved lookup by email
          const q = query(collection(db, "users"), where("email", "==", trimmedEmail.toLowerCase()));
          const querySnapshot = await getDocs(q);
          
          let defaultRole = "student";
          let defaultStatus = "pending";
          let preApprovedDocIdToDelete: string | null = null;

          const isMasterAdmin = trimmedEmail.toLowerCase() === "gerlianemagalhaes79@gmail.com";
          if (isMasterAdmin) {
            defaultRole = "admin";
            defaultStatus = "active";
          } else if (!querySnapshot.empty) {
            const preApprovedDoc = querySnapshot.docs[0];
            const preApprovedData = preApprovedDoc.data();
            defaultRole = preApprovedData.role || "student";
            defaultStatus = preApprovedData.status || "active";
            preApprovedDocIdToDelete = preApprovedDoc.id;
          }

          await setDoc(userDocRef, {
            uid,
            email: trimmedEmail,
            role: defaultRole,
            status: defaultStatus,
            createdAt: new Date().toISOString(),
          });

          if (preApprovedDocIdToDelete && preApprovedDocIdToDelete !== uid) {
            try {
              await deleteDoc(doc(db, "users", preApprovedDocIdToDelete));
            } catch (deleteErr) {
              console.error(deleteErr);
            }
          }

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
        let initialRole = isMasterAdmin ? "admin" : "student";
        let initialStatus = (isMasterAdmin || isKeyValid) ? "active" : "pending";
        let preApprovedDocIdToDelete: string | null = null;

        if (!isMasterAdmin && !isKeyValid) {
          const q = query(collection(db, "users"), where("email", "==", trimmedEmail.toLowerCase()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const preApprovedDoc = querySnapshot.docs[0];
            const preApprovedData = preApprovedDoc.data();
            initialRole = preApprovedData.role || "student";
            initialStatus = preApprovedData.status || "active";
            preApprovedDocIdToDelete = preApprovedDoc.id;
          }
        }

        // Save profile in Firestore
        await setDoc(doc(db, "users", uid), {
          uid,
          email: trimmedEmail,
          role: initialRole,
          status: initialStatus,
          createdAt: new Date().toISOString(),
          redeemedKey: isKeyValid ? trimmedKey : null,
        });

        if (preApprovedDocIdToDelete && preApprovedDocIdToDelete !== uid) {
          try {
            await deleteDoc(doc(db, "users", preApprovedDocIdToDelete));
          } catch (deleteErr) {
            console.error(deleteErr);
          }
        }

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

          {/* Google Sign-In Section */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.28 1.845 15.548 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.338 0 10.55-4.46 10.55-10.74 0-.72-.08-1.27-.175-1.69h-10.375z"
                  />
                </svg>
              )}
              <span>Entrar com a Conta Google</span>
            </button>

            <div className="relative flex py-1 items-center font-bold text-xxs text-slate-400 uppercase tracking-widest justify-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 bg-white text-slate-400">Ou utilize seu e-mail</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>
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
