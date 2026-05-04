import { api } from '@/lib/api'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ProductList from '@/components/products/product-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products — SNK Shop',
  description: 'Browse our full collection of premium sneakers',
}

interface Props {
  searchParams: Promise<{ brandId?: string; search?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const brandId = params.brandId ? Number(params.brandId) : undefined
  const search = params.search

  // Fetch all brands for the filter bar (server-side)
  let brands: { id: number; name: string }[] = []
  try {
    brands = (await api.brands.findAll()) as { id: number; name: string }[]
  } catch {
    // brands filter is non-critical, ignore errors
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">All Sneakers</h1>
        <p className="text-gray-500 mb-6 text-sm">
          {brandId ? `Filtered by brand` : 'Showing all products'}
          {search ? ` · Search: "${search}"` : ''}
        </p>

        {/* Brand filter pills */}
        {brands.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <a
              href="/products"
              className={`px-3 py-1 rounded-full text-sm border transition ${
                !brandId
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              All
            </a>
            {brands.map(b => (
              <a
                key={b.id}
                href={`/products?brandId=${b.id}`}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  brandId === b.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                }`}
              >
                {b.name}
              </a>
            ))}
          </div>
        )}

        {/* Product grid — server component, typed with api.products.findAll */}
        <ProductList brandId={brandId} search={search} />
      </main>

      <Footer />
    </div>
  )
}
