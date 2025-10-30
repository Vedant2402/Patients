// API and auth
const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const AUTH = "Basic " + btoa("coalition:skills-test");

const get = id => document.getElementById(id);
let patients = [];
const els = {
  name: get("name"), dob: get("dob"), gender: get("gender"), phone: get("phone"),
  emergency: get("emergency"), insurance: get("insurance"), avatar: get("avatar"),
  vitals: get("vitals"), labs: get("labs"), bpChart: get("bpChart"),
  status: get("status"), patientSelect: get("patientSelect")
};
const diagnosticTable = get("diagnosticTable").querySelector("tbody");
const historyTableBody = get("historyTable").querySelector("tbody");
let bpChartInstance = null;

async function fetchPatientData(){   // Fetch patient data and render Jessica Taylor if found
  try{
    const res = await fetch(API_URL,{headers:{Authorization: AUTH}});
    const data = await res.json();
    if(!Array.isArray(data)){els.status.textContent='Unexpected API response';console.error('Unexpected API response',data);return}
    patients = data;
    els.status.textContent = `fetched ${data.length} patients`;

    els.patientSelect.innerHTML = data.map((d,i)=>`<option value="${i}">${(d.name||('Patient '+i))}</option>`).join('');
    els.patientSelect.style.display = 'block';
    els.patientSelect.onchange = ()=>displayPatientData(patients[+els.patientSelect.value]);

    const idx = data.findIndex(x=>x.name==="Jessica Taylor" || (x.name && x.name.toLowerCase().includes('jessica')));
    if(idx>=0){els.patientSelect.value = idx; els.status.textContent += ` — matched ${data[idx].name}`; displayPatientData(data[idx])}
    else{els.status.textContent += ' — Jessica not found; select a patient to preview'; console.warn('Jessica not found; available names:', data.map(d=>d.name).slice(0,20))}
  }catch(e){console.error("Error fetching patient data:",e)}
}

function displayPatientData(p){
  els.name.textContent = p.name;
  els.dob.textContent = `DOB: ${p.date_of_birth}`;
  els.gender.textContent = `Gender: ${p.gender}`;
  els.phone.textContent = p.phone_number;
  els.emergency.textContent = `Emergency Contact: ${p.emergency_contact}`;
  els.insurance.textContent = `Insurance: ${p.insurance_type}`;
  els.avatar.src = p.profile_picture;

  if(els.status) els.status.textContent = `previewing: ${p.name}`;

  if(p.vital_signs){
    els.vitals.innerHTML = ["respiratory_rate","temperature","heart_rate"].map(k=>{
      const v = p.vital_signs[k];
      return v?`<div><strong>${k.split("_").map(s=>s[0].toUpperCase()+s.slice(1)).join(" ")}:</strong> ${v.value} ${v.unit||''}</div>`:''
    }).join("");
  }else els.vitals.innerHTML = '<em>No vitals available</em>';

  if(Array.isArray(p.diagnostic_list) && p.diagnostic_list.length){
    diagnosticTable.innerHTML = p.diagnostic_list.map(i=>`<tr><td>${i.name}</td><td>${i.description}</td><td>${i.status}</td></tr>`).join("");
  }else diagnosticTable.innerHTML = '<tr><td colspan="3"><em>No diagnostics</em></td></tr>';

  if(Array.isArray(p.lab_results) && p.lab_results.length){
    els.labs.innerHTML = p.lab_results.map(l=>typeof l==='string'?`<li>${l}</li>`:`<li>${l.name} — ${l.date||''}</li>`).join("");
  }else els.labs.innerHTML = '<li><em>No lab results</em></li>';

  const history = Array.isArray(p.diagnosis_history)?p.diagnosis_history:[];
  if(history.length){
    historyTableBody.innerHTML = history.map(h=>`<tr><td>${h.month} ${h.year}</td><td>${h.blood_pressure?.systolic?.value??''}</td><td>${h.blood_pressure?.diastolic?.value??''}</td><td>${h.heart_rate?.value??''}</td><td>${h.temperature?.value??''}</td><td>${h.respiratory_rate?.value??''}</td></tr>`).join('');
    renderBPChart(history);
  }else{
    historyTableBody.innerHTML = '<tr><td colspan="6"><em>No diagnosis history</em></td></tr>';
    if(bpChartInstance){bpChartInstance.destroy(); bpChartInstance = null}
    try{els.bpChart.getContext('2d').clearRect(0,0,els.bpChart.width,els.bpChart.height)}catch(e){}
  }
}

function renderBPChart(history){
  if(!history || !history.length) return;
  if(bpChartInstance) bpChartInstance.destroy();
  const ctx = els.bpChart.getContext("2d");
  const labels = history.map(h=>`${h.month} ${h.year}`);
  const systolic = history.map(h=>h.blood_pressure?.systolic?.value??null);
  const diastolic = history.map(h=>h.blood_pressure?.diastolic?.value??null);
  bpChartInstance = new Chart(ctx,{type:"line",data:{labels,datasets:[{label:"Systolic",data:systolic,borderColor:"#ff6384",fill:false,tension:0.3},{label:"Diastolic",data:diastolic,borderColor:"#36a2eb",fill:false,tension:0.3}]},options:{responsive:true,plugins:{legend:{position:"bottom"}},scales:{y:{title:{display:true,text:"mmHg"}}}}});
}

fetchPatientData();