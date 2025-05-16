# Просто собираем проект
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build


# # Этап 2: Продакшн-образ (отдача статики)
# FROM nginx:alpine

# # Удаляем дефолтный конфиг nginx и заменяем своим (по желанию)
# # COPY nginx.conf /etc/nginx/nginx.conf

# # Копируем собранные файлы во внутренний веб-сервер nginx
# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]