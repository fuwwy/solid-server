import type { Component } from 'solid-js';

import logo from './assets/logo.svg';
import styles from './App.module.css';
import Scripts from '../solid-server/Scripts';
import Links from '../solid-server/Links';
import { Route, Routes } from 'solid-app-router';
import favicon from './assets/favicon.ico';
import './index.css';

const App: Component = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="shortcut icon" type="image/ico" href={favicon} />
        <title>Solid App</title>
        <Links />
      </head>
      <body>
        <div class={styles.App}>
          <Routes>
            <Route path="/" element={(
              <header class={styles.header}>
                <img src={logo} class={styles.logo} alt="logo" />
                <p>
                  Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                  class={styles.link}
                  href="https://github.com/solidjs/solid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn Solid
                </a>
              </header>
            )} />
          </Routes>
        </div>
        <Scripts />
      </body>
    </html>
  );
};

export default App;