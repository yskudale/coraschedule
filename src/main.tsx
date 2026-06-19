// ============================================
// main.tsx
// The entry point of the entire application.
// This is the first file that runs.
// Three things happen here:
// 1. Redux Provider  → store available everywhere
// 2. RouterProvider  → navigation available everywhere
// 3. StrictMode      → extra warnings during development
// ============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import '@/styles/main.scss';
import App from './App';





const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found in index.html');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);