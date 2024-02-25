import boto3
import mimetypes
import os
import logging
logger = logging.getLogger(__name__)

AWS_ENDPOINT_URL_S3 = os.environ.get("AWS_ENDPOINT_URL_S3")
IMAGE_HOSTNAME = os.environ.get("IMAGE_HOSTNAME")

if not AWS_ENDPOINT_URL_S3:
    logger.error("S3バケットのエンドポイントURLが環境変数に設定されていない")
    raise EnvironmentError("AWS_ENDPOINT_URL_S3 is not found in the environment variables.")
if not IMAGE_HOSTNAME:
    logger.error("画像のホスト名が環境変数に設定されていない")
    raise EnvironmentError("IMAGE_HOSTNAME is not found in the environment variables.")


# S3へのアップロード関数
def upload_to_s3(bucket_name, source_file_name, destination_blob_name):
    s3_client = boto3.client('s3', endpoint_url=AWS_ENDPOINT_URL_S3)
    mime_type, _ = mimetypes.guess_type(source_file_name)
    s3_client.upload_file(source_file_name, bucket_name, destination_blob_name, ExtraArgs={'ContentType': mime_type})
    # 公開URLを取得
    public_url = f"{IMAGE_HOSTNAME}/{destination_blob_name}"

    print(f"File {source_file_name} uploaded to {public_url}.")

    return public_url
