/**
 * Componente Pestañas Estructuradas de Producto (PDP Tabs)
 */

import { SIZE_CHART } from '../data/products.js';

export function renderProductTabs(product) {
  return `
    <div class="pdp-tabs-container">
      <!-- Navegación de Pestañas -->
      <div class="tabs-nav" role="tablist">
        <button class="tab-btn active" data-tab="specs" role="tab">Características Técnicas</button>
        <button class="tab-btn" data-tab="size-guide" role="tab">Guía de Tallas & Medidas</button>
        <button class="tab-btn" data-tab="shipping" role="tab">Envíos & Devoluciones</button>
        <button class="tab-btn" data-tab="faq" role="tab">Preguntas Frecuentes (FAQ)</button>
      </div>

      <!-- Panel 1: Ficha Técnica -->
      <div class="tab-panel active" id="tab-specs" role="tabpanel">
        <div style="max-width: 800px;">
          <h3 style="margin-bottom: 1rem; font-size: 1.25rem;">Especificaciones y Artesanía</h3>
          <p style="margin-bottom: 1.5rem;">${product.description}</p>

          <table class="size-table">
            <tbody>
              ${product.specifications.map(spec => `
                <tr>
                  <td style="font-weight: 700; width: 35%;">${spec.label}</td>
                  <td>${spec.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Panel 2: Guía de Tallas Interactiva -->
      <div class="tab-panel" id="tab-size-guide" role="tabpanel">
        <div style="max-width: 850px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3>Tabla de Medidas Corporales</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Medidas estándar en Centímetros (cm)</span>
          </div>

          <div class="size-table-wrap">
            <table class="size-table">
              <thead>
                <tr>
                  <th>Talla AURA</th>
                  <th>Equivalencia EU</th>
                  <th>Pecho (cm)</th>
                  <th>Cintura (cm)</th>
                  <th>Cadera (cm)</th>
                </tr>
              </thead>
              <tbody>
                ${SIZE_CHART.women.map(row => `
                  <tr>
                    <td><strong>${row.size}</strong></td>
                    <td>${row.eu}</td>
                    <td>${row.chest}</td>
                    <td>${row.waist}</td>
                    <td>${row.hip}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Calculadora Interactiva de Recomendación de Talla -->
          <div class="size-calculator-box">
            <i data-lucide="help-circle" style="color: var(--text-accent); font-size: 1.5rem;"></i>
            <div style="flex: 1;">
              <strong>¿Dudas con tu talla ideal?</strong>
              <p style="font-size: 0.85rem; margin-top: 0.2rem;">
                Ingresa tu contorno de pecho aproximado:
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="number" id="calc-chest-input" placeholder="Ej. 88 cm" class="form-input" style="width: 120px;" />
              <button class="btn btn-outline" id="calc-size-btn" style="padding: 0.6rem 1rem;">Calcular</button>
            </div>
            <div id="calc-result" style="width: 100%; display: none; font-weight: 700; color: #10b981; margin-top: 0.5rem;"></div>
          </div>
        </div>
      </div>

      <!-- Panel 3: Envíos y Políticas -->
      <div class="tab-panel" id="tab-shipping" role="tabpanel">
        <div style="max-width: 800px; display: flex; flex-direction: column; gap: 1.5rem;">
          <div>
            <h4 style="margin-bottom: 0.5rem;"><i data-lucide="truck"></i> Tiempos y Costes de Despacho</h4>
            <p>Todas las órdenes recibidas antes de las 14:00 (GMT+1) se procesan el mismo día laborable desde nuestro centro logístico.</p>
            <ul style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
              <li>• <strong>Envío Estándar:</strong> 3-5 días laborables ($12.00 o GRATIS en compras superiores a $80 USD).</li>
              <li>• <strong>DHL Express 24h:</strong> Entrega garantizada al día siguiente hábil ($19.50).</li>
              <li>• <strong>Retiro en Boutique Flagship:</strong> Disponible sin coste en 2 horas tras confirmar la orden.</li>
            </ul>
          </div>

          <div>
            <h4 style="margin-bottom: 0.5rem;"><i data-lucide="rotate-ccw"></i> Devoluciones y Cambios de Talla</h4>
            <p>Dispones de <strong>30 días naturales</strong> desde la recepción del pedido para solicitar un cambio de talla o devolución total. Las prendas deben mantener su etiquetado original intacto.</p>
          </div>
        </div>
      </div>

      <!-- Panel 4: Preguntas Frecuentes FAQ con Acordeón -->
      <div class="tab-panel" id="tab-faq" role="tabpanel">
        <div class="faq-accordion" style="max-width: 800px;">
          ${product.faqs.map((faq, index) => `
            <div class="faq-item ${index === 0 ? 'open' : ''}">
              <button class="faq-header" aria-expanded="${index === 0 ? 'true' : 'false'}">
                <span>${faq.q}</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="faq-body">
                <p>${faq.a}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function initProductTabs(container) {
  const tabBtns = container.querySelectorAll('.tab-btn');
  const tabPanels = container.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = container.querySelector(`#tab-${tabId}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // FAQ Accordion
  const faqHeaders = container.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      parent.classList.toggle('open');
    });
  });

  // Size Calculator
  const calcBtn = container.querySelector('#calc-size-btn');
  const chestInput = container.querySelector('#calc-chest-input');
  const resultDiv = container.querySelector('#calc-result');

  if (calcBtn && chestInput && resultDiv) {
    calcBtn.addEventListener('click', () => {
      const chest = parseFloat(chestInput.value);
      if (!chest || isNaN(chest)) {
        resultDiv.textContent = 'Por favor, ingresa una medida numérica válida.';
        resultDiv.style.color = '#ef4444';
        resultDiv.style.display = 'block';
        return;
      }

      let recSize = 'M';
      if (chest <= 84) recSize = 'XS';
      else if (chest <= 89) recSize = 'S';
      else if (chest <= 94) recSize = 'M';
      else if (chest <= 100) recSize = 'L';
      else recSize = 'XL';

      resultDiv.textContent = `✨ Según tus medidas, tu talla ideal recomendada es: ${recSize}`;
      resultDiv.style.color = '#10b981';
      resultDiv.style.display = 'block';
    });
  }
}
