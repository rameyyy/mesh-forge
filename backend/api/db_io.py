import sqlite3

def db_connection():
    """
    Connects to coords.db SQLite file
    
    Returns:
        cursor: obj to execute querys in SQLite db
    """
    conn = sqlite3.connect('coords.db') # connects to db if it exists, else creates db
    cursor = conn.cursor()

    # create coords table if it doesn't exist yet in coords.db
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS coords (
            run_id INTEGER NOT NULL,
            coords_id INTEGER NOT NULL,
            x_coord FLOAT NOT NULL,
            y_coord FLOAT NOT NULL,
            z_coord FLOAT NOT NULL,
            PRIMARY KEY (run_id, coords_id)
        )
    """)
    return cursor, conn

def post_coords(run_id: int, coords_id: int, x_coord: float, y_coord: float, z_coord: float) -> bool:
    """
    Take in coordinates and identifiers and push to coords table in coords.db

    Args:
        run_id: integer of the run_id of the app instance
        coords_id: integer identifier of xyz coords
        x_coord: float x coordinate
        y_coord: float y coordinate
        z_coord: float z coordinate

    Return:
        bool: True -> successful push; False -> failed push
    """
    try:
        cursor, conn = db_connection()
        cursor.execute(
            "INSERT INTO coords (run_id, coords_id, x_coord, y_coord, z_coord) VALUES (?, ?, ?, ?, ?)",
            (run_id, coords_id, x_coord, y_coord, z_coord)
        )
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        conn.close()
        return False

def del_coords(run_id: int, coords_id: int) -> bool:
    """
    Delete coords_id row from run_id in coords table of SQLite coords db

    Args:
        run_id: integer of the run_id of the app instance
        coords_id: integer identifier of xyz coords

    Return:
        bool: True -> successfully deleted row; False -> failed to delete row
    """
    try:
        cursor, conn = db_connection()
        cursor.execute(
            "DELETE FROM coords WHERE run_id = ? AND coords_id = ?",
            (run_id, coords_id)
        )
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        conn.close()
        return False

def get_coords_from_run(run_id: int) -> list[dict]:
    """
    Gets all coords from table on specific run id and returns as a list of dictionaries

    Args:
        run_id: integer identifier of the run instance of the mesh forge app
    
    Returns:
        list[dict]: coord data, ie: [{"run_id": 5, "coords_id": 2, "x_coord": .09, "y_coord": .64, "z_coord": .33}]
    """
    try:
        cursor, conn = db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM coords WHERE run_id = ?",
            (run_id, )
        )
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rows
    except Exception as e:
        conn.close()
        return [{}]

def get_all_coords() -> list[dict]:
    """
    Gets all coords from table and returns as a list of dictionaries
    
    Returns:
        list[dict]: coord data, ie: [{"run_id": 5, "coords_id": 2, "x_coord": .09, "y_coord": .64, "z_coord": .33}]
    """
    try:
        cursor, conn = db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM coords")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return rows
    except Exception as e:
        conn.close()
        return [{}]
    
def get_new_run_id() -> int:
    """
    Get max run_id val in db to set new run_id value

    Returns:
        int: new value run id should be set to for this instance of app run
    """
    try:
        cursor, conn = db_connection()
        cursor.execute("SELECT MAX(run_id) FROM coords")
        prev_run_id = cursor.fetchone()[0]
        if prev_run_id:
            new_run_id = prev_run_id + 1
        else:
            new_run_id = 1
        conn.close()
        return new_run_id
    except Exception as e:
        conn.close()
        return -1 # err code