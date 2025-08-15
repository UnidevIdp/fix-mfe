import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const mount = (el: HTMLElement) => {
  const root = createRoot(el);
  root.render(<App />);
  return root;
};

// If we're in development and in isolation, mount the app immediately
if (process.env.NODE_ENV === 'development' && !window.__POWERED_BY_QIANKUN__) {
  const devRoot = document.querySelector('#root');
  if (devRoot) {
    mount(devRoot as HTMLElement);
  }
}

export { mount };