/**
 * Componente Galería Interactiva con Lupa de Zoom y Miniaturas
 */

export function renderProductGallery(product, activeColor) {
  const images = activeColor.images || product.colors[0].images;
  const currentImg = images[0];

  return `
    <div class="gallery-wrapper" id="pdp-gallery-root">
      <!-- Miniaturas -->
      <div class="gallery-thumbs" id="gallery-thumbs-container">
        ${images.map((imgUrl, index) => `
          <div class="thumb-item ${index === 0 ? 'active' : ''}" data-index="${index}" data-img="${imgUrl}">
            <img src="${imgUrl}" alt="${product.name} vista ${index + 1}" />
          </div>
        `).join('')}
      </div>

      <!-- Visor Principal con Lupa de Zoom -->
      <div class="gallery-main-view" id="gallery-zoom-container">
        <img 
          src="${currentImg}" 
          alt="${product.name} en color ${activeColor.name}" 
          class="gallery-main-img" 
          id="main-pdp-image"
        />

        <!-- Capa de Zoom Lens Ampliado -->
        <div class="zoom-lens-result" id="zoom-lens-box"></div>

        <!-- Badges sobre la imagen -->
        <div class="gallery-zoom-badge">
          <i data-lucide="zoom-in"></i> Pasa el cursor para zoom
        </div>

        <div class="gallery-video-tag">
          <i data-lucide="play-circle"></i> Vista 360°
        </div>
      </div>
    </div>
  `;
}

export function initGalleryZoom(container) {
  const zoomBox = container.querySelector('#gallery-zoom-container');
  const mainImg = container.querySelector('#main-pdp-image');
  const lensResult = container.querySelector('#zoom-lens-box');
  const thumbs = container.querySelectorAll('.thumb-item');

  if (!zoomBox || !mainImg || !lensResult) return;

  // Actualizar imagen al hacer clic en miniaturas
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.getAttribute('data-img');
      mainImg.src = newSrc;
      lensResult.style.backgroundImage = `url('${newSrc}')`;
    });
  });

  // Zoom interactivo con cursor
  lensResult.style.backgroundImage = `url('${mainImg.src}')`;

  zoomBox.addEventListener('mouseenter', () => {
    lensResult.style.display = 'block';
    lensResult.style.backgroundImage = `url('${mainImg.src}')`;
  });

  zoomBox.addEventListener('mouseleave', () => {
    lensResult.style.display = 'none';
  });

  zoomBox.addEventListener('mousemove', (e) => {
    const rect = zoomBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    lensResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    lensResult.style.backgroundSize = '220%';
  });
}
