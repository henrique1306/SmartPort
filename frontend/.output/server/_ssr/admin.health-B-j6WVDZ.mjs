import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { h as getServicesStatus } from "./router-BX4KwRac.mjs";
import { S as Spinner } from "./Spinner-B1zlDuBq.mjs";
import "../_libs/sonner.mjs";
import { R as RefreshCw, l as RefreshCcw, m as Cpu, j as Camera, n as Server } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
const ICONS = {
  camera: Camera,
  arduino: Cpu,
  syncer: RefreshCcw
};
function HealthPage() {
  const [status, setStatus] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const load = async () => {
    setLoading(true);
    try {
      setStatus(await getServicesStatus());
      setError(null);
    } catch (e) {
      setError(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
    const id = setInterval(load, 1e4);
    return () => clearInterval(id);
  }, []);
  const entries = Object.entries(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Saúde do Sistema" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Status dos microsserviços (atualiza a cada 10s)." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: load, className: "glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/70 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }),
        " Atualizar"
      ] })
    ] }),
    loading && entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-10 w-10" }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: entries.map(([name, s]) => {
      const online = String(s).toLowerCase() === "online";
      const Icon = ICONS[name] ?? Server;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-green flex h-12 w-12 items-center justify-center rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold capitalize", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs font-medium ${online ? "text-success" : "text-destructive"}`, children: online ? "Online" : "Offline" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-3.5 w-3.5 rounded-full ${online ? "bg-success shadow-[0_0_12px_var(--success)]" : "bg-destructive animate-pulse"}` })
      ] }, name);
    }) })
  ] });
}
export {
  HealthPage as component
};
