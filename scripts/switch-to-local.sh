#!/bin/bash

# Switch to local Docker deployment
echo "🔄 Switching to local Docker deployment..."

# Stop AWS services
echo "🛑 Stopping AWS services..."
docker-compose -f docker-compose.aws.yml down

# Start local services
echo "🚀 Starting local Docker stack..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Seed local DynamoDB
echo "🌱 Seeding local DynamoDB..."
npm run seed:dynamodb

echo "✅ Switched to local! Services:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:4000/graphql"
echo "   DynamoDB Admin: http://localhost:8001"
