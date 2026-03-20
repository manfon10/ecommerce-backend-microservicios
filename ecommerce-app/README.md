# Ecommerce Frontend

Next.js 15 frontend for the ecommerce microservices platform.

## Stack

- **Next.js 15** — App Router
- **TanStack Query v5** — server state, caching, mutations
- **Tailwind CSS v3** — styling
- **TypeScript** — full type safety

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

> Make sure the API Gateway is running on port 3000 first (`docker compose up` in the backend).

## Pages

| Route       | Description                                      |
|-------------|--------------------------------------------------|
| `/`         | Dashboard — stats, recent orders, stock overview |
| `/products` | List, create, edit, view products                |
| `/orders`   | List, create, view orders                        |

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Change this to point to your deployed gateway URL.
