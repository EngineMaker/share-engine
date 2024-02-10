from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from db.database import Base

class RentLog(Base):
    __tablename__ = 'rent_logs'
    
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    renter_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    returned = Column(Boolean, default=False)
    returned_at = Column(DateTime, nullable=True)

    item = relationship("Item", back_populates="rent_logs")
    renter = relationship("User", back_populates="rent_logs")

