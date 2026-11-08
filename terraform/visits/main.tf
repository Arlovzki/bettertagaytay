terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
  default_tags {
    tags = { Project = "bettertagaytay", ManagedBy = "terraform" }
  }
}

variable "allowed_origins" {
  type = list(string)
  default = [
    "https://bettertagaytay.org",
    "https://www.bettertagaytay.org",
    "https://main.d2hrjmoigt8q4w.amplifyapp.com",
  ]
}

resource "aws_dynamodb_table" "visits" {
  name         = "bettertagaytay-visits"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
  point_in_time_recovery { enabled = true }
}

resource "aws_iam_role" "counter" {
  name = "bettertagaytay-visit-counter"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{ Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" }, Action = "sts:AssumeRole" }]
  })
}

resource "aws_cloudwatch_log_group" "counter" {
  name              = "/aws/lambda/bettertagaytay-visit-counter"
  retention_in_days = 7
}

resource "aws_iam_role_policy" "counter" {
  role = aws_iam_role.counter.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"]
        Resource = aws_dynamodb_table.visits.arn
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "${aws_cloudwatch_log_group.counter.arn}:*"
      },
    ]
  })
}

data "archive_file" "counter" {
  type        = "zip"
  source_dir  = "${path.module}/../../server/visits"
  output_path = "${path.module}/counter.zip"
  excludes    = ["handler.test.mjs"]
}

resource "aws_lambda_function" "counter" {
  function_name                  = "bettertagaytay-visit-counter"
  role                           = aws_iam_role.counter.arn
  runtime                        = "nodejs24.x"
  handler                        = "index.handler"
  architectures                  = ["arm64"]
  filename                       = data.archive_file.counter.output_path
  source_code_hash               = data.archive_file.counter.output_base64sha256
  memory_size                    = 128
  timeout                        = 8
  reserved_concurrent_executions = 5
  environment {
    variables = {
      TABLE_NAME      = aws_dynamodb_table.visits.name
      ALLOWED_ORIGINS = join(",", var.allowed_origins)
    }
  }
  depends_on = [aws_iam_role_policy.counter]
}

resource "aws_lambda_function_url" "counter" {
  function_name      = aws_lambda_function.counter.function_name
  authorization_type = "NONE"
  cors {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST"]
    allow_headers = ["content-type"]
    max_age       = 86400
  }
}

output "endpoint" { value = aws_lambda_function_url.counter.function_url }
