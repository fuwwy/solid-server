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
    solidsStartRouteManifest(options)
  ].filter(Boolean);
}