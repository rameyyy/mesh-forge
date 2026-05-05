# mesh-forge

A desktop app for loading 3D mesh scans and applying localized surface deformations.

Built with Electron, React, TypeScript, Three.js, and Python (FastAPI using REST + trimesh).

## Project Structure

```
mesh-forge/
├── frontend/          # Electron app (React + TypeScript)
│   ├── src/
│   │   ├── main/      # Electron main process
│   │   ├── preload/   # Security bridge (contextBridge)
│   │   └── renderer/  # React UI with Three.js viewer
│   └── package.json
│
├── backend/           # Python FastAPI service
│   ├── api/           # FastAPI app and routes
│   ├── mesh/          # Mesh processing logic (trimesh)
│   └── pyproject.toml
│
└── resources/         # 3D models for testing
    └── bunny.ply      # Stanford Bunny test mesh
```

## Test Resources

**Stanford Bunny** (`resources/bunny.ply`)
- Source: Stanford University Computer Graphics Laboratory
- Format: PLY (~69k triangles)