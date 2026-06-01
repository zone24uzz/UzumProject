import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import data from '../db.json'

const { products, categories } = data

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header categories={categories} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage products={products} categories={categories} />} />
            <Route path="/product/:id" element={<ProductPage products={products} />} />
            <Route path="/category/:slug" element={<CategoryPage products={products} categories={categories} />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/search" element={<SearchPage products={products} />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
