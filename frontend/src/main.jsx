import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OrderProvider>
      <CartProvider>
        <App />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </OrderProvider>
  </StrictMode>,
)
