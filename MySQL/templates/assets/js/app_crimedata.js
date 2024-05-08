
/* Copyright 2023 Aniketh Chavare

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

// Function 1 - View Data
function view_data() {
    // Fetching & Validating Input from the User (License Plate Number)
    const license_plate_number = prompt("Enter the license plate number:");

    if (license_plate_number != null & license_plate_number.length > 0) {
        // Request Listener 1
        function request_listener_1() {
            // Checking the Status Code
            if (this.status == 200) {
                // Alerting
                alert("Visit the console to see the crime data available for " + license_plate_number + ".");

                // Nested Function 1 - Pretty Print Data
                function pretty_print_data(text) {
                    // Variables
                    var i = 0;
                    var k = 1;
                    var final_text = "";
                    const data = JSON.parse(text)["Data"]

                    // Looping through Array Elements
                    while (i < data.length) {
                        // Setting the "final_text" Variable
                        final_text = final_text + k.toString() + ") " + data[i].toString().replaceAll(",", ", ") + "\n";

                        // Incrementing "i" and "k"
                        i++;
                        k++;
                    }

                    // Returning "final_text"
                    return final_text;
                }

                // Logging the Data
                console.log("%cCRIME DATA: " + license_plate_number + " (" + full_date + " " + full_time + ")%c\n\n" + pretty_print_data(this.responseText), "color: red", "color: white");
            } else {
                // Alerting
                alert("There is no crime data available for that license plate number.")

                // Calling the Function
                view_data();
            }
        }

        // API Request - Fetching the Crime Data (MySQL)
        api_request(`/mysql/crime-data/view-data?license_plate_number=${license_plate_number}&time=` + new Date().getTime(), request_listener_1);
    } else {
        // Alerting
        alert("Please enter a valid and non-empty license plate number.")

        // Calling the Function
        view_data();
    }
}

// Function 2 - Add Offense
function add_offense() {
    // Fetching & Validating Input from the User (License Plate Number)
    const offense_license_plate_number = prompt("Enter the license plate number:");

    if (offense_license_plate_number != null & offense_license_plate_number.length > 0) {
        // Fetching & Validating Input from the User (Offense)
        const offense = prompt("What was the offense?");

        if (offense != null & offense.length > 0) {
            // Fetching & Validating Input from the User (Fine)
            const offense_fine = prompt("How much is the fine (₹)?");

            if (offense_fine != null & offense_fine.length > 0) {
                // Request Listener 1
                function request_listener_1() {
                    // Checking the Status Code
                    if (this.status == 200) {
                        // Alerting
                        alert("Successfully added the offense.");
                    } else {
                        // Alerting
                        alert("An error occurred. Please try again later.")
                    }
                }

                // API Request - Adding the Offense (MySQL)
                api_request(`/mysql/add-row?table_name=crime_data&items={'License Plate Number': '${offense_license_plate_number}', 'Date': '${full_date}', 'Time': '${full_time}', 'Offense': '${offense}', 'Fine': ${offense_fine}}&time=` + new Date().getTime(), request_listener_1);
            } else {
                // Alerting
                alert("Please enter a valid and non-empty fine amount.")
            }
        } else {
            // Alerting
            alert("Please enter a valid and non-empty offense.")
        }
    } else {
        // Alerting
        alert("Please enter a valid and non-empty license plate number.")

        // Calling the Function
        add_offense();
    }
}

// Function 3 - Remove Offense
function remove_offense() {
    // Fetching & Validating Input from the User (License Plate Number)
    const license_plate_number = prompt("Enter the license plate number:");

    if (license_plate_number != null & license_plate_number.length > 0) {
        // Request Listener 1
        function request_listener_1() {
            // Checking the Status Code
            if (this.status == 200) {
                // Alerting
                alert("Successfully removed the offense.");
            } else {
                // Alerting
                alert("No offense was found for the vehicle " + license_plate_number + ".");
            }
        }

        // Request Listener 2
        function request_listener_2() {
            // Checking the Value of Response
            if (this.responseText == "false") {
                // Alerting
                alert("There is no crime data available for that license plate number.")

                // Calling the Function
                remove_offense();
            } else {
                // Fetching & Validating Input from the User (Offense)
                const offense = prompt("What was the offense?");

                if (offense != null & offense.length > 0) {
                    // API Request - Remove Offense (MySQL)
                    api_request(`/mysql/crime-data/remove-offense?license_plate_number=${license_plate_number}&offense=${offense}&time=` + new Date().getTime(), request_listener_1);
                } else {
                    // Alerting
                    alert("Please enter a valid and non-empty offense.")
                }
            }
        }

        // API Request - Checking if Record Exists (MySQL)
        api_request(`/mysql/crime-data/record-exists?license_plate_number=${license_plate_number}&time=` + new Date().getTime(), request_listener_2)
    } else {
        // Alerting
        alert("Please enter a valid and non-empty license plate number.")

        // Calling the Function
        remove_offense();
    }
}

// Function 4 - Total Fines
function total_fines() {
    // Fetching & Validating Input from the User (License Plate Number)
    const license_plate_number = prompt("Enter the license plate number:");

    if (license_plate_number != null & license_plate_number.length > 0) {
        // Request Listener 1
        function request_listener_1() {
            // Checking the Status Code
            if (this.status == 200) {
                // Alerting
                alert("The total amount of fines for " + license_plate_number + " is ₹" + JSON.parse(this.responseText)["Total Fine Amount"].toString() + ".");
            } else {
                // Alerting
                alert("There is no crime data available for that license plate number.")

                // Calling the Function
                total_fines();
            }
        }

        // API Request - Fetching the Total Fine Amount (MySQL)
        api_request(`/mysql/crime-data/total-fines?license_plate_number=${license_plate_number}&time=` + new Date().getTime(), request_listener_1)
    } else {
        // Alerting
        alert("Please enter a valid and non-empty license plate number.")

        // Calling the Function
        total_fines();
    }
}