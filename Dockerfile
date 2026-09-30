# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Passed from the Harness build step (see README notes in chat)
ARG VITE_APP_VERSION=dev
ARG VITE_GIT_COMMIT=unknown
ARG VITE_GIT_BRANCH=unknown
ARG VITE_BUILD_TIME=unknown
ARG VITE_PIPELINE_RUN=local
ENV VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_GIT_COMMIT=$VITE_GIT_COMMIT \
    VITE_GIT_BRANCH=$VITE_GIT_BRANCH \
    VITE_BUILD_TIME=$VITE_BUILD_TIME \
    VITE_PIPELINE_RUN=$VITE_PIPELINE_RUN

RUN npm run build

# ---- runtime stage (non-root, listens on 8080) ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
