import {BrowserRouter, Route, Routes} from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Collection from './pages/Collection'
import ProductDetails from './components/Products/ProductDetails'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import {Provider} from 'react-redux'
import ProtectedRoute from './components/Common/ProtectedRoute'
import store from './redux/store'

function App() {
  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* user layout */}
          <Route path="/" element={<UserLayout />} >
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="collections" element={<Collection />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          </Route>

          {/* Admin layout */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
