import App from './App';
import { ServerProvider } from '../solid-server/ServerContext';
import { Router } from "solid-app-router";
import { ssr } from 'solid-js/web';
import express from 'express';

const docType = ssr("<!DOCTYPE html>");
export default (req: express.Request, res: express.Response) => (
    <ServerProvider req={req} res={res}>
        <Router url={req.url} out={res.locals.routerContext}>
          {docType as any}
          <App />
        </Router>
    </ServerProvider>);
