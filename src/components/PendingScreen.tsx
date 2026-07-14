import React, { useState } from "react";
import { 
  db, 
  auth 
} from "../lib/firebase";
import { 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  updateDoc 
} from "firebase/firestore";
import { 
  LockKeyhole, 
  Key, 
  Loader2, 
  LogOut, 
  MessageSquare, 
  AlertCircle, 
  Sparkles,
  HelpCircle,
  TrendingUp,
  CheckCircle
} from "lucide-react";

interface PendingScreenProps {
  user: { uid: string; email: string; role: string; status: string };
  onActivationSuccess: () => void;
  onLogout: () => void;
}

export default function PendingScreen({ user, onActivationSuccess, onLogout }: PendingScreenProps) {
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedKey = licenseKey.trim();

    if (!trimmedKey) {
      setError("Por favor, insira uma chave de acesso.");
      setLoading(false);
      return;
    }

    try {
      // Fetch key from Firestore
      const keyDocRef = doc(db, "licenseKeys", trimmedKey);
      const keySnap = await getDoc(keyDocRef);

      if (!keySnap.exists()) {
        setError("Chave de acesso inválida ou inexistente. Por favor, verifique se digitou corretamente.");
        setLoading(false);
        return;
      }

      const keyData = keySnap.data();
      if (keyData.status !== "unused") {
        setError("Esta chave de acesso já foi resgatada por outro usuário.");
        setLoading(false);
        return;
      }

      // Key is valid! Update the key document
      await updateDoc(keyDocRef, {
        status: "redeemed",
        redeemedBy: user.email,
        redeemedAt: new Date().toISOString(),
      });

      // Update user document
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        status: "active",
        redeemedKey: trimmedKey,
        activatedAt: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        onActivationSuccess();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError("Erro ao processar chave de acesso. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Animated padlock icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-white shadow-md mb-4 relative">
          <LockKeyhole className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
        </div>
        
        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
          Acesso Restrito
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Sua conta <span className="font-semibold text-slate-700">{user.email}</span> foi criada com sucesso, mas o acesso ainda não está liberado.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Key Redemption Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-100 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-slate-800">Possui uma Chave de Acesso?</h3>
            <p className="text-xxs text-slate-400 leading-normal">
              Insira o código de ativação recebido no momento da compra para liberar seu acesso instantaneamente.
            </p>
          </div>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <label className="block text-xxs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Chave de Ativação / Licença
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="DIGITE OU COLE SUA CHAVE..."
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono uppercase"
                  disabled={loading || success}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-850 text-xxs rounded-xl p-3 flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-850 text-xxs rounded-xl p-3 flex gap-2.5 items-start">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">Chave de acesso validada! Liberando acesso...</p>
              </div>
            )}

            {/* Redeem Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validando Chave...
                </>
              ) : success ? (
                "Acesso Liberado!"
              ) : (
                <>
                  Ativar Conta Agora
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Support / Purchase CTA card */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-md relative overflow-hidden">
          {/* Subtle glowing shape */}
          <div className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-emerald-500/20 blur-xl"></div>
          
          <div className="space-y-1.5 relative z-10">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-emerald-400">Não tem uma chave?</h4>
            <h3 className="font-semibold text-sm leading-snug">Adquira seu acesso ao Aprova Professor</h3>
            <p className="text-slate-400 text-xxs leading-relaxed">
              Destaque-se no concurso Seduc-CE com estudos focados em editais específicos, inteligência artificial integrada, flashcards inteligentes e simulados de provas reais.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 relative z-10">
            <a
              href="https://wa.me/5588999999999?text=Quero%20adquirir%20o%20acesso%20ao%20Aprova%20Professor!"
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all text-center shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              Comprar por WhatsApp
            </a>
          </div>
        </div>

        {/* Change account / Logout Option */}
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 text-xxs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair ou Usar Outra Conta
          </button>
        </div>
      </div>
    </div>
  );
}
