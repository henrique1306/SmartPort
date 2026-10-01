import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { H as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import "../_libs/react-dom.mjs";

import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";



import "../_libs/seroval-plugins.mjs";

const appCss = "/assets/styles-DjXZ4zOt.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-10 max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Página não encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
        children: "Voltar ao monitor"
      }
    )
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-10 max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "mt-6 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
        children: "Tentar novamente"
      }
    )
  ] }) });
}
const Route$7 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SmartPort" },
      { name: "description", content: "Monitor de acesso veicular em tempo real" },
      { property: "og:title", content: "SmartPort" },
      { name: "twitter:title", content: "SmartPort" },
      { property: "og:description", content: "Monitor de acesso veicular em tempo real" },
      { name: "twitter:description", content: "Monitor de acesso veicular em tempo real" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0c0786a7-0ffd-4726-8122-159f67f59a6d/id-preview-bc0d490f--a0bbca92-921b-47ab-af46-283cbad3a93f.lovable.app-1780099271601.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0c0786a7-0ffd-4726-8122-159f67f59a6d/id-preview-bc0d490f--a0bbca92-921b-47ab-af46-283cbad3a93f.lovable.app-1780099271601.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$7.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", richColors: true })
  ] });
}
const $$splitComponentImporter$6 = () => import("./login-ZzNt2wXO.mjs");
const Route$6 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login Admin — SmartPort"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const GATEWAY_URL = "http://localhost:3000";
const API_BASE = `${GATEWAY_URL}/api`;
const STREAM_URL = `${API_BASE}/stream/video`;
const TOKEN_KEY = "token";
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
async function authFetch(path, init = {}) {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  let res;
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
async function login(username, password) {
  let res;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
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
const recordPhotoUrl = (id) => `${API_BASE}/records/${id}/foto`;
async function getRecords() {
  const d = await authFetch("/records");
  return Array.isArray(d) ? d : Array.isArray(d?.records) ? d.records : [];
}
async function getVeiculos() {
  const d = await authFetch("/veiculos_autorizados");
  const arr = Array.isArray(d) ? d : [];
  return arr.map((v) => ({ ...v, id: String(v.id ?? v.id_firebase ?? v._id) }));
}
const cadastrarVeiculo = (p) => authFetch("/veiculos_autorizados", { method: "POST", body: JSON.stringify(p) });
const atualizarVeiculo = (id, p) => authFetch(`/veiculos_autorizados/${id}`, { method: "PUT", body: JSON.stringify(p) });
const excluirVeiculo = (id) => authFetch(`/veiculos_autorizados/${id}`, { method: "DELETE" });
const LIBERAR_PASSAGEM_VAR = "liberar_passagem";
async function liberarPassagem() {
  await authFetch("/liberar_passagem", {
    method: "POST",
    body: JSON.stringify({ [LIBERAR_PASSAGEM_VAR]: true })
  });
  return { variavel: LIBERAR_PASSAGEM_VAR, valor: true };
}
const getConfig = () => authFetch("/config");
const saveConfig = (c) => authFetch("/config", { method: "POST", body: JSON.stringify(c) });
const getServicesStatus = () => authFetch("/services/status");
function isAuthorized(r) {
  if (typeof r.autorizado === "boolean") return r.autorizado;
  const s = (r.status || "").toString().toLowerCase();
  return s.includes("liber") || s.includes("autoriz") || s === "ok";
}
function formatDate(r) {
  const raw = r.data_hora || r.timestamp || r.createdAt;
  if (!raw) return "—";
  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(raw) : d.toLocaleString("pt-BR");
}
const auth = {
  login,
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
  isAuthed() {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
const $$splitComponentImporter$5 = () => import("./admin-BTCT_S6S.mjs");
const Route$5 = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: () => {
    if (!auth.isAuthed()) throw redirect({
      to: "/login"
    });
  },
  head: () => ({
    meta: [{
      title: "Painel Admin — SmartPort"
    }, {
      name: "description",
      content: "Painel administrativo do SmartPort."
    }, {
      property: "og:title",
      content: "Painel Admin — SmartPort"
    }, {
      property: "og:description",
      content: "Painel administrativo do SmartPort."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-DNcHD0vy.mjs");
const Route$4 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Monitor de Acesso — SmartPort"
    }, {
      name: "description",
      content: "Transmissão ao vivo e acessos veiculares em tempo real."
    }, {
      property: "og:title",
      content: "Monitor de Acesso — SmartPort"
    }, {
      property: "og:description",
      content: "Transmissão ao vivo e acessos veiculares em tempo real."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.index-DWix4WYX.mjs");
const Route$3 = createFileRoute("/admin/")({
  head: () => ({
    meta: [{
      title: "Visão Geral — SmartPort"
    }, {
      name: "description",
      content: "Histórico de acessos e liberação manual da cancela."
    }, {
      property: "og:title",
      content: "Visão Geral — SmartPort"
    }, {
      property: "og:description",
      content: "Histórico de acessos e liberação manual da cancela."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.veiculos-Dr1qV0-f.mjs");
const Route$2 = createFileRoute("/admin/veiculos")({
  head: () => ({
    meta: [{
      title: "Gestão de Veículos — SmartPort"
    }, {
      name: "description",
      content: "Cadastre, edite e remova veículos autorizados."
    }, {
      property: "og:title",
      content: "Gestão de Veículos — SmartPort"
    }, {
      property: "og:description",
      content: "Cadastre, edite e remova veículos autorizados."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.health-B-j6WVDZ.mjs");
const Route$1 = createFileRoute("/admin/health")({
  head: () => ({
    meta: [{
      title: "Saúde do Sistema — SmartPort"
    }, {
      name: "description",
      content: "Status dos microsserviços do SmartPort."
    }, {
      property: "og:title",
      content: "Saúde do Sistema — SmartPort"
    }, {
      property: "og:description",
      content: "Status dos microsserviços do SmartPort."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.config-BfWhG0t2.mjs");
const Route = createFileRoute("/admin/config")({
  head: () => ({
    meta: [{
      title: "Configurações — SmartPort"
    }, {
      name: "description",
      content: "Parâmetros de hardware, câmera e IA do SmartPort."
    }, {
      property: "og:title",
      content: "Configurações — SmartPort"
    }, {
      property: "og:description",
      content: "Parâmetros de hardware, câmera e IA do SmartPort."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$7
});
const AdminRoute = Route$5.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$7
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const AdminIndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const AdminVeiculosRoute = Route$2.update({
  id: "/veiculos",
  path: "/veiculos",
  getParentRoute: () => AdminRoute
});
const AdminHealthRoute = Route$1.update({
  id: "/health",
  path: "/health",
  getParentRoute: () => AdminRoute
});
const AdminConfigRoute = Route.update({
  id: "/config",
  path: "/config",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminConfigRoute,
  AdminHealthRoute,
  AdminVeiculosRoute,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  LoginRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  GATEWAY_URL as G,
  LIBERAR_PASSAGEM_VAR as L,
  STREAM_URL as S,
  auth as a,
  getVeiculos as b,
  atualizarVeiculo as c,
  cadastrarVeiculo as d,
  excluirVeiculo as e,
  formatDate as f,
  getRecords as g,
  getServicesStatus as h,
  isAuthorized as i,
  getConfig as j,
  router as k,
  liberarPassagem as l,
  recordPhotoUrl as r,
  saveConfig as s
};
