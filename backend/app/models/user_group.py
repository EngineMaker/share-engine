from sqlalchemy import Column, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from db.database import Base


class UserGroup(Base):
    __tablename__ = "user_groups"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    group_id = Column(Integer, ForeignKey("groups.id"), primary_key=True)
    is_admin = Column(Boolean, default=False)

    user = relationship("User", back_populates="groups")
    group = relationship("Group", back_populates="users")
