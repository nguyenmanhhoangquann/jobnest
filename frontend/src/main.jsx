import React from 'react';
import client from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/responsive.css';
import './styles/home.css';
import App from './App.jsx';

const createRoot = client.createRoot || client.default?.createRoot;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
