import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Car, VideoOff, ShieldCheck, ShieldAlert, LogIn, Wifi, WifiOff } from "lucide-react";
import { STREAM_URL, isAuthorized, formatDate, type AccessRecord } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { SafeImage } from "@/components/SafeImage";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monitor de Acesso — SmartPort" },
      { name: "description", content: "Transmissão ao vivo e acessos veiculares em tempo real." },
      { property: "og:title", content: "Monitor de Acesso — SmartPort" },
      { property: "og:description", content: "Transmissão ao vivo e acessos veiculares em tempo real." },
    ],
  }),
  component: Monitor,
});

function Monitor() {
  const [data, setData] = useState<AccessRecord | null>(null);
  const [connected, setConnected] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    let active = true;
    let cleanup = () => {};
    getSocket().then((s) => {
      if (!active) return;
      const onAcesso = (r: AccessRecord) => setData(r);
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
    return () => { active = false; cleanup(); };
  }, []);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("pt-BR"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const authed = data ? isAuthorized(data) : null;

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 md:py-10">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="glass-green flex h-12 w-12 items-center justify-center rounded-2xl">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SmartPort</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              {connected ? <Wifi className="h-3 w-3 text-success" /> : <WifiOff className="h-3 w-3 text-destructive" />}
              {connected ? "Tempo real conectado" : "Conectando ao gateway…"}
              {clock ? ` · ${clock}` : ""}
            </p>
          </div>
        </div>
        <Link to="/login" className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/70 transition">
          <LogIn className="h-4 w-4" /> Admin
        </Link>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="glass-strong rounded-3xl overflow-hidden lg:col-span-3 relative">
          <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-accent flex items-center justify-center relative">
            <SafeImage
              src={STREAM_URL}
              alt="Transmissão ao vivo"
              className="h-full w-full object-cover"
              fallback={
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <VideoOff className="h-16 w-16" />
                  <span>Transmissão indisponível</span>
                </div>
              }
            />
            <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              AO VIVO
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {!data ? (
            <div className="glass-strong rounded-3xl p-12 flex flex-col items-center justify-center gap-4 text-center">
              <Spinner className="h-10 w-10" />
              <p className="text-muted-foreground">Aguardando o próximo veículo…</p>
            </div>
          ) : (
            <>
              <div
                className={`rounded-3xl p-8 text-center border-2 shadow-2xl ${
                  authed ? "border-primary/60 shadow-primary/30" : "border-destructive/70 shadow-destructive/40 animate-pulse"
                }`}
                style={{
                  background: authed
                    ? "linear-gradient(135deg, var(--primary), var(--success))"
                    : "linear-gradient(135deg, var(--destructive), oklch(0.45 0.2 25))",
                }}
              >
                <div className="flex justify-center mb-3">
                  {authed ? (
                    <ShieldCheck className="h-16 w-16 text-destructive-foreground drop-shadow" strokeWidth={2.5} />
                  ) : (
                    <ShieldAlert className="h-16 w-16 text-destructive-foreground drop-shadow" strokeWidth={2.5} />
                  )}
                </div>
                <p className="text-xs uppercase tracking-widest text-destructive-foreground/80 mb-2">Status</p>
                <h2 className="text-3xl font-extrabold text-destructive-foreground drop-shadow-lg">
                  {authed ? "ACESSO LIBERADO" : "ACESSO NEGADO"}
                </h2>
              </div>

              <div className="glass-strong rounded-3xl p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Placa</p>
                  <p className="text-4xl font-black tracking-[0.15em] mt-1 font-mono">{data.placa ?? "—"}</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Condutor</p>
                  <p className={`text-xl font-semibold mt-1 ${!authed ? "text-destructive" : ""}`}>
                    {data.nome_condutor || (authed ? "Não identificado" : "Não Cadastrado")}
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Data / Hora</p>
                  <p className="text-sm font-medium mt-1">{formatDate(data)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
