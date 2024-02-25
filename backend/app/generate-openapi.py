import json
from pathlib import Path

from main import app

# OpenAPIのスキーマを生成するスクリプト
# 使い方: python generate-openapi.py
if __name__ == "__main__":
    openapi_schema = app.openapi()
    with open(Path(__file__).resolve().parent / '../out/openapi.json', 'w') as json_file:
        json.dump(openapi_schema, json_file, indent=2)
    print("openapi.json has been generated")
