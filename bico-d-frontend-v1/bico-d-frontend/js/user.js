// user.js — Espace utilisateur

const currentUser = requireRole('user');
if (currentUser) {
  document.getElementById('userAvatar').textContent = currentUser.nom.charAt(0).toUpperCase();
  document.getElementById('userName').textContent   = currentUser.nom;
  document.getElementById('dashWelcome').textContent = currentUser.nom;
  showSection('dashboard');
}

let droneFilter = 'tous';

function renderSection(id) {
  switch(id) {
    case 'dashboard':   renderDashboard(); break;
    case 'drones':      renderDrones();    break;
    case 'reserver':    renderReserveForm(); break;
    case 'mesDemandes': renderMesDemandes(); break;
  }
}

// ── DASHBOARD ────────────────────────────────────
function renderDashboard() {
  const drones = getDrones();
  const res    = getReservations().filter(r => r.userId === currentUser.id);
  const deps   = getDepots().filter(d => d.userId === currentUser.id);
  const libres = drones.filter(d => d.status === 'libre');

  document.getElementById('statLibres').textContent  = libres.length;
  document.getElementById('statMesRes').textContent  = res.length;
  document.getElementById('statMesDep').textContent  = deps.length;

  // Liste drones libres
  const dl = document.getElementById('dashDronesList');
  if (libres.length === 0) {
    dl.innerHTML = emptyState('Aucun drone disponible');
  } else {
    dl.innerHTML = libres.slice(0, 5).map(d => `
      <div class="mini-row">
        <span>${droneEmoji(d.type_cap)} <strong>${d.nom}</strong></span>
        <span class="status-badge badge-green">Libre</span>
      </div>`).join('');
  }

  // Activité
  const act = document.getElementById('dashActivity');
  const items = [
    ...res.slice(-3).reverse().map(r => {
      const drone = getDrones().find(d => d.id === r.droneId);
      return { txt: `Réservation "${r.nomMission}" — ${drone ? drone.nom : '?'}`, status: r.status, date: r.dateSoumission };
    }),
    ...deps.slice(-2).reverse().map(d => ({
      txt: `Dépôt drone "${d.nom}"`, status: d.status, date: d.dateSoumission
    }))
  ];
  if (items.length === 0) {
    act.innerHTML = emptyState('Aucune activité récente');
  } else {
    act.innerHTML = items.map(i => `
      <div class="mini-row">
        <div>
          <div style="font-size:.86rem;color:var(--text)">${i.txt}</div>
          <div style="font-size:.75rem;color:var(--text3)">${i.date}</div>
        </div>
        ${statusBadge(i.status)}
      </div>`).join('');
  }
}

// ── DRONES ────────────────────────────────────────
function renderDrones() {
  let list = getDrones();
  if (droneFilter !== 'tous') list = list.filter(d => d.status === droneFilter);
  const grid = document.getElementById('dronesGrid');
  if (list.length === 0) {
    grid.innerHTML = emptyState('Aucun drone dans cette catégorie'); return;
  }
  grid.innerHTML = list.map(d => `
    <div class="drone-card ${d.status}">
      <div class="drone-card-top">
        <span style="font-size:1.8rem">${droneEmoji(d.type_cap)}</span>
        ${statusBadge(d.status)}
      </div>
      <div class="drone-name">${d.nom}</div>
      <div class="drone-type">${d.type_cap} · ${d.modele || ''}</div>
      <div class="drone-meta">
        <span>📍 ${d.localisation || 'N/A'}</span>
        <span>⏱ ${d.autonomie || '?'} min</span>
        ${d.prix ? `<span>💰 ${Number(d.prix).toLocaleString()} FCFA/h</span>` : ''}
      </div>
    </div>`).join('');
}

function filterDrones(f, btn) {
  droneFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderDrones();
}

// ── RÉSERVATION ───────────────────────────────────
function renderReserveForm() {
  const sel = document.getElementById('r_drone');
  const libres = getDrones().filter(d => d.status === 'libre');
  sel.innerHTML = '<option value="">-- Sélectionner un drone libre --</option>' +
    libres.map(d => `<option value="${d.id}">${d.nom} (${d.type_cap}) — ${d.localisation}</option>`).join('');
  document.getElementById('r_date').min = new Date().toISOString().split('T')[0];
}

function submitReservation() {
  const droneId = parseInt(document.getElementById('r_drone').value);
  const nom     = document.getElementById('r_nom').value.trim();
  const date    = document.getElementById('r_date').value;
  const duree   = document.getElementById('r_duree').value || 'N/A';
  const desc    = document.getElementById('r_desc').value.trim();

  if (!droneId || !nom || !date) {
    showAlert('resAlert', '⚠️ Veuillez remplir tous les champs obligatoires.', 'error'); return;
  }

  const res = getReservations();
  res.push({
    id: Date.now(), userId: currentUser.id, userNom: currentUser.nom,
    droneId, nomMission: nom, date, duree, desc,
    status: 'attente', dateSoumission: todayStr()
  });
  saveReservations(res);
  showAlert('resAlert', '✅ Demande envoyée ! En attente de validation par l\'administrateur.', 'success');
  document.getElementById('r_drone').value = '';
  document.getElementById('r_nom').value   = '';
  document.getElementById('r_date').value  = '';
  document.getElementById('r_duree').value = '';
  document.getElementById('r_desc').value  = '';
  renderReserveForm();
}

// ── DÉPÔT ─────────────────────────────────────────
function submitDepot() {
  const nom    = document.getElementById('d_nom').value.trim();
  const cap    = document.getElementById('d_capteur').value;
  if (!nom || !cap) {
    showAlert('depAlert', '⚠️ Le nom et le type de capteur sont obligatoires.', 'error'); return;
  }
  const deps = getDepots();
  deps.push({
    id: Date.now(), userId: currentUser.id, userNom: currentUser.nom,
    nom, type_cap: cap,
    modele:       document.getElementById('d_modele').value.trim(),
    prix:         document.getElementById('d_prix').value,
    autonomie:    document.getElementById('d_autonomie').value,
    localisation: document.getElementById('d_localisation').value.trim(),
    desc:         document.getElementById('d_desc').value.trim(),
    status: 'attente', dateSoumission: todayStr()
  });
  saveDepots(deps);
  showAlert('depAlert', '✅ Drone soumis ! L\'administrateur va examiner votre demande.', 'success');
  ['d_nom','d_modele','d_prix','d_autonomie','d_localisation','d_desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('d_capteur').value = '';
}

// ── MES DEMANDES ──────────────────────────────────
function renderMesDemandes() {
  const drones = getDrones();
  const mesRes = getReservations().filter(r => r.userId === currentUser.id).reverse();
  const mesDep = getDepots().filter(d => d.userId === currentUser.id).reverse();

  const resList = document.getElementById('myResList');
  resList.innerHTML = mesRes.length === 0 ? emptyState('Aucune réservation') :
    mesRes.map(r => {
      const drone = drones.find(d => d.id === r.droneId);
      return `<div class="request-row">
        <div class="req-info">
          <div class="req-title">📅 ${r.nomMission}</div>
          <div class="req-meta">
            <span>Drone : <strong>${drone ? drone.nom : '#'+r.droneId}</strong></span>
            <span>Date : <strong>${r.date}</strong></span>
            <span>Durée : <strong>${r.duree}h</strong></span>
            <span>Soumis le : <strong>${r.dateSoumission}</strong></span>
          </div>
          ${r.desc ? `<p class="req-desc">${r.desc}</p>` : ''}
        </div>
        ${statusBadge(r.status)}
      </div>`;
    }).join('');

  const depList = document.getElementById('myDepList');
  depList.innerHTML = mesDep.length === 0 ? emptyState('Aucun dépôt') :
    mesDep.map(d => `
      <div class="request-row">
        <div class="req-info">
          <div class="req-title">${droneEmoji(d.type_cap)} ${d.nom}</div>
          <div class="req-meta">
            <span>Capteur : <strong>${d.type_cap}</strong></span>
            ${d.modele ? `<span>Modèle : <strong>${d.modele}</strong></span>` : ''}
            ${d.prix ? `<span>Prix : <strong>${Number(d.prix).toLocaleString()} FCFA/h</strong></span>` : ''}
            <span>Soumis le : <strong>${d.dateSoumission}</strong></span>
          </div>
        </div>
        ${statusBadge(d.status)}
      </div>`).join('');
}
