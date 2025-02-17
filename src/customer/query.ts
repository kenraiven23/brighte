import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import cType from "./type";
import client from "../db";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    customers: {
      type: new GraphQLList(cType.Customer),
      resolve: async () => {
        return (
          await client.query(
            `SELECT c.*, csi.service_interest_id, si.name AS service_interest FROM customers AS c 
            INNER JOIN customer_service_interest AS csi ON csi.customer_id = c.id 
            INNER JOIN service_interest AS si ON si.id = csi.service_interest_id`
          )
        ).rows;
      },
    },
    leads: {
      type: new GraphQLList(cType.serviceLead),
      resolve: async () => {
        return (
          await client.query(`SELECT t1.*, COALESCE(t2.total, 0) as total FROM service_interest AS t1 LEFT JOIN ( 
              SELECT service_interest_id, SUM(1) AS total 
              FROM customer_service_interest GROUP BY service_interest_id
            ) t2 ON t1.id = t2.service_interest_id`)
        ).rows;
      },
    },
    lead: {
      type: cType.serviceLead,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: async (parent, args, context, resolveInfo) => {
        return (
          await client.query(
            `SELECT t1.*, t2.total FROM service_interest AS t1 INNER JOIN ( 
              SELECT service_interest_id, SUM(1) AS total 
              FROM customer_service_interest GROUP BY service_interest_id
            ) t2 ON t1.id = t2.service_interest_id where t1.id=($1)`,
            [args.id]
          )
        ).rows[0];
      },
    },
  }),
});

export default QueryRoot;
