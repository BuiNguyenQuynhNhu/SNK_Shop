<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
=======
# SNK Shop — Frontend (Next.js)

Next.js 16 frontend for the SNK Sneaker Shop.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

The app runs at **`http://localhost:3001`** (or next available port).

---

## Connecting to the Backend — Typed API Client

The frontend uses **auto-generated TypeScript types** from the backend's Swagger schema.  
This means every DTO defined in the NestJS backend is instantly available as a TypeScript type in the frontend — with full autocomplete and compile-time safety.

### How it works

```
BE NestJS DTOs  →  Swagger JSON (/api/docs-json)  →  types/api.d.ts  →  lib/api.ts
```

### Sync types with the backend

Whenever the backend adds or changes a DTO, run:

```bash
# Make sure the BE is running on localhost:3000 first
npm run gen:api
```

This fetches `http://localhost:3000/api/docs-json` and regenerates `types/api.d.ts` in ~250ms.

> **Rule**: After any DTO change on the backend, always run `npm run gen:api` before writing new frontend code.

---

## Using the API Client

All API calls go through `lib/api.ts`. Import the `api` object and the DTO types you need:

```tsx
import { api, LoginDto, CartItemDto } from '@/lib/api'
```

### Auth example

```tsx
'use client'
import { api, LoginDto, saveToken } from '@/lib/api'

async function handleLogin(data: LoginDto) {
  const { access_token } = await api.auth.login(data)
  saveToken(access_token)   // saves to localStorage
}
```

### Fetch products

```tsx
// Server Component (no 'use client' needed)
import { api } from '@/lib/api'

export default async function ProductsPage() {
  const products = await api.products.findAll({ brandId: 1 })
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

### Cart

```tsx
'use client'
import { api, CartItemDto } from '@/lib/api'

const item: CartItemDto = { variantId: 3, quantity: 2 }
await api.cart.add(item)   // TypeScript errors if you pass wrong fields
```

### Chatbot

```tsx
import { api, ChatMessageDto } from '@/lib/api'

const body: ChatMessageDto = { message: 'Tôi muốn tìm giày Nike size 42' }
const reply = await api.chatbot.chat(body)
```

---

## Available API Namespaces

| Namespace | Methods |
|-----------|---------|
| `api.auth` | `register`, `login`, `me`, `logout`, `updateProfile`, `getAddresses`, `addAddress`, `updateAddress`, `deleteAddress` |
| `api.products` | `findAll`, `findOne`, `create`, `update`, `updateVariant` |
| `api.brands` | `findAll`, `findOne`, `create`, `update`, `remove` |
| `api.cart` | `get`, `add`, `update`, `remove`, `clear` |
| `api.orders` | `create`, `findAll`, `findOne`, `updateStatus` |
| `api.payments` | `get`, `process`, `updateStatus` |
| `api.favourites` | `get`, `add`, `remove` |
| `api.chatbot` | `chat` |

---

## Exported DTO Types

Import these directly from `@/lib/api` — they mirror the backend DTOs exactly:

```ts
import type {
  RegisterDto, LoginDto, UpdateProfileDto, AddressDto,
  CreateOrderDto, OrderItemDto, UpdateOrderStatusDto,
  CreateSneakerDto, UpdateSneakerDto, UpdateVariantDto,
  CreateBrandDto, UpdateBrandDto,
  CartItemDto, UpdateCartItemDto,
  ProcessPaymentDto, UpdatePaymentStatusDto,
  ChatMessageDto,
} from '@/lib/api'
```

---

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Change this URL for staging or production deployments.

---

## Project Structure

```
app/                   # Next.js App Router pages
components/
├── layout/            # Navbar, Footer
│   ├── navbar.tsx     # Uses api.auth for login/logout state
│   └── footer.tsx
├── ui/                # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── auth/              # LoginForm, RegisterForm — typed with LoginDto/RegisterDto
├── products/          # ProductCard, ProductList — typed with BE product schema
└── cart/              # CartItem, AddToCartButton — typed with CartItemDto
lib/
├── api.ts             # Typed API client (import everything from here)
└── utils.ts
types/
└── api.d.ts           # Auto-generated — DO NOT edit manually
>>>>>>> 7dc2704 (add some dto)
```
