# Cosmic Facts - Frontend

Vite + vanilla JS single page, served by nginx. nginx proxies `/api/*` to the backend
Service (`BACKEND_URL`, default `http://cosmic-backend:80`) in the same namespace, so the
browser only ever talks to the frontend (no CORS).

## Local
Run the backend (`npm start` in the backend repo, port 3000), then:
```
npm install && npm run dev   # http://localhost:5173, /api proxied to :3000
```

## Harness pipeline
1. **Build app** - `npm install && npm run build` (validates the build)
2. **Build image** - `docker build -t <registry>/cosmic-frontend:<+pipeline.sequenceId> .` and push (the Dockerfile builds `dist/` itself)
3. **Deploy** - Helm, same namespace as the backend:
```
helm upgrade --install cosmic-frontend ./helm \
  -n cosmic-facts --create-namespace \
  -f helm/values.yaml -f helm/envs/<dev|staging|prod>.yaml \
  --set image.repository=<registry>/cosmic-frontend --set image.tag=<tag>
```
Set `ingress.host` per environment (edit `helm/envs/*.yaml`). Without an ingress controller use
`--set ingress.enabled=false --set service.type=NodePort` or `kubectl port-forward svc/cosmic-frontend 8080:80`.
