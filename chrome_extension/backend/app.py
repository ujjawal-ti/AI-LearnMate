# app.py
import os
import json
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import numpy as np
import faiss
import openai

load_dotenv()

# LLM Configuration - Fuelix API with Gemini 2.5 Pro
LLM_BASE_URL_EXPERT = "YOUR_FUELIX_API_ENDPOINT"
LLM_API_KEY_EXPERT = "YOUR_FUELIX_API_KEY"
LLM_MODEL_EXPERT = 'gemini-2.5-pro'
LLM_TEMPERATURE_EXPERT = 0.1
LLM_MAX_TOKENS_EXPERT = 4096

# Embedding Configuration - Fuelix API with OpenAI embeddings
EMBEDDING_API_KEY = "YOUR_FUELIX_API_KEY"
EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_BASE_URL = "YOUR_FUELIX_API_ENDPOINT"

# Initialize OpenAI client with Fuelix API for LLM
llm_client = openai.OpenAI(
    base_url=LLM_BASE_URL_EXPERT,
    api_key=LLM_API_KEY_EXPERT,
)

# Initialize OpenAI client with Fuelix API for embeddings
embedding_client = openai.OpenAI(
    base_url=EMBEDDING_BASE_URL,
    api_key=EMBEDDING_API_KEY,
)

# Config
EMBED_DIM = 3072  # gemini-embedding-001 dimension
INDEX_PATH = "faiss_index.bin"
DOCS_META_PATH = "docs_meta.json"

app = FastAPI(title="Tool Assistant Backend")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# in-memory structures (persist to disk)
index = None
docs_meta = []  # list of dicts: {'id': int, 'text': "...", 'title': "...", 'source': "docs/..."}

def create_index():
    global index
    index = faiss.IndexFlatIP(EMBED_DIM)  # cosine via normalized vectors with inner product
    print("Created new faiss IndexFlatIP")

def load_index():
    global index, docs_meta
    if os.path.exists(INDEX_PATH) and os.path.exists(DOCS_META_PATH):
        index = faiss.read_index(INDEX_PATH)
        with open(DOCS_META_PATH, 'r', encoding='utf-8') as f:
            docs_meta = json.load(f)
        print("Loaded index and docs meta from disk")
    else:
        create_index()

load_index()

class IngestRequest(BaseModel):
    docs_dir: str  # path on server containing .txt/.md files
    chunk_size: int = 500
    overlap: int = 50

class ChatRequest(BaseModel):
    query: str
    page_context: dict = {}
    top_k: int = 4

def normalize(vecs):
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return vecs / norms

def get_embeddings(texts: List[str]) -> np.ndarray:
    """Get embeddings using Fuelix API with OpenAI text-embedding-3-small model"""
    try:
        response = embedding_client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=texts
        )
        embeddings = [item.embedding for item in response.data]
        return np.array(embeddings)
    except Exception as e:
        raise HTTPException(500, detail=f"Embedding error: {e}")

@app.post("/ingest")
def ingest(req: IngestRequest):
    """
    Ingest all text files from a directory, chunk them, create embeddings, and build FAISS index.
    """
    import glob, os
    global index, docs_meta

    files = []
    exts = ("*.txt", "*.md")
    for e in exts:
        files.extend(glob.glob(os.path.join(req.docs_dir, e)))
    if not files:
        raise HTTPException(400, detail="No txt or md files found in docs_dir")

    chunks = []
    metas = []
    id_counter = 0
    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as fh:
            text = fh.read()
        # simple chunking by characters to keep things simple.
        L = len(text)
        i = 0
        while i < L:
            chunk = text[i:i+req.chunk_size]
            chunks.append(chunk)
            metas.append({"id": id_counter, "title": os.path.basename(fpath), "source": fpath})
            id_counter += 1
            i += req.chunk_size - req.overlap

    # compute embeddings in batches using Fuelix API
    batch_size = 20  # Smaller batch size for API calls
    all_embs = []
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        embs = get_embeddings(batch)
        all_embs.append(embs)
    all_embs = np.vstack(all_embs)
    all_embs = normalize(all_embs)

    # create new index
    index = faiss.IndexFlatIP(EMBED_DIM)
    index.add(all_embs.astype('float32'))

    docs_meta = metas
    faiss.write_index(index, INDEX_PATH)
    with open(DOCS_META_PATH, 'w', encoding='utf-8') as f:
        json.dump(docs_meta, f, ensure_ascii=False, indent=2)

    return {"status": "ok", "num_chunks": len(chunks)}

@app.post("/chat")
def chat(req: ChatRequest):
    """
    Accepts a query, prioritizes webpage content if available, falls back to FAISS retrieval,
    and calls the LLM to produce an answer grounded in the most relevant context.
    """
    # Check if webpage content is available
    webpage_content = req.page_context.get('content', '').strip()
    code_blocks = req.page_context.get('codeBlocks', [])
    images = req.page_context.get('images', [])
    videos = req.page_context.get('videos', [])
    has_webpage_content = len(webpage_content) > 50  # Minimum content threshold
    
    context_parts = []
    hits = []
    
    if has_webpage_content:
        # Use webpage content as primary source
        page_title = req.page_context.get('title', 'Current Webpage')
        page_url = req.page_context.get('url', '')
        
        context_parts.append(f"=== CURRENT WEBPAGE CONTENT ===")
        context_parts.append(f"Title: {page_title}")
        context_parts.append(f"URL: {page_url}")
        context_parts.append(f"Content: {webpage_content}")
        
        # Add code blocks if available
        if code_blocks:
            context_parts.append(f"\n=== CODE BLOCKS ON PAGE ({len(code_blocks)} found) ===")
            for i, block in enumerate(code_blocks[:5]):  # Limit to first 5 code blocks
                context_parts.append(f"Code Block {i+1} ({block.get('language', 'text')}):")
                context_parts.append(f"Context: {block.get('context', 'No context')}")
                context_parts.append(f"Code:\n{block.get('code', '')}\n---")
        
        # Add images if available
        if images:
            context_parts.append(f"\n=== IMAGES ON PAGE ({len(images)} found) ===")
            for i, img in enumerate(images[:3]):  # Limit to first 3 images
                context_parts.append(f"Image {i+1}:")
                context_parts.append(f"Alt text: {img.get('alt', 'No alt text')}")
                context_parts.append(f"Caption: {img.get('caption', 'No caption')}")
                context_parts.append(f"Source: {img.get('src', 'No source')}")
                context_parts.append(f"Context: {img.get('context', 'No context')}\n---")
        
        # Add videos if available
        if videos:
            context_parts.append(f"\n=== VIDEOS ON PAGE ({len(videos)} found) ===")
            for i, video in enumerate(videos[:3]):  # Limit to first 3 videos
                context_parts.append(f"Video {i+1}:")
                context_parts.append(f"Title: {video.get('title', 'No title')}")
                context_parts.append(f"Caption: {video.get('caption', 'No caption')}")
                context_parts.append(f"Source: {video.get('src', 'No source')}")
                context_parts.append(f"Context: {video.get('context', 'No context')}\n---")
        
        context_parts.append(f"=== END WEBPAGE CONTENT ===\n")
        
        # Also get some relevant chunks from knowledge base as supplementary context
        if index is not None and len(docs_meta) > 0:
            try:
                q_emb = get_embeddings([req.query])
                q_emb = normalize(q_emb).astype('float32')
                D, I = index.search(q_emb, min(req.top_k, 2))  # Fewer chunks since we have webpage content
                I = I[0].tolist()
                
                context_parts.append("=== SUPPLEMENTARY KNOWLEDGE BASE ===")
                for idx in I:
                    if idx >= 0 and idx < len(docs_meta):
                        h = docs_meta[idx]
                        hits.append(h)
                        try:
                            with open(h['source'], 'r', encoding='utf-8') as fh:
                                text = fh.read()
                            excerpt = text[:300].replace('\n', ' ')
                        except Exception:
                            excerpt = ""
                        context_parts.append(f"Title: {h.get('title','')}\nExcerpt: {excerpt}\n---")
                context_parts.append("=== END KNOWLEDGE BASE ===")
            except Exception:
                pass  # Continue without knowledge base if there's an error
        
        system_prompt = (
            "You are a helpful and conversational AI assistant that answers questions about webpages in a natural, human-friendly way. "
            "Format your responses using proper Markdown for better readability - use headers (##), bullet points (-), **bold text**, code blocks (```), and other Markdown formatting. "
            "PRIORITIZE the webpage content provided above all other sources. Use the supplementary knowledge base only if the webpage content doesn't contain the answer. "
            "When relevant to the user's question, include and reference code blocks, images, or videos from the webpage. "
            "For code blocks, use proper syntax highlighting with language tags (```javascript, ```python, etc.). "
            "For images, describe them and mention their purpose when relevant. "
            "For videos, reference their titles and content when applicable. "
            "Structure your answers clearly with appropriate headings and bullet points for easy reading. "
            "Keep your tone conversational and helpful, like ChatGPT would respond, but use Markdown formatting for better presentation."
        )
        
    else:
        # Fall back to knowledge base only
        if index is None or len(docs_meta) == 0:
            raise HTTPException(500, detail="No webpage content available and index not initialized. Call /ingest first or visit a webpage.")

        q_emb = get_embeddings([req.query])
        q_emb = normalize(q_emb).astype('float32')

        D, I = index.search(q_emb, req.top_k)
        I = I[0].tolist()
        
        for idx in I:
            if idx < 0 or idx >= len(docs_meta):
                continue
            h = docs_meta[idx]
            hits.append(h)
            try:
                with open(h['source'], 'r', encoding='utf-8') as fh:
                    text = fh.read()
                excerpt = text[:500].replace('\n', ' ')
            except Exception:
                excerpt = ""
            context_parts.append(f"Title: {h.get('title','')}\nExcerpt: {excerpt}\n---\n")

        system_prompt = (
            "You are a helpful and conversational AI assistant that answers questions using the provided knowledge base. "
            "Format your responses using proper Markdown for better readability - use headers (##), bullet points (-), **bold text**, and other Markdown formatting. "
            "Structure your answers clearly with appropriate headings and bullet points for easy reading. "
            "Use the context provided below and do NOT hallucinate facts. If the answer is not in the context, say you don't know and optionally give general guidance. "
            "Keep your tone conversational and helpful, like ChatGPT would respond, but use Markdown formatting for better presentation."
        )

    combined_context = "\n".join(context_parts)
    
    # Build user prompt
    page_info = f"Page: {req.page_context.get('title', 'Unknown')} ({req.page_context.get('url', 'No URL')})"
    user_prompt = f"Page Info: {page_info}\n\nContext:\n{combined_context}\n\nQuestion: {req.query}"

    # Call LLM using Fuelix API with Gemini 2.5 Pro
    try:
        chat_completion = llm_client.chat.completions.create(
            model=LLM_MODEL_EXPERT,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=LLM_TEMPERATURE_EXPERT,
            max_tokens=LLM_MAX_TOKENS_EXPERT,
        )
        
        # Handle response safely
        if chat_completion.choices and len(chat_completion.choices) > 0:
            content = chat_completion.choices[0].message.content
            answer = content.strip() if content else "No response generated"
        else:
            answer = "No response generated"
            
    except Exception as e:
        raise HTTPException(500, detail=f"LLM error: {e}")

    return {
        "answer": answer,
        "retrieved": hits
    }

@app.post("/chat/stream")
def chat_stream(req: ChatRequest):
    """
    Streaming version of the chat endpoint that returns Server-Sent Events (SSE)
    """
    # Check if webpage content is available
    webpage_content = req.page_context.get('content', '').strip()
    code_blocks = req.page_context.get('codeBlocks', [])
    images = req.page_context.get('images', [])
    videos = req.page_context.get('videos', [])
    has_webpage_content = len(webpage_content) > 50  # Minimum content threshold
    
    context_parts = []
    hits = []
    
    if has_webpage_content:
        # Use webpage content as primary source
        page_title = req.page_context.get('title', 'Current Webpage')
        page_url = req.page_context.get('url', '')
        
        context_parts.append(f"=== CURRENT WEBPAGE CONTENT ===")
        context_parts.append(f"Title: {page_title}")
        context_parts.append(f"URL: {page_url}")
        context_parts.append(f"Content: {webpage_content}")
        
        # Add code blocks if available
        if code_blocks:
            context_parts.append(f"\n=== CODE BLOCKS ON PAGE ({len(code_blocks)} found) ===")
            for i, block in enumerate(code_blocks[:5]):  # Limit to first 5 code blocks
                context_parts.append(f"Code Block {i+1} ({block.get('language', 'text')}):")
                context_parts.append(f"Context: {block.get('context', 'No context')}")
                context_parts.append(f"Code:\n{block.get('code', '')}\n---")
        
        # Add images if available
        if images:
            context_parts.append(f"\n=== IMAGES ON PAGE ({len(images)} found) ===")
            for i, img in enumerate(images[:3]):  # Limit to first 3 images
                context_parts.append(f"Image {i+1}:")
                context_parts.append(f"Alt text: {img.get('alt', 'No alt text')}")
                context_parts.append(f"Caption: {img.get('caption', 'No caption')}")
                context_parts.append(f"Source: {img.get('src', 'No source')}")
                context_parts.append(f"Context: {img.get('context', 'No context')}\n---")
        
        # Add videos if available
        if videos:
            context_parts.append(f"\n=== VIDEOS ON PAGE ({len(videos)} found) ===")
            for i, video in enumerate(videos[:3]):  # Limit to first 3 videos
                context_parts.append(f"Video {i+1}:")
                context_parts.append(f"Title: {video.get('title', 'No title')}")
                context_parts.append(f"Caption: {video.get('caption', 'No caption')}")
                context_parts.append(f"Source: {video.get('src', 'No source')}")
                context_parts.append(f"Context: {video.get('context', 'No context')}\n---")
        
        context_parts.append(f"=== END WEBPAGE CONTENT ===\n")
        
        # Also get some relevant chunks from knowledge base as supplementary context
        if index is not None and len(docs_meta) > 0:
            try:
                q_emb = get_embeddings([req.query])
                q_emb = normalize(q_emb).astype('float32')
                D, I = index.search(q_emb, min(req.top_k, 2))  # Fewer chunks since we have webpage content
                I = I[0].tolist()
                
                context_parts.append("=== SUPPLEMENTARY KNOWLEDGE BASE ===")
                for idx in I:
                    if idx >= 0 and idx < len(docs_meta):
                        h = docs_meta[idx]
                        hits.append(h)
                        try:
                            with open(h['source'], 'r', encoding='utf-8') as fh:
                                text = fh.read()
                            excerpt = text[:300].replace('\n', ' ')
                        except Exception:
                            excerpt = ""
                        context_parts.append(f"Title: {h.get('title','')}\nExcerpt: {excerpt}\n---")
                context_parts.append("=== END KNOWLEDGE BASE ===")
            except Exception:
                pass  # Continue without knowledge base if there's an error
        
        system_prompt = (
            "You are a helpful and conversational AI assistant that answers questions about webpages in a natural, human-friendly way. "
            "Format your responses using proper Markdown for better readability - use headers (##), bullet points (-), **bold text**, code blocks (```), and other Markdown formatting. "
            "PRIORITIZE the webpage content provided above all other sources. Use the supplementary knowledge base only if the webpage content doesn't contain the answer. "
            "When relevant to the user's question, include and reference code blocks, images, or videos from the webpage. "
            "For code blocks, use proper syntax highlighting with language tags (```javascript, ```python, etc.). "
            "For images, describe them and mention their purpose when relevant. "
            "For videos, reference their titles and content when applicable. "
            "Structure your answers clearly with appropriate headings and bullet points for easy reading. "
            "Keep your tone conversational and helpful, like ChatGPT would respond, but use Markdown formatting for better presentation."
        )
        
    else:
        # Fall back to knowledge base only
        if index is None or len(docs_meta) == 0:
            raise HTTPException(500, detail="No webpage content available and index not initialized. Call /ingest first or visit a webpage.")

        q_emb = get_embeddings([req.query])
        q_emb = normalize(q_emb).astype('float32')

        D, I = index.search(q_emb, req.top_k)
        I = I[0].tolist()
        
        for idx in I:
            if idx < 0 or idx >= len(docs_meta):
                continue
            h = docs_meta[idx]
            hits.append(h)
            try:
                with open(h['source'], 'r', encoding='utf-8') as fh:
                    text = fh.read()
                excerpt = text[:500].replace('\n', ' ')
            except Exception:
                excerpt = ""
            context_parts.append(f"Title: {h.get('title','')}\nExcerpt: {excerpt}\n---\n")

        system_prompt = (
            "You are a helpful and conversational AI assistant that answers questions using the provided knowledge base. "
            "Format your responses using proper Markdown for better readability - use headers (##), bullet points (-), **bold text**, and other Markdown formatting. "
            "Structure your answers clearly with appropriate headings and bullet points for easy reading. "
            "Use the context provided below and do NOT hallucinate facts. If the answer is not in the context, say you don't know and optionally give general guidance. "
            "Keep your tone conversational and helpful, like ChatGPT would respond, but use Markdown formatting for better presentation."
        )

    combined_context = "\n".join(context_parts)
    
    # Build user prompt
    page_info = f"Page: {req.page_context.get('title', 'Unknown')} ({req.page_context.get('url', 'No URL')})"
    user_prompt = f"Page Info: {page_info}\n\nContext:\n{combined_context}\n\nQuestion: {req.query}"

    def generate_stream():
        try:
            # Call LLM with streaming enabled
            stream = llm_client.chat.completions.create(
                model=LLM_MODEL_EXPERT,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=LLM_TEMPERATURE_EXPERT,
                max_tokens=LLM_MAX_TOKENS_EXPERT,
                stream=True,  # Enable streaming
            )
            
            # Send metadata first
            yield f"data: {json.dumps({'type': 'metadata', 'retrieved': hits})}\n\n"
            
            # Stream the response
            for chunk in stream:
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    if hasattr(delta, 'content') and delta.content:
                        # Send content chunk
                        yield f"data: {json.dumps({'type': 'content', 'content': delta.content})}\n\n"
            
            # Send completion signal
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            
        except Exception as e:
            # Send error
            yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/plain; charset=utf-8",
        }
    )

@app.get("/")
def root():
    return {
        "message": "Tool Assistant Backend API",
        "endpoints": {
            "health": "/health",
            "ingest": "/ingest (POST)",
            "chat": "/chat (POST)",
            "docs": "/docs (API documentation)"
        },
        "status": "running"
    }

@app.get("/health")
def health():
    return {"status":"ok"}
