#!/bin/bash

# Switch to AWS deployment
echo "🔄 Switching to AWS deployment..."

# Set AWS environment variables
export NODE_ENV=production
export AWS_REGION=${AWS_REGION:-us-east-1}

# Deploy infrastructure
echo "📦 Deploying AWS infrastructure..."
cd infrastructure
terraform init
terraform plan
terraform apply -auto-approve

# Get API Gateway URL
API_URL=$(terraform output -raw api_gateway_url)
echo "🌐 API Gateway URL: $API_URL"

# Update frontend to use AWS
echo "🔧 Updating frontend configuration..."
cd ../apps/shell
echo "VITE_GRAPHQL_ENDPOINT=$API_URL" > .env.production

# Start only frontend (backend runs on AWS)
echo "🚀 Starting frontend with AWS backend..."
cd ../..
docker-compose -f docker-compose.aws.yml up -d shell

echo "✅ Switched to AWS! Frontend: http://localhost:3000"
echo "   Backend: $API_URL"
