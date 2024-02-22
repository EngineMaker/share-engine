from pydantic import BaseModel


class Login(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    user_id: int
    access_token: str
    token_type: str
