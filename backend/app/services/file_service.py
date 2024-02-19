from google.cloud import storage
import google.auth

# GCSへのアップロード関数
def upload_to_gcs(bucket_name, source_file_name, destination_blob_name):
    # 認証情報を設定
    credentials, project = google.auth.default()
    storage_client = storage.Client(project=project, credentials=credentials)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    # 公開URLを取得
    public_url = blob.public_url

    print(f"File {source_file_name} uploaded to {public_url}.")

    return public_url
