import { gql } from '@apollo/client'

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      activeUsers
      totalOrders
      revenue
    }
  }
`

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      status
      createdAt
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      status
      createdAt
    }
  }
`







