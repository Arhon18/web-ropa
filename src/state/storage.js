/**
 * Módulo de Almacenamiento Local Seguro y Gestión de Preferencias
 */

const STORAGE_KEYS = {
  CART: 'aura_cart_v1',
  WISHLIST: 'aura_wishlist_v1',
  THEME: 'aura_theme_v1',
  GDPR_CONSENT: 'aura_gdpr_consent_v1',
  EXIT_POPUP_SHOWN: 'aura_exit_popup_dismissed_v1',
  AUTH_USER: 'aura_auth_user_v1'
};

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Storage read error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  },

  // Helpers específicos
  getCart() {
    return this.get(STORAGE_KEYS.CART, []);
  },

  saveCart(cart) {
    this.set(STORAGE_KEYS.CART, cart);
  },

  getWishlist() {
    return this.get(STORAGE_KEYS.WISHLIST, []);
  },

  saveWishlist(wishlist) {
    this.set(STORAGE_KEYS.WISHLIST, wishlist);
  },

  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light');
  },

  saveTheme(theme) {
    this.set(STORAGE_KEYS.THEME, theme);
  },

  getConsent() {
    return this.get(STORAGE_KEYS.GDPR_CONSENT, null);
  },

  saveConsent(consent) {
    this.set(STORAGE_KEYS.GDPR_CONSENT, consent);
  },

  isExitPopupDismissed() {
    return this.get(STORAGE_KEYS.EXIT_POPUP_SHOWN, false);
  },

  dismissExitPopup() {
    this.set(STORAGE_KEYS.EXIT_POPUP_SHOWN, true);
  },

  getUser() {
    return this.get(STORAGE_KEYS.AUTH_USER, null);
  },

  saveUser(user) {
    this.set(STORAGE_KEYS.AUTH_USER, user);
  },

  clearUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } catch (e) {}
  }
};
