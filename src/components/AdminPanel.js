import { store } from '../state/store.js';
import { formatCurrency } from '../utils/formatters.js';

export function renderAdminPanel(container) {
  const state = store.state;
  const products = store.getProducts();
  const orders = store.getOrders();
  const coupons = store.getCoupons();

  if (!state.user?.isAdmin) {
    container.innerHTML = `
      <section class="container" style="padding: 5rem 1rem; text-align: center;">
        <i data-lucide="shield-alert" style="width: 48px; height: 48px; color: #ef4444;"></i>
        <h1 style="margin: 1rem 0 0.5rem;">Acceso restringido</h1>
        <p style="color: var(--text-secondary);">Inicia sesión con una cuenta de administrador.</p>
        <button class="btn btn-primary" id="admin-login-action" style="margin-top: 1.25rem;">Iniciar sesión</button>
      </section>`;
    container.querySelector('#admin-login-action').addEventListener('click', () => store.openAuth('admin'));
    window.lucide?.createIcons();
    return;
  }

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  container.innerHTML = `
    <section class="admin-shell">
      <div class="container">
        <div class="admin-heading">
          <div>
            <span class="badge badge-new">Panel de control</span>
            <h1>Administración</h1>
            <p>Gestiona el catálogo, las promociones y los pedidos de AURA Studio.</p>
          </div>
          <button class="btn btn-outline" id="admin-store-btn"><i data-lucide="store"></i> Ver tienda</button>
        </div>

        <div class="admin-stats">
          <div class="admin-stat"><span>Productos</span><strong>${products.length}</strong></div>
          <div class="admin-stat"><span>Pedidos recibidos</span><strong>${orders.length}</strong></div>
          <div class="admin-stat"><span>Ventas registradas</span><strong>${formatCurrency(totalSales)}</strong></div>
          <div class="admin-stat"><span>Cupones activos</span><strong>${coupons.length}</strong></div>
        </div>

        <div class="admin-grid">
          <section class="admin-section">
            <div class="admin-section-heading"><div><h2>Agregar prenda</h2><p>La nueva prenda se añadirá al catálogo.</p></div><i data-lucide="shirt"></i></div>
            <form id="admin-product-form" class="admin-form">
              <input class="form-input" name="name" placeholder="Nombre de la prenda" required />
              <div class="admin-form-row"><input class="form-input" name="price" type="number" min="0" step="0.01" placeholder="Precio" required /><input class="form-input" name="stock" type="number" min="0" placeholder="Stock" required /></div>
              <select class="form-input" name="category"><option value="abrigos">Abrigos</option><option value="vestidos">Vestidos</option><option value="camisas">Lino & Seda</option></select>
              <input class="form-input" name="image" type="url" placeholder="URL de imagen (opcional)" />
              <button class="btn btn-primary" type="submit"><i data-lucide="plus"></i> Agregar al catálogo</button>
              <div class="admin-feedback" id="product-feedback"></div>
            </form>
          </section>

          <section class="admin-section">
            <div class="admin-section-heading"><div><h2>Crear descuento</h2><p>Los descuentos solo se aplican cuando los activas aquí.</p></div><i data-lucide="tag"></i></div>
            <form id="admin-coupon-form" class="admin-form">
              <input class="form-input" name="code" placeholder="Código, por ejemplo VERANO10" required />
              <div class="admin-form-row"><input class="form-input" name="percent" type="number" min="1" max="100" placeholder="Porcentaje" required /><input class="form-input" name="description" placeholder="Descripción" required /></div>
              <button class="btn btn-primary" type="submit"><i data-lucide="badge-percent"></i> Guardar descuento</button>
              <div class="admin-feedback" id="coupon-feedback"></div>
            </form>
            <div class="admin-list">${coupons.length ? coupons.map(coupon => `<div class="admin-list-row"><span><strong>${coupon.code}</strong><small>${coupon.description} · ${coupon.active === false ? 'Desactivado' : 'Activo'}</small></span><span style="display:flex;align-items:center;gap:.5rem;"><b>${coupon.discountPercent}%</b><button class="btn-icon admin-coupon-toggle" data-coupon-code="${coupon.code}" title="Activar o desactivar"><i data-lucide="${coupon.active === false ? 'play' : 'pause'}"></i></button><button class="btn-icon admin-coupon-delete" data-coupon-code="${coupon.code}" title="Eliminar"><i data-lucide="trash-2"></i></button></span></div>`).join('') : '<p class="admin-empty">No hay descuentos creados.</p>'}</div>
          </section>
        </div>

        <section class="admin-section admin-orders-section">
          <div class="admin-section-heading"><div><h2>Pedidos recibidos</h2><p>Consulta el detalle de cada compra realizada.</p></div><i data-lucide="clipboard-list"></i></div>
          <div class="admin-orders">${orders.length ? orders.map(order => `
            <details class="admin-order"><summary><span><strong>${order.id}</strong><small>${order.customer.name} · ${order.customer.email}</small></span><b>${formatCurrency(order.total)}</b><em>${order.status}</em></summary>
              <div class="admin-order-detail"><p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString('es-ES')} · <strong>Envío:</strong> ${order.shippingMethod}</p><ul>${order.items.map(item => `<li>${item.quantity} × ${item.name} (${item.size}, ${item.color}) <span>${formatCurrency(item.price * item.quantity)}</span></li>`).join('')}</ul></div>
            </details>`).join('') : '<div class="admin-empty">Todavía no hay pedidos registrados.</div>'}</div>
        </section>
      </div>
    </section>`;

  window.lucide?.createIcons();
  container.querySelector('#admin-store-btn').addEventListener('click', () => window.location.assign('/'));
  container.querySelector('#admin-product-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    store.addProduct({ ...data, price: Number(data.price), stock: Number(data.stock) });
    renderAdminPanel(container);
  });
  container.querySelector('#admin-coupon-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    store.addCoupon(data.code, Number(data.percent), data.description);
    renderAdminPanel(container);
  });
  container.querySelectorAll('.admin-coupon-toggle').forEach(button => {
    button.addEventListener('click', () => {
      store.toggleCoupon(button.dataset.couponCode);
      renderAdminPanel(container);
    });
  });
  container.querySelectorAll('.admin-coupon-delete').forEach(button => {
    button.addEventListener('click', () => {
      store.deleteCoupon(button.dataset.couponCode);
      renderAdminPanel(container);
    });
  });
}
