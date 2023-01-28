import { GraphQLID } from "graphql";
import { GraphQLObjectType } from "graphql/type/definition";
import { GraphQLInt } from "graphql/type/scalars";

export const MemberType = new GraphQLObjectType({
  name: "MemberType",
  fields: {
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});
