import Image from 'next/image'
import AddToCartButton from '@/components/cart/add-to-cart-button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { HeartIcon } from '@heroicons/react/24/outline'

/**
 * Shape returned by GET /products/:id
 * This matches the actual Prisma/NestJS response shape.
 * If the BE adds fields, update here and the compiler will remind you.
 */
export interface ProductCardData {
  id: number
  name: string
  description?: string
  brand?: { id: number; name: string }
  variants?: Array<{
    id: number
    color?: string
    size?: number
    price: number
    stock: number
  }>
  images?: Array<{ url: string }>
}

interface ProductCardProps {
  product: ProductCardData
}

export default function ProductCard({ product }: ProductCardProps) {
  // Pick the cheapest variant to show as the display price
  const cheapestVariant = product.variants?.reduce((min, v) =>
    v.price < min.price ? v : min,
    product.variants[0]
  )

  const imageUrl = product.images?.[0]?.url ?? '/placeholder-shoe.png'
  const price = cheapestVariant?.price
  const variantId = cheapestVariant?.id

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 relative">
      {/* Wishlist button */}
      <button
        aria-label="Add to wishlist"
        className="absolute top-3 right-3 z-10 text-gray-400 hover:text-red-500 transition-colors"
      >
        <HeartIcon className="h-5 w-5" />
      </button>

      {/* Product image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-xl bg-gray-50">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-sm">{product.name}</CardTitle>
        {product.brand && (
          <p className="text-xs text-gray-500">{product.brand.name}</p>
        )}
      </CardHeader>

      <CardContent>
        {price !== undefined && (
          <p className="text-base font-bold text-gray-900">
            {price.toLocaleString('vi-VN')}₫
          </p>
        )}
        {product.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>

      {variantId !== undefined && (
        <CardFooter>
          {/* CartItemDto.variantId is typed as number — matches prop type */}
          <AddToCartButton variantId={variantId} className="w-full" />
        </CardFooter>
      )}
    </Card>
  )
}
