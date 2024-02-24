import boto3
import mimetypes
import os
import logging
logger = logging.getLogger(__name__)

AWS_ENDPOINT_URL_S3 = os.environ.get("AWS_ENDPOINT_URL_S3")
AWS_PROFILE_NAME = os.environ.get("AWS_PROFILE_NAME")

if not AWS_ENDPOINT_URL_S3:
    logger.error("S3バケットのエンドポイントURLが環境変数に設定されていない")
    raise EnvironmentError("AWS_ENDPOINT_URL_S3 is not found in the environment variables.")

session_params = {}
if AWS_PROFILE_NAME:
    session_params['profile_name'] = AWS_PROFILE_NAME
session = boto3.Session(**session_params)
s3_client = session.client('s3', endpoint_url=AWS_ENDPOINT_URL_S3)

# S3へのアップロード関数
def upload_to_s3(bucket_name, source_file_name, destination_blob_name):
    mime_type, _ = mimetypes.guess_type(source_file_name)
    s3_client.upload_file(source_file_name, bucket_name, destination_blob_name, ExtraArgs={'ContentType': mime_type})
    # 公開URLを取得
    public_url = f"{AWS_ENDPOINT_URL_S3}/{bucket_name}/{destination_blob_name}"

    print(f"File {source_file_name} uploaded to {public_url}.")

    return public_url
