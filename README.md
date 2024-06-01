# CSE 340 start project

start in dev mode: 

`pnpm i` and `npm run dev`

prod build: 

`pnpm i` and `npm run build` and `npm run start`

Env var `DB_CONNECTION_STRING` is required. this should point to postgresql sever and to a specific DB that has a schema matching the queries in `database/db_backup.sql`
