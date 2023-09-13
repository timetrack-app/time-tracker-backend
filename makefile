db:
	docker-compose -f docker-compose.yml --env-file env/.env.dev build --no-cache
du:
	docker-compose -f docker-compose.yml --env-file env/.env.dev up
dd:
	docker-compose -f docker-compose.yml --env-file env/.env.dev down
create db:
	docker exec -it timetrack-app-db psql -U timetrackuser -d postgres -c "CREATE DATABASE timetrackdb;" && docker exec -it timetrack-app-db psql -U timetrackuser -d postgres -c "\q"
mg:
	docker-compose -f docker-compose.yml   --env-file env/.env.dev run dev npm run typeorm:generate src/migrations/table-init
mr:
	docker-compose -f docker-compose.yml  --env-file env/.env.dev run dev npm run typeorm:run