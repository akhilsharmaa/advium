variable "aws_access_key" {
  description = "AWS Access Key"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS Secret Key"
  type        = string
}

variable "key_name" {
  description = "Key Name for EC2"
  type        = string
}

variable "region" {
  description = "AWS Region"
  type        = string
  default = "us-east-1"
}
