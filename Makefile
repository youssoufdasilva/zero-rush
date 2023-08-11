start:
	@docker compose -p game -f docker-compose.yml up -d

stop:
	@docker compose -p game -f docker-compose.yml stop

down:
	@docker compose -p game -f docker-compose.yml down

destroy:
	@docker compose -p game -f docker-compose.yml down -v

build:
	@docker compose -p game -f docker-compose.yml build
	
build_no_cache:
	@docker compose -p game -f docker-compose.yml build --no-cache

logs: 
	@docker compose -p game -f docker-compose.yml logs -f

