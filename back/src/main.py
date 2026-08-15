from fastapi import FastAPI
from src.database import opensearch_client
from src.router import logs

app = FastAPI()
app.include_router(logs.router)

@app.get("/", tags=["Status"])
async def status():
  try:
    database_running = await opensearch_client.ping()
    return {"status": "success", "message": "FastAPI is running", "database_connected": database_running}
  except Exception as err:
    return {"status": "error", "message": f"Encounted error : {str(err)}", "type": type(err).__name__}