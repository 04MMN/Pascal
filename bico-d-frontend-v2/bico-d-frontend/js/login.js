// login.js

document.getElementById('email').addEventListener('input', previewRole);
document.getElementById('password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('email').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('password').focus(); });

function previewRole() {
  const email = document.getElementById('email').value.trim();
  const user  = USERS.find(u => u.email === email);
  const ind   = document.getElementById('roleIndicator');
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

function fillDemo(type) {
  document.getElementById('email').value    = type === 'admin' ? 'admin@bicod.sn' : 'user@bicod.sn';
  document.getElementById('password').value = type === 'admin' ? 'admin' : '1234';
  previewRole();
}

function doLogin() {
  const email = document.getElementById('email').value.trim();
  const pwd   = document.getElementById('password').value;
  const alertEl = document.getElementById('alertBox');

  const user = USERS.find(u => u.email === email && u.password === pwd);
  if (!user) {
    alertEl.textContent = 'Email ou mot de passe incorrect.';
    alertEl.style.display = 'block';
    return;
  }
  alertEl.style.display = 'none';
  localStorage.setItem('bd_current_user', JSON.stringify(user));
  window.location.href = user.role === 'admin' ? 'admin.html' : 'user.html';
}
