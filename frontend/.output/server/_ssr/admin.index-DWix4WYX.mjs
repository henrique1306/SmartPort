import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LIBERAR_PASSAGEM_VAR, i as isAuthorized, r as recordPhotoUrl, f as formatDate, l as liberarPassagem, g as getRecords } from "./router-BX4KwRac.mjs";
import { S as Spinner } from "./Spinner-B1zlDuBq.mjs";
import { S as SafeImage } from "./SafeImage-D0BKKou0.mjs";
import { D as DoorOpen, R as RefreshCw, e as Car, g as ShieldCheck, i as ShieldX } from "../_libs/lucide-react.mjs";

import "../_libs/react-dom.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
function Overview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LiberarPassagemCard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Historico, {})
  ] });
}
function LiberarPassagemCard() {
  const [sending, setSending] = reactExports.useState(false);
  const [hora, setHora] = reactExports.useState(null);
  const liberar = async () => {
    setSending(true);
    try {
      await liberarPassagem();
      setHora((/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR"));
      toast.success(`Passagem liberada — ${LIBERAR_PASSAGEM_VAR} = true`);
    } catch (e) {
      toast.error(e?.message || "Erro ao liberar a passagem.");
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-green flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DoorOpen, { className: "h-7 w-7 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: "Liberar passagem manual" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Abre a cancela enviando",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "glass rounded px-1.5 py-0.5 font-mono text-xs", children: `{ "${LIBERAR_PASSAGEM_VAR}": true }` })
      ] }),
      hora && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs font-medium text-primary", children: [
        "Última liberação às ",
        hora
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: liberar, disabled: sending, className: "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition", children: [
      sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DoorOpen, { className: "h-4 w-4" }),
      "Liberar passagem manual"
    ] })
  ] });
}
function Historico() {
  const [list, setList] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const load = async () => {
    setLoading(true);
    try {
      setList(await getRecords());
      setError(null);
    } catch (e) {
      setError(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Histórico de Acessos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Todos os acessos registrados pelo sistema." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: load, className: "glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/70 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }),
        " Atualizar"
      ] })
    ] }),
    loading && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-10 w-10" }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive", children: error }),
    !loading && list.length === 0 && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-12", children: "Nenhum acesso registrado." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: list.map((r, i) => {
      const ok = isAuthorized(r);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `glass rounded-2xl p-3 flex items-center gap-4 border-l-4 ${ok ? "border-l-success" : "border-l-destructive bg-destructive/5"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-16 h-16 shrink-0 rounded flex items-center justify-center overflow-hidden ring-2 ${ok ? "ring-success/40" : "ring-destructive/60"} bg-gradient-to-br from-secondary to-accent`, children: r.id != null ? /* @__PURE__ */ jsxRuntimeExports.jsx(SafeImage, { src: recordPhotoUrl(r.id), alt: "Foto do acesso", className: "w-16 h-16 object-cover", fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "h-6 w-6 text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "h-6 w-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold tracking-wider", children: r.placa ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ok ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground animate-pulse"}`, children: [
              ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldX, { className: "h-3 w-3" }),
              ok ? "ACESSO LIBERADO" : "ACESSO NEGADO"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium truncate ${!ok ? "text-destructive font-semibold" : ""}`, children: r.nome_condutor || (ok ? "Não identificado" : "Não Cadastrado") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDate(r) })
        ] })
      ] }, r.id ?? i);
    }) })
  ] });
}
export {
  Overview as component
};
