export const UsersMutations = {
  createUser: {
    // (dto: CreateUserInput!): User!
  },
  changeUser: {
    // (id: UUID!, dto: ChangeUserInput!): User!
  },
  deleteUser: {
    // (id: UUID!): String!
  },
  subscribeTo: {
    // (userId: UUID!, authorId: UUID!): String!
  },
  unsubscribeFrom: {
    // (userId: UUID!, authorId: UUID!): String!
  },
};
