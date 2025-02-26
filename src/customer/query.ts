import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import cType from "./type";
import resolver from "./resolver";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    leads: {
      type: new GraphQLList(cType.serviceLead),
      resolve: async (parent: any, args: any, context: any) => {
        return resolver.Query.leads(parent, args, context);
      },
    },
    lead: {
      type: cType.serviceLead,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: async (parent, args, context, resolveInfo) => {
        return resolver.Query.lead(parent, args, context);
      },
    },
  }),
});

export default QueryRoot;
