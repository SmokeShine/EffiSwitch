# Import the FastAPI class from the fastapi module.
from fastapi import FastAPI

# Import the router instance from a separate file named 'routes.py' in the same directory.
from .routes import router
from fastapi.middleware.cors import CORSMiddleware

# Create an instance of the FastAPI class, which will serve as the root application object.
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production to specific domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the router into the current app instance using the include_router method.
# This allows the app to access routes defined in the 'routes.py' file.
app.include_router(router)