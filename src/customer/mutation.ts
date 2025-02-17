import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import cType from "./type";
import client from "../db";

export default new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    customer: {
      type: cType.Customer,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        mobile: { type: GraphQLString },
        post_code: { type: GraphQLString },
        service_interest: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (parent: any, args: any) => {
        try {
          // check if valid service interest value
          var params = [];
          for (var i = 1; i <= args.service_interest.length; i++) {
            params.push("$" + i);
          }

          const serviceInterestValidation = (
            await client.query(
              `SELECT COUNT(*) FROM service_interest WHERE name IN (${params.join(
                ","
              )})`,
              args.service_interest
            )
          ).rows[0];

          if (
            parseInt(serviceInterestValidation.count) !==
            args.service_interest.length
          )
            throw new Error("Invalid service interest value");

          // insert customer
          const insertResult = (
            await client.query(
              "INSERT INTO customers (name, email, mobile, post_code) VALUES ($1, $2, $3, $4) RETURNING *",
              [args.name, args.email, args.mobile, args.post_code]
            )
          ).rows[0];

          // insert service interests by customer
          for (const interest of args.service_interest) {
            const serviceInterestId = await client.query(
              "SELECT id FROM service_interest WHERE name = ($1)",
              [interest]
            );
            if (!serviceInterestId.rows[0])
              throw new Error("Unable to find serviceInterest");

            await client.query(
              "INSERT INTO customer_service_interest (customer_id, service_interest_id) VALUES ($1, $2)",
              [insertResult?.id, serviceInterestId.rows[0].id]
            );
          }
          insertResult.service_interest = args.service_interest;

          return insertResult;
        } catch (e: any) {
          console.log("Failed to insert Customer", e.stack);
          throw e;
        }
      },
    },
  }),
});
