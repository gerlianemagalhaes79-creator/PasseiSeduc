import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { 
  Users, 
  Key, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  Sparkles, 
  Copy, 
  TrendingUp, 
  Ticket,
  UserCheck,
  UserX,
  RefreshCw
} from "lucide-react";

interface AdminUser {
  uid: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  redeemedKey?: string;
}

interface AdminKey {
  id: string;
  key: string;
  status: "unused" | "redeemed";
  redeemedBy?: string;
  redeemedAt?: string;
  createdAt: string;
}

export default function AdminPanelModule() {
  const [activeTab, setActiveTab] = useState<"users" | "keys">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingKeys, setLoadingKeys] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Key Generation State
  const [numKeysToGenerate, setNumKeysToGenerate] = useState<number>(1);
  const [generating, setGenerating] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const q = query(collection(db, "users"));
      const snapshot = await getDocs(q);
      const list: AdminUser[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          uid: docSnap.id,
          email: data.email || "",
          role: data.role || "student",
          status: data.status || "pending",
          createdAt: data.createdAt,
          redeemedKey: data.redeemedKey,
        });
      });
      setUsers(list);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchKeys = async () => {
    setLoadingKeys(true);
    try {
      const q = query(collection(db, "licenseKeys"));
      const snapshot = await getDocs(q);
      const list: AdminKey[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          key: data.key || docSnap.id,
          status: data.status || "unused",
          redeemedBy: data.redeemedBy,
          redeemedAt: data.redeemedAt,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      // Sort keys: unused first, then by creation date
      list.sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "unused" ? -1 : 1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setKeys(list);
    } catch (err) {
      console.error("Error fetching keys:", err);
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchKeys();
  }, []);

  const handleToggleStatus = async (uid: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "pending" : "active";
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { status: newStatus });
      
      // Update local state
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const handleToggleRole = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { role: newRole });
      
      // Update local state
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const generateKeys = async () => {
    setGenerating(true);
    try {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      
      const newCreatedKeys: AdminKey[] = [];

      for (let i = 0; i < numKeysToGenerate; i++) {
        const generatedKey = `APROVA-${segment()}-${segment()}-${segment()}`;
        const keyRef = doc(db, "licenseKeys", generatedKey);
        
        const keyData = {
          key: generatedKey,
          status: "unused",
          createdAt: new Date().toISOString(),
        };

        await setDoc(keyRef, keyData);
        newCreatedKeys.push({
          id: generatedKey,
          ...keyData,
          status: "unused",
        });
      }

      // Prepend to keys list
      setKeys(prev => [...newCreatedKeys, ...prev]);
      setNumKeysToGenerate(1);
    } catch (err) {
      console.error("Error generating keys:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!window.confirm("Deseja realmente excluir esta chave de acesso?")) return;
    try {
      await deleteDoc(doc(db, "licenseKeys", keyId));
      setKeys(prev => prev.filter(k => k.id !== keyId));
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  };

  const handleCopyKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopySuccess(keyText);
    setTimeout(() => {
      setCopySuccess(null);
    }, 1500);
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.uid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKeys = keys.filter(k => 
    k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (k.redeemedBy && k.redeemedBy.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const pendingUsers = users.filter(u => u.status === "pending").length;

  const totalKeys = keys.length;
  const unusedKeys = keys.filter(k => k.status === "unused").length;
  const redeemedKeys = keys.filter(k => k.status === "redeemed").length;

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="font-display font-black text-lg sm:text-xl tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Painel de Vendas &amp; Gestão Administrativa
          </h2>
          <p className="text-slate-400 text-xxs sm:text-xs mt-1">
            Aqui você gerencia quem tem acesso ao sistema e gera licenças de venda para seus alunos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchUsers(); fetchKeys(); }}
            className="flex items-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-750 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar Dados
          </button>
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <span className="text-xxs font-black text-slate-400 uppercase tracking-wider block">Total de Alunos</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">{totalUsers}</span>
            <Users className="w-4 h-4 text-slate-400 ml-auto" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <span className="text-xxs font-black text-slate-400 uppercase tracking-wider block">Acessos Ativos</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-emerald-600">{activeUsers}</span>
            <span className="text-[10px] text-slate-400">Ativados</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <span className="text-xxs font-black text-slate-400 uppercase tracking-wider block">Chaves Criadas</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-indigo-600">{totalKeys}</span>
            <Ticket className="w-4 h-4 text-slate-400 ml-auto" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <span className="text-xxs font-black text-slate-400 uppercase tracking-wider block">Chaves Disponíveis</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl sm:text-2xl font-bold text-amber-600">{unusedKeys}</span>
            <span className="text-[10px] text-slate-400">Para Venda</span>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <div className="grid grid-cols-2 bg-slate-50 p-1 rounded-xl border border-slate-100 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab("users"); setSearchQuery(""); }}
              className={`py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "users" 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Alunos ({totalUsers})
            </button>
            <button
              onClick={() => { setActiveTab("keys"); setSearchQuery(""); }}
              className={`py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "keys" 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Chaves de Acesso ({unusedKeys})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none h-full w-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "users" ? "Buscar por e-mail..." : "Buscar chave ou e-mail..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {activeTab === "users" ? (
          /* USERS MANAGEMENT */
          <div className="space-y-4">
            {loadingUsers ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                <span className="text-xs">Carregando lista de alunos...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs font-semibold">Nenhum aluno encontrado</p>
                <p className="text-xxs mt-0.5">Certifique-se de que os termos de busca estão corretos.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black text-xxs uppercase tracking-wider">
                      <th className="py-3 px-4 font-black">E-mail do Aluno</th>
                      <th className="py-3 px-4 font-black">Status</th>
                      <th className="py-3 px-4 font-black">Função</th>
                      <th className="py-3 px-4 font-black">Chave Utilizada</th>
                      <th className="py-3 px-4 font-black text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {filteredUsers.map((user) => (
                      <tr key={user.uid} className="hover:bg-slate-50/40">
                        <td className="py-3 px-4 font-bold text-slate-800">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                              : "bg-amber-50 text-amber-700 border border-amber-100/50"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                            {user.status === "active" ? "Ativo" : "Pendente"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                            user.role === "admin"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                          {user.redeemedKey ? (
                            <span className="text-indigo-600 bg-indigo-50/50 py-0.5 px-1.5 rounded border border-indigo-100/30">
                              {user.redeemedKey}
                            </span>
                          ) : (
                            "Nenhuma (Manual/Admin)"
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {/* Toggle role admin/student */}
                          <button
                            onClick={() => handleToggleRole(user.uid, user.role)}
                            className="px-2 py-1 bg-slate-50 hover:bg-slate-150 rounded-lg text-[10px] font-bold text-slate-600 transition-all cursor-pointer"
                          >
                            Tornar {user.role === "admin" ? "Aluno" : "Admin"}
                          </button>

                          {/* Toggle active/pending */}
                          <button
                            onClick={() => handleToggleStatus(user.uid, user.status)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              user.status === "active"
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-750"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="w-3.5 h-3.5" />
                                Bloquear
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Liberar
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* LICENSE KEYS MANAGEMENT */
          <div className="space-y-6">
            {/* Generate form */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-800">Gerador de Licenças / Cupom de Vendas</h4>
                <p className="text-xxs text-slate-500">Gere códigos aleatórios seguros que seus clientes utilizarão para validar o login.</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <label className="text-xxs font-black text-slate-400 uppercase shrink-0">Quantidade:</label>
                <select
                  value={numKeysToGenerate}
                  onChange={(e) => setNumKeysToGenerate(Number(e.target.value))}
                  className="bg-white border border-slate-100 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  {[1, 2, 5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>

                <button
                  onClick={generateKeys}
                  disabled={generating}
                  className="flex items-center gap-1.5 py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shrink-0 shadow-xs"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Gerar Licença(s)
                    </>
                  )}
                </button>
              </div>
            </div>

            {loadingKeys ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                <span className="text-xs">Carregando chaves de acesso...</span>
              </div>
            ) : filteredKeys.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-xs font-semibold">Nenhuma chave de acesso encontrada</p>
                <p className="text-xxs mt-0.5">Gere chaves no formulário acima para disponibilizar para seus alunos.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black text-xxs uppercase tracking-wider">
                      <th className="py-3 px-4 font-black">Chave Licenciada</th>
                      <th className="py-3 px-4 font-black">Status</th>
                      <th className="py-3 px-4 font-black">Redimida por</th>
                      <th className="py-3 px-4 font-black">Data de Criação</th>
                      <th className="py-3 px-4 font-black text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {filteredKeys.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50/40">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 py-1 px-2.5 rounded-lg border border-slate-200/55 select-all">
                            {k.key}
                          </span>
                          <button
                            onClick={() => handleCopyKey(k.key)}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition-all cursor-pointer"
                            title="Copiar Chave"
                          >
                            {copySuccess === k.key ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            k.status === "unused"
                              ? "bg-amber-50 text-amber-700 border border-amber-100/50"
                              : "bg-slate-100 text-slate-500 border border-slate-200/50"
                          }`}>
                            {k.status === "unused" ? "Disponível" : "Resgatada"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-semibold">
                          {k.redeemedBy ? (
                            <span className="text-indigo-600 font-medium">{k.redeemedBy}</span>
                          ) : (
                            <span className="text-slate-400 italic font-normal">Aguardando uso...</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xxs">
                          {new Date(k.createdAt).toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteKey(k.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg transition-all cursor-pointer inline-flex items-center"
                            title="Excluir Chave"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
