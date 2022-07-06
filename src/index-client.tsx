import { hydrate } from 'solid-js/web';
import { ServerProvider } from '../solid-server/ServerContext';
import App from "./App";
import { Router } from "solid-app-router";

hydrate(() => (
    <ServerProvider>
        <Router>
            <App />
        </Router>
    </ServerProvider>
), document);