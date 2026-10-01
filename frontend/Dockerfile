# ==========================================
# STAGE 1: BUILDER (Oven/Bun)
# ==========================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuração do gerenciador de pacotes
COPY package.json bun.lock* bunfig.toml* ./

# Instala as dependências
RUN bun install --frozen-lockfile 2>&1 || bun install

# Copia todo o código-fonte restante
COPY . .

# Roda o comando de build
RUN bun run build

# ==========================================
# STAGE 2: RUNNER (Node.js)
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Define ambiente para produção
ENV NODE_ENV=production

# Copia a pasta .output inteira (mantendo sua estrutura)
COPY --from=builder /app/.output ./.output

# Copia package.json e node_modules (dependências de produção)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copia o nitro-wrapper.mjs
COPY nitro-wrapper.mjs ./

# Copia env files se existirem
COPY .env* ./

# Expõe a porta
EXPOSE 3000

# Executa o wrapper com Nitro SSR + proxies
CMD ["node", "nitro-wrapper.mjs"]
