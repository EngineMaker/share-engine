from fastapi import FastAPI, File, UploadFile, APIRouter

router = APIRouter()

@router.post("/uploadfiles/")
async def create_upload_files(files: list[UploadFile]):
    return {"filenames": [file.filename for file in files]}