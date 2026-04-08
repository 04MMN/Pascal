// admin.js — Espace administrateur

const currentUser = requireRole('admin');
if (currentUser) {
  document.getElementById('userAvatar').textContent  = currentUser.nom.charAt(0).toUpperCase();
  document.getElementById('userName').textContent    = currentUser.nom;
  document.getElementById('dashWelcome').textContent = currentUser.nom;
  showSection('dashboard');
}

let adminDroneFilter = 'tous';

function renderSection(id) {
  switch(id) {
    case 'dashboard':     renderAdminDashboard(); break;
    case 'tousLesDrones': renderAdminDrones();    break;
    case 'reservations':  renderAdminRes();       break;
    case 'depots':        renderAdminDep();       break;
  }
}

// ── Mise à jour badges nav ──────────────────────
function updateNavBadges() {
  const pRes = getReservations().filter(r => r.status === 'attente').length;
  const pDep = getDepots().filter(d => d.status === 'attente').length;
  const elR = document.getElementById('navBadgeRes');
  const elD = document.getElementById('navBadgeDep');
  elR.textContent = pRes > 0 ? pRes : '';
  elD.textContent = pDep > 0 ? pDep : '';
}

// ── DASHBOARD ADMIN ──────────────────────────────
function renderAdminDashboard() {
  const drones = getDrones();
  const res    = getReservations();
  const deps   = getDepots();
  const pendingAll = res.filter(r => r.status === 'attente').length + deps.filter(d => d.status === 'attente').length;

  document.getElementById('sLibres').textContent  = drones.filter(d => d.status === 'libre').length;
  document.getElementById('sMission').textContent = drones.filter(d => d.status === 'mission').length;
  document.getElementById('sMaint').textContent   = drones.filter(d => d.status === 'maintenance').length;
  document.getElementById('sPending').textContent = pendingAll;
  updateNavBadges();

  // Réservations en attente (mini)
  const pendRes = res.filter(r => r.status === 'attente');
  const elPR = document.getElementById('dashPendingRes');
  elPR.innerHTML = pendRes.length === 0 ? emptyState('Aucune réservation en attente') :
    pendRes.slice(0, 4).map(r => {
      const drone = drones.find(d => d.id === r.droneId);
      return `<div class="mini-row">
        <div>
          <div style="font-size:.86rem;color:var(--text)"><strong>${r.userNom}</strong> — ${r.nomMission}</div>
          <div style="font-size:.75rem;color:var(--text3)">${drone ? drone.nom : '?'} · ${r.date}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-mini btn-ok"  onclick="validateRes(${r.id},'approuve')">✓</button>
          <button class="btn-mini btn-ko"  onclick="validateRes(${r.id},'rejete')">✗</button>
        </div>
      </div>`;
    }).join('');

  // Dépôts en attente (mini)
  const pendDep = deps.filter(d => d.status === 'attente');
  const elPD = document.getElementById('dashPendingDep');
  elPD.innerHTML = pendDep.length === 0 ? emptyState('Aucun dépôt en attente') :
    pendDep.slice(0, 4).map(d => `
      <div class="mini-row">
        <div>
          <div style="font-size:.86rem;color:var(--text)">${droneEmoji(d.type_cap)} <strong>${d.nom}</strong></div>
          <div style="font-size:.75rem;color:var(--text3)">${d.userNom} · ${d.type_cap}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-mini btn-ok" onclick="validateDep(${d.id},'approuve')">✓</button>
          <button class="btn-mini btn-ko" onclick="validateDep(${d.id},'rejete')">✗</button>
        </div>
      </div>`).join('');
}

// ── TOUS LES DRONES ──────────────────────────────
function renderAdminDrones() {
  let list = getDrones();
  if (adminDroneFilter !== 'tous') list = list.filter(d => d.status === adminDroneFilter);
  const grid = document.getElementById('adminDronesGrid');
  if (list.length === 0) { grid.innerHTML = emptyState('Aucun drone'); return; }
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
      </div>
      <div style="margin-top:12px">
        <select class="status-select" onchange="changeDroneStatus(${d.id}, this.value)">
          <option value="">Changer le statut</option>
          <option value="libre"       ${d.status==='libre'       ?'selected':''}>Libre</option>
          <option value="mission"     ${d.status==='mission'     ?'selected':''}>En mission</option>
          <option value="maintenance" ${d.status==='maintenance' ?'selected':''}>Maintenance</option>
        </select>
      </div>
    </div>`).join('');
}

function filterAdminDrones(f, btn) {
  adminDroneFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAdminDrones();
}

function changeDroneStatus(id, newStatus) {
  if (!newStatus) return;
  const drones = getDrones();
  const d = drones.find(d => d.id === id);
  if (d) { d.status = newStatus; saveDrones(drones); renderAdminDrones(); updateNavBadges(); }
}

// ── RÉSERVATIONS ─────────────────────────────────
function renderAdminRes() {
  const drones = getDrones();
  const all  = getReservations().reverse();
  const pend = all.filter(r => r.status === 'attente');
  document.getElementById('cntResAttente').textContent = pend.length > 0 ? pend.length : '';

  document.getElementById('listResAttente').innerHTML = pend.length === 0 ? emptyState('Aucune demande en attente') :
    pend.map(r => resCard(r, drones, true)).join('');

  document.getElementById('listResToutes').innerHTML = all.length === 0 ? emptyState('Aucune réservation') :
    all.map(r => resCard(r, drones, false)).join('');

  updateNavBadges();
}

function resCard(r, drones, withActions) {
  const drone = drones.find(d => d.id === r.droneId);
  return `<div class="request-row">
    <div class="req-info">
      <div class="req-title">📅 ${r.nomMission}</div>
      <div class="req-meta">
        <span>Par : <strong>${r.userNom}</strong></span>
        <span>Drone : <strong>${drone ? drone.nom : '#'+r.droneId}</strong></span>
        <span>Date : <strong>${r.date}</strong></span>
        <span>Durée : <strong>${r.duree}h</strong></span>
        <span>Soumis : <strong>${r.dateSoumission}</strong></span>
      </div>
      ${r.desc ? `<p class="req-desc">${r.desc}</p>` : ''}
    </div>
    <div class="req-actions">
      ${withActions
        ? `<button class="btn btn-ok" onclick="validateRes(${r.id},'approuve')">✓ Valider</button>
           <button class="btn btn-ko" onclick="validateRes(${r.id},'rejete')">✗ Rejeter</button>`
        : statusBadge(r.status)}
    </div>
  </div>`;
}

function validateRes(id, action) {
  const res = getReservations();
  const r   = res.find(r => r.id === id);
  if (!r) return;
  r.status = action;
  if (action === 'approuve') {
    const drones = getDrones();
    const drone  = drones.find(d => d.id === r.droneId);
    if (drone) { drone.status = 'mission'; saveDrones(drones); }
  }
  saveReservations(res);
  renderAdminRes();
  renderAdminDashboard();
}

// ── DÉPÔTS ────────────────────────────────────────
function renderAdminDep() {
  const all  = getDepots().reverse();
  const pend = all.filter(d => d.status === 'attente');
  document.getElementById('cntDepAttente').textContent = pend.length > 0 ? pend.length : '';

  document.getElementById('listDepAttente').innerHTML = pend.length === 0 ? emptyState('Aucun dépôt en attente') :
    pend.map(d => depCard(d, true)).join('');

  document.getElementById('listDepTous').innerHTML = all.length === 0 ? emptyState('Aucun dépôt') :
    all.map(d => depCard(d, false)).join('');

  updateNavBadges();
}

function depCard(d, withActions) {
  return `<div class="request-row">
    <div class="req-info">
      <div class="req-title">${droneEmoji(d.type_cap)} ${d.nom}</div>
      <div class="req-meta">
        <span>Par : <strong>${d.userNom}</strong></span>
        <span>Capteur : <strong>${d.type_cap}</strong></span>
        ${d.modele ? `<span>Modèle : <strong>${d.modele}</strong></span>` : ''}
        ${d.prix ? `<span>Prix : <strong>${Number(d.prix).toLocaleString()} FCFA/h</strong></span>` : ''}
        ${d.localisation ? `<span>📍 <strong>${d.localisation}</strong></span>` : ''}
        <span>Soumis : <strong>${d.dateSoumission}</strong></span>
      </div>
      ${d.desc ? `<p class="req-desc">${d.desc}</p>` : ''}
    </div>
    <div class="req-actions">
      ${withActions
        ? `<button class="btn btn-ok" onclick="validateDep(${d.id},'approuve')">✓ Confirmer</button>
           <button class="btn btn-ko" onclick="validateDep(${d.id},'rejete')">✗ Rejeter</button>`
        : statusBadge(d.status)}
    </div>
  </div>`;
}

function validateDep(id, action) {
  const deps = getDepots();
  const dep  = deps.find(d => d.id === id);
  if (!dep) return;
  dep.status = action;
  if (action === 'approuve') {
    const drones = getDrones();
    drones.push({
      id: Date.now(), nom: dep.nom, type_cap: dep.type_cap,
      modele: dep.modele || '', status: 'libre',
      prix: dep.prix, autonomie: dep.autonomie,
      localisation: dep.localisation, desc: dep.desc, proprio: dep.userId
    });
    saveDrones(drones);
  }
  saveDepots(deps);
  renderAdminDep();
  renderAdminDashboard();
}
