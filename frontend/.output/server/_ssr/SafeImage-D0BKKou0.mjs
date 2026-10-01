import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as Camera } from "../_libs/lucide-react.mjs";
function SafeImage({
  src,
  alt,
  className,
  fallback
}) {
  const [failed, setFailed] = reactExports.useState(false);
  if (failed || !src) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: fallback ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6 text-muted-foreground", "aria-label": alt }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt, className, onError: () => setFailed(true) });
}
export {
  SafeImage as S
};
