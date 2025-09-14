# ingest_local.py
import requests
import json

backend = "http://localhost:8000"
payload = {"docs_dir": "./docs", "chunk_size": 500, "overlap": 80}
r = requests.post(backend + "/ingest", json=payload)
print(r.status_code, r.text)
