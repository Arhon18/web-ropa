/**
 * Banner Hero Editorial con llamadas a la acción y sellos de confianza
 */

import { store } from '../state/store.js';

export function renderHeroBanner() {
  return `
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          <!-- Textos y Llamadas a la Acción -->
          <div class="hero-content">
            <div class="hero-tag">
              <i data-lucide="sparkles"></i> Colección Atelier 2026
            </div>
            <h1 class="hero-title">
              La arquitectura del vestir, <em>elevada a su máxima expresión</em>.
            </h1>
            <p class="hero-desc">
              Prendas confeccionadas con fibras nobles, lanas merino italianas y sedas sostenibles. Cortes atemporales diseñados para trascender tendencias efímeras.
            </p>
            
            <div class="hero-ctas">
              <button class="btn btn-primary btn-lg" id="hero-explore-btn">
                Explorar Colección <i data-lucide="arrow-right"></i>
              </button>
              <button class="btn btn-outline btn-lg" id="hero-bestseller-btn">
                Ver Abrigo Bestseller
              </button>
            </div>

            <!-- Sellos de Confianza y Calidad -->
            <div class="hero-trust-bar">
              <div class="trust-item">
                <i data-lucide="shield-check"></i>
                <span>Garantía de Satisfacción 30 Días</span>
              </div>
              <div class="trust-item">
                <i data-lucide="zap"></i>
                <span>Envío Express 24-48h</span>
              </div>
              <div class="trust-item">
                <i data-lucide="leaf"></i>
                <span>Fibras 100% Sostenibles</span>
              </div>
            </div>
          </div>

          <!-- Imagen Editorial de Impacto con Tarjeta Flotante -->
          <div class="hero-image-wrapper">
            <div class="hero-img-card">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop" 
                alt="Colección AURA Alta Costura 2026"
                loading="eager"
              />
            </div>

            <!-- Floating Social Proof Pill -->
            <div class="hero-floating-card">
              <div class="stock-dot in"></div>
              <div>
                <strong style="display:block; font-size: 0.85rem;">Hecho en Florencia</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Artesanía de sastrería prémium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function attachHeroListeners(container) {
  const exploreBtn = container.querySelector('#hero-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      store.setRoute('catalog');
    });
  }

  const bestSellerBtn = container.querySelector('#hero-bestseller-btn');
  if (bestSellerBtn) {
    bestSellerBtn.addEventListener('click', () => {
      store.setRoute('pdp', 'prod-001');
    });
  }
}
