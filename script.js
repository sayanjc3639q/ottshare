// ====== OTT Plans Data ======
const plans = [
  {
    id: 'netflix',
    title: 'Netflix',
    logo: 'https://cdn-icons-png.flaticon.com/512/5977/5977590.png',
    price: '₹139',
    desc: 'HD streaming for 1 month. Join a group & save big!',
    waMsg: 'Hi, I want to order the Netflix shared plan (₹139) from OTT Share.'
  },
  {
    id: 'prime',
    title: 'Amazon Prime',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Amazon_Prime_logo_%282024%29.svg/250px-Amazon_Prime_logo_%282024%29.svg.png',
    price: '₹70',
    desc: 'Enjoy Prime Video & more. Secure group access.',
    waMsg: 'Hi, I want to order the Amazon Prime shared plan (₹70) from OTT Share.'
  },
  {
    id: 'spotify',
    title: 'Spotify',
    logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green-300x300.png',
    price: '₹35',
    desc: 'Premium music, ad-free. 1 month group plan.',
    waMsg: 'Hi, I want to order the Spotify shared plan (₹35) from OTT Share.'
  },
  {
    id: 'youtube',
    title: 'YouTube Premium',
    logo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    price: '₹60',
    desc: 'Ad-free videos & music. 1 month shared plan.',
    waMsg: 'Hi, I want to order the YouTube Premium shared plan (₹60) from OTT Share.'
  },
  {
    id: 'jiohotstar',
    title: 'Jio Hotstar',
    logo: 'https://play-lh.googleusercontent.com/bp4jknyVZ8yDKhER9thIS1p9MBeU2LABqBX-sO8uaL1h5_keqlgMUmXv-CjfRWaqKw',
    price: '₹60',
    desc: 'Ad-free videos 4K 1 month shared plan.',
    waMsg: 'Hi, I want to order the Jio-Hotstar shared plan (₹60) from OTT Share.'
  }
];

// ====== FAQ Data ======
const faqs = [
  {
    q: "Is this legal and safe?",
    a: "Yes! We only offer group plans as permitted by OTT providers. Your privacy and payment are fully secured."
  },
  {
    q: "How do I receive access after payment?",
    a: "After payment, you’ll get access details via WhatsApp within 10 minutes. Support is available if you need help."
  },
  {
    q: "Can I renew my plan after expiry?",
    a: "Absolutely! We’ll remind you before expiry and you can renew easily at the same low rate."
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI, Paytm, Google Pay, PhonePe, and bank transfer. All payments are secure."
  },
  {
    q: "What if I face issues with my account?",
    a: "Our support team is available 10AM–10PM IST via WhatsApp and Email. We’ll resolve any issues promptly."
  }
];

// ====== DOM Elements ======
const plansGrid = document.getElementById('plansGrid');
const orderModal = document.getElementById('orderModal');
const modalClose = document.getElementById('modalClose');
const agreeTerms = document.getElementById('agreeTerms');
const whatsappRedirect = document.getElementById('whatsappRedirect');
let selectedPlan = null;

// ====== Render Plans ======
plans.forEach(plan => {
  const card = document.createElement('div');
  card.className = 'plan-card';
  card.tabIndex = 0;
  card.innerHTML = `
    <img src="${plan.logo}" alt="${plan.title} Logo" class="plan-logo" />
    <div class="plan-title">${plan.title}</div>
    <div class="plan-price">${plan.price}</div>
    <div class="plan-desc">${plan.desc}</div>
    <button class="btn-primary place-order-btn" data-plan="${plan.id}">Place Order</button>
  `;
  plansGrid.appendChild(card);
});

// ====== Modal Logic ======
function openModal(planId) {
  selectedPlan = plans.find(p => p.id === planId);
  orderModal.classList.add('active');
  agreeTerms.checked = false;
  whatsappRedirect.disabled = true;
  whatsappRedirect.textContent = 'Continue on WhatsApp';
  whatsappRedirect.removeAttribute('data-disabled-until');
  whatsappRedirect.classList.remove('disabled');
  // Focus for accessibility
  setTimeout(() => agreeTerms.focus(), 200);
}

function closeModal() {
  orderModal.classList.remove('active');
  selectedPlan = null;
}

// ====== WhatsApp Redirect Logic ======
function handleWhatsAppRedirect() {
  if (!selectedPlan) return;
  const btn = whatsappRedirect;
  // Prevent repeated clicks
  if (btn.disabled || btn.classList.contains('disabled')) return;

  // WhatsApp API link
  const waNum = "919339183910"; // Change to your WhatsApp number
  const url = `https://wa.me/${waNum}?text=${encodeURIComponent(selectedPlan.waMsg)}`;

  // Disable button for 10s (localStorage based)
  const key = `ottshare_${selectedPlan.id}_redirected`;
  const now = Date.now();
  localStorage.setItem(key, now);

  btn.disabled = true;
  btn.classList.add('disabled');
  btn.textContent = 'Redirected... Please wait';

  window.open(url, '_blank');

  setTimeout(() => {
    btn.disabled = false;
    btn.classList.remove('disabled');
    btn.textContent = 'Continue on WhatsApp';
  }, 10000);
}

// ====== Disable Button If In Cooldown ======
function checkButtonCooldown(planId) {
  const key = `ottshare_${planId}_redirected`;
  const last = localStorage.getItem(key);
  if (last && Date.now() - last < 10000) {
    whatsappRedirect.disabled = true;
    whatsappRedirect.classList.add('disabled');
    whatsappRedirect.textContent = 'Redirected... Please wait';
    setTimeout(() => {
      whatsappRedirect.disabled = false;
      whatsappRedirect.classList.remove('disabled');
      whatsappRedirect.textContent = 'Continue on WhatsApp';
    }, 10000 - (Date.now() - last));
  }
}

// ====== Event Delegation for Plan Cards ======
plansGrid.addEventListener('click', e => {
  const btn = e.target.closest('.place-order-btn');
  if (btn) {
    const planId = btn.getAttribute('data-plan');
    openModal(planId);
    checkButtonCooldown(planId);
  }
});

// Keyboard accessibility for plan cards
plansGrid.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('plan-card')) {
    const btn = e.target.querySelector('.place-order-btn');
    if (btn) btn.click();
  }
});

// Modal close
modalClose.addEventListener('click', closeModal);
orderModal.addEventListener('click', e => {
  if (e.target === orderModal) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && orderModal.classList.contains('active')) closeModal();
});

// Enable WhatsApp button only if terms agreed
agreeTerms.addEventListener('change', () => {
  whatsappRedirect.disabled = !agreeTerms.checked;
});

// WhatsApp redirect
whatsappRedirect.addEventListener('click', handleWhatsAppRedirect);

// ====== FAQ Accordion ======
const faqAccordion = document.getElementById('faqAccordion');
faqs.forEach((faq, idx) => {
  const item = document.createElement('div');
  item.className = 'faq-item';
  item.innerHTML = `
    <div class="faq-question" tabindex="0">
      ${faq.q}
      <span aria-hidden="true">+</span>
    </div>
    <div class="faq-answer">${faq.a}</div>
  `;
  faqAccordion.appendChild(item);
});

// FAQ toggle logic
faqAccordion.addEventListener('click', e => {
  const q = e.target.closest('.faq-question');
  if (q) {
    const item = q.parentElement;
    const open = item.classList.contains('open');
    // Close all
    [...faqAccordion.children].forEach(child => child.classList.remove('open'));
    if (!open) item.classList.add('open');
  }
});

// Keyboard accessibility for FAQ
faqAccordion.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('faq-question')) {
    e.preventDefault();
    e.target.click();
  }
});

// ====== Hamburger Menu ======
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('open');
  // Animate hamburger icon
  hamburger.classList.toggle('active');
});

// Close navbar on link click (mobile)
navbar.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    navbar.classList.remove('open');
    hamburger.classList.remove('active');
  }
});

// ====== Accessibility: Trap focus in modal ======
orderModal.addEventListener('keydown', function(e) {
  if (!orderModal.classList.contains('active')) return;
  const focusables = orderModal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});
