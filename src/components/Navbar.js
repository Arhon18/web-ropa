/**
 * Componente Navbar y Encabezado Principal
 */

import { store } from '../state/store.js';
import { PRODUCTS } from '../data/products.js';

export function renderNavbar(container) {
  const state = store.state;
  const metrics = store.getCartMetrics();
  const wishlistCount = state.wishlist.length;

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

      <!-- Barra de Búsqueda Integrada -->
      <div class="nav-search-wrap" style="position: relative; max-width: 240px; width: 100%; display: none;" id="nav-search-container">
        <input type="search" placeholder="Buscar prendas, lino, abrigos..." class="form-input" id="global-search-input" style="padding: 0.45rem 0.85rem; font-size: 0.82rem; border-radius: var(--radius-full);" />
        <div id="search-results-dropdown" class="search-dropdown hidden" style="position: absolute; top: 110%; left: 0; right: 0; background: var(--bg-surface); border: 1px solid var(--border-strong); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 100; max-height: 300px; overflow-y: auto;"></div>
      </div>

      <!-- Acciones de Usuario (Tema, Wishlist, Carrito) -->
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
}
