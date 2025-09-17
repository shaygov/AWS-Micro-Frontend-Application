export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    status: UserStatus!
    createdAt: String!
    updatedAt: String
    dashboard: DashboardStats!
  }

  enum UserStatus {
    ACTIVE
    INACTIVE
    PENDING
  }

  type DashboardStats {
    totalUsers: Int!
    activeUsers: Int!
    totalOrders: Int!
    revenue: Float!
  }

  type UsersWithDashboard {
    users: [User!]!
    dashboard: DashboardStats!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    status: UserStatus
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    dashboardStats: DashboardStats!
    usersWithDashboard: UsersWithDashboard!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
//# sourceMappingURL=typeDefs.js.map