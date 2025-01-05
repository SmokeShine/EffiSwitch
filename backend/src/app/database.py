# Import necessary libraries from SQLAlchemy
from sqlalchemy import create_engine

# Import session maker and declarative base classes from SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables from a .env file using dotenv
import os
from dotenv import load_dotenv
load_dotenv()

# Define the SQLALCHEMY_DATABASE_URL variable by retrieving it from an environment variable named "SQLALCHEMY_DATABASE_URL"
SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")

# Create a database engine object using the specified connection URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Define a session maker class that creates new database sessions with certain properties (autocommit=False, autoflush=False, bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative models using the specified engine
Base = declarative_base()

# Dependency to get the database session
def get_db():
    """
    Returns a database session that should be used for all sessions in this application.
    The session is created, used, and then closed to ensure proper cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        # Close the database session when it's no longer needed
        db.close()