/**
 * Estado Reactivo Centralizado (Store) para AURA Studio
 */

import { Storage } from './storage.js';
import { CONFIG } from '../data/config.js';
import { PRODUCTS } from '../data/products.js';

class Store {
  constructor() {
    this.listeners = new Map();
    
    this.state = {
      user: Storage.getUser(),
      products: Storage.getProducts(PRODUCTS),
      cart: Storage.getCart(),
      wishlist: Storage.getWishlist(),
      theme: Storage.getTheme(),
      appliedCoupon: null,
      selectedShippingMethod: CONFIG.shipping.carriers[0],
      selectedProduct: PRODUCTS[0],
      currentRoute: 'home', // 'home', 'pdp', 'catalog'
      activeCategory: 'all',
      searchQuery: '',
      isDrawerOpen: false,
      isCheckoutOpen: false,
      isOrderTrackerOpen: false,
      isSizeGuideOpen: false,
      isAuthModalOpen: false,
      authMode: 'login', // 'login', 'register', 'forgot'
      isLegalModalOpen: null // 'privacy', 'terms', 'returns'
    };
  }

  // Patrón Observer / Event Pub-Sub
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  notify(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data, this.state));
    }
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb(event, data, this.state));
    }
  }

  // --- MÉTODOS DEL CARRITO ---

  addToCart(item) {
    // Generar un ID único basado en producto + color + talla + material
    const itemKey = `${item.productId}-${item.color.id}-${item.size}-${item.material}`;
    const existingIndex = this.state.cart.findIndex(i => i.itemKey === itemKey);

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += (item.quantity || 1);
    } else {
      this.state.cart.push({
        ...item,
        itemKey,
        quantity: item.quantity || 1
      });
    }

    Storage.saveCart(this.state.cart);
    this.notify('cart:updated', this.state.cart);
    this.openDrawer();
  }

  updateCartQuantity(itemKey, delta) {
    const item = this.state.cart.find(i => i.itemKey === itemKey);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(itemKey);
      return;
    }

    Storage.saveCart(this.state.cart);
    this.notify('cart:updated', this.state.cart);
  }

  removeFromCart(itemKey) {
    this.state.cart = this.state.cart.filter(i => i.itemKey !== itemKey);
    Storage.saveCart(this.state.cart);
    this.notify('cart:updated', this.state.cart);
  }

  clearCart() {
    this.state.cart = [];
    this.state.appliedCoupon = null;
    Storage.saveCart(this.state.cart);
    this.notify('cart:updated', this.state.cart);
  }

  // Cálculos reactivos de subtotales
  getCartMetrics() {
    const rawSubtotal = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);

    let discount = 0;
    if (this.state.appliedCoupon) {
      discount = (rawSubtotal * (this.state.appliedCoupon.discountPercent / 100));
    }

    const subtotalAfterDiscount = Math.max(0, rawSubtotal - discount);
    
    // El envío solo es gratuito cuando el administrador activa un cupón específico.
    const threshold = CONFIG.store.freeShippingThreshold;
    const isFreeShipping = Boolean(this.state.appliedCoupon?.freeShipping);
    
    let shippingCost = 0;
    if (!isFreeShipping && rawSubtotal > 0) {
      shippingCost = this.state.selectedShippingMethod.cost;
    }

    const total = subtotalAfterDiscount + shippingCost;
    const remainingForFreeShipping = Math.max(0, threshold - subtotalAfterDiscount);
    const progressPercent = 0;

    return {
      rawSubtotal,
      discount,
      subtotalAfterDiscount,
      shippingCost,
      total,
      itemCount,
      isFreeShipping,
      remainingForFreeShipping,
      progressPercent
    };
  }

  applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    const coupons = Storage.getCoupons(CONFIG.coupons);
    const coupon = coupons[cleanCode];

    if (coupon?.active !== false) {
      this.state.appliedCoupon = { code: cleanCode, ...coupon };
      this.notify('coupon:applied', this.state.appliedCoupon);
      this.notify('cart:updated', this.state.cart);
      return { success: true, message: `¡Cupón ${cleanCode} aplicado con éxito!` };
    } else {
      return { success: false, message: 'El código de cupón no es válido o ha expirado.' };
    }
  }

  getProducts() {
    return this.state.products;
  }

  getCoupons() {
    const savedCoupons = Storage.getCoupons(CONFIG.coupons);
    return Object.entries(savedCoupons).map(([code, coupon]) => ({ code, ...coupon }));
  }

  getOrders() {
    return Storage.getOrders();
  }

  addProduct(product) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      sku: `AUR-ADMIN-${Date.now()}`,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: product.name,
      subtitle: 'Nueva incorporación AURA Studio',
      category: product.category,
      price: product.price,
      originalPrice: product.price,
      rating: 0,
      reviewCount: 0,
      badge: 'Nuevo',
      badgeType: 'new',
      isNew: true,
      description: 'Prenda añadida desde el panel de administración.',
      materials: ['Material premium'],
      selectedMaterial: 'Material premium',
      colors: [{ id: 'default', name: 'Color principal', hex: '#18181b', images: [product.image || 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=900&auto=format&fit=crop'] }],
      sizes: [{ size: 'Única', stock: product.stock }],
      specifications: [],
      faqs: []
    };
    this.state.products.push(newProduct);
    Storage.saveProducts(this.state.products);
    this.notify('products:updated', this.state.products);
  }

  addCoupon(code, discountPercent, description) {
    const coupons = Storage.getCoupons(CONFIG.coupons);
    coupons[code.trim().toUpperCase()] = { discountPercent, description, active: true };
    Storage.saveCoupons(coupons);
  }

  toggleCoupon(code) {
    const coupons = Storage.getCoupons(CONFIG.coupons);
    if (!coupons[code]) return;
    coupons[code].active = coupons[code].active === false;
    Storage.saveCoupons(coupons);
  }

  deleteCoupon(code) {
    const coupons = Storage.getCoupons(CONFIG.coupons);
    delete coupons[code];
    Storage.saveCoupons(coupons);
  }

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    Storage.saveOrders(orders);
  }

  removeCoupon() {
    this.state.appliedCoupon = null;
    this.notify('cart:updated', this.state.cart);
  }

  // --- WISHLIST ---

  toggleWishlist(productId) {
    const index = this.state.wishlist.indexOf(productId);
    if (index > -1) {
      this.state.wishlist.splice(index, 1);
    } else {
      this.state.wishlist.push(productId);
    }
    Storage.saveWishlist(this.state.wishlist);
    this.notify('wishlist:updated', this.state.wishlist);
  }

  isInWishlist(productId) {
    return this.state.wishlist.includes(productId);
  }

  // --- TEMA (Dark / Light) ---

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    Storage.saveTheme(theme);
    this.notify('theme:changed', theme);
  }

  toggleTheme() {
    const next = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  // --- NAVEGACIÓN Y MODALES ---

  setRoute(route, productId = null) {
    this.state.currentRoute = route;
    if (productId) {
      const prod = this.state.products.find(p => p.id === productId || p.slug === productId);
      if (prod) this.state.selectedProduct = prod;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify('route:changed', { route, product: this.state.selectedProduct });
  }

  openDrawer() {
    this.state.isDrawerOpen = true;
    this.notify('drawer:state', true);
  }

  closeDrawer() {
    this.state.isDrawerOpen = false;
    this.notify('drawer:state', false);
  }

  openCheckout() {
    this.closeDrawer();
    this.state.isCheckoutOpen = true;
    this.notify('checkout:state', true);
  }

  closeCheckout() {
    this.state.isCheckoutOpen = false;
    this.notify('checkout:state', false);
  }

  openOrderTracker() {
    this.state.isOrderTrackerOpen = true;
    this.notify('orderTracker:state', true);
  }

  closeOrderTracker() {
    this.state.isOrderTrackerOpen = false;
    this.notify('orderTracker:state', false);
  }

  // --- AUTENTICACIÓN Y GESTIÓN DE USUARIO ---

  login(email, password, name = '') {
    const cleanEmail = (email || '').trim().toLowerCase();
    const displayName = name || cleanEmail.split('@')[0];
    const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    const user = {
      id: `usr_${Date.now()}`,
      name: capitalizedName,
      email: cleanEmail,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop`,
      memberSince: '2026',
      token: `jwt_aura_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    };

    this.state.user = user;
    Storage.saveUser(user);
    this.closeAuth();
    this.setRoute('home');
    this.notify('user:updated', user);
    this.notify('toast:message', {
      title: `¡Bienvenido/a de nuevo, ${capitalizedName}!`,
      message: 'Has iniciado sesión con éxito.',
      type: 'success'
    });

    return { success: true, user };
  }

  adminLogin(email, password) {
    if (email.trim().toLowerCase() !== 'admin@aurastudio.com' || password !== 'admin2026') {
      return { success: false, message: 'Credenciales de administrador incorrectas.' };
    }
    const user = { id: 'admin_aura', name: 'Administrador', email: 'admin@aurastudio.com', isAdmin: true, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop', memberSince: '2026' };
    this.state.user = user;
    Storage.saveUser(user);
    this.closeAuth();
    this.setRoute('admin');
    this.notify('user:updated', user);
    return { success: true, user };
  }

  register(name, email, password) {
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    const user = {
      id: `usr_${Date.now()}`,
      name: cleanName || cleanEmail.split('@')[0],
      email: cleanEmail,
      avatar: `https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop`,
      memberSince: '2026',
      token: `jwt_aura_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    };

    this.state.user = user;
    Storage.saveUser(user);
    this.closeAuth();
    this.setRoute('home');
    this.notify('user:updated', user);
    this.notify('toast:message', {
      title: `¡Cuenta creada con éxito!`,
      message: `Bienvenido a la comunidad AURA Studio, ${user.name}.`,
      type: 'success'
    });

    return { success: true, user };
  }

  logout() {
    this.state.user = null;
    Storage.clearUser();
    this.notify('user:updated', null);
    this.notify('toast:message', {
      title: 'Sesión cerrada',
      message: 'Esperamos verte de vuelta pronto.',
      type: 'info'
    });
  }

  openAuth(mode = 'login') {
    this.state.authMode = mode;
    this.state.isAuthModalOpen = true;
    this.notify('auth:state', { isOpen: true, mode });
  }

  closeAuth() {
    this.state.isAuthModalOpen = false;
    this.notify('auth:state', { isOpen: false, mode: this.state.authMode });
  }
}

export const store = new Store();
