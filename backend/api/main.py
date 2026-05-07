from fastapi import FastAPI
from pydantic import BaseModel
import db_io

app = FastAPI()

# coords class (like enum)
class Coordinates(BaseModel):
    x: float
    y: float
    z: float

coords_id = 1
run_id = db_io.get_new_run_id()

@app.get("/status")
async def root():
    return {"status": "active"}

@app.post("/coords")
async def receive_coords(coords: Coordinates):
    global coords_id
    global run_id
    res = db_io.post_coords(run_id, coords_id, coords.x, coords.y, coords.z)
    if res:
        coords_id+=1
        return {
            "message": f"coords saved to id={coords_id-1}",
            "data": coords
        }
    else:
        return {
            "message": "failed to save coords to db",
        }

@app.delete("/coords/del/{coord_id_del}")
async def delete_coords(coord_id_del: int):
    global run_id
    res = db_io.del_coords(run_id, coord_id_del)
    return {
        f"Successfully deleted coordinate at id={coord_id_del}": f"{res}"
    }

@app.get("/run-coords")
async def get_run_id_coords():
    global run_id
    runs_coords = db_io.get_coords_from_run(run_id)
    return runs_coords

@app.get("/all-coords")
async def get_all_coords():
    all_coords = db_io.get_all_coords()
    return all_coords