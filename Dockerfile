FROM nginx:1.25-alpine

ARG BACKEND_UPSTREAM=backend-api:80
ENV BACKEND_UPSTREAM=${BACKEND_UPSTREAM}

RUN rm -rf /usr/share/nginx/html/*
COPY src/ /usr/share/nginx/html/
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Materialize the nginx config from the template using envsubst.
# Default.conf is generated at container start so the upstream can be
# overridden per-environment without rebuilding the image.
RUN envsubst '${BACKEND_UPSTREAM}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf \
    && rm /etc/nginx/conf.d/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
