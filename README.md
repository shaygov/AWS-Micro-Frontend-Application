# AWS Micro Frontend Application

A modern, scalable micro-frontend application built with React, GraphQL and Docker. This repo includes a local, fully-containerized stack: frontend shell, backend GraphQL API, DynamoDB Local with persistence, and a DynamoDB Admin UI.

## Architecture

### Frontend (Shell)
- React 18 + TypeScript (Vite)
- Apollo Client for GraphQL
- Styled Components

### Backend
- Apollo Server (Node.js/Express)
- DynamoDB (via AWS SDK v3)

### DevOps
- Docker Compose (local, multi-container)
- Optional Terraform/Serverless for cloud deploys (not required for local dev)

## Project Structure

```
├── apps/
│   ├── shell/              # React shell (served via Vite preview in container)
│   └── backend/            # GraphQL API
├── apps/dynamo-admin/      # Dockerized DynamoDB Admin UI
├── data/dynamodb/          # Persistent DynamoDB Local data (created at runtime)
├── seeds/                  # Seed JSON files for DynamoDB
├── docker-compose.yml      # Local stack orchestration
└── package.json            # Root scripts
```

## Prerequisites

- Node.js 18+
- Docker Desktop (running)

## Quick Start (Docker, recommended)

```bash
# Build and start the full stack
docker-compose up -d --build

# Or using npm scripts
npm run docker:up
```

Endpoints:
- Frontend (Shell): http://localhost:3000
- GraphQL API: http://localhost:4000/graphql
- DynamoDB Local: http://localhost:8000
- DynamoDB Admin: http://localhost:8001
- Nginx (optional): http://localhost:80

### DynamoDB Persistence
The `dynamodb` service uses a volume: `./data/dynamodb:/home/dynamodblocal/data`. Your tables and items persist across restarts. Avoid `docker-compose down -v` if you want to retain data.

## Seeding Data

We include seeds for the dashboard stats and a couple of users.

1) Ensure `dynamodb` and `dynamo-admin` are running:
```bash
docker-compose up -d dynamodb dynamo-admin
```

2) From PowerShell, run (Windows path-safe volume mount):
```powershell
$P = (Get-Location).Path
# Dashboard stats
docker run --rm -v ${P}:/data --network awsapp_app-network `
  -e AWS_ACCESS_KEY_ID=dummy -e AWS_SECRET_ACCESS_KEY=dummy -e AWS_DEFAULT_REGION=us-east-1 `
  amazon/aws-cli dynamodb put-item `
  --table-name aws-micro-frontend-backend-dashboard-local `
  --item file:///data/seeds/dashboard-item.json `
  --endpoint-url http://dynamodb:8000 --region us-east-1

# Users
docker run --rm -v ${P}:/data --network awsapp_app-network `
  -e AWS_ACCESS_KEY_ID=dummy -e AWS_SECRET_ACCESS_KEY=dummy -e AWS_DEFAULT_REGION=us-east-1 `
  amazon/aws-cli dynamodb batch-write-item `
  --request-items file:///data/seeds/users-items.json `
  --endpoint-url http://dynamodb:8000 --region us-east-1
```

3) Verify in DynamoDB Admin: http://localhost:8001

## Local Scripts

In the root `package.json`:
- `npm run docker:build` – build containers
- `npm run docker:up` – start all services in detached mode
- `npm run docker:down` – stop all services
- `npm run docker:logs` – follow all logs
- `npm run docker:restart` – restart services

Dev (non-docker) scripts also exist, but Docker is the recommended path for the full local stack.

## Deployment (high level)
- Docker on a server: push images, `docker-compose up -d` on the host
- AWS: use Serverless/Terraform modules in `apps/backend` and `infrastructure` (optional)

## GraphQL Schema (excerpt)
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
```

## License
MIT
