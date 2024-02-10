from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from db.database import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    hashed_password = Column(String)
    groups = relationship("UserGroup", back_populates="user")
    items = relationship("Item", back_populates="owner")
    rent_logs = relationship("RentLog", back_populates="renter")