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
      .fh-gallery-loading {
        background: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 180px;
        border-radius: 20px;
      }
      .fh-gallery-error {
        background: #ffe6e6;
        padding: 1rem;
        border-radius: 20px;
        color: #c00;
        font-size: 0.9rem;
        text-align: center;
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
    const cards = grid.querySelectorAll('.fh-gallery-card:not(.fh-gallery-error)');
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

  // Validate and sanitize image URL
  function isValidImageUrl(url) {
    try {
      const urlObj = new URL(url);
      return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname) || 
             urlObj.hostname.includes('cloudinary') ||
             urlObj.hostname.includes('imgur') ||
             urlObj.hostname.includes('imgur.com');
    } catch (e) {
      return false;
    }
  }

  // Add a single image card
  function addImage(src, altText, grid, counter, save = false) {
    if (!grid || !src) return;

    // Validate URL before adding
    if (!isValidImageUrl(src)) {
      console.warn('⚠️ Invalid image URL:', src);
      return;
    }

    const empty = grid.querySelector('.fh-gallery-empty');
    if (empty) empty.remove();

    const card = document.createElement('div');
    card.className = 'fh-gallery-card';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = altText || 'Gallery image';
    img.crossOrigin = 'anonymous'; // Enable CORS
    
    img.onload = () => {
      card.classList.remove('fh-gallery-loading');
      updateGallery(grid, counter);
      console.log('✅ Image loaded:', src);
    };
    
    img.onerror = () => {
      console.error('❌ Failed to load image:', src);
      card.remove();
      updateGallery(grid, counter);
    };
    
    card.appendChild(img);
    card.classList.add('fh-gallery-loading');
    grid.appendChild(card);
  }

  // Load all images from localStorage
  function loadImages(grid, counter) {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const images = JSON.parse(storedData || '[]');
      
      if (!Array.isArray(images) || images.length === 0) {
        console.log('ℹ️ No images found in localStorage');
        return;
      }
      
      console.log(`📸 Loading ${images.length} images...`);
      images.forEach((img, index) => {
        if (img && img.url) {
          addImage(img.url, img.name || `Image ${index + 1}`, grid, counter, false);
        }
      });
    } catch (error) {
      console.error('❌ Error loading images from localStorage:', error);
    }
  }

  // Initialise everything
  function init() {
    try {
      injectStyles();
      const container = getGalleryContainer();
      const { grid, counter } = buildGallery(container);
      loadImages(grid, counter);
      console.log('✅ Gallery ready – sharing images from admin panel');
    } catch (error) {
      console.error('❌ Gallery initialization error:', error);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
