import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as getVeiculos, e as excluirVeiculo, c as atualizarVeiculo, d as cadastrarVeiculo } from "./router-BX4KwRac.mjs";
import { S as Spinner } from "./Spinner-B1zlDuBq.mjs";
import { k as CirclePlus, g as ShieldCheck, i as ShieldX, P as Pencil, T as Trash2, X } from "../_libs/lucide-react.mjs";

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
function GestaoVeiculos() {
  const [list, setList] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const load = async () => {
    setLoading(true);
    try {
      const data = await getVeiculos();
      setList(data);
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
  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (v) => {
    setEditing(v);
    setModalOpen(true);
  };
  const handleDelete = async (v) => {
    if (!window.confirm(`Excluir o veículo ${v.placa}?`)) return;
    setDeletingId(v.id);
    try {
      await excluirVeiculo(v.id);
      toast.success("Veículo excluído com sucesso!");
      await load();
    } catch (e) {
      toast.error(e?.message || "Erro ao excluir veículo.");
    } finally {
      setDeletingId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Veículos Cadastrados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Gerencie os veículos autorizados no sistema." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: openNew, className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
        " Novo Veículo"
      ] })
    ] }),
    loading && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-10 w-10" }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive", children: error }),
    !loading && list.length === 0 && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-12", children: "Nenhum veículo cadastrado." }),
    list.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/40 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Placa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Condutor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: list.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-white/30 hover:bg-white/30 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono font-bold tracking-wider", children: v.placa }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: v.nome_condutor }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${v.autorizado ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`, children: [
          v.autorizado ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldX, { className: "h-3 w-3" }),
          v.autorizado ? "Liberado" : "Bloqueado"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openEdit(v), className: "glass inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/70 transition", "aria-label": "Editar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(v), disabled: deletingId === v.id, className: "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition disabled:opacity-50", "aria-label": "Excluir", children: deletingId === v.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }) })
      ] }, v.id)) })
    ] }) }) }),
    modalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(VeiculoModal, { veiculo: editing, onClose: () => setModalOpen(false), onSaved: async () => {
      setModalOpen(false);
      await load();
    } })
  ] });
}
function VeiculoModal({
  veiculo,
  onClose,
  onSaved
}) {
  const isEdit = !!veiculo;
  const [placa, setPlaca] = reactExports.useState(veiculo?.placa ?? "");
  const [nome, setNome] = reactExports.useState(veiculo?.nome_condutor ?? "");
  const [autorizado, setAutorizado] = reactExports.useState(veiculo?.autorizado ?? true);
  const [saving, setSaving] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!placa.trim() || !nome.trim()) {
      toast.error("Preencha placa e nome do condutor.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit && veiculo) {
        const payload = {};
        const newPlaca = placa.toUpperCase().trim();
        const newNome = nome.trim();
        if (newPlaca !== veiculo.placa) payload.placa = newPlaca;
        if (newNome !== veiculo.nome_condutor) payload.nome_condutor = newNome;
        if (autorizado !== veiculo.autorizado) payload.autorizado = autorizado;
        if (Object.keys(payload).length === 0) {
          toast.info("Nenhuma alteração para salvar.");
          setSaving(false);
          return;
        }
        await atualizarVeiculo(veiculo.id, payload);
        toast.success("Veículo atualizado com sucesso!");
      } else {
        await cadastrarVeiculo({
          placa: placa.toUpperCase().trim(),
          nome_condutor: nome.trim(),
          autorizado
        });
        toast.success("Veículo cadastrado com sucesso!");
      }
      onSaved();
    } catch (e2) {
      toast.error(e2?.message || "Erro ao salvar veículo.");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-6 md:p-8 w-full max-w-md relative shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/60 transition", "aria-label": "Fechar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: isEdit ? "Editar Veículo" : "Novo Veículo" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isEdit ? "Altere os dados do veículo." : "Cadastre um novo veículo autorizado." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "mt-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Placa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: placa, onChange: (e) => setPlaca(e.target.value.toUpperCase()), placeholder: "ABC1D23", maxLength: 10, className: "glass mt-1 w-full rounded-xl px-4 py-3 font-mono text-lg tracking-[0.15em] uppercase focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Nome do Condutor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: nome, onChange: (e) => setNome(e.target.value), placeholder: "João da Silva", className: "glass mt-1 w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass flex items-center justify-between rounded-xl px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Autorizado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: autorizado ? "Acesso liberado" : "Acesso bloqueado" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setAutorizado((v) => !v), className: `relative h-7 w-12 rounded-full transition ${autorizado ? "bg-success" : "bg-muted-foreground/40"}`, "aria-pressed": autorizado, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all ${autorizado ? "left-[22px]" : "left-0.5"}` }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "glass flex-1 rounded-xl py-3 text-sm font-semibold hover:bg-white/70 transition", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: saving, className: "flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition", children: [
          saving && /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { className: "h-4 w-4 text-primary-foreground" }),
          isEdit ? "Salvar Alterações" : "Cadastrar"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  GestaoVeiculos as component
};
