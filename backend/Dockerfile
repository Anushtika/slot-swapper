# Stage: deps (install production deps)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage: build (install dev deps, build)
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

# Stage: prod
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["node", "dist/main.js"]