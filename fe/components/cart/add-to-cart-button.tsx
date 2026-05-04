'use client'

import { useState } from 'react'
import { api, CartItemDto } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface AddToCartButtonProps {
  /** The variant ID to add — maps directly to CartItemDto.variantId */
  variantId: CartItemDto['variantId']
  /** Default quantity, maps to CartItemDto.quantity */
  quantity?: CartItemDto['quantity']
  className?: string
}

export default function AddToCartButton({
  variantId,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddToCart() {
    setLoading(true)
    setError(null)
    try {
      // CartItemDto shape is guaranteed by the generated types
      const payload: CartItemDto = { variantId, quantity }
      await api.cart.add(payload)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleAddToCart}
        disabled={loading}
        variant={added ? 'secondary' : 'default'}
        className={className}
      >
        <ShoppingCartIcon className="h-4 w-4" />
        {loading ? 'Adding…' : added ? 'Added!' : 'Add to Cart'}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
