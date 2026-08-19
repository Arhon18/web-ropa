/**
 * Widget Calculadora de Envíos en Tiempo Real por Código Postal
 */

import { formatCurrency } from '../utils/formatters.js';
import { ShippingProvider } from '../api/shippingProvider.js';

export const ShippingCalculator = {
  renderWidget(currentPrice = 0) {
    return `
      <div class="shipping-calc-box" style="padding: 1.15rem; background: var(--bg-surface-subtle); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <strong style="font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="map-pin" style="color: var(--text-accent);"></i> Calcular Envío & Disponibilidad
          </strong>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <input 
            type="text" 
            placeholder="Código Postal (Ej. 28001)" 
            class="form-input" 
            id="shipping-calc-zip" 
            style="font-size: 0.85rem; padding: 0.5rem 0.75rem;" 
          />
          <button class="btn btn-outline" id="shipping-calc-btn" style="padding: 0.5rem 1rem; font-size: 0.82rem; white-space: nowrap;">
            Calcular
          </button>
        </div>

        <div id="shipping-calc-results" style="margin-top: 0.75rem; display: none; flex-direction: column; gap: 0.4rem; font-size: 0.82rem;"></div>
      </div>
    `;
  },

  init(container, productPrice = 0) {
    const calcBtn = container.querySelector('#shipping-calc-btn');
    const zipInput = container.querySelector('#shipping-calc-zip');
    const resultsContainer = container.querySelector('#shipping-calc-results');

    if (!calcBtn || !zipInput || !resultsContainer) return;

    calcBtn.addEventListener('click', async () => {
      const zip = zipInput.value.trim();
      if (!zip) {
        resultsContainer.innerHTML = `<span style="color: #ef4444;">Por favor, introduce un código postal válido.</span>`;
        resultsContainer.style.display = 'flex';
        return;
      }

      calcBtn.disabled = true;
      calcBtn.textContent = 'Calculando...';

      const rates = await ShippingProvider.calculateRates(zip, productPrice);

      resultsContainer.innerHTML = rates.map(rate => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0.6rem; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div>
            <strong>${rate.name}</strong>
            <span style="display: block; font-size: 0.72rem; color: var(--text-muted);">${rate.deliveryEstimate}</span>
          </div>
          <span style="font-weight: 700; color: ${rate.price === 0 ? '#10b981' : 'var(--text-primary)'};">
            ${rate.price === 0 ? 'GRATIS' : formatCurrency(rate.price)}
          </span>
        </div>
      `).join('');

      resultsContainer.style.display = 'flex';
      calcBtn.disabled = false;
      calcBtn.textContent = 'Calcular';
    });
  }
};
