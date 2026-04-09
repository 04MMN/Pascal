// admin.js — Espace administrateur (connecté à l'API)

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

// ── Badges nav ───────────────────────────────────
async function updateNavBadges() {
  try {
    const data = await apiGet('get_stats');
    const s    = data.stats;
    const pRes = s.reservations?.attente || 0;
    const pDep = s.depots?.attente       || 0;
    document.getElementById('navBadgeRes').textContent = pRes > 0 ? pRes : '';
    document.getElementById('navBadgeDep').textContent = pDep > 0 ? pDep : '';
  } catch(e) {}
}

// ── DASHBOARD ADMIN ──────────────────────────────
async function renderAdminDashboard() {
  try {
    const [statsData, resData, depData] = await Promise.all([
      apiGet('get_stats'),
      apiGet('get_reservations', { status: 'attente' }),
      apiGet('get_depots',       { status: 'attente' }),
    ]);

    const s    = statsData.stats;
    const pRes = resData.reservations || [];
    const pDep = depData.depots       || [];

    document.getElementById('sLibres').textContent  = s.drones?.libre       || 0;
    document.getElementById('sMission').textContent = s.drones?.mission      || 0;
    document.getElementById('sMaint').textContent   = s.drones?.maintenance  || 0;
    document.getElementById('sPending').textContent = (s.reservations?.attente || 0) + (s.depots?.attente || 0);

    // Réservations en attente (mini)
    document.getElementById('dashPendingRes').innerHTML = pRes.length === 0 ? emptyState('Aucune réservation en attente') :
      pRes.slice(0, 4).map(r => `
        <div class="mini-row">
          <div>
            <div style="font-size:.86rem;color:var(--text)"><strong>${r.user_nom}</strong> — ${r.nom_mission}</div>
            <div style="font-size:.75rem;color:var(--text3)">${r.drone_nom || '?'} · ${r.date_mission}</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn-mini btn-ok" onclick="validateRes(${r.id},'approuve')">✓</button>
            <button class="btn-mini btn-ko" onclick="validateRes(${r.id},'rejete')">✗</button>
          </div>
        </div>`).join('');

    // Dépôts en attente (mini)
    document.getElementById('dashPendingDep').innerHTML = pDep.length === 0 ? emptyState('Aucun dépôt en attente') :
      pDep.slice(0, 4).map(d => `
        <div class="mini-row">
          <div>
            <div style="font-size:.86rem;color:var(--text)">${droneEmoji(d.type_cap)} <strong>${d.nom}</strong></div>
            <div style="font-size:.75rem;color:var(--text3)">${d.user_nom} · ${d.type_cap}</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn-mini btn-ok" onclick="validateDep(${d.id},'approuve')">✓</button>
            <button class="btn-mini btn-ko" onclick="validateDep(${d.id},'rejete')">✗</button>
          </div>
        </div>`).join('');

    updateNavBadges();
  } catch(e) { console.error('Dashboard error:', e); }
}

// ── TOUS LES DRONES ──────────────────────────────
async function renderAdminDrones() {
  const grid = document.getElementById('adminDronesGrid');
  grid.innerHTML = '<div class="empty-state">⏳ Chargement...</div>';
  try {
    const params = adminDroneFilter !== 'tous' ? { status: adminDroneFilter } : {};
    const data   = await apiGet('get_drones', params);
    const list   = data.drones || [];
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
  } catch(e) { grid.innerHTML = emptyState('Erreur de chargement'); }
}

function filterAdminDrones(f, btn) {
  adminDroneFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAdminDrones();
}

async function changeDroneStatus(id, newStatus) {
  if (!newStatus) return;
  try {
    await apiPost('update_drone_status', { drone_id: id, status: newStatus });
    renderAdminDrones();
    updateNavBadges();
  } catch(e) { alert('Erreur : ' + e.message); }
}

// ── RÉSERVATIONS ─────────────────────────────────
async function renderAdminRes() {
  try {
    const [pendData, allData] = await Promise.all([
      apiGet('get_reservations', { status: 'attente' }),
      apiGet('get_reservations'),
    ]);
    const pend = pendData.reservations || [];
    const all  = allData.reservations  || [];

    document.getElementById('cntResAttente').textContent = pend.length > 0 ? pend.length : '';
    document.getElementById('listResAttente').innerHTML  = pend.length === 0 ? emptyState('Aucune demande en attente') : pend.map(r => resCard(r, true)).join('');
    document.getElementById('listResToutes').innerHTML   = all.length  === 0 ? emptyState('Aucune réservation')        : all.map(r => resCard(r, false)).join('');
    updateNavBadges();
  } catch(e) { console.error(e); }
}

function resCard(r, withActions) {
  return `<div class="request-row">
    <div class="req-info">
      <div class="req-title">📅 ${r.nom_mission}</div>
      <div class="req-meta">
        <span>Par : <strong>${r.user_nom}</strong></span>
        <span>Drone : <strong>${r.drone_nom || '#'+r.drone_id}</strong></span>
        <span>Date : <strong>${r.date_mission}</strong></span>
        <span>Durée : <strong>${r.duree ? r.duree+'h' : 'N/A'}</strong></span>
        <span>Soumis : <strong>${r.created_at?.split(' ')[0]}</strong></span>
      </div>
      ${r.description ? `<p class="req-desc">${r.description}</p>` : ''}
    </div>
    <div class="req-actions">
      ${withActions
        ? `<button class="btn btn-ok" onclick="validateRes(${r.id},'approuve')">✓ Valider</button>
           <button class="btn btn-ko" onclick="validateRes(${r.id},'rejete')">✗ Rejeter</button>`
        : statusBadge(r.status)}
    </div>
  </div>`;
}

async function validateRes(id, action) {
  try {
    await apiPost('valider_reservation', { reservation_id: id, action });
    renderAdminRes();
    renderAdminDashboard();
  } catch(e) { alert('Erreur : ' + e.message); }
}

// ── DÉPÔTS ────────────────────────────────────────
async function renderAdminDep() {
  try {
    const [pendData, allData] = await Promise.all([
      apiGet('get_depots', { status: 'attente' }),
      apiGet('get_depots'),
    ]);
    const pend = pendData.depots || [];
    const all  = allData.depots  || [];

    document.getElementById('cntDepAttente').textContent = pend.length > 0 ? pend.length : '';
    document.getElementById('listDepAttente').innerHTML  = pend.length === 0 ? emptyState('Aucun dépôt en attente') : pend.map(d => depCard(d, true)).join('');
    document.getElementById('listDepTous').innerHTML     = all.length  === 0 ? emptyState('Aucun dépôt')            : all.map(d => depCard(d, false)).join('');
    updateNavBadges();
  } catch(e) { console.error(e); }
}

function depCard(d, withActions) {
  return `<div class="request-row">
    <div class="req-info">
      <div class="req-title">${droneEmoji(d.type_cap)} ${d.nom}</div>
      <div class="req-meta">
        <span>Par : <strong>${d.user_nom}</strong></span>
        <span>Capteur : <strong>${d.type_cap}</strong></span>
        ${d.modele ? `<span>Modèle : <strong>${d.modele}</strong></span>` : ''}
        ${d.prix ? `<span>Prix : <strong>${Number(d.prix).toLocaleString()} FCFA/h</strong></span>` : ''}
        ${d.localisation ? `<span>📍 <strong>${d.localisation}</strong></span>` : ''}
        <span>Soumis : <strong>${d.created_at?.split(' ')[0]}</strong></span>
      </div>
      ${d.description ? `<p class="req-desc">${d.description}</p>` : ''}
    </div>
    <div class="req-actions">
      ${withActions
        ? `<button class="btn btn-ok" onclick="validateDep(${d.id},'approuve')">✓ Confirmer</button>
           <button class="btn btn-ko" onclick="validateDep(${d.id},'rejete')">✗ Rejeter</button>`
        : statusBadge(d.status)}
    </div>
  </div>`;
}

async function validateDep(id, action) {
  try {
    await apiPost('valider_depot', { depot_id: id, action });
    renderAdminDep();
    renderAdminDashboard();
  } catch(e) { alert('Erreur : ' + e.message); }
}
