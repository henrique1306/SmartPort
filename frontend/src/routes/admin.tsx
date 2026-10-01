import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, CarFront, Settings, Activity, LogOut } from "lucide-react";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: () => {
    if (!auth.isAuthed()) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Painel Admin — SmartPort" },
      { name: "description", content: "Painel administrativo do SmartPort." },
      { property: "og:title", content: "Painel Admin — SmartPort" },
      { property: "og:description", content: "Painel administrativo do SmartPort." },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Visão Geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/veiculos", label: "Gestão de Veículos", icon: CarFront, exact: false },
  { to: "/admin/config", label: "Configurações", icon: Settings, exact: false },
  { to: "/admin/health", label: "Saúde do Sistema", icon: Activity, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    auth.logout();
    navigate({ to: "/login" });
  };

  const linkCls = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-white/60";
  const activeCls = "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary";

  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col md:flex-row gap-6">
      <aside className="glass-strong rounded-3xl p-5 md:w-64 flex flex-col shrink-0">
        <Link to="/" className="flex items-center gap-3 mb-6 px-2">
          <div className="glass-green flex h-10 w-10 items-center justify-center rounded-xl">
            <CarFront className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">SmartPort</p>
            <p className="text-[10px] text-muted-foreground">Controle de acesso</p>
          </div>
        </Link>
        <nav className="flex md:flex-col gap-2 flex-1 overflow-x-auto">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className={linkCls}
              activeProps={{ className: activeCls }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </aside>
      <main className="flex-1 min-w-0 space-y-6">
        <Outlet />
      </main>
    </div>
  );
}
