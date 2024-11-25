import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' 



// Creazione del root per il rendering dell'applicazione
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />  {/* Il componente principale della tua app */}
    </BrowserRouter>
  </StrictMode>,
)

