#!/bin/bash

echo "Starting AWS Micro Frontend App in development mode..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Start services with Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up --build

echo "Development environment started!"
echo "Frontend: http://localhost:3000"
echo "Backend GraphQL: http://localhost:4000/graphql"
echo "DynamoDB Local: http://localhost:8000"
