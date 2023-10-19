all: reload

start: fclean reload

stop:
	docker-compose -f docker-compose.yml down

clean: stop
	docker system prune -af

fclean: clean
	docker volume rm -f 
	docker volume rm -f

nocache:
	docker-compose -f docker-compose.yml build --no-cache

reload:
	docker-compose -f docker-compose.yml up -d --build

re: fclean no-cache
.PHONY: stop clean reload fclean all