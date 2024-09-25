terraform {
    backend "s3" {
        bucket = "captain-tf-backend-s3"
        key    = "state/terraform.tfstate"
        region = "us-east-1"
        encrypt = true
    }
}