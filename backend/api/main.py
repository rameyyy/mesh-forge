from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# coords class (like enum)
class Coordinates(BaseModel):
    x: float
    y: float
    z: float

coords_inmem_db = []
id = 0

@app.get("/status")
async def root():
    return {"status": "active"}

@app.post("/coords")
async def receive_coords(coords: Coordinates):
    global id
    coords_inmem_db.append({
        "id": id,
        "x": coords.x,
        "y": coords.y,
        "z": coords.z
        })
    id+=1
    return {
        "message": f"coords saved to id={id}",
        "data": coords
    }

@app.delete("/coords/del/{id}")
async def delete_coords(id: int):
    # binary search O(logn) + O(n) del element from dynamic arr => O(n) to find and del coords at specific id
    res = False
    left = 0
    right = len(coords_inmem_db) - 1
    while left <= right:
        mid = (left + right) // 2
        if coords_inmem_db[mid]["id"] == id:
            del coords_inmem_db[mid]
            res = True
            break
        elif coords_inmem_db[mid]["id"] < id:
            left = mid + 1
        else:
            right = mid - 1
    return {
        f"Successfully deleted coordinate at id={id}": f"{res}"
    }

@app.get("/all-coords")
async def get_all_coords():
    return coords_inmem_db