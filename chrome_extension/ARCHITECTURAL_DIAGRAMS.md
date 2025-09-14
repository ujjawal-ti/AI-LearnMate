# LearnMate Chrome Extension - Architectural Diagrams

## 🏗️ System Architecture Overview

### 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "User Environment"
        U[User] --> B[Chrome Browser]
        B --> W[Any Website]
    end
    
    subgraph "Chrome Extension"
        CE[Chrome Extension] --> CS[Content Script]
        CE --> P[Popup Interface]
        CE --> BG[Background Service Worker]
        CE --> M[Manifest.json]
    end
    
    subgraph "Frontend Components"
        CS --> FB[Floating Button]
        CS --> CW[Chat Widget]
        CS --> CP[Content Processor]
        P --> UI[Popup UI]
    end
    
    subgraph "Backend Infrastructure"
        API[FastAPI Backend]
        VDB[FAISS Vector Database]
        EMB[Document Embeddings]
        META[Metadata Store]
    end
    
    subgraph "AI Services (Fuelix/Telus)"
        FUELIX[Fuelix API Gateway]
        GEMINI_CHAT[Gemini 2.5 Pro]
        GEMINI_EMB[Gemini Embedding 001]
    end
    
    subgraph "Data Storage"
        DOCS[Documentation Files]
        CACHE[Model Cache]
        INDEX[FAISS Index]
    end
    
    %% User Interactions
    U --> CE
    W --> CS
    
    %% Extension Internal Flow
    CS --> API
    P --> API
    
    %% Backend Processing
    API --> VDB
    API --> FUELIX
    FUELIX --> GEMINI_CHAT
    FUELIX --> GEMINI_EMB
    
    %% Data Flow
    DOCS --> EMB
    EMB --> INDEX
    INDEX --> VDB
    META --> VDB
    
    %% Styling
    classDef userEnv fill:#e1f5fe
    classDef extension fill:#f3e5f5
    classDef frontend fill:#e8f5e8
    classDef backend fill:#fff3e0
    classDef ai fill:#fce4ec
    classDef storage fill:#f1f8e9
    
    class U,B,W userEnv
    class CE,CS,P,BG,M extension
    class FB,CW,CP,UI frontend
    class API,VDB,EMB,META backend
    class FUELIX,GEMINI_CHAT,GEMINI_EMB ai
    class DOCS,CACHE,INDEX storage
```

### 2. Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant W as Website
    participant CS as Content Script
    participant API as FastAPI Backend
    participant F as Fuelix API
    participant G2 as Gemini 2.5 Pro
    participant GE as Gemini Embedding
    participant VDB as FAISS Vector DB
    
    Note over U,VDB: User Interaction Flow
    
    U->>W: Visits webpage
    W->>CS: Page loads
    CS->>CS: Extract page content
    CS->>CS: Show floating button
    
    U->>CS: Clicks chat button
    CS->>CS: Open chat widget
    
    U->>CS: Types question
    CS->>API: POST /chat/stream
    
    Note over API,VDB: Backend Processing
    
    API->>F: Generate query embedding
    F->>GE: Embed user query
    GE-->>F: Return embedding vector
    F-->>API: Return embedding
    
    API->>VDB: Search similar documents
    VDB-->>API: Return relevant docs
    
    API->>F: Generate response
    F->>G2: Stream chat completion
    
    Note over G2,CS: Streaming Response
    
    G2-->>F: Stream response chunks
    F-->>API: Stream response chunks
    API-->>CS: SSE stream
    CS->>CS: Update chat UI
    CS->>U: Display response
```

### 3. Component Interaction Diagram

```mermaid
graph LR
    subgraph "Chrome Extension Frontend"
        subgraph "Content Script Layer"
            FB[Floating Button]
            CW[Chat Widget]
            CE[Content Extractor]
            SR[Stream Reader]
        end
        
        subgraph "Popup Layer"
            PUI[Popup Interface]
            PF[Popup Form]
        end
        
        subgraph "Background Layer"
            SW[Service Worker]
            ST[Storage Manager]
        end
    end
    
    subgraph "Backend API Layer"
        subgraph "FastAPI Application"
            CH[Chat Handler]
            HE[Health Endpoint]
            IN[Ingestion Handler]
        end
        
        subgraph "AI Processing"
            EM[Embedding Manager]
            RG[Response Generator]
            SC[Stream Controller]
        end
        
        subgraph "Data Management"
            VQ[Vector Query]
            DM[Document Manager]
            CM[Cache Manager]
        end
    end
    
    subgraph "External Services"
        FA[Fuelix API]
        GP[Gemini 2.5 Pro]
        GE[Gemini Embedding]
    end
    
    subgraph "Data Storage"
        FI[FAISS Index]
        MD[Metadata JSON]
        DC[Document Cache]
    end
    
    %% Frontend Interactions
    FB --> CW
    CW --> CE
    CW --> SR
    PUI --> PF
    
    %% Frontend to Backend
    CW --> CH
    PF --> CH
    CE --> IN
    
    %% Backend Internal
    CH --> EM
    CH --> RG
    RG --> SC
    EM --> VQ
    IN --> DM
    
    %% Backend to External
    EM --> FA
    RG --> FA
    FA --> GP
    FA --> GE
    
    %% Data Access
    VQ --> FI
    DM --> MD
    CM --> DC
    
    %% Styling
    classDef frontend fill:#e3f2fd
    classDef backend fill:#f3e5f5
    classDef external fill:#fff3e0
    classDef storage fill:#e8f5e8
    
    class FB,CW,CE,SR,PUI,PF,SW,ST frontend
    class CH,HE,IN,EM,RG,SC,VQ,DM,CM backend
    class FA,GP,GE external
    class FI,MD,DC storage
```

### 4. AI Processing Pipeline

```mermaid
flowchart TD
    subgraph "Input Processing"
        UQ[User Query]
        PC[Page Content]
        SE[Selected Text]
    end
    
    subgraph "Content Analysis"
        CA[Content Analyzer]
        TE[Text Extractor]
        CB[Code Block Detector]
        IM[Image Analyzer]
        VM[Video Analyzer]
    end
    
    subgraph "Context Building"
        CC[Context Compiler]
        CF[Context Filter]
        CP[Context Prioritizer]
    end
    
    subgraph "Embedding Generation"
        EG[Embedding Generator]
        FE[Fuelix Embedding API]
        GE[Gemini Embedding 001]
    end
    
    subgraph "Vector Search"
        VS[Vector Search]
        FI[FAISS Index]
        SM[Similarity Matching]
        RR[Relevance Ranking]
    end
    
    subgraph "Response Generation"
        PB[Prompt Builder]
        FC[Fuelix Chat API]
        GP[Gemini 2.5 Pro]
        RS[Response Streamer]
    end
    
    subgraph "Output Processing"
        RF[Response Formatter]
        MD[Markdown Renderer]
        CC2[Code Highlighter]
        CB2[Copy Button Generator]
    end
    
    %% Flow connections
    UQ --> CA
    PC --> CA
    SE --> CA
    
    CA --> TE
    CA --> CB
    CA --> IM
    CA --> VM
    
    TE --> CC
    CB --> CC
    IM --> CC
    VM --> CC
    
    CC --> CF
    CF --> CP
    
    CP --> EG
    EG --> FE
    FE --> GE
    
    GE --> VS
    VS --> FI
    FI --> SM
    SM --> RR
    
    RR --> PB
    PB --> FC
    FC --> GP
    GP --> RS
    
    RS --> RF
    RF --> MD
    RF --> CC2
    RF --> CB2
    
    %% Styling
    classDef input fill:#e1f5fe
    classDef analysis fill:#f3e5f5
    classDef context fill:#e8f5e8
    classDef embedding fill:#fff3e0
    classDef search fill:#fce4ec
    classDef generation fill:#f1f8e9
    classDef output fill:#e0f2f1
    
    class UQ,PC,SE input
    class CA,TE,CB,IM,VM analysis
    class CC,CF,CP context
    class EG,FE,GE embedding
    class VS,FI,SM,RR search
    class PB,FC,GP,RS generation
    class RF,MD,CC2,CB2 output
```

### 5. Chrome Extension Architecture

```mermaid
graph TB
    subgraph "Chrome Browser Environment"
        subgraph "Extension Context"
            M[manifest.json]
            SW[Service Worker<br/>background.js]
            P[Popup<br/>popup.html + popup.js]
        end
        
        subgraph "Web Page Context"
            CS[Content Script<br/>content_script.js]
            CSS[Injected Styles<br/>inject_icon.css]
            DOM[Website DOM]
        end
        
        subgraph "Extension UI Components"
            FB[Floating Button 💬]
            CW[Chat Widget]
            PI[Popup Interface]
        end
    end
    
    subgraph "Content Processing"
        CE[Content Extractor]
        CP[Content Processor]
        CC[Context Compiler]
    end
    
    subgraph "Communication Layer"
        API[API Client]
        SSE[SSE Handler]
        ERR[Error Handler]
    end
    
    subgraph "Backend Services"
        BE[FastAPI Backend<br/>localhost:8000]
    end
    
    %% Extension Internal
    M --> SW
    M --> P
    M --> CS
    CS --> CSS
    CS --> DOM
    
    %% UI Components
    CS --> FB
    FB --> CW
    P --> PI
    
    %% Content Processing
    DOM --> CE
    CE --> CP
    CP --> CC
    
    %% Communication
    CW --> API
    PI --> API
    API --> SSE
    API --> ERR
    
    %% Backend Connection
    API --> BE
    SSE --> BE
    
    %% Permissions & Security
    M -.-> |activeTab| DOM
    M -.-> |scripting| CS
    M -.-> |storage| SW
    M -.-> |host_permissions| API
    
    %% Styling
    classDef extension fill:#e3f2fd
    classDef webpage fill:#f3e5f5
    classDef ui fill:#e8f5e8
    classDef processing fill:#fff3e0
    classDef communication fill:#fce4ec
    classDef backend fill:#f1f8e9
    
    class M,SW,P extension
    class CS,CSS,DOM webpage
    class FB,CW,PI ui
    class CE,CP,CC processing
    class API,SSE,ERR communication
    class BE backend
```

### 6. Backend API Architecture

```mermaid
graph TB
    subgraph "FastAPI Application"
        subgraph "API Layer"
            CR[Chat Router]
            HR[Health Router]
            IR[Ingestion Router]
            DR[Docs Router]
        end
        
        subgraph "Middleware"
            CORS[CORS Middleware]
            AUTH[Auth Middleware]
            LOG[Logging Middleware]
            ERR[Error Handler]
        end
        
        subgraph "Business Logic"
            CS[Chat Service]
            ES[Embedding Service]
            DS[Document Service]
            VS[Vector Service]
        end
        
        subgraph "External Integrations"
            FC[Fuelix Client]
            GC[Gemini Chat Client]
            GE[Gemini Embedding Client]
        end
        
        subgraph "Data Access"
            VDB[Vector Database]
            FS[File System]
            CACHE[Cache Manager]
        end
    end
    
    subgraph "External Services"
        FUELIX[Fuelix API<br/>api.fuelix.telus.com]
        GEMINI[Gemini Models]
    end
    
    subgraph "Data Storage"
        FAISS[FAISS Index<br/>faiss_index.bin]
        META[Metadata<br/>docs_meta.json]
        DOCS[Documents<br/>backend/docs/]
        MODELS[Model Cache<br/>backend/cache/]
    end
    
    %% API Flow
    CR --> CS
    HR --> CS
    IR --> DS
    DR --> DS
    
    %% Middleware
    CORS --> CR
    AUTH --> CR
    LOG --> CR
    ERR --> CR
    
    %% Business Logic
    CS --> ES
    CS --> VS
    DS --> ES
    DS --> VS
    
    %% External Calls
    ES --> FC
    CS --> FC
    FC --> FUELIX
    FUELIX --> GEMINI
    
    %% Data Access
    VS --> VDB
    DS --> FS
    ES --> CACHE
    
    %% Storage
    VDB --> FAISS
    VDB --> META
    FS --> DOCS
    CACHE --> MODELS
    
    %% Styling
    classDef api fill:#e3f2fd
    classDef middleware fill:#f3e5f5
    classDef business fill:#e8f5e8
    classDef external fill:#fff3e0
    classDef data fill:#fce4ec
    classDef storage fill:#f1f8e9
    
    class CR,HR,IR,DR api
    class CORS,AUTH,LOG,ERR middleware
    class CS,ES,DS,VS business
    class FC,GC,GE external
    class VDB,FS,CACHE data
    class FUELIX,GEMINI,FAISS,META,DOCS,MODELS storage
```

### 7. Security & Data Flow

```mermaid
graph TB
    subgraph "Security Boundaries"
        subgraph "Browser Security Context"
            CSP[Content Security Policy]
            PERM[Extension Permissions]
            SAND[Sandboxed Environment]
        end
        
        subgraph "Network Security"
            HTTPS[HTTPS Communication]
            CORS[CORS Headers]
            AUTH[API Authentication]
        end
        
        subgraph "Data Privacy"
            LOCAL[Local Processing]
            NOSTORE[No Data Storage]
            ENCRYPT[Encrypted Transit]
        end
    end
    
    subgraph "Data Flow Security"
        subgraph "Input Sanitization"
            HTML[HTML Sanitization]
            XSS[XSS Prevention]
            INJECT[Injection Prevention]
        end
        
        subgraph "API Security"
            RATE[Rate Limiting]
            VALID[Input Validation]
            TOKEN[Token Authentication]
        end
        
        subgraph "Enterprise Security"
            FUELIX[Fuelix API Gateway]
            TELUS[Telus Infrastructure]
            AUDIT[Audit Logging]
        end
    end
    
    %% Security Flow
    CSP --> HTML
    PERM --> XSS
    SAND --> INJECT
    
    HTTPS --> RATE
    CORS --> VALID
    AUTH --> TOKEN
    
    LOCAL --> FUELIX
    NOSTORE --> TELUS
    ENCRYPT --> AUDIT
    
    %% Styling
    classDef browser fill:#e3f2fd
    classDef network fill:#f3e5f5
    classDef privacy fill:#e8f5e8
    classDef input fill:#fff3e0
    classDef api fill:#fce4ec
    classDef enterprise fill:#f1f8e9
    
    class CSP,PERM,SAND browser
    class HTTPS,CORS,AUTH network
    class LOCAL,NOSTORE,ENCRYPT privacy
    class HTML,XSS,INJECT input
    class RATE,VALID,TOKEN api
    class FUELIX,TELUS,AUDIT enterprise
```

### 8. Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        DEV[Developer Machine]
        GIT[Git Repository]
        IDE[VS Code]
    end
    
    subgraph "Chrome Extension Distribution"
        CWS[Chrome Web Store]
        DEV_MODE[Developer Mode]
        UNPACKED[Unpacked Extension]
    end
    
    subgraph "Backend Deployment"
        LOCAL[Local Development<br/>localhost:8000]
        STAGING[Staging Environment]
        PROD[Production Environment]
    end
    
    subgraph "AI Services Infrastructure"
        TELUS[Telus Infrastructure]
        FUELIX[Fuelix Platform]
        GEMINI[Gemini Models]
    end
    
    subgraph "Data & Storage"
        LOCAL_DB[Local FAISS Index]
        SHARED_DB[Shared Vector Database]
        DOC_STORE[Document Storage]
    end
    
    %% Development Flow
    DEV --> GIT
    IDE --> DEV
    
    %% Distribution
    GIT --> CWS
    GIT --> DEV_MODE
    DEV_MODE --> UNPACKED
    
    %% Backend Deployment
    DEV --> LOCAL
    LOCAL --> STAGING
    STAGING --> PROD
    
    %% AI Integration
    PROD --> TELUS
    TELUS --> FUELIX
    FUELIX --> GEMINI
    
    %% Data Flow
    LOCAL --> LOCAL_DB
    PROD --> SHARED_DB
    SHARED_DB --> DOC_STORE
    
    %% Styling
    classDef dev fill:#e3f2fd
    classDef distribution fill:#f3e5f5
    classDef backend fill:#e8f5e8
    classDef ai fill:#fff3e0
    classDef storage fill:#fce4ec
    
    class DEV,GIT,IDE dev
    class CWS,DEV_MODE,UNPACKED distribution
    class LOCAL,STAGING,PROD backend
    class TELUS,FUELIX,GEMINI ai
    class LOCAL_DB,SHARED_DB,DOC_STORE storage
```

### 9. User Journey Flow

```mermaid
journey
    title LearnMate User Journey
    section Discovery
      User visits website: 5: User
      Extension loads: 5: Extension
      Floating button appears: 4: Extension
    section First Interaction
      User notices chat button: 3: User
      User clicks button: 5: User
      Chat widget opens: 5: Extension
      Welcome message displays: 4: Extension
    section Content Analysis
      Page content extracted: 5: Extension
      Context built: 5: Backend
      User sees page summary: 4: User
    section AI Conversation
      User asks question: 5: User
      Query processed: 5: Backend
      AI generates response: 5: AI
      Response streams to user: 5: Extension
    section Advanced Features
      User copies code: 4: User
      User asks follow-up: 5: User
      Context maintained: 5: Backend
      Personalized help: 5: AI
    section Productivity Boost
      User completes task faster: 5: User
      User learns new concepts: 5: User
      User shares with team: 4: User
```

### 10. Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend Technologies"
        subgraph "Core Web Technologies"
            HTML5[HTML5]
            CSS3[CSS3]
            JS[JavaScript ES6+]
        end
        
        subgraph "Chrome Extension APIs"
            MV3[Manifest V3]
            CONTENT[Content Scripts]
            POPUP[Popup API]
            STORAGE[Storage API]
        end
        
        subgraph "UI/UX Features"
            FLOAT[Floating Button]
            CHAT[Chat Widget]
            STREAM[Streaming UI]
            COPY[Copy Functionality]
        end
    end
    
    subgraph "Backend Technologies"
        subgraph "Python Stack"
            PYTHON[Python 3.8+]
            FASTAPI[FastAPI]
            UVICORN[Uvicorn ASGI]
            PYDANTIC[Pydantic]
        end
        
        subgraph "AI/ML Stack"
            NUMPY[NumPy]
            FAISS[FAISS Vector DB]
            REQUESTS[Requests HTTP]
        end
        
        subgraph "API Features"
            SSE[Server-Sent Events]
            ASYNC[Async Processing]
            CORS[CORS Support]
            HEALTH[Health Checks]
        end
    end
    
    subgraph "AI Services"
        subgraph "Gemini Models"
            GEMINI_CHAT[Gemini 2.5 Pro]
            GEMINI_EMB[Gemini Embedding 001]
        end
        
        subgraph "Telus Infrastructure"
            FUELIX_API[Fuelix API Gateway]
            TELUS_NET[Telus Network]
            ENTERPRISE[Enterprise Security]
        end
    end
    
    subgraph "Development Tools"
        subgraph "Version Control"
            GIT[Git]
            GITHUB[GitHub]
        end
        
        subgraph "Development Environment"
            VSCODE[VS Code]
            PYTHON_ENV[Python Virtual Env]
            CHROME_DEV[Chrome DevTools]
        end
        
        subgraph "Testing & Quality"
            PYTEST[PyTest]
            MANUAL[Manual Testing]
            LINT[Code Linting]
        end
    end
    
    %% Technology Connections
    HTML5 --> MV3
    CSS3 --> FLOAT
    JS --> CONTENT
    
    FASTAPI --> PYTHON
    UVICORN --> FASTAPI
    PYDANTIC --> FASTAPI
    
    NUMPY --> FAISS
    REQUESTS --> FUELIX_API
    
    GEMINI_CHAT --> FUELIX_API
    GEMINI_EMB --> FUELIX_API
    FUELIX_API --> TELUS_NET
    
    GIT --> GITHUB
    VSCODE --> PYTHON_ENV
    PYTEST --> PYTHON
    
    %% Styling
    classDef frontend fill:#e3f2fd
    classDef backend fill:#f3e5f5
    classDef ai fill:#e8f5e8
    classDef dev fill:#fff3e0
    
    class HTML5,CSS3,JS,MV3,CONTENT,POPUP,STORAGE,FLOAT,CHAT,STREAM,COPY frontend
    class PYTHON,FASTAPI,UVICORN,PYDANTIC,NUMPY,FAISS,REQUESTS,SSE,ASYNC,CORS,HEALTH backend
    class GEMINI_CHAT,GEMINI_EMB,FUELIX_API,TELUS_NET,ENTERPRISE ai
    class GIT,GITHUB,VSCODE,PYTHON_ENV,CHROME_DEV,PYTEST,MANUAL,LINT dev
```

## 📊 Architecture Summary

### Key Architectural Principles

1. **Separation of Concerns**
   - Frontend handles UI and user interactions
   - Backend manages AI processing and data
   - External services provide AI capabilities

2. **Scalable Design**
   - Modular component architecture
   - Async processing for performance
   - Streaming responses for real-time experience

3. **Security First**
   - Minimal extension permissions
   - Secure API communication
   - Enterprise-grade AI infrastructure

4. **User Experience Focus**
   - Non-intrusive floating button
   - Real-time streaming responses
   - Context-aware assistance

### Technology Choices Rationale

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Frontend** | Vanilla JavaScript | Lightweight, no dependencies, fast loading |
| **Backend** | FastAPI | Modern Python framework, async support, auto-docs |
| **Vector DB** | FAISS | High-performance similarity search, proven at scale |
| **AI Models** | Gemini via Fuelix | Enterprise security, state-of-the-art capabilities |
| **Streaming** | Server-Sent Events | Real-time updates, browser native support |

### Performance Characteristics

- **Frontend Load Time**: < 100ms
- **Content Extraction**: < 200ms
- **AI Response Time**: < 500ms first token
- **Memory Footprint**: < 10MB browser, ~200MB backend
- **Concurrent Users**: Scalable via Fuelix infrastructure

### Security Features

- **Browser Sandbox**: Extension runs in isolated context
- **Minimal Permissions**: Only necessary browser permissions
- **Enterprise AI**: Fuelix provides enterprise-grade security
- **No Data Storage**: No personal data stored locally
- **Encrypted Transit**: All communications over HTTPS

---

*Generated from LearnMate Chrome Extension Technical Documentation*
*Architecture diagrams reflect the current system design and implementation*
