import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // 1. Bootstrap
import './styles/tokens.css'; // 2. Biến màu, font (mục 3)
import './styles/base.css'; // 3. Ghi đè Bootstrap + class dùng chung
import './styles/responsive.css'; // 4. @media bổ sung
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
