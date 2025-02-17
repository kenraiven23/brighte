import client from ".";

export async function defaultTables() {
  try {
    // Check if database is existing
    const DB_NAME: string = process.env.DB_HOST || "brighte";
    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`
    );

    if (res.rowCount === 0) {
      console.log(`${DB_NAME} database not found, creating it.`);
      await client.query(`CREATE DATABASE "${DB_NAME}";`);
      console.log(`created database ${DB_NAME}`);
    } else {
      console.log(`${DB_NAME} database exists.`);
    }

    // check if tables are existing
    const customerTable = await client.query(
      `SELECT count(*) FROM information_schema.tables WHERE table_name = 'customers'`
    );
    if (parseInt(customerTable?.rows[0]?.count) === 0) {
      await client.query(`
        CREATE TABLE customers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            mobile VARCHAR(255) NOT NULL,
            post_code VARCHAR(255) NOT NULL
        )
    `);
      console.log("Done creating customers table");
    }

    // check if service_interest table is existing
    const serviceInterestTable = await client.query(
      `SELECT count(*) FROM information_schema.tables WHERE table_name = 'service_interest'`
    );
    if (parseInt(serviceInterestTable?.rows[0]?.count) === 0) {
      await client.query(`
        CREATE TABLE service_interest (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `);
      // insert default value
      await client.query(`
        INSERT INTO service_interest (name) VALUES ('delivery'),('pick-up'),('payment')
    `);
      console.log("Done creating service_interest table");
    }

    // check if customer_service_table is existing
    const customerServiceInterestTable = await client.query(
      `SELECT count(*) FROM information_schema.tables WHERE table_name = 'customer_service_interest'`
    );
    if (parseInt(customerServiceInterestTable?.rows[0]?.count) === 0) {
      await client.query(`
        CREATE TABLE customer_service_interest(
        id SERIAL PRIMARY KEY,
        customer_id INT,
        service_interest_id INT,
        CONSTRAINT fk_customer
            FOREIGN KEY(customer_id)
                REFERENCES customers(id),
        CONSTRAINT fk_service_interest
            FOREIGN KEY(service_interest_id)
                REFERENCES service_interest(id)
        );
    `);
      console.log("Done creating customer_service_interest table");
    }
  } catch (error: any) {
    console.log("Error in creating defaultTables", error.stack);
  }
}
