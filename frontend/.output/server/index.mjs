globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HookableCore } from "./_libs/hookable.mjs";
import { d as defineLazyEventHandler, H as HTTPError, a as H3Core } from "./_libs/h3.mjs";
import { d as FastResponse } from "./_libs/srvx.mjs";


import "./_libs/react.mjs";
import "./_libs/rou3.mjs";





function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/assets/admin-DBBkHE_t.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"cdf-xm6ls5KWTlh83p993+3bLgjZcSk"',
    "mtime": "2026-10-01T02:08:55.769Z",
    "size": 3295,
    "path": "../public/assets/admin-DBBkHE_t.js"
  },
  "/assets/admin.config-BX2-wGmH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d09-rLS5MK4APm9uIACYQb2T33weS9c"',
    "mtime": "2026-10-01T02:08:55.766Z",
    "size": 3337,
    "path": "../public/assets/admin.config-BX2-wGmH.js"
  },
  "/assets/admin.health-bp67td_U.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ccf-T8FYlddRXm2DArO4HHaZxTMmdDM"',
    "mtime": "2026-10-01T02:08:55.767Z",
    "size": 3279,
    "path": "../public/assets/admin.health-bp67td_U.js"
  },
  "/assets/admin.index-C6lyEwKC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"129c-Mw4mCOmc+2nmsCf4zZfXW3qFXWg"',
    "mtime": "2026-10-01T02:08:55.766Z",
    "size": 4764,
    "path": "../public/assets/admin.index-C6lyEwKC.js"
  },
  "/assets/camera-Ds2Yu6_W.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"15c-w2m0fqd4K0MS+CRN2lvhkyWDP7k"',
    "mtime": "2026-10-01T02:08:55.768Z",
    "size": 348,
    "path": "../public/assets/camera-Ds2Yu6_W.js"
  },
  "/assets/admin.veiculos-JR3x4vZ5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1f69-tZQpoM3WFkzvWgfBSUfFBhOVRsE"',
    "mtime": "2026-10-01T02:08:55.799Z",
    "size": 8041,
    "path": "../public/assets/admin.veiculos-JR3x4vZ5.js"
  },
  "/assets/createLucideIcon-Dceg-GJv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4b2-lgjCwVtuugISJMsubyripC2vzz4"',
    "mtime": "2026-10-01T02:08:55.806Z",
    "size": 1202,
    "path": "../public/assets/createLucideIcon-Dceg-GJv.js"
  },
  "/assets/index-BGh1Mc6c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17ce-z7OOMzLvKqtYowEEfEfHvu5c2yc"',
    "mtime": "2026-10-01T02:08:55.818Z",
    "size": 6094,
    "path": "../public/assets/index-BGh1Mc6c.js"
  },
  "/assets/index-B0flRXvH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5ef60-Q565RjA0aE3qiBMi3qRUKbl4mIM"',
    "mtime": "2026-10-01T02:08:55.765Z",
    "size": 388960,
    "path": "../public/assets/index-B0flRXvH.js"
  },
  "/assets/index-CWoQbm2W.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a333-R9dSBw/39wW17aunYUD6xHsl8MM"',
    "mtime": "2026-10-01T02:08:55.795Z",
    "size": 41779,
    "path": "../public/assets/index-CWoQbm2W.js"
  },
  "/assets/log-in-DTX3o0RH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f3-+R4JbIRANMr7Yn/FzaFovMvoPzQ"',
    "mtime": "2026-10-01T02:08:55.762Z",
    "size": 243,
    "path": "../public/assets/log-in-DTX3o0RH.js"
  },
  "/assets/login-BY-QIgSH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d22-wd/PknCQtLhkqDOxM6tEEhs5dAg"',
    "mtime": "2026-10-01T02:08:55.800Z",
    "size": 3362,
    "path": "../public/assets/login-BY-QIgSH.js"
  },
  "/assets/refresh-cw-B_YVLBKE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"14d-JEnjxk9xCbBmECDQfNIrFLm+ECw"',
    "mtime": "2026-10-01T02:08:55.773Z",
    "size": 333,
    "path": "../public/assets/refresh-cw-B_YVLBKE.js"
  },
  "/assets/SafeImage-CfNRqZ4b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2f7-HKJEnLVAI1rHeSCXpl0qjgyR5ZI"',
    "mtime": "2026-10-01T02:08:55.789Z",
    "size": 759,
    "path": "../public/assets/SafeImage-CfNRqZ4b.js"
  },
  "/assets/shield-check-eDqqN23Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"147-0v3vazc7uxtj5RqT92p4eacegvU"',
    "mtime": "2026-10-01T02:08:55.806Z",
    "size": 327,
    "path": "../public/assets/shield-check-eDqqN23Q.js"
  },
  "/assets/shield-x-D5pD09h8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"171-Snb0zHns4J57GYNMaGD0zfNnl/Q"',
    "mtime": "2026-10-01T02:08:55.800Z",
    "size": 369,
    "path": "../public/assets/shield-x-D5pD09h8.js"
  },
  "/assets/Spinner-Bpp6r3vw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"126-n6kXsVOYV3TsMSxCURxTD3O/cKM"',
    "mtime": "2026-10-01T02:08:55.805Z",
    "size": 294,
    "path": "../public/assets/Spinner-Bpp6r3vw.js"
  },
  "/assets/styles-DjXZ4zOt.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"147f3-0Ohi5UYSr+FXYAG6f7hffyJsQ5g"',
    "mtime": "2026-10-01T02:08:55.760Z",
    "size": 83955,
    "path": "../public/assets/styles-DjXZ4zOt.css"
  },
  "/placeholder-camera.svg": {
    "type": "image/svg+xml",
    "etag": '"14d-PQZsyJapJ8zIX7vNJFfvakBy3Hw"',
    "mtime": "2026-09-30T20:38:15.593Z",
    "size": 333,
    "path": "../public/placeholder-camera.svg"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_sKUDis = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_sKUDis };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function createHandler(hooks) {
  const nitroApp = useNitroApp();
  const nitroHooks = useNitroHooks();
  return {
    async fetch(request, env, context) {
      globalThis.__env__ = env;
      augmentReq(request, {
        env,
        context
      });
      const ctxExt = {};
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url, ctxExt);
        if (res) {
          return res;
        }
      }
      return await nitroApp.fetch(request);
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
        controller,
        env,
        context
      }) || Promise.resolve());
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:email", {
        message,
        event: message,
        env,
        context
      }) || Promise.resolve());
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
        batch,
        event: batch,
        env,
        context
      }) || Promise.resolve());
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
        traces,
        env,
        context
      }) || Promise.resolve());
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
        traces,
        env,
        context
      }) || Promise.resolve());
    }
  };
}
function augmentReq(cfReq, ctx) {
  const req = cfReq;
  req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx
  };
  req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
