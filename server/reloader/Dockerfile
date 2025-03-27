FROM node:lts AS build

ARG ENV_FILE

WORKDIR /app

COPY package*.json ./

RUN set -eux \
  && npm install

COPY . .
COPY ${ENV_FILE} .env
RUN set -eux \
  && npx wrangler deploy --dry-run --outdir ./.wrangler/dist

FROM node:lts AS runner

COPY --from=build /app/.wrangler /app
COPY --from=build /app/wrangler.toml /app/wrangler.toml

RUN set -eux \
  && npm install -g wrangler@latest \
  && groupadd -g 1001 burnt \
  && useradd -u 1001 -g 1001 -m -d /home/burnt burnt \
  && chown -R burnt:burnt /home/burnt /app

WORKDIR /app
USER burnt

CMD [ "wrangler", "dev", "dist/index.js", "--show-interactive-dev-session", "false", "--ip", "0.0.0.0", "--port", "3000" ]
