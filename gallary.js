// ============================================
// gallery.js - Public Image Gallery
// Reads images from localStorage and displays them
// ============================================
(function () {
  const STORAGE_KEY = 'fh_permanent_images'; // Same key as admin panel

  // Inject basic styles (only if needed)
  function injectStyles() {
    if (document.getElementById('fh-gallery-styles')) return;
    const style = document.createElement('style');
    style.id = 'fh-gallery-styles';
    style.textContent = `
      .fh-gallery-container {
        max-width: 1400px;
        margin: 2rem auto;
        padding: 0 1rem;
        font-family: 'Inter', sans-serif;
      }
      .fh-gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.3rem;
      }
      .fh-gallery-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 8px 18px rgba(0,0,0,0.08);
        transition: transform 0.2s;
      }
      .fh-gallery-card:hover { transform: translateY(-4px); }
      .fh-gallery-card img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        display: block;
      }
      .fh-gallery-empty {
        text-align: center;
        padding: 3rem;
        color: #6f8eaa;
        background: #fafdff;
        border-radius: 2rem;
        grid-column: 1 / -1;
      }
      .fh-gallery-counter {
        background: #deedf7;
        padding: 0.2rem 0.9rem;
        border-radius: 30px;
        font-size: 0.8rem;
        display: inline-block;
      }
    `;
    document.head.appendChild(style);
  }

  // Find or create the gallery section
  function getGalleryContainer() {
    // Use existing #gallery section, or create one at the end of body
    let gallerySection = document.getElementById('gallery');
    if (!gallerySection) {
      gallerySection = document.createElement('section');
      gallerySection.id = 'gallery';
      document.body.appendChild(gallerySection);
    }
    // Ensure a container div exists
    let container = gallerySection.querySelector('.fh-gallery-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'fh-gallery-container';
      gallerySection.appendChild(container);
    }
    return container;
  }

  // Build the gallery UI
  function buildGallery(container) {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;">
        <h2>📸 Our Collection</h2>
        <span class="fh-gallery-counter" id="fhImageCounter">0 images</span>
      </div>
      <div class="fh-gallery-grid" id="fhImageGrid">
        <div class="fh-gallery-empty">✨ No images yet — admin will add them soon ✨</div>
      </div>
    `;
    return {
      grid: document.getElementById('fhImageGrid'),
      counter: document.getElementById('fhImageCounter')
    };
  }

  // Update counter and empty message
  function updateGallery(grid, counter) {
    if (!grid) return;
    const cards = grid.querySelectorAll('.fh-gallery-card');
    const total = cards.length;
    if (total === 0) {
      counter.textContent = '0 images';
      if (!grid.querySelector('.fh-gallery-empty')) {
        const empty = document.createElement('div');
        empty.className = 'fh-gallery-empty';
        empty.textContent = '✨ No images yet — admin will add them soon ✨';
        grid.appendChild(empty);
      }
    } else {
      const empty = grid.querySelector('.fh-gallery-empty');
      if (empty) empty.remove();
      counter.textContent = `${total} ${total === 1 ? 'image' : 'images'}`;
    }
  }

  // Add a single image card
  function addImage(src, altText, grid, counter, save = false) {
    if (!grid) return;
    const empty = grid.querySelector('.fh-gallery-empty');
    if (empty) empty.remove();

    const card = document.createElement('div');
    card.className = 'fh-gallery-card';
    const img = document.createElement('img');
    img.src = src;
    img.alt = altText || 'Gallery image';
    img.onerror = () => {
      card.remove();
      updateGallery(grid, counter);
    };
    card.appendChild(img);
    grid.appendChild(card);
    updateGallery(grid, counter);

    // No remove button for public gallery
  }

  // Load all images from localStorage
  function loadImages(grid, counter) {
    const images = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    images.forEach(img => addImage(img.url, img.name, grid, counter, false));
  }

  // Initialise everything
  function init() {
    injectStyles();
    const container = getGalleryContainer();
    const { grid, counter } = buildGallery(container);
    loadImages(grid, counter);
    console.log('✅ Gallery ready – sharing images from admin panel');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();