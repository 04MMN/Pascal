function showSection(id) {
    document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
    updateUI();
}

async function updateUI() {
    try {
        // L'URL pointe vers le dossier api/ à la racine
        const response = await fetch('api/api.php?action=get_all_data');
        const data = await response.json();
        const drones = data.drones || [];

        // 1. DASHBOARD
        const free = drones.filter(d => d.status.toLowerCase() === 'libre');
        const busy = drones.filter(d => d.status.toLowerCase() === 'mission');

        if(document.getElementById('countFree')) document.getElementById('countFree').innerText = free.length;
        if(document.getElementById('countBusy')) document.getElementById('countBusy').innerText = busy.length;

        // 2. TABLEAU (Utilisation de innerHTML pour éviter l'erreur appendChild)
        const tableBody = document.getElementById('droneTableBody');
        if (tableBody) {
            tableBody.innerHTML = ""; 
            drones.forEach(d => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${d.nom}</td>
                        <td>${d.type_cap}</td>
                        <td style="color: ${d.status.toLowerCase() === 'libre' ? 'green' : 'orange'}">${d.status}</td>
                    </tr>`;
            });
        }

        // 3. SELECT
        const select = document.getElementById('m_drone_select');
        if (select) {
            select.innerHTML = '<option value="">-- Choisir un drone --</option>';
            free.forEach(d => {
                select.innerHTML += `<option value="${d.id}">${d.nom}</option>`;
            });
        }
    } catch (e) {
        console.error("Erreur UI:", e);
    }
}

async function submitMission() {
    const formData = new FormData();
    formData.append('drone_id', document.getElementById('m_drone_select').value);
    formData.append('nom_mission', document.getElementById('m_nom').value);
    formData.append('date_mission', document.getElementById('m_date').value);

    const res = await fetch('api/api.php?action=save_mission', { method: 'POST', body: formData });
    const result = await res.json();
    
    if(result.success) {
        document.getElementById('missionForm').reset();
        updateUI();
    }
    document.getElementById('missionStatusMsg').innerText = result.message;
}



window.onload = updateUI;