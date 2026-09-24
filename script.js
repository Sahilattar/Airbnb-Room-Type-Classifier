// ============================================================
// API CONFIGURATION
// ============================================================

const DEFAULT_API_BASE =
    "https://airbnb-room-type-classifier.onrender.com";

const API_BASE_KEY = "nyc-classifier:apiBase";

function getApiBase() {
    return (localStorage.getItem(API_BASE_KEY) || DEFAULT_API_BASE)
        .replace(/\/+$/, "");
}

function setApiBase(value) {
    const clean = value.trim().replace(/\/+$/, "");

    localStorage.setItem(
        API_BASE_KEY,
        clean || DEFAULT_API_BASE
    );

    return getApiBase();
}


// ============================================================
// STATIC REFERENCE DATA
// ============================================================

const NEIGHBOURHOODS_BY_GROUP = {
    Bronx: [
        "Allerton",
        "Baychester",
        "Belmont",
        "Bronxdale",
        "Castle Hill",
        "City Island",
        "Claremont Village",
        "Clason Point",
        "Co-op City",
        "Country Club",
        "East Morrisania",
        "Eastchester",
        "Edenwald",
        "Fordham",
        "Highbridge",
        "Hunts Point",
        "Kingsbridge",
        "Longwood",
        "Morris Heights",
        "Morris Park",
        "Morrisania",
        "Mount Eden",
        "Mount Hope",
        "North Riverdale",
        "Norwood",
        "Parkchester",
        "Pelham Bay",
        "Pelham Gardens",
        "Port Morris",
        "Riverdale",
        "Schuylerville",
        "Soundview",
        "Throgs Neck",
        "Tremont",
        "University Heights",
        "Van Nest",
        "Wakefield",
        "West Farms",
        "Westchester Square",
        "Williamsbridge",
        "Woodlawn"
    ],

    Brooklyn: [
        "Bath Beach",
        "Bay Ridge",
        "Bedford-Stuyvesant",
        "Bensonhurst",
        "Bergen Beach",
        "Boerum Hill",
        "Borough Park",
        "Brighton Beach",
        "Brooklyn Heights",
        "Brownsville",
        "Bushwick",
        "Canarsie",
        "Carroll Gardens",
        "Clinton Hill",
        "Cobble Hill",
        "Coney Island",
        "Crown Heights",
        "Cypress Hills",
        "Ditmas Park",
        "Downtown Brooklyn",
        "DUMBO",
        "Dyker Heights",
        "East Flatbush",
        "East New York",
        "Flatbush",
        "Flatlands",
        "Fort Greene",
        "Gerritsen Beach",
        "Gowanus",
        "Gravesend",
        "Greenpoint",
        "Kensington",
        "Manhattan Beach",
        "Midwood",
        "Mill Basin",
        "Park Slope",
        "Prospect Heights",
        "Prospect-Lefferts Gardens",
        "Red Hook",
        "Sheepshead Bay",
        "Sunset Park",
        "Williamsburg",
        "Windsor Terrace"
    ],

    Manhattan: [
        "Battery Park City",
        "Chelsea",
        "Chinatown",
        "Civic Center",
        "East Harlem",
        "East Village",
        "Ellington",
        "Financial District",
        "Flatiron District",
        "Gramercy",
        "Greenwich Village",
        "Harlem",
        "Hell's Kitchen",
        "Inwood",
        "Kips Bay",
        "Little Italy",
        "Lower East Side",
        "Marble Hill",
        "Midtown",
        "Morningside Heights",
        "Murray Hill",
        "NoHo",
        "Nolita",
        "Roosevelt Island",
        "SoHo",
        "Stuyvesant Town",
        "Theater District",
        "Tribeca",
        "Two Bridges",
        "Upper East Side",
        "Upper West Side",
        "Washington Heights",
        "West Village"
    ],

    Queens: [
        "Arverne",
        "Astoria",
        "Bayside",
        "Bellerose",
        "Briarwood",
        "Cambria Heights",
        "College Point",
        "Corona",
        "Ditmars Steinway",
        "Douglaston",
        "East Elmhurst",
        "Elmhurst",
        "Far Rockaway",
        "Flushing",
        "Forest Hills",
        "Fresh Meadows",
        "Glen Oaks",
        "Glendale",
        "Hollis",
        "Holliswood",
        "Howard Beach",
        "Jackson Heights",
        "Jamaica",
        "Jamaica Estates",
        "Jamaica Hills",
        "Kew Gardens",
        "Kew Gardens Hills",
        "Laurelton",
        "Little Neck",
        "Long Island City",
        "Maspeth",
        "Middle Village",
        "Neponsit",
        "Ozone Park",
        "Queens Village",
        "Rego Park",
        "Richmond Hill",
        "Ridgewood",
        "Rockaway Beach",
        "Rosedale",
        "South Ozone Park",
        "Springfield Gardens",
        "St. Albans",
        "Sunnyside",
        "Whitestone",
        "Woodhaven",
        "Woodside"
    ],

    "Staten Island": [
        "Arden Heights",
        "Arrochar",
        "Bulls Head",
        "Castleton Corners",
        "Clifton",
        "Dongan Hills",
        "Eltingville",
        "Emerson Hill",
        "Fort Wadsworth",
        "Graniteville",
        "Great Kills",
        "Grymes Hill",
        "Huguenot",
        "Lighthouse Hill",
        "Mariners Harbor",
        "Midland Beach",
        "New Brighton",
        "New Dorp",
        "New Springville",
        "Oakwood",
        "Oakwood Heights",
        "Pleasant Plains",
        "Port Richmond",
        "Prince's Bay",
        "Randall Manor",
        "Rosebank",
        "Rossville",
        "Shore Acres",
        "Silver Lake",
        "South Beach",
        "St. George",
        "Todt Hill",
        "Tompkinsville",
        "Tottenville",
        "West Brighton",
        "Westerleigh"
    ]
};


// ============================================================
// ROOM TYPE COLORS
// ============================================================

const LINE_COLORS = {
    "Entire home/apt": "--brooklyn",
    "Private room": "--manhattan",
    "Shared room": "--queens"
};


// ============================================================
// FORM FIELD VALIDATION
// ============================================================

const FIELD_SPECS = {
    latitude: {
        required: true,
        min: -90,
        max: 90
    },

    longitude: {
        required: true,
        min: -180,
        max: 180
    },

    price: {
        required: true,
        min: 0
    },

    minimum_nights: {
        required: true,
        min: 1
    },

    number_of_reviews: {
        required: true,
        min: 0
    },

    reviews_per_month: {
        required: true,
        min: 0
    },

    calculated_host_listings_count: {
        required: true,
        min: 0
    },

    availability_365: {
        required: true,
        min: 0,
        max: 365
    },

    neighbourhood_group: {
        required: true
    },

    neighbourhood: {
        required: true
    }
};


// ============================================================
// POPULATE BOROUGHS & NEIGHBOURHOODS
// ============================================================

function populateStaticOptions() {
    const boroughSelect =
        document.getElementById("neighbourhood_group");

    const neighbourhoodList =
        document.getElementById("neighbourhoodList");

    if (boroughSelect) {
        boroughSelect.innerHTML =
            '<option value="" disabled selected>Select a borough</option>';

        Object.keys(NEIGHBOURHOODS_BY_GROUP).forEach((borough) => {
            const option = document.createElement("option");

            option.value = borough;
            option.textContent = borough;

            boroughSelect.appendChild(option);
        });
    }

    if (neighbourhoodList) {
        neighbourhoodList.innerHTML = "";

        Object.values(NEIGHBOURHOODS_BY_GROUP)
            .flat()
            .sort()
            .forEach((neighbourhood) => {
                const option = document.createElement("option");

                option.value = neighbourhood;

                neighbourhoodList.appendChild(option);
            });
    }
}


// ============================================================
// VALIDATE & COLLECT FORM DATA
// ============================================================

function validateAndCollect(form) {
    const payload = {};
    let firstInvalid = null;
    let isValid = true;

    Object.keys(FIELD_SPECS).forEach((fieldName) => {
        const input = form.elements[fieldName];

        if (!input) return;

        const spec = FIELD_SPECS[fieldName];
        const rawValue = input.value.trim();

        input.classList.remove("invalid");

        if (spec.required && rawValue === "") {
            input.classList.add("invalid");

            if (!firstInvalid) {
                firstInvalid = input;
            }

            isValid = false;
            return;
        }

        if (["neighbourhood_group", "neighbourhood"].includes(fieldName)) {
            payload[fieldName] = rawValue;
            return;
        }

        const value = Number(rawValue);

        if (!Number.isFinite(value)) {
            input.classList.add("invalid");

            if (!firstInvalid) {
                firstInvalid = input;
            }

            isValid = false;
            return;
        }

        if (spec.min !== undefined && value < spec.min) {
            input.classList.add("invalid");

            if (!firstInvalid) {
                firstInvalid = input;
            }

            isValid = false;
            return;
        }

        if (spec.max !== undefined && value > spec.max) {
            input.classList.add("invalid");

            if (!firstInvalid) {
                firstInvalid = input;
            }

            isValid = false;
            return;
        }

        payload[fieldName] = value;
    });

    return {
        payload,
        firstInvalid,
        isValid
    };
}


// ============================================================
// UI STATES
// ============================================================

function showIdle() {
    const result = document.getElementById("result");
    const error = document.getElementById("formError");

    if (result) {
        result.hidden = true;
    }

    if (error) {
        error.hidden = true;
    }
}


function showError(message) {
    const error = document.getElementById("formError");

    if (!error) return;

    error.textContent = message;
    error.hidden = false;
}


function showResult(roomType, probabilities) {
    const result = document.getElementById("result");

    if (!result) return;

    result.hidden = false;

    const predictedRoom =
        document.getElementById("resultType");

    if (predictedRoom) {
        const maxProbability = Math.max(
            ...probabilities.map(Number)
        );

        predictedRoom.textContent =
            `${roomType} (${(maxProbability * 100).toFixed(2)}%)`;
    }

    const probabilityList =
        document.getElementById("probBars");

    if (!probabilityList) return;

    probabilityList.innerHTML = "";

    const classes = Object.keys(LINE_COLORS);

    classes.forEach((roomTypeName, index) => {
        const value = Number(probabilities[index] || 0);

        const row = document.createElement("div");

        row.className = "prob-row";

        row.innerHTML = `
            <span>${roomTypeName}</span>

            <div class="prob-track">
                <div
                    class="prob-fill"
                    style="
                        width: ${value * 100}%;
                        background: var(${LINE_COLORS[roomTypeName]});
                    "
                ></div>
            </div>

            <span class="prob-pct">${(value * 100).toFixed(2)}%</span>
        `;

        probabilityList.appendChild(row);
    });
}


// ============================================================
// FORM SUBMIT
// ============================================================

async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    showIdle();

    const {
        payload,
        firstInvalid,
        isValid
    } = validateAndCollect(form);

    if (!isValid) {
        showError("Please enter valid values in all fields.");

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    const submitButton =
        form.querySelector('button[type="submit"]');
    const btnText = submitButton ? submitButton.querySelector(".btn-text") : null;

    if (submitButton) {
        submitButton.classList.add("loading");
        submitButton.disabled = true;
        if (btnText) {
            btnText.textContent = "Predicting…";
        } else {
            submitButton.textContent = "Predicting…";
        }
    }

    try {
        const apiBase = getApiBase();

        const response = await fetch(`${apiBase}/predict`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "The API returned an invalid response."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.message ||
                `API error: ${response.status}`
            );
        }

        if (
            !data.Predicted_room_type ||
            !Array.isArray(data.Probability)
        ) {
            throw new Error(
                "Unexpected API response format."
            );
        }

        showResult(
            data.Predicted_room_type,
            data.Probability
        );

    } catch (error) {
        console.error("Prediction error:", error);

        showError(
            error.message ||
            "Unable to connect to the prediction API."
        );

    } finally {
        if (submitButton) {
            submitButton.classList.remove("loading");
            submitButton.disabled = false;
            if (btnText) {
                btnText.textContent = "Predict Room Type";
            } else {
                submitButton.textContent = "Predict Room Type";
            }
        }
    }
}


// ============================================================
// RESET FORM
// ============================================================

function handleReset(event) {
    const form = event.currentTarget.form;

    if (!form) return;

    form.reset();

    form.querySelectorAll(".invalid").forEach((input) => {
        input.classList.remove("invalid");
    });

    showIdle();
}


// ============================================================
// SETTINGS PANEL
// ============================================================

function initSettingsPanel() {
    const apiInput =
        document.getElementById("api-base");

    const saveButton =
        document.getElementById("save-api");

    if (!apiInput || !saveButton) return;

    apiInput.value = getApiBase();

    saveButton.addEventListener("click", () => {
        const savedUrl = setApiBase(apiInput.value);

        apiInput.value = savedUrl;

        showError("API URL saved successfully.");

        setTimeout(() => {
            const error = document.getElementById("formError");

            if (error) {
                error.hidden = true;
            }
        }, 2000);
    });
}


// ============================================================
// INTERACTIVE NYC SKYLINE
// ============================================================

function initInteractiveSkyline() {
    const skyline = document.getElementById("skylineSection");
    if (!skyline) return;

    const hint = document.getElementById("skylineHint");
    const defaultHint = "Click buildings to toggle lights";
    const buildings = skyline.querySelectorAll(".building");

    buildings.forEach((building) => {
        const name = building.getAttribute("data-name") || "NYC Building";

        building.addEventListener("mouseenter", () => {
            if (hint) {
                hint.textContent = name;
                hint.style.color = "#38bdf8";
            }
        });

        building.addEventListener("mouseleave", () => {
            if (hint) {
                hint.textContent = defaultHint;
                hint.style.color = "";
            }
        });

        const toggleBuildingLights = () => {
            const windows = building.querySelectorAll(".win");
            if (!windows.length) return;

            const onCount = building.querySelectorAll(".win.on").length;
            const turnOn = onCount < windows.length / 2;

            windows.forEach((win, index) => {
                setTimeout(() => {
                    if (turnOn) {
                        win.classList.add("on");
                    } else {
                        win.classList.remove("on");
                    }
                }, index * 25);
            });

            if (hint) {
                hint.textContent = `${name}: Lights ${turnOn ? "on" : "dimmed"}`;
                setTimeout(() => {
                    if (hint.textContent.includes(name)) {
                        hint.textContent = defaultHint;
                        hint.style.color = "";
                    }
                }, 1600);
            }
        };

        building.addEventListener("click", toggleBuildingLights);

        building.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleBuildingLights();
            }
        });
    });
}


// ============================================================
// INITIALIZE APPLICATION
// ============================================================

function init() {
    populateStaticOptions();

    const form = document.getElementById("predictForm");

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    const resetButton =
        document.getElementById("reset-button"); // no reset button in current markup; safe no-op

    if (resetButton) {
        resetButton.addEventListener("click", handleReset);
    }

    initSettingsPanel();
    initInteractiveSkyline();

    showIdle();
}


// ============================================================
// START APP
// ============================================================

document.addEventListener("DOMContentLoaded", init);