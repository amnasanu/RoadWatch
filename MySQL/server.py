import os
import shutil
import uvicorn
import sqlite3
from configparser import ConfigParser

from python_routers import python_router_algorithm

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse, JSONResponse
from fastapi import FastAPI, Request, HTTPException

# Initializing the "ConfigParser" Class
config_parser_object = ConfigParser()

# Checking if "config.ini" File Exists
if not os.path.exists(os.path.join(os.path.dirname(os.path.realpath(__file__)), "config.ini")):
    # Raising an Exception
    raise Exception("The 'config.ini' does not exist.")
else:
    # Reading the Values from the "config.ini" File
    config_parser_object.read(os.path.join(os.path.dirname(os.path.realpath(__file__)), "config.ini"))

# Function 1 - SQLite Prerequisite
def sqlite_prerequisite():
    # Variables
    table_names = ["vehicle_detection_data", "license_plate_detection_data", "people_detection_data", "crime_data"]

    # Connecting to SQLite Database
    sqlite_connection = sqlite3.connect('RoadWatch.db')
    sqlite_cursor = sqlite_connection.cursor()

    # Checking if Tables Exist
    for table in table_names:
        # Checking if Table Exists
        sqlite_cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}';")
        if not sqlite_cursor.fetchone():
            # Creating the Tables
            if table == "vehicle_detection_data":
                sqlite_cursor.execute("CREATE TABLE vehicle_detection_data(Date VARCHAR(100), Time VARCHAR(100), File_Name VARCHAR(100), File_Type VARCHAR(100), Number_of_Vehicles INT);")
            elif table == "license_plate_detection_data":
                sqlite_cursor.execute("CREATE TABLE license_plate_detection_data(Date VARCHAR(100), Time VARCHAR(100), File_Name VARCHAR(100), File_Type VARCHAR(100), License_Plate_Number VARCHAR(100));")
            elif table == "people_detection_data":
                sqlite_cursor.execute("CREATE TABLE people_detection_data(Date VARCHAR(100), Time VARCHAR(100), File_Name VARCHAR(100), File_Type VARCHAR(100), Number_of_People INT);")
            elif table == "crime_data":
                sqlite_cursor.execute("CREATE TABLE crime_data(License_Plate_Number VARCHAR(100), Date VARCHAR(100), Time VARCHAR(100), Offense VARCHAR(500), Fine INT);")
    
    # Committing the changes
    sqlite_connection.commit()
    # Closing the SQLite connection
    sqlite_connection.close()

# Initializing the "App" Server
app = FastAPI()

# Mounting the "assets" Folder to the "App" Server
app.mount("/assets", StaticFiles(directory="templates/assets"), name="/assets")

# Index (App)
@app.get("/")
async def app_index(request: Request):
    # SQLite Prerequisite
    sqlite_prerequisite()

    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("index.html", {"request": request})

# Vehicle Detection (App)
@app.get("/vehicle-detection")
async def app_vehicledetection(request: Request):
    # SQLite Prerequisite
    sqlite_prerequisite()

    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("vehicle-detection.html", {"request": request})

# License Plate Detection (App)
@app.get("/license-plate")
async def app_licenseplatedetection(request: Request):
    # SQLite Prerequisite
    sqlite_prerequisite()

    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("license-plate-detection.html", {"request": request})

# People Detection (App)
@app.get("/people-detection")
async def app_peopledetection(request: Request):
    # SQLite Prerequisite
    sqlite_prerequisite()

    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("people-detection.html", {"request": request})

# Crime Data (App)
@app.get("/crime-data")
async def app_crimedata(request: Request):
    # SQLite Prerequisite
    sqlite_prerequisite()

    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("crime-data.html", {"request": request})

# Sample Media (App)
@app.get("/sample-media/{algorithm}/{file_type}/{file}")
async def app_samplemedia(request: Request, algorithm: str, file_type: str, file: str):
    # Returning the File
    return FileResponse(path=os.path.join(os.path.dirname(os.path.realpath(__file__)), "python_routers/sample_media", algorithm, file_type, file))

# Delete Cache (App)
@app.get("/delete-cache")
async def app_deletecache(request: Request):
    # Try/Except - Deleting Cache
    try:
        # Variables
        directory_main = os.path.join(os.path.dirname(os.path.realpath(__file__)), "__pycache__")
        directory_routers = os.path.join(os.path.dirname(os.path.realpath(__file__)), "python_routers", "__pycache__")

        # Checking if Path Exists (Directory Main)
        if os.path.exists(directory_main):
            shutil.rmtree(directory_main)

        # Checking if Path Exists (Directory Routers)
        if os.path.exists(directory_routers):
            shutil.rmtree(directory_routers)
    except:
        pass

    # Returning the Message
    return JSONResponse({"Message": "Successfully deleted the cache.", "Status Code": 200}, status_code=200)

# Including "python_router_algorithm" in the "App" Server
app.include_router(python_router_algorithm.router_algorithm)

# Error 404 (App)
@app.exception_handler(404)
async def app_error404(request: Request, exec: HTTPException):
    # Returning the Error
    return JSONResponse({"Error": "The requested route does not exist. Please try again.", "Status Code": 404}, status_code=404)

# Starting the Server (Development)
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=7777, reload=True)
