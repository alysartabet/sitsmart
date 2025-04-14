from dotenv import load_dotenv
from urllib.parse import urlparse
import psycopg2
import os

load_dotenv()

connection_string = os.getenv("DATABASE_URL")
p = urlparse(connection_string)

pg_connection_dict = {
    "host": p.hostname,
    "port": p.port,
    "user": p.username,
    "password": p.password,
    "database": p.path[1:],
}

print(pg_connection_dict)
con = psycopg2.connect(**pg_connection_dict)
print(con)