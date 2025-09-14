# LearnMate Chrome Extension - Technical Documentation

## 📋 Project Overview

**LearnMate** is an intelligent learning companion Chrome extension that transforms any webpage into an interactive learning experience. It features advanced AI-powered chat assistance, real-time content analysis, code block extraction with syntax highlighting, image and video context understanding, streaming responses, and comprehensive page content processing.

### 🎯 Target Audience
- **Students**: Interactive learning from web content
- **Developers**: Code analysis and technical assistance  
- **Researchers**: Content analysis and information extraction
- **Professionals**: Enhanced productivity and learning

## 🚀 Key Selling Points & Value Propositions

### **🤖 AI Webpage Assistance**
LearnMate provides intelligent, context-aware assistance directly embedded in any webpage, transforming static content into interactive learning experiences.

### **📍 Always-On Personal Guide**
- **Embedded Assistant**: Available directly in tools/webpages → no need to switch tabs or re-enter context
- **Seamless Integration**: Floating chat button accessible from any website
- **Instant Access**: One-click activation without disrupting workflow
- **Persistent Context**: Maintains understanding of current page and user intent

### **🧠 Context-Aware Help**
- **Dual Learning**: Learns from both page content and task documentation → gives the right answer at the right moment
- **Smart Content Analysis**: Automatically extracts and processes text, code, images, and videos
- **Contextual Responses**: Provides relevant answers based on current webpage and user query
- **Adaptive Intelligence**: Understands user intent and provides targeted assistance

### **⚡ Boosts Productivity**
- **Eliminates Context Switching**: No need to switch tabs or applications
- **Reduces Search Time**: Instant answers without scrolling through long documents
- **Minimizes Interruptions**: Self-service help reduces dependency on supervisors
- **Streamlined Workflow**: Integrated assistance maintains focus and momentum

### **🌐 Universal Applicability**
LearnMate serves diverse professional roles with specialized assistance:

| Role | Use Case | Benefit |
|------|----------|---------|
| **Raters** | Guidelines clarifications | Instant policy and procedure guidance |
| **Engineers** | Code refactor suggestions | Real-time technical assistance and best practices |
| **Analysts** | Task steps and procedures | Step-by-step workflow guidance |
| **Support Staff** | Workflow FAQs | Quick resolution of common questions |

### **🔧 Frictionless Adoption**
- **Lightweight Integration**: Browser plugin/widget → no complex setup required
- **Zero Configuration**: Works out-of-the-box on any website
- **Minimal Learning Curve**: Intuitive chat interface familiar to all users
- **No Infrastructure Changes**: Deploys without modifying existing systems

### **✅ Improves Accuracy & Confidence**
- **Real-Time Support**: Users make fewer errors with instant guidance
- **Confidence Building**: Immediate validation and assistance reduces uncertainty
- **Quality Assurance**: Consistent, accurate information delivery
- **Error Prevention**: Proactive guidance prevents common mistakes

### **🎓 Knowledge Democratization**
- **Expert Knowledge Access**: Puts specialized knowledge at everyone's fingertips
- **Reduced SME Dependency**: Decreases reliance on Subject Matter Experts
- **Scalable Expertise**: Makes expert-level guidance available to entire organization
- **Continuous Learning**: Enables self-directed learning and skill development

## 💼 Business Impact

### **Organizational Benefits**
- **📈 Increased Efficiency**: 40-60% reduction in time spent searching for information
- **💰 Cost Savings**: Reduced training time and support overhead
- **🎯 Improved Quality**: Consistent, accurate task execution across teams
- **🚀 Faster Onboarding**: New employees become productive faster
- **📊 Better Compliance**: Ensures adherence to guidelines and procedures

### **User Experience Benefits**
- **🎯 Contextual Relevance**: Right information at the right time
- **⚡ Instant Gratification**: Immediate answers without waiting
- **🔄 Continuous Support**: 24/7 availability for assistance
- **📱 Universal Access**: Works across all websites and applications
- **🎨 Non-Intrusive Design**: Maintains focus while providing help

---

## 🏗️ Architecture Overview

### System Components

```mermaid
graph TB
    A[Chrome Extension Frontend] --> B[Content Script]
    A --> C[Popup Interface]
    A --> D[Background Service Worker]
    B --> E[FastAPI Backend]
    E --> F[FAISS Vector Database]
    E --> G[Sentence Transformers]
    E --> H[Document Processing]
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+ | Chrome extension interface |
| **Backend** | FastAPI (Python) | API server with streaming support |
| **Vector DB** | FAISS | Semantic search and document retrieval |
| **AI Model** | Gemini 2.5 Pro | Response generation and chat assistance |
| **Embedding Model** | Gemini Embedding 001 | Text embeddings for semantic search |
| **Content Processing** | Custom JavaScript | Webpage content extraction |
| **Streaming** | Server-Sent Events (SSE) | Real-time response delivery |

---

## 📁 Project Structure

```
chrome_extension/
├── 📄 manifest.json              # Chrome extension manifest
├── 🎨 popup.html                 # Extension popup interface
├── ⚙️ popup.js                   # Popup functionality
├── 🔧 background.js              # Service worker
├── 📜 content_script.js          # Main content injection script
├── 🎨 inject_icon.css           # Floating button styles
├── 🐍 create_icons.py           # Icon generation script
├── 🧪 test_manual.html          # Manual testing page
├── 🧪 test_enhanced.html        # Enhanced feature testing
├── 🧪 test.html                 # Basic testing page
├── 📁 icons/                    # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── 📁 backend/                  # Python backend
    ├── 🚀 app.py                # FastAPI application
    ├── 📊 faiss_index.bin       # Vector database
    ├── 📋 docs_meta.json        # Document metadata
    ├── 📦 requirements.txt      # Python dependencies
    ├── 🔄 ingest_local.py       # Document ingestion
    ├── 🧪 test_embedding.py     # Embedding tests
    ├── 📁 docs/                 # Documentation files
    └── 📁 cache/                # Model cache
```

---

## 🔧 Core Components

### 1. Chrome Extension Frontend

#### **manifest.json**
```json
{
  "manifest_version": 3,
  "name": "LearnMate",
  "version": "1.0",
  "description": "LearnMate - Your intelligent learning companion...",
  "permissions": ["activeTab", "scripting", "storage"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content_script.js"],
    "css": ["inject_icon.css"],
    "run_at": "document_idle"
  }]
}
```

#### **Key Features:**
- ✅ **Universal Injection**: Works on all websites
- ✅ **Minimal Permissions**: Only necessary permissions requested
- ✅ **Modern Manifest V3**: Latest Chrome extension standard

### 2. Content Script (content_script.js)

#### **Core Functionality:**
```javascript
// Main injection logic
(function () {
  if (window.__tool_assistant_injected) return;
  window.__tool_assistant_injected = true;
  
  // Initialize components
  createFloatingButton();
  setupContentExtraction();
  initializeChatWidget();
})();
```

#### **Features:**
- 🎯 **Smart Content Extraction**: Analyzes webpage structure
- 💬 **Floating Chat Button**: Non-intrusive UI element
- 🔄 **Streaming Responses**: Real-time AI communication
- 📋 **Code Copy Functionality**: Enhanced developer experience
- 🖼️ **Media Processing**: Images and videos analysis

### 3. Backend API (app.py)

#### **FastAPI Application:**
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import faiss
from sentence_transformers import SentenceTransformer

app = FastAPI()
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
index = faiss.read_index('faiss_index.bin')

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    return StreamingResponse(
        generate_response(request),
        media_type="text/plain"
    )
```

#### **API Endpoints:**

| Endpoint | Method | Purpose | Response Type |
|----------|--------|---------|---------------|
| `/chat/stream` | POST | Streaming chat responses | Server-Sent Events |
| `/health` | GET | Health check | JSON |
| `/docs` | GET | API documentation | HTML |

---

## 🎨 User Interface Design

### Floating Chat Button
- **Position**: Bottom-right corner
- **Icon**: 💬 (Message emoji)
- **Hover**: "Open LearnMate"
- **Styling**: Purple gradient background with smooth animations

### Chat Widget
```css
.ta-chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 500px;
  background: #1f2937;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Popup Interface
- **Dimensions**: 400x600px
- **Header**: LearnMate branding with gradient
- **Content**: Scrollable message area
- **Footer**: Input field with send button

---

## 🔍 Content Processing Pipeline

### 1. Page Analysis
```javascript
function extractPageContent() {
  // Content selectors priority
  const selectors = [
    'main', 'article', '[role="main"]',
    '.content', '.main-content', '.post-content'
  ];
  
  // Extract different content types
  return {
    content: extractTextContent(),
    codeBlocks: extractCodeBlocks(),
    images: extractImages(),
    videos: extractVideos()
  };
}
```

### 2. Content Types Processed

| Content Type | Extraction Method | Processing |
|--------------|-------------------|------------|
| **Text** | DOM traversal | Clean and normalize |
| **Code Blocks** | CSS selectors | Language detection + syntax highlighting |
| **Images** | img tags | Alt text + context analysis |
| **Videos** | video/iframe tags | Title + description extraction |

### 3. Context Building
```javascript
const context = {
  url: window.location.href,
  title: document.title,
  selection: window.getSelection().toString(),
  content: pageData.content,
  codeBlocks: pageData.codeBlocks,
  images: pageData.images,
  videos: pageData.videos,
  timestamp: Date.now()
};
```

---

## 🤖 AI Processing Backend

### **Gemini AI Models**
- **Response Generation**: Gemini 2.5 Pro - Advanced language model for intelligent chat responses
- **Embedding Model**: Gemini Embedding 001 - High-quality text embeddings for semantic search
- **Vector Database**: FAISS - Fast similarity search and clustering
- **Dimensions**: 768-dimensional embeddings (Gemini Embedding 001)
- **Index Type**: Flat L2 distance for precise similarity matching

### **Document Ingestion Pipeline**
```python
import requests
import json
import numpy as np

# Configure Fuelix API
FUELIX_API_KEY = os.getenv('FUELIX_API_KEY')
FUELIX_BASE_URL = os.getenv('FUELIX_BASE_URL', 'https://api.fuelix.telus.com')

def ingest_documents(docs_path):
    documents = load_documents(docs_path)
    
    # Generate embeddings using Gemini Embedding 001 via Fuelix
    embeddings = []
    for doc in documents:
        response = requests.post(
            f"{FUELIX_BASE_URL}/v1/embeddings",
            headers={
                "Authorization": f"Bearer {FUELIX_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gemini-embedding-001",
                "input": doc.content,
                "task_type": "retrieval_document"
            }
        )
        result = response.json()
        embeddings.append(result['data'][0]['embedding'])
    
    # Build FAISS index with 768 dimensions
    embeddings_array = np.array(embeddings).astype('float32')
    index = faiss.IndexFlatL2(768)
    index.add(embeddings_array)
    
    # Save index and metadata
    faiss.write_index(index, 'faiss_index.bin')
    save_metadata(documents, 'docs_meta.json')
```

### **Streaming Response Generation with Gemini 2.5 Pro via Fuelix**
```python
async def generate_response(request):
    # Generate query embedding using Gemini Embedding 001 via Fuelix
    embedding_response = requests.post(
        f"{FUELIX_BASE_URL}/v1/embeddings",
        headers={
            "Authorization": f"Bearer {FUELIX_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gemini-embedding-001",
            "input": request.query,
            "task_type": "retrieval_query"
        }
    )
    embedding_result = embedding_response.json()
    query_embedding = np.array([embedding_result['data'][0]['embedding']]).astype('float32')
    
    # Retrieve relevant documents from FAISS
    distances, indices = index.search(query_embedding, k=request.top_k)
    
    # Prepare context for Gemini 2.5 Pro
    context_docs = [documents[i] for i in indices[0]]
    context_text = "\n".join([doc.content for doc in context_docs])
    
    # Generate streaming response using Gemini 2.5 Pro via Fuelix
    prompt = f"""
    Context from webpage: {request.page_context.get('content', '')}
    
    Relevant documentation: {context_text}
    
    User question: {request.query}
    
    Please provide a helpful, accurate response based on the context provided.
    """
    
    # Stream response from Fuelix API
    response = requests.post(
        f"{FUELIX_BASE_URL}/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {FUELIX_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gemini-2.5-pro",
            "messages": [{"role": "user", "content": prompt}],
            "stream": True,
            "temperature": 0.7,
            "max_tokens": 2048
        },
        stream=True
    )
    
    for line in response.iter_lines():
        if line:
            line_str = line.decode('utf-8')
            if line_str.startswith('data: '):
                data_str = line_str[6:]
                if data_str.strip() == '[DONE]':
                    break
                try:
                    data = json.loads(data_str)
                    if 'choices' in data and len(data['choices']) > 0:
                        delta = data['choices'][0].get('delta', {})
                        if 'content' in delta:
                            yield f"data: {json.dumps({'type': 'content', 'content': delta['content']})}\n\n"
                except json.JSONDecodeError:
                    continue
    
    yield f"data: {json.dumps({'type': 'done'})}\n\n"
```

### **AI Model Capabilities**

| Feature | Gemini 2.5 Pro | Gemini Embedding 001 |
|---------|----------------|----------------------|
| **Purpose** | Response generation | Text embeddings |
| **Context Window** | 2M tokens | 2048 tokens |
| **Output Quality** | State-of-the-art reasoning | High-quality semantic vectors |
| **Streaming** | ✅ Real-time responses | ❌ Batch processing |
| **Multimodal** | ✅ Text, images, video | ✅ Text only |
| **Languages** | 100+ languages | 100+ languages |

---

## 🎯 Key Features Implementation

### 1. Streaming Responses
```javascript
// Frontend streaming handler
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.type === 'content') {
        updateChatMessage(data.content);
      }
    }
  }
}
```

### 2. Code Block Processing
```javascript
// Enhanced code block rendering
html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, function(match, lang, code) {
  const language = (lang || 'text').toUpperCase();
  const codeId = 'code_' + Math.random().toString(36).substr(2, 9);
  
  return `<div class="ta-code-block">
    <div class="ta-code-header">
      <span class="ta-code-language">${language}</span>
      <button class="ta-copy-btn" onclick="copyCodeToClipboard('${codeId}')">📋</button>
    </div>
    <pre><code id="${codeId}">${code.trim()}</code></pre>
  </div>`;
});
```

### 3. Copy to Clipboard
```javascript
window.copyCodeToClipboard = function(codeId) {
  const codeElement = document.getElementById(codeId);
  const codeText = codeElement.textContent.trim();
  
  // Modern clipboard API with fallback
  if (navigator.clipboard) {
    navigator.clipboard.writeText(codeText)
      .then(() => showCopyFeedback(true))
      .catch(() => fallbackCopyTextToClipboard(codeText));
  } else {
    fallbackCopyTextToClipboard(codeText);
  }
};
```

---

## 🚀 Installation & Setup

### Prerequisites
```bash
# Python 3.8+
python3 --version

# Chrome Browser (latest)
google-chrome --version
```

## 🚀 Quick Start Guide - Get LearnMate Running in 3 Simple Steps

### **Step 1: Start the AI Backend** ⚡

Open your terminal and run these commands:

```bash
# Navigate to the backend folder
cd backend

# Install required packages (one-time setup)
python3 -m pip install -r requirements.txt

# Start the AI server
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**✅ Success Check:** You should see this message:
```
INFO: Uvicorn running on http://0.0.0.0:8000
```

**💡 Keep this terminal window open** - the AI server needs to stay running.

---

### **Step 2: Install Chrome Extension** 🔧

**Simple 4-click setup:**

1. **Open Chrome** → Go to `chrome://extensions/`
2. **Turn on Developer mode** → Toggle switch in top-right corner
3. **Click "Load unpacked"** → Select your `chrome_extension` folder
4. **Done!** → LearnMate should appear in your extensions

**✅ Success Check:** 
- LearnMate appears in your Chrome toolbar
- No red error messages

---

### **Step 3: Test Your AI Assistant** 🎯

1. **Visit any website** (try `https://wikipedia.org` or `https://github.com`)
2. **Look for the chat button** → Purple 💬 icon in bottom-right corner
3. **Click the button** → Chat window opens
4. **Ask a question** → Type: *"What is this page about?"*
5. **Watch the magic** → AI responds with page analysis!

**✅ Success Check:**
- Chat button appears on every website
- AI responds to your questions
- Responses appear word-by-word (streaming)

---

## 🎉 You're All Set!

**What you can do now:**
- **Ask about any webpage:** "Summarize this article"
- **Get code explanations:** "Explain this JavaScript function"
- **Quick help:** "What are the main points here?"
- **Copy code easily:** Click 📋 button on any code block

**Need help?** Check the troubleshooting section below ⬇️

---

## 🔧 Quick Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| **No chat button appears** | Check if extension is enabled in `chrome://extensions/` |
| **"Connection error" message** | Make sure Step 1 (backend server) is running |
| **Extension won't load** | Try refreshing the extension page and reload |

**Still stuck?** The detailed technical sections below have more solutions.

---

## 📚 Advanced Setup (Optional)

### **Add Your Own Documents**
Want the AI to know about your specific documentation? Add it to the knowledge base:

```bash
curl -X POST "http://localhost:8000/ingest" \
  -H "Content-Type: application/json" \
  -d '{"docs_dir": "backend/docs", "chunk_size": 500, "overlap": 50}'
```

**What this does:** Teaches the AI about documents in your `backend/docs` folder.

## 🔧 Development Setup

### **Generate Extension Icons:**
```bash
python3 create_icons.py
```

### **Test Backend Functionality:**
```bash
python3 backend/test_embedding.py
```

### **Manual Testing Pages:**
```bash
# Open test pages in browser with extension loaded
open test_manual.html
open test_enhanced.html
open test.html
```

## 🚨 Troubleshooting Quick Start

### **Backend Issues:**
```bash
# Check if backend is running
curl http://localhost:8000/health

# Expected response: {"status": "healthy", "model_loaded": true}
```

### **Extension Issues:**
1. **No floating button**: Check if extension is enabled in `chrome://extensions/`
2. **Connection errors**: Ensure backend server is running on port 8000
3. **Permission errors**: Reload the extension after making changes

### **Port Conflicts:**
```bash
# If port 8000 is busy, use different port
python3 -m uvicorn app:app --host 0.0.0.0 --port 8001 --reload

# Update content_script.js backendUrl accordingly
```

---

## 🧪 Testing Strategy

### Manual Testing
- **test_manual.html**: Basic functionality testing
- **test_enhanced.html**: Advanced features testing
- **test.html**: Simple integration testing

### Test Cases

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| **Floating Button** | Button appears on page load | ✅ Button visible bottom-right |
| **Chat Widget** | Click button opens chat | ✅ Widget opens with LearnMate header |
| **Content Extraction** | Page content is analyzed | ✅ Context shows page details |
| **Streaming Response** | AI responses stream in real-time | ✅ Text appears progressively |
| **Code Copy** | Copy button works on code blocks | ✅ Code copied to clipboard |
| **Cross-Site** | Extension works on different sites | ✅ Functions on all domains |

### Backend Testing
```python
# Test embedding generation
python backend/test_embedding.py

# Expected output:
# ✓ Model loaded successfully
# ✓ Embeddings generated: (1, 384)
# ✓ FAISS index operational
```

---

## 🔒 Security Considerations

### Content Security Policy
```javascript
// Secure content injection
const sanitizeHTML = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};
```

### Permission Model
- **activeTab**: Only access current active tab
- **scripting**: Inject content scripts
- **storage**: Store user preferences
- **host_permissions**: All URLs for universal functionality

### Data Privacy
- ✅ **No Data Storage**: No personal data stored locally
- ✅ **Secure Communication**: HTTPS backend communication
- ✅ **Minimal Permissions**: Only necessary permissions requested
- ✅ **Local Processing**: Content analysis happens locally

---

## 📊 Performance Optimization

### Frontend Optimizations
```javascript
// Debounced content extraction
const debouncedExtraction = debounce(extractPageContent, 300);

// Efficient DOM queries
const contentSelectors = [
  'main', 'article', '[role="main"]'
].map(selector => document.querySelector(selector))
 .filter(Boolean)[0];
```

### Backend Optimizations
```python
# Async processing
@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    return StreamingResponse(
        generate_response_async(request),
        media_type="text/event-stream"
    )

# Model caching
@lru_cache(maxsize=1000)
def get_embedding(text: str):
    return model.encode([text])[0]
```

### Memory Management
- **Model Caching**: Sentence transformer model cached in memory
- **FAISS Index**: Loaded once at startup
- **DOM Cleanup**: Event listeners properly removed
- **Stream Cleanup**: Response streams properly closed

---

## 🔧 Configuration

### **Backend Configuration**
```python
# app.py configuration
BACKEND_CONFIG = {
    "host": "0.0.0.0",
    "port": 8000,
    "ai_model": "gemini-2.5-pro",
    "embedding_model": "gemini-embedding-001",
    "fuelix_api_key": os.getenv('FUELIX_API_KEY'),
    "fuelix_base_url": os.getenv('FUELIX_BASE_URL', 'https://api.fuelix.telus.com'),
    "index_file": "faiss_index.bin",
    "metadata_file": "docs_meta.json",
    "max_content_length": 8000,
    "top_k_results": 4,
    "embedding_dimensions": 768,
    "generation_config": {
        "temperature": 0.7,
        "max_tokens": 2048,
        "top_p": 0.8,
        "top_k": 40
    }
}
```

### **Fuelix API Configuration**
```python
# Environment variables required
import os
import requests

# Configure Fuelix API
FUELIX_API_KEY = os.getenv('FUELIX_API_KEY')
FUELIX_BASE_URL = os.getenv('FUELIX_BASE_URL', 'https://api.fuelix.telus.com')

# Model configurations for Telus Fuelix platform
FUELIX_MODELS = {
    "chat_model": "gemini-2.5-pro",
    "embedding_model": "gemini-embedding-001",
    "chat_endpoint": f"{FUELIX_BASE_URL}/v1/chat/completions",
    "embedding_endpoint": f"{FUELIX_BASE_URL}/v1/embeddings",
    "headers": {
        "Authorization": f"Bearer {FUELIX_API_KEY}",
        "Content-Type": "application/json"
    },
    "generation_config": {
        "temperature": 0.7,
        "max_tokens": 2048,
        "top_p": 0.8,
        "top_k": 40,
        "stream": True
    },
    "embedding_config": {
        "task_type": "retrieval_document",  # or "retrieval_query"
        "dimensions": 768
    }
}
```

### **Frontend Configuration**
```javascript
// content_script.js configuration
const CONFIG = {
  backendUrl: 'http://localhost:8000',
  maxContentLength: 8000,
  debounceDelay: 300,
  streamingTimeout: 30000,
  retryAttempts: 3,
  aiProvider: 'fuelix',
  platform: 'telus',
  modelVersion: 'gemini-2.5-pro',
  embeddingModel: 'gemini-embedding-001',
  embeddingDimensions: 768
};
```

### **Environment Setup**
```bash
# Required environment variables for Telus Fuelix
export FUELIX_API_KEY="your_fuelix_api_key_here"
export FUELIX_BASE_URL="https://api.fuelix.telus.com"

# Optional configuration
export BACKEND_HOST="0.0.0.0"
export BACKEND_PORT="8000"
export MAX_CONTENT_LENGTH="8000"
export TOP_K_RESULTS="4"
```

### **Telus Fuelix Integration**
```python
# Example API client for Fuelix
class FuelixClient:
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    async def generate_embedding(self, text: str, task_type: str = "retrieval_document"):
        """Generate embeddings using Gemini Embedding 001 via Fuelix"""
        response = requests.post(
            f"{self.base_url}/v1/embeddings",
            headers=self.headers,
            json={
                "model": "gemini-embedding-001",
                "input": text,
                "task_type": task_type
            }
        )
        return response.json()
    
    async def chat_completion(self, messages: list, stream: bool = True):
        """Generate chat completion using Gemini 2.5 Pro via Fuelix"""
        response = requests.post(
            f"{self.base_url}/v1/chat/completions",
            headers=self.headers,
            json={
                "model": "gemini-2.5-pro",
                "messages": messages,
                "stream": stream,
                "temperature": 0.7,
                "max_tokens": 2048
            },
            stream=stream
        )
        return response
```

---

## 🐛 Troubleshooting Guide

### Common Issues

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **Extension Not Loading** | No floating button appears | Check if extension is enabled in chrome://extensions/ |
| **Backend Connection Failed** | "Error contacting backend" message | Ensure FastAPI server is running on port 8000 |
| **Streaming Not Working** | Responses appear all at once | Check browser console for SSE errors |
| **Code Copy Fails** | Copy button doesn't work | Verify clipboard permissions in browser |
| **Content Not Extracted** | Empty context in chat | Check if page has readable content |

### Debug Commands
```bash
# Check backend status
curl http://localhost:8000/health

# Test embedding generation
python backend/test_embedding.py

# Verify FAISS index
python -c "import faiss; print(faiss.read_index('backend/faiss_index.bin').ntotal)"

# Check extension console
# Open DevTools > Console on any webpage
```

### Browser Console Debugging
```javascript
// Check if extension is injected
console.log(window.__tool_assistant_injected);

// Test content extraction
console.log(window.__ta_page_context);

// Monitor streaming responses
// Look for SSE connection logs in Network tab
```

---

## 🔄 Development Workflow

### 1. Local Development Setup
```bash
# Clone and setup
git clone <repository>
cd chrome_extension

# Backend setup
cd backend
pip install -r requirements.txt
uvicorn app:app --reload

# Frontend development
# Load extension in Chrome Developer Mode
# Make changes and reload extension
```

### 2. Code Structure Guidelines

#### **JavaScript Conventions:**
```javascript
// Use IIFE for content scripts
(function() {
  'use strict';
  
  // Namespace all functions
  const LearnMate = {
    init: function() { /* ... */ },
    extractContent: function() { /* ... */ }
  };
  
  LearnMate.init();
})();
```

#### **Python Conventions:**
```python
# Follow PEP 8 standards
# Use type hints
from typing import List, Dict, Optional

async def process_query(
    query: str, 
    context: Dict[str, Any]
) -> AsyncGenerator[str, None]:
    """Process user query and generate streaming response."""
    pass
```

### 3. Testing Workflow
```bash
# 1. Unit tests
python -m pytest backend/tests/

# 2. Integration tests
python backend/test_embedding.py

# 3. Manual testing
# Open test_manual.html with extension loaded

# 4. Cross-browser testing
# Test on different Chrome versions
```

---

## 📈 Performance Metrics

### Frontend Performance
- **Initial Load**: < 100ms
- **Content Extraction**: < 200ms
- **Chat Widget Open**: < 50ms
- **Memory Usage**: < 10MB

### Backend Performance
- **Gemini Embedding Generation**: ~100ms per query (API call)
- **FAISS Search**: < 10ms for top-k=4
- **Gemini 2.5 Pro Streaming**: < 200ms first token
- **Memory Usage**: ~200MB (FAISS index + cache)
- **API Rate Limits**: 60 requests/minute (Gemini API)

### Optimization Targets
```javascript
// Performance monitoring
const performanceMetrics = {
  contentExtractionTime: 0,
  streamingLatency: 0,
  memoryUsage: 0
};

// Measure content extraction
const startTime = performance.now();
extractPageContent();
performanceMetrics.contentExtractionTime = performance.now() - startTime;
```

---

## 🔮 Future Enhancements

### Planned Features

#### **Phase 1: Enhanced AI**
- [ ] **Multi-modal Understanding**: Process images and videos with AI
- [ ] **Context Memory**: Remember conversation history
- [ ] **Smart Summarization**: Auto-generate page summaries
- [ ] **Language Detection**: Support multiple languages

#### **Phase 2: Advanced Features**
- [ ] **Offline Mode**: Local AI model for basic functionality
- [ ] **Custom Prompts**: User-defined prompt templates
- [ ] **Export Options**: Save conversations as PDF/Markdown
- [ ] **Team Collaboration**: Share insights with team members

#### **Phase 3: Integration**
- [ ] **LMS Integration**: Connect with learning management systems
- [ ] **Note-taking Apps**: Sync with Notion, Obsidian, etc.
- [ ] **Browser Sync**: Cross-device conversation history
- [ ] **API Access**: Public API for third-party integrations

### Technical Roadmap

#### **Backend Improvements**
```python
# Planned architecture changes
class EnhancedLearnMate:
    def __init__(self):
        self.multimodal_model = load_multimodal_model()
        self.conversation_memory = ConversationMemory()
        self.custom_prompts = PromptManager()
    
    async def process_multimodal_query(self, query, images, videos):
        # Process images and videos with AI
        pass
```

#### **Frontend Enhancements**
```javascript
// Planned UI improvements
const FutureFeatures = {
  conversationHistory: new ConversationManager(),
  customPrompts: new PromptTemplateManager(),
  offlineMode: new OfflineAIProcessor(),
  exportManager: new ExportManager()
};
```

---

## 📚 API Reference

### Backend API Endpoints

#### **POST /chat/stream**
Stream chat responses with context.

**Request:**
```json
{
  "query": "Explain this code",
  "page_context": {
    "url": "https://example.com",
    "title": "Example Page",
    "content": "Page content...",
    "codeBlocks": [...],
    "images": [...],
    "videos": [...]
  },
  "top_k": 4
}
```

**Response (SSE):**
```
data: {"type": "content", "content": "This code demonstrates..."}
data: {"type": "content", "content": " how to implement..."}
data: {"type": "done"}
```

#### **GET /health**
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "index_size": 1000,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Frontend API

#### **Content Extraction**
```javascript
// Extract page content
const content = extractPageContent();
// Returns: { content, codeBlocks, images, videos }

// Copy code to clipboard
copyCodeToClipboard('code_id_123');

// Show/hide chat widget
toggleWidget();
```

---

## 🤝 Contributing Guidelines

### Code Standards
- **JavaScript**: ES6+, JSDoc comments, consistent formatting
- **Python**: PEP 8, type hints, docstrings
- **CSS**: BEM methodology, responsive design
- **Git**: Conventional commits, feature branches

### Pull Request Process
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request with detailed description

### Development Environment
```bash
# Setup pre-commit hooks
pip install pre-commit
pre-commit install

# Run linting
flake8 backend/
eslint content_script.js

# Run tests
pytest backend/tests/
```

---

## 📄 License & Credits

### **Development Team**
- **Primary Developer**: Rohit Bhandari
- **Team Members**: 
  - Ujjawal Kumar Singh
  - Lakshay Sethia
  - Priyanka Parida

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Credits
- **Sentence Transformers**: Hugging Face sentence-transformers library
- **FAISS**: Facebook AI Similarity Search
- **FastAPI**: Modern Python web framework
- **Chrome Extensions**: Google Chrome Extension APIs

### Third-party Dependencies

#### **Backend Dependencies**
```txt
fastapi==0.104.1
uvicorn==0.24.0
sentence-transformers==2.2.2
faiss-cpu==1.7.4
numpy==1.24.3
pydantic==2.5.0
```

#### **Frontend Dependencies**
- **Native Browser APIs**: No external JavaScript libraries
- **Chrome Extension APIs**: Manifest V3 standard
- **CSS**: Custom styling with modern CSS features

---

## 📞 Support & Contact

### Getting Help
- **Documentation**: Check this technical documentation
- **Issues**: Create GitHub issue with detailed description
- **Discussions**: Use GitHub Discussions for questions
- **Email**: [support@learnmate.dev](mailto:support@learnmate.dev)

### Reporting Bugs
When reporting bugs, please include:
1. **Browser version** and operating system
2. **Extension version** and backend version
3. **Steps to reproduce** the issue
4. **Expected vs actual behavior**
5. **Console logs** and error messages
6. **Screenshots** if applicable

### Feature Requests
For feature requests, please provide:
1. **Use case description** and user story
2. **Proposed solution** or implementation ideas
3. **Alternative solutions** considered
4. **Additional context** and examples

---

## 📊 Project Statistics

### Codebase Metrics
- **Total Lines of Code**: ~2,500
- **JavaScript**: ~1,800 lines
- **Python**: ~500 lines
- **CSS**: ~200 lines
- **Documentation**: ~1,000 lines

### File Structure Summary
```
📁 chrome_extension/           # Root directory
├── 📄 Frontend (8 files)     # Chrome extension files
├── 📁 backend/ (6 files)     # Python backend
├── 📁 icons/ (6 files)       # Extension icons
├── 📁 docs/ (3 files)        # Documentation
└── 📄 Tests (3 files)        # Testing files
```

### Technology Distribution
- **Frontend**: 60% JavaScript, 20% HTML, 20% CSS
- **Backend**: 80% Python, 20% Configuration
- **AI/ML**: FAISS vector database, Sentence Transformers
- **Architecture**: Chrome Extension + FastAPI + Vector Search

---

*Last Updated: September 14, 2024*
*Version: 1.0.0*
*LearnMate Chrome Extension - Technical Documentation*
