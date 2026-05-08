# mesh-forge

A desktop app for viewing 3D meshes and saving coordinate data from mesh surfaces.

Built with Electron, React, TypeScript, Three.js, Python: FastAPI & uv package manager (venv), and SQLite.

## How to Run Locally

**Terminal 1 (API):**
```bash
cd backend/api
uv run uvicorn main:app --reload
```

**Terminal 2 (Electron):**
```bash
cd frontend
npm run dev
```

The FastAPI backend runs on `http://localhost:8000` and the Electron app will launch automatically.

## Project Structure

```
mesh-forge/
├── frontend/
│   ├── src/
│   │   ├── main/           # electron main process (Node.js)
│   │   ├── preload/        # IPC security bridge
│   │   └── renderer/       # react ui
│   │       ├── assets/     # bunny.ply (3D test mesh)
│   │       ├── components/ # contains MeshViewer.tsx which has the Three.js canvas
│   │       └── pages/      # ScansPage (coordinate manager)
│   └── package.json
│
└── backend/
    └── api/
        ├── main.py         # FastAPI routes (REST)
        ├── db_io.py        # SQLite CRUD ops
        └── coords.db       # SQLite db file
```

## Tech Stack

**Frontend:**
- Electron: Desktop app framework
- React: UI components and state management
- Three.js: 3D rendering engine

**Backend:**
- FastAPI: Python REST API (is fast and lightweight)
- SQLite: Lightweight serverless SQL db

## Features

**MeshViewer Page:**
- Load and display 3D mesh (Stanford Bunny)
- Click on mesh surface to get XYZ coordinates (using raycaster)
- Save clicked coordinates to database

**ScansPage:**
- View coordinates from current run or all runs
- Select and delete coordinates (run mode only)

## API Endpoints

- `POST /coords` – Save new coordinate
- `GET /run-coords` – Get current run coordinates
- `GET /all-coords` – Get all coordinates in database
- `DELETE /coords/del/{id}` – Delete coordinate by ID

## Test Resources

**Stanford Bunny** (`frontend/src/renderer/src/assets/bunny.ply`)
- Source: Stanford University Computer Graphics Laboratory  
- Format: PLY mesh with approximately 69k triangles
