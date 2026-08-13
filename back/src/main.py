from fastapi import FastAPI
from src.settings import opensearch_client

app = FastAPI()

@app.get("/")
async def root():
  try:
    database_running = await opensearch_client.ping()
    return {"status": "success", "message": "FastAPI is running", "database_connected": database_running}
  except Exception as err:
    return {"status": "error", "message": f"Encounted error : {str(err)}", "type": type(err).__name__}