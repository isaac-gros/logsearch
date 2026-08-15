import os
from os.path import exists, abspath
from dotenv import load_dotenv

# Chargement des variables d'environnements
# On vérifie que le fichier est présent
env_file = abspath('../.env')
if (exists(env_file)):
  load_dotenv(env_file)
else:
  raise FileNotFoundError(f".env file not found in {env_file}. Did you create one ?")

# Récupération des variables d'environnement
required_vars = ['DB_CLIENT_HOST', 'DB_CLIENT_PORT']
env_db_host = os.environ.get(required_vars[0])
env_db_port = os.environ.get(required_vars[1])

# Vérification des variables
if (
  (env_db_host == None or env_db_host == '') and 
  (env_db_port == None or env_db_port == '')
):
  vars = ", ".join(required_vars)
  raise SystemError(f"One or more environment variables are empty. Required variables are {vars}")
else:

  # On convertit en entier le port de la variable d'environnement
  env_db_port = int(env_db_port)