import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, User, LogIn, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login Admin — SmartPort" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthed()) navigate({ to: "/admin" });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await auth.login(user, pass);
      toast.success("Login realizado!");
      navigate({ to: "/admin" });
    } catch (e: any) {
      const msg = e?.message || "Falha no login.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <Link
        to="/"
        className="glass absolute top-6 left-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/70 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Monitor
      </Link>

      <div className="glass-strong w-full max-w-md rounded-3xl p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="glass-green flex h-16 w-16 items-center justify-center rounded-2xl mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Administração</h1>
          <p className="text-sm text-muted-foreground mt-1">SmartPort</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Usuário
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="glass w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="admin"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Senha
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="glass w-full rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {err && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 disabled:opacity-60 transition"
          >
            {loading ? <Spinner className="h-4 w-4 text-primary-foreground" /> : <LogIn className="h-4 w-4" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
