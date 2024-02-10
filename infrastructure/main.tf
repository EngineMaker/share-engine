# network
resource "google_compute_network" "default" {
  name = "default"
}

resource "google_compute_global_address" "cdn_ip" {
  name = "cdn-ip"
}

# Loadbalancer
# url map
resource "google_compute_url_map" "http_lb" {
  name = "http-lb"
  default_service = google_compute_backend_service.backend.id
  host_rule {
    hosts = ["*"]
    path_matcher = "allpaths"
  }
  path_matcher {
    name = "allpaths"
    default_service = google_compute_backend_service.backend.id
    path_rule {
      paths = ["/*"]
      service = google_compute_backend_service.backend.id
    }
	}
}

resource "google_compute_backend_service" "backend" {
  name      = "cloudrun-backend"

  protocol  = "HTTP"
  port_name = "http"
  timeout_sec = 30

  backend {
    group = google_compute_region_network_endpoint_group.serverless_neg.id
  }
}

resource "google_compute_region_network_endpoint_group" "serverless_neg" {
  provider              = google-beta
  name                  = "serverless-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_v2_service.backend_api.name
  }
}

# http proxy
resource "google_compute_target_http_proxy" "http_proxy" {
  name = "http-lb-proxy"
  url_map = google_compute_url_map.http_lb.id
}

# forwarding rule
resource "google_compute_global_forwarding_rule" "forwarding" {
  name = "http-lb-forwarding-rule"
  ip_protocol = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range = "80"
  target = google_compute_target_http_proxy.http_proxy.id
  ip_address = google_compute_global_address.cdn_ip.id
}

# contaienr registory
resource "google_artifact_registry_repository" "backend" {
  location      = var.region
  repository_id = "backend"
  description   = "backend docker repository"
  format        = "DOCKER"
  depends_on = [
    google_project_service.registory
  ]
}

# project service api
resource "google_project_service" "service_networking" {
  project            = var.project_id
  service            = "servicenetworking.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "registory" {
  project            = var.project_id
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudrun" {
  project            = var.project_id
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudbuild" {
  project            = var.project_id
  service            = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

resource "google_compute_global_address" "private_ip_address" {
  project       = var.project_id
  name          = "private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.default.id
}

resource "google_service_networking_connection" "connection" {
  provider = google-beta
  network                 = google_compute_network.default.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
  depends_on = [
    google_project_service.service_networking
  ]
}

# database
resource "google_sql_database_instance" "instance" {
  name             = "cloudrun-sql"
  region           = var.region
  database_version = "POSTGRES_13"
  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.default.id
    }
  }

  deletion_protection  = "false"
  depends_on = [
    google_compute_global_address.private_ip_address
  ]
}

resource "google_sql_user" "user" {
  name     = "db-user"
  instance = google_sql_database_instance.instance.name
  password = var.db_password
}

# backend api
resource "google_cloud_run_v2_service" "backend_api" {
  name     = "backend-api"
  location = var.region
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      max_instance_count = 1
			min_instance_count = 0
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.instance.connection_name]
      }
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.backend.name}/backend-api:lastest"
      ports {
        container_port = 80
      }
      env {
        name = "FOO"
        value = "bar"
      }
      volume_mounts {
        name = "cloudsql"
        mount_path = "/cloudsql"
      }
    }
  }

  traffic {
    type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  depends_on = [
    google_project_service.cloudrun,
    google_artifact_registry_repository.backend
  ]
}

 data "google_iam_policy" "noauth" {
   binding {
     role = "roles/run.invoker"
     members = ["allUsers"]
   }
 }

 resource "google_cloud_run_service_iam_policy" "noauth" {
   location    = google_cloud_run_v2_service.backend_api.location
   project     = google_cloud_run_v2_service.backend_api.project
   service     = google_cloud_run_v2_service.backend_api.name

   policy_data = data.google_iam_policy.noauth.policy_data
 }
