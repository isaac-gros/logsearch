import random
from datetime import datetime, timedelta
from opensearchpy import helpers
from datetime import datetime
from opensearchpy import OpenSearch

opensearch_client = OpenSearch(
  hosts=[{"host": "localhost", "port": 9200}],
  use_ssl=False,
  verify_certs=False
)

# Création d'un index de logs en fonction de la date du jour
def create_index_for_date(date: datetime):
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

  exists = opensearch_client.indices.exists(index=index_name)
  if not exists:
    opensearch_client.indices.create(index=index_name, body=index_mapping)

  return index_name


# Index créés
indexes = []
def generate_sample_data(count=200):

  SERVICES = ["auth-api", "payment-service", "user-management", "frontend-gateway"]
  LEVELS = ["INFO", "INFO", "INFO", "WARNING", "ERROR", "DEBUG"]  # Biais vers INFO
  MESSAGES = {
      "INFO": ["User logged in successfully", "GET /api/v1/items", "Order processed"],
      "WARN": ["Invalid API token provided", "Resource not found", "Rate limit reached"],
      "ERROR": ["Database connection timeout", "Out of memory error", "Payment gateway unreachable"],
      "DEBUG": ["Test de Julien à nouveau", "Hello world!", "Mot de passe : 123456"]
  }

  now = datetime.now()
  for _ in range(count):
      
      # Génère une date aléatoire sur les 7 derniers jours
      random_minutes = random.randint(0, 7 * 24 * 60)
      timestamp = now - timedelta(minutes=random_minutes)
      index_name = create_index_for_date(timestamp)

      # Ajout des index sous forme de chaîne
      if index_name not in indexes:
        indexes.append(index_name)
      
      level = random.choice(LEVELS)
      doc = {
          "_index": index_name,
          "_source": {
              "@timestamp": timestamp.isoformat() + "Z",
              "service": random.choice(SERVICES),
              "level": level,
              "timestamp": timestamp,
              "message": random.choice(MESSAGES[level])
          }
      }
      yield doc

# Injection en masse
success, _ = helpers.bulk(opensearch_client, generate_sample_data(200))
created_indexes = "\n-".join(indexes)
print(f"Succès : {success} logs injectés avec succès. Les index créés suivants ont été créés/alimentés :\n-{created_indexes}")