/**
 * Componente Reseñas Verificadas y Prueba Social
 */

import { REVIEWS } from '../data/reviews.js';
import { formatDate } from '../utils/formatters.js';

export function renderReviewsSection(product) {
  const productReviews = REVIEWS.filter(r => r.productId === product.id || r.productId === 'prod-001');
  const total = productReviews.length;
  const avgRating = total > 0 
    ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
    : '5.0';

  return `
    <section class="reviews-section" id="reviews-section">
      <div class="container">
        <div class="section-header">
          <h2>Opiniones de Clientes Verificados</h2>
          <p>Experiencias auténticas de clientes que ya disfrutan de esta prenda.</p>
        </div>

        <!-- Tarjeta de Resumen y Distribución de Estrellas -->
        <div class="reviews-summary-card">
          <!-- Columna 1: Promedio Grande -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
            <div class="rating-big-number">${avgRating}</div>
            <div class="stars" style="font-size: 1.25rem;">★★★★★</div>
            <span style="font-size: 0.85rem; color: var(--text-muted);">${total} valoraciones totales</span>
          </div>

          <!-- Columna 2: Barras de Desglose -->
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            <div class="rating-bar-row">
              <span>5 ★</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 85%;"></div></div>
              <span>85%</span>
            </div>
            <div class="rating-bar-row">
              <span>4 ★</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 15%;"></div></div>
              <span>15%</span>
            </div>
            <div class="rating-bar-row">
              <span>3 ★</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 0%;"></div></div>
              <span>0%</span>
            </div>
            <div class="rating-bar-row">
              <span>2 ★</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 0%;"></div></div>
              <span>0%</span>
            </div>
            <div class="rating-bar-row">
              <span>1 ★</span>
              <div class="rating-bar-track"><div class="rating-bar-fill" style="width: 0%;"></div></div>
              <span>0%</span>
            </div>
          </div>

          <!-- Columna 3: CTA Escribir Reseña -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem; justify-content: center;">
            <button class="btn btn-primary" id="open-write-review-btn">
              <i data-lucide="edit-3"></i> Escribir una Reseña
            </button>
            <span style="font-size: 0.75rem; color: var(--text-muted); text-align: center;">
              Solo compradores con orden verificada pueden opinar
            </span>
          </div>
        </div>

        <!-- Filtros por Calificación -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto;">
          <button class="pill-btn active" data-review-filter="all">Todas (${total})</button>
          <button class="pill-btn" data-review-filter="5">5 Estrellas</button>
          <button class="pill-btn" data-review-filter="4">4 Estrellas</button>
          <button class="pill-btn" data-review-filter="photos">Con Fotos</button>
        </div>

        <!-- Lista de Reseñas -->
        <div class="reviews-list" id="reviews-list-container">
          ${productReviews.map(review => `
            <article class="review-card" data-rating="${review.rating}" data-has-photos="${review.photos.length > 0 ? 'true' : 'false'}">
              <div class="review-header">
                <div class="review-author">
                  <img src="${review.avatar}" alt="${review.author}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <strong>${review.author}</strong>
                    ${review.verified ? `
                      <span class="review-verified">
                        <i data-lucide="check-circle" style="width: 13px; height: 13px;"></i> Comprador Verificado
                      </span>
                    ` : ''}
                  </div>
                </div>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${formatDate(review.date)}</span>
              </div>

              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <strong style="font-size: 0.95rem;">${review.title}</strong>
              </div>

              <p>${review.comment}</p>

              ${review.sizePurchased ? `
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  Talla adquirida: <strong>${review.sizePurchased}</strong> | Color: <strong>${review.colorPurchased}</strong>
                </div>
              ` : ''}

              <!-- Fotos adjuntas por clientes -->
              ${review.photos && review.photos.length > 0 ? `
                <div class="review-photos-grid">
                  ${review.photos.map(photo => `
                    <img src="${photo}" alt="Foto de cliente" class="review-user-photo" />
                  `).join('')}
                </div>
              ` : ''}

              <button class="review-helpful-btn" data-action="vote-helpful" data-review-id="${review.id}">
                <i data-lucide="thumbs-up"></i> ¿Te ha sido útil? (<span>${review.helpfulCount}</span>)
              </button>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initReviewsListeners(container) {
  // Filtros de Reseñas
  const filterBtns = container.querySelectorAll('[data-review-filter]');
  const cards = container.querySelectorAll('.review-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-review-filter');

      cards.forEach(card => {
        const rating = card.getAttribute('data-rating');
        const hasPhotos = card.getAttribute('data-has-photos') === 'true';

        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'photos') {
          card.style.display = hasPhotos ? 'flex' : 'none';
        } else {
          card.style.display = (rating === filter) ? 'flex' : 'none';
        }
      });
    });
  });

  // Voto de Utilidad
  container.querySelectorAll('[data-action="vote-helpful"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const countSpan = btn.querySelector('span');
      if (countSpan && !btn.classList.contains('voted')) {
        btn.classList.add('voted');
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        countSpan.textContent = parseInt(countSpan.textContent) + 1;
      }
    });
  });
}
