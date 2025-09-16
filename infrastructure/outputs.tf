output "api_gateway_url" {
  description = "API Gateway URL for GraphQL endpoint"
  value       = "${aws_api_gateway_deployment.deployment.invoke_url}/graphql"
}

output "dynamodb_users_table_name" {
  description = "DynamoDB Users Table Name"
  value       = aws_dynamodb_table.users.name
}

output "dynamodb_dashboard_table_name" {
  description = "DynamoDB Dashboard Table Name"
  value       = aws_dynamodb_table.dashboard.name
}

output "lambda_function_name" {
  description = "Lambda Function Name"
  value       = aws_lambda_function.graphql_api.function_name
}

output "lambda_function_arn" {
  description = "Lambda Function ARN"
  value       = aws_lambda_function.graphql_api.arn
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group Name"
  value       = aws_cloudwatch_log_group.lambda_logs.name
}
