# Use an official Python 3.9 image as a base
FROM python:3.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install uv and its dependencies
RUN pip install --no-cache-dir uv uvicorn fastapi pytz

# Copy the pyproject.toml file for dependency management
COPY pyproject.toml /app/

# Set the working directory
WORKDIR /app

# Create the virtual environment and sync dependencies
RUN uv venv .venv \
    && uv pip sync pyproject.toml

# Copy the rest of the application code into the container
COPY . /app

# Expose port 80 for the FastAPI app
EXPOSE 80

# Define the default command to run the FastAPI app using uvicorn
CMD ["uv", "run", "uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "80"]