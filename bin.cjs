#!/usr/bin/env node
"use strict";

const { exec, spawn } = require("child_process");
const sade = require("sade");
const vite = require("vite");

const prog = sade("furmeet-solid").version("alpha");

prog
  .command("dev")
  .describe("Start a development server")
  .option("-o, --open", "Open a browser tab", false)
  .option("-r --root", "Root directory")
  .option("-c, --config", "Vite config file")
  .option("-p, --port", "Port to start server on", 3000)
  .action(async ({ config, open, port, root, host }) => {
    if (open) setTimeout(() => launch(port), 1000);
    spawn(
      "vite",
      [
        "dev",
        ...(config ? ["--config", config] : []),
        ...(port ? ["--port", port] : []),
        ...(host ? ["--host"] : [])
      ],
      {
        shell: true,
        stdio: "inherit"
      }
    );
    // (await import("./runtime/devServer.js")).start({ config, port, root });
  });

prog
  .command("build")
  .describe("Create production build")
  .action(async () => {
    const config = await vite.resolveConfig({ mode: "production" }, "build");
    let adapter = config.solidOptions.adapter;
    if (typeof adapter === "string") {
      adapter = (await import(adapter)).default();
    }
    adapter.build(config);
  });

prog
  .command("start")
  .describe("Run production build")
  .action(async () => {
    const config = await vite.resolveConfig({ mode: "production" }, "build");
    let adapter = config.solidOptions.adapter;
    if (typeof adapter === "string") {
      adapter = (await import(adapter)).default();
    }
    adapter.start(config);
  });

prog
  .command("use <feature>")
  .describe("Use a solid-start feature")
  .action(async feature => {
    const { default: fn } = await import(`./addons/${feature}.js`);

    const config = await vite.resolveConfig({}, "serve");
    console.log(await fn(config));
  });

prog.parse(process.argv);

function launch(port) {
  let cmd = "open";
  if (process.platform == "win32") {
    cmd = "start";
  } else if (process.platform == "linux") {
    cmd = "xdg-open";
  }
  exec(`${cmd} http://localhost:${port}`);
}
