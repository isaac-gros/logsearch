from fastapi import APIRouter, HTTPException, Query
from src.database import opensearch_client
from src.models.log import LogModel, LogLevel
from src.utils.database import create_index_for_date 
from typing import Optional

router = APIRouter(prefix="/logs", tags=["Logs"])

"""
Création d'un log

log: LogModel -- Un Log au format valide
"""
@router.post("/", status_code=201)
async def create_log(log: LogModel):
  try:
    index_name = await create_index_for_date()
    document = log.model_dump()
    response = await opensearch_client.index(
        index=index_name,
        body=document,
        refresh=True
    )
    return {"status": "created", "id": response["_id"]}
  except Exception as err:
    raise Exception(str(err))


"""
Recherche dans les logs

q: str | None -- Un mot clef de recherche
level: str | None -- Le niveau du log, correspondant à un LogLevel
service: str | None -- Le service dont le log est issu
"""
@router.get("/search", tags=["Logs"])
async def get_logs(
  q: str | None = None,
  level: LogLevel | None = None,
  service: str | None = None
):
  try:
    # Récupération de l'index
    index_name = await create_index_for_date()

    # Préparation de la requête OpenSearch
    query = {
      "size": 20,
      "sort": [{"timestamp": {"order": "desc"}}],
      "query": {}
    }

    # Définition des conditions de recherche
    must_match_queries = []

    # Prise en compte du paramètre q
    if q:
      must_match_queries.append({
        "match": {
          "message": q
        }
      })

    # Prise en compte du level
    if level:
      must_match_queries.append({
        "term": {
          "level": level
        }
      })

    # Prise en compte du service
    if service:
      must_match_queries.append({
        "term": {
          "service": service
        }
      })

    # Si un ou plusieurs query params ont été définis
    # on construit une requête de type "must" pour OpenSearch
    if len(must_match_queries) > 0:
      query["query"] = {"bool": {"must": must_match_queries }}
    else:

      # Sinon, on fait une query simple des 20 derniers logs
      query["query"] = {"match_all": {}}

    # On envoie la requête
    response = await opensearch_client.search(
      index=index_name,
      body=query
    )

    # Extraction des résultats
    hits = response["hits"]["hits"]
    logs = [hit["_source"] for hit in hits]

    return {
      "total": response["hits"]["total"]["value"], # Le nombre total de correspondances
      "data": logs # Les logs correspondants
    }
  except Exception as err:
    raise Exception(str(err))
