import './styles/variables.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';
import { createIcons, icons } from 'lucide';
import { store } from './state/store.js';
import { renderAdminPanel } from './components/AdminPanel.js';

window.lucide = {
  createIcons: (options = {}) => createIcons({ icons, ...options })
};

document.documentElement.setAttribute('data-theme', store.state.theme);
const main = document.getElementById('admin-app-main');

if (!store.state.user?.isAdmin) {
  main.innerHTML = `
    <section class="admin-locked">
      <i data-lucide="shield-alert"></i>
      <h1>Sesión de administrador requerida</h1>
      <p>Esta área está separada de la tienda y solo está disponible para administradores.</p>
      <button class="btn btn-primary" id="admin-return-login">Ir al inicio de sesión</button>
    </section>`;
  document.getElementById('admin-return-login').addEventListener('click', () => {
    window.location.assign('/?admin=1');
  });
} else {
  renderAdminPanel(main);
}

document.getElementById('admin-logout-btn').addEventListener('click', () => {
  store.logout();
  window.location.assign('/');
});

window.lucide.createIcons();
