import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { i as isAuthorized, S as STREAM_URL, f as formatDate, G as GATEWAY_URL } from "./router-BX4KwRac.mjs";
import { S as SafeImage } from "./SafeImage-D0BKKou0.mjs";
import { S as Spinner } from "./Spinner-B1zlDuBq.mjs";
import "../_libs/sonner.mjs";
import { e as Car, W as Wifi, f as WifiOff, a as LogIn, V as VideoOff, g as ShieldCheck, h as ShieldAlert } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
let socket = null;
async function getSocket() {
  if (socket) return socket;
  const { io } = await import("../_libs/socket.io-client.mjs");
  socket = io(GATEWAY_URL, { transports: ["websocket", "polling"], reconnection: true });
  return socket;
}
function Monitor() {
  const [data, setData] = reactExports.useState(null);
  const [connected, setConnected] = reactExports.useState(false);
  const [clock, setClock] = reactExports.useState("");
  reactExports.useEffect(() => {
    let active = true;
    let cleanup = () => {
    };
    getSocket().then((s) => {
      if (!active) return;
      const onAcesso = (r) => setData(r);
      const onCon = () => setConnected(true);
      const onDis = () => setConnected(false);
      s.on("novo_acesso", onAcesso);
      s.on("connect", onCon);
      s.on("disconnect", onDis);
      s.on("connect_error", onDis);
      setConnected(s.connected);
      cleanup = () => {
        s.off("novo_acesso", onAcesso);
        s.off("connect", onCon);
        s.off("disconnect", onDis);
        s.off("connect_error", onDis);
      };
    });
    return () => {
      active = false;
      cleanup();
    };
  }, []);
  reactExports.useEffect(() => {
    const tick = () => setClock((/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR"));
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, []);
  const authed = data ? isAuthorized(data) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen px-4 py-6 md:px-10 md:py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-green flex h-12 w-12 items-center justify-center rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "SmartPort" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
            connected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "h-3 w-3 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-3 w-3 text-destructive" }),
            connected ? "Tempo real conectado" : "Conectando ao gateway…",
            clock ? ` · ${clock}` : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", className: "glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/70 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
        " Admin"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-strong rounded-3xl overflow-hidden lg:col-span-3 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[4/3] bg-gradient-to-br from-secondary to-accent flex items-center justify-center relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SafeImage, { src: STREAM_URL, alt: "Transmissão ao vivo", className: "h-full w-full object-cover", fallback: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { className: "h-16 w-16" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Transmissão indisponível" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 glass rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-destructive animate-pulse" }),
          "AO VIVO"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 flex flex-col gap-6", children: !data ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-10 w-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Aguardando o próximo veículo…" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-3xl p-8 text-center border-2 shadow-2xl ${authed ? "border-primary/60 shadow-primary/30" : "border-destructive/70 shadow-destructive/40 animate-pulse"}`, style: {
          background: authed ? "linear-gradient(135deg, var(--primary), var(--success))" : "linear-gradient(135deg, var(--destructive), oklch(0.45 0.2 25))"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-3", children: authed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-16 w-16 text-destructive-foreground drop-shadow", strokeWidth: 2.5 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-16 w-16 text-destructive-foreground drop-shadow", strokeWidth: 2.5 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-destructive-foreground/80 mb-2", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold text-destructive-foreground drop-shadow-lg", children: authed ? "ACESSO LIBERADO" : "ACESSO NEGADO" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Placa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-black tracking-[0.15em] mt-1 font-mono", children: data.placa ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Condutor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-semibold mt-1 ${!authed ? "text-destructive" : ""}`, children: data.nome_condutor || (authed ? "Não identificado" : "Não Cadastrado") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Data / Hora" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mt-1", children: formatDate(data) })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Monitor as component
};
