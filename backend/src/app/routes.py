from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func, case, desc
from sqlalchemy.orm import Session
from .models import StopwatchData
from .database import get_db
from pydantic import BaseModel
from sqlalchemy.sql.functions import coalesce

# Define models for StopwatchData using SQLAlchemy
from .models import StopwatchData

# Define the Pydantic model for incoming data
class DataCreate(BaseModel):
    reason: str
    time_spent: float
    type: str

# Create a new instance of APIRouter
router = APIRouter()

# Define a route for saving data to the database
@router.post("/save_data/")
def save_data(data: List[DataCreate], db: Session = Depends(get_db)):
    """
    Saves StopwatchData objects to the database.
    Args:
        data (List[DataCreate]): A list of data to be saved
        db (Session): The database session
    """
    try:
        for item in data:
            db_item = StopwatchData(reason=item.reason, time_spent=item.time_spent, type=item.type)
            db.add(db_item)
        db.commit()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

from sqlalchemy.sql.functions import coalesce

@router.get("/get_trends/")
def get_trends(db: Session = Depends(get_db)):
    # Subquery to get the latest timestamp for each date
    subquery = (
        db.query(
            func.date(StopwatchData.timestamp).label('date'),
            func.max(StopwatchData.timestamp).label('latest_timestamp')
        )
        .group_by(func.date(StopwatchData.timestamp))
        .subquery()
    )

    # Main query to fetch the latest row for each date
    result = (
        db.query(
            func.date(StopwatchData.timestamp).label('date'),
            StopwatchData.time_spent,
            StopwatchData.type
        )
        .join(subquery, (func.date(StopwatchData.timestamp) == subquery.c.date) &
              (StopwatchData.timestamp == subquery.c.latest_timestamp))
        .order_by(desc(StopwatchData.timestamp))
        .all()
    )

    # Prepare data for the trend chart
    trends = {"dates": [], "study_time": [], "time_wasted": []}
    for row in result:
        trends["dates"].append(row.date.strftime("%Y-%m-%d"))  # Format date as string
        if row.type == 'Study time':
            trends["study_time"].append(row.time_spent)
            trends["time_wasted"].append(0)  # Default value for time wasted
        elif row.type == 'Time wasted':
            trends["study_time"].append(0)  # Default value for study time
            trends["time_wasted"].append(row.time_spent)

    return trends

@router.get("/health")
def health_check():
    return {"status": "ok"}