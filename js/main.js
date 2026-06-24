/* ===========================
   KINGDOM VENTURES – MAIN JS
   =========================== */

// === MOBILE MENU TOGGLE ===
(function() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileClose');

  if (!hamburger || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
  });
})();

// === NAVBAR SCROLL EFFECT ===
(function() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 24px rgba(10,22,40,0.14)';
    } else {
      header.style.boxShadow = '0 2px 16px rgba(10,22,40,0.08)';
    }
  });
})();

// === INTERSECTION OBSERVER – SCROLL ANIMATIONS ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .stats-grid .stat-item').forEach(el => observer.observe(el));

// === HERO SLIDESHOW ===
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let current = 0;

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
})();

// === HERO TEXT ANIMATION ===
(function() {
  const heroLines = document.querySelectorAll('.hero-line');
  heroLines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(20px)';
    line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 300 + i * 200);
  });

  const heroDesc = document.querySelector('.hero-desc');
  const heroBtns = document.querySelector('.hero-buttons');
  const heroStrip = document.querySelector('.hero-strip');

  [heroDesc, heroBtns, heroStrip].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 800 + i * 200);
  });
})();

// === STATS COUNTER ANIMATION ===
(function() {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statItems = entry.target.querySelectorAll('.stat-item');
        statItems.forEach(item => {
          const numEl = item.querySelector('.stat-num');
          if (!numEl) return;
          const target = parseInt(numEl.dataset.target);
          if (!target || isNaN(target)) return;

          const suffix = numEl.textContent.replace(/[0-9]/g, '');
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            numEl.textContent = current + suffix;
          }, 30);
          item.classList.add('visible');
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);
})();

// === LEADERSHIP CAROUSEL ===
(function() {
  const track = document.getElementById('leadersTrack');
  const dotsContainer = document.getElementById('leadersDots');
  if (!track || !dotsContainer) return;

  let currentSlide = 0;
  let cards = track.querySelectorAll('.leader-card');
  let cardsPerSlide = 3;
  let autoPlayInterval;

  function getCardsPerSlide() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function updateSlide() {
    cardsPerSlide = getCardsPerSlide();
    const totalSlides = Math.ceil(cards.length / cardsPerSlide);

    while (dotsContainer.children.length < totalSlides) {
      const newDot = document.createElement('span');
      newDot.className = 'dot';
      newDot.dataset.slide = dotsContainer.children.length;
      newDot.addEventListener('click', () => goToSlide(parseInt(newDot.dataset.slide)));
      dotsContainer.appendChild(newDot);
    }
    while (dotsContainer.children.length > totalSlides) {
      dotsContainer.removeChild(dotsContainer.lastChild);
    }

    if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
    if (currentSlide < 0) currentSlide = 0;

    const cardWidth = cards[0].offsetWidth + 16;
    const offset = currentSlide * cardsPerSlide * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;

    const allDots = dotsContainer.querySelectorAll('.dot');
    allDots.forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    resetAutoPlay();
  }

  function nextSlide() {
    cardsPerSlide = getCardsPerSlide();
    const totalSlides = Math.ceil(cards.length / cardsPerSlide);
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlide();
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 4000);
  }

  dotsContainer.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
    });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateSlide, 200);
  });

  setTimeout(updateSlide, 100);
  autoPlayInterval = setInterval(nextSlide, 4000);

  const carousel = document.querySelector('.leaders-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 4000);
    });
  }
})();

// === AI CHAT ASSISTANT ===
(function() {
  const chatBtn = document.getElementById('aiChatBtn');
  const chatWindow = document.getElementById('aiChatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatBody = document.getElementById('chatBody');

  if (!chatBtn || !chatWindow) return;

  // Sample responses
  const responses = {
    'emetria academy': 'Emetria Academy is our education division offering higher education programs, professional training, international certifications, and skill development courses. Visit our Businesses page for more details!',
    'throne recliners': 'Throne Recliners is our luxury lifestyle brand specializing in premium recliners, home theatre seating, and custom furniture. Visit our Businesses page to explore!',
    'ascending software': 'Ascending Software is our technology division specializing in software development, AI solutions, SaaS platforms, and digital transformation services.',
    'career': 'We offer exciting career opportunities across Technology, Education, Manufacturing, and Corporate functions. Visit our Careers page to view current openings!',
    'contact': 'You can reach us at info@kingdomventures.in or call +91 80 1234 5678. Our corporate office is in Bengaluru, India.',
    'investor': 'For investor inquiries, please contact investors@kingdomventures.in. Visit our Investors page for reports, presentations, and governance information.',
    'vision': 'Our vision is to be a globally respected enterprise group that builds sustainable businesses, empowers communities, and creates lasting value through innovation, integrity, and transformational leadership.',
    'mission': 'Our mission is to identify, build, acquire, and nurture high-potential businesses across diverse sectors through strategic investments, operational excellence, and ethical governance.',
    'hello': 'Welcome to Kingdom Ventures! How can I assist you today? You can ask me about our businesses, career opportunities, or contact information.',
    'hi': 'Hello! Welcome to Kingdom Ventures. I\'m your virtual assistant. How may I help you today?'
  };

  function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
    const content = document.createElement('div');
    content.className = 'msg-content';
    content.textContent = text;
    msgDiv.appendChild(content);
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getResponse(input) {
    const lowerInput = input.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    return 'Thank you for your question. For detailed information, please visit our website pages or contact us at info@kingdomventures.in. Our team will be happy to assist you!';
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, true);
    chatInput.value = '';
    setTimeout(() => {
      addMessage(getResponse(text));
    }, 600);
  }

  chatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });

  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  if (chatSend) {
    chatSend.addEventListener('click', handleSend);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Quick reply buttons
  document.querySelectorAll('.chat-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      if (q) {
        addMessage(q, true);
        setTimeout(() => {
          addMessage(getResponse(q));
        }, 600);
      }
    });
  });
})();

// === NEWSLETTER FORM ===
(function() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      if (input && input.value.trim()) {
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        btn.style.background = '#2e7d4f';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
        }, 3000);
        input.value = '';
      }
    });
  }
})();

// === PARTNER FORM ===
(function() {
  const partnerForm = document.getElementById('partnerForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Enquiry Sent!';
      btn.style.background = '#2e7d4f';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 3000);
      this.reset();
    });
  }
})();

// === CONTACT FORM ===
(function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#2e7d4f';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 3000);
      this.reset();
    });
  }
})();

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === SCROLL TO TOP ===
(function() {
  const scrollBtn = document.getElementById('scrollToTop');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

console.log('Kingdom Ventures - Website Loaded Successfully!');
