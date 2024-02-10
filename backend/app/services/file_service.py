from google.cloud import storage
from google.oauth2 import service_account

# GCSへのアップロード関数
def upload_to_gcs(bucket_name, source_file_name, destination_blob_name):
    # 認証情報を設定
    credentials = service_account.Credentials.from_service_account_file(
        "/app/credential.json"
    )
    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print(f"File {source_file_name} uploaded to {destination_blob_name}.")
