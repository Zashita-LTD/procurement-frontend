FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_USE_MOCKS=false
ARG VITE_PRODUCT_API_BASE_URL=/api/products
ARG VITE_BRAIN_API_BASE_URL=/api/brain

ENV VITE_USE_MOCKS=$VITE_USE_MOCKS
ENV VITE_PRODUCT_API_BASE_URL=$VITE_PRODUCT_API_BASE_URL
ENV VITE_BRAIN_API_BASE_URL=$VITE_BRAIN_API_BASE_URL

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS runtime
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
