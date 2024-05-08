
// Function 1 - View Data
function view_data() {
    // Checking if Local Storage Exists
    if (!local_storage_exists()) {
        // Alerting
        alert("There is no crime data available.")
    } else {
        // Fetching & Validating Input from the User (License Plate Number)
        const license_plate_number = prompt("Enter the license plate number:");

        if (license_plate_number != null & license_plate_number.length > 0) {
            // Variables
            var local_storage_data = JSON.parse(localStorage.getItem("Crime Data"))[license_plate_number];

            // Validating "local_storage_data"
            if (local_storage_data == undefined) {
                // Alerting
                alert("There is no crime data available for that license plate number.")

                // Calling the Function
                view_data();
            } else {
                // Alerting
                alert("Visit the console to see the crime data available for " + license_plate_number + ".");

                // Logging the Data
                console.log("%cCRIME DATA: " + license_plate_number + " (" + full_date + " " + full_time + ")%c\n\n" + JSON.stringify(local_storage_data, null, 3), "color: red", "color: white");
            }
        } else {
            // Alerting
            alert("Please enter a valid and non-empty license plate number.")

            // Calling the Function
            view_data();
        }
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
                // Adding the Offense (Local Storage)
                add_offense_local_storage(offense_license_plate_number, offense, offense_fine);
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
    // Checking if Local Storage Exists
    if (!local_storage_exists()) {
        // Alerting
        alert("There is no crime data available.")
    } else {
        // Fetching & Validating Input from the User (License Plate Number)
        const license_plate_number = prompt("Enter the license plate number:");

        if (license_plate_number != null & license_plate_number.length > 0) {
            // Variables
            var local_storage_data = JSON.parse(localStorage.getItem("Crime Data"));

            // Validating "local_storage_data_number"
            if (local_storage_data[license_plate_number] == undefined) {
                // Alerting
                alert("There is no crime data available for that license plate number.")

                // Calling the Function
                remove_offense();
            } else {
                // Fetching & Validating Input from the User (Offense)
                const offense = prompt("What was the offense?");

                if (offense != null & offense.length > 0) {
                    // Variables
                    var i = 0;
                    var flag = true;

                    // Looping through the Local Storage Data
                    while (i < local_storage_data[license_plate_number].length) {
                        // Searching for the Offense
                        if (local_storage_data[license_plate_number][i]["Offense"] == offense) {
                            // Setting the Flag
                            flag = false;

                            // Variables
                            const index_of_element = local_storage_data[license_plate_number].indexOf(local_storage_data[license_plate_number][i]);

                            // Removing the Offense
                            if (index_of_element !== -1) {
                                local_storage_data[license_plate_number].splice(index_of_element, 1);
                            }

                            // Setting the Key
                            localStorage.setItem("Crime Data", JSON.stringify(local_storage_data));

                            // Alerting
                            alert("Successfully removed the offense.");

                            // Checking if Key is Empty
                            if (local_storage_data[license_plate_number].length == 0) {
                                // Deleting the License Play Number
                                delete local_storage_data[license_plate_number]

                                // Setting the Key
                                localStorage.setItem("Crime Data", JSON.stringify(local_storage_data));
                            }

                            // Checking if Local Storage Data is Empty
                            if (Object.keys(JSON.parse(localStorage.getItem("Crime Data"))).length == 0) {
                                // Deleting the Local Storage Key
                                localStorage.removeItem("Crime Data");
                            }

                            // Breaking the While Loop
                            break
                        }

                        // Incrementing "i"
                        i++;
                    }

                    // Checking the Flag
                    if (flag) {
                        // Alerting
                        alert("No offense was found for the vehicle " + license_plate_number + ".");
                    }
                } else {
                    // Alerting
                    alert("Please enter a valid and non-empty offense.")
                }
            }
        } else {
            // Alerting
            alert("Please enter a valid and non-empty license plate number.")

            // Calling the Function
            remove_offense();
        }
    }
}

// Function 4 - Total Fines
function total_fines() {
    // Checking if Local Storage Exists
    if (!local_storage_exists()) {
        // Alerting
        alert("There is no crime data available.")
    } else {
        // Fetching & Validating Input from the User (License Plate Number)
        const license_plate_number = prompt("Enter the license plate number:");

        if (license_plate_number != null & license_plate_number.length > 0) {
            // Variables
            var local_storage_data = JSON.parse(localStorage.getItem("Crime Data"))[license_plate_number];

            // Validating "local_storage_data"
            if (local_storage_data == undefined) {
                // Alerting
                alert("There is no crime data available for that license plate number.")

                // Calling the Function
                total_fines();
            } else {
                // Variables
                var i = 0;
                var total_fine_amount = 0;

                // Looping through the Local Storage Data
                while (i < local_storage_data.length) {
                    // Adding the Fines
                    total_fine_amount += parseInt(local_storage_data[i]["Fine"]);

                    // Incrementing "i"
                    i++;
                }

                // Alerting
                alert("The total amount of fines for " + license_plate_number + " is ₹" + total_fine_amount.toString() + ".");
            }
        } else {
            // Alerting
            alert("Please enter a valid and non-empty license plate number.")

            // Calling the Function
            total_fines();
        }
    }
}

// Function 5 - Local Storage Exists
function local_storage_exists() {
    // Returning Whether Local Storage Exists or Not
    return (localStorage.getItem("Crime Data") != null)
}

// Function 6 - Add Offense Local Storage
function add_offense_local_storage(license_plate_number, offense, fine) {
    // Checking if Local Storage Exists
    if (local_storage_exists()) {
        // Variables
        var local_storage_data = JSON.parse(localStorage.getItem("Crime Data"));

        // Checking if License Plate Number Exists
        if (license_plate_number in local_storage_data) {
            // Setting the Keys (object_1)
            const object_1 = {};
            object_1["Date"] = full_date;
            object_1["Time"] = full_time;
            object_1["Offense"] = offense;
            object_1["Fine"] = fine;

            // Updating "local_storage_data"
            local_storage_data[license_plate_number].push(object_1);

            // Setting the Key
            localStorage.setItem("Crime Data", JSON.stringify(local_storage_data));

            // Alerting
            alert("Successfully added the offense.");
        } else {
            // Variables
            const list_1 = [];
            const object_1 = {};

            // Updating "object_1"
            object_1["Date"] = full_date;
            object_1["Time"] = full_time;
            object_1["Offense"] = offense;
            object_1["Fine"] = fine;

            // Updating "list_1"
            list_1.push(object_1);

            // Updating "local_storage_data"
            local_storage_data[license_plate_number] = list_1

            // Setting the Key
            localStorage.setItem("Crime Data", JSON.stringify(local_storage_data));

            // Alerting
            alert("Successfully added the offense.");
        }
    } else {
        // Variables
        const object_1 = {};
        const list_1 = [];
        const object_2 = {};

        // Updating "object_2"
        object_2["Date"] = full_date;
        object_2["Time"] = full_time;
        object_2["Offense"] = offense;
        object_2["Fine"] = fine;

        // Updating "list_1"
        list_1.push(object_2);

        // Updating "object_1"
        object_1[license_plate_number] = list_1

        // Setting the Key
        localStorage.setItem("Crime Data", JSON.stringify(object_1));

        // Alerting
        alert("Successfully added the offense.");
    }
}