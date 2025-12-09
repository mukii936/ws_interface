import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { isEnvBrowser } from './utils/misc';
import { useLogStore } from './store/useLogStore';

// --- Override console ---
const setupConsoleOverride = () => {
  const oldLog = console.log;
  const oldWarn = console.warn;
  const oldError = console.error;

  const serialize = (v: any) => {
    try {
      return typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
    } catch {
      return String(v);
    }
  };

  console.log = (...args) => {
    oldLog(...args);
    useLogStore.getState().add('log', args.map(serialize).join(' '));
  };

  console.warn = (...args) => {
    oldWarn(...args);
    useLogStore.getState().add('warn', args.map(serialize).join(' '));
  };

  console.error = (...args) => {
    oldError(...args);
    useLogStore.getState().add('error', args.map(serialize).join(' '));
  };
};

setupConsoleOverride();

const root = document.getElementById('root');

if (isEnvBrowser()) {
  // background image
  root!.style.backgroundImage = 'url("./img/bg.png")';
  root!.style.backgroundSize = 'cover';
  root!.style.backgroundRepeat = 'no-repeat';
  root!.style.backgroundPosition = 'center';
}

// Render App
ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
