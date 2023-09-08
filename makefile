install:
	docker container exec -it eo-api-v2 sh -c "yarn install"
migration-generate:
	docker-compose -f docker-compose.yml  run dev npm run typeorm:generate src/migrations/table-init
migration-create:
	docker-compose -f docker-compose.yml  run dev npm run typeorm:create src/migrations/table-init
migration-run:
	docker-compose -f docker-compose.yml  run dev npm run typeorm:run