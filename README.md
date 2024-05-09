RoadWatch
RoadWatch is an interactive and smart traffic management application that serves as an all-in-one traffic solution. With features like license plate recognition, vehicle detection, and traffic offense management, it aims to streamline traffic monitoring and management processes.

Features
License Plate Recognition: RoadWatch utilizes image processing techniques to determine and extract license plate numbers from images, returning them as a string for further processing.
Vehicle Detection: Using advanced computer vision algorithms, RoadWatch can detect vehicles in both images and videos. Based on the count of vehicles detected, it provides insights into traffic density, categorizing it as low, high, or very high.
People Detection: In addition to vehicles, RoadWatch can also detect people in images and videos, contributing to comprehensive traffic monitoring capabilities.
Traffic Offense Management: RoadWatch offers a user-friendly interface for managing traffic offenses committed by drivers. This feature facilitates efficient tracking and resolution of traffic violations.
How to Use
To utilize RoadWatch, follow these steps:

Download or Clone: Download or clone the repository locally and store it in a single directory on your system.
Install Dependencies: Ensure you have all the necessary dependencies by installing them using the provided requirements.txt file.
Choose Version: Depending on your preference and requirements, you can choose between the MySQL version or the Web Storage version.
For the MySQL version, navigate to the MySQL folder and run the server.py file.
For the Web Storage version, navigate to the Web Storage folder and run the server.py file.
Access RoadWatch: Once the server is running, open your preferred web browser and visit http://localhost:7777. You are now ready to explore and utilize RoadWatch!
Technologies Used
This application is written in HTML, CSS, JavaScript, and Python. HTML, CSS, and JavaScript were used for the front-end, while Python was used for the back-end. Sample images and videos found online were used for demonstration and testing purposes. For the criminal database, MySQL and Web Storage were utilized.

The technologies used in making this project are:

HTML
CSS
JavaScript
Python
MySQL and Web Storage (LocalStorage)
OpenCV and PyTesseract (Computer Vision and Optical Character Recognition)
API Requests (REST)
