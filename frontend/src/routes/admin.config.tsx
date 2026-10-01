import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { getConfig, saveConfig, type SystemConfig } from "@/lib/api";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/admin/config")({
  head: () => ({
    meta: [
      { title: "Configurações — SmartPort" },
      { name: "description", content: "Parâmetros de hardware, câmera e IA do SmartPort." },
      { property: "og:title", content: "Configurações — SmartPort" },
      { property: "og:description", content: "Parâmetros de hardware, câmera e IA do SmartPort." },
    ],
  }),
  component: ConfigPage,
});

const DEFAULT: SystemConfig = {
  modo_operacao: "AUTOMATICO",
  distancia_gatilho: 0,
  camera_tipo: "RTSP",
  camera_url: "",
  ia_modo: "AWS",
  ia_ip_remoto: "",
  arduino_origem: "SERIAL",
};

const inputCls = "glass mt-1 w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ConfigPage() {
  const [cfg, setCfg] = useState<SystemConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConfig()
      .then((c) => setCfg({ ...DEFAULT, ...c }))
      .catch((e) => setError(e?.message || "Erro ao carregar configurações"))
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof SystemConfig>(k: K, v: SystemConfig[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveConfig({ ...cfg, distancia_gatilho: Number(cfg.distancia_gatilho) });
      toast.success("Configurações salvas!");
    } catch (e: any) {
      toast.error(e?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const sel = (k: keyof SystemConfig, opts: string[]) => (
    <select value={String(cfg[k])} onChange={(e) => set(k, e.target.value as any)} className={inputCls}>
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
      <p className="text-sm text-muted-foreground mb-6">Parâmetros de hardware, câmera e IA.</p>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner className="h-10 w-10" /></div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Modo de operação">{sel("modo_operacao", ["AUTOMATICO", "MANUAL", "INATIVO"])}</Field>
            <Field label="Distância do gatilho">
              <input type="number" value={cfg.distancia_gatilho} onChange={(e) => set("distancia_gatilho", Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Tipo de câmera">{sel("camera_tipo", ["RTSP", "LOCAL"])}</Field>
            <Field label="URL da câmera">
              <input value={cfg.camera_url} onChange={(e) => set("camera_url", e.target.value)} placeholder="rtsp://…" className={inputCls} />
            </Field>
            <Field label="Modo da IA">{sel("ia_modo", ["AWS", "IA_LOCAL", "IA_REDE"])}</Field>
            <Field label="IP remoto da IA">
              <input value={cfg.ia_ip_remoto} onChange={(e) => set("ia_ip_remoto", e.target.value)} placeholder="192.168.0.10" className={inputCls} />
            </Field>
            <Field label="Origem do Arduino">{sel("arduino_origem", ["SERIAL", "API_REQUESTS"])}</Field>
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition">
            {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            Salvar Configurações
          </button>
        </form>
      )}
    </div>
  );
}
