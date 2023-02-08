docker run --name thebureau-postgres -p 5434:5432 -e POSTGRES_PASSWORD=postgres -d postgres
docker exec thebureau-postgres dir
docker cp ./initial.sql thebureau-postgres:/initial.sql
docker exec thebureau-postgres dir
docker exec -it thebureau-postgres psql -p 5432 -U postgres -d postgres -f initial.sql