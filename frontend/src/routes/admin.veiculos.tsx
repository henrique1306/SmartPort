import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlusCircle, ShieldCheck, ShieldX, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { atualizarVeiculo, cadastrarVeiculo, excluirVeiculo, getVeiculos, type Veiculo } from "@/lib/api";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/admin/veiculos")({
  head: () => ({
    meta: [
      { title: "Gestão de Veículos — SmartPort" },
      { name: "description", content: "Cadastre, edite e remova veículos autorizados." },
      { property: "og:title", content: "Gestão de Veículos — SmartPort" },
      { property: "og:description", content: "Cadastre, edite e remova veículos autorizados." },
    ],
  }),
  component: GestaoVeiculos,
});

function GestaoVeiculos() {
  const [list, setList] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Veiculo | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getVeiculos();
      setList(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (v: Veiculo) => {
    setEditing(v);
    setModalOpen(true);
  };

  const handleDelete = async (v: Veiculo) => {
    if (!window.confirm(`Excluir o veículo ${v.placa}?`)) return;
    setDeletingId(v.id);
    try {
      await excluirVeiculo(v.id);
      toast.success("Veículo excluído com sucesso!");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao excluir veículo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Veículos Cadastrados</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie os veículos autorizados no sistema.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 transition"
        >
          <PlusCircle className="h-4 w-4" /> Novo Veículo
        </button>
      </div>

      {loading && list.length === 0 && (
        <div className="py-20 flex justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && list.length === 0 && !error && (
        <p className="text-center text-muted-foreground py-12">Nenhum veículo cadastrado.</p>
      )}

      {list.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Placa</th>
                  <th className="text-left px-4 py-3">Condutor</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {list.map((v) => (
                  <tr
                    key={v.id}
                    className="border-t border-white/30 hover:bg-white/30 transition"
                  >
                    <td className="px-4 py-3 font-mono font-bold tracking-wider">{v.placa}</td>
                    <td className="px-4 py-3">{v.nome_condutor}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          v.autorizado
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {v.autorizado ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <ShieldX className="h-3 w-3" />
                        )}
                        {v.autorizado ? "Liberado" : "Bloqueado"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(v)}
                          className="glass inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/70 transition"
                          aria-label="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v)}
                          disabled={deletingId === v.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition disabled:opacity-50"
                          aria-label="Excluir"
                        >
                          {deletingId === v.id ? (
                            <Spinner className="h-3.5 w-3.5" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <VeiculoModal
          veiculo={editing}
          onClose={() => setModalOpen(false)}
          onSaved={async () => {
            setModalOpen(false);
            await load();
          }}
        />
      )}
    </div>
  );
}

function VeiculoModal({
  veiculo,
  onClose,
  onSaved,
}: {
  veiculo: Veiculo | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!veiculo;
  const [placa, setPlaca] = useState(veiculo?.placa ?? "");
  const [nome, setNome] = useState(veiculo?.nome_condutor ?? "");
  const [autorizado, setAutorizado] = useState(veiculo?.autorizado ?? true);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa.trim() || !nome.trim()) {
      toast.error("Preencha placa e nome do condutor.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit && veiculo) {
        const payload: Record<string, any> = {};
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
          autorizado,
        });
        toast.success("Veículo cadastrado com sucesso!");
      }
      onSaved();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao salvar veículo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in">
      <div className="glass-strong rounded-3xl p-6 md:p-8 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/60 transition"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-xl font-bold">{isEdit ? "Editar Veículo" : "Novo Veículo"}</h3>
        <p className="text-sm text-muted-foreground">
          {isEdit ? "Altere os dados do veículo." : "Cadastre um novo veículo autorizado."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Placa
            </label>
            <input
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="ABC1D23"
              maxLength={10}
              className="glass mt-1 w-full rounded-xl px-4 py-3 font-mono text-lg tracking-[0.15em] uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome do Condutor
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="João da Silva"
              className="glass mt-1 w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="glass flex items-center justify-between rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Autorizado</p>
              <p className="text-xs text-muted-foreground">
                {autorizado ? "Acesso liberado" : "Acesso bloqueado"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutorizado((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition ${
                autorizado ? "bg-success" : "bg-muted-foreground/40"
              }`}
              aria-pressed={autorizado}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all ${
                  autorizado ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="glass flex-1 rounded-xl py-3 text-sm font-semibold hover:bg-white/70 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition"
            >
              {saving && <Spinner className="h-4 w-4 text-primary-foreground" />}
              {isEdit ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
