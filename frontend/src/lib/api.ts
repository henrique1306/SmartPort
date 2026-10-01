export const GATEWAY_URL = "http://localhost:3000";
export const API_BASE = `${GATEWAY_URL}/api`;
export const STREAM_URL = `${API_BASE}/stream/video`;
export const TOKEN_KEY = "token";

export interface AccessRecord {
  id?: string | number;
  placa?: string;
  nome_condutor?: string;
  autorizado?: boolean;
  status?: string;
  data_hora?: string;
  timestamp?: string;
  [k: string]: any;
}

export interface Veiculo {
  id: string;
  placa: string;
  nome_condutor: string;
  autorizado: boolean;
  [k: string]: any;
}

export interface SystemConfig {
  modo_operacao: "AUTOMATICO" | "MANUAL" | "INATIVO";
  distancia_gatilho: number;
  camera_tipo: "RTSP" | "LOCAL";
  camera_url: string;
  ia_modo: "AWS" | "IA_LOCAL" | "IA_REDE";
  ia_ip_remoto: string;
  arduino_origem: "SERIAL" | "API_REQUESTS";
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Fetch autenticado: sempre injeta Authorization: Bearer <token>. */
export async function authFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { cache: "no-store", ...init, headers });
  } catch {
    throw new Error("Não foi possível conectar ao Gateway (localhost:3000).");
  }
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
    throw new Error("Sessão expirada.");
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Erro ${res.status}`);
  }
  return res.json().catch(() => ({}));
}

export async function login(username: string, password: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("Não foi possível conectar ao Gateway.");
  }
  if (!res.ok) throw new Error("Usuário ou senha inválidos.");
  const data = await res.json();
  if (!data?.access_token) throw new Error("Resposta sem token.");
  localStorage.setItem(TOKEN_KEY, data.access_token);
  return data.access_token;
}

export const recordPhotoUrl = (id: string | number) => `${API_BASE}/records/${id}/foto`;

export async function getRecords(): Promise<AccessRecord[]> {
  const d = await authFetch("/records");
  return Array.isArray(d) ? d : Array.isArray(d?.records) ? d.records : [];
}

export async function getVeiculos(): Promise<Veiculo[]> {
  const d = await authFetch("/veiculos_autorizados");
  const arr = Array.isArray(d) ? d : [];
  return arr.map((v: any) => ({ ...v, id: String(v.id ?? v.id_firebase ?? v._id) }));
}

export const cadastrarVeiculo = (p: { placa: string; nome_condutor: string; autorizado: boolean }) =>
  authFetch("/veiculos_autorizados", { method: "POST", body: JSON.stringify(p) });

export const atualizarVeiculo = (
  id: string,
  p: Partial<{ placa: string; nome_condutor: string; autorizado: boolean }>,
) => authFetch(`/veiculos_autorizados/${id}`, { method: "PUT", body: JSON.stringify(p) });

export const excluirVeiculo = (id: string) =>
  authFetch(`/veiculos_autorizados/${id}`, { method: "DELETE" });

export const LIBERAR_PASSAGEM_VAR = "liberar_passagem";

export async function liberarPassagem() {
  await authFetch("/liberar_passagem", {
    method: "POST",
    body: JSON.stringify({ [LIBERAR_PASSAGEM_VAR]: true }),
  });
  return { variavel: LIBERAR_PASSAGEM_VAR, valor: true };
}

export const getConfig = (): Promise<Partial<SystemConfig>> => authFetch("/config");
export const saveConfig = (c: SystemConfig) =>
  authFetch("/config", { method: "POST", body: JSON.stringify(c) });

export const getServicesStatus = (): Promise<Record<string, string>> =>
  authFetch("/services/status");

export function isAuthorized(r: AccessRecord) {
  if (typeof r.autorizado === "boolean") return r.autorizado;
  const s = (r.status || "").toString().toLowerCase();
  return s.includes("liber") || s.includes("autoriz") || s === "ok";
}

export function formatDate(r: AccessRecord) {
  const raw = r.data_hora || r.timestamp || r.createdAt;
  if (!raw) return "—";
  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(raw) : d.toLocaleString("pt-BR");
}
