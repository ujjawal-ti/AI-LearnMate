# AI-LearnMate 🤖📚

## 📝 Product Description

The AI-Enabled Auto L&D Training Module & Contextual Webpage Assistant is a two-part solution that transforms onboarding, training, and daily productivity at Telus Digital.

- ### AI Auto L&D Training & Assessment Generator
  Instantly creates structured training modules with quizzes and assessments from any project documentation, validating user skills and cutting onboarding time by up to 70%.

- ### AI Webpage Assistant
  A context-aware browser assistant that provides real-time, task-specific help directly within tools and webpages, reducing query resolution time by 80%.

**Together, these solutions ensure every user is trained, evaluated, and supported on the fly—accelerating project readiness and improving accuracy.**

## 📌 Project Overview

Onboarding today takes weeks, training is inconsistent, and employees waste time searching for answers or relying on SMEs. Our solution addresses this by:

- ### Auto-generating training and assessments
  Faster, validated skill onboarding for raters, engineers, and support staff.

- ### Providing contextual in-tool assistance
  Real-time guidance without switching contexts.

**The result: 130,000+ hours saved annually, higher first-time accuracy, faster project allocation, and scalable workforce enablement across Telus Digital.**

## 🏗️ Technical Components

AI-LearnMate achieves these goals through three integrated technical components:

- **🔄 N8N AI Workflows**: Automated AI agents for documentation and tool assistance
- **💻 Lovable UI**: Modern React web interface for AI interactions and workflow management
- **🔌 Chrome Extension**: Browser-based AI assistant for contextual help on any webpage

## 📁 Project Structure

```
AI-LearnMate/
├── 📁 n8n_workflows/           # AI workflow automation
├── 📁 src/                     # Lovable UI (React app)
├── 📁 chrome_extension/        # Browser extension
├── 📁 public/                  # Static assets
└── 📄 Configuration files      # Package.json, configs, etc.
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before setting up AI-LearnMate, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Chrome Browser** (latest version)
- **n8n** (for workflow automation) - [Installation guide](https://docs.n8n.io/getting-started/)

---

## 🔄 Component 1: N8N Workflows Setup

### Overview
The n8n workflows provide AI-powered automation for documentation assistance and tool guidance using advanced AI agents.

### Features
- **AI Tool Guide Agent**: Comprehensive tool documentation and assistance
- **Supervisely Integration**: Specialized workflows for video and point cloud annotation
- **Streaming Responses**: Real-time AI responses with structured output
- **Multi-modal Processing**: Handles text, images, and video content

### Installation Steps

#### 1. Install n8n
```bash
# Install n8n globally
npm install -g n8n

# Or using Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

#### 2. Import Workflows
```bash
# Start n8n
n8n start

# Open browser and go to http://localhost:5678
# Navigate to Workflows > Import from File
# Import the following files:
```

**Available Workflows:**
- `n8n_workflows/AI LearnMate Workflow.json` - Main AI assistant workflow
- `n8n_workflows/Get Video Annotation Info.json` - Video annotation helper
- `n8n_workflows/Get Point Cloud Annotation Info.json` - Point cloud annotation helper

#### 3. Configure API Keys
Set up the following credentials in n8n:

```bash
# OpenAI API Configuration
API_KEY=your_openai_api_key
MODEL=gpt-4o-mini  # or gemini-2.5-flash

# Webhook Configuration
WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-id
```

#### 4. Activate Workflows
1. Open each imported workflow
2. Configure the webhook URLs
3. Set up OpenAI credentials
4. Activate the workflows

### Usage
```bash
# Test the main workflow
curl -X POST "http://localhost:5678/webhook/891bf2bf-1158-465e-bc24-dfed230ef908" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain how to use Supervisely for video annotation"}'
```

---

## 💻 Component 2: Lovable UI Setup

### Overview
A modern React application built with Vite, TypeScript, and shadcn/ui components that provides a web interface for AI interactions.

### Features
- **Modern React Stack**: Vite + TypeScript + React 18
- **Beautiful UI**: shadcn/ui components with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first responsive layout
- **AI Integration**: Connects to n8n workflows for AI responses

### Installation Steps

#### 1. Install Dependencies
```bash
# Navigate to project root
cd AI-LearnMate

# Install dependencies
npm install
```

#### 2. Environment Configuration
Create a `.env` file in the root directory:

```bash
# .env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-id
VITE_API_BASE_URL=http://localhost:5678
```

#### 3. Development Server
```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

#### 4. Build for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Key Components

- **PromptForm**: Main input form for AI queries
- **HtmlViewer**: Displays AI-generated HTML responses
- **UI Components**: Complete shadcn/ui component library

---

## 🔌 Component 3: Chrome Extension Setup

### Overview
LearnMate Chrome Extension transforms any webpage into an interactive learning experience with AI-powered assistance.

### Features
- **🤖 AI Webpage Assistance**: Context-aware help on any website
- **📍 Always-On Guide**: Floating chat button accessible everywhere
- **🧠 Smart Content Analysis**: Extracts text, code, images, and videos
- **⚡ Streaming Responses**: Real-time AI communication
- **🔧 Code Copy Functionality**: Enhanced developer experience
- **🌐 Universal Compatibility**: Works on all websites

### Installation Steps

#### 1. Backend Setup
```bash
# Navigate to chrome extension backend
cd chrome_extension/backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Backend Dependencies:**
```txt
fastapi==0.104.1
uvicorn==0.24.0
sentence-transformers==2.2.2
faiss-cpu==1.7.4
numpy==1.24.3
pydantic==2.5.0
```

#### 2. Chrome Extension Installation
```bash
# 1. Open Chrome and go to chrome://extensions/
# 2. Enable "Developer mode" (toggle in top-right)
# 3. Click "Load unpacked"
# 4. Select the chrome_extension/ folder
# 5. Extension should appear in your toolbar
```

#### 3. Configuration
Update the backend URL in `content_script.js` if needed:

```javascript
const CONFIG = {
  backendUrl: 'http://localhost:8000',  // Update if different
  maxContentLength: 8000,
  debounceDelay: 300
};
```

#### 4. Test the Extension
1. Visit any website (e.g., https://wikipedia.org)
2. Look for the purple 💬 chat button in bottom-right corner
3. Click the button to open the chat widget
4. Ask a question: "What is this page about?"
5. Watch the AI respond with page analysis!

### Backend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chat/stream` | POST | Streaming AI chat responses |
| `/health` | GET | Backend health check |
| `/docs` | GET | API documentation |

### Extension Architecture

```
chrome_extension/
├── 📄 manifest.json          # Extension configuration
├── 🎨 popup.html            # Extension popup
├── ⚙️ popup.js              # Popup functionality
├── 🔧 background.js         # Service worker
├── 📜 content_script.js     # Main content injection
├── 🎨 inject_icon.css       # Floating button styles
├── 📁 icons/               # Extension icons
└── 📁 backend/             # Python FastAPI backend
    ├── 🚀 app.py           # Main API server
    ├── 📊 faiss_index.bin  # Vector database
    ├── 📋 docs_meta.json   # Document metadata
    └── 📁 docs/            # Documentation files
```

---

## 🔗 Integration Guide

### Connecting All Components

#### 1. Full System Setup
```bash
# Terminal 1: Start n8n
n8n start

# Terminal 2: Start Lovable UI
cd AI-LearnMate
npm run dev

# Terminal 3: Start Chrome Extension Backend
cd chrome_extension/backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Terminal 4: Load Chrome Extension
# Follow Chrome extension installation steps above
```

#### 2. Workflow Integration
The components can work together:

1. **Chrome Extension** → Extracts webpage content
2. **N8N Workflows** → Processes content with AI
3. **Lovable UI** → Provides web interface for complex queries

#### 3. API Integration
Configure the Lovable UI to connect with n8n workflows:

```typescript
// In your React components
const callN8NWorkflow = async (prompt: string) => {
  const response = await fetch(process.env.VITE_N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return response.json();
};
```

---

## 🧪 Testing

### Testing Each Component

#### N8N Workflows
```bash
# Test main workflow
curl -X POST "http://localhost:5678/webhook/your-webhook-id" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test query"}'
```

#### Lovable UI
```bash
# Run development server and test in browser
npm run dev
# Open http://localhost:5173
```

#### Chrome Extension
```bash
# Test backend health
curl http://localhost:8000/health

# Expected response: {"status": "healthy", "model_loaded": true}
```

### Manual Testing
1. **Open test pages**: `chrome_extension/test_manual.html`
2. **Test workflows**: Import and activate in n8n
3. **Test UI**: Submit prompts in the web interface

---

## 🔧 Configuration

### Environment Variables

Create these files for configuration:

#### `.env` (Root directory - for Lovable UI)
```bash
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-id
VITE_API_BASE_URL=http://localhost:5678
```

#### `chrome_extension/backend/.env` (for Chrome Extension)
```bash
OPENAI_API_KEY=your_openai_api_key
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
MAX_CONTENT_LENGTH=8000
```

### Port Configuration

| Component | Default Port | Configurable |
|-----------|--------------|--------------|
| **n8n** | 5678 | Yes (n8n config) |
| **Lovable UI** | 5173 | Yes (vite.config.ts) |
| **Chrome Extension Backend** | 8000 | Yes (uvicorn command) |

---

## 🚨 Troubleshooting

### Common Issues

| Issue | Component | Solution |
|-------|-----------|----------|
| **Port conflicts** | All | Change ports in configuration files |
| **Extension not loading** | Chrome Extension | Check if enabled in chrome://extensions/ |
| **Backend connection failed** | Chrome Extension | Ensure FastAPI server is running |
| **Workflow not responding** | N8N | Check webhook URLs and API keys |
| **Build errors** | Lovable UI | Run `npm install` and check Node.js version |

### Debug Commands

```bash
# Check all services
curl http://localhost:5678/health     # n8n (if health endpoint exists)
curl http://localhost:5173/           # Lovable UI
curl http://localhost:8000/health     # Chrome Extension Backend

# Check processes
lsof -i :5678  # n8n
lsof -i :5173  # Lovable UI  
lsof -i :8000  # Chrome Extension Backend
```

### Logs and Debugging

```bash
# View n8n logs
n8n start --log-level debug

# View Lovable UI logs
npm run dev  # Check browser console

# View Chrome Extension logs
# Open DevTools > Console on any webpage
# Check chrome://extensions/ for extension errors

# View Backend logs
python -m uvicorn app:app --log-level debug
```

---

## 🔮 Features & Capabilities

### N8N Workflows
- ✅ **AI Tool Documentation**: Comprehensive tool guides
- ✅ **Streaming Responses**: Real-time AI communication
- ✅ **Multi-modal Processing**: Text, images, videos
- ✅ **Structured Output**: JSON formatted responses
- ✅ **Webhook Integration**: REST API endpoints

### Lovable UI
- ✅ **Modern React Stack**: Vite + TypeScript + React 18
- ✅ **Component Library**: Complete shadcn/ui components
- ✅ **Form Validation**: React Hook Form + Zod
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Theme Support**: Dark/light mode ready

### Chrome Extension
- ✅ **Universal Compatibility**: Works on all websites
- ✅ **Content Analysis**: Smart webpage processing
- ✅ **Code Extraction**: Syntax highlighting + copy functionality
- ✅ **Streaming Chat**: Real-time AI responses
- ✅ **Non-intrusive UI**: Floating button design

---

## 📚 Documentation

### Additional Resources

- **Chrome Extension**: See `chrome_extension/TECHNICAL_DOCUMENTATION.md` for detailed technical docs
- **N8N Workflows**: Check individual workflow JSON files for configuration details
- **Lovable UI**: Built with [Lovable](https://lovable.dev) - see original README sections above

### API Documentation

- **Chrome Extension Backend**: http://localhost:8000/docs (FastAPI auto-docs)
- **N8N Workflows**: Available in n8n interface at http://localhost:5678

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Make changes** to relevant components
4. **Test** all components work together
5. **Commit** changes: `git commit -m 'feat: add amazing feature'`
6. **Push** to branch: `git push origin feature/amazing-feature`
7. **Open** Pull Request

### Code Standards

- **JavaScript/TypeScript**: ES6+, consistent formatting
- **Python**: PEP 8, type hints, docstrings
- **React**: Functional components, hooks, TypeScript
- **CSS**: Tailwind CSS classes, responsive design

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Rohit Bhandari** - Developer
- **Ujjawal Kumar Singh** - Developer 
- **Lakshay Sethia** - Product Manager
- **Priyanka Parida** - Product Designer

---

## 🆘 Support

### Getting Help

- **Issues**: Create GitHub issue with detailed description
- **Documentation**: Check component-specific documentation
- **Discussions**: Use GitHub Discussions for questions

### Reporting Bugs

When reporting bugs, include:
1. **Component affected** (n8n/Lovable UI/Chrome Extension)
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Console logs** and error messages
5. **Environment details** (OS, browser, versions)

---
