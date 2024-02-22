from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from db.database import Base


class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    users = relationship("UserGroup", back_populates="group")
    items = relationship("GroupItem", back_populates="group")
