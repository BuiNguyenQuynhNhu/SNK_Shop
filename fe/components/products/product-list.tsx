import { api } from '@/lib/api'
import ProductCard, { type ProductCardData } from './product-card'

interface ProductListProps {
  brandId?: number
  categoryId?: number
  search?: string
}

/**
 * Server Component — fetches products from the API using the typed api client
 * and renders a grid of ProductCards.
 */
export default async function ProductList({ brandId, categoryId, search }: ProductListProps) {
  let products: ProductCardData[] = []

  try {
    // api.products.findAll accepts the exact query params typed from the BE
    const data = await api.products.findAll({ brandId, categoryId, search })
    products = data as ProductCardData[]
  } catch (err) {
    console.error('[ProductList] Failed to fetch products:', err)
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg">No products found.</p>
        <p className="text-sm mt-1">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
