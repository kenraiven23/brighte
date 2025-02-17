import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const Customer = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLID! },
    name: {
      type: GraphQLString!,
    },
    email: {
      type: GraphQLString!,
    },
    mobile: {
      type: GraphQLString!,
    },
    post_code: {
      type: GraphQLString!,
    },
    service_interest: {
      type: new GraphQLList(GraphQLString) ,
    },
  }),
});

const serviceLead = new GraphQLObjectType({
  name: "ServiceLead",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    total: { type: GraphQLInt },
  }),
});

export default { Customer, serviceLead };
