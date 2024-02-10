variable "project_id" {
  #default = "qiitahackatho-nonprod-svc-y8x2"
  type = string
}

variable "region" {
  default = "asia-northeast1"
}

variable "db_password" {
  description = "Database user password"
  type        = string
}
