import { useState } from 'react'

function ScansPage() {
  const [coords, setCoords] = useState<Array<any>>([])
  const [viewMode, setViewMode] = useState<'run' | 'all' | null>(null)
  const [selectedCoordId, setSelectedCoordId] = useState<number | null>(null)
  const getRunCoords = async () => {
    setSelectedCoordId(null)  // clear selection when switching
    setCoords(await window.api.runCoords())
    setViewMode('run')
  }
  const getAllCoords = async () => {
    setSelectedCoordId(null)
    setCoords(await window.api.allCoords())
    setViewMode('all')
  }
  const delCoord = async () => {
    if (!selectedCoordId) return
    await window.api.delCoord(selectedCoordId)
    setSelectedCoordId(null)
    await getRunCoords()  // refresh list
  }
    return (
      <div className="main-content">
        <div>
          <button onClick={getRunCoords}>Get Curr Run Coords</button>
          <button onClick={getAllCoords}>Get All Coords in DB</button>
        </div>

        <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', margin: '10px 0' }}>
          {coords.length === 0 ? (
            <p style={{ padding: '10px' }}>No coords yet. Click a button to load.</p>
          ) : (
            coords.map((coord) => (
              <div
                key={`${coord.run_id}-${coord.coords_id}`}
                onClick={() => viewMode === 'run' && setSelectedCoordId(coord.coords_id)}
                style={{
                  padding: '10px',
                  cursor: viewMode === 'run' ? 'pointer' : 'default',
                  background: selectedCoordId === coord.coords_id && viewMode === 'run' ? '#007bff' : 'white',
                  color: selectedCoordId === coord.coords_id && viewMode === 'run' ? 'white' : 'black',
                  borderBottom: '1px solid #eee'
                }}
              >
                {viewMode === 'all' && `Run: ${coord.run_id} | `}
                ID: {coord.coords_id} | X: {coord.x_coord.toFixed(4)} | Y: {coord.y_coord.toFixed(4)} | Z: {coord.z_coord.toFixed(4)}
              </div>
            ))
          )}
        </div>
        {viewMode === 'run' && (
        <button onClick={delCoord} disabled={selectedCoordId === null}>
          Delete Selected Coordinate
        </button>
        )}
      </div>                                                                                
    )             
  }                                                              
                  
  export default ScansPage