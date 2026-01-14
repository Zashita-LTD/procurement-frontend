# Procurement Frontend

Интерфейс закупочной платформы (React + Vite + TypeScript) с интеграцией Product Service и Procurement Brain.

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

Dev-сервер поднимается на `http://localhost:3001`. Прокси из `vite.config.ts` перенаправляют запросы:

| Путь             | Сервис            |
|------------------|-------------------|
| `/api/products`  | Product Service (`http://localhost:8000/api/v1/products`) |
| `/api/brain`     | Procurement Brain (`http://localhost:8001/api/v1`)        |

## ⚙️ Переменные окружения (`.env`)

```
VITE_USE_MOCKS=false
VITE_PRODUCT_API_BASE_URL=/api/products
VITE_BRAIN_API_BASE_URL=/api/brain
```

- `VITE_USE_MOCKS` — включает dev-моки (по умолчанию выключено).
- `VITE_PRODUCT_API_BASE_URL` — базовый путь до Product Service (в проде настраивается через ingress/Nginx).
- `VITE_BRAIN_API_BASE_URL` — базовый путь до Procurement Brain.

## 🔍 Интеграция с Product Service

- `useSearchProducts` → `POST /api/v1/products/search/semantic`
- `CatalogPage` → `POST /search/semantic` (поиск) и `GET /api/v1/products` (страницы каталога)
- `ProductDetailPage` → `GET /api/v1/products/{uuid}`

DTO → UI-тип `Product` конвертируется через `src/lib/productMapper.ts`. API-типы описаны в `src/types/api/product.ts`.

## 🐳 Docker

```
docker build -t procurement-frontend .
docker run -p 8080:80 procurement-frontend
```

Multi-stage сборка:
1. `node:20-alpine` — `npm ci` + `npm run build`
2. `nginx:alpine` — раздача `dist/` + SPA fallback (`nginx/default.conf`)

## 📦 npm-скрипты

| Команда         | Описание                      |
|-----------------|-------------------------------|
| `npm run dev`   | Dev-сервер (Vite)             |
| `npm run build` | Prod-сборка (tsc + vite)      |
| `npm run preview` | Проверить prod-сборку        |
| `npm run lint`  | ESLint                        |

## 📁 Структура

```
src/
├── components/      # UI компоненты
├── features/        # Каталог, procurement, auth
├── lib/             # axios, productMapper, utils
├── mocks/           # Dev-моки (опционально)
├── types/           # Доменные и API-типы
└── main.tsx         # Входная точка
```

## 📜 Лицензия

© Zashita LTD, 2026. Все права защищены.
