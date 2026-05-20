/**
 * Fashion Hut Garments – Public Gallery + Chatbot
 * (Admin login & upload features removed)
 * Images are loaded from localStorage (if any were saved previously).
 */

(function() {
    // ============================================
    // CONFIGURATION (admin stuff removed)
    // ============================================
    // (no API keys or credentials needed anymore)

    // ============================================
    // INJECT STYLES (simplified, only gallery + chatbot styles)
    // ============================================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fh-public-gallery {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                margin: 2rem auto;
                max-width: 1400px;
                padding: 0 1rem;
            }
            .fh-image-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 1.3rem;
            }
            .fh-image-card {
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 8px 18px rgba(0,0,0,0.08);
            }
            .fh-image-card img {
                width: 100%;
                aspect-ratio: 1 / 1;
                object-fit: cover;
            }
            .fh-empty-message {
                text-align: center;
                padding: 3rem;
                color: #6f8eaa;
                grid-column: 1 / -1;
                background: #fafdff;
                border-radius: 2rem;
            }
            .fh-image-counter {
                background: #deedf7;
                padding: 0.2rem 0.9rem;
                border-radius: 30px;
                font-size: 0.8rem;
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // PUBLIC GALLERY FUNCTIONS
    // ============================================
    let publicGrid, publicCounter;

    function updatePublicCounter() {
        const cards = publicGrid.querySelectorAll('.fh-image-card');
        const total = cards.length;
        if (total === 0) {
            publicCounter.textContent = '0 images';
            if (!publicGrid.querySelector('.fh-empty-message')) {
                const empty = document.createElement('div');
                empty.className = 'fh-empty-message';
                empty.textContent = '✨ No images yet ✨';
                publicGrid.appendChild(empty);
            }
        } else {
            const empty = publicGrid.querySelector('.fh-empty-message');
            if (empty) empty.remove();
            publicCounter.textContent = `${total} ${total === 1 ? 'image' : 'images'}`;
        }
    }

    function addImageToGallery(src, altText = 'image') {
        const empty = publicGrid.querySelector('.fh-empty-message');
        if (empty) empty.remove();

        const card = document.createElement('div');
        card.className = 'fh-image-card';
        const img = document.createElement('img');
        img.src = src;
        img.alt = altText;
        img.onerror = () => {
            card.remove();
            updatePublicCounter();
        };
        card.appendChild(img);
        publicGrid.appendChild(card);
        updatePublicCounter();
    }

    // ============================================
    // PERMANENT STORAGE (just for loading, no saving)
    // ============================================
    function loadAllImages() {
        const images = JSON.parse(localStorage.getItem('fh_permanent_images') || '[]');
        images.forEach(img => addImageToGallery(img.url, img.name));
    }

    // ============================================
    // BUILD UI – only public gallery + chatbot
    // ============================================
    function buildUI() {
        const appDiv = document.createElement('div');
        appDiv.id = 'fh-app';

        // Public Gallery
        const publicGallery = document.createElement('div');
        publicGallery.className = 'fh-public-gallery';
        publicGallery.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;">
                <h2>📸 Our Image Collection</h2>
                <div id="fhImageCounterPublic" class="fh-image-counter">0 images</div>
            </div>
            <div id="fhImageGridPublic" class="fh-image-grid">
                <div class="fh-empty-message">✨ No images yet ✨</div>
            </div>
        `;
        appDiv.appendChild(publicGallery);
        document.body.appendChild(appDiv);

        publicGrid = document.getElementById('fhImageGridPublic');
        publicCounter = document.getElementById('fhImageCounterPublic');
    }

    // ============================================
    // CHATBOT (unchanged)
    // ============================================
    function createChatbot() {
        const chatbotHTML = `
            <div id="fh-chatbot-container" style="position:fixed; bottom:20px; right:20px; z-index:1000;">
                <div id="fh-chatbot-toggle" style="width:60px; height:60px; background:#c87e3a; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.2);">
                    <span style="font-size:30px;">👗</span>
                </div>
                <div id="fh-chatbot-window" style="position:absolute; bottom:80px; right:0; width:350px; height:500px; background:white; border-radius:20px; box-shadow:0 10px 40px rgba(0,0,0,0.2); display:none; flex-direction:column; overflow:hidden;">
                    <div style="background:#c87e3a; color:white; padding:15px; display:flex; align-items:center; gap:10px;">
                        <span style="font-size:28px;">👗</span>
                        <div style="flex:1;"><strong>Fashion Assistant</strong><p style="font-size:11px; margin:0;">Online • Ready to help</p></div>
                        <button id="fh-chatbot-close" style="background:none; border:none; color:white; font-size:20px; cursor:pointer;">&times;</button>
                    </div>
                    <div id="fh-chatbot-messages" style="flex:1; overflow-y:auto; padding:15px; background:#f9f5f0; display:flex; flex-direction:column; gap:10px;"></div>
                    <div style="padding:10px; background:white; border-top:1px solid #eee; display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="fh-qr" data-q="What products do you sell?">🛍️ Products</button>
                        <button class="fh-qr" data-q="Where is your store located?">📍 Location</button>
                        <button class="fh-qr" data-q="What are your business hours?">⏰ Hours</button>
                        <button class="fh-qr" data-q="How to contact?">📞 Contact</button>
                    </div>
                    <div style="padding:10px; background:white; border-top:1px solid #eee; display:flex; gap:10px;">
                        <input type="text" id="fh-chatbot-input" placeholder="Ask me anything..." style="flex:1; padding:10px; border:1px solid #ddd; border-radius:25px;">
                        <button id="fh-chatbot-send" style="background:#c87e3a; color:white; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer;">➤</button>
                    </div>
                </div>
            </div>
            <style>
                .fh-message-bubble { max-width:80%; padding:10px 14px; border-radius:18px; font-size:14px; margin:4px 0; }
                .fh-user-message { background:#c87e3a; color:white; align-self:flex-end; border-bottom-right-radius:4px; }
                .fh-bot-message { background:white; color:#333; align-self:flex-start; border-bottom-left-radius:4px; box-shadow:0 1px 2px rgba(0,0,0,0.1); }
                .fh-qr { background:#f0e6dc; border:none; padding:6px 12px; border-radius:20px; font-size:12px; cursor:pointer; color:#6b3f1c; }
                .fh-qr:hover { background:#c87e3a; color:white; }
                #fh-chatbot-messages { display: flex; flex-direction: column; }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);

        const toggle = document.getElementById('fh-chatbot-toggle');
        const windowDiv = document.getElementById('fh-chatbot-window');
        const close = document.getElementById('fh-chatbot-close');
        const send = document.getElementById('fh-chatbot-send');
        const input = document.getElementById('fh-chatbot-input');
        const messages = document.getElementById('fh-chatbot-messages');

        const responses = {
            products: "We offer Men's ethnic wear, Women's traditional wear (Sarees, Kurtis, Suits), Western wear, Wedding collection, Festive outfits, Cotton summer collection!",
            location: "Main Bazar street 1 near elementary school , Garhshankar, Punjab - 144527",
            hours: "Monday to Saturday: 10:00 AM - 8:00 PM | Sunday: Closed",
            contact: "WhatsApp: +91 84371 72895 | Instagram: @fash_ionvision"
        };

        function addMessage(text, isUser) {
            const div = document.createElement('div');
            div.className = `fh-message-bubble ${isUser ? 'fh-user-message' : 'fh-bot-message'}`;
            div.innerHTML = text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function getReply(msg) {
            const lower = msg.toLowerCase();
            if (lower.includes('product')) return responses.products;
            if (lower.includes('location') || lower.includes('where')) return responses.location;
            if (lower.includes('hour') || lower.includes('timing')) return responses.hours;
            if (lower.includes('contact') || lower.includes('whatsapp')) return responses.contact;
            if (lower.match(/hello|hi|hey/)) return "👋 Hello! Welcome to Fashion Hut Garments! How can I help?";
            if (lower.includes('thank')) return "😊 You're welcome! Happy shopping!";
            return `I can help with:\n- Products\n- Location & Hours\n- Contact info\nAsk me anything!`;
        }

        function sendMessage() {
            const msg = input.value.trim();
            if (!msg) return;
            addMessage(msg, true);
            input.value = '';
            setTimeout(() => addMessage(getReply(msg), false), 300);
        }

        toggle.onclick = () => windowDiv.style.display = windowDiv.style.display === 'none' ? 'flex' : 'none';
        close.onclick = () => windowDiv.style.display = 'none';
        send.onclick = sendMessage;
        input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
        document.querySelectorAll('.fh-qr').forEach(btn => {
            btn.onclick = () => {
                const q = btn.getAttribute('data-q');
                addMessage(q, true);
                setTimeout(() => addMessage(getReply(q), false), 300);
            };
        });
        addMessage("Hello! I'm your Fashion Assistant. Ask me anything about Fashion Hut Garments!", false);
    }

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        injectStyles();
        buildUI();
        loadAllImages();   // loads any images still in localStorage
        createChatbot();
        console.log('✅ Fashion Hut Public Gallery + Chatbot ready!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
