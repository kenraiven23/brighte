export default {
  Query: {
    leads: async (parent: any, args: any, context: any) => {
      return (
        await context.db
          .query(`SELECT t1.*, COALESCE(t2.total, 0) as total FROM service_interest AS t1 LEFT JOIN ( 
                SELECT service_interest_id, SUM(1) AS total 
                FROM customer_service_interest GROUP BY service_interest_id
            ) t2 ON t1.id = t2.service_interest_id`)
      ).rows;
    },
    lead: async (parent: any, args: any, context: any) => {
      return (
        await context.db.query(
          `SELECT t1.*, COALESCE(t2.total, 0) AS total FROM service_interest AS t1 LEFT JOIN ( 
                SELECT service_interest_id, SUM(1) AS total 
                FROM customer_service_interest GROUP BY service_interest_id
            ) t2 ON t1.id = t2.service_interest_id where t1.id=($1)`,
          [args.id]
        )
      ).rows[0];
    },
  },
  Mutation: {
    customer: async (parent: any, args: any, context: any) => {
      try {
        const { db } = context;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailPattern.test(args.email);
        if (!isValidEmail) throw new Error("Invalid email");

        /**
         * Check if email already exists
         */
        const checkEmailIfExisting = (
          await db.query("SELECT * FROM customers WHERE email=($1)", [
            args.email,
          ])
        ).rowCount;
        if (checkEmailIfExisting > 0) throw new Error("Email already exists");

        /**
         * Validate service interest value
         */
        var params = [];
        for (var i = 1; i <= args.service_interest.length; i++) {
          params.push("$" + i);
        }

        const serviceInterest = await db.query(
          `SELECT * FROM service_interest WHERE name IN (${params.join(",")})`,
          args.service_interest
        );

        if (serviceInterest.rowCount !== args.service_interest.length)
          throw new Error("Invalid service interest value");

        /**
         * Insert customer
         */
        const insertResult = (
          await db.query(
            "INSERT INTO customers (name, email, mobile, post_code) VALUES ($1, $2, $3, $4) RETURNING *",
            [args.name, args.email, args.mobile, args.post_code]
          )
        ).rows[0];

        /**
         * Insert customer service interest
         */
        let query: String = `INSERT INTO customer_service_interest (customer_id, service_interest_id) VALUES `;
        // insert service interests by customer
        for (const interest of args.service_interest) {
          const filteredServiceId = serviceInterest.rows.find(
            (x: { name: String }) => x.name === interest
          );
          query += `(${insertResult?.id}, ${filteredServiceId.id}),`;
        }
        query = query.slice(0, -1); // remove last comma
        await db.query(query);

        // include service interest in the result
        insertResult.service_interest = args.service_interest;

        return insertResult;
      } catch (e: any) {
        console.log("Failed to insert Customer", e.stack);
        throw e;
      }
    },
  },
};
