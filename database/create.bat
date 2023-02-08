docker run --name some-postgres -p 5434:5432 -e POSTGRES_PASSWORD=postgres -d postgres
docker exec some-postgres dir
docker cp ./initial.sql some-postgres:/initial.sql
docker exec some-postgres dir
docker exec -it some-postgres psql -p 5432 -U postgres -d postgres -f initial.sql