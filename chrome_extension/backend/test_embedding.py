#!/usr/bin/env python3
import openai
import numpy as np

# Embedding Configuration - Fuelix API with Gemini embeddings
EMBEDDING_API_KEY = "ak-iD5ONBXxM0NwSCW63dPIS6GOgw1M"
EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_BASE_URL = "https://api.fuelix.ai/v1"

# Initialize OpenAI client with Fuelix API for embeddings
embedding_client = openai.OpenAI(
    base_url=EMBEDDING_BASE_URL,
    api_key=EMBEDDING_API_KEY,
)

def test_embedding_dimension():
    try:
        response = embedding_client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=["test text"]
        )
        embedding = response.data[0].embedding
        dimension = len(embedding)
        print(f"Embedding model: {EMBEDDING_MODEL}")
        print(f"Actual dimension: {dimension}")
        print(f"First 5 values: {embedding[:5]}")
        return dimension
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    test_embedding_dimension()
