import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { a as auth } from "./router-BX4KwRac.mjs";
import "../_libs/sonner.mjs";
import { C as CarFront, b as LayoutDashboard, S as Settings, c as Activity, d as LogOut } from "../_libs/lucide-react.mjs";

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
const NAV = [{
  to: "/admin",
  label: "Visão Geral",
  icon: LayoutDashboard,
  exact: true
}, {
  to: "/admin/veiculos",
  label: "Gestão de Veículos",
  icon: CarFront,
  exact: false
}, {
  to: "/admin/config",
  label: "Configurações",
  icon: Settings,
  exact: false
}, {
  to: "/admin/health",
  label: "Saúde do Sistema",
  icon: Activity,
  exact: false
}];
function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    auth.logout();
    navigate({
      to: "/login"
    });
  };
  const linkCls = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-white/60";
  const activeCls = "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen p-4 md:p-6 flex flex-col md:flex-row gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "glass-strong rounded-3xl p-5 md:w-64 flex flex-col shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3 mb-6 px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-green flex h-10 w-10 items-center justify-center rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CarFront, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm leading-tight", children: "SmartPort" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Controle de acesso" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex md:flex-col gap-2 flex-1 overflow-x-auto", children: NAV.map(({
        to,
        label,
        icon: Icon,
        exact
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, activeOptions: {
        exact
      }, className: linkCls, activeProps: {
        className: activeCls
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-nowrap", children: label })
      ] }, to)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: logout, className: "mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sair"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 min-w-0 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};
