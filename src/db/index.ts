import { Pool } from "pg";

// Connect to database
const client = new Pool({
  host: "localhost",
  database: "brighte",
  port: 5432,
});
client.connect();

export default client;