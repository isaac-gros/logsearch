from src.settings import env_db_host, env_db_port
from opensearchpy import AsyncOpenSearch

opensearch_client = AsyncOpenSearch(
  hosts=[{"host": env_db_host, "port": env_db_port}],
  use_ssl=False,
  verify_certs=False
)