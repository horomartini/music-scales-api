# music-scales-api
University project for 7th semester. API for quick access to music scales and other helpful tools for music.

run `docker compose up --build --no-cache` to run dev mode or `docker compose build --no-cache & docker compose up`

? `docker-compose rm -f` | `docker-compose down && docker-compose build --no-cache && docker-compose up`

`docker compose up --watch`

### login do mongo:
> docker > exec \
> mongosh "mongodb://overlord:ENV.PWD@localhost:27017/maindb?authSource=admin"

### knowledge
- [rest caching](https://restfulapi.net/caching/)
- [rest versioning](https://restfulapi.net/versioning/)
