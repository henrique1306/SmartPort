import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as getConfig, s as saveConfig } from "./router-BX4KwRac.mjs";
import { S as Spinner } from "./Spinner-B1zlDuBq.mjs";
import { o as Save } from "../_libs/lucide-react.mjs";

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
const DEFAULT = {
  modo_operacao: "AUTOMATICO",
  distancia_gatilho: 0,
  camera_tipo: "RTSP",
  camera_url: "",
  ia_modo: "AWS",
  ia_ip_remoto: "",
  arduino_origem: "SERIAL"
};
const inputCls = "glass mt-1 w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
    children
  ] });
}
function ConfigPage() {
  const [cfg, setCfg] = reactExports.useState(DEFAULT);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    getConfig().then((c) => setCfg({
      ...DEFAULT,
      ...c
    })).catch((e) => setError(e?.message || "Erro ao carregar configurações")).finally(() => setLoading(false));
  }, []);
  const set = (k, v) => setCfg((c) => ({
    ...c,
    [k]: v
  }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveConfig({
        ...cfg,
        distancia_gatilho: Number(cfg.distancia_gatilho)
      });
      toast.success("Configurações salvas!");
    } catch (e2) {
      toast.error(e2?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };
  const sel = (k, opts) => /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: String(cfg[k]), onChange: (e) => set(k, e.target.value), className: inputCls, children: opts.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o)) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Configurações do Sistema" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Parâmetros de hardware, câmera e IA." }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-10 w-10" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Modo de operação", children: sel("modo_operacao", ["AUTOMATICO", "MANUAL", "INATIVO"]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Distância do gatilho", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: cfg.distancia_gatilho, onChange: (e) => set("distancia_gatilho", Number(e.target.value)), className: inputCls }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tipo de câmera", children: sel("camera_tipo", ["RTSP", "LOCAL"]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "URL da câmera", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: cfg.camera_url, onChange: (e) => set("camera_url", e.target.value), placeholder: "rtsp://…", className: inputCls }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Modo da IA", children: sel("ia_modo", ["AWS", "IA_LOCAL", "IA_REDE"]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "IP remoto da IA", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: cfg.ia_ip_remoto, onChange: (e) => set("ia_ip_remoto", e.target.value), placeholder: "192.168.0.10", className: inputCls }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Origem do Arduino", children: sel("arduino_origem", ["SERIAL", "API_REQUESTS"]) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving, className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition", children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        "Salvar Configurações"
      ] })
    ] })
  ] });
}
export {
  ConfigPage as component
};
