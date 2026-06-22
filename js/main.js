/* ===========================
   KINGDOM VENTURES – MAIN JS
   =========================== */

// === MOBILE MENU TOGGLE ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    if (mobileMenu.classList.contains('open')) {
      icon.className = 'fa fa-times';
    } else {
      icon.className = 'fa fa-bars';
    }
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelector('i').className = 'fa fa-bars';
    });
  });
}

// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 80) {
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  } else {
    navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
  }
  lastScroll = currentScroll;
});

// === INTERSECTION OBSERVER – SCROLL ANIMATIONS ===
const animateElements = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-scale');

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// === STATS COUNTER ANIMATION ===
function animateCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(el => {
    const text = el.textContent.trim();
    // Check if it's a numeric value
    const num = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return;

    const suffix = text.replace(/[0-9]/g, '');
    let current = 0;
    const increment = Math.ceil(num / 40);
    const duration = 1500;
    const stepTime = Math.floor(duration / 40);

    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, stepTime);
  });
}

// Trigger counter animation when stats bar comes into view
const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsBar);
}

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

// === NEWSLETTER FORM SUBMIT ===
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    if (input && input.value.trim()) {
      const originalBtn = this.querySelector('.newsletter-btn');
      if (originalBtn) {
        originalBtn.innerHTML = '<i class="fa fa-check"></i>';
        setTimeout(() => {
          originalBtn.innerHTML = '<i class="fa fa-arrow-right"></i>';
        }, 2000);
      }
      input.value = '';
    }
  });
}

// === LEADERSHIP CAROUSEL DOTS ===
const dots = document.querySelectorAll('.leaders-dots .dot');
const leadersGrid = document.querySelector('.leaders-grid');
if (dots.length && leadersGrid) {
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      // Simple scroll effect
      const scrollAmount = index * 220;
      leadersGrid.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    });
  });
}

// === TYPING EFFECT FOR HERO SUBTITLE ===
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  // Wait for page load, then start typing
  setTimeout(type, 1500);
}

const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
  // Commented out by default - uncomment to enable typing effect
  // typeWriter(heroDesc, 'Kingdom Ventures is a diversified corporate group engaged in Technology, Education, Manufacturing, Lifestyle, Infrastructure and Strategic Investments.');
}

console.log('Kingdom Ventures - Website Loaded Successfully!');