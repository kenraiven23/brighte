import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import cType from "./type";
import resolver from "./resolver";

export default new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    customer: {
      type: cType.Customer,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        mobile: { type: new GraphQLNonNull(GraphQLString) },
        post_code: { type: new GraphQLNonNull(GraphQLString) },
        service_interest: {
          type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
      },
      resolve: async (parent: any, args: any, context: any) => {
        return resolver.Mutation.customer(parent, args, context);
      },
    },
  }),
});
