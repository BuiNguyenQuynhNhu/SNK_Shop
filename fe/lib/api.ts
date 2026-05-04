/**
 * Typed API client for SNK Shop backend.
 *
 * Usage:
 *   import { api } from '@/lib/api'
 *
 *   // POST /auth/login  ← TypeScript knows the exact shape from the BE DTO
 *   const res = await api.auth.login({ email: '...', password: '...' })
 *
 *   // GET /products  ← response is typed too
 *   const products = await api.products.findAll({ brandId: 1 })
 */

import type { components } from '@/types/api.d'

// ── Shorthand type aliases (use these directly in your components) ──────────
export type RegisterDto       = components['schemas']['RegisterDto']
export type LoginDto          = components['schemas']['LoginDto']
export type UpdateProfileDto  = components['schemas']['UpdateProfileDto']
export type AddressDto        = components['schemas']['AddressDto']
export type CreateOrderDto    = components['schemas']['CreateOrderDto']
export type OrderItemDto      = components['schemas']['OrderItemDto']
export type UpdateOrderStatusDto = components['schemas']['UpdateOrderStatusDto']
export type CreateSneakerDto  = components['schemas']['CreateSneakerDto']
export type UpdateSneakerDto  = components['schemas']['UpdateSneakerDto']
export type UpdateVariantDto  = components['schemas']['UpdateVariantDto']
export type CreateBrandDto    = components['schemas']['CreateBrandDto']
export type UpdateBrandDto    = components['schemas']['UpdateBrandDto']
export type CartItemDto       = components['schemas']['CartItemDto']
export type UpdateCartItemDto = components['schemas']['UpdateCartItemDto']
export type ProcessPaymentDto = components['schemas']['ProcessPaymentDto']
export type UpdatePaymentStatusDto = components['schemas']['UpdatePaymentStatusDto']
export type ChatMessageDto    = components['schemas']['ChatMessageDto']

// ── Base fetch helper ────────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v))
    })
  }

  const token = getToken()
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error?.message ?? `API error ${res.status}`)
  }

  // 204 No Content – return empty object
  if (res.status === 204) return {} as T
  return res.json() as Promise<T>
}

const get  = <T>(path: string, params?: Record<string, string | number | boolean | undefined>) => request<T>('GET', path, undefined, params)
const post = <T>(path: string, body: unknown) => request<T>('POST', path, body)
const patch = <T>(path: string, body: unknown) => request<T>('PATCH', path, body)
const del  = <T>(path: string) => request<T>('DELETE', path)

// ── Auth helper ──────────────────────────────────────────────────────────────
export function saveToken(token: string) {
  localStorage.setItem('access_token', token)
}
export function clearToken() {
  localStorage.removeItem('access_token')
}

// ── Typed API namespaces ─────────────────────────────────────────────────────
export const api = {
  auth: {
    register: (body: RegisterDto)          => post<{ access_token: string }>('/auth/register', body),
    login:    (body: LoginDto)             => post<{ access_token: string }>('/auth/login', body),
    me:       ()                           => get<Record<string, unknown>>('/auth/me'),
    logout:   ()                           => post<{ message: string }>('/auth/logout', {}),
    updateProfile: (body: UpdateProfileDto) => patch<Record<string, unknown>>('/auth/profile', body),
    getAddresses:  ()                      => get<Record<string, unknown>[]>('/auth/addresses'),
    addAddress:    (body: AddressDto)      => post<Record<string, unknown>>('/auth/addresses', body),
    updateAddress: (id: number, body: AddressDto) => patch<Record<string, unknown>>(`/auth/addresses/${id}`, body),
    deleteAddress: (id: number)            => del<Record<string, unknown>>(`/auth/addresses/${id}`),
  },

  products: {
    findAll:       (params?: { brandId?: number; categoryId?: number; search?: string }) =>
                     get<Record<string, unknown>[]>('/products', params),
    findOne:       (id: number)                       => get<Record<string, unknown>>(`/products/${id}`),
    create:        (body: CreateSneakerDto)           => post<Record<string, unknown>>('/products', body),
    update:        (id: number, body: UpdateSneakerDto) => patch<Record<string, unknown>>(`/products/${id}`, body),
    updateVariant: (id: number, body: UpdateVariantDto) => patch<Record<string, unknown>>(`/products/variants/${id}`, body),
  },

  brands: {
    findAll:  ()                           => get<Record<string, unknown>[]>('/brands'),
    findOne:  (id: number)                 => get<Record<string, unknown>>(`/brands/${id}`),
    create:   (body: CreateBrandDto)       => post<Record<string, unknown>>('/brands', body),
    update:   (id: number, body: UpdateBrandDto) => patch<Record<string, unknown>>(`/brands/${id}`, body),
    remove:   (id: number)                 => del<Record<string, unknown>>(`/brands/${id}`),
  },

  cart: {
    get:    ()                              => get<Record<string, unknown>>('/cart'),
    add:    (body: CartItemDto)             => post<Record<string, unknown>>('/cart', body),
    update: (body: UpdateCartItemDto)       => patch<Record<string, unknown>>('/cart', body),
    remove: (variantId: number)             => del<Record<string, unknown>>(`/cart/${variantId}`),
    clear:  ()                              => del<Record<string, unknown>>('/cart'),
  },

  orders: {
    create:       (body: CreateOrderDto)   => post<Record<string, unknown>>('/orders', body),
    findAll:      ()                       => get<Record<string, unknown>[]>('/orders'),
    findOne:      (id: number)             => get<Record<string, unknown>>(`/orders/${id}`),
    updateStatus: (id: number, body: UpdateOrderStatusDto) => patch<Record<string, unknown>>(`/orders/${id}/status`, body),
  },

  payments: {
    get:           (orderId: number)       => get<Record<string, unknown>>(`/payments/order/${orderId}`),
    process:       (orderId: number, body: ProcessPaymentDto) => post<Record<string, unknown>>(`/payments/order/${orderId}`, body),
    updateStatus:  (orderId: number, body: UpdatePaymentStatusDto) => patch<Record<string, unknown>>(`/payments/order/${orderId}/status`, body),
  },

  favourites: {
    get:    ()                             => get<Record<string, unknown>[]>('/favourites'),
    add:    (sneakerId: number)            => post<Record<string, unknown>>(`/favourites/${sneakerId}`, {}),
    remove: (sneakerId: number)            => del<Record<string, unknown>>(`/favourites/${sneakerId}`),
  },

  chatbot: {
    chat: (body: ChatMessageDto)           => post<{ reply: string }>('/chatbot', body),
  },
}
