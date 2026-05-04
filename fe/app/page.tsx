import ProductList from '@/components/products/product-list'
import Navbar from '../components/layout/navbar'
import Footer from '../components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to SNK Shop</h1>
        {/* ProductList is a Server Component — fetches from api.products.findAll */}
        <ProductList />
      </main>
      <Footer />
    </div>
  )
}