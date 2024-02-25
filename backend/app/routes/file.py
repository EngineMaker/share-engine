from fastapi import FastAPI, File, UploadFile, APIRouter
from services.file_service import upload_to_s3

router = APIRouter()

@router.post("/uploadfiles/")
async def create_upload_files(files: list[UploadFile]):
    urls = []
    for file in files:
        print('file :', file)
        contents = await file.read()
        file_name = f"/app/tmp/{file.filename}"
        with open(file_name, "wb") as f:
            f.write(contents)
        # S3にアップロード
        url = upload_to_s3("shareengine-storage", file_name, file.filename)
        urls.append(url)

    return {"filenames": urls}