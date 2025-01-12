# Clinical Text Review System

## Repository Structure
```
clinical-text-review/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor/
│   │   │   │   ├── TextEditor.tsx
│   │   │   │   ├── SuggestionCard.tsx
│   │   │   │   └── SuggestionsList.tsx
│   │   │   └── ui/  # shadcn components
│   │   ├── lib/
│   │   │   └── api.ts  # API client
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── text-processing.ts
│   │   ├── app/
│   │   │   └── page.tsx
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   └── analyze.py
│   │   │   └── models.py
│   │   ├── core/
│   │   │   ├── analyzer.py
│   │   │   └── config.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_analyzer.py
│   │   └── test_api.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker (optional)
- OpenAI API key or other LLM API key

### Environment Variables
Create a `.env` file in the root directory:
```env
# Backend
OPENAI_API_KEY=your_api_key
MODEL_NAME=gpt-4
MAX_TOKENS=2000
TEMPERATURE=0.7

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Local Development Setup

1. **Backend Setup**
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
cd backend
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload
```

2. **Frontend Setup**
```bash
# Install dependencies
cd frontend
npm install

# Run the development server
npm run dev
```

### Docker Setup

1. **Build and run using Docker Compose**
```bash
docker-compose up --build
```

This will start both frontend and backend services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Key Files

### 1. Backend Dependencies (requirements.txt)
```txt
fastapi==0.104.1
uvicorn==0.24.0
langchain==0.0.350
pydantic==2.5.2
python-dotenv==1.0.0
openai==1.3.5
```

### 2. Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "next": "14.0.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.292.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "20.9.2",
    "@types/react": "18.2.37",
    "@types/react-dom": "18.2.15",
    "autoprefixer": "10.4.16",
    "postcss": "8.4.31",
    "tailwindcss": "3.3.5",
    "typescript": "5.2.2"
  }
}
```

### 3. Docker Configuration (docker-compose.yml)
```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    volumes:
      - ./frontend:/app
    depends_on:
      - backend
```

### 4. Backend Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 5. Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

## Development Workflow

1. **Start Development**
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

2. **Running Tests**
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

3. **Adding New Components**
```bash
# Install shadcn components
cd frontend
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
# etc...
```

## API Documentation

The API documentation is available at http://localhost:8000/docs when running the backend server. This provides an interactive interface to test the API endpoints.

## Development Tips

1. **Hot Reload**
- Backend automatically reloads on file changes
- Frontend has fast refresh enabled

2. **Type Checking**
```bash
# Frontend
npm run type-check

# Backend
mypy .
```

3. **Code Formatting**
```bash
# Frontend
npm run format

# Backend
black .
```

4. **Linting**
```bash
# Frontend
npm run lint

# Backend
flake8
```

## Common Issues and Solutions

1. **CORS Issues**
- The backend is configured to accept requests from the frontend origin
- Check CORS settings in `backend/app/main.py` if you encounter issues

2. **Environment Variables**
- Ensure all required environment variables are set
- Check `.env.example` for required variables

3. **Port Conflicts**
- Default ports: Frontend (3000), Backend (8000)
- Change in `docker-compose.yml` if needed

4. **Dependencies**
- Run `npm install` after pulling new frontend changes
- Run `pip install -r requirements.txt` after pulling new backend changes