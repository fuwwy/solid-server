import path from "path";
import solid from "vite-plugin-solid";
import inspect from "vite-plugin-inspect";
import { normalizePath } from "vite";
import manifest from "rollup-route-manifest";

function defineConfig(options) {
  return {
    name: 'solid-server-config',
    enforce: 'pre',
    config() {
      return {
        ssr: {
          noExternal: ["solid-app-router", "solid-meta", "solid-start"]
        },
        solidOptions: options
      }
    }
  }
}

function solidsStartRouteManifest(options) {
  return {
    name: "solid-start-route-manifest",
    config(conf) {
      const regex = new RegExp(
        `(index)?(.(${[
          "tsx",
          "ts",
          "jsx",
          "js",
          ...((options.extensions && options.extensions.map(e => e.slice(1))) || [])
        ].join("|")}))$`
      );

      const root = normalizePath(conf.root || process.cwd());
      return {
        build: {
          target: "esnext",
          manifest: true,
          rollupOptions: {
            plugins: [
              manifest({
                inline: false,
                merge: false,
                publicPath: "/",
                routes: file => {
                  file = file
                    .replace(path.posix.join(root, options.appRoot), "")
                    .replace(regex, "");
                  if (!file.includes(`/${options.routesDir}/`)) return "*"; // commons
                  return "/" + file.replace(`/${options.routesDir}/`, "");
                }
              })
            ]
          }
        }
      };
    }
  };
}

function solidStartSSR(options) {
  return {
    name: "solid-start-ssr",
    configureServer(vite) {
      return async () => {
        const { createDevHandler } = await import("./devServer.js");
        remove_html_middlewares(vite.middlewares);
        vite.middlewares.use(createDevHandler(vite));
      };
    }
  };
}


/**
 * @returns {import('vite').Plugin[]}
 */
export default function solidServer(options) {
  options = Object.assign(
    {
      adapter: "./solid-server/builder.js",
      appRoot: "src",
      routesDir: "routes",
      ssr: true,
      prerenderRoutes: [],
      inspect: true
    },
    options ?? {}
  );

  return [
    defineConfig(options),
    options.inspect && inspect(),
    solid(options),
    options.ssr && solidStartSSR(options),
    solidsStartRouteManifest(options)
  ].filter(Boolean);
}

function remove_html_middlewares(server) {
  const html_middlewares = [
    "viteIndexHtmlMiddleware",
    "vite404Middleware",
    "viteSpaFallbackMiddleware"
  ];
  for (let i = server.stack.length - 1; i > 0; i--) {
    if (html_middlewares.includes(server.stack[i].handle.name)) {
      server.stack.splice(i, 1);
    }
  }
}
