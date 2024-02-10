from fastapi import FastAPI
from routes import user
from routes import item
from fastapi.middleware.cors import CORSMiddleware
import os

from models.user import User
from models.group import Group
from models.user_group import UserGroup
from models.item import Item
from models.group_item import GroupItem

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("ORIGIN", "")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

api_prefix = "/api/v1"
app.include_router(user.router, prefix=api_prefix)
app.include_router(item.router, prefix=api_prefix)

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/health")
def health():
    return {200: "OK!"}

