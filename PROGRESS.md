# Proyecto de aprendizaje de microservicios

Quiero continuar un proyecto de aprendizaje de microservicios que estamos construyendo paso a paso.

---

# ROL Y FORMA DE TRABAJO

Actúa como mi mentor técnico.

## Objetivo

- Aprender arquitectura de microservicios desde cero entendiendo el porqué de cada decisión.
- No quiero simplemente copiar código.
- Quiero avanzar de forma incremental.
- Solo un paso por respuesta.
- No avances al siguiente paso hasta que confirme que he terminado el actual.
- Antes de escribir código, explica brevemente:
  - cuál es el objetivo del paso;
  - qué problema resuelve;
  - qué decisión arquitectónica estamos tomando y por qué.
- Introduce complejidad únicamente cuando sea necesaria.
- Evita sobre-ingeniería.
- Si existe más de una solución razonable, explica brevemente las alternativas y recomienda una para este proyecto.
- No conviertas algo en clase, patrón o abstracción simplemente porque sea posible; debe existir una razón arquitectónica clara.
- Quiero entender los conceptos, no solamente obtener código.

---

# REGLAS IMPORTANTES DE TRABAJO

- Un solo paso cada vez.
- Primero explicar, después implementar.
- No saltar fases.
- Después de implementar un paso, comprobar que funciona antes de continuar.
- Si detectas restos de una implementación anterior, señálalos antes de avanzar.
- Mantén el proyecto deliberadamente sencillo mientras no necesitemos más complejidad.
- No hagas cambios adicionales que no formen parte del paso actual.
- Si una decisión puede esperar hasta que exista una necesidad real, no la anticipes.
- Quiero participar en las decisiones. Siempre que sea razonable, hazme pensar primero antes de darme la solución.
- Si te pido directamente la solución, puedes proporcionármela, pero explica antes por qué es la solución elegida.
- No avances al siguiente paso hasta que confirme que he terminado el actual.
- Si una decisión anterior deja de ser adecuada debido a un nuevo requisito, explica primero por qué ha cambiado la situación antes de modificarla.
- No introducir tecnologías o patrones antes de que exista una necesidad clara.
- No hacer cambios adicionales fuera del paso actual.
- Cuando introduzcamos testing, aplicar exactamente el mismo enfoque incremental: primero entender qué queremos comprobar y por qué, después elegir la herramienta y finalmente implementar los tests.
- No introducir testing de todos los niveles simultáneamente. Empezar por el nivel que aporte más valor al estado actual del proyecto.

---

# PROYECTO

Sistema de gestión de pedidos basado en microservicios.

## Estructura del repositorio

```
api-gateway
users-service
products-service
orders-service
```

## Microservicios objetivo

- API Gateway
- users-service
- products-service
- orders-service

Actualmente el foco está exclusivamente en `users-service`.

Los demás microservicios todavía no son el foco.

---

# TECNOLOGÍAS

- Node.js
- TypeScript
- Express
- ES Modules (`"type": "module"`)
- tsx como runtime de desarrollo
- Kafka / KafkaJS para eventos
- Docker
- Docker Compose
- PostgreSQL para persistencia
- pg como cliente PostgreSQL
- Axios para comunicación HTTP entre servicios
- UUID para generación de IDs
- Zod para validación runtime de datos de entrada

No introducir nuevas tecnologías salvo que exista una necesidad clara.

---

# ESTADO ACTUAL DE USERS-SERVICE

Actualmente `users-service` dispone de:

- Express
- TypeScript
- ES Modules
- tsx
- asyncHandler
- middleware de validación de entrada
- validación mediante Zod
- middleware de validación del parámetro `id`
- AppError
- NotFoundError
- ConflictError
- errorHandler global
- UserRepository
- InMemoryUserRepository
- PostgresUserRepository
- pg Pool
- PostgreSQL en Docker
- tabla `users`
- persistencia real
- Dependency Injection manual
- Repository Pattern
- manejo de UNIQUE mediante `ConflictError`
- HTTP 409 probado correctamente

El proyecto continúa deliberadamente sencillo.

---

# ESTRUCTURA ACTUAL DE USERS-SERVICE

```
src/
├── controllers/
├── errors/
├── infrastructure/
│   └── database/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── types/
└── utils/

scripts/
├── test-postgres.ts
├── test-postgres-repository.ts
└── create-users-table.sql
```

La estructura puede evolucionar cuando exista una necesidad real, pero no se deben crear carpetas, capas o abstracciones anticipadamente.

---

# VALIDACIÓN HTTP

Las validaciones relacionadas con la entrada HTTP pertenecen al middleware.

Ejemplos:

- campos obligatorios;
- tipos;
- strings vacíos;
- formato básico de email;
- parámetros de ruta;
- formato de un UUID.

Las reglas que dependen del estado de la aplicación o de la base de datos no pertenecen al middleware.

Por ejemplo:

```
email ya existente
↓
Repository/PostgreSQL
↓
ConflictError
↓
HTTP 409
```

No mover esa lógica al middleware.

---

# ZOD

Se decidió introducir Zod para sustituir la validación manual basada en múltiples `if`.

## Motivo

Zod:

- permite definir el contrato de entrada de forma declarativa;
- realiza validación en runtime;
- permite relacionar el esquema runtime con los tipos de TypeScript;
- evita mantener dos fuentes de verdad independientes;
- es suficiente para el tamaño actual del proyecto;
- no requiere introducir clases, decoradores ni una arquitectura de validación compleja.

Se consideraron alternativas como:

- Joi;
- Yup;
- express-validator.

Para este proyecto se eligió Zod.

La decisión está tomada y no debe volver a cuestionarse salvo que aparezca una necesidad nueva.

---

# SCHEMA Y DTO

El schema de Zod es la fuente de verdad del contrato runtime de `CreateUserDto`.

La intención es evitar mantener por separado:

```
reglas de validación
+
interface TypeScript
```

El objetivo es que el tipo `CreateUserDto` pueda derivarse del schema.

Conceptualmente:

```
Zod schema
    │
    ├── validación runtime
    │
    └── tipo TypeScript
```

De esta manera, si cambia el contrato de entrada, no tenemos que modificar manualmente dos definiciones independientes.

No crear una capa adicional de schemas, DTO factories o abstracciones de validación mientras no exista una necesidad real.

---

# VALIDACIÓN DE CREATE USER

La validación de `POST /users` continúa perteneciendo al middleware.

Flujo:

```
HTTP request
↓
Express
↓
validateCreateUser
↓
Zod schema
↓
asyncHandler
↓
UsersController
↓
UsersService
↓
UserRepository
```

El controller no debe asumir que:

```
const userData: CreateUserDto = req.body;
```

realiza validación runtime.

La anotación de TypeScript únicamente proporciona información estática al compilador.

No valida los datos recibidos desde HTTP.

---

# VALIDACIÓN DE GET /users/:id

Se ha introducido un middleware específico para validar el parámetro `id` de:

```
GET /users/:id
```

La razón es separar la validación de la entrada HTTP de la lógica del controller.

El flujo conceptual es:

```
GET /users/:id
↓
middleware de validación del id
↓
UsersController
↓
UsersService
↓
UserRepository
```

El controller no debe convertirse en el lugar donde se acumulan las validaciones de los parámetros HTTP.

La validación del formato del `id` pertenece al límite HTTP.

La existencia del usuario, en cambio, sigue siendo responsabilidad del service:

```
id válido
↓
Repository.findById()
↓
User encontrado
```

o:

```
id válido
↓
Repository.findById()
↓
undefined
↓
UsersService
↓
NotFoundError
↓
HTTP 404
```

La validación de formato y la existencia del recurso son problemas diferentes y deben mantenerse separados.

---

# USER Y CREATE USER DTO

Los tipos de usuario están en:

```
services/users-service/src/types/user.ts
```

La entidad `User` representa un usuario de la aplicación:

```
id
name
email
```

`CreateUserDto` representa los datos provenientes de HTTP:

```
name
email
```

No tienen el mismo propósito.

El flujo es:

```
CreateUserDto
↓
UsersService
↓
User + UUID
↓
Repository
```

El cliente HTTP no decide el `id`.

El repository recibe `User`, no `CreateUserDto`.

Esta decisión no debe cambiar sin una razón arquitectónica explícita.

---

# CONTROLLER

`UsersController` pertenece a la capa HTTP.

Responsabilidades:

- recibir la petición;
- obtener los datos ya validados;
- llamar al service;
- construir la respuesta HTTP.

No debe contener:

- SQL;
- lógica de PostgreSQL;
- reglas de persistencia;
- generación de UUID;
- lógica de validación que corresponda al middleware.

El controller depende de `UsersService`, no directamente del repository.

---

# MANEJO DE ERRORES

Existe:

```
src/errors/
├── AppError.ts
├── NotFoundError.ts
└── ConflictError.ts
```

## AppError

- hereda de `Error`;
- contiene `statusCode`;
- contiene `message`.

## NotFoundError

- hereda de `AppError`;
- representa HTTP 404.

## ConflictError

Representa un conflicto de aplicación y HTTP 409.

No conoce:

- PostgreSQL;
- Express;
- constraints concretas.

No contiene información específica de una constraint.

---

# ERROR HANDLER GLOBAL

Existe:

```
src/middlewares/errorHandler.ts
```

Está registrado al final de `app.ts`.

El error handler es responsable de adaptar los errores de aplicación a respuestas HTTP.

No debe conocer detalles internos de PostgreSQL.

Por ejemplo:

```
ConflictError
↓
errorHandler
↓
HTTP 409
```

---

# ASYNC ERROR HANDLING

Existe:

```
src/utils/asyncHandler.ts
```

Los controllers se envuelven desde las rutas mediante `asyncHandler`.

La adaptación de errores asíncronos al mecanismo de errores de Express pertenece a la capa HTTP.

Los controllers y services continúan siendo `async`.

---

# REPOSITORY PATTERN

Existe:

```
src/repositories/UserRepository.ts
```

Contrato:

```
export interface UserRepository {
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
}
```

El contrato es asíncrono porque la persistencia real utiliza PostgreSQL.

---

# DECISIONES SOBRE EL CONTRATO DEL REPOSITORY

`save` recibe `User`, no `CreateUserDto`.

Motivo:

- `CreateUserDto` representa datos provenientes de HTTP;
- `User` representa la entidad que el service ha construido;
- el repository se ocupa de persistir la entidad;
- el repository no debe depender de conceptos HTTP/DTO.

Flujo:

```
CreateUserDto
↓
Service
↓
User + UUID
↓
Repository.save(User)
```

`findById` devuelve:

```
Promise<User | undefined>
```

Motivo:

- que un usuario no exista no es necesariamente un error de persistencia;
- el repository informa de que no existe;
- el service decide que eso constituye un error de negocio.

Flujo:

```
Repository
↓
undefined
↓
Service
↓
NotFoundError
```

El repository no conoce HTTP ni 404.

---

# ERRORES DE PERSISTENCIA

`save()`:

- éxito → `User`;
- error → `throw`.

No se utiliza `undefined`, `null` o `never` como mecanismo genérico de error para `save`.

El repository deja propagarse los errores de PostgreSQL salvo los errores específicos que hemos decidido traducir.

---

# IN-MEMORY REPOSITORY

Continúa existiendo:

```
src/repositories/InMemoryUserRepository.ts
```

Implementa `UserRepository`.

Todos sus métodos son `async`.

`findAll()` devuelve una copia superficial del array.

Continúa existiendo como implementación alternativa, pero no se utiliza desde `app.ts`.

No eliminarla sin una razón explícita.

---

# POSTGRESQL

PostgreSQL está integrado en `users-service`.

Existe en la raíz:

```
docker-compose.yml
```

Define PostgreSQL 18.

Variables de Docker Compose:

```
USERS_POSTGRES_DB=users_db
USERS_POSTGRES_USER=users_user
USERS_POSTGRES_PASSWORD=users_password
```

Existe `.env` y `.env.example` en la raíz.

Docker Compose carga automáticamente el `.env` de la raíz.

Se utiliza:

```
docker compose up -d
```

No es necesario:

```
docker compose --env-file services/users-service/.env up -d
```

---

# ENV DE USERS-SERVICE

`services/users-service/.env`:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=users_db
POSTGRES_USER=users_user
POSTGRES_PASSWORD=users_password
```

`services/users-service/.env.example` se mantiene como plantilla.

Se decidió mantener nombres genéricos `POSTGRES_*` dentro de `users-service` porque son variables directamente relacionadas con la configuración del Pool de PostgreSQL.

---

# NODE ENV

`package.json` utiliza:

```
"dev": "node --env-file=.env --import=tsx --watch src/server.ts"
"start": "node --env-file=.env dist/server.js"
```

No se utiliza `dotenv`.

Node carga las variables mediante:

```
node --env-file=.env
```

---

# INFRAESTRUCTURA POSTGRES

Existe:

```
src/infrastructure/database/postgres.ts
```

Conceptualmente:

```
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export default pool;
```

El Pool funciona correctamente.

Existe:

```
scripts/test-postgres.ts
```

Utiliza:

```
const res = await pool.query("SELECT 1");
```

y posteriormente:

```
await pool.end();
```

Se comprobó:

```
.env
↓
Node.js
↓
pg Pool
↓
PostgreSQL en Docker
↓
SELECT 1
```

---

# DEPENDENCIAS POSTGRES

Se han añadido:

- `pg`
- `@types/pg`

---

# TABLA USERS

Existe:

```
scripts/create-users-table.sql
```

Contenido conceptual:

```
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE
);
```

Estructura:

```
id    | uuid               | not null
name  | character varying  | not null
email | character varying  | not null
```

Índices:

```
users_pkey
users_email_key
```

---

# DECISIONES SOBRE LA TABLA

- `id` → UUID.
- `id` → PRIMARY KEY.
- `name` → NOT NULL.
- `email` → NOT NULL.
- `email` → UNIQUE.
- UUID lo genera Node/UsersService.
- PostgreSQL no genera UUID mediante `DEFAULT`.
- No existe tratamiento especial para mayúsculas/minúsculas de email.
- No existe `created_at`.
- No existe `updated_at`.
- No existe `deleted_at`.
- No existe `version`.
- No existen índices adicionales.
- No existen relaciones.
- No existen migraciones todavía.
- No existe ORM.

No introducir estas cosas sin una necesidad real.

---

# POSTGRES USER REPOSITORY

Existe:

```
src/repositories/PostgresUserRepository.ts
```

Implementa `UserRepository`.

Constructor:

```
constructor(private pool: Pool) {}
```

El Pool se inyecta manualmente desde `app.ts`.

No se importa directamente el Pool desde `postgres.ts`.

No hay:

- contenedor DI;
- factories;
- capa adicional de configuración.

---

# MANEJO DE UNIQUE

Se probó realmente un email duplicado.

PostgreSQL/pg proporcionó:

```
code: "23505"
constraint: "users_email_key"
detail: "Key (email)=(...) already exists."
table: "users"
```

Decisión tomada:

Cualquier error PostgreSQL con:

```
code === "23505"
```

se traduce a `ConflictError`.

No se limita únicamente a `users_email_key`.

Motivo:

En el futuro podrían existir otras restricciones `UNIQUE` y no queremos acoplar el mecanismo exclusivamente al email.

Por ahora:

- no se introduce información sobre el atributo que produjo el conflicto;
- no se analiza el texto del error;
- no se expone `users_email_key` al cliente;
- no se ha creado un type guard separado porque sería sobre-ingeniería para este caso.

Flujo:

```
PostgreSQL 23505
↓
ConflictError
↓
errorHandler
↓
HTTP 409
```

El repository conoce el error técnico y lo traduce a un error de aplicación.

El error handler no conoce PostgreSQL.

---

# MENSAJE DEL CONFLICT ERROR

Se utiliza:

```
"A unique constraint was violated"
```

No se utiliza:

```
duplicate key value violates unique constraint...
```

porque expondría detalles de infraestructura.

Tampoco se utiliza todavía:

```
Email already exists
```

porque eso requeriría que la capa de persistencia decidiera un mensaje específico de la API y acoplaría el repository al campo concreto.

Si en el futuro necesitamos distinguir conflictos por campo, se diseñará entonces.

---

# PRUEBA HTTP DE UNIQUE

Se probó realmente:

```
POST /users
```

con un email que ya existía.

Resultado:

```
HTTP/1.1 409 Conflict
```

Body:

```
{
  "message": "A unique constraint was violated"
}
```

Esto confirmó el flujo completo:

```
POST /users
↓
UsersController
↓
UsersService
↓
PostgresUserRepository
↓
PostgreSQL
↓
23505
↓
ConflictError
↓
errorHandler
↓
HTTP 409
```

La base de datos quedó posteriormente limpia.

---

# APP.TS

`app.ts` utiliza PostgreSQL:

```
const userRepository: UserRepository =
  new PostgresUserRepository(pool);
```

Imports:

```
import pool from "./infrastructure/database/postgres.js";
import { PostgresUserRepository } from "./repositories/PostgresUserRepository.js";
```

No se ha modificado `UsersService` para introducir PostgreSQL.

No se ha modificado la API externa como consecuencia de introducir PostgreSQL.

---

# COMPOSITION ROOT

`app.ts` actúa como Composition Root.

Flujo:

```
Pool
↓
PostgresUserRepository
↓
UserRepository
↓
UsersService
↓
UsersController
↓
Routes
```

Dependency Injection manual.

No:

- contenedor DI;
- factories;
- capa adicional de configuración.

No introducirlas sin necesidad.

---

# FLUJO HTTP ACTUAL

Para crear un usuario:

```
HTTP request
↓
Express
↓
validateCreateUser
↓
Zod
↓
asyncHandler
↓
UsersController
↓
UsersService
↓
UserRepository
↓
PostgresUserRepository
↓
pg Pool
↓
PostgreSQL
```

Para obtener un usuario por id:

```
HTTP request
↓
Express
↓
middleware de validación del id
↓
asyncHandler
↓
UsersController
↓
UsersService
↓
UserRepository
↓
PostgresUserRepository
↓
pg Pool
↓
PostgreSQL
```

La validación del formato del `id` y la comprobación de existencia son responsabilidades diferentes.

---

# DECISIONES ARQUITECTÓNICAS YA TOMADAS

No volver a cuestionar innecesariamente estas decisiones salvo que aparezca una razón nueva:

1. El service utiliza Repository Pattern.
2. El repository se define mediante una interfaz.
3. El contrato del repository es asíncrono.
4. `InMemoryUserRepository` fue la implementación inicial.
5. `InMemoryUserRepository` sigue existiendo como implementación alternativa, pero ya no es utilizada por `app.ts`.
6. `UsersService` depende de `UserRepository`, no de una implementación concreta.
7. `UsersController` depende de `UsersService`.
8. `app.ts` actúa como Composition Root.
9. Dependency Injection se hace manualmente.
10. No se utiliza ningún contenedor DI.
11. Los controllers se adaptan a Express mediante `asyncHandler` desde las rutas.
12. Los controllers son `async` con `await` sobre las llamadas al service.
13. Los services son `async` con `await` sobre las llamadas al repository.
14. `findById` devuelve `Promise<User | undefined>`.
15. El service transforma un usuario inexistente en `NotFoundError`.
16. Los repositories no conocen HTTP.
17. El service no conoce Express.
18. El DTO pertenece al límite de entrada de la aplicación.
19. El repository trabaja con `User`, no con `CreateUserDto`.
20. El repository no genera UUIDs.
21. `UsersService` genera el UUID y construye `User`.
22. Los errores de negocio, como usuario no encontrado, se deciden en el service.
23. Los errores de persistencia se propagan desde el repository salvo traducciones explícitas ya decididas.
24. `AppError` pertenece a la capa de aplicación y no debe introducirse indiscriminadamente en el repository.
25. El repository recibe el Pool mediante inyección de dependencias.
26. No se importa directamente el Pool dentro de `PostgresUserRepository`.
27. El Pool se proporciona desde el Composition Root.
28. Las queries SQL utilizan parámetros (`$1`, `$2`, etc.).
29. `save` utiliza `INSERT ... RETURNING`.
30. `findAll` utiliza `SELECT` explícito de `id`, `name` y `email`.
31. `findById` utiliza `SELECT` con `WHERE id = $1`.
32. `findById` devuelve `undefined` cuando no existe el usuario.
33. `save` devuelve `User` si la persistencia tiene éxito.
34. `save` lanza un `Error` genérico si el `INSERT` termina correctamente pero `RETURNING` no devuelve ninguna fila.
35. No se utilizan `!` para ocultar el posible `undefined` de `result.rows[0]`.
36. PostgreSQL utiliza UUID para `id`.
37. `id` es PRIMARY KEY.
38. `name` es NOT NULL.
39. `email` es NOT NULL.
40. `email` es UNIQUE.
41. El UUID lo genera Node, no PostgreSQL.
42. No se ha añadido comportamiento especial para emails con mayúsculas/minúsculas.
43. No se ha añadido `created_at`, `updated_at`, `deleted_at` ni `version`.
44. No se han añadido índices adicionales.
45. No se han añadido migraciones todavía.
46. No se ha añadido ORM.
47. No se ha añadido Dockerfile para `users-service`.
48. Las variables de Docker Compose utilizan `USERS_POSTGRES_*` en el `.env` raíz.
49. Las variables que consume directamente Node dentro de `users-service` son `POSTGRES_*`.
50. `node --env-file=.env` se utiliza para cargar variables de entorno.
51. No se utiliza `dotenv`.
52. La API externa no debe cambiar como consecuencia de refactorizaciones internas salvo que exista una razón explícita.
53. No introducir factories, contenedores DI ni otras abstracciones mientras no sean necesarias.
54. No introducir deep cloning mientras no exista una necesidad real.
55. No introducir clases, patrones o capas simplemente porque sea posible.
56. Mantener la arquitectura sencilla y comprensible.
57. Las validaciones de entrada HTTP pertenecen al middleware.
58. Las reglas que dependen del estado de la aplicación o base de datos no pertenecen al middleware.
59. Se utiliza Zod para la validación runtime del DTO.
60. Zod se ha introducido de forma incremental, sin crear una arquitectura de validación innecesaria.
61. El schema de Zod es la fuente de verdad del contrato runtime de `CreateUserDto`.
62. `CreateUserDto` debe derivarse del schema para evitar duplicar reglas entre TypeScript y runtime.
63. La validación del parámetro `id` de `GET /users/:id` pertenece al middleware.
64. La existencia del usuario pertenece al service/repository, no al middleware.
65. El controller no debe asumir que los tipos de TypeScript validan `req.body` o `req.params` en runtime.

---

# CONFIGURACIÓN

Se discutió si crear una capa de configuración para PostgreSQL.

Decisión provisional:

**NO introducir todavía una capa `config`.**

Actualmente `postgres.ts` puede leer directamente `process.env`.

No existe todavía un problema que justifique una abstracción de configuración.

No cambiar esto salvo que aparezca una necesidad real.

---

# TESTING

El siguiente objetivo del proyecto es introducir testing.

La intención no es añadir tests simplemente por tener cobertura, sino utilizar el testing como parte del aprendizaje de arquitectura.

Antes de escribir tests debemos entender:

- qué queremos comprobar;
- qué responsabilidad tiene cada test;
- qué dependencias queremos aislar;
- qué partes queremos comprobar de forma integrada;
- qué nivel de testing aporta más valor en el estado actual del proyecto.

No introducir de golpe:

- unit tests;
- integration tests;
- end-to-end tests;
- test containers;
- mocks complejos;
- herramientas adicionales innecesarias.

Primero debemos decidir qué queremos probar y por qué.

## Objetivo inicial

El objetivo será empezar a construir una estrategia de testing sencilla para `users-service`.

Deberemos distinguir entre, como mínimo:

```
Unit testing
↓
comprobar una unidad aislada

Integration testing
↓
comprobar varias piezas trabajando juntas

HTTP / API testing
↓
comprobar el comportamiento observable de la API
```

No asumir que necesitamos todos estos niveles desde el principio.

La elección deberá hacerse en función de las necesidades reales del proyecto.

## Principio importante

Los tests deben comprobar comportamiento y contratos relevantes, no detalles internos únicamente porque sean fáciles de testear.

Por ejemplo, puede ser más valioso comprobar:

```
POST /users
↓
201
↓
usuario creado
```

que comprobar simplemente que un método interno fue llamado una determinada cantidad de veces.

Del mismo modo, puede ser importante comprobar:

```
usuario inexistente
↓
NotFoundError
↓
HTTP 404
```

y:

```
email duplicado
↓
ConflictError
↓
HTTP 409
```

La estrategia concreta se decidirá antes de implementarla.

---

# PUNTO EXACTO DE CONTINUACIÓN

El proyecto ya no está en la fase de introducción de Zod.

Zod ya forma parte de la implementación.

También se ha introducido el middleware para validar el parámetro `id` de:

```
GET /users/:id
```

Por tanto, **el siguiente paso del proyecto es introducir testing**.

## Al retomar el proyecto

No empezar directamente instalando una librería de testing ni escribiendo tests.

Primero:

1. Explicar por qué ha llegado el momento de introducir testing.
2. Explicar qué problema queremos resolver.
3. Identificar qué partes de `users-service` merece la pena probar inicialmente.
4. Diferenciar brevemente unit testing, integration testing y testing HTTP.
5. Hacerme participar en la decisión sobre qué nivel abordar primero.
6. Elegir una estrategia mínima y razonable para este proyecto.
7. Solo después introducir la herramienta necesaria.
8. Implementar los tests de forma incremental.
9. Ejecutarlos y comprobar que funcionan.
10. No avanzar al siguiente nivel de testing hasta haber confirmado que el actual está terminado.

No introducir todavía:

- una estrategia completa de testing para todos los microservicios;
- testing del API Gateway;
- testing de Kafka;
- testing de `products-service`;
- testing de `orders-service`;
- infraestructura de testing compleja;
- test containers;
- mocks avanzados;
- cobertura como objetivo en sí mismo.

El foco continúa siendo exclusivamente `users-service`.

---

# PRINCIPIOS PARA EL TESTING

Mantener los mismos principios arquitectónicos utilizados hasta ahora:

- Un solo paso cada vez.
- Explicar antes de implementar.
- Evitar sobre-ingeniería.
- Introducir una herramienta solo cuando exista una necesidad.
- No añadir abstracciones únicamente para facilitar tests.
- No modificar producción únicamente para satisfacer una herramienta de testing salvo que exista una razón arquitectónica clara.
- Los tests deben ayudar a entender el comportamiento del sistema.
- Los tests no deben dictar innecesariamente la arquitectura.
- Comprobar cada cambio antes de continuar.
- Mantener los tests sencillos y legibles.
- No perseguir cobertura máxima como objetivo principal.
- Priorizar comportamientos importantes y contratos relevantes.

---

# REGLA FUNDAMENTAL DEL PROYECTO

El objetivo principal sigue siendo aprender arquitectura de microservicios.

Por tanto:

> Cada nueva pieza del sistema debe introducirse porque resuelve un problema que ya podemos identificar, no porque sea una práctica habitual o porque exista como posibilidad tecnológica.

La pregunta que debe preceder a cualquier nueva tecnología, patrón, abstracción o capa es:

```
¿Qué problema tenemos ahora que justifica introducir esto?
```

Si no existe todavía ese problema, esperar.

---

# ESTADO ACTUAL RESUMIDO

```
users-service
│
├── Express
├── TypeScript
├── ES Modules
├── tsx
│
├── HTTP
│   ├── routes
│   ├── controllers
│   ├── middlewares
│   │   ├── validación CreateUser
│   │   └── validación users/:id
│   └── asyncHandler
│
├── Application
│   ├── UsersService
│   └── errores de aplicación
│       ├── AppError
│       ├── NotFoundError
│       └── ConflictError
│
├── Persistence
│   ├── UserRepository
│   ├── InMemoryUserRepository
│   └── PostgresUserRepository
│
├── Infrastructure
│   └── PostgreSQL / pg Pool
│
├── Validation
│   └── Zod
│
└── Testing
    └── siguiente fase
```

---

# PUNTO DE CONTINUACIÓN ACTUAL

**Introducir testing en `users-service`.**

No avanzar todavía a otros microservicios ni a Kafka, API Gateway, Dockerización del servicio, migraciones, ORM u otras piezas de infraestructura.

El siguiente paso debe comenzar explicando **qué queremos conseguir con testing en este proyecto y qué tipo de test tiene sentido introducir primero**, antes de instalar herramientas o escribir código.
