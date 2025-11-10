
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackApp } from './stack';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <StackProvider app={stackApp}>
      <App />
    </StackProvider>
  </React.StrictMode>
);
