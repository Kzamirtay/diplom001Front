FROM node:18-alpine

# Рабочая директория
WORKDIR /app

# Копирование package.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование проекта
COPY . .

# Экспорт порта
EXPOSE 5173

# Команда по умолчанию
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
