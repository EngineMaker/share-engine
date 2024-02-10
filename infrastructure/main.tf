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
  default_service = google_compute_backend_service.group.id
   host_rule {
     hosts = ["share-engine.click"]
     path_matcher = "allpaths"
   }
   path_matcher {
     name = "allpaths"
     default_service = google_compute_backend_service.group.id
     path_rule {
       paths = ["/api/v1/*"]
       service = google_compute_backend_service.group.id
     }
	 	path_rule {
       paths = ["/*"]
       service = google_compute_backend_bucket.default.id
     }
	 }
}

# backend bucket with cdn policy with default ttl settings
resource "google_compute_backend_bucket" "default" {
  name = "backend-bucket"
  description = "contains beautiful images"
  bucket_name = google_storage_bucket.default.name
  enable_cdn = true
  cdn_policy {
    cache_mode = "CACHE_ALL_STATIC"
    client_ttl = 3600
    default_ttl = 3600
    max_ttl = 86400
    negative_caching = true
    serve_while_stale = 86400
  }
}

resource "google_compute_health_check" "default" {
  name               = "http-basic-check"
  check_interval_sec = 5
  healthy_threshold  = 2
  http_health_check {
    port               = 80
    port_specification = "USE_FIXED_PORT"
    proxy_header       = "NONE"
    request_path       = "/"
  }
  timeout_sec         = 5
  unhealthy_threshold = 2
}

resource "google_compute_backend_service" "group" {
  name      = "group"
  port_name = "http"
  protocol  = "HTTP"

  backend {
    group = google_compute_instance_group.group.id
  }

  health_checks = [
    google_compute_health_check.default.id,
  ]
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

resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "https-lb-proxy"
  url_map          = google_compute_url_map.http_lb.id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl.id]
}

# forwarding rule
resource "google_compute_global_forwarding_rule" "forwarding" {
  name = "http-lb-forwarding-rule"
  ip_protocol = "TCP"
  load_balancing_scheme = "EXTERNAL"
  port_range = "443"
  target = google_compute_target_https_proxy.https_proxy.id
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

resource "google_project_service" "secret" {
  project            = var.project_id
  service            = "secretmanager.googleapis.com"
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
  name     = var.db_user
  instance = google_sql_database_instance.instance.name
  password = var.db_password
}

resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.instance.name
  deletion_policy = "ABANDON"
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
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_conn.secret_id
            version = "latest"
          }
        }
      }
    }
  }

  traffic {
    type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  lifecycle {
    ignore_changes = [
      traffic,
      template,
      client
    ]
  }
  depends_on = [
    google_project_service.cloudrun,
    google_artifact_registry_repository.backend,
    google_secret_manager_secret_version.db_conn,
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

resource "google_secret_manager_secret" "db_conn" {
  secret_id = "db-conn"
  replication {
    auto {}
  }
  depends_on = [
    google_project_service.secret
  ]
}

resource "google_secret_manager_secret_version" "db_conn" {
  secret      = google_secret_manager_secret.db_conn.name
  secret_data = var.db_conn
}

resource "google_service_account" "cloudrun_sa" {
  account_id = "cloudrun-sa"
}

resource "google_service_account" "gcs_sa" {
  account_id = "gcs-sa"
}

resource "google_service_account_key" "service_account" {
  service_account_id = google_service_account.gcs_sa.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

resource "local_file" "service_account" {
    content  = base64decode(google_service_account_key.service_account.private_key)
    filename = "credentials.json"
}

resource "google_storage_bucket_iam_member" "gcs" {
  bucket = google_storage_bucket.default.name
  role = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.gcs_sa.email}"
}

resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "default" {
  name = "${random_id.bucket_prefix.hex}-my-bucket"
  location = var.region
  uniform_bucket_level_access = true
  storage_class = "STANDARD"
  // delete bucket and contents on destroy.
  force_destroy = true
}

# make bucket public
resource "google_storage_bucket_iam_member" "default" {
  bucket = google_storage_bucket.default.name
  role = "roles/storage.legacyObjectReader"
  member = "allUsers"
}

resource "google_compute_managed_ssl_certificate" "ssl" {
  name = "web-ssl"

  managed {
    domains = ["share-engine.click."]
  }
}

resource "google_compute_instance_template" "default" {
  name = "lb-backend-template"
  disk {
    auto_delete  = true
    boot         = true
    device_name  = "persistent-disk-0"
    mode         = "READ_WRITE"
    source_image = "projects/debian-cloud/global/images/family/debian-12"
    type         = "PERSISTENT"
  }
  machine_type = "n1-standard-1"
  network_interface {
    access_config {
      network_tier = "PREMIUM"
    }
    network    = google_compute_network.default.id
  }
  region = var.region
  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
    provisioning_model  = "STANDARD"
  }
  service_account {
    email  = "default"
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }
  tags = ["allow-health-check", "bastion"]
}

resource "google_compute_instance_group_manager" "default" {
  name = "lb-backend-example"
  zone = "${var.region}-a"
  named_port {
    name = "http"
    port = 80
  }
  version {
    instance_template = google_compute_instance_template.default.id
    name              = "primary"
  }
  base_instance_name = "vm"
  target_size        = 1
}

resource "google_compute_firewall" "default" {
  name          = "fw-allow-health-check"
  direction     = "INGRESS"
  network       = google_compute_network.default.id
  priority      = 1000
  source_ranges = ["130.211.0.0/22", "35.191.0.0/16"]
  target_tags   = ["allow-health-check"]
  allow {
    ports    = ["80"]
    protocol = "tcp"
  }
}

resource "google_compute_instance_group" "group" {
  name      = "instance-group"
  zone = "us-central1-a"
  # zone      = "us-central-a"
  instances = [google_compute_instance.vm.id]
  named_port {
    name = "http"
    port = "80"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "google_compute_instance" "vm" {
  name         = "vm-prod"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"
  boot_disk {
    initialize_params {
      image = "projects/debian-cloud/global/images/debian-12-bookworm-v20240110"
      size = 10
			type = "pd-balanced"
    }
  }

  network_interface {
    network = google_compute_network.default.id
    access_config {}
  }
  tags = ["bastion", "allow-health-check"]
  service_account {
        email  = "587271627789-compute@developer.gserviceaccount.com"
        scopes = ["https://www.googleapis.com/auth/cloud-platform"]
   }
}
