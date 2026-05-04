import { api } from '@/lib/api'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brands — SNK Shop',
  description: 'Browse all sneaker brands available at SNK Shop',
}

interface Brand {
  id: number
  name: string
  description?: string
  logo?: { url: string }
  image?: { url: string }
}

export default async function BrandsPage() {
  let brands: Brand[] = []
  try {
    brands = (await api.brands.findAll()) as Brand[]
  } catch {
    // show empty state
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Brands</h1>
        <p className="text-gray-500 mb-8 text-sm">
          {brands.length} brand{brands.length !== 1 ? 's' : ''} available
        </p>

        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-lg">No brands found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {brands.map(brand => (
              <Link
                key={brand.id}
                href={`/products?brandId=${brand.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col items-center gap-3 group"
              >
                {/* Brand logo */}
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {brand.logo?.url ? (
                    <Image
                      src={brand.logo.url}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">
                      {brand.name[0]}
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <p className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </p>
                  {brand.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
