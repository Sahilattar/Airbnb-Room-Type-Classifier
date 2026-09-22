const BOROUGHS = ["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island"];

const NEIGHBOURHOODS = ["Allerton", "Arden Heights", "Arrochar", "Arverne", "Astoria", "Bath Beach", "Battery Park City", "Bay Ridge", "Bay Terrace", "Bay Terrace, Staten Island", "Baychester", "Bayside", "Bayswater", "Bedford-Stuyvesant", "Belle Harbor", "Bellerose", "Belmont", "Bensonhurst", "Bergen Beach", "Boerum Hill", "Borough Park", "Breezy Point", "Briarwood", "Brighton Beach", "Bronxdale", "Brooklyn Heights", "Brownsville", "Bull's Head", "Bushwick", "Cambria Heights", "Canarsie", "Carroll Gardens", "Castle Hill", "Castleton Corners", "Chelsea", "Chinatown", "City Island", "Civic Center", "Claremont Village", "Clason Point", "Clifton", "Clinton Hill", "Co-op City", "Cobble Hill", "College Point", "Columbia St", "Concord", "Concourse", "Concourse Village", "Coney Island", "Corona", "Crown Heights", "Cypress Hills", "DUMBO", "Ditmars Steinway", "Dongan Hills", "Douglaston", "Downtown Brooklyn", "Dyker Heights", "East Elmhurst", "East Flatbush", "East Harlem", "East Morrisania", "East New York", "East Village", "Eastchester", "Edenwald", "Edgemere", "Elmhurst", "Eltingville", "Emerson Hill", "Far Rockaway", "Fieldston", "Financial District", "Flatbush", "Flatiron District", "Flatlands", "Flushing", "Fordham", "Forest Hills", "Fort Greene", "Fort Hamilton", "Fresh Meadows", "Glendale", "Gowanus", "Gramercy", "Graniteville", "Grant City", "Gravesend", "Great Kills", "Greenpoint", "Greenwich Village", "Grymes Hill", "Harlem", "Hell's Kitchen", "Highbridge", "Hollis", "Holliswood", "Howard Beach", "Howland Hook", "Huguenot", "Hunts Point", "Inwood", "Jackson Heights", "Jamaica", "Jamaica Estates", "Jamaica Hills", "Kensington", "Kew Gardens", "Kew Gardens Hills", "Kingsbridge", "Kips Bay", "Laurelton", "Little Italy", "Little Neck", "Long Island City", "Longwood", "Lower East Side", "Manhattan Beach", "Marble Hill", "Mariners Harbor", "Maspeth", "Melrose", "Middle Village", "Midland Beach", "Midtown", "Midwood", "Mill Basin", "Morningside Heights", "Morris Heights", "Morris Park", "Morrisania", "Mott Haven", "Mount Eden", "Mount Hope", "Murray Hill", "Navy Yard", "Neponsit", "New Brighton", "New Dorp", "New Dorp Beach", "New Springville", "NoHo", "Nolita", "North Riverdale", "Norwood", "Oakwood", "Olinville", "Ozone Park", "Park Slope", "Parkchester", "Pelham Bay", "Pelham Gardens", "Port Morris", "Port Richmond", "Prince's Bay", "Prospect Heights", "Prospect-Lefferts Gardens", "Queens Village", "Randall Manor", "Red Hook", "Rego Park", "Richmond Hill", "Ridgewood", "Riverdale", "Rockaway Beach", "Roosevelt Island", "Rosebank", "Rosedale", "Rossville", "Schuylerville", "Sea Gate", "Sheepshead Bay", "Shore Acres", "Silver Lake", "SoHo", "Soundview", "South Beach", "South Ozone Park", "South Slope", "Springfield Gardens", "Spuyten Duyvil", "St. Albans", "St. George", "Stapleton", "Stuyvesant Town", "Sunnyside", "Sunset Park", "Theater District", "Throgs Neck", "Todt Hill", "Tompkinsville", "Tottenville", "Tremont", "Tribeca", "Two Bridges", "Unionport", "University Heights", "Upper East Side", "Upper West Side", "Van Nest", "Vinegar Hill", "Wakefield", "Washington Heights", "West Brighton", "West Farms", "West Village", "Westchester Square", "Westerleigh", "Whitestone", "Williamsbridge", "Williamsburg", "Willowbrook", "Windsor Terrace", "Woodhaven", "Woodlawn", "Woodside"];
/* ============================================================
   App logic — form handling, validation, API call, rendering
   ============================================================ */

const FIELD_SPECS = {
  latitude:                        { type: "float", min: -90,  max: 90,  label: "Latitude" },
  longitude:                       { type: "float", min: -180, max: 180, label: "Longitude" },
  price:                           { type: "float", min: 0,    exclusiveMin: true, label: "Price" },
  minimum_nights:                  { type: "int",   min: 1,    max: 365, label: "Minimum nights" },
  number_of_reviews:               { type: "int",   min: 0,    label: "Number of reviews" },
  reviews_per_month:               { type: "float", min: 0,    label: "Reviews per month" },
  calculated_host_listings_count:  { type: "int",   min: 0,    label: "Host's total listings" },
  availability_365:                { type: "int",   min: 0,    max: 365, label: "Availability" },
  neighbourhood_group:             { type: "str",   label: "Borough" },
  neighbourhood:                   { type: "str",   label: "Neighbourhood" },
};

const LINE_COLORS = {
  "Entire home/apt": "var(--line-green)",
  "Private room": "var(--line-blue)",
  "Shared room": "var(--line-orange)",
};

const DEFAULT_API_BASE = "https://airbnb-room-type-classifier.onrender.com";
const API_BASE_KEY = "nyc-classifier:apiBase";

function getApiBase() {
  return (localStorage.getItem(API_BASE_KEY) || DEFAULT_API_BASE).replace(/\/+$/, "");
}

function setApiBase(value) {
  const clean = value.trim().replace(/\/+$/, "");
  localStorage.setItem(API_BASE_KEY, clean || DEFAULT_API_BASE);
  return getApiBase();
}

/* ---------- populate boroughs & neighbourhood datalist ---------- */
function populateStaticOptions() {
  const boroughSelect = document.getElementById("neighbourhood_group");
  BOROUGHS.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    boroughSelect.appendChild(opt);
  });

  const datalist = document.getElementById("neighbourhoodList");
  NEIGHBOURHOODS.forEach((n) => {
    const opt = document.createElement("option");
    opt.value = n;
    datalist.appendChild(opt);
  });
}

/* ---------- validation ---------- */
function clearFieldError(name) {
  const field = document.getElementById(name)?.closest(".field");
  const errEl = document.querySelector(`[data-error-for="${name}"]`);
  if (field) field.classList.remove("has-error");
  if (errEl) errEl.textContent = "";
}

function setFieldError(name, message) {
  const field = document.getElementById(name)?.closest(".field");
  const errEl = document.querySelector(`[data-error-for="${name}"]`);
  if (field) field.classList.add("has-error");
  if (errEl) errEl.textContent = message;
}

function validateAndCollect(form) {
  const payload = {};
  let firstInvalid = null;

  for (const [name, spec] of Object.entries(FIELD_SPECS)) {
    clearFieldError(name);
    const el = document.getElementById(name);
    const raw = el.value.trim();

    if (raw === "") {
      setFieldError(name, `${spec.label} is required.`);
      firstInvalid = firstInvalid || el;
      continue;
    }

    if (spec.type === "str") {
      if (spec.label === "Neighbourhood" && !NEIGHBOURHOODS.includes(raw)) {
        setFieldError(name, "Pick a neighbourhood from the suggestions.");
        firstInvalid = firstInvalid || el;
        continue;
      }
      payload[name] = raw;
      continue;
    }

    const num = Number(raw);
    if (Number.isNaN(num)) {
      setFieldError(name, `${spec.label} must be a number.`);
      firstInvalid = firstInvalid || el;
      continue;
    }
    if (spec.type === "int" && !Number.isInteger(num)) {
      setFieldError(name, `${spec.label} must be a whole number.`);
      firstInvalid = firstInvalid || el;
      continue;
    }
    if (spec.exclusiveMin && num <= spec.min) {
      setFieldError(name, `${spec.label} must be greater than ${spec.min}.`);
      firstInvalid = firstInvalid || el;
      continue;
    }
    if (spec.min !== undefined && num < spec.min) {
      setFieldError(name, `${spec.label} must be at least ${spec.min}.`);
      firstInvalid = firstInvalid || el;
      continue;
    }
    if (spec.max !== undefined && num > spec.max) {
      setFieldError(name, `${spec.label} must be at most ${spec.max}.`);
      firstInvalid = firstInvalid || el;
      continue;
    }
    payload[name] = num;
  }

  return { payload, firstInvalid, isValid: !firstInvalid };
}

/* ---------- result rendering ---------- */
function showIdle() {
  document.getElementById("signIdle").hidden = false;
  document.getElementById("signError").hidden = true;
  document.getElementById("signResult").hidden = true;
}

function showError(message) {
  document.getElementById("signIdle").hidden = true;
  document.getElementById("signError").hidden = false;
  document.getElementById("signResult").hidden = true;
  document.getElementById("signErrorText").textContent = message;
}

function showResult(predictedLabel, probabilities) {
  document.getElementById("signIdle").hidden = true;
  document.getElementById("signError").hidden = true;
  document.getElementById("signResult").hidden = false;

  const color = LINE_COLORS[predictedLabel] || "var(--ink)";
  const bullet = document.getElementById("resultBullet");
  bullet.style.setProperty("--line-color", color);
  document.getElementById("resultLabel").textContent = predictedLabel;

  const probsEl = document.getElementById("probs");
  probsEl.innerHTML = "";

  const classes = Object.keys(LINE_COLORS);
  const rows = classes.map((label, i) => ({
    label,
    value: Array.isArray(probabilities) ? (probabilities[i] ?? 0) : 0,
  })).sort((a, b) => b.value - a.value);

  rows.forEach((row) => {
    const wrap = document.createElement("div");
    wrap.className = "prob-row";

    const top = document.createElement("div");
    top.className = "prob-row__top";
    top.innerHTML = `<span class="prob-row__name">${row.label}</span><span class="prob-row__pct">${(row.value * 100).toFixed(1)}%</span>`;

    const track = document.createElement("div");
    track.className = "prob-row__track";
    const fill = document.createElement("div");
    fill.className = "prob-row__fill";
    fill.style.setProperty("--line-color", LINE_COLORS[row.label] || "var(--ink)");
    fill.style.width = "0%";
    track.appendChild(fill);

    wrap.appendChild(top);
    wrap.appendChild(track);
    probsEl.appendChild(wrap);

    requestAnimationFrame(() => {
      fill.style.width = `${Math.max(0, Math.min(100, row.value * 100))}%`;
    });
  });
}

/* ---------- submit handling ---------- */
async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  statusEl.textContent = "";

  const { payload, firstInvalid, isValid } = validateAndCollect(form);

  if (!isValid) {
    statusEl.textContent = "Please fix the highlighted fields.";
    firstInvalid.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add("is-loading");

  const apiBase = getApiBase();

  try {
    const response = await fetch(`${apiBase}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let detail = `Request failed with status ${response.status}.`;
      try {
        const errBody = await response.json();
        if (errBody?.detail) {
          detail = typeof errBody.detail === "string"
            ? errBody.detail
            : JSON.stringify(errBody.detail);
        }
      } catch (_) { /* ignore parse errors, keep default message */ }
      throw new Error(detail);
    }

    const data = await response.json();
    showResult(data.Predicted_room_type, data.Probability);
  } catch (err) {
    const message = err instanceof TypeError
      ? `Couldn't reach the API at ${apiBase}. Check it's running and the URL is correct (see the API button, top right).`
      : err.message || "Something went wrong while getting a prediction.";
    showError(message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading");
  }
}

function handleReset() {
  document.getElementById("predictForm").reset();
  Object.keys(FIELD_SPECS).forEach(clearFieldError);
  document.getElementById("formStatus").textContent = "";
  showIdle();
}

/* ---------- settings panel ---------- */
function initSettingsPanel() {
  const toggle = document.getElementById("settingsToggle");
  const panel = document.getElementById("settingsPanel");
  const input = document.getElementById("apiBase");
  const saveBtn = document.getElementById("apiBaseSave");

  input.value = getApiBase();

  toggle.addEventListener("click", () => {
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    toggle.setAttribute("aria-expanded", String(isHidden));
  });

  saveBtn.addEventListener("click", () => {
    const updated = setApiBase(input.value || DEFAULT_API_BASE);
    input.value = updated;
    const statusEl = document.getElementById("formStatus");
    statusEl.style.color = "var(--line-green)";
    statusEl.textContent = `API URL saved: ${updated}`;
    setTimeout(() => {
      statusEl.textContent = "";
      statusEl.style.color = "";
    }, 2500);
  });
}

/* ---------- init ---------- */
function init() {
  populateStaticOptions();
  initSettingsPanel();
  document.getElementById("predictForm").addEventListener("submit", handleSubmit);
  document.getElementById("resetBtn").addEventListener("click", handleReset);
  showIdle();
}

document.addEventListener("DOMContentLoaded", init);
