/**
 * Modales de Políticas Legales (Privacidad, Términos, Devoluciones)
 */

export const LegalModals = {
  render(type, container) {
    const titles = {
      privacy: 'Política de Privacidad y Tratamiento de Datos (GDPR)',
      terms: 'Términos y Condiciones del Servicio',
      returns: 'Políticas de Envíos, Cambios y Devoluciones'
    };

    const contents = {
      privacy: `
        <p>En AURA Studio, la privacidad de nuestros clientes es una prioridad inquebrantable. Conforme al Reglamento General de Protección de Datos (RGPD UE 2016/679):</p>
        <h4 style="margin-top: 1rem;">1. Responsable del Tratamiento</h4>
        <p>AURA Studio Fashion S.L., con domicilio en Paseo de la Moda 108, 28001 Madrid, España.</p>
        <h4 style="margin-top: 1rem;">2. Finalidad del Tratamiento</h4>
        <p>Gestionar pedidos, envíos con mensajería express y atención al cliente. No comercializamos tus datos con terceros.</p>
        <h4 style="margin-top: 1rem;">3. Derechos del Usuario</h4>
        <p>Puedes solicitar el acceso, rectificación o eliminación de tus datos en cualquier momento enviando un correo a <code>privacy@aurastudio.com</code>.</p>
      `,
      terms: `
        <p>Bienvenido a AURA Studio. Al acceder y realizar una compra en nuestra tienda online, aceptas los siguientes términos:</p>
        <h4 style="margin-top: 1rem;">1. Precios e Impuestos</h4>
        <p>Todos los precios se encuentran expresados en dólares estadounidenses (USD) o euros (EUR) según corresponda, e incluyen el IVA aplicable.</p>
        <h4 style="margin-top: 1rem;">2. Garantía de Confección</h4>
        <p>Nuestras prendas cuentan con una garantía de 2 años contra defectos de fabricación en tejidos y costuras.</p>
      `,
      returns: `
        <p>Queremos que disfrutes plenamente de cada prenda AURA Studio:</p>
        <h4 style="margin-top: 1rem;">1. Plazo de 30 Días</h4>
        <p>Dispones de 30 días naturales a partir de la fecha de entrega para solicitar un cambio de talla o reembolso íntegro.</p>
        <h4 style="margin-top: 1rem;">2. Proceso de Devolución Gratuito</h4>
        <p>DHL Express recolectará el paquete en tu domicilio sin costo adicional de transporte.</p>
      `
    };

    container.innerHTML = `
      <div class="modal-overlay active" id="legal-modal-overlay">
        <div class="modal-dialog" style="max-width: 680px;">
          <div class="modal-header">
            <h3>${titles[type] || 'Información Legal'}</h3>
            <button class="btn-icon" id="legal-modal-close-btn" aria-label="Cerrar modal">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="modal-body" style="font-size: 0.92rem; line-height: 1.65; display: flex; flex-direction: column; gap: 0.75rem;">
            ${contents[type] || ''}
            <div style="margin-top: 1.5rem; text-align: right;">
              <button class="btn btn-primary" id="legal-modal-ok-btn">Entendido</button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const close = () => {
      container.innerHTML = '';
    };

    container.querySelector('#legal-modal-close-btn')?.addEventListener('click', close);
    container.querySelector('#legal-modal-ok-btn')?.addEventListener('click', close);
    container.querySelector('#legal-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'legal-modal-overlay') close();
    });
  }
};
