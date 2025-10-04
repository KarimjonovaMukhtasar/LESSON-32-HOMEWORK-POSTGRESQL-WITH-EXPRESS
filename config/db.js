import pg from "pg"
const {Pool} = pg
const client = new Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    database: "football",
    port: 5432
})  
export default client