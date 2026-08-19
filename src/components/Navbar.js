/**
 * Componente Navbar y Encabezado Principal
 */

import { store } from '../state/store.js';
import { PRODUCTS } from '../data/products.js';

export function renderNavbar(container) {
  const state = store.state;
  const metrics = store.getCartMetrics();
  const wishlistCount = state.wishlist.length;
  const user = state.user;

  container.innerHTML = `
    <div class="container navbar">
      <!-- Logo de la Marca -->
      <a href="#home" class="brand-logo" id="nav-brand-logo">
        AURA <span>STUDIO</span>
      </a>

      <!-- Enlaces Principales -->
      <nav class="nav-links" aria-label="Navegación principal">
        <a href="#home" class="nav-link ${state.currentRoute === 'home' ? 'active' : ''}" data-route="home">Inicio</a>
        <a href="#catalog" class="nav-link ${state.currentRoute === 'catalog' ? 'active' : ''}" data-route="catalog">Catálogo 2026</a>
        <a href="#abrigos" class="nav-link" data-category="abrigos">Abrigos</a>
        <a href="#vestidos" class="nav-link" data-category="vestidos">Vestidos</a>
        <a href="#camisas" class="nav-link" data-category="camisas">Lino & Seda</a>
      </nav>

      <!-- Acciones de Usuario (Autenticación, Tema, Wishlist, Carrito) -->
      <div class="nav-actions">
        <!-- Toggle Dark/Light Mode -->
        <button class="btn-icon" id="theme-toggle-btn" title="Alternar Modo Oscuro / Claro" aria-label="Cambiar tema">
          <i data-lucide="${state.theme === 'dark' ? 'sun' : 'moon'}"></i>
        </button>

        <!-- Wishlist / Favoritos -->
        <button class="btn-icon" id="wishlist-nav-btn" title="Lista de Deseos" aria-label="Ver favoritos" style="position: relative;">
          <i data-lucide="heart" ${wishlistCount > 0 ? 'style="color: #ef4444; fill: #ef4444;"' : ''}></i>
          ${wishlistCount > 0 ? `<span class="cart-btn-badge" style="background-color: #ef4444;">${wishlistCount}</span>` : ''}
        </button>

        <!-- Botón de Carrito Deslizable -->
        <button class="btn-icon" id="drawer-cart-toggle-btn" title="Abrir Carrito de Compras" aria-label="Ver carrito" style="position: relative;">
          <i data-lucide="shopping-bag"></i>
          <span class="cart-btn-badge ${metrics.itemCount > 0 ? 'bump' : ''}" id="cart-counter-badge">
            ${metrics.itemCount}
          </span>
        </button>

        <!-- Módulo de Autenticación / Perfil de Usuario -->
        <div class="nav-user-container" style="position: relative;">
          ${user ? `
            <button class="user-profile-btn" id="nav-user-profile-btn" title="Cuenta de ${user.name}" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.75rem 0.35rem 0.4rem; border: 1px solid var(--border-strong); border-radius: var(--radius-full); background: var(--bg-surface); cursor: pointer; transition: all var(--transition-fast);">
              <img src="${user.avatar}" alt="${user.name}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
              <span style="font-size: 0.85rem; font-weight: 700; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name}</span>
              <i data-lucide="chevron-down" style="width: 14px; height: 14px; color: var(--text-muted);"></i>
            </button>

            <!-- Menú Desplegable de Usuario -->
            <div class="user-dropdown-menu hidden" id="nav-user-dropdown" style="position: absolute; top: calc(100% + 8px); right: 0; width: 220px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 100; padding: 0.5rem 0; animation: fadeIn 0.2s ease;">
              <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-subtle);">
                <strong style="display: block; font-size: 0.88rem;">${user.name}</strong>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${user.email}</span>
              </div>
              <button class="user-menu-item" id="user-menu-orders" style="width: 100%; display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; font-size: 0.85rem; text-align: left; background: none; border: none; cursor: pointer; color: var(--text-secondary); transition: background var(--transition-fast);">
                <i data-lucide="package" style="width: 16px; height: 16px;"></i> Mis Pedidos
              </button>
              <button class="user-menu-item" id="user-menu-wishlist" style="width: 100%; display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; font-size: 0.85rem; text-align: left; background: none; border: none; cursor: pointer; color: var(--text-secondary); transition: background var(--transition-fast);">
                <i data-lucide="heart" style="width: 16px; height: 16px;"></i> Lista de Deseos
              </button>
              ${user.isAdmin ? `<button class="user-menu-item" id="user-menu-admin" style="width: 100%; display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; font-size: 0.85rem; text-align: left; background: none; border: none; cursor: pointer; color: var(--text-secondary); transition: background var(--transition-fast);"><i data-lucide="layout-dashboard" style="width: 16px; height: 16px;"></i> Panel de administración</button>` : ''}
              <div style="height: 1px; background: var(--border-subtle); margin: 0.3rem 0;"></div>
              <button class="user-menu-item" id="user-menu-logout" style="width: 100%; display: flex; align-items: center; gap: 0.6rem; padding: 0.65rem 1rem; font-size: 0.85rem; text-align: left; background: none; border: none; cursor: pointer; color: #ef4444; transition: background var(--transition-fast);">
                <i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Cerrar Sesión
              </button>
            </div>
          ` : `
            <button class="btn btn-primary" id="nav-login-btn" style="padding: 0.5rem 1.1rem; font-size: 0.85rem; gap: 0.4rem;">
              <i data-lucide="user" style="width: 16px; height: 16px;"></i> Iniciar Sesión
            </button>
          `}
        </div>
      </div>
    </div>
  `;

  // Inicializar iconos de Lucide
  if (window.lucide) window.lucide.createIcons();

  // Event Listeners
  attachNavbarListeners(container);
}

function attachNavbarListeners(container) {
  // Logo & Links
  container.querySelectorAll('[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      store.setRoute(route);
    });
  });

  container.querySelectorAll('[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-category');
      store.state.activeCategory = cat;
      store.setRoute('catalog');
    });
  });

  const brandLogo = container.querySelector('#nav-brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      store.setRoute('home');
    });
  }

  // Theme Switcher
  const themeBtn = container.querySelector('#theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      store.toggleTheme();
      renderNavbar(container);
    });
  }

  // Drawer Cart Button
  const cartBtn = container.querySelector('#drawer-cart-toggle-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      store.openDrawer();
    });
  }

  // Wishlist Button
  const wishlistBtn = container.querySelector('#wishlist-nav-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      store.setRoute('catalog');
    });
  }

  // Auth: Login Button Trigger
  const loginBtn = container.querySelector('#nav-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      store.openAuth('login');
    });
  }

  // Auth: User Dropdown Toggle
  const userProfileBtn = container.querySelector('#nav-user-profile-btn');
  const userDropdown = container.querySelector('#nav-user-dropdown');

  if (userProfileBtn && userDropdown) {
    userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target) && e.target !== userProfileBtn) {
        userDropdown.classList.add('hidden');
      }
    });

    // Menu options
    container.querySelector('#user-menu-orders')?.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
      store.openOrderTracker();
    });

    container.querySelector('#user-menu-wishlist')?.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
      store.setRoute('catalog');
    });

    container.querySelector('#user-menu-admin')?.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
      store.setRoute('admin');
    });

    container.querySelector('#user-menu-logout')?.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
      store.logout();
    });
  }
}
