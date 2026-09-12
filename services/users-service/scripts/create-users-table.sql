CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE
);

/*
EJECUTAR SCRIPT:
docker compose exec -T postgres psql -U users_user -d users_db < services/users-service/scripts/create-users-table.sql

COMPROBAR QUE LA TABLA EXISTE:
docker compose exec postgres psql -U users_user -d users_db -c "\d users"
*/