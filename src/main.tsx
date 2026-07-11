if (typeof window !== 'undefined') {
  let activeFetch = window.fetch;
  try {
    Object.defineProperty(window, 'fetch', {
      get() {
        return activeFetch;
      },
      set(val) {
        activeFetch = val;
      },
      configurable: true,
      enumerable: true,
    });
  } catch (e) {
    console.warn("Failed to patch window.fetch getter/setter:", e);
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
