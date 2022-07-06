// @ts-nocheck
import { useContext, JSXElement } from "solid-js";
import { Assets } from "solid-js/web";
import { ServerContext } from "./ServerContext";
import { ManifestEntry } from "./types";

function getAssetsFromManifest(
  manifest,
  routerContext
) {
  const match = routerContext.matches.reduce<ManifestEntry[]>((memo, m) => {
    memo.push(...(manifest["*"] || []));
    memo.push(...(manifest[mapRouteToFile(m)] || []));
    return memo;
  }, []);

  const links = match.reduce((r, src) => {
    r[src.href] =
      src.type === "style" ? (
        <link rel="stylesheet" href={src.href} $ServerOnly />
      ) : (
        <link rel="modulepreload" href={src.href} $ServerOnly />
      );
    return r;
  }, {} as Record<string, JSXElement>);

  return Object.values(links);
}

function mapRouteToFile(matches: ContextMatches[]) {
  return matches
    .map(h =>
      h.originalPath.replace(/:(\w+)/, (f, g) => `[${g}]`).replace(/\*(\w+)/, (f, g) => `[...${g}]`)
    )
    .join("");
}

/**
 * Links are used to load assets for the server.
 * @returns {JSXElement}
 */
export default function Links(): JSXElement {
  const isDev = import.meta.env.MODE === "development";
  const context = useContext(ServerContext);
  return (
    <Assets>{!isDev && getAssetsFromManifest(context.res.locals.manifest, context.res.locals.routerContext)}</Assets>
  );
}
