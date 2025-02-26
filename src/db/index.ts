import { Pool } from "pg";

// Connect to database
const db = new Pool({
  host: "localhost",
  database: "brighte",
  port: 5432,
});

db.connect((err: any, connection: any) => {
  if (err) throw err;
  console.log("Database connected !");
  connection.release();
});

db.on("error", (err, client) => {
  console.error("Unexpected DB connection error", err);
  process.exit(-1);
});

export default db;
