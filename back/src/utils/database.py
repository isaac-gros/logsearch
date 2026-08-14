import random
from datetime import datetime, timedelta
from opensearchpy import OpenSearch, helpers
from datetime import datetime
from src.database import opensearch_client

# Création d'un index de logs en fonction de la date du jour
async def create_index_for_date(date: datetime = datetime.now()):
  formatted_date = date.strftime('%Y-%m-%d')
  index_name = f"logs-{formatted_date}"
  index_mapping = {
    "mappings": {
      "properties": {
        "timestamp": {"type": "date"},
        "service": {"type": "keyword"},
        "message": {"type": "text"},
        "level": {"type": "keyword"}
      }
    }
  }

  exists = await opensearch_client.indices.exists(index=index_name)
  if not exists:
    await opensearch_client.indices.create(index=index_name, body=index_mapping)

  return index_name

