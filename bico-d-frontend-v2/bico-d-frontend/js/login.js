// login.js

// Variable pour suivre l'état (Connexion ou Inscription)
let isRegisterMode = false;

// Comptes de démonstration pour l'indicateur visuel
const USERS = [
  { email: 'admin@bicod.sn', role: 'admin' },
  { email: 'user@bicod.sn', role: 'user' }
];

// Écouteurs d'événements
document.getElementById('email').addEventListener('input', previewRole);
document.getElementById('password').addEventListener('keydown', e => { if (e.key === 'Enter') handleAuth(); });

// 1. Basculer entre Connexion et Inscription
function toggleAuth(register) {
  isRegisterMode = register;
  const regFields = document.getElementById('registerFields');
  const authTitle = document.getElementById('authTitle');
  const authBtn = document.getElementById('authBtn');
  const toggleText = document.getElementById('toggleText');
  const demoSection = document.getElementById('demoSection');
  const alertBox = document.getElementById('alertBox');

  alertBox.style.display = 'none'; // Cacher les erreurs lors du switch

  if (register) {
    regFields.style.display = 'block';
    authTitle.textContent = 'Créer un compte';
    authBtn.textContent = 'S\'inscrire';
    toggleText.innerHTML = 'Déjà un compte ? <a href="javascript:void(0)" onclick="toggleAuth(false)">Se connecter</a>';
    demoSection.style.display = 'none'; // Cacher les démos en mode inscription
  } else {
    regFields.style.display = 'none';
    authTitle.textContent = 'Connexion à votre espace';
    authBtn.textContent = 'Se connecter';
    toggleText.innerHTML = 'Pas de compte ? <a href="javascript:void(0)" onclick="toggleAuth(true)">Créer un compte</a>';
    demoSection.style.display = 'block';
  }
}

// 2. Prévisualisation visuelle du rôle (uniquement pour les emails connus)
function previewRole() {
  if (isRegisterMode) return; // Désactiver en mode inscription
  const email = document.getElementById('email').value.trim().toLowerCase();
  const user = USERS.find(u => u.email === email);
  const ind = document.getElementById('roleIndicator');
  
  if (user) {
    ind.className = `role-indicator show ${user.role}`;
    ind.innerHTML = user.role === 'admin' 
      ? '🛡️ Redirection vers l\'espace <strong>Administrateur</strong>' 
      : '👤 Redirection vers l\'espace <strong>Utilisateur</strong>';
  } else {
    ind.className = 'role-indicator';
    ind.innerHTML = '';
  }
}

// 3. Remplissage démo
function fillDemo(type) {
  document.getElementById('email').value = type === 'admin' ? 'admin@bicod.sn' : 'user@bicod.sn';
  document.getElementById('password').value = type === 'admin' ? 'admin' : '1234';
  previewRole();
}

// 4. Fonction principale de gestion (Login ou Register)
async function handleAuth() {
  const email = document.getElementById('email').value.trim();
  const pwd = document.getElementById('password').value;
  const nom = document.getElementById('regNom').value.trim();
  const alertEl = document.getElementById('alertBox');
  const btn = document.getElementById('authBtn');

  if (!email || !pwd || (isRegisterMode && !nom)) {
    alertEl.textContent = 'Veuillez remplir tous les champs.';
    alertEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = isRegisterMode ? 'Création...' : 'Connexion...';

  try {
    if (isRegisterMode) {
      // APPEL INSCRIPTION
      await apiPost('register', { nom, email, password: pwd });
      
      // Succès : on informe l'utilisateur et on bascule sur la connexion
      alertEl.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'; // Vert succès
      alertEl.style.color = '#10b981';
      alertEl.textContent = 'Compte créé avec succès ! Connectez-vous.';
      alertEl.style.display = 'block';
      toggleAuth(false); 
    } else {
      // APPEL CONNEXION
      const data = await apiPost('login', { email, password: pwd });
      sessionStorage.setItem('bd_user', JSON.stringify(data.user));
      
      // Redirection selon le rôle récupéré de la BD
      window.location.href = data.user.role === 'admin' ? 'admin.html' : 'user.html';
    }
  } catch (e) {
    alertEl.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; // Rouge erreur
    alertEl.style.color = '#ef4444';
    alertEl.textContent = e.message || 'Une erreur est survenue.';
    alertEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = isRegisterMode ? 'S\'inscrire' : 'Se connecter';
  }
}