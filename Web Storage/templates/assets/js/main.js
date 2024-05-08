

// Variables (Notyf)
var notyf = new Notyf();

// Variables (Date & Time)
const date = new Date();

const current_day = String(date.getDate()).padStart(2, "0");
const current_month = String(date.getMonth() + 1).padStart(2, "0");
const current_year = date.getFullYear();

const full_date = current_day + "-" + current_month + "-" + current_year
const full_time = date.toLocaleTimeString();

// Variables (Modal)
const shortcutsModal = new HystModal({
    linkAttributeName: "open-shortcutsModal",
    catchFocus: false
});

const mediaModal = new HystModal({
    linkAttributeName: "open-mediaModal",
    catchFocus: false
});

// Keyboard Shortcuts
Mousetrap.bind("ctrl+e", function() {window.open("/"); return false;}); // Ctrl + E
Mousetrap.bind("ctrl+v", function() {window.open("/vehicle-detection"); return false;}); // Ctrl + V
Mousetrap.bind("ctrl+l", function() {window.open("/license-plate-detection"); return false;}); // Ctrl + L
Mousetrap.bind("ctrl+p", function() {window.open("/people-detection"); return false;}); // Ctrl + P
Mousetrap.bind("ctrl+c", function() {window.open("/crime-data"); return false;}); // Ctrl + C
Mousetrap.bind("ctrl+d", function() {delete_cache(); return false;}); // Ctrl + D
Mousetrap.bind("ctrl+k", function() {mediaModal.close(); document.getElementById("footer-text-2-shortcuts").click(); return false;}); // Ctrl + K
Mousetrap.bind("ctrl+m", function() {shortcutsModal.close(); document.getElementById("footer-text-2-media").click(); return false;}); // Ctrl + M

// Function 1 - TypeWriter (Header)
function headerTypeWriter(headerText, secondaryHeaderText) {
    new TypeIt("#header", {
        speed: 100,
        strings: [headerText],
        cursor: false,
        lifelike: false
    }).flush(() => secondaryHeaderTypeWriter(secondaryHeaderText));
}

// Function 2 - TypeWriter (Header 2)
function secondaryHeaderTypeWriter(secondaryHeaderText) {
    new TypeIt("#header-2", {
        speed: 70,
        strings: [secondaryHeaderText],
        cursor: false,
        lifelike: false
    }).flush(() => document.querySelectorAll(".main-content").forEach(function (item) {
        item.style.visibility = "visible";
    }));
}

// Function 3 - API Request
function api_request(url, request_listner = null) {
    // Configuring the Request
    const request = new XMLHttpRequest();

    // Checking the Value of "request_listener"
    if (request_listner != null) {
        request.addEventListener("load", request_listner);
    }

    // Configuring the Request
    request.open("GET", url);
    request.onerror = function (e) {
        // Displaying the Notyf
        notyf.error("Please try again later.");
    }
    request.send();
}

// Function 4 - Delete Cache
function delete_cache() {
    // API Request 1 - Delete Cache
    fetch("/delete-cache?time=" + new Date().getTime())
        .then(response => {
            // Checking the Status Code
            if (response.status == 200) {
                notyf.success("Deleted Cache");
            } else {
                notyf.error("Please try again later.");
            }
        })
        .catch(() => {
            notyf.error("Please try again later.");
        });
}

// Function 5 - Set Timestamp
function set_timestamp(key, timestamp) {
    // Setting the Date and Time
    timestamp["Date"] = full_date;
    timestamp["Time"] = full_time;

    // Checking if Key Exists
    if (localStorage.getItem(key) == null) {
        // Setting the Key (Adding the Timestamp)
        localStorage.setItem(key, JSON.stringify([timestamp]));
    } else {
        // Retrieving the Key and Pushing the Timestamp
        const local_storage_data = JSON.parse(localStorage.getItem(key));
        local_storage_data.push(timestamp);

        // Setting the Key
        localStorage.setItem(key, JSON.stringify(local_storage_data));
    }
}

// Function 6 - Submit (License Plate Detection)
function submit_license_plate_detection() {
    // Variables
    const license_plate_number = document.getElementById("sub-number").value;

    // Request Listener 1
    function request_listener_1() {
        // Response from Request
        const response = JSON.parse(this.responseText);

        // Fetching Image Data
        var rawData = response["Image Data Base64"];
        rawData = rawData.slice(0, -1);
        rawData = rawData.slice(2);

        // Setting the Image
        document.querySelectorAll(".main-content").forEach(function (item) {
            item.style.visibility = "hidden";
        });

        document.getElementById("sub-picture").src = "data:image/jpeg;base64, " + rawData;
        document.getElementById("sub-picture").style.visibility = "visible";

        // Creating an Object (Timestamp)
        const timestamp = {};
        timestamp["License Plate Number"] = response["License Plate Number"];
        timestamp["File Name"] = license_plate_number + ".jpg"
        timestamp["File Type"] = "Image";

        // Setting the Timestamp in LocalStorage
        set_timestamp("License Plate Detection Data", timestamp);

        // Displaying the Notyf
        notyf.success("License Plate: " + response["License Plate Number"]);

        // Timeout
        setTimeout(function() {
            document.querySelectorAll(".main-content").forEach(function (item) {
                item.style.visibility = "visible";
            });

            document.getElementById("sub-picture").src = "";
            document.getElementById("sub-picture").style.visibility = "hidden";
        }, 4000);
    }

    // Checking the Value of "license_plate_number"
    if (![1, 2, 3, 4, 5, 6, 7, 8].includes(parseInt(license_plate_number))) {
        // Displaying the Notyf
        notyf.error("Enter a number from 1 to 8.");
    } else {
        // API Request - Submit License Plate
        api_request("/algorithm/license-plate-detection?file_type=images&file_number=" + license_plate_number + "&tesseract_path=C:/Program Files/Tesseract-OCR/tesseract.exe&time=" + new Date().getTime(), request_listener_1);
    }
}

// Function 7 - OnChange (Vehicle Detection)
function onchange_vehicle_detection() {
    // Variables
    var vehicle_detection_type = document.getElementById("sub-type");
    var vehicle_detection_type_value = vehicle_detection_type.options[vehicle_detection_type.selectedIndex].value;

    // Checking the Value of "vehicle_detection_type_value"
    if (vehicle_detection_type_value == "Image") {
        // Setting the Text
        document.getElementById("sub-text").innerHTML = "Enter Image Number 1-10";
    } else if (vehicle_detection_type_value == "Video") {
        // Setting the Text
        document.getElementById("sub-text").innerHTML = "Enter Video Number 1";
    }
}

// Function 8 - Submit (Vehicle Detection)
function submit_vehicle_detection() {
    // Variables
    const vehicle_detection_type = document.getElementById("sub-type");
    const vehicle_detection_type_value = vehicle_detection_type.options[vehicle_detection_type.selectedIndex].value;
    const vehicle_detection_number = document.getElementById("sub-number").value;

    // Request Listener 1
    function request_listener_1() {
        if (this.status == 200) {
            // Response from Request
            const response = JSON.parse(this.responseText);

            // Fetching Image Data
            var rawData = response["Image Data Base64"];
            rawData = rawData.slice(0, -1);
            rawData = rawData.slice(2);

            // Setting the Image
            document.querySelectorAll(".main-content").forEach(function (item) {
                item.style.visibility = "hidden";
            });

            document.getElementById("sub-picture").src = "data:image/jpeg;base64, " + rawData;
            document.getElementById("sub-picture").style.visibility = "visible";

            // Creating an Object (Timestamp)
            const timestamp = {};
            timestamp["Number of Vehicles"] = response["Number of Vehicles"];
            timestamp["File Name"] = vehicle_detection_number + ".jpg"
            timestamp["File Type"] = "Image";

            // Setting the Timestamp in LocalStorage
            set_timestamp("Vehicle Detection Data", timestamp);

            // Checking the Count
            var count = parseInt(response["Number of Vehicles"]);

            if (count < 4) {
                notyf.success({
                    message: "Low Traffic! (Count: " + response["Number of Vehicles"] + ")",
                    background: "green"
                });
            } else if (count >= 4 && count < 8) {
                notyf.success({
                    message: "Moderate Traffic! (Count: " + response["Number of Vehicles"] + ")",
                    icon: false,
                    background: "orange"
                });
            } else if (count >= 8) {
                notyf.error({
                    message: "Very High Traffic! (Count: " + response["Number of Vehicles"] + ")",
                    background: "red"
                });
            }

            // Timeout
            setTimeout(function() {
                document.querySelectorAll(".main-content").forEach(function (item) {
                    item.style.visibility = "visible";
                });

                document.getElementById("sub-picture").src = "";
                document.getElementById("sub-picture").style.visibility = "hidden";
            }, 4000);
        } else {
            notyf.error("Please try again later.");
        }
    }

    // Request Listener 2
    function request_listener_2() {
        if (this.status == 200) {
           // Creating an Object (Timestamp)
            const timestamp = {};
            timestamp["File Name"] = vehicle_detection_number + ".mp4"
            timestamp["File Type"] = "Video";

            // Setting the Timestamp in LocalStorage
            set_timestamp("Vehicle Detection Data", timestamp);

            // Displaying the Notyf
            notyf.success("Successfully detected vehicles in the video.");
        } else {
            // Displaying the Notyf
            notyf.error("Please try again later.");
        }
    }

    // Checking the Value of "vehicle_detection_type_value"
    if (vehicle_detection_type_value == "Image") {
        // Checking the Value of "vehicle_detection_number"
        if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(parseInt(vehicle_detection_number))) {
            // Displaying the Notyf
            notyf.error("Enter a number from 1 to 10.");
        } else {
            // API Request - Submit
            api_request("/algorithm/vehicle-detection?file_type=images&file_number=" + vehicle_detection_number + "&time=" + new Date().getTime(), request_listener_1);
        }
    } else if (vehicle_detection_type_value == "Video") {
        // Checking the Value of "vehicle_detection_number"
        if (![1].includes(parseInt(vehicle_detection_number))) {
            // Displaying the Notyf
            notyf.error("Enter the number 1.");
        } else {
            // API Request - Submit
            api_request("/algorithm/vehicle-detection?file_type=videos&file_number=" + vehicle_detection_number + "&time=" + new Date().getTime(), request_listener_2);
        }
    }
}

// Function 9 - OnChange (People Detection)
function onchange_people_detection() {
    // Variables
    var people_detection_type = document.getElementById("sub-type");
    var people_detection_type_value = people_detection_type.options[people_detection_type.selectedIndex].value;

    // Checking the Value of "people_detection_type_value"
    if (people_detection_type_value == "Image") {
        // Setting the Text
        document.getElementById("sub-text").innerHTML = "Enter Image Number 1";
    } else if (people_detection_type_value == "Video") {
        // Setting the Text
        document.getElementById("sub-text").innerHTML = "Enter Video Number 1-5";
    }
}

// Function 10 - Submit (People Detection)
function submit_people_detection() {
    // Variables
    const people_detection_type = document.getElementById("sub-type");
    const people_detection_type_value = people_detection_type.options[people_detection_type.selectedIndex].value;
    const people_detection_number = document.getElementById("sub-number").value;

    // Request Listener 1
    function request_listener_1() {
        if (this.status == 200) {
            // Response from Request
            const response = JSON.parse(this.responseText);

            // Fetching Image Data
            var rawData = response["Image Data Base64"];
            rawData = rawData.slice(0, -1);
            rawData = rawData.slice(2);

            // Setting the Image
            document.querySelectorAll(".main-content").forEach(function (item) {
                item.style.visibility = "hidden";
            });

            document.getElementById("sub-picture").src = "data:image/jpeg;base64, " + rawData;
            document.getElementById("sub-picture").style.visibility = "visible";

            // Creating an Object (Timestamp)
            const timestamp = {};
            timestamp["Number of People"] = response["Number of People"];
            timestamp["File Name"] = people_detection_number + ".jpg"
            timestamp["File Type"] = "Image";

            // Setting the Timestamp in LocalStorage
            set_timestamp("People Detection Data", timestamp);

            // Displaying the Notyf
            notyf.success("Number of People: " + response["Number of People"]);

            // Timeout
            setTimeout(function() {
                document.querySelectorAll(".main-content").forEach(function (item) {
                    item.style.visibility = "visible";
                });

                document.getElementById("sub-picture").src = "";
                document.getElementById("sub-picture").style.visibility = "hidden";
            }, 4000);
        } else {
            notyf.error("Please try again later.");
        }
    }

    // Request Listener 2
    function request_listener_2() {
        if (this.status == 200) {
           // Creating an Object (Timestamp)
            const timestamp = {};
            timestamp["File Name"] = people_detection_number + ".mp4"
            timestamp["File Type"] = "Video";

            // Setting the Timestamp in LocalStorage
            set_timestamp("People Detection Data", timestamp);

            // Displaying the Notyf
            notyf.success("Successfully detected people in the video.");
        } else {
            // Displaying the Notyf
            notyf.error("Please try again later.");
        }
    }

    // Checking the Value of "people_detection_type_value"
    if (people_detection_type_value == "Image") {
        // Checking the Value of "people_detection_number"
        if (![1].includes(parseInt(people_detection_number))) {
            // Displaying the Notyf
            notyf.error("Enter the number 1.");
        } else {
            // API Request - Submit
            api_request("/algorithm/people-detection?file_type=images&file_number=" + people_detection_number + "&time=" + new Date().getTime(), request_listener_1);
        }
    } else if (people_detection_type_value == "Video") {
        // Checking the Value of "people_detection_number"
        if (![1, 2, 3, 4, 5].includes(parseInt(people_detection_number))) {
            // Displaying the Notyf
            notyf.error("Enter a number from 1 to 5.");
        } else {
            // API Request - Submit
            api_request("/algorithm/people-detection?file_type=videos&file_number=" + people_detection_number + "&time=" + new Date().getTime(), request_listener_2);
        }
    }
}