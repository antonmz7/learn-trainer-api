# Stage 1: builder
# Собираем приложение — компилируем TypeScript в JavaScript
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем ТОЛЬКО package files сначала
# Это позволяет Docker закэшировать слой с npm ci, если package.json не менялся
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev — они нужны для сборки)
# npm ci быстрее и детерминированнее, чем npm install
RUN npm ci

# Копируем исходники и собираем
COPY . .
RUN npm run build

# Удаляем dev-зависимости — они не нужны в production
RUN npm prune --production


# Stage 2: production
# Финальный образ — только рантайм + скомпилированный код
FROM node:22-alpine AS production

WORKDIR /app

# Копируем из builder только то, что нужно для запуска
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Переключаемся на непривилегированного пользователя
USER node

# Документация: приложение слушает порт 3000
# Это не открывает порт, только маркер для тех, кто читает Dockerfile
EXPOSE 3000

# Точка входа
CMD ["node", "dist/main.js"]