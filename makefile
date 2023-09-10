du:
	docker-compose -f docker-compose.yml --env-file .env.dev up
dd:
	docker-compose -f docker-compose.yml --env-file .env.dev down
mg:
	docker-compose -f docker-compose.yml  run dev npm run typeorm:generate src/migrations/table-init
mc:
	docker-compose -f docker-compose.yml  run dev npm run typeorm:create src/migrations/table-init
mr:
	docker-compose -f docker-compose.yml  run dev npm run typeorm:run