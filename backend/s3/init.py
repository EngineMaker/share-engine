import boto3
import os
import logging
logger = logging.getLogger(__name__)

AWS_ENDPOINT_URL_S3 = os.environ.get("AWS_ENDPOINT_URL_S3")
if not AWS_ENDPOINT_URL_S3:
    logger.error("S3バケットのエンドポイントURLが環境変数に設定されていない")
    raise EnvironmentError("AWS_ENDPOINT_URL_S3 is not found in the environment variables.")

s3_client = boto3.client("s3", endpoint_url=AWS_ENDPOINT_URL_S3)
s3_client.create_bucket(Bucket="shareengine-storage")