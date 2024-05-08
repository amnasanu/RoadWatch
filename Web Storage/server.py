

# Imports
import os
import shutil
import uvicorn

from python_routers import python_router_algorithm

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse, JSONResponse
from fastapi import FastAPI, Request, HTTPException

# Initializing the "App" Server
app = FastAPI()

# Mounting the "assets" Folder to the "App" Server
app.mount("/assets", StaticFiles(directory="templates/assets"), name="/assets")

# Index (App)
@app.get("/")
async def app_index(request: Request):
    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("index.html", {"request": request})

# Vehicle Detection (App)
@app.get("/vehicle-detection")
async def app_vehicledetection(request: Request):
    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("vehicle-detection.html", {"request": request})

# License Plate Detection (App)
@app.get("/license-plate-detection")
async def app_licenseplatedetection(request: Request):
    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("license-plate-detection.html", {"request": request})

# People Detection (App)
@app.get("/people-detection")
async def app_peopledetection(request: Request):
    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("people-detection.html", {"request": request})

# Crime Data (App)
@app.get("/crime-data")
async def app_crimedata(request: Request):
    # Returning the Template
    return Jinja2Templates(directory="templates").TemplateResponse("crime-data.html", {"request": request})

# Sample Media (App)
@app.get("/sample-media/{algorithm}/{file_type}/{file}")
async def app_samplemedia(request: Request, algorithm: str, file_type: str, file: str):
    # Returning the File
    return FileResponse(path=os.path.dirname(os.path.realpath(__file__)).replace(os.sep, "/") + "/python_routers/sample_media/{0}/{1}/{2}".format(algorithm, file_type, file))

# Delete Cache (App)
@app.get("/delete-cache")
async def app_deletecache(request: Request):
    # Try/Except - Deleting Cache
    try:
        # Variables
        directory_main = os.path.dirname(os.path.realpath(__file__)).replace(os.sep, "/") + "/__pycache__"
        directory_routers = os.path.dirname(os.path.realpath(__file__)).replace(os.sep, "/") + "/python_routers/__pycache__"

        # Checking if Path Exists (Directory Main)
        if (os.path.exists(directory_main)):
            shutil.rmtree(directory_main)

        # Checking if Path Exists (Directory Routers)
        if (os.path.exists(directory_routers)):
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