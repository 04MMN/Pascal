// ═══════════════════════════════════════════════
//  data.js — Données partagées + utilitaires
// ═══════════════════════════════════════════════

const USERS = [
  { id: 1, email: 'user@bicod.sn',  password: '1234',  nom: 'Moussa Diallo', role: 'user' },
  { id: 2, email: 'admin@bicod.sn', password: 'admin', nom: 'Aminata Faye',  role: 'admin' },
  { id: 3, email: 'jean@bicod.sn',  password: '1234',  nom: 'Jean Dupont',   role: 'user' },
];

const DRONES_INIT = [
  { id: 1, nom: 'Agro-Pro X1',    type_cap: 'Multispectral', status: 'libre',       modele: 'DJI Agras T30',    prix: 12000, autonomie: 45, localisation: 'Thiès',       desc: 'Drone de précision pour analyse végétale' },
  { id: 2, nom: 'SkyField-3',     type_cap: 'RGB',           status: 'mission',     modele: 'Parrot Bluegrass', prix: 8000,  autonomie: 35, localisation: 'Dakar',       desc: 'Idéal pour cartographie et surveillance' },
  { id: 3, nom: 'ThermoScan Pro', type_cap: 'Thermique',     status: 'libre',       modele: 'Yuneec H520T',     prix: 18000, autonomie: 50, localisation: 'Saint-Louis', desc: 'Détection de stress hydrique' },
  { id: 4, nom: 'LiDAR Mapper',   type_cap: 'LiDAR',         status: 'maintenance', modele: 'DJI Matrice 300',  prix: 25000, autonomie: 55, localisation: 'Kaolack',     desc: 'Cartographie 3D haute précision' },
  { id: 5, nom: 'SprayBot Alpha', type_cap: 'Pulvérisation', status: 'libre',       modele: 'XAG P100',         prix: 20000, autonomie: 40, localisation: 'Ziguinchor',  desc: 'Pulvérisation de précision 10L/min' },
];

// ── Init localStorage ────────────────────────────
function initStorage() {
  if (!localStorage.getItem('bd_drones'))       localStorage.setItem('bd_drones',       JSON.stringify(DRONES_INIT));
  if (!localStorage.getItem('bd_reservations')) localStorage.setItem('bd_reservations', JSON.stringify([]));
  if (!localStorage.getItem('bd_depots'))        localStorage.setItem('bd_depots',        JSON.stringify([]));
}

// ── CRUD helpers ─────────────────────────────────
function getDrones()       { return JSON.parse(localStorage.getItem('bd_drones')       || '[]'); }
function getReservations() { return JSON.parse(localStorage.getItem('bd_reservations') || '[]'); }
function getDepots()       { return JSON.parse(localStorage.getItem('bd_depots')       || '[]'); }
function saveDrones(d)     { localStorage.setItem('bd_drones',       JSON.stringify(d)); }
function saveReservations(r){ localStorage.setItem('bd_reservations', JSON.stringify(r)); }
function saveDepots(d)     { localStorage.setItem('bd_depots',        JSON.stringify(d)); }

function getCurrentUser() {
  const u = localStorage.getItem('bd_current_user');
  return u ? JSON.parse(u) : null;
}

// ── Auth guard ────────────────────────────────────
function requireRole(role) {
  const user = getCurrentUser();
  if (!user) { window.location.href = 'index.html'; return null; }
  if (user.role !== role) { window.location.href = user.role === 'admin' ? 'admin.html' : 'user.html'; return null; }
  return user;
}

function logout() {
  localStorage.removeItem('bd_current_user');
  window.location.href = 'index.html';
}

// ── Helpers UI ────────────────────────────────────
function droneEmoji(type) {
  return { 'RGB':'📷', 'Multispectral':'🌿', 'Thermique':'🌡️', 'LiDAR':'📡', 'Pulvérisation':'💧' }[type] || '🚁';
}

function statusLabel(s) {
  return { 'libre':'Libre', 'mission':'En mission', 'maintenance':'Maintenance',
           'attente':'En attente', 'approuve':'Approuvé', 'rejete':'Rejeté' }[s] || s;
}

function statusBadge(s) {
  const cls = { 'libre':'badge-green', 'mission':'badge-orange', 'maintenance':'badge-blue',
                'attente':'badge-purple', 'approuve':'badge-green', 'rejete':'badge-red' }[s] || 'badge-purple';
  return `<span class="status-badge ${cls}">${statusLabel(s)}</span>`;
}

function emptyState(msg) {
  return `<div class="empty-state"><div style="font-size:2rem;margin-bottom:8px">📭</div><p>${msg}</p></div>`;
}

function showAlert(elId, msg, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.className = `form-alert alert-${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function todayStr() {
  return new Date().toLocaleDateString('fr-FR');
}

// ── Navigation ────────────────────────────────────
const TITLES = {
  dashboard: 'Vue d\'ensemble', drones: 'Drones disponibles',
  reserver: 'Réserver un drone', deposer: 'Déposer un drone',
  mesDemandes: 'Mes demandes', tousLesDrones: 'Tous les drones',
  reservations: 'Demandes de réservation', depots: 'Dépôts de drones',
};

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector(`[data-s="${id}"]`)?.classList.add('active');
  document.getElementById('topbarTitle').textContent = TITLES[id] || id;
  document.getElementById('sidebar').classList.remove('open');
  renderSection(id);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function switchTab(id, btn) {
  const parent = btn.closest('.section');
  parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}

// Initialisé au chargement
initStorage();
