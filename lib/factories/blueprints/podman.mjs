const buildStage = `
  # =============================================================================
  # Build Stage
  # =============================================================================
`.trim();

const devStage = `
  # =============================================================================
  # Development Stage
  # =============================================================================
`.trim();

const prodStage = `
  # =============================================================================
  # Production Stage
  # =============================================================================
`.trim();

export function podmanBlueprint({ runtime, includePodman, podmanNetwork, serviceName }) {
    if (!includePodman) return [];

    const files = [];
    let containerFile = '';
  
    switch (runtime) {
      case 'node':
        containerFile = `
${devStage}
  
  FROM node:22-alpine AS development
  
  WORKDIR /app
  
  COPY package*.json ./
  RUN npm install
  
  # Copy source
  COPY . .
  
  # Start dev server
  CMD ["npm", "run", "dev"]
  
${buildStage}
  
  FROM development as builder
  RUN npm run build
  
${prodStage}
  
  FROM node:22-alpine AS production
  
  # Set NODE_ENV to production
  ENV NODE_ENV=production
  
  WORKDIR /app
  COPY package*.json ./
  COPY --from=builder /app/dist ./dist
  
  # Install dependencies and prune
  RUN npm install --omit=dev && npm prune
  
  # Change to 1000 user
  RUN chown 1000:1000 /app
  
  # Switch user
  USER 1000:1000
  
  # Start prod server
  CMD ["node", "./dist/index.js"]
        `.trim();
        break;
  
      case 'bun':
        containerFile = `
${devStage}
  
  FROM oven/bun:1.1.10 AS development
  
  WORKDIR /app
  
  COPY *.lockb package.json ./
  RUN bun install
  
  # Copy source
  COPY . .
  
  # Start dev server
  CMD ["bun", "run", "dev"]
  
${buildStage}
  
  FROM development as builder
  RUN bun run build
  
${prodStage}
  
  FROM oven/bun:1.1.10 AS production
  
  WORKDIR /app
  COPY *.lockb package.json ./
  COPY --from=builder /app/dist ./dist
  
  RUN bun install --production
  
  USER 1000:1000
  
  CMD ["bun", "./dist/index.js"]
        `.trim();
        break;
  
      default:
        break;
    }

    if (containerFile) {
        files.push(['Containerfile', containerFile]);
        files.push(['compose.yml', `
version: '3'

services:
  core:
    build:
      context: .
      target: development
    tty: true
    environment:
      - TRIFROST_DEV=\${TRIFROST_DEV}
      - TRIFROST_PORT=\${TRIFROST_PORT}
      - TRIFROST_NAME=\${TRIFROST_NAME}
      - TRIFROST_VERSION=\${TRIFROST_VERSION}
    ports:
      - "\${TRIFROST_PORT}:\${TRIFROST_PORT}"
    volumes:
      - './:/app:z'
      - './node_modules:/app/node_modules:z'
networks:
  default:
    external:
      name: '${podmanNetwork}'
  `.trim()])
    }

    return files;
}
  