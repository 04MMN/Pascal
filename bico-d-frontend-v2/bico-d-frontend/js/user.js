// user.js — Espace utilisateur (connecté à l'API)

const currentUser = requireRole('user');
if (currentUser) {
  document.getElementById('userAvatar').textContent  = currentUser.nom.charAt(0).toUpperCase();
  document.getElementById('userName').textContent    = currentUser.nom;
  document.getElementById('dashWelcome').textContent = currentUser.nom;
  showSection('dashboard');
}

let droneFilter = 'tous';

function renderSection(id) {
  switch(id) {
    case 'dashboard':   renderDashboard();   break;
    case 'drones':      renderDrones();      break;
    case 'reserver':    renderReserveForm(); break;
    case 'mesDemandes': renderMesDemandes(); break;
  }
}

// ── DASHBOARD ────────────────────────────────────
async function renderDashboard() {
  try {
    const [dronesData, resData, depData] = await Promise.all([
      apiGet('get_drones'),
      apiGet('get_reservations', { user_id: currentUser.id }),
      apiGet('get_depots',       { user_id: currentUser.id }),
    ]);

    const drones  = dronesData.drones  || [];
    const res     = resData.reservations || [];
    const deps    = depData.depots       || [];
    const libres  = drones.filter(d => d.status === 'libre');

    document.getElementById('statLibres').textContent = libres.length;
    document.getElementById('statMesRes').textContent = res.length;
    document.getElementById('statMesDep').textContent = deps.length;

    // Drones libres
    const dl = document.getElementById('dashDronesList');
    dl.innerHTML = libres.length === 0 ? emptyState('Aucun drone disponible') :
      libres.slice(0, 5).map(d => `
        <div class="mini-row">
          <span>${droneEmoji(d.type_cap)} <strong>${d.nom}</strong></span>
          <span class="status-badge badge-green">Libre</span>
        </div>`).join('');

    // Activité
    const items = [
      ...res.slice(0, 3).map(r => ({ txt: `📅 ${r.nom_mission} — ${r.drone_nom || '?'}`, status: r.status, date: r.created_at?.split(' ')[0] })),
      ...deps.slice(0, 2).map(d => ({ txt: `📤 Dépôt "${d.nom}"`, status: d.status, date: d.created_at?.split(' ')[0] })),
    ];
    const act = document.getElementById('dashActivity');
    act.innerHTML = items.length === 0 ? emptyState('Aucune activité récente') :
      items.map(i => `
        <div class="mini-row">
          <div>
            <div style="font-size:.86rem;color:var(--text)">${i.txt}</div>
            <div style="font-size:.75rem;color:var(--text3)">${i.date || ''}</div>
          </div>
          ${statusBadge(i.status)}
        </div>`).join('');

  } catch(e) {
    console.error('Dashboard error:', e);
  }
}

// ── DRONES ────────────────────────────────────────
async function renderDrones() {
  const grid = document.getElementById('dronesGrid');
  grid.innerHTML = '<div class="empty-state">⏳ Chargement...</div>';
  try {
    const params = droneFilter !== 'tous' ? { status: droneFilter } : {};
    const data   = await apiGet('get_drones', params);
    const list   = data.drones || [];
    if (list.length === 0) { grid.innerHTML = emptyState('Aucun drone dans cette catégorie'); return; }
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
  } catch(e) { grid.innerHTML = emptyState('Erreur de chargement'); }
}

function filterDrones(f, btn) {
  droneFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderDrones();
}

// ── RÉSERVATION ───────────────────────────────────
async function renderReserveForm() {
  const sel = document.getElementById('r_drone');
  sel.innerHTML = '<option value="">Chargement...</option>';
  try {
    const data   = await apiGet('get_drones', { status: 'libre' });
    const libres = data.drones || [];
    sel.innerHTML = '<option value="">-- Sélectionner un drone libre --</option>' +
      libres.map(d => `<option value="${d.id}">${d.nom} (${d.type_cap}) — ${d.localisation}</option>`).join('');
  } catch(e) {
    sel.innerHTML = '<option value="">Erreur de chargement</option>';
  }
  document.getElementById('r_date').min = new Date().toISOString().split('T')[0];
}

async function submitReservation() {
  const droneId = parseInt(document.getElementById('r_drone').value);
  const nom     = document.getElementById('r_nom').value.trim();
  const date    = document.getElementById('r_date').value;
  const duree   = document.getElementById('r_duree').value || null;
  const desc    = document.getElementById('r_desc').value.trim();

  if (!droneId || !nom || !date) {
    showAlert('resAlert', '⚠️ Veuillez remplir tous les champs obligatoires.', 'error'); return;
  }

  try {
    await apiPost('create_reservation', {
      user_id: currentUser.id, drone_id: droneId,
      nom_mission: nom, date_mission: date, duree, description: desc,
    });
    showAlert('resAlert', '✅ Demande envoyée ! En attente de validation par l\'administrateur.', 'success');
    document.getElementById('r_drone').value = '';
    document.getElementById('r_nom').value   = '';
    document.getElementById('r_date').value  = '';
    document.getElementById('r_duree').value = '';
    document.getElementById('r_desc').value  = '';
    renderReserveForm();
  } catch(e) {
    showAlert('resAlert', '❌ ' + (e.message || 'Erreur lors de l\'envoi.'), 'error');
  }
}

// ── DÉPÔT ─────────────────────────────────────────
async function submitDepot() {
  const nom = document.getElementById('d_nom').value.trim();
  const cap = document.getElementById('d_capteur').value;
  if (!nom || !cap) {
    showAlert('depAlert', '⚠️ Le nom et le type de capteur sont obligatoires.', 'error'); return;
  }
  try {
    await apiPost('create_depot', {
      user_id:      currentUser.id,
      nom,
      type_cap:     cap,
      modele:       document.getElementById('d_modele').value.trim(),
      prix:         document.getElementById('d_prix').value,
      autonomie:    document.getElementById('d_autonomie').value,
      localisation: document.getElementById('d_localisation').value.trim(),
      description:  document.getElementById('d_desc').value.trim(),
    });
    showAlert('depAlert', '✅ Drone soumis ! L\'administrateur va examiner votre demande.', 'success');
    ['d_nom','d_modele','d_prix','d_autonomie','d_localisation','d_desc'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('d_capteur').value = '';
  } catch(e) {
    showAlert('depAlert', '❌ ' + (e.message || 'Erreur lors de l\'envoi.'), 'error');
  }
}

// ── MES DEMANDES ──────────────────────────────────
async function renderMesDemandes() {
  try {
    const [resData, depData] = await Promise.all([
      apiGet('get_reservations', { user_id: currentUser.id }),
      apiGet('get_depots',       { user_id: currentUser.id }),
    ]);

    const mesRes = resData.reservations || [];
    const mesDep = depData.depots       || [];

    document.getElementById('myResList').innerHTML = mesRes.length === 0 ? emptyState('Aucune réservation') :
      mesRes.map(r => `
        <div class="request-row">
          <div class="req-info">
            <div class="req-title">📅 ${r.nom_mission}</div>
            <div class="req-meta">
              <span>Drone : <strong>${r.drone_nom || '#'+r.drone_id}</strong></span>
              <span>Date : <strong>${r.date_mission}</strong></span>
              <span>Durée : <strong>${r.duree ? r.duree+'h' : 'N/A'}</strong></span>
              <span>Soumis : <strong>${r.created_at?.split(' ')[0]}</strong></span>
            </div>
            ${r.description ? `<p class="req-desc">${r.description}</p>` : ''}
          </div>
          ${statusBadge(r.status)}
        </div>`).join('');

    document.getElementById('myDepList').innerHTML = mesDep.length === 0 ? emptyState('Aucun dépôt') :
      mesDep.map(d => `
        <div class="request-row">
          <div class="req-info">
            <div class="req-title">${droneEmoji(d.type_cap)} ${d.nom}</div>
            <div class="req-meta">
              <span>Capteur : <strong>${d.type_cap}</strong></span>
              ${d.modele ? `<span>Modèle : <strong>${d.modele}</strong></span>` : ''}
              ${d.prix ? `<span>Prix : <strong>${Number(d.prix).toLocaleString()} FCFA/h</strong></span>` : ''}
              <span>Soumis : <strong>${d.created_at?.split(' ')[0]}</strong></span>
            </div>
          </div>
          ${statusBadge(d.status)}
        </div>`).join('');
  } catch(e) {
    console.error('Mes demandes error:', e);
  }
}
