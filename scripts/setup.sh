#!/bin/bash

echo "Setting up AWS Micro Frontend App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "Error: Terraform is not installed. Please install Terraform and try again."
    exit 1
fi

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd apps/frontend
npm install
cd ../..

# Install backend dependencies
echo "Installing backend dependencies..."
cd apps/backend
npm install
cd ../..

# Make scripts executable
chmod +x scripts/*.sh

echo "Setup completed!"
echo "Run 'npm run dev' to start the development environment"
echo "Run 'npm run docker:up' to start with Docker Compose"
echo "Run './scripts/deploy.sh [environment] [region]' to deploy to AWS"
