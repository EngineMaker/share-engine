from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship
from db.database import Base


class GroupItem(Base):
    __tablename__ = "group_items"

    group_id = Column(Integer, ForeignKey("groups.id"), primary_key=True)
    item_id = Column(Integer, ForeignKey("items.id"), primary_key=True)

    group = relationship("Group", back_populates="items")
    item = relationship("Item", back_populates="groups")
