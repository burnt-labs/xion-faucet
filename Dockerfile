# ---- Base Node ----
FROM node:lts AS build

ARG ENV_FILE
WORKDIR /app
COPY package*.json ./

RUN set -eux \
  && npm install

COPY . .
COPY ${ENV_FILE} .env
RUN set -eux \
  && npm run build

FROM node:lts AS runner

COPY --from=build /app/dist /app

RUN set -eux \
  && npm install -g wrangler@latest \
  && groupadd -g 1001 burnt \
  && useradd -u 1001 -g 1001 -m -d /home/burnt burnt \
  && chown -R burnt:burnt /home/burnt /app

WORKDIR /app
USER burnt

EXPOSE 3000

CMD [ "wrangler", "pages", "dev", "./", "--compatibility-flags", "nodejs_compat", "--show-interactive-dev-session", "false", "--ip", "0.0.0.0", "--port", "3000" ]
