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

COPY --from=build /app/.output /app

RUN set -eux \
  && apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -g 1001 burnt \
  && useradd -u 1001 -g 1001 -s /bin/bash -m burnt \
  && chown -R burnt:burnt /app

WORKDIR /app
USER burnt

EXPOSE 3000

CMD [ "node", "server/index.mjs" ]
