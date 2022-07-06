import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { renderToString } from "solid-js/web";
import App from "./app";

import manifest from "../../dist/public/rmanifest.json";
import assetManifest from "../../dist/public/manifest.json";
prepareManifest(manifest, assetManifest);

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "./public")));

app.get("*", (req, res) => {
  res.locals.manifest = manifest;
  res.locals.assetManifest = assetManifest;
  res.locals.routerContext = {};
  let html;
  try {
    html = renderToString(() => App(req, res));
  } catch (err) {
    console.error(err);
  } finally {
    res.send(html);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default function prepareManifest(manifest, assetManifest) {
  const cssMap = Object.values(assetManifest).reduce((memo, entry) => {
    entry.css && (memo["/" + entry.file] = entry.css.map(c => "/" + c));
    return memo;
  }, {})
  
  Object.values(manifest).forEach((resources) => {
    const assets = [];
    resources.forEach((r) => {
      let src;
      if (src = cssMap[r.href]) {
        assets.push(...[...src].map(v => ({ type: "style", href: v })))
      }
    })
    if (assets.length) resources.push(...assets)
  });
}