/**
 * Componente Modal de Autenticación (Iniciar Sesión / Crear Cuenta / Recuperar Contraseña)
 */

import { store } from '../state/store.js';
import { Security } from '../utils/security.js';
import confetti from 'canvas-confetti';

export function renderAuthModal(container, initialMode = 'login') {
  let currentMode = initialMode; // 'login', 'register', 'forgot'

  function getHTML() {
    return `
      <div class="modal-overlay active" id="auth-modal-overlay">
        <div class="modal-dialog" style="max-width: 480px; padding: 0;">
          <!-- Header del Modal -->
          <div class="modal-header" style="padding: 1.25rem 1.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="brand-logo" style="font-size: 1.2rem;">AURA <span>STUDIO</span></span>
            </div>
            <button class="btn-icon" id="auth-close-btn" aria-label="Cerrar ventana">
              <i data-lucide="x"></i>
            </button>
          </div>

          <div class="modal-body" style="padding: 2rem;">
            ${currentMode === 'forgot' ? getForgotHTML() : getTabsAndFormHTML()}
          </div>
        </div>
      </div>
    `;
  }

  function getTabsAndFormHTML() {
    return `
      <!-- Pestañas Iniciar Sesión / Crear Cuenta -->
      <div class="auth-tabs" style="display: flex; border-bottom: 2px solid var(--border-subtle); margin-bottom: 1.75rem;">
        <button class="auth-tab-btn ${currentMode === 'login' ? 'active' : ''}" id="tab-btn-login" style="flex: 1; padding: 0.75rem 0; font-weight: 700; font-size: 0.95rem; text-align: center; border-bottom: 2px solid ${currentMode === 'login' ? 'var(--text-primary)' : 'transparent'}; margin-bottom: -2px; color: ${currentMode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)'}; transition: all var(--transition-fast);">
          Iniciar Sesión
        </button>
        <button class="auth-tab-btn ${currentMode === 'register' ? 'active' : ''}" id="tab-btn-register" style="flex: 1; padding: 0.75rem 0; font-weight: 700; font-size: 0.95rem; text-align: center; border-bottom: 2px solid ${currentMode === 'register' ? 'var(--text-primary)' : 'transparent'}; margin-bottom: -2px; color: ${currentMode === 'register' ? 'var(--text-primary)' : 'var(--text-muted)'}; transition: all var(--transition-fast);">
          Crear Cuenta
        </button>
      </div>

      <!-- Botones de Acceso Rápido Social -->
      <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem;">
        <button class="btn btn-outline btn-block" id="social-google-btn" style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.88rem; font-weight: 600;">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continuar con Google
        </button>

        <button class="btn btn-outline btn-block" id="social-apple-btn" style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.88rem; font-weight: 600;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.36-.58.67-1.09 1.74-.95 2.77 1 .08 2.03-.52 2.66-1.28z"/>
          </svg>
          Continuar con Apple ID
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
        <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
        <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">O ingresa con tu email</span>
        <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
      </div>

      <!-- Formulario de Autenticación -->
      <form id="auth-main-form" autocomplete="on">
        ${currentMode === 'register' ? `
          <div class="form-group">
            <label class="form-label" for="auth-name">Nombre Completo</label>
            <input type="text" id="auth-name" class="form-input" placeholder="Ej. Sofía Martínez" required />
          </div>
        ` : ''}

        <div class="form-group">
          <label class="form-label" for="auth-email">Correo Electrónico</label>
          <input type="email" id="auth-email" class="form-input" placeholder="tu-correo@ejemplo.com" required value="sofia.martinez@aurastudio.com" />
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="form-label" for="auth-password">Contraseña</label>
            ${currentMode === 'login' ? `
              <button type="button" id="auth-forgot-link" style="font-size: 0.78rem; color: var(--text-accent); text-decoration: underline; background: none; border: none; cursor: pointer;">
                ¿Olvidaste tu contraseña?
              </button>
            ` : ''}
          </div>
          <div style="position: relative;">
            <input type="password" id="auth-password" class="form-input" placeholder="••••••••" required value="aura2026pass" style="padding-right: 40px;" />
            <button type="button" id="toggle-password-btn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted);">
              <i data-lucide="eye" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>

        ${currentMode === 'register' ? `
          <!-- Indicador de Fuerza de Contraseña -->
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.3rem;">
              <span>Seguridad de contraseña:</span>
              <span id="pwd-strength-label" style="color: #10b981; font-weight: 700;">Segura</span>
            </div>
            <div style="height: 4px; background: var(--border-subtle); border-radius: var(--radius-full); overflow: hidden;">
              <div id="pwd-strength-bar" style="width: 85%; height: 100%; background: #10b981; transition: width 0.3s ease;"></div>
            </div>
          </div>

          <div style="margin-bottom: 1.25rem; font-size: 0.8rem; color: var(--text-secondary);">
            <label style="display: flex; align-items: flex-start; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" id="auth-terms" checked required style="margin-top: 2px;" />
              <span>Acepto los <a href="#" id="auth-terms-link" style="text-decoration: underline; color: var(--text-primary);">Términos y Condiciones</a> y la Política de Privacidad.</span>
            </label>
          </div>
        ` : `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; font-size: 0.82rem;">
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" id="auth-remember" checked />
              <span>Recordar mi sesión</span>
            </label>
          </div>
        `}

        <div id="auth-error-feedback" style="font-size: 0.82rem; color: #ef4444; margin-bottom: 1rem; display: none;"></div>

        <button type="submit" class="btn btn-primary btn-block btn-lg" id="auth-submit-btn">
          ${currentMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gratuita'}
        </button>
      </form>
    `;
  }

  function getForgotHTML() {
    return `
      <div>
        <button type="button" id="auth-back-to-login" style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem; background: none; border: none; cursor: pointer;">
          <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Volver a Iniciar Sesión
        </button>

        <h3 style="margin-bottom: 0.5rem; font-size: 1.4rem;">Recuperar Contraseña</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace seguro para restablecer tu contraseña.
        </p>

        <form id="auth-forgot-form">
          <div class="form-group">
            <label class="form-label" for="forgot-email">Correo Electrónico Registrado</label>
            <input type="email" id="forgot-email" class="form-input" placeholder="tu-correo@ejemplo.com" required value="sofia.martinez@aurastudio.com" />
          </div>

          <div id="forgot-feedback" style="font-size: 0.85rem; color: #10b981; margin-bottom: 1rem; display: none;"></div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" id="forgot-submit-btn">
            Enviar Enlace de Recuperación
          </button>
        </form>
      </div>
    `;
  }

  function render() {
    container.innerHTML = getHTML();
    if (window.lucide) window.lucide.createIcons();
    attachListeners();
  }

  function attachListeners() {
    // Close button & backdrop
    container.querySelector('#auth-close-btn')?.addEventListener('click', () => {
      store.closeAuth();
    });

    container.querySelector('#auth-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'auth-modal-overlay') store.closeAuth();
    });

    // Tab switching
    container.querySelector('#tab-btn-login')?.addEventListener('click', () => {
      currentMode = 'login';
      render();
    });

    container.querySelector('#tab-btn-register')?.addEventListener('click', () => {
      currentMode = 'register';
      render();
    });

    container.querySelector('#auth-forgot-link')?.addEventListener('click', () => {
      currentMode = 'forgot';
      render();
    });

    container.querySelector('#auth-back-to-login')?.addEventListener('click', () => {
      currentMode = 'login';
      render();
    });

    // Toggle password visibility
    const togglePwdBtn = container.querySelector('#toggle-password-btn');
    const pwdInput = container.querySelector('#auth-password');
    if (togglePwdBtn && pwdInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPassword = pwdInput.type === 'password';
        pwdInput.type = isPassword ? 'text' : 'password';
        togglePwdBtn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" style="width: 18px; height: 18px;"></i>`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Social Login Simulation (Google & Apple)
    container.querySelector('#social-google-btn')?.addEventListener('click', () => {
      simulateSocialLogin('Google');
    });

    container.querySelector('#social-apple-btn')?.addEventListener('click', () => {
      simulateSocialLogin('Apple');
    });

    function simulateSocialLogin(provider) {
      const socialUser = provider === 'Google'
        ? { name: 'Sofía Martínez', email: 'sofia.martinez@gmail.com' }
        : { name: 'Carlos Mendoza', email: 'carlos.mendoza@icloud.com' };

      store.login(socialUser.email, 'social_pass', socialUser.name);
      try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
    }

    // Main Form Submit (Login / Register)
    const mainForm = container.querySelector('#auth-main-form');
    const errorFeedback = container.querySelector('#auth-error-feedback');
    const submitBtn = container.querySelector('#auth-submit-btn');

    if (mainForm) {
      mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = container.querySelector('#auth-email')?.value;
        const password = container.querySelector('#auth-password')?.value;
        const name = container.querySelector('#auth-name')?.value || '';

        if (!Security.isValidEmail(email)) {
          showError('Por favor, ingresa un correo electrónico válido.');
          return;
        }

        if (!password || password.length < 6) {
          showError('La contraseña debe tener al menos 6 caracteres.');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = currentMode === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...';

        setTimeout(() => {
          if (currentMode === 'login') {
            store.login(email, password, name);
          } else {
            store.register(name, email, password);
          }
          try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
        }, 600);
      });
    }

    function showError(msg) {
      if (errorFeedback) {
        errorFeedback.textContent = msg;
        errorFeedback.style.display = 'block';
      }
    }

    // Forgot Password Form Submit
    const forgotForm = container.querySelector('#auth-forgot-form');
    const forgotFeedback = container.querySelector('#forgot-feedback');
    if (forgotForm && forgotFeedback) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        forgotFeedback.textContent = '✓ Te hemos enviado un enlace de recuperación. Revisa tu bandeja de entrada.';
        forgotFeedback.style.display = 'block';
      });
    }
  }

  render();
}
