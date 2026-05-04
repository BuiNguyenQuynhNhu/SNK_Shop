# SNK Shop — Backend (NestJS)

REST API for the SNK Sneaker Shop, built with **NestJS + Prisma + PostgreSQL**.

---

## Quick Start

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Production
npm run start:prod
```

The server starts at **`http://localhost:3000`** by default (controlled by `PORT` in `.env`).

---

## Swagger API Docs

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

The Swagger UI documents every endpoint including:
- **Request body schemas** — derived directly from DTO classes
- **Response codes** — documented per route
- **JWT Bearer auth** — click "Authorize" and paste your token; it persists across page refreshes

### OpenAPI JSON (used by the frontend)

```
http://localhost:3000/api/docs-json
```

---

## DTO Conventions

All request bodies are typed using **DTO (Data Transfer Object)** classes located in `src/<module>/dto/`.  
Every field is decorated with `@ApiProperty()` or `@ApiPropertyOptional()` so Swagger can expose the schema.

### Example DTO

```typescript
// src/products/dto/create-sneaker.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateSneakerDto {
  @ApiProperty({ example: 'Nike Air Max 90', description: 'Sneaker name' })
  name!: string;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  brandId!: number;
}
```

### Adding a new DTO

1. Create `src/<module>/dto/<name>.dto.ts`
2. Decorate required fields with `@ApiProperty({ example, description })`
3. Decorate optional fields with `@ApiPropertyOptional({ example, description })`
4. Import and use in the controller with `@ApiBody({ type: YourDto })`
5. Notify the frontend to run `npm run gen:api` to regenerate their types

---

## API Modules

| Module | Prefix | Auth required |
|--------|--------|---------------|
| Auth | `/auth` | Partially |
| Products | `/products` | Write only (ADMIN/MANAGER) |
| Brands | `/brands` | Write only (ADMIN/MANAGER) |
| Cart | `/cart` | ✅ All routes |
| Orders | `/orders` | ✅ All routes |
| Payments | `/payments` | ✅ All routes |
| Favourites | `/favourites` | ✅ All routes |
| Chatbot | `/chatbot` | ✅ All routes |
| Media | `/media` | Upload only |

---

## Authentication

JWT Bearer token. Obtain a token via `POST /auth/login`, then send:

```
Authorization: Bearer <token>
```

In Swagger UI, click **Authorize** (top right) and paste the token once.

---

## Environment Variables

Copy `.env.example` → `.env` and fill in:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=snk_shop
JWT_SECRET=your_jwt_secret
```

---

## Project Structure

```
src/
├── auth/           # Register, login, profile, addresses
│   └── dto/        # RegisterDto, LoginDto, UpdateProfileDto, AddressDto
├── products/       # Sneakers & variants CRUD
│   └── dto/        # CreateSneakerDto, UpdateSneakerDto, UpdateVariantDto
├── brands/         # Brand management
│   └── dto/        # CreateBrandDto, UpdateBrandDto
├── cart/           # Shopping cart
│   └── dto/        # CartItemDto, UpdateCartItemDto
├── order/          # Order placement & status
│   └── dto/        # CreateOrderDto, OrderItemDto, UpdateOrderStatusDto
├── payment/        # Payment processing
│   └── dto/        # ProcessPaymentDto, UpdatePaymentStatusDto
├── favourite/      # Wishlist
├── chatbot/        # AI product chatbot
│   └── dto/        # ChatMessageDto
├── media/          # File upload (Azure Blob)
├── common/         # Guards, decorators
└── prisma/         # Prisma service
```
