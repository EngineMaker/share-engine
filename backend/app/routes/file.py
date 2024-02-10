from fastapi import FastAPI, File, UploadFile, APIRouter
from services.file_service import upload_to_gcs

router = APIRouter()

@router.post("/uploadfiles/")
async def create_upload_files(files: list[UploadFile]):
    for file in files:
        contents = await file.read()
        file_name = f"/app/tmp/{file.filename}"
        with open(file_name, "wb") as f:
            f.write(contents)
        # GCSにアップロード
        upload_to_gcs("0f2e37b38fde7385-my-bucket", file_name, file.filename)
    return {"filenames": [file.filename for file in files]}