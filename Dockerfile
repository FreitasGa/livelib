FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json prisma ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

EXPOSE 3000

CMD ["npm", "run", "start:prod"]