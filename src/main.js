/**
 * ============================================================================
 * MAIN APPLICATION BOOTSTRAP & SPA ROUTER (AURA Studio)
 * ============================================================================
 */

// Estilos globales
import './styles/variables.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';

// Lucide Icons
import { createIcons, icons } from 'lucide';
window.lucide = {
  createIcons: (options = {}) => {
    try {
      createIcons({ icons, ...options });
    } catch (e) {
      console.warn('Icon rendering error:', e);
    }
  }
};

// Estado, Datos y Utilidades
import { store } from './state/store.js';
import { PRODUCTS, CATEGORIES, SIZE_CHART } from './data/products.js';
import { updateProductSEO } from './utils/seo.js';
import { formatCurrency } from './utils/formatters.js';

// Componentes
import { renderNavbar } from './components/Navbar.js';
import { renderHeroBanner, attachHeroListeners } from './components/HeroBanner.js';
import { renderProductCard, attachProductCardListeners } from './components/ProductCard.js';
import { renderProductGallery, initGalleryZoom } from './components/ProductGallery.js';
import { renderProductDetails } from './components/ProductDetails.js';
import { renderProductTabs, initProductTabs } from './components/ProductTabs.js';
import { renderStickyBar, initStickyScrollObserver } from './components/StickyAddToCart.js';
import { renderDrawerCart } from './components/DrawerCart.js';
import { renderCheckoutModal } from './components/CheckoutModal.js';
import { ShippingCalculator } from './components/ShippingCalculator.js';
import { renderOrderTrackerModal } from './components/OrderTracker.js';
import { renderReviewsSection, initReviewsListeners } from './components/ReviewsSection.js';
import { SocialProofToasts } from './components/SocialProofToasts.js';
import { ExitIntentPopup } from './components/ExitIntentPopup.js';
import { CookieBanner } from './components/CookieBanner.js';
import { LegalModals } from './components/LegalModals.js';
import { renderAuthModal } from './components/AuthModal.js';
import { renderAdminPanel } from './components/AdminPanel.js';

class App {
  constructor() {
    this.headerEl = document.getElementById('site-header');
    this.mainEl = document.getElementById('app-main');
    this.drawerEl = document.getElementById('drawer-cart');
    this.drawerBackdrop = document.getElementById('drawer-backdrop');
    this.stickyBarEl = document.getElementById('sticky-pdp-bar');
    this.modalContainer = document.getElementById('modal-container');
    this.exitIntentEl = document.getElementById('exit-intent-popup');
    this.socialProofEl = document.getElementById('social-proof-container');
    this.cookieBannerEl = document.getElementById('cookie-banner');
    this.footerEl = document.getElementById('site-footer');

    // PDP State local
    this.pdpSelectedColor = null;
    this.pdpSelectedSize = null;
    this.pdpSelectedMaterial = null;
    this.pdpQuantity = 1;
  }

  init() {
    // Inicializar tema guardado
    document.documentElement.setAttribute('data-theme', store.state.theme);

    // Renderizar Header & Footer
    this.renderHeader();
    this.renderFooter();

    // Inicializar Micro-Interacciones y Cumplimiento Legal
    SocialProofToasts.init(this.socialProofEl);
    CookieBanner.init(this.cookieBannerEl);

    // Suscribirse a cambios en el Estado
    this.setupStoreSubscriptions();

    // Render inicial según ruta
    this.renderView();

    if (new URLSearchParams(window.location.search).has('admin')) {
      store.openAuth('admin');
    }

    // Listeners globales (Tracking en Header)
    document.getElementById('header-track-order-btn')?.addEventListener('click', () => {
      store.openOrderTracker();
    });

    if (window.lucide) window.lucide.createIcons();
  }

  setupStoreSubscriptions() {
    store.subscribe('cart:updated', () => {
      this.renderHeader();
      renderDrawerCart(this.drawerEl);
      if (store.state.isCheckoutOpen) {
        renderCheckoutModal(this.modalContainer);
      }
    });

    store.subscribe('wishlist:updated', () => {
      this.renderHeader();
    });

    store.subscribe('theme:changed', () => {
      this.renderHeader();
    });

    store.subscribe('route:changed', () => {
      this.renderHeader();
      this.renderView();
    });

    store.subscribe('drawer:state', (isOpen) => {
      if (isOpen) {
        renderDrawerCart(this.drawerEl);
        this.drawerEl.classList.add('active');
        this.drawerBackdrop.classList.add('active');
      } else {
        this.drawerEl.classList.remove('active');
        this.drawerBackdrop.classList.remove('active');
      }
    });

    store.subscribe('checkout:state', (isOpen) => {
      if (isOpen) {
        renderCheckoutModal(this.modalContainer);
      } else {
        this.modalContainer.innerHTML = '';
      }
    });

    store.subscribe('orderTracker:state', (isOpen) => {
      if (isOpen) {
        renderOrderTrackerModal(this.modalContainer);
      } else {
        this.modalContainer.innerHTML = '';
      }
    });

    store.subscribe('auth:state', ({ isOpen, mode }) => {
      if (isOpen) {
        renderAuthModal(this.modalContainer, mode);
      } else {
        this.modalContainer.innerHTML = '';
      }
    });

    store.subscribe('user:updated', () => {
      this.renderHeader();
      if (store.state.isCheckoutOpen) {
        renderCheckoutModal(this.modalContainer);
      }
    });

    store.subscribe('toast:message', (toastData) => {
      this.showToastNotification(toastData);
    });

    this.drawerBackdrop.addEventListener('click', () => {
      store.closeDrawer();
    });
  }

  showToastNotification({ title, message, type = 'info' }) {
    const toast = document.createElement('div');
    toast.className = 'social-toast';
    toast.style.borderColor = type === 'success' ? '#10b981' : 'var(--text-accent)';
    toast.innerHTML = `
      <div style="width: 32px; height: 32px; border-radius: 50%; background: ${type === 'success' ? '#10b981' : 'var(--text-accent)'}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem;">
        ${type === 'success' ? '✓' : 'ℹ'}
      </div>
      <div class="social-toast-text">
        <strong style="display: block; font-size: 0.88rem;">${title}</strong>
        <span style="font-size: 0.78rem; color: var(--text-secondary);">${message}</span>
      </div>
    `;

    this.socialProofEl.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  renderHeader() {
    renderNavbar(this.headerEl);
  }

  renderView() {
    const route = store.state.currentRoute;
    this.stickyBarEl.classList.add('hidden');

    if (route === 'home') {
      this.renderHomeView();
    } else if (route === 'catalog') {
      this.renderCatalogView();
    } else if (route === 'pdp') {
      this.renderProductDetailView();
    } else if (route === 'admin') {
      document.title = 'Administración | AURA Studio';
      renderAdminPanel(this.mainEl);
    }
  }

  renderHomeView() {
    document.title = 'AURA Studio | Alta Moda Contemporánea & Colecciones Exclusivas';

    const activeCat = store.state.activeCategory;
    const products = store.getProducts();
    const filteredProducts = activeCat === 'all' 
      ? products 
      : products.filter(p => p.category === activeCat);

    this.mainEl.innerHTML = `
      <!-- Hero Banner -->
      ${renderHeroBanner()}

      <!-- Sección de Catálogo Destacado -->
      <section class="catalog-section" id="catalog-section">
        <div class="container">
          <div class="section-header">
            <h2>Colección Vanguardia 2026</h2>
            <p>Piezas de autor confeccionadas artesanalmente con materiales 100% orgánicos y trazables.</p>
          </div>

          <!-- Barra de Filtros por Categoría -->
          <div class="filter-bar">
            <div class="category-pills">
              ${CATEGORIES.map(cat => `
                <button class="pill-btn ${activeCat === cat.id ? 'active' : ''}" data-cat-filter="${cat.id}">
                  ${cat.name}
                </button>
              `).join('')}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Mostrando <strong>${filteredProducts.length}</strong> prendas
            </div>
          </div>

          <!-- Cuadrícula de Productos -->
          <div class="products-grid">
            ${filteredProducts.map(prod => renderProductCard(prod)).join('')}
          </div>
        </div>
      </section>

      <!-- Reseñas Generales y Prueba Social -->
      ${renderReviewsSection(products[0] || PRODUCTS[0])}

      <!-- Banner de Newsletter con Exit-Intent -->
      <section style="background-color: var(--bg-surface-subtle); padding: 4rem 0; border-top: 1px solid var(--border-subtle);">
        <div class="container" style="max-width: 680px; text-align: center;">
          <span class="badge badge-new" style="margin-bottom: 0.75rem;">Mundo AURA</span>
          <h2 style="font-size: 2rem;">Únete a Nuestro Círculo Privado</h2>
          <p style="margin: 0.75rem 0 1.5rem;">Recibe acceso anticipado a desfiles y lanzamientos cápsula directamente en tu correo.</p>
          
          <form id="newsletter-form" style="display: flex; gap: 0.5rem; max-width: 480px; margin: 0 auto;">
            <input type="email" placeholder="Ingresa tu correo electrónico..." required class="form-input" id="newsletter-email" style="flex: 1; border-radius: var(--radius-full);" />
            <button type="submit" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">Suscribirme</button>
          </form>
          <div id="newsletter-feedback" style="margin-top: 0.75rem; font-size: 0.85rem; color: #10b981; display: none;"></div>
        </div>
      </section>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Attach listeners
    attachHeroListeners(this.mainEl);
    attachProductCardListeners(this.mainEl);
    initReviewsListeners(this.mainEl);

    // Categorías pills
    this.mainEl.querySelectorAll('[data-cat-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat-filter');
        store.state.activeCategory = cat;
        this.renderHomeView();
      });
    });

    // Newsletter Form
    const newsletterForm = this.mainEl.querySelector('#newsletter-form');
    const newsletterFeedback = this.mainEl.querySelector('#newsletter-feedback');
    if (newsletterForm && newsletterFeedback) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        newsletterFeedback.textContent = 'Gracias por unirte. Te avisaremos de nuestras próximas colecciones.';
        newsletterFeedback.style.display = 'block';
        newsletterForm.reset();
      });
    }
  }

  renderCatalogView() {
    this.renderHomeView();
  }

  renderProductDetailView() {
    const product = store.state.selectedProduct || store.getProducts()[0] || PRODUCTS[0];

    // Inicializar variantes seleccionadas
    this.pdpSelectedColor = product.colors[0];
    this.pdpSelectedSize = product.sizes.find(s => s.stock > 0)?.size || product.sizes[0].size;
    this.pdpSelectedMaterial = product.materials ? product.materials[0] : 'Seda & Lana';
    this.pdpQuantity = 1;

    // Actualizar SEO y Schema.org
    updateProductSEO(product);

    this.mainEl.innerHTML = `
      <div class="container pdp-container">
        <!-- Migas de Pan (Breadcrumbs) -->
        <nav class="pdp-breadcrumbs" aria-label="Breadcrumbs">
          <a href="#home" id="pdp-crumb-home">Inicio</a>
          <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
          <a href="#catalog" id="pdp-crumb-catalog">Catálogo</a>
          <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
          <span style="text-transform: capitalize;">${product.category}</span>
          <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
          <span style="color: var(--text-primary); font-weight: 600;">${product.name}</span>
        </nav>

        <!-- Cuadrícula Principal PDP (Galería con Zoom + Detalles de Compra) -->
        <div class="pdp-grid">
          <div id="pdp-gallery-slot">
            ${renderProductGallery(product, this.pdpSelectedColor)}
          </div>
          <div id="pdp-details-slot">
            ${renderProductDetails(product, this.pdpSelectedColor, this.pdpSelectedSize, this.pdpSelectedMaterial, this.pdpQuantity)}
          </div>
        </div>

        <!-- Pestañas Estructuradas (Ficha Técnica, Guía de Tallas, Envíos, FAQ) -->
        <div id="pdp-tabs-slot">
          ${renderProductTabs(product)}
        </div>

        <!-- Sección de Reseñas de Clientes -->
        ${renderReviewsSection(product)}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Inicializar Zoom y Lupa
    initGalleryZoom(this.mainEl);

    // Inicializar Tabs y Calculadora de Medidas
    initProductTabs(this.mainEl);

    // Inicializar Calculadora de Envíos en PDP
    ShippingCalculator.init(this.mainEl, product.price);

    // Inicializar Reseñas
    initReviewsListeners(this.mainEl);

    // Configurar Sticky Bar
    this.updateStickyBar(product);
    const triggerEl = this.mainEl.querySelector('#pdp-add-to-cart-btn');
    initStickyScrollObserver(triggerEl, this.stickyBarEl);

    // Attach PDP Interactions (Color, Talla, Cantidad, Comprar)
    this.attachPDPListeners(product);
  }

  updateStickyBar(product) {
    renderStickyBar(
      this.stickyBarEl,
      product,
      this.pdpSelectedColor,
      this.pdpSelectedSize,
      this.pdpSelectedMaterial
    );
  }

  attachPDPListeners(product) {
    // Breadcrumb clicks
    this.mainEl.querySelector('#pdp-crumb-home')?.addEventListener('click', (e) => {
      e.preventDefault();
      store.setRoute('home');
    });

    this.mainEl.querySelector('#pdp-crumb-catalog')?.addEventListener('click', (e) => {
      e.preventDefault();
      store.setRoute('catalog');
    });

    // Color Swatches Selection
    this.mainEl.querySelectorAll('#pdp-color-selector .color-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const colorId = btn.getAttribute('data-color-id');
        const color = product.colors.find(c => c.id === colorId);
        if (color) {
          this.pdpSelectedColor = color;
          
          // Re-render galería con nuevo color
          const gallerySlot = this.mainEl.querySelector('#pdp-gallery-slot');
          if (gallerySlot) {
            gallerySlot.innerHTML = renderProductGallery(product, color);
            initGalleryZoom(gallerySlot);
            if (window.lucide) window.lucide.createIcons();
          }

          // Actualizar botones de color activos
          this.mainEl.querySelectorAll('#pdp-color-selector .color-option-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-color-id') === colorId);
          });

          this.updateStickyBar(product);
        }
      });
    });

    // Size Selection
    this.mainEl.querySelectorAll('#pdp-size-selector .size-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size');
        const sizeObj = product.sizes.find(s => s.size === size);
        if (sizeObj) {
          this.pdpSelectedSize = size;
          
          this.mainEl.querySelectorAll('#pdp-size-selector .size-option-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-size') === size);
          });

          // Actualizar banner dinámico de stock
          const stockBox = this.mainEl.querySelector('#pdp-stock-banner');
          const addBtn = this.mainEl.querySelector('#pdp-add-to-cart-btn');
          
          if (stockBox && addBtn) {
            const stock = sizeObj.stock;
            const isLowStock = stock > 0 && stock <= 3;
            const isOutOfStock = stock === 0;

            stockBox.className = `stock-status-box ${isOutOfStock ? 'out-stock' : isLowStock ? 'low-stock' : 'in-stock'}`;
            stockBox.querySelector('.stock-live-counter').innerHTML = `
              <span class="stock-dot ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}"></span>
              <span>
                ${isOutOfStock 
                  ? 'Agotado en esta talla' 
                  : isLowStock 
                  ? `¡Atención! Quedan sólo <strong>${stock} unidades</strong> disponibles` 
                  : `En Stock - Listo para despacho en 24h`}
              </span>
            `;

            addBtn.disabled = isOutOfStock;
            addBtn.innerHTML = `<i data-lucide="shopping-bag"></i> ${isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}`;
            if (window.lucide) window.lucide.createIcons();
          }

          this.updateStickyBar(product);
        }
      });
    });

    // Material Selection
    this.mainEl.querySelectorAll('#pdp-material-selector .material-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const mat = chip.getAttribute('data-material');
        this.pdpSelectedMaterial = mat;
        this.mainEl.querySelectorAll('#pdp-material-selector .material-chip').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-material') === mat);
        });
        this.updateStickyBar(product);
      });
    });

    // Quantity controls
    const minusBtn = this.mainEl.querySelector('#pdp-qty-minus');
    const plusBtn = this.mainEl.querySelector('#pdp-qty-plus');
    const qtyInput = this.mainEl.querySelector('#pdp-qty-input');

    if (minusBtn && plusBtn && qtyInput) {
      minusBtn.addEventListener('click', () => {
        if (this.pdpQuantity > 1) {
          this.pdpQuantity--;
          qtyInput.value = this.pdpQuantity;
        }
      });

      plusBtn.addEventListener('click', () => {
        this.pdpQuantity++;
        qtyInput.value = this.pdpQuantity;
      });
    }

    // Add To Cart Button
    const addBtn = this.mainEl.querySelector('#pdp-add-to-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        store.addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          color: this.pdpSelectedColor,
          size: this.pdpSelectedSize,
          material: this.pdpSelectedMaterial,
          image: this.pdpSelectedColor.images[0],
          quantity: this.pdpQuantity
        });
      });
    }

    // Buy Now (1-Click Checkout) Button
    const buyNowBtn = this.mainEl.querySelector('#pdp-buy-now-btn');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        store.addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          color: this.pdpSelectedColor,
          size: this.pdpSelectedSize,
          material: this.pdpSelectedMaterial,
          image: this.pdpSelectedColor.images[0],
          quantity: this.pdpQuantity
        });
        store.closeDrawer();
        store.openCheckout();
      });
    }

    // Wishlist Button
    const wishlistBtn = this.mainEl.querySelector('#pdp-wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        store.toggleWishlist(product.id);
        const icon = wishlistBtn.querySelector('i');
        if (store.isInWishlist(product.id)) {
          if (icon) { icon.style.color = '#ef4444'; icon.style.fill = '#ef4444'; }
        } else {
          if (icon) { icon.style.color = ''; icon.style.fill = ''; }
        }
      });
    }

    // Scroll to reviews link
    this.mainEl.querySelector('#pdp-scroll-reviews')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Open Size Guide from label
    this.mainEl.querySelector('#pdp-open-size-guide')?.addEventListener('click', () => {
      const tabs = this.mainEl.querySelector('.tabs-nav');
      const sizeTabBtn = tabs?.querySelector('[data-tab="size-guide"]');
      sizeTabBtn?.click();
      tabs?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  renderFooter() {
    this.footerEl.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <!-- Columna 1: Marca y Filosofía -->
          <div class="footer-brand">
            <a href="#home" class="brand-logo">AURA <span>STUDIO</span></a>
            <p style="font-size: 0.9rem; max-width: 320px;">
              Boutique de alta moda contemporánea con atelier en Florencia y Madrid. Confección ética, fibras nobles y arquitectura textil sostenible.
            </p>
            <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
              <span class="btn-icon" title="Instagram"><i data-lucide="instagram"></i></span>
              <span class="btn-icon" title="Pinterest"><i data-lucide="camera"></i></span>
              <span class="btn-icon" title="WhatsApp Concierge"><i data-lucide="message-circle"></i></span>
            </div>
          </div>

          <!-- Columna 2: Navegación -->
          <div class="footer-column">
            <h4>Colecciones</h4>
            <ul>
              <li><a href="#catalog" data-route="catalog">Abrigos de Lana Merino</a></li>
              <li><a href="#catalog" data-route="catalog">Vestidos de Seda Natural</a></li>
              <li><a href="#catalog" data-route="catalog">Camisas en Lino Francés</a></li>
              <li><a href="#catalog" data-route="catalog">Pantalones Palazzo Tencel™</a></li>
            </ul>
          </div>

          <!-- Columna 3: Atención & Logística -->
          <div class="footer-column">
            <h4>Atención al Cliente</h4>
            <ul>
              <li><a href="#" id="footer-track-link">Rastrear Mi Pedido</a></li>
              <li><a href="#" id="footer-returns-link">Cambios y Devoluciones 30 Días</a></li>
              <li><a href="#" id="footer-shipping-link">Tiempos y Tarifas de Envío</a></li>
              <li><a href="#" id="footer-faq-link">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          <!-- Columna 4: Legal y Seguridad -->
          <div class="footer-column">
            <h4>Legal & Cumplimiento</h4>
            <ul>
              <li><a href="#" id="footer-privacy-link">Política de Privacidad (GDPR)</a></li>
              <li><a href="#" id="footer-terms-link">Términos y Condiciones</a></li>
              <li><a href="#" id="footer-pci-link">Seguridad de Pagos PCI-DSS</a></li>
              <li><a href="#" id="footer-cookies-link">Preferencias de Cookies</a></li>
            </ul>
          </div>
        </div>

        <!-- Fila Inferior de Copyright y Pasarelas -->
        <div class="footer-bottom">
          <span>© 2026 AURA Studio Fashion S.L. Todos los derechos reservados.</span>
          <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.8rem;">
            <span>💳 Stripe | PayPal | Mercado Pago | SSL 256-bit</span>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Listeners del Footer
    this.footerEl.querySelector('#footer-track-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      store.openOrderTracker();
    });

    this.footerEl.querySelector('#footer-privacy-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      LegalModals.render('privacy', this.modalContainer);
    });

    this.footerEl.querySelector('#footer-terms-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      LegalModals.render('terms', this.modalContainer);
    });

    this.footerEl.querySelector('#footer-returns-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      LegalModals.render('returns', this.modalContainer);
    });

    this.footerEl.querySelector('#footer-shipping-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      LegalModals.render('returns', this.modalContainer);
    });

    this.footerEl.querySelector('#footer-pci-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      LegalModals.render('privacy', this.modalContainer);
    });

    this.footerEl.querySelector('#footer-cookies-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.cookieBannerEl.classList.remove('hidden');
    });
  }
}

// Inicializar la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
