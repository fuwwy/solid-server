import path from "path";
import { Readable } from "stream";
import { once } from "events";
import { renderToString, renderToStringAsync } from "solid-js/web";
import { sharedConfig } from "solid-js";
  
export function createDevHandler(viteServer) {
    return async (req, res) => {
      try {
        if (req.url === "/favicon.ico") return;
  
        console.log(req.method, req.url);
  
        const entry = (await viteServer.ssrLoadModule(path.resolve("./src/index"))).default;

        // make stubs
        res.locals = {};
        res.locals.routerContext = {};

        const result = await renderToStringAsync(() => entry(req, res));
  
        if (result) {
          const readable = Readable.from(result);
          readable.pipe(result);
          await once(readable, "end");
        } else {
          res.end();
        }
      } catch (e) {
        viteServer && viteServer.ssrFixStacktrace(e);
        console.log("ERROR", e);
        res.statusCode = 500;
        res.end(e.stack);
      }
    };
  }