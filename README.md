# AWS Micro Frontend Application

A modern, scalable micro-frontend application built with React, AWS Serverless, and Docker. This project demonstrates a complete full-stack architecture using micro-frontend patterns, AWS Lambda functions, DynamoDB, and GraphQL.

## Architecture

### Frontend
- **React 18** with TypeScript
- **Micro-frontend architecture** for scalability
- **Apollo Client** for GraphQL integration
- **Styled Components** for styling
- **Vite** for fast development and building

### Backend
- **AWS Lambda** functions written in TypeScript
- **GraphQL API** with Apollo Server
- **DynamoDB** for data persistence
- **AWS CloudWatch** for monitoring and logging
- **Serverless Framework** for deployment

### DevOps
- **Docker** containerization for all services
- **Terraform** for AWS infrastructure as code
- **Docker Compose** for local development
- **Monorepo** structure with workspaces

## Project Structure

```
├── apps/
│   ├── frontend/          # React micro-frontend application
│   └── backend/           # AWS Lambda GraphQL API
├── infrastructure/        # Terraform configuration
├── scripts/              # Development and deployment scripts
├── docker-compose.yml    # Docker Compose configuration
└── package.json          # Root package.json with workspaces
```

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- AWS CLI configured
- Terraform
- Serverless Framework

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd aws-micro-frontend-app
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Start development environment:**
   ```bash
   # Using Docker Compose (recommended)
   npm run docker:up
   
   # Or using npm scripts
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - GraphQL API: http://localhost:4000/graphql
   - DynamoDB Local: http://localhost:8000

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both frontend and backend
- `npm run docker:up` - Start all services with Docker Compose
- `npm run docker:down` - Stop all Docker services

### Frontend Development

The frontend is a React application with the following features:
- Dashboard with statistics
- User management
- Settings page
- GraphQL integration
- Responsive design

### Backend Development

The backend consists of:
- GraphQL API with Apollo Server
- DynamoDB integration
- AWS Lambda functions
- CloudWatch logging

## Deployment

### Local Development with Docker

```bash
# Start all services
docker-compose up --build

# Stop services
docker-compose down
```

### AWS Deployment

1. **Deploy backend:**
   ```bash
   cd apps/backend
   serverless deploy --stage dev
   ```

2. **Deploy infrastructure:**
   ```bash
   cd infrastructure
   terraform init
   terraform plan
   terraform apply
   ```

3. **Deploy everything:**
   ```bash
   ./scripts/deploy.sh dev us-east-1
   ```

## Environment Variables

### Frontend (.env)
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
VITE_AWS_REGION=us-east-1
VITE_ENVIRONMENT=development
```

### Backend (.env)
```env
NODE_ENV=development
REGION=us-east-1
USERS_TABLE=aws-micro-frontend-backend-users-dev
DASHBOARD_TABLE=aws-micro-frontend-backend-dashboard-dev
```

## API Documentation

### GraphQL Schema

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  status: UserStatus!
  createdAt: String!
  updatedAt: String
}

type DashboardStats {
  totalUsers: Int!
  activeUsers: Int!
  totalOrders: Int!
  revenue: Float!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  dashboardStats: DashboardStats!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

## Monitoring

- **CloudWatch Logs**: Lambda function logs
- **CloudWatch Metrics**: Performance and error metrics
- **DynamoDB Metrics**: Database performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions and support, please open an issue in the repository.
