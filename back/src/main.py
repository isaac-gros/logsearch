from fastapi import FastAPI
from src.database import opensearch_client
from src.router import logs
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(logs.router)

# Définir les origines autorisées
origins = [
  "http://localhost",
  "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Permet GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

@app.get("/", tags=["Status"])
async def status():
  try:
    database_running = await opensearch_client.ping()
    return {"status": "success", "message": "FastAPI is running", "database_connected": database_running}
  except Exception as err:
    return {"status": "error", "message": f"Encounted error : {str(err)}", "type": type(err).__name__}