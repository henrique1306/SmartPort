import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { p as LoaderCircle } from "../_libs/lucide-react.mjs";
function Spinner({ className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: `h-6 w-6 animate-spin text-primary ${className}` });
}
export {
  Spinner as S
};
