import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw, Camera, Cpu, RefreshCcw, Server } from "lucide-react";
import { getServicesStatus } from "@/lib/api";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/admin/health")({
  head: () => ({
    meta: [
      { title: "Saúde do Sistema — SmartPort" },
      { name: "description", content: "Status dos microsserviços do SmartPort." },
      { property: "og:title", content: "Saúde do Sistema — SmartPort" },
      { property: "og:description", content: "Status dos microsserviços do SmartPort." },
    ],
  }),
  component: HealthPage,
});

const ICONS: Record<string, any> = { camera: Camera, arduino: Cpu, syncer: RefreshCcw };

function HealthPage() {
  const [status, setStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setStatus(await getServicesStatus());
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  const entries = Object.entries(status);

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Saúde do Sistema</h2>
          <p className="text-sm text-muted-foreground">Status dos microsserviços (atualiza a cada 10s).</p>
        </div>
        <button onClick={load} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/70 transition">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </div>

      {loading && entries.length === 0 && <div className="py-20 flex justify-center"><Spinner className="h-10 w-10" /></div>}
      {error && <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([name, s]) => {
          const online = String(s).toLowerCase() === "online";
          const Icon = ICONS[name] ?? Server;
          return (
            <div key={name} className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="glass-green flex h-12 w-12 items-center justify-center rounded-xl">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold capitalize">{name}</p>
                <p className={`text-xs font-medium ${online ? "text-success" : "text-destructive"}`}>{online ? "Online" : "Offline"}</p>
              </div>
              <span className={`h-3.5 w-3.5 rounded-full ${online ? "bg-success shadow-[0_0_12px_var(--success)]" : "bg-destructive animate-pulse"}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
