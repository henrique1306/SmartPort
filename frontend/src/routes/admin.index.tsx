import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DoorOpen, RefreshCw, ShieldCheck, ShieldX, Car } from "lucide-react";
import { toast } from "sonner";
import {
  getRecords,
  liberarPassagem,
  LIBERAR_PASSAGEM_VAR,
  recordPhotoUrl,
  isAuthorized,
  formatDate,
  type AccessRecord,
} from "@/lib/api";
import { Spinner } from "@/components/Spinner";
import { SafeImage } from "@/components/SafeImage";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Visão Geral — SmartPort" },
      { name: "description", content: "Histórico de acessos e liberação manual da cancela." },
      { property: "og:title", content: "Visão Geral — SmartPort" },
      { property: "og:description", content: "Histórico de acessos e liberação manual da cancela." },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <>
      <LiberarPassagemCard />
      <Historico />
    </>
  );
}

function LiberarPassagemCard() {
  const [sending, setSending] = useState(false);
  const [hora, setHora] = useState<string | null>(null);

  const liberar = async () => {
    setSending(true);
    try {
      await liberarPassagem();
      setHora(new Date().toLocaleTimeString("pt-BR"));
      toast.success(`Passagem liberada — ${LIBERAR_PASSAGEM_VAR} = true`);
    } catch (e: any) {
      toast.error(e?.message || "Erro ao liberar a passagem.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
      <div className="glass-green flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
        <DoorOpen className="h-7 w-7 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold">Liberar passagem manual</h2>
        <p className="text-sm text-muted-foreground">
          Abre a cancela enviando{" "}
          <code className="glass rounded px-1.5 py-0.5 font-mono text-xs">{`{ "${LIBERAR_PASSAGEM_VAR}": true }`}</code>
        </p>
        {hora && <p className="mt-2 text-xs font-medium text-primary">Última liberação às {hora}</p>}
      </div>
      <button
        onClick={liberar}
        disabled={sending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition"
      >
        {sending ? <Spinner className="h-4 w-4" /> : <DoorOpen className="h-4 w-4" />}
        Liberar passagem manual
      </button>
    </div>
  );
}

function Historico() {
  const [list, setList] = useState<AccessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setList(await getRecords());
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Acessos</h2>
          <p className="text-sm text-muted-foreground">Todos os acessos registrados pelo sistema.</p>
        </div>
        <button onClick={load} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/70 transition">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </div>

      {loading && list.length === 0 && <div className="py-20 flex justify-center"><Spinner className="h-10 w-10" /></div>}
      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {!loading && list.length === 0 && !error && <p className="text-center text-muted-foreground py-12">Nenhum acesso registrado.</p>}

      <div className="space-y-3">
        {list.map((r, i) => {
          const ok = isAuthorized(r);
          return (
            <div key={r.id ?? i} className={`glass rounded-2xl p-3 flex items-center gap-4 border-l-4 ${ok ? "border-l-success" : "border-l-destructive bg-destructive/5"}`}>
              <div className={`w-16 h-16 shrink-0 rounded flex items-center justify-center overflow-hidden ring-2 ${ok ? "ring-success/40" : "ring-destructive/60"} bg-gradient-to-br from-secondary to-accent`}>
                {r.id != null ? (
                  <SafeImage src={recordPhotoUrl(r.id)} alt="Foto do acesso" className="w-16 h-16 object-cover" fallback={<Car className="h-6 w-6 text-muted-foreground" />} />
                ) : (
                  <Car className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-bold tracking-wider">{r.placa ?? "—"}</p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ok ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground animate-pulse"}`}>
                    {ok ? <ShieldCheck className="h-3 w-3" /> : <ShieldX className="h-3 w-3" />}
                    {ok ? "ACESSO LIBERADO" : "ACESSO NEGADO"}
                  </span>
                </div>
                <p className={`text-sm font-medium truncate ${!ok ? "text-destructive font-semibold" : ""}`}>
                  {r.nome_condutor || (ok ? "Não identificado" : "Não Cadastrado")}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(r)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
