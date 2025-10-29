// API endpoint and authentication
const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const AUTH = "Basic " + btoa("coalition:skills-test");

// Select the HTML elements we'll update
const nameEl = document.getElementById("name");
const dobEl = document.getElementById("dob");
const genderEl = document.getElementById("gender");
const phoneEl = document.getElementById("phone");
const emergencyEl = document.getElementById("emergency");
const insuranceEl = document.getElementById("insurance");
const avatarEl = document.getElementById("avatar");

const vitalsEl = document.getElementById("vitals");
const diagnosticTable = document.getElementById("diagnosticTable").querySelector("tbody");
const labsEl = document.getElementById("labs");

// Fetch patient data
async function fetchPatientData() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Authorization": AUTH,
      },
    });

    const data = await response.json();

    // Filter only Jessica Taylor
    const patient = data.find(p => p.name === "Jessica Taylor");
    if (patient) displayPatientData(patient);
  } catch (error) {
    console.error("Error fetching patient data:", error);
  }
}

// Display data in the UI
function displayPatientData(patient) {
  // Basic info
  nameEl.textContent = patient.name;
  dobEl.textContent = `DOB: ${patient.date_of_birth}`;
  genderEl.textContent = `Gender: ${patient.gender}`;
  phoneEl.textContent = `Phone: ${patient.phone_number}`;
  emergencyEl.textContent = `Emergency Contact: ${patient.emergency_contact}`;
  insuranceEl.textContent = `Insurance: ${patient.insurance_type}`;
  avatarEl.src = patient.profile_picture;

  // Vitals
  vitalsEl.innerHTML = `
    <div>
      <strong>Respiratory Rate:</strong> ${patient.vital_signs.respiratory_rate.value} ${patient.vital_signs.respiratory_rate.unit}
    </div>
    <div>
      <strong>Temperature:</strong> ${patient.vital_signs.temperature.value} ${patient.vital_signs.temperature.unit}
    </div>
    <div>
      <strong>Heart Rate:</strong> ${patient.vital_signs.heart_rate.value} ${patient.vital_signs.heart_rate.unit}
    </div>
  `;

  // Diagnostic list
  diagnosticTable.innerHTML = patient.diagnostic_list.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.status}</td>
    </tr>
  `).join("");

  // Labs
  labsEl.innerHTML = patient.lab_results.map(lab => `
    <li>${lab.name} — ${lab.date}</li>
  `).join("");

  // Blood pressure chart
  renderBPChart(patient.diagnosis_history);
}

// Render blood pressure chart
function renderBPChart(history) {
  const ctx = document.getElementById("bpChart").getContext("2d");

  const labels = history.map(h => `${h.month} ${h.year}`);
  const systolic = history.map(h => h.blood_pressure.systolic.value);
  const diastolic = history.map(h => h.blood_pressure.diastolic.value);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Systolic",
          data: systolic,
          borderColor: "#ff6384",
          fill: false,
          tension: 0.3
        },
        {
          label: "Diastolic",
          data: diastolic,
          borderColor: "#36a2eb",
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "mmHg"
          }
        }
      }
    }
  });
}

// Start the process
fetchPatientData();