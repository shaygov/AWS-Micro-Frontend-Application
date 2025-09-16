# Docker Setup Instructions

## Prerequisites
1. Docker Desktop must be installed and running
2. All services will run in Docker containers

## Available Commands

### Start all services with Docker
```bash
npm start
# or
docker-compose up -d
```

### Stop all services
```bash
npm stop
# or
docker-compose down
```

### View logs
```bash
npm run docker:logs
# or
docker-compose logs -f
```

### Build all containers
```bash
npm run docker:build
# or
docker-compose build
```

### Restart services
```bash
npm run docker:restart
# or
docker-compose restart
```

## Services

- **Frontend (Shell)**: http://localhost:3000
- **Backend (GraphQL)**: http://localhost:4000/graphql
- **DynamoDB Local**: http://localhost:8000
- **DynamoDB Admin**: http://localhost:8001
- **Nginx (Load Balancer)**: http://localhost:80

## Troubleshooting

### Docker Desktop not running
1. Start Docker Desktop application
2. Wait for it to fully start (green icon in system tray)
3. Try `docker ps` to verify it's working

### Port conflicts
If ports are already in use:
1. Stop conflicting services
2. Or change ports in docker-compose.yml

### Container issues
1. Check logs: `npm run docker:logs`
2. Rebuild containers: `npm run docker:build`
3. Restart services: `npm run docker:restart`
