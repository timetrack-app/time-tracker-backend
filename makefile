docker build:
	docker-compose -f docker-compose.yml --env-file env/.env.dev build --no-cache
dcbuild:
	docker compose -f docker-compose-arm.yml --env-file env/.env.dev build --no-cache
du:
	docker-compose -f docker-compose.yml --env-file env/.env.dev up
dcu:
	docker compose -f docker-compose-arm.yml --env-file env/.env.dev up
dcu-d:
	docker compose -f docker-compose-arm.yml --env-file env/.env.dev up -d
dd:
	docker-compose -f docker-compose.yml --env-file env/.env.dev down
dcd:
	docker compose -f docker-compose-arm.yml --env-file env/.env.dev down
dps:
	docker-compose -f docker-compose.yml --env-file env/.env.dev ps
dcps:
	docker compose -f docker-compose-arm.yml --env-file env/.env.dev ps
create db:
	docker exec -it timetrack-app-db psql -U timetrackuser -d postgres -c "CREATE DATABASE timetrackdb;" && docker exec -it timetrack-app-db psql -U timetrackuser -d postgres -c "\q"
migration create:
	docker-compose -f docker-compose.yml   --env-file env/.env.dev run dev npm run typeorm:create src/migrations/table-init
dc migration create:
	docker compose -f docker-compose-arm.yml   --env-file env/.env.dev run dev npm run typeorm:create src/migrations/table-init
migration generate:
	docker-compose -f docker-compose.yml   --env-file env/.env.dev run dev npm run typeorm:generate src/migrations/table-init
dc migration generate:
	docker compose -f docker-compose-arm.yml   --env-file env/.env.dev run dev npm run typeorm:generate src/migrations/table-init
migration run:
	docker-compose -f docker-compose.yml  --env-file env/.env.dev run dev npm run typeorm:run
dc migration run:
	docker compose -f docker-compose-arm.yml  --env-file env/.env.dev run dev npm run typeorm:run