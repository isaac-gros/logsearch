import os
from os.path import exists, abspath
from dotenv import load_dotenv
from opensearchpy import AsyncOpenSearch

# Chargement des variables d'environnements
env_file = abspath('../.env')

if (exists(env_file)):
  load_dotenv(env_file)
else:
  raise FileNotFoundError(f".env file not found in {env_file}. Did you create one ?")

# Récupération des variables d'environnement
required_vars = ['DB_CLIENT_HOST', 'DB_CLIENT_PORT']
db_host = os.environ.get(required_vars[0])
db_port = os.environ.get(required_vars[1])

# Vérification des variables
if (
  (db_host != None and db_port != '') and 
  (db_port != None and db_port != '')
):
  opensearch_client = AsyncOpenSearch(
     hosts=[{"host": db_host, "port": int(db_port)}],
     use_ssl=False,
     verify_certs=False
  )
else:
  vars = ", ".join(required_vars)
  raise SystemError(f"One or more environment variables are empty. Required variables are {vars}")