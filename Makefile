bootstrap:
	cd backend && npm ci
	cd frontend && npm ci || true

test:
	cd backend && npm run build && npm test

up:
	docker compose up -d

start-api:
	cd backend && npm run build && sam local start-api --template ../infra/template.yaml
