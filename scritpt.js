// ============================================
// AI CHATBOT FOR FASHION HUT GARMENTS
// ============================================
// Add this entire code block to your existing script.js file
// This creates an intelligent chatbot that answers questions about the website

// Chatbot configuration
const chatbotConfig = {
  name: "Fashion Assistant",
  avatar: "👗",
  welcomeMessage: "Hello! I'm your Fashion Assistant. Ask me anything about Fashion Hut Garments!",
  primaryColor: "#c87e3a",
  position: "bottom-right"
};

// Knowledge base for the chatbot (all information about the website)
const chatbotKnowledge = {
  // Store information
  storeName: "Fashion Hut Garments",
  owner: "Raman Nayyar",
  location: "Main Bazar street 1 near elementary school , Garhshankar, Punjab - 144527",
  whatsapp: "+91 84371 72895",
  instagram: "@fash_ionvision",
  instagramUrl: "https://www.instagram.com/fash_ionvision",
  whatsappUrl: "https://wa.me/918437172895",
  
  // Products and services
  products: [
    "Men's ethnic wear (Kurtas, Sherwanis)",
    "Women's traditional wear (Sarees, Kurtis, Suits)",
    "Western wear for all ages",
    "Wedding collection",
    "Festive special outfits",
    "Cotton summer collection",
    "Winter layering clothes",
    "Premium garment collection"
  ],
  
  // Business hours
  businessHours: "Monday to Saturday: 10:00 AM - 8:00 PM | Sunday: Closed",
  
  // FAQs
  faqs: {
    "what products do you sell": "We offer Men's ethnic wear, Women's traditional wear (Sarees, Kurtis, Suits), Western wear, Wedding collection, Festive outfits, Cotton summer collection, and Winter layering clothes.",
    "where is your store located": "Our store is located at Main Bazar street 1 near elementary school , Garhshankar, Punjab - 144527.",
    "what are your business hours": "We are open Monday to Saturday from 10:00 AM to 8:00 PM. We remain closed on Sundays.",
    "who is the owner": "The owner and founder of Fashion Hut Garments is Mr. Raman Nayyar.",
    "how to contact": "You can contact us via WhatsApp at +91 84371 72895 or Instagram at @fash_ionvision.",
    "do you have wedding collection": "Yes! We have an exclusive wedding collection including bridal wear, groom wear, and family outfits.",
    "do you have cotton clothes": "Yes, we have a special cotton summer collection perfect for hot weather.",
    "what is your instagram": "Our Instagram handle is @fash_ionvision. You can follow us for latest updates and offers.",
    "do you offer online shopping": "You can browse our collection on Instagram @fash_ionvision and contact us via WhatsApp for orders.",
    "customization available": "Yes, we offer customization for special occasions. Contact us on WhatsApp for details.",
    "return policy": "Please contact us directly on WhatsApp for return and exchange policy information.",
    "new arrivals": "We regularly update our collection. Follow @fash_ionvision on Instagram for new arrival announcements!"
  },
  
  // Keywords mapping for better matching
  keywords: {
    "product": "what products do you sell",
    "products": "what products do you sell",
    "sell": "what products do you sell",
    "location": "where is your store located",
    "address": "where is your store located",
    "store": "where is your store located",
    "timing": "what are your business hours",
    "time": "what are your business hours",
    "hours": "what are your business hours",
    "open": "what are your business hours",
    "owner": "who is the owner",
    "founder": "who is the owner",
    "contact": "how to contact",
    "phone": "how to contact",
    "whatsapp": "how to contact",
    "wedding": "do you have wedding collection",
    "cotton": "do you have cotton clothes",
    "summer": "do you have cotton clothes",
    "instagram": "what is your instagram",
    "online": "do you offer online shopping",
    "shop": "do you offer online shopping",
    "custom": "customization available",
    "customize": "customization available",
    "return": "return policy",
    "exchange": "return policy",
    "new": "new arrivals",
    "arrival": "new arrivals",
    "latest": "new arrivals"
  }
};

// Create and inject chatbot HTML/CSS into the page
function createChatbot() {
  // Create chatbot container
  const chatbotHTML = `
    <div id="chatbot-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; font-family: 'Inter', sans-serif;">
      <!-- Chatbot Button -->
      <div id="chatbot-toggle" style="
        width: 60px;
        height: 60px;
        background: ${chatbotConfig.primaryColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      ">
        <span style="font-size: 30px;">${chatbotConfig.avatar}</span>
      </div>
      
      <!-- Chatbot Window (hidden by default) -->
      <div id="chatbot-window" style="
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
      ">
        <!-- Chatbot Header -->
        <div style="
          background: ${chatbotConfig.primaryColor};
          color: white;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          <span style="font-size: 28px;">${chatbotConfig.avatar}</span>
          <div style="flex: 1;">
            <strong style="font-size: 16px;">${chatbotConfig.name}</strong>
            <p style="font-size: 11px; margin: 0; opacity: 0.9;">Online • Ready to help</p>
          </div>
          <button id="chatbot-close" style="
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
          ">&times;</button>
        </div>
        
        <!-- Chat Messages Area -->
        <div id="chatbot-messages" style="
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background: #f9f5f0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        "></div>
        
        <!-- Quick Reply Buttons -->
        <div id="quick-replies" style="
          padding: 10px;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        ">
          <button class="quick-reply-btn" data-question="What products do you sell?">🛍️ Products</button>
          <button class="quick-reply-btn" data-question="Where is your store located?">📍 Location</button>
          <button class="quick-reply-btn" data-question="What are your business hours?">⏰ Hours</button>
          <button class="quick-reply-btn" data-question="How to contact?">📞 Contact</button>
        </div>
        
        <!-- Chat Input Area -->
        <div style="
          padding: 10px;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
        ">
          <input type="text" id="chatbot-input" placeholder="Ask me anything..." style="
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
          ">
          <button id="chatbot-send" style="
            background: ${chatbotConfig.primaryColor};
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
          ">➤</button>
        </div>
      </div>
    </div>
    
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .message-bubble {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        animation: fadeIn 0.3s ease;
      }
      
      .user-message {
        background: ${chatbotConfig.primaryColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      
      .bot-message {
        background: white;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      .quick-reply-btn {
        background: #f0e6dc;
        border: none;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        color: #6b3f1c;
      }
      
      .quick-reply-btn:hover {
        background: ${chatbotConfig.primaryColor};
        color: white;
      }
      
      #chatbot-messages::-webkit-scrollbar {
        width: 5px;
      }
      
      #chatbot-messages::-webkit-scrollbar-track {
        background: #f0e6dc;
      }
      
      #chatbot-messages::-webkit-scrollbar-thumb {
        background: ${chatbotConfig.primaryColor};
        border-radius: 5px;
      }
    </style>
  `;
  
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  
  // Get elements
  const toggleBtn = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const inputField = document.getElementById('chatbot-input');
  const messagesContainer = document.getElementById('chatbot-messages');
  
  // Add welcome message
  addBotMessage(chatbotConfig.welcomeMessage);
  
  // Toggle chatbot window
  toggleBtn.addEventListener('click', () => {
    if (chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '') {
      chatbotWindow.style.display = 'flex';
      toggleBtn.style.animation = 'none';
    } else {
      chatbotWindow.style.display = 'none';
    }
  });
  
  // Close chatbot
  closeBtn.addEventListener('click', () => {
    chatbotWindow.style.display = 'none';
  });
  
  // Send message function
  function sendMessage() {
    const message = inputField.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    addUserMessage(message);
    inputField.value = '';
    
    // Get bot response
    setTimeout(() => {
      const response = getBotResponse(message);
      addBotMessage(response);
    }, 500);
  }
  
  // Add user message to chat
  function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-bubble user-message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }
  
  // Add bot message to chat
  function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-bubble bot-message';
    messageDiv.innerHTML = message;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }
  
  // Scroll to bottom of chat
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Get bot response based on user input
  function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/hello|hi|hey|namaste|good morning|good evening/)) {
      return "👋 Hello! Welcome to Fashion Hut Garments! How can I help you today?";
    }
    
    // Check for thanks
    if (lowerMessage.match(/thank|thanks|thx/)) {
      return "😊 You're welcome! Feel free to ask if you need anything else. Happy shopping!";
    }
    
    // Check for goodbye
    if (lowerMessage.match(/bye|goodbye|see you|exit/)) {
      return "👋 Goodbye! Visit us again at Fashion Hut Garments. Have a great day!";
    }
    
    // Check for help
    if (lowerMessage.match(/help|what can you do|how to use/)) {
      return "🤖 I can help you with:\n• Product information\n• Store location and timings\n• Contact details\n• Wedding collection\n• New arrivals\nJust ask me anything about Fashion Hut Garments!";
    }
    
    // Match keywords to FAQs
    for (const [keyword, question] of Object.entries(chatbotKnowledge.keywords)) {
      if (lowerMessage.includes(keyword)) {
        return chatbotKnowledge.faqs[question] || "I'll help you with that! Please contact us directly on WhatsApp for more details.";
      }
    }
    
    // Direct FAQ matching
    for (const [question, answer] of Object.entries(chatbotKnowledge.faqs)) {
      if (lowerMessage.includes(question) || question.includes(lowerMessage)) {
        return answer;
      }
    }
    
    // Default response for unknown queries
    return `📌 I'm not sure about that. Here's what I can help with:\n\n📍 Store Location: ${chatbotKnowledge.location}\n📞 WhatsApp: ${chatbotKnowledge.whatsapp}\n📷 Instagram: ${chatbotKnowledge.instagram}\n\nOr ask me about products, timings, wedding collection, etc.!`;
  }
  
  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Quick reply buttons
  document.querySelectorAll('.quick-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question');
      addUserMessage(question);
      setTimeout(() => {
        const response = getBotResponse(question);
        addBotMessage(response);
      }, 300);
    });
  });
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createChatbot);
} else {
  createChatbot();
}

// ============================================
// OPTIONAL: Add chatbot customization
// ============================================

// Function to show product catalog in chatbot
function showProductCatalog() {
  let productList = "🛍️ <strong>Our Products:</strong><br><br>";
  chatbotKnowledge.products.forEach(product => {
    productList += "• " + product + "<br>";
  });
  productList += "<br>📞 Contact us on WhatsApp for prices and availability!";
  return productList;
}

// Add product catalog to chatbot knowledge
chatbotKnowledge.faqs["show products"] = showProductCatalog();
chatbotKnowledge.faqs["catalog"] = showProductCatalog();
chatbotKnowledge.faqs["what do you sell"] = showProductCatalog();

// Function to share contact card
function showContactCard() {
  return `
    📱 <strong>Contact Us:</strong><br><br>
    👨‍💼 Owner: ${chatbotKnowledge.owner}<br>
    💬 WhatsApp: <a href="${chatbotKnowledge.whatsappUrl}" target="_blank" style="color: #c87e3a;">${chatbotKnowledge.whatsapp}</a><br>
    📷 Instagram: <a href="${chatbotKnowledge.instagramUrl}" target="_blank" style="color: #c87e3a;">${chatbotKnowledge.instagram}</a><br>
    📍 Location: ${chatbotKnowledge.location}<br><br>
    Click the links to connect with us directly!
  `;
}

chatbotKnowledge.faqs["contact info"] = showContactCard();
chatbotKnowledge.faqs["details"] = showContactCard();

console.log("🤖 AI Chatbot initialized! Ask me about Fashion Hut Garments!");






