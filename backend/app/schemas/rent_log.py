from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RentLogCreate(BaseModel):
    item_id: int


class RentLogResponse(BaseModel):
    id: int
    item_id: int
    renter_id: int
    returned: bool
    returned_at: Optional[datetime]

    class Config:
        orm_mode = True
