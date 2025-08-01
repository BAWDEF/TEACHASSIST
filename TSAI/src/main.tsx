import React from 'react';
import ReactDOM from 'react-dom/client';
//import { StrictMode } from 'react';
//import { createRoot } from 'react-dom/client';
import App from '@/App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';



const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_d2l0dHktc3RpbmtidWctOTAuY2xlcmsuYWNjb3VudHMuZGV2JA
">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);


