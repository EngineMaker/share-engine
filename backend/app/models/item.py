from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from db.database import Base


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    image_url1 = Column(String)
    image_url2 = Column(String, nullable=True)
    image_url3 = Column(String, nullable=True)
    image_url4 = Column(String, nullable=True)
    image_url5 = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    available = Column(Boolean, index=True)
    price = Column(Integer, default=0)
    description = Column(String, nullable=True)
    precaution = Column(String, nullable=True)

    owner = relationship("User", back_populates="items")
    groups = relationship("GroupItem", back_populates="item")
    rent_logs = relationship("RentLog", back_populates="item")
