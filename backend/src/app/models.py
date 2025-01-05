from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base
from datetime import datetime

class StopwatchData(Base):
    __tablename__ = "stopwatch_data"

    id = Column(Integer, primary_key=True, index=True)
    reason = Column(String, nullable=False)
    time_spent = Column(Float, nullable=False)
    type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)