variable "project_id" {
  #default = "qiitahackatho-nonprod-svc-y8x2"
  type = string
}

variable "region" {
  default = "asia-northeast1"
}

variable "db_conn" {
  description = "Database connection info"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
}

variable "db_user" {
  description = "Database user"
  type        = string
}

