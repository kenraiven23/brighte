import { GraphQLSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import express from "express";
import QueryRoot from "./customer/query";
import MutationRoot from "./customer/mutation";
import { defaultTables } from "./db/defaultTable";

const schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
});

const app = express();

// Create and use the GraphQL handler.
app.use(
  "/graphql",
  createHandler({
    schema: schema,
  })
);

defaultTables();

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
