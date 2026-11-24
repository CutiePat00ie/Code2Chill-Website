import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PrefsProvider } from './context/PrefsContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PrefsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PrefsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
