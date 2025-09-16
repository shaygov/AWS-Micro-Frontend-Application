#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}
AWS_REGION=${2:-us-east-1}

echo "Deploying AWS Micro Frontend App to $ENVIRONMENT environment in $AWS_REGION region..."

# Build backend
echo "Building backend..."
cd apps/backend
npm install
npm run build
cd ../..

# Deploy backend with Serverless
echo "Deploying backend with Serverless..."
cd apps/backend
serverless deploy --stage $ENVIRONMENT --region $AWS_REGION
cd ../..

# Deploy infrastructure with Terraform
echo "Deploying infrastructure with Terraform..."
cd infrastructure
terraform init
terraform plan -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION"
terraform apply -auto-approve -var="environment=$ENVIRONMENT" -var="aws_region=$AWS_REGION"
cd ..

# Build and deploy frontend (if using S3/CloudFront)
echo "Building frontend..."
cd apps/frontend
npm install
npm run build
cd ../..

echo "Deployment completed!"
echo "Check the Terraform outputs for API Gateway URL and other resources."
