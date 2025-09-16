terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "aws-micro-frontend-app"
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-users-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_dynamodb_table" "dashboard" {
  name           = "${var.project_name}-dashboard-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "${var.project_name}-lambda-execution-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb_access" {
  name = "${var.project_name}-lambda-dynamodb-policy-${var.environment}"
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.dashboard.arn
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "graphql_api" {
  filename         = "../apps/backend/dist/handlers/graphql.js"
  function_name    = "${var.project_name}-graphql-${var.environment}"
  role            = aws_iam_role.lambda_execution_role.arn
  handler         = "graphql.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime         = "nodejs18.x"
  timeout         = 30

  environment {
    variables = {
      USERS_TABLE     = aws_dynamodb_table.users.name
      DASHBOARD_TABLE = aws_dynamodb_table.dashboard.name
      REGION          = var.aws_region
    }
  }

  tags = local.common_tags
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "../apps/backend/dist"
  output_path = "lambda_function.zip"
}

resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.project_name}-api-${var.environment}"
  description = "API Gateway for AWS Micro Frontend App"

  tags = local.common_tags
}

resource "aws_api_gateway_resource" "graphql" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "graphql"
}

resource "aws_api_gateway_method" "graphql" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.graphql.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "graphql" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.graphql.id
  http_method = aws_api_gateway_method.graphql.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.graphql_api.invoke_arn
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.graphql_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.graphql,
  ]

  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = var.environment
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.graphql_api.function_name}"
  retention_in_days = 14

  tags = local.common_tags
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = "${aws_api_gateway_deployment.deployment.invoke_url}/graphql"
}

output "dynamodb_users_table" {
  description = "DynamoDB Users Table Name"
  value       = aws_dynamodb_table.users.name
}

output "dynamodb_dashboard_table" {
  description = "DynamoDB Dashboard Table Name"
  value       = aws_dynamodb_table.dashboard.name
}
