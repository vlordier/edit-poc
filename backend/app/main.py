from fastapi import FastAPI

from .api.routes import analyze as analyze_router

app = FastAPI()

# Include API routers
app.include_router(analyze_router.router, prefix="/api")
