# ---- Base Node ----
FROM node:lts-slim AS build

ARG DOTENV_FILE=.env
ENV DOTENV_FILE=${DOTENV_FILE}

WORKDIR /app
COPY package*.json ./

RUN set -eux \
  && npm install

COPY . .
RUN set -eux \
  && npx nuxt build --dotenv ${DOTENV_FILE}

FROM node:lts-slim AS runner

ARG DOTENV_FILE=.env

COPY --from=build /app/.output /app

RUN set -eux \
  && apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && npm install -g wrangler@latest \
  && groupadd -g 1001 burnt \
  && useradd -u 1001 -g 1001 -s /bin/bash -m burnt \
  && chown -R burnt:burnt /app

WORKDIR /app
USER burnt

CMD [ "wrangler", "--config", "server/wrangler.json", "dev", "--show-interactive-dev-session", "false", "--ip", "0.0.0.0", "--port", "3000" ]
