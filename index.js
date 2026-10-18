/* 
   AVINASH VERMA PORTFOLIO — JAVASCRIPT

    */

// Client security notice: All edge operations are routed securely via authenticated serverless functions.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Note: Application initialization is booted at the bottom of the script
   after all datasets (projectsData, achievementsData, resourcesData) and
   helper functions are fully defined. */


/* 
   1. CUSTOM CURSOR — ENHANCED MAGNETIC
 */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouch || prefersReducedMotion) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let followerX = mouseX, followerY = mouseY;
  let isVisible = false;

  cursor.style.left = '0px';
  cursor.style.top = '0px';
  follower.style.left = '0px';
  follower.style.top = '0px';

  // Window-level tracking ensures cursor stays live over modals and overlays
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    if (!isVisible) {
      cursor.style.opacity = '1';
      follower.style.opacity = '0.6';
      cursor.style.display = 'block';
      follower.style.display = 'block';
      isVisible = true;
    }
  }, { passive: true });

  // Keep cursor visible during scroll
  window.addEventListener('scroll', () => {
    if (isVisible) {
      cursor.style.opacity = '1';
      follower.style.opacity = '0.6';
    }
  }, { passive: true });

  // Smooth RAF-based follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Delegated dynamic hover listener (works for static AND dynamic modal elements)
  const hoverSelector = 'a, button, input, textarea, .project-card, .card-fan-item, .resume-visual-card, .res-gallery-pill, .res-nav-btn, .rc-circle-action, .arc-card, .arc-nav-btn, .arc-play-btn, .arc-filter-btn, .arc-btn-pill, .arc-modal-close, .project-modal-close, .arc-pill-dot, .btn, .hobby-card, .stat-card, .floating-skill-icon, .achievement-card, .detail-item, .timeline-card, .filter-btn, .resources-pill-btn, .res-filter-tab, .res-ctrl-btn, .ribbon-card, .ribbon-quick-action';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector)) {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
      isVisible = false;
    }
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '0.6';
    isVisible = true;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
      isVisible = false;
    }
  });
}


/* 
   2. NAVBAR — SCROLL EFFECT
    */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/* 
   3. HAMBURGER MENU (MOBILE)
    */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  function toggleMenu(open) {
    const isOpen = open ?? !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      // Focus first nav link when menu opens
      const firstLink = navLinks.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
  }

  hamburger.addEventListener('click', () => toggleMenu());

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });
}


/* 
   4. TYPING EFFECT — ENHANCED
    */
function initTypingEffect() {
  const greetEl = document.getElementById('typedGreeting');
  const roleEl  = document.getElementById('typedRole');
  const descEl  = document.getElementById('heroDesc');
  if (!greetEl || !roleEl) return;

  const greeting = "Hi, I'm Avinash";
  const roles = [
    'Web Developer',
    'Frontend Developer',
    'C++ Programmer',
    'Java Programmer',
    'Problem Solver',
    'BTech CS Student',
  ];
  const description = "A passionate BTech Computer Science student crafting clean, efficient, and user-friendly web experiences. I turn ideas into interactive digital reality.";

  function setCaret(el, show) {
    let caret = el.parentElement?.querySelector('.type-caret');
    if (!caret) {
      caret = document.createElement('span');
      caret.className = 'type-caret';
      caret.textContent = '|';
      el.insertAdjacentElement('afterend', caret);
    }
    caret.style.display = show ? 'inline' : 'none';
  }

  function typeGreeting(cb) {
    let i = 0;
    setCaret(greetEl, true);
    function tick() {
      const idx = greeting.indexOf('Avinash');
      if (i > idx) {
        greetEl.innerHTML =
          greeting.slice(0, idx) +
          '<span class="highlight">' + greeting.slice(idx, idx + 7) + '</span>' +
          greeting.slice(idx + 7, i);
      } else {
        greetEl.textContent = greeting.slice(0, i);
      }
      i++;
      if (i <= greeting.length) {
        setTimeout(tick, prefersReducedMotion ? 0 : 65);
      } else {
        setTimeout(cb, prefersReducedMotion ? 0 : 300);
      }
    }
    setTimeout(tick, prefersReducedMotion ? 0 : 450);
  }

  // Phase 2: Cycle roles
  function startRoles() {
    setCaret(greetEl, false);
    setCaret(roleEl, true);
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function typeRole() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        roleEl.textContent = currentRole.slice(0, charIndex - 1);
        roleEl.classList.remove('role-shimmer-active');
        charIndex--;
      } else {
        roleEl.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 45 : 85;

      if (!isDeleting && charIndex === currentRole.length) {
        roleEl.classList.add('role-shimmer-active');
        speed = 1800;
        isDeleting = true;
        if (roleIndex === 0 && descEl) {
          setTimeout(() => typeDesc(), 600);
        }
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 300;
      }

      setTimeout(typeRole, prefersReducedMotion ? 0 : speed);
    }
    setTimeout(typeRole, 200);
  }

  function typeDesc() {
    if (!descEl) return;
    let i = 0;
    function tick() {
      descEl.textContent = description.slice(0, i);
      i++;
      if (i <= description.length) {
        setTimeout(tick, prefersReducedMotion ? 0 : 24);
      }
    }
    tick();
  }

  typeGreeting(startRoles);
}



/* 
   9. CONTACT FORM SUBMIT HANDLER
    */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous errors
    clearFormErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate
    let hasError = false;
    if (!name) { showFieldError('name', 'nameError', 'Please enter your name.'); hasError = true; }
    if (!email || !validateEmail(email)) { showFieldError('email', 'emailError', 'Please enter a valid email address.'); hasError = true; }
    if (!message) { showFieldError('message', 'messageError', 'Please enter a message.'); hasError = true; }
    if (hasError) return;

    const sendBtn = document.getElementById('sendBtn');
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;

    try {
      let aiResponse = null;

      // Call secure backend Edge Function (handles input validation, AI acknowledgment, and DB persistence)
      const edgeFunctionUrl = 'https://r4s69m7b.function2.insforge.app/handle-contact';
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.ai_response;
      } else {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Message dispatch failed');
      }

      // Display success feedback
      form.style.display = 'none';
      const formSuccess = document.getElementById('formSuccess');

      const successH3 = formSuccess.querySelector('h3');
      const successP  = formSuccess.querySelector('p');
      if (successH3) successH3.innerText = 'Message Sent Successfully!';
      if (successP)  successP.innerText  = aiResponse || "Thank you for reaching out! Avinash will get back to you shortly.";

      formSuccess.style.display = 'block';

    } catch (err) {
      console.warn('Contact submission notice:', err?.message || err);
      showFieldError('message', 'messageError', 'Sorry, there was an issue sending your message. Please try again or connect directly on LinkedIn.');
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Direct Message';
      sendBtn.disabled = false;
    }
  });

  // Interactive Topic Chips
  const inquiryChips = document.querySelectorAll('.inquiry-chip');
  const subjectInput = document.getElementById('subject');
  if (inquiryChips.length && subjectInput) {
    inquiryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        inquiryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        subjectInput.value = 'Inquiry: ' + chip.dataset.topic;
      });
    });
  }

  // Live Message Character Counter
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('charCounter');
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      charCounter.textContent = `${messageInput.value.length} / 600`;
    });
  }

  // Contact Interactive Copy Buttons
  const copyBtns = document.querySelectorAll('.contact-copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: #4ade80;"></i>';
        setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
      } catch (err) {
        const temp = document.createElement('input');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: #4ade80;"></i>';
        setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
      }
    });
  });

  // Live Local Time Clock for Lucknow (IST)
  function updateContactClock() {
    const clockEl = document.getElementById('contactLocalTime');
    if (!clockEl) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const istTime = now.toLocaleTimeString('en-US', options);
    clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${istTime} (IST / UTC+5:30)`;
  }
  updateContactClock();
  setInterval(updateContactClock, 1000);

  // Reset Form Button (Send Another Message)
  const resetBtn = document.getElementById('resetContactFormBtn');
  if (resetBtn && form) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      const formSuccess = document.getElementById('formSuccess');
      if (formSuccess) formSuccess.style.display = 'none';
      if (charCounter) charCounter.textContent = '0 / 600';
      if (subjectInput) subjectInput.value = 'Inquiry: Full-Time / Internship Opportunity';
      const sendBtn = document.getElementById('sendBtn');
      if (sendBtn) {
        sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Direct Message';
        sendBtn.disabled = false;
      }
    });
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (field) field.classList.add('input-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  document.querySelectorAll('.input-error').forEach(el => {
    el.classList.remove('input-error');
  });
}




/* 
   10. SMOOTH SCROLL FOR ANCHOR LINKS
    */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;
    try {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const offset = (navbar?.offsetHeight || 70) + 10;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    } catch (err) {
      console.debug('Invalid anchor selector:', href);
    }
  });
});


/* 
   11. SCROLL PROGRESS BAR
    */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}


/* 
   12. DARK / LIGHT THEME TOGGLE
    */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (!btn) return;

  // Load saved theme or  preference
  const saved = localStorage.getItem('av-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  setTheme(initial, false);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  function setTheme(theme, animate) {
    if (animate && !prefersReducedMotion) {
      html.classList.add('theme-transitioning');
      setTimeout(() => html.classList.remove('theme-transitioning'), 600);
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem('av-theme', theme);
  }
}




/* 
   14. PARTICLE CANVAS
 */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 45;

  function resize() {
    canvas.width = canvas.offsetWidth || window.innerWidth || 800;
    canvas.height = canvas.offsetHeight || window.innerHeight || 600;
  }

  function mkParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.45 + 0.1,
      color: Math.random() > 0.5 ? '50,205,50' : '0,255,255'
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(50,205,50,${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  particles = Array.from({ length: COUNT }, mkParticle);
  draw();
}




/* 
   16. SKILL BARS — ENHANCED WITH COUNTER
    */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const target = parseInt(fill.getAttribute('data-width'), 10);

      requestAnimationFrame(() => { fill.style.width = target + '%'; });

      // Count-up percentage label
      const pctEl = fill.closest('.skill-bar-item')?.querySelector('.skill-percent');
      if (pctEl) {
        countUp(0, target, 1200, v => { pctEl.textContent = v + '%'; });
      }
      observer.unobserve(fill);
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => { fill.style.width = '0'; observer.observe(fill); });
}


/* 
   17. COUNT-UP ANIMATION
    */
function countUp(from, to, duration, cb) {
  if (prefersReducedMotion) { cb(to); return; }
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    cb(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}



/* 
   18. ACTIVE NAV LINK ON SCROLL & CLICK
    */
function initActiveNavLink() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const navLinksList = document.querySelector('.nav-links');

  if (!sections.length || !navLinks.length) return;

  let pill = document.querySelector('.nav-active-pill');
  if (!pill && navLinksList) {
    pill = document.createElement('div');
    pill.className = 'nav-active-pill';
    navLinksList.appendChild(pill);
  }

  let isClickScrolling = false;
  let clickTimeout = null;

  function updatePill(activeLink) {
    if (!pill || !activeLink || !navLinksList) return;
    const linkRect = activeLink.getBoundingClientRect();
    const parentRect = navLinksList.getBoundingClientRect();
    if (parentRect.width > 0 && linkRect.width > 0) {
      pill.style.left = (linkRect.left - parentRect.left) + 'px';
      pill.style.width = linkRect.width + 'px';
      pill.style.opacity = '1';
    }
  }

  function setActive(targetId) {
    if (!targetId) return;
    let currentActive = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === `#${targetId}` || href.endsWith(`#${targetId}`)) {
        link.classList.add('active');
        currentActive = link;
      } else {
        link.classList.remove('active');
      }
    });

    if (currentActive) {
      updatePill(currentActive);
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      const hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        const id = href.slice(hashIndex + 1);
        if (id) {
          isClickScrolling = true;
          setActive(id);
          clearTimeout(clickTimeout);
          clickTimeout = setTimeout(() => {
            isClickScrolling = false;
            determineActiveSection();
          }, 850);
        }
      }
    });
  });

  function determineActiveSection() {
    if (isClickScrolling) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
    const offset = navbarHeight + 80;

    // Top of page
    if (scrollY < 120) {
      setActive('home');
      return;
    }

    // Bottom of page
    if (scrollY + winHeight >= docHeight - 60) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) setActive(lastSection.id);
      return;
    }

    // Check which section encompasses the offset line
    let activeId = 'home';
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const rect = sec.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom > offset) {
        activeId = sec.id;
        break;
      } else if (rect.top <= offset) {
        activeId = sec.id;
      }
    }

    setActive(activeId);
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        determineActiveSection();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) updatePill(active);
  });

  // Initial update
  setTimeout(() => {
    determineActiveSection();
    const initialActive = document.querySelector('.nav-link.active') || navLinks[0];
    if (initialActive) updatePill(initialActive);
  }, 100);
}


/* 
   19. BACK TO TOP BUTTON
    */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════
   20. PROJECTS DATA & MODAL SYSTEM
   ═══════════════════════════════════════════════════════════ */
const projectsData = [
  {
    id: 'project-ai-studio',
    title: 'Neural Canvas — AI Design Studio',
    category: 'web',
    categoryLabel: 'Web Apps / AI Concept',
    image: 'assets/projects/project_ai_studio.jpg',
    description: 'A futuristic web application and concept studio exploring AI-assisted layout generation, neural interface optimization, and dynamic cyber design components. Built with HTML5, CSS3, and JavaScript.',
    details: 'Neural Canvas is engineered as an experimental generative design environment. It leverages modular algorithmic component trees, intelligent grid restructuring, and cyber-aesthetic shaders to provide real-time canvas layouts. The system features responsive touch-friendly manipulation, automated contrast balancing, and high-performance DOM orchestration.',
    features: [
      'Generative cyber design layout engine with dynamic aspect ratios',
      'Neural palette harmonization and contrast analysis in real time',
      'Interactive component studio with instant preview & code export',
      'Lightweight vanilla JavaScript architecture with zero heavy runtimes'
    ],
    tags: ['AI Design', 'HTML5', 'CSS3', 'JavaScript', 'Generative UI'],
    github: 'https://github.com/avinashverma39',
    demo: 'https://github.com/avinashverma39'
  },
  {
    id: 'project-portfolio',
    title: 'Interactive Dev Showcase & Portfolio Hub',
    category: 'web',
    categoryLabel: 'Web Apps / Portfolio',
    image: 'assets/projects/project_portfolio.jpg',
    description: 'A responsive personal portfolio website featuring dark/light theme switching, custom particle canvas animations, interactive filter categories, and a printable modern CV layout.',
    details: 'Designed from the ground up to reflect senior-grade frontend craft. It combines 60 FPS GPU-accelerated canvas particles, dynamic 3D arc carousels, fluid card fans, an accessible modal architecture, and custom magnetic cursor tracking. Built with clean semantic HTML5 and vanilla CSS custom properties.',
    features: [
      'Dual-theme engine (cyber obsidian dark & clean crisp light mode)',
      'Custom HTML5 Canvas particle network with distance-reactive connectors',
      'Full-stack contact pipeline with AI acknowledgment and database persistence',
      'Comprehensive responsive layout calibrated from 320px mobile to 4K displays'
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'Canvas', 'GSAP'],
    github: 'https://github.com/avinashverma39/portfolio',
    demo: 'https://avinashverma39.github.io/portfolio/'
  },
  {
    id: 'project-bank',
    title: 'Smart Bank & Account Management System',
    category: 'software',
    categoryLabel: 'Software / Java Enterprise',
    image: 'assets/projects/project_bank.jpg',
    description: 'A robust object-oriented software system developed in Java for managing customer accounts, transaction ledgers, balance inquiries, and security checks with modular architecture.',
    details: 'An enterprise-grade Java banking console and ledger management architecture. Built following SOLID object-oriented design principles, custom exception hierarchies, and persistent file I/O record keeping. It features atomic transaction processing, interest calculation engines, and pin verification safeguards.',
    features: [
      'Multi-tier account hierarchy (Savings, Current, Fixed Deposit) using OOP inheritance',
      'Atomic deposit, withdrawal, and inter-account fund transfers with rollback safeguards',
      'Encrypted user authentication and security credential validation',
      'Structured audit logs with date-stamped transaction ledger persistence'
    ],
    tags: ['Java', 'OOP', 'Data Structures', 'File I/O', 'Enterprise Architecture'],
    github: 'https://github.com/avinashverma39/JAVA_PROJECT',
    demo: 'https://github.com/avinashverma39/JAVA_PROJECT'
  },
  {
    id: 'project-weather',
    title: 'Weather Pulse — Live Meteorology Station',
    category: 'web api',
    categoryLabel: 'Web Apps / REST API',
    image: 'assets/projects/project_weather.jpg',
    description: 'A real-time weather analytics web app integrating OpenWeatherMap API with geolocation, dynamic atmospheric metrics, interactive forecasts, and animated status cards.',
    details: 'Weather Pulse provides instant meteorology metrics across global cities. It processes live RESTful weather endpoints with asynchronous fetch pipelines, client-side caching to reduce rate limits, dynamic SVG weather state visualization, and geographic coordinate resolution.',
    features: [
      'Live geolocation query with automatic local climate loading',
      'Dynamic metric tracking: humidity, wind speed, UV index, and barometric pressure',
      'Multi-day predictive forecast charts with interactive temperature trends',
      'Intelligent debounced search with instant city auto-suggestions'
    ],
    tags: ['REST API', 'JavaScript', 'CSS3', 'Asynchronous', 'OpenWeatherMap'],
    github: 'https://github.com/avinashverma39',
    demo: 'https://github.com/avinashverma39'
  },
  {
    id: 'project-calc',
    title: 'Matrix Lab — Scientific Calculator & Solver',
    category: 'web software api',
    categoryLabel: 'Software / Scientific Web',
    image: 'assets/projects/project_calc.jpg',
    description: 'A fully functional scientific calculator and formula solver supporting complex arithmetic, trigonometric graphing, keyboard bindings, and mathematical formula parsing.',
    details: 'Matrix Lab combines an intuitive scientific calculation surface with expression parsing algorithms. Built using the Shunting-Yard tokenization algorithm, it safely evaluates nested arithmetic expressions, trigonometric operations, and exponential curves while preventing arithmetic overflows and NaN errors.',
    features: [
      'Shunting-yard algorithm for infix-to-postfix mathematical expression parsing',
      'Full scientific functionality: trigonometry, logarithms, factorials, and powers',
      'Complete keyboard shortcut support with numeric keypad bindings',
      'Calculation memory store with recallable history ledger'
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Algorithms', 'Parser'],
    github: 'https://github.com/avinashverma39',
    demo: 'https://github.com/avinashverma39'
  },
  {
    id: 'project-todo',
    title: 'FluxFlow — Agile Task & Productivity Hub',
    category: 'web',
    categoryLabel: 'Web Apps / Productivity',
    image: 'assets/projects/project_todo.jpg',
    description: 'A dynamic task management and kanban workflow application with state persistence, priority tagging, categorization filters, and clean responsive micro-interactions.',
    details: 'FluxFlow streamlines sprint planning and personal task productivity. It incorporates state management synchronized with browser LocalStorage, dynamic drag-and-drop category lane reordering, search filtering, and celebratory completion micro-animations.',
    features: [
      'Columnar sprint kanban board with custom priority flags (High, Medium, Low)',
      'Persistent LocalStorage state schema with automatic schema migration',
      'Fast real-time keyword search and tag-based filtering',
      'Progress metrics bar tracking completion velocity and open tickets'
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage', 'Productivity'],
    github: 'https://github.com/avinashverma39',
    demo: 'https://github.com/avinashverma39'
  },
  {
    id: 'project-cpp-game',
    title: 'Number Guessing Game & Algorithmic Logic',
    category: 'software',
    categoryLabel: 'Software / C++ Systems',
    image: '',
    description: 'An interactive number guessing game and logic problem solver built using C++ core concepts, memory management, attempt limits, and terminal user interaction.',
    details: 'A clean demonstration of systems programming fundamentals in modern C++. Incorporates random seed generation, binary search optimal-guess analysis, modular logic functions, and input validation routines preventing buffer invalidation.',
    features: [
      'Dynamic pseudo-random number generator calibrated to configurable difficulty tiers',
      'Algorithmic feedback engine calculating optimal logarithmic search bounds',
      'Robust input stream validation preventing infinite loops on invalid characters',
      'Session scoring system recording top high scores and attempt records'
    ],
    tags: ['C++', 'Console UI', 'Algorithms', 'Game Logic', 'STL'],
    github: 'https://github.com/avinashverma39/CPP_Project',
    demo: 'https://github.com/avinashverma39/CPP_Project'
  }
];

function initProjects() {
  const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const matches = filterVal === 'all' || cat.split(' ').includes(filterVal);

        if (matches) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // Setup Project Modal listeners
  initProjectModal();

  // Attach modal trigger to Details buttons and preview clicks
  document.querySelectorAll('.project-open-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pId = btn.getAttribute('data-project-id');
      if (pId) openProjectModal(pId);
    });
  });

  // Project cards interactive preview and 3D moving tilt animation
  projectCards.forEach(card => {
    const preview = card.querySelector('.project-card-preview');
    if (preview) {
      preview.style.cursor = 'pointer';
      preview.setAttribute('title', 'Click to view project details');
      preview.addEventListener('click', (e) => {
        const pId = card.getAttribute('data-project-id');
        if (pId) {
          e.preventDefault();
          e.stopPropagation();
          openProjectModal(pId);
        }
      });
    }

    // Dynamic 3D mouse movement tilt with smooth GSAP transition
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -6;
      const ry = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 6;
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotationX: rx,
          rotationY: ry,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      } else {
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        card.style.transform = '';
      }
    });
  });
}

function initProjectModal() {
  const overlay = document.getElementById('projectModalOverlay');
  const closeBtn = document.getElementById('projectModalClose');
  if (!overlay) return;

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.style.display = 'none';
      }
    }, 350);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  window.closeProjectModal = closeModal;
}

function openProjectModal(projectId) {
  const overlay = document.getElementById('projectModalOverlay');
  const modalBody = document.getElementById('projectModalBody');
  if (!overlay || !modalBody) return;

  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;

  const featuresHTML = project.features
    ? project.features.map(f => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join('')
    : '';

  const tagsHTML = project.tags
    ? project.tags.map(t => `<span>${t}</span>`).join('')
    : '';

  let imgHTML = '';
  if (project.image) {
    imgHTML = `<div class="project-modal-img-wrap"><img src="${project.image}" alt="${project.title} Preview" /></div>`;
  } else {
    imgHTML = `<div class="project-modal-img-wrap" style="height: 160px; background: linear-gradient(135deg, #111e13, #0a110b);"><i class="devicon-cplusplus-plain colored" style="font-size: 3.5rem;"></i></div>`;
  }

  modalBody.innerHTML = `
    ${imgHTML}
    <div class="project-modal-content">
      <div class="project-modal-meta">
        <span class="project-modal-category"><i class="fa-solid fa-code-branch"></i> ${project.categoryLabel}</span>
      </div>
      <h3 class="project-modal-title">${project.title}</h3>
      <p class="project-modal-desc">${project.details || project.description}</p>
      
      ${featuresHTML ? `
        <div class="project-modal-section-title"><i class="fa-solid fa-layer-group"></i> Key Engineering Highlights</div>
        <ul class="project-modal-features">${featuresHTML}</ul>
      ` : ''}

      <div class="project-modal-section-title"><i class="fa-solid fa-microchip"></i> Technologies &amp; Architecture</div>
      <div class="project-modal-tags">${tagsHTML}</div>

      <div class="project-modal-actions">
        ${project.demo && project.demo !== '#' ? `
          <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo / Preview
          </a>
        ` : ''}
        ${project.github && project.github !== '#' ? `
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
            <i class="fa-brands fa-github"></i> GitHub Code
          </a>
        ` : ''}
      </div>
    </div>
  `;

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    overlay.focus();
  });
}

window.openProjectModal = openProjectModal;


/* 
   22. ACHIEVEMENTS & CERTIFICATES — DATA & 3D FAN GALLERY
    */

/* ── Achievement Data — Add your own entries here ─── */
const achievementsData = [
  {
    id: 'cert-c-datastructures',
    title: 'C Data Structures Certificate',
    category: 'certificate',
    organization: 'MindLuster',
    date: 'Sept 2026',
    description: 'Earned Certificate of Achievement for successfully completing C Datastructures course covering data structures, algorithmic memory concepts, arrays, pointers, and problem-solving.',
    skills: ['C', 'Data Structures', 'Algorithms', 'MindLuster'],
    quote: 'Data structures and algorithms are the bedrock of computational problem-solving. Master memory, logic, and complexity, and every system becomes solvable.',
    quoteAuthor: 'Foundational CS Principle',
    image: 'assets/certificates/mindluster_c_datastructures.jpg', 
    credentialUrl: 'https://www.mindluster.com/certified/download_pdf/59a99309',
    credentialId: 'a64d5303'
  },
  {
    id: 'course-webdev',
    title: 'Complete Web Development Course',
    category: 'course',
    organization: 'Udemy (Instructor: Hitesh Choudhary)',
    date: 'Sept 2026',
    description: 'Completed 100 total hours of comprehensive full-stack web development with instructor Hitesh Choudhary, mastering modern HTML5, CSS3, JavaScript ES6+, backend architectures, and AI-assisted workflows.',
    skills: ['Full-Stack Web Dev', 'HTML5 & CSS3', 'JavaScript', 'Hitesh Choudhary', 'Udemy'],
    quote: "Building for the web isn't merely writing code — it is crafting living, intuitive digital experiences that connect and empower people across the world.",
    quoteAuthor: 'Full-Stack Engineering Philosophy',
    image: 'assets/certificates/udemy_web_development.jpg',
    credentialUrl: 'https://ude.my/UC-73f6ec2f-4cbe-43f1-85c4-780bd55cf6a7',
    credentialId: 'UC-73f6ec2f-4cbe-43f1-85c4-780bd55cf6a7'
  },
  {
    id: 'Summer-Internship-JAVA',
    title: 'Summer Internship — JAVA Development',
    category: 'internship',
    organization: 'TechCorp Solutions',
    date: 'Jun 2025',
    description: 'Worked as a JAVA Development Intern building scalable applications, collaborating with senior developers, and delivering Projects using AI-assisted coding tools to enhance productivity and code quality.',
    skills: ['JAVA', 'Team Collaboration', 'AI Tools'],
    quote: 'Great software is engineered through disciplined design, robust modularity, and continuous collaboration. Write code that is clean, resilient, and built to scale.',
    quoteAuthor: 'Software Engineering Principle',
    image: null,
    credentialUrl: '#',
    credentialId: null
  },
  {
    id: 'Hack-2026',
    title: 'RRGI INNOVATHON 2026 — Team Achievers',
    category: 'achievement',
    organization: 'R.R. Group of Institutions (Powered by OLA KRUTRIM & Trainx)',
    date: '2026',
    description: 'Awarded Certificate of Participation with Team Achievers at RR Institute of Modern Technology, Lucknow. Demonstrated exceptional innovation, creativity, and technical excellence solving real-world challenges in hackathon powered by OLA Krutrim and Trainx.',
    skills: ['RRGI Innovathon', 'OLA Krutrim', 'Trainx', 'Hackathon', 'Problem Solving', 'Team Achievers'],
    quote: 'Innovation flourishes when audacious thinking meets relentless execution. In hackathons and in life, a united team turns complex challenges into breakthrough solutions.',
    quoteAuthor: 'Hackathon & Innovation Creed',
    image: 'assets/certificates/rrgi_innovathon_2026.jpg',
    credentialUrl: '#',
    credentialId: 'RRGI-INNOVATHON-2026'
  },
  {
    id: 'course-git',
    title: 'Git & GitHub Masterclass',
    category: 'course',
    organization: 'Simplilearn',
    date: 'Nov 2025',
    description: 'All Basic version control with Git and GitHub including branching strategies, pull requests, collaboration workflows, and CI/CD fundamentals and push code to GitHub repository for real-world project collaboration.',
    skills: ['Git', 'GitHub', 'Version Control'],
    quote: 'Version control is the bedrock of collaborative engineering. Commit with intention, branch with courage, and build software that stands on transparent history.',
    quoteAuthor: 'Open-Source & DevOps Creed',
    image: null,
    credentialUrl: '#',
    credentialId: null
  },
  {
    id: 'award-academic',
    title: 'Academic Excellence — AKTU Merit',
    category: 'achievement',
    organization: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
    date: '2025–26',
    description: 'Secured outstanding academic standing across Semesters 1 & 2 with total score 1417/1800 (78.7%), SGPA 7.95 (Sem 1) and 7.73 (Sem 2), zero backlogs, and top practical grades (A+ in Programming, Engineering Graphics, Electronics & Workshop Labs).',
    skills: ['AKTU', 'SGPA 7.95', 'Marks 1417/1800', 'Computer Science', 'Zero Backlog'],
    quote: 'Academic excellence is the fruit of daily discipline and deep conceptual curiosity. Strong theoretical fundamentals are the launchpad for world-class engineering.',
    quoteAuthor: 'Academic & Analytical Excellence',
    image: 'assets/certificates/aktu_academic_excellence.png',
    credentialUrl: '#',
    credentialId: 'AKTU-SESSION-2025-26'
  },
  {
    id: 'SIH-2026',
    title: 'Smart India Hackathon (SIH) 2026 Finalist',
    category: 'achievement',
    organization: 'Ministry of Education & Innovation Cell, Govt of India',
    date: '2026',
    description: 'National Grand Finale Finalist in Smart India Hackathon 2026 for engineering SmartLearn — an adaptive AI-driven, offline-first learning platform with vernacular voice accessibility to eliminate digital barriers.',
    skills: ['SIH 2026', 'National Finalist', 'AI EdTech', 'IndexedDB', 'WebSockets'],
    quote: 'Technology achieves its highest calling when it solves problems for the grassroots, dismantling barriers and empowering every mind to learn and build without limits.',
    quoteAuthor: 'National Innovation & Impact Mission',
    image: null,
    credentialUrl: '#',
    credentialId: 'SIH-2026-FINALIST'
  }
];

function initAchievements() {
  const fan = document.getElementById('achievementsFan');
  const countersEl = document.getElementById('achievementCounters');
  const filterBtns = document.querySelectorAll('[data-achievement-filter]');
  const viewAllWrap = document.getElementById('achievementsViewAllWrap');
  const viewAllBtn = document.getElementById('achievementsViewAllBtn');

  if (viewAllWrap) {
    viewAllWrap.style.display = 'none';
  }

  /* ── Render Counters ─── */
  renderCounters();

  /* ── Setup Modal ─── */
  initCertModal();

  if (!fan) return;

  /* ── Filter Function ─── */
  function applyFilter(filterVal) {
    filterBtns.forEach(b => {
      if (b.getAttribute('data-achievement-filter') === filterVal) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    const cards = fan.querySelectorAll('.card-fan-item');
    cards.forEach(card => {
      const cat = card.getAttribute('data-category') || '';
      if (filterVal === 'all' || cat === filterVal) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
        card.classList.remove('active');
      }
    });

    if (typeof fan.spreadCards === 'function') {
      fan.spreadCards();
    }
  }

  /* ── Attach Certificate Preview Modal Trigger to Buttons & Card Previews ─── */
  document.querySelectorAll('.achievement-view-cert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-achievement-id');
      if (id) openCertModal(id);
    });
  });

  fan.querySelectorAll('.card-fan-preview').forEach(preview => {
    preview.style.cursor = 'pointer';
    preview.setAttribute('title', 'Click to view full certificate');
    preview.addEventListener('click', (e) => {
      const card = preview.closest('.card-fan-item');
      if (!card) return;
      const id = card.getAttribute('data-achievement-id');
      if (id) {
        e.preventDefault();
        e.stopPropagation();
        openCertModal(id);
      }
    });
  });

  /* ── Setup Filters ─── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filterVal = btn.getAttribute('data-achievement-filter');
      applyFilter(filterVal);
    });
  });

  /* ── Setup View All Button ─── */
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      applyFilter('all');
      fan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ── Render counters and attach filter clicks to pills ─── */
  function renderCounters() {
    if (!countersEl) return;

    const counts = {};
    const labels = {
      certificate: { label: 'Certificates', icon: 'fa-certificate', filter: 'certificate' },
      course: { label: 'Courses', icon: 'fa-book', filter: 'course' },
      internship: { label: 'Internships', icon: 'fa-briefcase', filter: 'internship' },
      achievement: { label: 'Achievements', icon: 'fa-trophy', filter: 'achievement' }
    };

    achievementsData.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });

    const pills = [];
    Object.entries(labels).forEach(([cat, meta], i) => {
      const count = counts[cat] || 0;
      if (count === 0) return;
      if (i > 0 && pills.length > 0) {
        pills.push('<span class="achievement-counter-separator">|</span>');
      }
      pills.push(`
        <div class="achievement-counter-pill" data-counter-filter="${meta.filter}" style="cursor:pointer;" title="Click to filter by ${meta.label}">
          <i class="fa-solid ${meta.icon}"></i>
          <span class="counter-num" data-count="${count}">${count}+</span>
          ${meta.label}
        </div>
      `);
    });

    countersEl.innerHTML = pills.join('');

    // Make counter pills clickable filter shortcuts
    countersEl.querySelectorAll('.achievement-counter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const filterVal = pill.getAttribute('data-counter-filter');
        if (filterVal) applyFilter(filterVal);
      });
    });
  }
}


/* 
   23. CERTIFICATE PREVIEW MODAL
    */
let certModalCurrentZoom = 1;

/* ── Close modal ─── */
function closeCertModal() {
  const overlay = document.getElementById('certModalOverlay');
  const modal = document.querySelector('.cert-modal');
  if (!overlay) return;

  if (document.fullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
  if (modal) modal.classList.remove('is-fullscreen');

  overlay.classList.remove('active');
  document.body.style.overflow = '';
  resetCertZoom();
  setTimeout(() => {
    if (!overlay.classList.contains('active')) {
      overlay.style.display = 'none';
    }
  }, 350);
}

/* ── Zoom helpers ─── */
function zoomCert(delta) {
  const modalImg = document.getElementById('certModalImage');
  const ZOOM_MAX = 2.5;
  const ZOOM_MIN = 0.6;
  certModalCurrentZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Number((certModalCurrentZoom + delta).toFixed(2))));
  if (modalImg) {
    modalImg.style.transform = `scale(${certModalCurrentZoom})`;
    modalImg.classList.toggle('zoomed', certModalCurrentZoom > 1.05);
  }
}

function resetCertZoom() {
  certModalCurrentZoom = 1;
  const modalImg = document.getElementById('certModalImage');
  if (modalImg) {
    modalImg.style.transform = 'scale(1)';
    modalImg.classList.remove('zoomed');
  }
}

/* ── Toggle Fullscreen ─── */
function toggleCertFullscreen() {
  const modal = document.querySelector('.cert-modal');
  if (!modal) return;

  const isFs = modal.classList.contains('is-fullscreen') || !!document.fullscreenElement;
  if (!isFs) {
    modal.classList.add('is-fullscreen');
    if (modal.requestFullscreen) {
      modal.requestFullscreen().catch(() => {});
    } else if (modal.webkitRequestFullscreen) {
      modal.webkitRequestFullscreen();
    }
  } else {
    modal.classList.remove('is-fullscreen');
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }
}

function initCertModal() {
  const overlay = document.getElementById('certModalOverlay');
  const modalImg = document.getElementById('certModalImage');

  if (!overlay) return;

  // Click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCertModal();
  });

  // Keyboard Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeCertModal();
    }
  });

  // Click on image toggles zoom
  if (modalImg) {
    modalImg.addEventListener('click', (e) => {
      e.stopPropagation();
      if (certModalCurrentZoom > 1.05) {
        resetCertZoom();
      } else {
        zoomCert(0.5);
      }
    });
  }
}

/* ── Open modal with achievement data ─── */
function openCertModal(achievementId) {
  const overlay = document.getElementById('certModalOverlay');
  const modalImg = document.getElementById('certModalImage');
  const modalInfo = document.getElementById('certModalInfo');
  const modalBody = overlay ? overlay.querySelector('.cert-modal-body') : null;

  if (!overlay) return;

  const achievement = achievementsData.find(a => a.id === achievementId);
  if (!achievement) return;

  // Reset zoom and scroll to top
  resetCertZoom();
  if (modalBody) modalBody.scrollTop = 0;

  // Set image
  if (achievement.image) {
    modalImg.src = achievement.image;
    modalImg.style.display = 'block';
    modalImg.style.transform = 'scale(1)';
    modalImg.classList.remove('zoomed');
    modalImg.parentElement.querySelector('.achievement-placeholder-img')?.remove();
  } else {
    modalImg.style.display = 'none';
    // Show placeholder in modal
    const wrap = modalImg.parentElement;
    const existing = wrap.querySelector('.achievement-placeholder-img');
    if (!existing) {
      const categoryMeta = {
        certificate: 'fa-certificate',
        course: 'fa-book',
        internship: 'fa-briefcase',
        achievement: 'fa-trophy'
      };
      const icon = categoryMeta[achievement.category] || 'fa-star';
      const placeholder = document.createElement('div');
      placeholder.className = 'achievement-placeholder-img';
      placeholder.style.minHeight = '240px';
      placeholder.innerHTML = `<i class="fa-solid ${icon} placeholder-icon" style="font-size:4.5rem;"></i>
        <span class="placeholder-label">Certificate Preview</span>`;
      wrap.appendChild(placeholder);
    }
  }

  // Set info
  const quoteHTML = achievement.quote
    ? `<div class="cert-modal-quote">
         <div class="cert-modal-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
         <p class="cert-modal-quote-text">"${achievement.quote}"</p>
         ${achievement.quoteAuthor ? `<span class="cert-modal-quote-author">— ${achievement.quoteAuthor}</span>` : ''}
       </div>`
    : '';

  const credentialHTML = achievement.credentialId
    ? `<div class="cert-modal-info-credential"><strong>Credential ID:</strong> ${achievement.credentialId}</div>`
    : '';

  const skillsHTML = achievement.skills.map(s => `<span>${s}</span>`).join('');

  const fullImageBtnHTML = achievement.image
    ? `<button type="button" class="btn btn-outline btn-sm" onclick="toggleCertFullscreen()" style="display:inline-flex; align-items:center; gap:8px;">
         <i class="fa-solid fa-expand"></i> View Full Screen
       </button>
       <a href="${achievement.image}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:8px;">
         <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Original
       </a>`
    : '';

  const verifyBtnHTML = (achievement.credentialUrl && achievement.credentialUrl !== '#')
    ? `<a href="${achievement.credentialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:8px;">
         <i class="fa-solid fa-arrow-up-right-from-square"></i> Verify Official Credential
       </a>`
    : '';

  const actionsHTML = (verifyBtnHTML || fullImageBtnHTML)
    ? `<div style="margin-top: 18px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
         ${verifyBtnHTML}
         ${fullImageBtnHTML}
       </div>`
    : '';

  modalInfo.innerHTML = `
    <h3 class="cert-modal-info-title">${achievement.title}</h3>
    <div class="cert-modal-info-org"><i class="fa-solid fa-building"></i> ${achievement.organization}</div>
    <div class="cert-modal-info-date"><i class="fa-solid fa-calendar"></i> ${achievement.date}</div>
    ${quoteHTML}
    <p class="cert-modal-info-desc">${achievement.description}</p>
    ${credentialHTML}
    <div class="cert-modal-info-skills">${skillsHTML}</div>
    ${actionsHTML}
  `;

  // Show modal
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Trigger animation on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      overlay.focus();
    });
  });
}

// Ensure global accessibility for inline event handlers
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;
window.toggleCertFullscreen = toggleCertFullscreen;
window.zoomCert = zoomCert;
window.resetCertZoom = resetCertZoom;


/* 
   24. RESOURCES — NOTES, BOOKS & IMPORTANT QUESTIONS (COMPREHENSIVE FULL DETAIL)
*/

/* ── Resource Data — Comprehensive study notes, blueprints, and interview problem sets ─── */
const resourcesData = [
  {
    id: 'res-dsa-notes',
    title: 'Data Structures & Algorithms Notes',
    category: 'notes',
    icon: 'fa-solid fa-laptop-code',
    difficulty: 'Advanced Core CS',
    estTime: '80+ Hours Mastery',
    prereq: 'C++ / Java / Python Basics & Discrete Math',
    description: 'Comprehensive handwritten and typed notes covering asymptotic analysis, linear and non-linear data structures, trees, advanced graph traversals, and dynamic programming patterns.',
    content: [
      'Arrays & Strings — Sliding Window, Two Pointers, Prefix Sums, Kadane’s Algorithm',
      'Linked Lists — Fast & Slow Pointers, In-place Reversal, Cycle Detection, LRU Cache Design',
      'Stacks & Queues — Monotonic Stack, Nearest Greater Element, Circular Buffer, Min-Stack',
      'Trees & BSTs — DFS/BFS Traversals, Lowest Common Ancestor (LCA), Tree Diameter, AVL/Red-Black Invariants',
      'Graphs & Networks — BFS/DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, Topological Sort',
      'Dynamic Programming — 0/1 Knapsack, Unbounded Knapsack, LCS, LIS, Matrix Chain Multiplication, State Machine DP'
    ],
    deepDive: [
      {
        title: 'Essential Algorithmic Paradigms & Patterns',
        icon: 'fa-solid fa-brain',
        summary: 'Core algorithmic mental models tested in high-bar engineering interviews:',
        points: [
          '<strong>Sliding Window:</strong> Used for contiguous subarray/substring queries under constraints (fixed or dynamic window size). Converts brute-force O(N²) into linear O(N).',
          '<strong>Two Pointers:</strong> Inward movement for sorted arrays (e.g. 2Sum/3Sum) and fast/slow runner pointers for linked-list midpoint & Floyd cycle detection.',
          '<strong>Monotonic Stack:</strong> Maintains strictly increasing or decreasing elements to find the nearest greater or smaller element in single-pass O(N).',
          '<strong>Dynamic Programming:</strong> Solves problems with overlapping subproblems and optimal substructure. State transition: dp[i][w] = max(dp[i-1][w], dp[i-1][w - wt[i]] + val[i]).'
        ]
      },
      {
        title: 'Master Theorem for Divide & Conquer',
        icon: 'fa-solid fa-calculator',
        summary: 'Solving recurrences of the form T(n) = aT(n/b) + f(n):',
        points: [
          '<strong>Case 1 (f(n) = O(n^(log_b a - ε))):</strong> Leaf level dominates the runtime → T(n) = Θ(n^(log_b a)).',
          '<strong>Case 2 (f(n) = Θ(n^(log_b a) log^k n)):</strong> Work is evenly balanced across levels → T(n) = Θ(n^(log_b a) log^(k+1) n).',
          '<strong>Case 3 (f(n) = Ω(n^(log_b a + ε))):</strong> Root node dominates the total work → T(n) = Θ(f(n)).'
        ]
      }
    ],
    cheatsheet: {
      title: 'Binary Search & Graph BFS Traversal Templates',
      language: 'C++',
      code: `// Template: Invariant-based Binary Search (Avoids Off-By-One)
int binarySearch(const vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Target not found
}

// Template: Graph Shortest Path via BFS (Unweighted)
int shortestPathBFS(int start, int target, const vector<vector<int>>& adj) {
    queue<pair<int, int>> q;
    vector<bool> visited(adj.size(), false);
    q.push({start, 0});
    visited[start] = true;
    while (!q.empty()) {
        auto [node, dist] = q.front(); q.pop();
        if (node == target) return dist;
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push({neighbor, dist + 1});
            }
        }
    }
    return -1;
}`,
      complexityTable: [
        { op: 'Array Access', avg: 'O(1)', worst: 'O(1)', space: 'O(N)' },
        { op: 'Binary Search', avg: 'O(log N)', worst: 'O(log N)', space: 'O(1)' },
        { op: 'QuickSort (In-place)', avg: 'O(N log N)', worst: 'O(N²)', space: 'O(log N)' },
        { op: 'Dijkstra (Min-Heap)', avg: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. Two Sum II — Input Array Is Sorted',
        difficulty: 'medium',
        company: 'Google, Amazon',
        concept: 'Two pointers from boundary inwards. Since array is sorted, increment left if sum < target, decrement right if sum > target in O(N) time and O(1) space.'
      },
      {
        q: '2. LRU Cache (Least Recently Used)',
        difficulty: 'hard',
        company: 'Amazon, Meta, Microsoft',
        concept: 'Combine Doubly Linked List with Hash Map (unordered_map) for O(1) get and O(1) put operations.'
      },
      {
        q: '3. Longest Increasing Subsequence (LIS)',
        difficulty: 'medium',
        company: 'Apple, Netflix',
        concept: 'O(N log N) patience sorting via std::lower_bound or O(N²) dynamic programming array.'
      }
    ],
    tags: ['DSA', 'C++', 'Algorithms', 'Competitive Programming', 'LeetCode'],
    actionLabel: 'Open NeetCode Roadmap',
    actionIcon: 'fa-solid fa-arrow-up-right-from-square',
    actionUrl: 'https://neetcode.io/roadmap'
  },
  {
    id: 'res-os-notes',
    title: 'Operating Systems Concepts',
    category: 'notes',
    icon: 'fa-solid fa-server',
    difficulty: 'Core Systems Fundamental',
    estTime: '50+ Hours Systems Deep Dive',
    prereq: 'C Language & Basic Computer Architecture',
    description: 'Detailed systems engineering notes covering kernel space vs user space, process management, CPU scheduling algorithms, thread synchronization primitives, deadlocks, and virtual memory paging.',
    content: [
      'Process Management — Process Control Block (PCB), Context Switching, Process States & Lifecycle',
      'CPU Scheduling — FCFS, SJF (Preemptive & Non-preemptive), Round Robin, Multi-level Feedback Queues',
      'Synchronization Primitives — Critical Section, Mutex Locks, Counting Semaphores, Monitors, Spinlocks',
      'Deadlock Dynamics — 4 Coffman Conditions, Resource Allocation Graphs, Banker’s Algorithm, Recovery',
      'Memory Management — Virtual Memory, Paging, TLB, Page Fault Handling, Page Replacement (LRU, Optimal, Clock)',
      'Storage & File Systems — Inodes, File Allocation Methods (Indexed, Linked), Disk Scheduling (SCAN, C-SCAN)'
    ],
    deepDive: [
      {
        title: 'Process Synchronization & Concurrency Control',
        icon: 'fa-solid fa-arrows-split-up-and-left',
        summary: 'Preventing race conditions and ensuring deterministic concurrent execution:',
        points: [
          '<strong>Critical Section Requirements:</strong> Mutual Exclusion (only one process inside), Progress (no unbounded waiting for entry), and Bounded Waiting (starvation prevention).',
          '<strong>Mutex vs Semaphore:</strong> Mutex is an ownership lock (only locker can unlock); Semaphore is a signaling mechanism without ownership (wait/P and signal/V operations).',
          '<strong>Classical Concurrency Challenges:</strong> Producer-Consumer (bounded buffer synchronization), Dining Philosophers (circular wait avoidance), and Reader-Writer (priority deadlock avoidance).'
        ]
      },
      {
        title: 'Virtual Memory & Demand Paging',
        icon: 'fa-solid fa-microchip',
        summary: 'Decoupling physical RAM from logical process address spaces:',
        points: [
          '<strong>Address Translation:</strong> Virtual address divided into Page Number and Offset. Looked up in Translation Lookaside Buffer (TLB) in ~1ns hardware cache.',
          '<strong>Page Fault Routine:</strong> CPU trap → OS kernel validates address → reads frame from swap disk into RAM frame → updates Page Table → restarts instruction.',
          '<strong>Thrashing & Belady’s Anomaly:</strong> Thrashing occurs when system spends more time swapping than executing. FIFO suffers from Belady’s Anomaly (more frames cause more faults); LRU is stack-based and immune.'
        ]
      }
    ],
    cheatsheet: {
      title: 'POSIX Thread & Semaphore Concurrency in C',
      language: 'C',
      code: `#include <pthread.h>
#include <semaphore.h>
#include <stdio.h>

#define BUFFER_SIZE 5
int buffer[BUFFER_SIZE];
int in = 0, out = 0;

sem_t emptySlots;
sem_t fullSlots;
pthread_mutex_t mutex;

void* producer(void* arg) {
    int item = 1;
    sem_wait(&emptySlots);        // Decrement empty slot count
    pthread_mutex_lock(&mutex);   // Enter critical section

    buffer[in] = item;
    in = (in + 1) % BUFFER_SIZE;

    pthread_mutex_unlock(&mutex); // Leave critical section
    sem_post(&fullSlots);         // Signal item is ready
    return NULL;
}`,
      complexityTable: [
        { op: 'FCFS Scheduling', avg: 'Convoy Effect', worst: 'High Wait Time', space: 'O(N)' },
        { op: 'SJF Scheduling', avg: 'Optimal Avg Wait', worst: 'Starvation', space: 'O(N)' },
        { op: 'Round Robin', avg: 'Low Response Time', worst: 'High Context Switch', space: 'O(N)' },
        { op: 'LRU Page Replacement', avg: 'High Hit Rate', worst: 'Stack Maintenance', space: 'O(Frames)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. What is the fundamental difference between a Process and a Thread?',
        difficulty: 'easy',
        company: 'Google, Microsoft, Amazon',
        concept: 'Processes have independent address spaces, file descriptors, and memory isolation. Threads share the heap, code segment, and global data of their parent process while maintaining private program counters and stack frames.'
      },
      {
        q: '2. Explain the 4 Necessary Conditions for Deadlock and how to break them.',
        difficulty: 'medium',
        company: 'Meta, Bloomberg',
        concept: 'Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Breaking circular wait by imposing a total ordering on all resource acquisitions prevents deadlocks entirely.'
      },
      {
        q: '3. What causes Thrashing and how does the Working Set Model prevent it?',
        difficulty: 'hard',
        company: 'Intel, Apple Systems',
        concept: 'When sum of active working sets of all processes exceeds available physical memory, page fault frequency surges. Working Set Model tracks pages referenced in time window Δ and suspends low-priority processes when memory is constrained.'
      }
    ],
    tags: ['OS', 'Systems', 'Theory', 'BTech CS', 'Linux Internals', 'Concurrency'],
    actionLabel: 'View OSTEP Textbook Online',
    actionIcon: 'fa-solid fa-book-open',
    actionUrl: 'https://pages.cs.wisc.edu/~remzi/OSTEP/'
  },
  {
    id: 'res-clrs-book',
    title: 'Introduction to Algorithms (CLRS)',
    category: 'books',
    icon: 'fa-solid fa-book',
    difficulty: 'Rigorous Academic & Mathematical',
    estTime: '120+ Hours Formal Proofs',
    prereq: 'Discrete Mathematics, Calculus & Probability',
    description: 'The gold-standard textbook for algorithmic computer science by Cormen, Leiserson, Rivest, and Stein. Detailed breakdowns of formal algorithm proofs, amortized analysis, and network flows.',
    content: [
      'Foundations — Asymptotic Notations (O, Ω, Θ, o, ω), Recurrences, Probabilistic Analysis',
      'Sorting & Order Statistics — Heapsort, Quicksort analysis, Linear Time Sorting (Counting, Radix, Bucket)',
      'Advanced Data Structures — Red-Black Trees, B-Trees, Disjoint Set (Union-Find) with Rank & Path Compression',
      'Advanced Design Techniques — Dynamic Programming proofs, Greedy choice property & Matroids, Amortized analysis',
      'Graph Algorithms — Bellman-Ford, Dijkstra, Johnson’s algorithm, Maximum Flow (Ford-Fulkerson, Edmonds-Karp)',
      'NP-Completeness — Polynomial time verification, Circuit Satisfiability, 3-CNF SAT, Clique, Vertex Cover'
    ],
    deepDive: [
      {
        title: 'Red-Black Tree Balance Theorems & Proofs',
        icon: 'fa-solid fa-circle-nodes',
        summary: 'Self-balancing binary search trees with guaranteed O(log N) worst case:',
        points: [
          '<strong>The 5 Invariants:</strong> 1) Every node is red or black. 2) Root is black. 3) Every leaf (NIL) is black. 4) If a node is red, both children are black. 5) For each node, all paths to leaves have same number of black nodes (bh(x)).',
          '<strong>Height Bound Proof:</strong> A red-black tree with n internal nodes has height at most 2 log_2(n + 1). Proven by induction showing subtree at x contains at least 2^(bh(x)) - 1 internal nodes.',
          '<strong>Restructuring via Rotations:</strong> Insertions and deletions require at most 2 and 3 rotations respectively, making it superior to AVL trees for write-heavy workloads.'
        ]
      },
      {
        title: 'Amortized Analysis Methodologies',
        icon: 'fa-solid fa-scale-balanced',
        summary: 'Guaranteeing average performance of sequence of operations in the worst case:',
        points: [
          '<strong>Aggregate Analysis:</strong> Determines upper bound T(n) on total cost of sequence of n operations; amortized cost per operation is T(n)/n.',
          '<strong>Accounting Method:</strong> Assigns differing charges to operations, overcharging early operations and storing credits to pay for expensive later operations.',
          '<strong>Potential Method:</strong> Defines potential energy function Φ(D_i) mapping data structure state to real number. Amortized cost = actual cost + ΔΦ.'
        ]
      }
    ],
    cheatsheet: {
      title: 'Disjoint Set Union (DSU) with Path Compression & Rank',
      language: 'C++',
      code: `// Disjoint Set Union: Nearly O(1) Amortized via Inverse Ackermann α(N)
class DisjointSet {
    vector<int> parent, rank;
public:
    DisjointSet(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int u) {
        if (parent[u] != u)
            parent[u] = find(parent[u]); // Path compression
        return parent[u];
    }

    bool unite(int u, int v) {
        int rootU = find(u), rootV = find(v);
        if (rootU == rootV) return false; // Already connected
        if (rank[rootU] < rank[rootV])
            parent[rootU] = rootV;
        else if (rank[rootV] < rank[rootU])
            parent[rootV] = rootU;
        else {
            parent[rootV] = rootU;
            rank[rootU]++;
        }
        return true;
    }
};`,
      complexityTable: [
        { op: 'Comparison Sort Lower Bound', avg: 'Ω(N log N)', worst: 'Ω(N log N)', space: 'O(1)' },
        { op: 'Counting Sort (Linear)', avg: 'O(N + K)', worst: 'O(N + K)', space: 'O(K)' },
        { op: 'Red-Black Tree Search/Insert', avg: 'O(log N)', worst: 'O(log N)', space: 'O(N)' },
        { op: 'Union-Find with α(N)', avg: 'O(α(N)) ≈ O(1)', worst: 'O(α(N))', space: 'O(N)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. Prove why comparison-based sorting has a mathematical lower bound of Ω(N log N).',
        difficulty: 'medium',
        company: 'Academic & FAANG Research',
        concept: 'Any comparison sort can be modeled as a decision tree with N! possible permutation leaves. A binary tree of height h has at most 2^h leaves. Therefore, 2^h ≥ N! ⇒ h ≥ log_2(N!). Using Stirling’s approximation, log(N!) = Θ(N log N).'
      },
      {
        q: '2. What is the Max-Flow Min-Cut Theorem and how does Edmonds-Karp solve it?',
        difficulty: 'hard',
        company: 'Google, Palantir',
        concept: 'The maximum amount of flow passing from source to sink equals the total weight of edges in the minimum cut. Edmonds-Karp uses BFS to find augmenting paths in O(V · E²) time, guaranteeing polynomial convergence.'
      }
    ],
    tags: ['Algorithms', 'Textbook', 'CS Fundamentals', 'CLRS', 'Theoretical CS'],
    actionLabel: 'View MIT OCW Course Material',
    actionIcon: 'fa-solid fa-graduation-cap',
    actionUrl: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/'
  },
  {
    id: 'res-clean-code',
    title: 'Clean Code by Robert C. Martin',
    category: 'books',
    icon: 'fa-solid fa-broom',
    difficulty: 'Software Engineering Best Practices',
    estTime: '35+ Hours Practical Refactoring',
    prereq: 'Any OOP Language (Java, C++, TypeScript)',
    description: 'A handbook of agile software craftsmanship. Master how to write readable, maintainable, and elegant code through proven refactoring principles, SOLID patterns, and code smell elimination.',
    content: [
      'Meaningful Names — Choosing intention-revealing, pronounceable, and searchable identifiers',
      'Functions — Small, focused, single level of abstraction (Stepdown Rule), monadic/dyadic params',
      'Comments — Good comments explain intent or legalities; bad comments compensate for expressive code failure',
      'Error Handling — Prefer unchecked exceptions over error codes; never pass or return null values',
      'The SOLID Principles — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion',
      'Code Smells & Refactoring — Eliminating Long Methods, God Objects, Feature Envy, and Primitive Obsession'
    ],
    deepDive: [
      {
        title: 'The SOLID Principles of Object-Oriented Design',
        icon: 'fa-solid fa-shield-halved',
        summary: 'Foundational architectural rules for robust, extensible systems:',
        points: [
          '<strong>Single Responsibility (SRP):</strong> A class should have only one reason to change. Separate presentation from persistence and domain logic.',
          '<strong>Open/Closed (OCP):</strong> Open for extension, closed for modification. Use interfaces and abstract base classes to extend behavior without modifying existing code.',
          '<strong>Liskov Substitution (LSP):</strong> Subtypes must be substitutable for their base types without altering system correctness or violating invariants.',
          '<strong>Interface Segregation (ISP):</strong> Clients should not be forced to depend on methods they do not use. Split fat interfaces into fine-grained role interfaces.',
          '<strong>Dependency Inversion (DIP):</strong> Depend on abstractions, not concretions. High-level policy modules should not depend on low-level infrastructure modules.'
        ]
      },
      {
        title: 'The Boy Scout Rule & Code Smell Remediation',
        icon: 'fa-solid fa-campground',
        summary: 'Continuous code hygiene to combat architectural degradation:',
        points: [
          '<strong>The Boy Scout Rule:</strong> Always leave the campground cleaner than you found it. Check in code a little cleaner than when you checked it out.',
          '<strong>Command Query Separation (CQS):</strong> Functions should either do something (mutate state) or answer something (return data), but never both.',
          '<strong>Don’t Repeat Yourself (DRY):</strong> Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.'
        ]
      }
    ],
    cheatsheet: {
      title: 'Clean Code Refactoring: Dependency Injection & Strategy Pattern',
      language: 'TypeScript',
      code: `// BAD: Tight coupling, multiple responsibilities, hard to test
class BadOrderProcessor {
    process(order: any) {
        console.log("Validating...");
        // Direct database call
        db.save(order);
        // Direct SMTP call
        smtp.sendEmail(order.userEmail, "Confirmed");
    }
}

// CLEAN: Inversion of Control, Single Responsibility, Testable
interface NotificationService {
    notify(recipient: string, message: string): Promise<void>;
}

interface OrderRepository {
    save(order: Order): Promise<void>;
}

class CleanOrderProcessor {
    constructor(
        private readonly repo: OrderRepository,
        private readonly notifier: NotificationService
    ) {}

    async process(order: Order): Promise<void> {
        order.validate();
        await this.repo.save(order);
        await this.notifier.notify(order.userEmail, "Your order is confirmed!");
    }
}`,
      complexityTable: [
        { op: 'SRP Compliance', avg: 'High Cohesion', worst: 'Single Reason to Change', space: 'Low Coupling' },
        { op: 'OCP via Polymorphism', avg: 'Extensible', worst: 'Zero Regression Risk', space: 'Decoupled' },
        { op: 'DIP via Interfaces', avg: 'Mockable & Testable', worst: 'Loose Coupling', space: 'Inverted' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. What is Dependency Inversion and how does it differ from Dependency Injection?',
        difficulty: 'medium',
        company: 'Microsoft, Stripe',
        concept: 'Dependency Inversion Principle (DIP) is high-level architectural rule stating modules depend on abstractions. Dependency Injection (DI) is a creational design pattern/mechanism used to pass concrete dependencies to a class constructor or setter.'
      },
      {
        q: '2. How do you identify Feature Envy and how do you refactor it?',
        difficulty: 'easy',
        company: 'Atlassian, Shopify',
        concept: 'Feature Envy occurs when a method accesses the data of another object more than its own. Refactor by using "Move Method" to relocate the logic directly into the data-holding class.'
      }
    ],
    tags: ['Software Engineering', 'Best Practices', 'Clean Code', 'SOLID', 'Refactoring'],
    actionLabel: 'Clean Code JavaScript Guide',
    actionIcon: 'fa-solid fa-code-branch',
    actionUrl: 'https://github.com/ryanmcdermott/clean-code-javascript'
  },
  {
    id: 'res-dsa-interview',
    title: 'Top 50 DSA Interview Questions',
    category: 'questions',
    icon: 'fa-solid fa-code',
    difficulty: 'Tier-1 FAANG Coding Bar',
    estTime: '65+ Hours Intensive Practice',
    prereq: 'Strong DSA Foundations & Pattern Recognition',
    description: 'Curated collection of the 50 most frequently tested technical coding interview problems across Google, Amazon, Microsoft, and Meta, grouped by core algorithmic patterns with solution intuition.',
    content: [
      'Array & Hashing: Two Sum, Group Anagrams, Top K Frequent Elements, Product of Array Except Self',
      'Two Pointers: 3Sum, Container With Most Water, Trapping Rain Water, Valid Palindrome',
      'Sliding Window: Longest Substring Without Repeating Characters, Minimum Window Substring',
      'Trees & Graphs: Lowest Common Ancestor, Binary Tree Maximum Path Sum, Number of Islands, Word Ladder',
      'Dynamic Programming: Coin Change, Word Break, Maximum Subarray (Kadane’s), House Robber II',
      'Heaps & Intervals: Merge K Sorted Lists, Merge Intervals, Non-overlapping Intervals'
    ],
    deepDive: [
      {
        title: 'Mastering the 4-Phase Technical Interview Method',
        icon: 'fa-solid fa-clipboard-check',
        summary: 'Systematic approach to ace live technical coding screens:',
        points: [
          '<strong>1. Clarify Constraints:</strong> Clarify input range, empty inputs, negative values, and memory/time limits.',
          '<strong>2. Articulate Naive Baseline:</strong> State the brute force solution (e.g. O(N²) or O(2^N)) to verify problem comprehension.',
          '<strong>3. Pattern Matching:</strong> Identify key data structure (Heap for Top-K, Monotonic Stack for next greater, Map for lookups).',
          '<strong>4. Edge Case Dry Run:</strong> Test empty inputs, single element, negative numbers, and duplicates before coding.'
        ]
      }
    ],
    cheatsheet: {
      title: 'Sliding Window & Merge Intervals Master Templates',
      language: 'Python',
      code: `# Template: Minimum Window Substring (Dynamic Sliding Window)
def minWindow(s: str, t: str) -> str:
    from collections import Counter
    if not s or not t: return ""
    target_counts = Counter(t)
    window_counts = {}
    have, need = 0, len(target_counts)
    res, res_len = [-1, -1], float("infinity")
    left = 0

    for right in range(len(s)):
        char = s[right]
        window_counts[char] = window_counts.get(char, 0) + 1
        if char in target_counts and window_counts[char] == target_counts[char]:
            have += 1

        while have == need:
            if (right - left + 1) < res_len:
                res = [left, right]
                res_len = right - left + 1
            # Shrink window from left
            window_counts[s[left]] -= 1
            if s[left] in target_counts and window_counts[s[left]] < target_counts[s[left]]:
                have -= 1
            left += 1

    l, r = res
    return s[l:r+1] if res_len != float("infinity") else ""`,
      complexityTable: [
        { op: 'Trapping Rain Water', avg: 'O(N)', worst: 'O(N)', space: 'O(1)' },
        { op: 'Merge Intervals', avg: 'O(N log N)', worst: 'O(N log N)', space: 'O(N)' },
        { op: 'Merge K Sorted Lists', avg: 'O(N log K)', worst: 'O(N log K)', space: 'O(K)' },
        { op: 'Word Ladder (BFS)', avg: 'O(M² · N)', worst: 'O(M² · N)', space: 'O(M · N)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. Trapping Rain Water',
        difficulty: 'hard',
        company: 'Meta, Google, Amazon',
        concept: 'Two pointers starting at 0 and N-1 maintaining max_left and max_right. The smaller boundary determines the water level at current position, allowing linear O(N) single-pass with O(1) space.'
      },
      {
        q: '2. Number of Islands',
        difficulty: 'medium',
        company: 'Amazon, Microsoft',
        concept: 'Grid traversal using DFS/BFS. Whenever a "1" is encountered, increment count and sink the island by mutating visited land to "0". Runs in O(R · C) time.'
      },
      {
        q: '3. Merge K Sorted Lists',
        difficulty: 'hard',
        company: 'Uber, Amazon, Meta',
        concept: 'Maintain a Min-Heap of size K containing the current node of each linked list. Extract the minimum node and push its next pointer into the heap. Total time O(N log K).'
      }
    ],
    tags: ['Interview Prep', 'DSA', 'Problem Solving', 'FAANG', 'Top 50'],
    actionLabel: 'Explore Grind 75 Roadmap',
    actionIcon: 'fa-solid fa-list-ol',
    actionUrl: 'https://www.techinterviewhandbook.org/grind75'
  },
  {
    id: 'res-oop-practice',
    title: 'OOP Concepts Practice Set',
    category: 'questions',
    icon: 'fa-solid fa-cubes',
    difficulty: 'Object-Oriented Design Mastery',
    estTime: '45+ Hours Systems Modeling',
    prereq: 'Core OOP in C++, Java, or TypeScript',
    description: 'Comprehensive practice problems and conceptual blueprints on Object-Oriented Analysis & Design (OOAD), Gang of Four (GoF) design patterns, UML class diagrams, and low-level system design (LLD).',
    content: [
      'The 4 Pillars — Encapsulation, Abstraction, Inheritance, Polymorphism in production engineering',
      'Creational Patterns — Singleton (Thread-safe Double-Checked Locking), Factory Method, Abstract Factory, Builder',
      'Structural Patterns — Adapter, Decorator, Facade, Composite, Proxy (Virtual & Protection proxies)',
      'Behavioral Patterns — Observer, Strategy, Command, State, Chain of Responsibility, Iterator',
      'Low-Level Design (LLD) — Designing a Multi-Level Parking Lot, Elevator Controller, and Rate Limiter',
      'Coupling vs Cohesion — Minimizing tight coupling through dependency injection and interfaces'
    ],
    deepDive: [
      {
        title: 'Core Design Patterns Deep Dive',
        icon: 'fa-solid fa-sitemap',
        summary: 'Essential GoF design patterns for real-world software architecture:',
        points: [
          '<strong>Strategy Pattern:</strong> Defines a family of interchangeable algorithms and encapsulates each one, making the algorithm vary independently from clients that use it.',
          '<strong>Observer Pattern:</strong> Defines a one-to-many relationship where state change in one subject automatically notifies and updates all subscriber objects (Event Bus, Pub-Sub).',
          '<strong>Decorator Pattern:</strong> Attaches additional responsibilities to an object dynamically as an alternative to subclassing (e.g. Java I/O streams: BufferedReader(new FileReader())).'
        ]
      }
    ],
    cheatsheet: {
      title: 'Thread-Safe Double-Checked Locking Singleton & Strategy in C++',
      language: 'C++',
      code: `// Modern C++ Thread-Safe Meyers' Singleton
class DatabaseConnection {
private:
    DatabaseConnection() { /* Connect to DB */ }
    ~DatabaseConnection() = default;
public:
    DatabaseConnection(const DatabaseConnection&) = delete;
    DatabaseConnection& operator=(const DatabaseConnection&) = delete;

    static DatabaseConnection& getInstance() {
        // Guaranteed to be thread-safe in C++11 and later
        static DatabaseConnection instance;
        return instance;
    }
};

// Strategy Pattern Interface
class PaymentStrategy {
public:
    virtual ~PaymentStrategy() = default;
    virtual void pay(double amount) = 0;
};`,
      complexityTable: [
        { op: 'Singleton Pattern', avg: 'Single Global Instance', worst: 'Potential Bottleneck', space: 'O(1)' },
        { op: 'Strategy Pattern', avg: 'Interchangeable Behavior', worst: 'Extra Object Allocation', space: 'O(1)' },
        { op: 'Observer Pattern', avg: 'Decoupled Notification', worst: 'Memory Leaks if not unsubscribed', space: 'O(N)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. Design an Object-Oriented Multi-Level Parking Lot System',
        difficulty: 'medium',
        company: 'Amazon, Adobe',
        concept: 'Model Vehicle subclasses (Motorcycle, Car, Bus), ParkingSpot subclasses (Compact, Large), Level, and ParkingLot singleton. Use Strategy pattern for parking allocation and pricing.'
      },
      {
        q: '2. How does Dynamic Dispatch / Virtual Table (vtable) work under the hood in C++?',
        difficulty: 'hard',
        company: 'Microsoft, Qualcomm Systems',
        concept: 'Compiler creates a vtable for each class containing virtual functions. Each instance carries a hidden vptr pointing to this table. Method calls resolve at runtime through pointer dereference.'
      }
    ],
    tags: ['OOP', 'Java', 'C++', 'Design Patterns', 'LLD', 'Architecture'],
    actionLabel: 'Refactoring Guru Design Patterns',
    actionIcon: 'fa-solid fa-puzzle-piece',
    actionUrl: 'https://refactoring.guru/design-patterns'
  },
  {
    id: 'res-system-design',
    title: 'System Design & Scalable Architecture',
    category: 'notes',
    icon: 'fa-solid fa-network-wired',
    difficulty: 'Advanced Distributed Systems',
    estTime: '70+ Hours Architecture Study',
    prereq: 'Databases, Networking, Client-Server Systems',
    description: 'Comprehensive engineering blueprints on scalable system architectures, microservices, load balancing, multi-level caching strategies, distributed databases, message brokers, and high-availability design.',
    content: [
      'Scalability Fundamentals — Horizontal vs Vertical Scaling, Latency vs Throughput, 99.999% SLA metrics',
      'Load Balancing & Gateways — L4 vs L7 Load Balancers, Round Robin, Least Connections, Consistent Hashing',
      'Caching Strategies — Redis, Memcached, Cache-Aside, Write-Through, Write-Back, Eviction policies (LRU, LFU)',
      'Distributed Databases — SQL vs NoSQL, Sharding, Read Replicas, CAP Theorem (Consistency, Availability, Partitioning)',
      'Asynchronous Messaging — Kafka (Event Streaming, Partitions, Consumer Groups), RabbitMQ (Message Queuing)',
      'Architecture Blueprints — Designing URL Shortener (TinyURL), Distributed Rate Limiter, and Notification System'
    ],
    deepDive: [
      {
        title: 'CAP Theorem & PACELC Trade-Offs',
        icon: 'fa-solid fa-diagram-project',
        summary: 'Theoretical foundations of distributed consistency and partition tolerance:',
        points: [
          '<strong>CAP Theorem:</strong> In the presence of a network partition (P), a distributed system must choose between strict Consistency (C) and high Availability (A).',
          '<strong>PACELC Theorem:</strong> If Partition (P), trade off Availability (A) vs Consistency (C); Else (E), trade off Latency (L) vs Consistency (C). Example: DynamoDB/Cassandra default to PA/EL.',
          '<strong>Consistent Hashing:</strong> Maps servers and keys to a 360° virtual ring (0 to 2³² - 1). Adding/removing a server only reassigns 1/N keys, preventing catastrophic reshuffling.'
        ]
      }
    ],
    cheatsheet: {
      title: 'Token Bucket Distributed Rate Limiter & Architecture Blueprints',
      language: 'Lua / Redis',
      code: `-- Redis Token Bucket Rate Limiter Script
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0 -- Rate limit exceeded
else
    redis.call("INCRBY", key, 1)
    if current == 0 then
        redis.call("EXPIRE", key, 60) -- 60 second window
    end
    return 1 -- Request allowed
end`,
      complexityTable: [
        { op: 'Cache-Aside (Lazy Loading)', avg: 'Read: Cache Hit O(1)', worst: 'Cache Miss Disk Read', space: 'O(Cached Keys)' },
        { op: 'Write-Through Cache', avg: 'High Consistency', worst: 'Higher Write Latency', space: 'O(Keys)' },
        { op: 'Consistent Hashing Ring', avg: 'O(log S) Node Lookup', worst: 'Balanced with V-Nodes', space: 'O(S · V)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. Design a Scalable URL Shortening Service (TinyURL) handling 100M Daily Active Users',
        difficulty: 'medium',
        company: 'Google, Amazon, Meta',
        concept: 'Use Base62 encoding on a distributed 64-bit ID generator (Twitter Snowflake). Store in NoSQL database (Cassandra/DynamoDB) with Redis caching for top 20% trending URLs.'
      },
      {
        q: '2. How do you handle Distributed Transactions across Microservices? (2PC vs Saga)',
        difficulty: 'hard',
        company: 'Uber, Stripe, Netflix',
        concept: 'Two-Phase Commit (2PC) is synchronous and blocking. The Saga pattern uses asynchronous compensating transactions coordinated via events (Choreography) or an Orchestrator.'
      }
    ],
    tags: ['System Design', 'Microservices', 'Distributed Systems', 'Kafka', 'Redis', 'High Availability'],
    actionLabel: 'System Design Primer on GitHub',
    actionIcon: 'fa-solid fa-book-bookmark',
    actionUrl: 'https://github.com/donnemartin/system-design-primer'
  },
  {
    id: 'res-dbms-notes',
    title: 'DBMS & SQL Deep Dive',
    category: 'notes',
    icon: 'fa-solid fa-database',
    difficulty: 'Core Database Internals',
    estTime: '55+ Hours RDBMS Mastery',
    prereq: 'Relational Database Fundamentals',
    description: 'Detailed study notes covering relational database engines, normalization theorems, B+ Tree index optimization, transaction isolation levels, concurrency anomalies, and complex SQL joins.',
    content: [
      'Relational Model & Constraints — ER Modeling, Primary/Foreign Keys, Referential Integrity, Functional Dependencies',
      'Normalization Forms — 1NF, 2NF, 3NF, Boyce-Codd Normal Form (BCNF), Decomposition and Lossless Joins',
      'Transaction Management & ACID — Atomicity (WAL), Consistency, Isolation (Locks & MVCC), Durability (Checkpoints)',
      'Concurrency Control & Anomalies — Dirty Read, Non-repeatable Read, Phantom Read, Two-Phase Locking (2PL)',
      'Storage & Index Internals — B+ Tree Indexing vs Hash Index, Clustered vs Non-clustered, Composite Index order',
      'Advanced SQL Mastery — Window Functions (ROW_NUMBER, DENSE_RANK), Common Table Expressions (CTEs), EXPLAIN ANALYZE'
    ],
    deepDive: [
      {
        title: 'Transaction Isolation Levels & Concurrency Anomalies',
        icon: 'fa-solid fa-arrows-spin',
        summary: 'Guarantees provided by SQL engines under concurrent execution:',
        points: [
          '<strong>Read Uncommitted:</strong> Allows Dirty Reads (transaction reads uncommitted data from another concurrent transaction).',
          '<strong>Read Committed:</strong> Eliminates dirty reads using snapshot read on statement level; still prone to Non-Repeatable Reads.',
          '<strong>Repeatable Read:</strong> Ensures rows read remain unchanged throughout transaction via MVCC; prone to Phantom Reads.',
          '<strong>Serializable:</strong> Complete isolation guaranteeing equivalent serial order via two-phase locking (2PL) or serializable snapshot isolation (SSI).'
        ]
      }
    ],
    cheatsheet: {
      title: 'Advanced SQL: Window Functions, Recursive CTEs & Performance Tuning',
      language: 'SQL',
      code: `-- Nth Highest Salary using DENSE_RANK Window Function
WITH RankedSalaries AS (
    SELECT employee_id, department_id, salary,
           DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank
    FROM employees
)
SELECT employee_id, department_id, salary
FROM RankedSalaries
WHERE salary_rank = 2; -- 2nd Highest Salary in each department

-- Index Optimization Check
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42 AND status = 'COMPLETED'
ORDER BY created_at DESC;`,
      complexityTable: [
        { op: 'B+ Tree Index Lookup', avg: 'O(log_B N)', worst: 'O(log_B N)', space: 'O(N)' },
        { op: 'Hash Index Exact Match', avg: 'O(1)', worst: 'O(N) (colliding)', space: 'O(N)' },
        { op: 'Full Table Scan', avg: 'O(N) I/O reads', worst: 'O(N) I/O reads', space: 'O(1)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. What is the difference between Clustered Index and Non-Clustered Index?',
        difficulty: 'easy',
        company: 'Oracle, Amazon, Microsoft',
        concept: 'A clustered index physically sorts table rows on disk based on the key (only one per table). A non-clustered index stores index keys and row pointers (RID/PK) in a separate B+ tree structure.'
      },
      {
        q: '2. Explain Multi-Version Concurrency Control (MVCC) in PostgreSQL',
        difficulty: 'medium',
        company: 'Databricks, Stripe',
        concept: 'PostgreSQL avoids read locks by storing multiple versions of rows (xmin and xmax transaction IDs). Readers never block writers and writers never block readers.'
      }
    ],
    tags: ['DBMS', 'SQL', 'PostgreSQL', 'Database Internals', 'ACID', 'Indexing'],
    actionLabel: 'Use The Index, Luke! Guide',
    actionIcon: 'fa-solid fa-magnifying-glass',
    actionUrl: 'https://use-the-index-luke.com/'
  },
  {
    id: 'res-leetcode-75',
    title: 'LeetCode 75 Top Interview Question Bank',
    category: 'questions',
    icon: 'fa-solid fa-code',
    difficulty: 'Must-Solve Interview Core',
    estTime: '75+ Hours Algorithm Drills',
    prereq: 'Data Structures & Pattern Familiarity',
    description: 'Curated problem bank of the top 75 essential coding interview questions categorized by core algorithmic patterns with step-by-step solution breakdowns, edge cases, and time/space complexity targets.',
    content: [
      'Array / String — Greatest Common Divisor of Strings, Reverse Vowels, Product of Array Except Self, Increasing Triplet',
      'Two Pointers & Sliding Window — Is Subsequence, Container With Most Water, Max Number of Vowels, Longest 1s Subarray',
      'Prefix Sum & Hash Map — Find Pivot Index, Unique Number of Occurrences, Equal Row/Column Pairs',
      'Stack & Queue — Removing Stars From String, Asteroid Collision, Decode String, Number of Recent Calls',
      'Binary Tree DFS & BFS — Maximum Depth, Leaf-Similar Trees, Count Good Nodes, Path Sum III, Binary Tree Right Side View',
      'Graphs & DP — Keys and Rooms, Number of Provinces, Rotting Oranges, N-th Tribonacci, Min Cost Climbing Stairs'
    ],
    deepDive: [
      {
        title: 'The 14 Fundamental Algorithmic Patterns in LeetCode 75',
        icon: 'fa-solid fa-cubes',
        summary: 'Pattern classification to solve unseen coding problems rapidly:',
        points: [
          '<strong>Fast & Slow Pointers:</strong> Detect cycles in arrays or lists; find middle element in O(N) single pass.',
          '<strong>Prefix Sums:</strong> Precomputes cumulative sums for instant O(1) range sum queries.',
          '<strong>Multi-source BFS:</strong> Explodes waves outward from multiple starting points simultaneously (e.g. Rotting Oranges).'
        ]
      }
    ],
    cheatsheet: {
      title: 'Rotting Oranges (Multi-Source BFS) & Decode String Solutions',
      language: 'Python',
      code: `# Multi-Source BFS: Rotting Oranges
from collections import deque

def orangesRotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0)) # row, col, minute
            elif grid[r][c] == 1:
                fresh += 1

    if fresh == 0: return 0
    max_minutes = 0

    while queue:
        r, c, minutes = queue.popleft()
        max_minutes = max(max_minutes, minutes)
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2 # Rot the orange
                fresh -= 1
                queue.append((nr, nc, minutes + 1))

    return max_minutes if fresh == 0 else -1`,
      complexityTable: [
        { op: 'Rotting Oranges (BFS)', avg: 'O(R · C)', worst: 'O(R · C)', space: 'O(R · C)' },
        { op: 'Decode String (Stack)', avg: 'O(MaxK · N)', worst: 'O(MaxK · N)', space: 'O(N)' },
        { op: 'Equal Row & Column Pairs', avg: 'O(N²)', worst: 'O(N²)', space: 'O(N²)' }
      ]
    },
    interviewQuestions: [
      {
        q: '1. Decode String (Stack Pattern)',
        difficulty: 'medium',
        company: 'Google, Bloomberg',
        concept: 'Use two stacks (one for integer multiplier counts and one for string segments). Push previous string on "[", pop and repeat on "]".'
      },
      {
        q: '2. Rotting Oranges (Multi-source BFS)',
        difficulty: 'medium',
        company: 'Amazon, Microsoft',
        concept: 'Queue all initial rotten oranges at time 0. Process level-by-level tracking elapsed minutes until fresh count reaches 0.'
      }
    ],
    tags: ['LeetCode 75', 'FAANG Prep', 'Algorithms', 'Pattern Mastery', 'Interview Ready'],
    actionLabel: 'Open LeetCode 75 Plan',
    actionIcon: 'fa-solid fa-circle-play',
    actionUrl: 'https://leetcode.com/studyplan/leetcode-75/'
  }
];1s Subarray',
      'Prefix Sum & Hash Map — Find Pivot Index, Unique Number of Occurrences, Equal Row/Column Pairs',
      'Stack & Queue — Asteroid Collision, Decode String, Number of Recent Calls',
      'Binary Tree & Graph — Leaf-Similar Trees, Path Sum III, Nearest Exit from Entrance in Maze'
    ],
    tags: ['LeetCode 75', 'FAANG Prep', 'Algorithms', 'Pattern Mastery'],
    actionLabel: 'Practice LeetCode 75',
    actionIcon: 'fa-solid fa-circle-play',
    actionUrl: '#'
  }
];

/* Module-level timers for instant, collision-free modal opening and closing */
let resModalCloseTimer = null;
let arcModalCloseTimer = null;

function initResources() {
  const stage = document.getElementById('resourcesPanoramicStage');
  const track = document.getElementById('resourcesCylinderTrack');
  const filterBtns = document.querySelectorAll('[data-resource-filter]');
  const exploreBtn = document.getElementById('resourcesExploreBtn');
  const prevBtn = document.getElementById('resPrevBtn');
  const nextBtn = document.getElementById('resNextBtn');
  const playBtn = document.getElementById('resPlayBtn');

  /* ── Setup Modal ─── */
  initResourceModal();

  if (!stage || !track) return;
  if (track.dataset.cloned) return;
  track.dataset.cloned = 'true';

  // Duplicate cards for seamless infinite cylinder loop
  const originalCards = Array.from(track.children);
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  const allCards = Array.from(track.children);
  const cardStep = 232; // 210px card width + 22px gap
  let singleWidth = originalCards.length * cardStep;

  /* ── State variables for continuous 3D ribbon motion ─── */
  let scrollOffset = 0;
  let targetOffset = 0;
  let isPlaying = true;
  let isHovered = false;
  let isDragging = false;
  let isActuallyMoved = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let dragDelta = 0;
  const normalSpeed = 0.65;
  const hoverSpeed = 0.15;

  function updateMeasurements() {
    const firstCard = track.children[0];
    const secondCard = track.children[1];
    if (firstCard && secondCard) {
      const computedStep = secondCard.offsetLeft - firstCard.offsetLeft;
      if (computedStep > 0) {
        singleWidth = originalCards.length * computedStep;
      }
    }
  }
  updateMeasurements();
  window.addEventListener('resize', updateMeasurements);

  /* ── Smooth 3D Perspective Curvature Transform Updater ─── */
  function update3DCurvature() {
    if (!stage) return;
    const stageWidth = stage.offsetWidth || 1200;
    const stageCenterX = stageWidth / 2;
    const halfSpan = Math.max(stageWidth * 0.45, 320);

    allCards.forEach((card, idx) => {
      // Calculate geometric position along continuous loop
      const cardCenter = scrollOffset + (idx * cardStep) + (cardStep / 2);
      const relDist = (cardCenter - stageCenterX) / halfSpan;
      const clampedDist = Math.max(-1.4, Math.min(1.4, relDist));

      const rotateY = clampedDist * 18;
      const translateZ = -Math.pow(Math.abs(clampedDist), 1.25) * 38;
      const scale = Math.max(0.88, 1 - Math.pow(Math.abs(clampedDist), 2) * 0.05);

      card.style.transform = `perspective(1200px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
    });
  }

  /* ── Continuous Animation Loop ─── */
  function animateRibbon() {
    if (isPlaying && !isDragging) {
      const currentSpeed = isHovered ? hoverSpeed : normalSpeed;
      targetOffset -= currentSpeed;
    }

    // Smooth lerp for buttery motion
    scrollOffset += (targetOffset - scrollOffset) * 0.14;

    // Seamless infinite loop wrapping
    if (singleWidth > 0) {
      if (scrollOffset <= -singleWidth) {
        scrollOffset += singleWidth;
        targetOffset += singleWidth;
      } else if (scrollOffset >= 0) {
        scrollOffset -= singleWidth;
        targetOffset -= singleWidth;
      }
    }

    track.style.transform = `translateX(${scrollOffset}px)`;
    update3DCurvature();

    requestAnimationFrame(animateRibbon);
  }

  requestAnimationFrame(animateRibbon);

  /* ── Hover Slow/Drift ─── */
  stage.addEventListener('mouseenter', () => { isHovered = true; });
  stage.addEventListener('mouseleave', () => { isHovered = false; });

  /* ── Drag & Swipe Interaction ─── */
  function onDragStart(clientX) {
    isDragging = true;
    isActuallyMoved = false;
    dragStartX = clientX;
    dragStartOffset = targetOffset;
    dragDelta = 0;
  }

  function onDragMove(clientX) {
    if (!isDragging) return;
    dragDelta = clientX - dragStartX;
    if (Math.abs(dragDelta) > 8) {
      isActuallyMoved = true;
    }
    targetOffset = dragStartOffset + dragDelta;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    setTimeout(() => {
      isActuallyMoved = false;
    }, 50);
  }

  // Mouse drag events
  stage.addEventListener('mousedown', (e) => {
    onDragStart(e.clientX);
  });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) onDragMove(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    if (isDragging) onDragEnd();
  });

  // Touch swipe events
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) onDragStart(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) onDragMove(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => {
    if (isDragging) onDragEnd();
  });

  /* ── Direct Click & Key Listeners on all ribbon cards (instant, zero lag) ─── */
  allCards.forEach(card => {
    card.style.cursor = 'pointer';
    const resId = card.getAttribute('data-resource-id');

    function triggerModal(e) {
      if (isActuallyMoved && Math.abs(dragDelta) > 12) return;
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (resId) {
        openResourceModal(resId);
      }
    }

    card.addEventListener('click', triggerModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerModal(e);
      }
    });

    const innerBtn = card.querySelector('.ribbon-quick-action, .ribbon-card');
    if (innerBtn) {
      innerBtn.addEventListener('click', triggerModal);
    }
  });

  /* ── Track-level fallback delegate ─── */
  track.addEventListener('click', (e) => {
    if (isActuallyMoved && Math.abs(dragDelta) > 12) return;
    const cardWrap = e.target.closest('.ribbon-card-wrap');
    if (!cardWrap) return;
    const resId = cardWrap.getAttribute('data-resource-id');
    if (resId) {
      e.stopPropagation();
      openResourceModal(resId);
    }
  });

  /* ── Pill Action Button: Explore All ─── */
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResourceModal('res-dsa-notes');
    });
  }

  /* ── Controls: Prev / Next / Play-Pause ─── */
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      targetOffset += cardStep * 1.5;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      targetOffset -= cardStep * 1.5;
    });
  }

  function updateResPlayBtnUI() {
    if (!playBtn) return;
    playBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    playBtn.title = isPlaying ? 'Auto-moving is active (Click to pause)' : 'Motion paused (Click to resume)';
    if (isPlaying) {
      playBtn.classList.remove('paused');
    } else {
      playBtn.classList.add('paused');
    }
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPlaying = !isPlaying;
      updateResPlayBtnUI();
    });
  }

  /* ── Category Filters ─── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterVal = btn.getAttribute('data-resource-filter');

      allCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || cat === filterVal) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}



/* =============================================
   24B. 3D CURVED ARC SHOWCASE (JOURNEY & HOBBIES)
   Continuously moving curved 3D cards engine
   ============================================= */
function initJourney() {
  initArcShowcases();
}

function initArcShowcases() {
  const configs = [
    {
      id: 'journey',
      trackId: 'journeyArcTrack',
      sliderId: 'journeyPillSlider',
      filterContainerId: 'journeyFilters',
      hasFilters: true
    },
    {
      id: 'hobbies',
      trackId: 'hobbiesArcTrack',
      sliderId: 'hobbiesPillSlider',
      filterContainerId: null,
      hasFilters: false
    }
  ];

  configs.forEach(cfg => setupArcShowcase(cfg));
  setupArcDetailModal();
}

function setupArcShowcase(cfg) {
  const track = document.getElementById(cfg.trackId);
  if (!track) return;

  const allCards = Array.from(track.querySelectorAll('.arc-card'));
  if (!allCards.length) return;

  let visibleCards = [...allCards];
  let activeIndex = visibleCards.length > 2 ? 2 : 0; // Centerpiece as default
  let isAutoMoving = true;
  let autoTimer = null;

  const stageCard = track.closest('.arc-stage-card');
  const prevBtn = stageCard?.querySelector(`.arc-prev-btn[data-target="${cfg.id}"]`);
  const nextBtn = stageCard?.querySelector(`.arc-next-btn[data-target="${cfg.id}"]`);
  const playBtn = stageCard?.querySelector(`.arc-play-btn[data-target="${cfg.id}"]`);
  const slider = document.getElementById(cfg.sliderId);

  /* ── Position cards in 3D Arc ─── */
  function updateArcPositions() {
    const total = visibleCards.length;
    if (total === 0) return;

    // Constrain activeIndex
    activeIndex = ((activeIndex % total) + total) % total;

    allCards.forEach(card => {
      // Clear previous slot classes
      card.classList.remove(
        'pos-slot-far-left',
        'pos-slot-near-left',
        'pos-slot-center',
        'pos-slot-near-right',
        'pos-slot-far-right',
        'pos-slot-hidden'
      );

      const vIdx = visibleCards.indexOf(card);
      if (vIdx === -1) {
        card.classList.add('pos-slot-hidden');
        card.style.display = 'none';
        return;
      }

      card.style.display = 'block';

      // Compute circular distance relative to activeIndex
      let offset = vIdx - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      if (offset === 0) {
        card.classList.add('pos-slot-center');
      } else if (offset === -1) {
        card.classList.add('pos-slot-near-left');
      } else if (offset === 1) {
        card.classList.add('pos-slot-near-right');
      } else if (offset === -2) {
        card.classList.add('pos-slot-far-left');
      } else if (offset === 2) {
        card.classList.add('pos-slot-far-right');
      } else {
        card.classList.add('pos-slot-hidden');
      }
    });

    // Update bottom indicator dots
    if (slider && visibleCards[activeIndex]) {
      const activeOriginalIdx = visibleCards[activeIndex].getAttribute('data-index');
      const dots = slider.querySelectorAll('.arc-pill-dot');
      dots.forEach(dot => {
        if (dot.getAttribute('data-index') === activeOriginalIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  /* ── Auto Movement Engine ─── */
  function stepForward() {
    if (!visibleCards.length) return;
    activeIndex = (activeIndex + 1) % visibleCards.length;
    updateArcPositions();
  }

  function startAutoCycle() {
    stopAutoCycle();
    autoTimer = setInterval(() => {
      if (isAutoMoving) {
        stepForward();
      }
    }, 2800);
  }

  function stopAutoCycle() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function updatePlayBtnUI() {
    if (!playBtn) return;
    const icon = playBtn.querySelector('i');
    if (isAutoMoving) {
      playBtn.classList.remove('paused');
      playBtn.title = 'Continuous motion active (Click to pause)';
      if (icon) icon.className = 'fa-solid fa-pause';
    } else {
      playBtn.classList.add('paused');
      playBtn.title = 'Motion paused (Click to resume)';
      if (icon) icon.className = 'fa-solid fa-play';
    }
  }

  // Hover Pause & Resume
  if (stageCard) {
    stageCard.addEventListener('mouseenter', () => {
      isAutoMoving = false;
      updatePlayBtnUI();
    });
    stageCard.addEventListener('mouseleave', () => {
      isAutoMoving = true;
      updatePlayBtnUI();
    });
  }

  // Play / Pause Toggle
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isAutoMoving = !isAutoMoving;
      updatePlayBtnUI();
    });
  }

  // Prev / Next Chevron Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIndex = (activeIndex - 1 + visibleCards.length) % visibleCards.length;
      updateArcPositions();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stepForward();
    });
  }

  // Cards are animated 3D curved elements with rich details & notes on click
  allCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    function triggerModal(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      // Center this card in the 3D arc
      const vIdx = visibleCards.indexOf(card);
      if (vIdx !== -1) {
        activeIndex = vIdx;
        updateArcPositions();
      }

      // Open the detail modal with full notes and questions
      openCardDetail(card);
    }

    card.addEventListener('click', triggerModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerModal(e);
      }
    });

    // Also wire buttons/pills inside the card
    card.querySelectorAll('button, .arc-btn-pill, .arc-open-modal-btn').forEach(btn => {
      btn.addEventListener('click', triggerModal);
    });
  });

  // Slider Pill Dot Jumps
  if (slider) {
    slider.querySelectorAll('.arc-pill-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetIdx = dot.getAttribute('data-index');
        const foundIdx = visibleCards.findIndex(c => c.getAttribute('data-index') === targetIdx);
        if (foundIdx !== -1) {
          activeIndex = foundIdx;
          updateArcPositions();
        }
      });
    });
  }

  // Category Filters (if present)
  if (cfg.hasFilters && cfg.filterContainerId) {
    const filterContainer = document.getElementById(cfg.filterContainerId);
    if (filterContainer) {
      const filterBtns = filterContainer.querySelectorAll('.arc-filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filterVal = btn.getAttribute('data-journey-filter');
          if (filterVal === 'all') {
            visibleCards = [...allCards];
          } else {
            visibleCards = allCards.filter(c => c.getAttribute('data-category') === filterVal);
          }

          activeIndex = 0;
          updateArcPositions();
        });
      });
    }
  }

  // Initial render & launch auto-moving
  updateArcPositions();
  startAutoCycle();
}

/* ── Global Helper: Open Card Detail Modal (Instant & Comprehensive) ─── */
function openCardDetail(card) {
  if (!card) return;

  const modal = document.getElementById('arcDetailModal');
  const body = document.getElementById('arcModalBody');
  if (!modal || !body) return;

  if (arcModalCloseTimer) {
    clearTimeout(arcModalCloseTimer);
    arcModalCloseTimer = null;
  }

  const title = card.getAttribute('data-title') || '';
  const sub = card.getAttribute('data-sub') || '';
  const org = card.getAttribute('data-org') || '';
  const desc = card.getAttribute('data-desc') || '';
  const notesStr = card.getAttribute('data-notes') || '';
  const questionsStr = card.getAttribute('data-questions') || '';
  const tagsStr = card.getAttribute('data-tags') || '';
  const link = card.getAttribute('data-link') || '';
  const linkText = card.getAttribute('data-link-text') || 'Explore Details';
  const certId = card.getAttribute('data-cert-id');

  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  const notes = notesStr ? notesStr.split('||').map(n => n.trim()).filter(Boolean) : [];
  const questions = questionsStr ? questionsStr.split('||').map(q => q.trim()).filter(Boolean) : [];

  let actionHtml = '';
  if (certId) {
    actionHtml += `
      <button type="button" class="btn btn-primary btn-sm arc-modal-cert-btn" data-achievement-id="${certId}">
        <i class="fa-solid fa-certificate"></i> View Certificate / Award
      </button>
    `;
  }
  if (link && link !== '#') {
    const isExternal = link.startsWith('http');
    actionHtml += `
      <a href="${link}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-outline btn-sm">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> ${linkText}
      </a>
    `;
  }
  actionHtml += `
    <button type="button" class="btn btn-outline btn-sm arc-modal-close-trigger">
      <i class="fa-solid fa-xmark"></i> Close
    </button>
  `;

  let notesHtml = '';
  if (notes.length) {
    notesHtml = `
      <div class="arc-modal-section">
        <h4 class="arc-modal-section-title"><i class="fa-solid fa-lightbulb"></i> Key Notes &amp; Highlights</h4>
        <ul class="arc-modal-notes-list">
          ${notes.map(note => `<li class="arc-modal-note-item"><i class="fa-solid fa-circle-check"></i> <span>${note}</span></li>`).join('')}
        </ul>
      </div>
    `;
  }

  let questionsHtml = '';
  if (questions.length) {
    questionsHtml = `
      <div class="arc-modal-section">
        <h4 class="arc-modal-section-title"><i class="fa-solid fa-circle-question"></i> Concepts &amp; Questions Explored</h4>
        <div class="arc-modal-qna-list">
          ${questions.map(qText => {
            const parts = qText.split(' | ');
            const q = parts[0] ? parts[0].replace(/^Q:\s*/i, '') : qText;
            const a = parts[1] ? parts[1].replace(/^A:\s*/i, '') : '';
            return `
              <div class="arc-modal-qna-item">
                <div class="arc-modal-question"><i class="fa-solid fa-circle-dot"></i> <strong>Q:</strong> ${q}</div>
                ${a ? `<div class="arc-modal-answer"><i class="fa-solid fa-reply"></i> <strong>A:</strong> ${a}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  body.innerHTML = `
    <span class="arc-modal-meta-tag">${sub || 'Showcase'}</span>
    <h3 class="arc-modal-title">${title}</h3>
    ${org ? `<div class="arc-modal-sub"><i class="fa-solid fa-layer-group"></i> ${org}</div>` : ''}
    <p class="arc-modal-desc">${desc}</p>
    ${notesHtml}
    ${questionsHtml}
    ${tags.length ? `
      <div class="arc-modal-tags">
        ${tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    ` : ''}
    <div class="arc-modal-actions">
      ${actionHtml}
    </div>
  `;

  // Wire certificate button inside modal
  const modalCertBtn = body.querySelector('.arc-modal-cert-btn');
  if (modalCertBtn) {
    modalCertBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      modal.classList.remove('active');
      document.body.style.overflow = '';
      const id = modalCertBtn.getAttribute('data-achievement-id');
      if (typeof openCertModal === 'function') {
        openCertModal(id);
      }
    });
  }

  // Wire close trigger inside modal action
  const closeTrigger = body.querySelector('.arc-modal-close-trigger');
  if (closeTrigger) {
    closeTrigger.addEventListener('click', () => {
      closeArcDetailModal();
    });
  }

  // Show modal instantly
  modal.style.display = 'flex';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Ensure custom cursor stays active
  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursorFollower');
  if (cur) {
    cur.style.opacity = '1';
    cur.style.display = 'block';
    cur.classList.remove('cursor-hover');
  }
  if (fol) {
    fol.style.opacity = '0.6';
    fol.style.display = 'block';
    fol.classList.remove('cursor-hover');
  }
}

function closeArcDetailModal() {
  const modal = document.getElementById('arcDetailModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  clearTimeout(arcModalCloseTimer);
  arcModalCloseTimer = setTimeout(() => {
    if (!modal.classList.contains('active')) {
      modal.style.display = 'none';
    }
  }, 350);

  const cur = document.getElementById('cursor');
  const fol = document.getElementById('cursorFollower');
  if (cur) cur.classList.remove('cursor-hover');
  if (fol) fol.classList.remove('cursor-hover');
}

/* ── Arc Detail Modal Engine ─── */
function setupArcDetailModal() {
  const modal = document.getElementById('arcDetailModal');
  const closeBtn = document.getElementById('arcModalClose');
  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeArcDetailModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeArcDetailModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeArcDetailModal();
    }
  });

  // Explicit button clicks also open
  document.querySelectorAll('.arc-open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const card = btn.closest('.arc-card');
      if (card) openCardDetail(card);
    });
  });
}


/* =============================================
   25. RESOURCE PREVIEW MODAL
   ============================================= */
function initResourceModal() {
  const overlay = document.getElementById('resourceModalOverlay');
  const closeBtn = document.getElementById('resourceModalClose');

  if (!overlay) return;

  function closeResModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    clearTimeout(resModalCloseTimer);
    resModalCloseTimer = setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.style.display = 'none';
      }
    }, 350);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeResModal);

  // Click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeResModal();
  });

  // Keyboard Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeResModal();
    }
  });
}

/* ── Open modal with resource data (Instant, zero lag) ─── */
function openResourceModal(resourceId) {
  const overlay = document.getElementById('resourceModalOverlay');
  const modalBody = document.getElementById('resourceModalBody');

  if (!overlay || !modalBody) return;

  if (resModalCloseTimer) {
    clearTimeout(resModalCloseTimer);
    resModalCloseTimer = null;
  }

  const resource = resourcesData.find(r => r.id === resourceId);
  if (!resource) return;

  const categoryMeta = {
    notes: { icon: 'fa-sticky-note', label: 'Study Notes', bgClass: 'notes-bg' },
    books: { icon: 'fa-book-open', label: 'Reference Book', bgClass: 'books-bg' },
    questions: { icon: 'fa-circle-question', label: 'Question Bank', bgClass: 'questions-bg' }
  };
  const meta = categoryMeta[resource.category] || { icon: 'fa-file', label: 'Resource', bgClass: 'notes-bg' };

  const tagsHTML = resource.tags.map(t => `<span>${t}</span>`).join('');
  const contentHTML = resource.content.map(item => `<li><i class="fa-solid fa-check"></i> <span>${item}</span></li>`).join('');

  const actionHref = (resource.actionUrl && resource.actionUrl !== '#') ? resource.actionUrl : '#';
  const hasValidHref = actionHref !== '#';

  modalBody.innerHTML = `
    <div class="resource-modal-header">
      <div class="resource-modal-icon ${meta.bgClass}">
        <i class="${resource.icon}"></i>
      </div>
      <div class="resource-modal-header-text">
        <h3 class="resource-modal-title">${resource.title}</h3>
        <span class="resource-modal-category">
          <i class="fa-solid ${meta.icon}"></i>
          ${meta.label}
        </span>
      </div>
    </div>
    <div class="resource-modal-content">
      <p class="resource-modal-desc">${resource.description}</p>
      <div class="resource-modal-preview">
        <h4><i class="fa-solid fa-list-check"></i> Comprehensive Chapters &amp; Modules</h4>
        <ul class="resource-modal-list">${contentHTML}</ul>
      </div>
      <div class="resource-modal-tags">${tagsHTML}</div>
    </div>
    <div class="resource-modal-actions">
      ${hasValidHref ? `
        <a href="${actionHref}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          <i class="${resource.actionIcon}"></i> ${resource.actionLabel}
        </a>
      ` : `
        <button type="button" class="btn btn-primary" onclick="alert('Viewing comprehensive chapters for: ${resource.title}');">
          <i class="${resource.actionIcon}"></i> ${resource.actionLabel}
        </button>
      `}
      <button class="btn btn-outline resource-modal-inner-close" type="button">
        <i class="fa-solid fa-xmark"></i> Close
      </button>
    </div>
  `;

  // Wire inner close button
  const innerCloseBtn = modalBody.querySelector('.resource-modal-inner-close');
  if (innerCloseBtn) {
    innerCloseBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      clearTimeout(resModalCloseTimer);
      resModalCloseTimer = setTimeout(() => {
        if (!overlay.classList.contains('active')) {
          overlay.style.display = 'none';
        }
      }, 350);
    });
  }

  // Show modal instantly
  overlay.style.display = 'flex';
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}


/* ═══════════════════════════════════════════════════════════
   26. FLOATING SKILL ICONS — Cursor Following Parallax Cloud
   ═══════════════════════════════════════════════════════════ */
function initFloatingSkillIcons() {
  const cloud = document.getElementById('skillsIconCloud');
  if (!cloud) return;

  const icons = cloud.querySelectorAll('.floating-skill-icon');
  if (!icons.length) return;

  // Initial positions — scattered across the container
  const positions = [];
  const cloudRect = cloud.getBoundingClientRect();
  const cloudW = cloud.offsetWidth || 800;
  const cloudH = cloud.offsetHeight || 340;

  // Pre-defined scatter positions (percentages) for natural-looking layout
  const scatterPositions = [
    { x: 5,  y: 15 },  // C
    { x: 18, y: 55 },  // C++
    { x: 35, y: 10 },  // Java
    { x: 50, y: 60 },  // JavaScript
    { x: 8,  y: 75 },  // HTML5
    { x: 65, y: 25 },  // CSS3
    { x: 28, y: 35 },  // Git
    { x: 78, y: 55 },  // GitHub
    { x: 45, y: 85 },  // VS Code
    { x: 88, y: 15 },  // Python
    { x: 72, y: 80 },  // Node.js
    { x: 92, y: 50 },  // npm
    { x: 15, y: 90 },  // AWS
  ];

  icons.forEach((icon, i) => {
    const pos = scatterPositions[i % scatterPositions.length];
    const depth = parseFloat(icon.getAttribute('data-depth')) || 1.0;
    const delay = parseFloat(icon.getAttribute('data-float-delay')) || 0;

    positions.push({
      baseX: pos.x,
      baseY: pos.y,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      depth: depth,
      floatDelay: delay,
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeedX: 0.3 + Math.random() * 0.5,
      floatSpeedY: 0.4 + Math.random() * 0.6,
      floatAmplitudeX: 8 + Math.random() * 15,
      floatAmplitudeY: 6 + Math.random() * 12,
    });

    // Set initial position
    icon.style.left = pos.x + '%';
    icon.style.top = pos.y + '%';
  });

  let mouseX = 0, mouseY = 0;
  let isMouseOver = false;

  cloud.addEventListener('mousemove', (e) => {
    const rect = cloud.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1 to 1
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;  // -1 to 1
    isMouseOver = true;
  });

  cloud.addEventListener('mouseleave', () => {
    isMouseOver = false;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  let startTime = performance.now();

  function animate() {
    const elapsed = (performance.now() - startTime) / 1000;

    icons.forEach((icon, i) => {
      const p = positions[i];
      const t = elapsed + p.floatPhase;

      // Idle floating motion
      const floatX = Math.sin(t * p.floatSpeedX) * p.floatAmplitudeX;
      const floatY = Math.cos(t * p.floatSpeedY) * p.floatAmplitudeY;

      // Cursor influence
      let cursorX = 0, cursorY = 0;
      if (isMouseOver) {
        cursorX = mouseX * p.depth * 30;
        cursorY = mouseY * p.depth * 25;
      }

      p.targetX = floatX + cursorX;
      p.targetY = floatY + cursorY;

      // Smooth lerp
      p.currentX = lerp(p.currentX, p.targetX, 0.06);
      p.currentY = lerp(p.currentY, p.targetY, 0.06);

      icon.style.transform = `translate(${p.currentX}px, ${p.currentY}px)`;
    });

    requestAnimationFrame(animate);
  }

  if (!prefersReducedMotion) {
    animate();
  }
}


/* ═══════════════════════════════════════════════════════════
   27. CARD FAN — 3D Fan-Spread Card Layout with Click Expand
   ═══════════════════════════════════════════════════════════ */
function initCardFan() {
  const fanContainers = document.querySelectorAll('.card-fan-container');
  if (!fanContainers.length) return;

  fanContainers.forEach(container => {
    const cards = container.querySelectorAll('.card-fan-item');
    if (!cards.length) return;

    let activeCard = null;

    // Calculate fan spread
    function spreadCards() {
      const isMobile = window.innerWidth <= 600;
      const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
      const count = visibleCards.length;
      if (count === 0) return;

      const center = (count - 1) / 2;
      const spreadAngle = isMobile ? 0 : (count > 4 ? 7.5 : (count > 3 ? 9 : 12)); // adaptive spread
      const cardSpacing = isMobile ? 0 : (count > 4 ? 90 : (count > 3 ? 105 : 120));  // adaptive spacing

      visibleCards.forEach((card, i) => {
        if (isMobile) {
          card.style.transform = 'none';
          card.style.zIndex = card === activeCard ? '35' : '1';
          return;
        }

        const offset = i - center;
        const rotation = offset * spreadAngle;
        const translateX = offset * cardSpacing;
        const translateZ = -Math.abs(offset) * 20;
        const translateY = Math.abs(offset) * 8;

        if (card === activeCard) {
          // Active card moves to front, no rotation, high elevation
          card.style.zIndex = '35';
          card.style.transform = `translateX(0px) translateY(-30px) translateZ(80px) rotateZ(0deg) scale(1.08)`;
        } else {
          const baseZ = Math.max(1, 15 - Math.round(Math.abs(offset)));
          card.style.zIndex = String(baseZ);

          // When a card is active, push other visible cards further apart
          let extraPush = 0;
          if (activeCard) {
            const activeIndex = visibleCards.indexOf(activeCard);
            if (activeIndex !== -1) {
              const direction = i < activeIndex ? -1 : 1;
              extraPush = direction * 70;
            }
          }
          card.style.transform = `translateX(${translateX + extraPush}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateZ(${rotation}deg)`;
        }
      });
    }

    // Expose spreadCards on container
    container.spreadCards = spreadCards;

    // Enable card click to slide open details and switch active cards
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // If clicking inside interactive links or action buttons, let them fire naturally
        if (e.target.closest('a') || (e.target.closest('button') && !e.target.classList.contains('card-fan-item'))) {
          return;
        }

        if (activeCard === card) {
          // Deactivate current active card
          activeCard = null;
          card.classList.remove('active');
        } else {
          // Switch to this card
          if (activeCard) activeCard.classList.remove('active');
          activeCard = card;
          card.classList.add('active');
        }
        spreadCards();
      });
    });

    // Click outside to collapse active card
    document.addEventListener('click', (e) => {
      if (activeCard && !container.contains(e.target)) {
        activeCard.classList.remove('active');
        activeCard = null;
        spreadCards();
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 600;
      if (isMobile && activeCard) {
        activeCard.classList.remove('active');
        activeCard = null;
      }
      spreadCards();
    });

    // Initial spread
    spreadCards();
  });
}

/* 
   FOOTER — INTERACTIVE CLOCK & QUOTE CYCLER
*/
function initFooter() {
  // 1. Live Local Clock (IST / Asia/Kolkata)
  const clockEl = document.getElementById('footerLocalClock');
  if (clockEl) {
    const updateClock = () => {
      try {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        clockEl.textContent = `${timeString} IST`;
      } catch (err) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString();
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // 2. Interactive Quotes Cycler
  const quoteBtn = document.getElementById('footerQuoteBtn');
  const quoteText = document.getElementById('footerQuoteText');
  
  if (quoteBtn && quoteText) {
    const quotes = [
      '"Code is like humor. When you have to explain it, it\'s bad."',
      '"First, solve the problem. Then, write the code." — John Johnson',
      '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
      '"Make it work, make it right, make it fast." — Kent Beck',
      '"Talk is cheap. Show me the code." — Linus Torvalds',
      '"Software is a great combination between artistry and engineering." — Bill Gates',
      '"Programs must be written for people to read, and only incidentally for machines to execute." — Abelson & Sussman',
      '"The only way to do great work is to love what you do." — Steve Jobs',
      '"Clean code always looks like it was written by someone who cares." — Robert C. Martin'
    ];

    let currentIdx = 0;

    quoteBtn.addEventListener('click', () => {
      quoteText.style.opacity = '0';
      quoteText.style.transform = 'translateY(4px)';
      quoteText.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

      setTimeout(() => {
        currentIdx = (currentIdx + 1) % quotes.length;
        quoteText.textContent = quotes[currentIdx];
        quoteText.style.opacity = '1';
        quoteText.style.transform = 'translateY(0)';
      }, 200);
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   28. RESUME VISUAL GALLERY — 3D CoverFlow Showcase
   ═══════════════════════════════════════════════════════════ */
function initResumeGallery() {
  const stage = document.getElementById('resumeVisualStage');
  const track = document.getElementById('resumeVisualTrack');
  if (!stage || !track) return;

  const cards = Array.from(track.querySelectorAll('.resume-visual-card'));
  const filterPills = Array.from(document.querySelectorAll('.resume-gallery-filters .res-gallery-pill:not(.res-gallery-pill-link)'));
  const prevBtn = document.getElementById('resNavPrev');
  const nextBtn = document.getElementById('resNavNext');

  if (!cards.length) return;

  let currentIndex = 0;
  const totalCards = cards.length;

  function updateCoverFlow(newIndex) {
    currentIndex = ((newIndex % totalCards) + totalCards) % totalCards;

    cards.forEach((card, i) => {
      let diff = i - currentIndex;
      // circular wrap shortest distance
      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;

      card.classList.remove('active', 'slot-left-1', 'slot-right-1', 'slot-left-2', 'slot-right-2', 'slot-hidden');

      if (diff === 0) {
        card.classList.add('active');
        card.setAttribute('aria-hidden', 'false');
      } else if (diff === -1) {
        card.classList.add('slot-left-1');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff === 1) {
        card.classList.add('slot-right-1');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff === -2) {
        card.classList.add('slot-left-2');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff === 2) {
        card.classList.add('slot-right-2');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('slot-hidden');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    filterPills.forEach((pill, idx) => {
      const isActive = idx === currentIndex;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  // Filter Pill Clicks
  filterPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      updateCoverFlow(idx);
    });
  });

  // Direct Card Clicks
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || (e.target.closest('button') && !e.target.classList.contains('resume-visual-card'))) {
        return; // Let direct anchor/button clicks work immediately
      }
      if (idx !== currentIndex) {
        updateCoverFlow(idx);
      }
    });
  });

  // Circular Prev/Next Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCoverFlow(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCoverFlow(currentIndex + 1);
    });
  }

  // Touch Swipe Gesture Support
  let touchStartX = 0;
  let touchEndX = 0;

  stage.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          updateCoverFlow(currentIndex - 1);
        } else {
          updateCoverFlow(currentIndex + 1);
        }
      }
    }
  }, { passive: true });

  // Keyboard Arrow Keys when section in viewport
  const resumeSection = document.getElementById('resume');
  if (resumeSection) {
    window.addEventListener('keydown', (e) => {
      const rect = resumeSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
      if (inView) {
        if (e.key === 'ArrowLeft') {
          updateCoverFlow(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          updateCoverFlow(currentIndex + 1);
        }
      }
    });
  }

  // Initial layout activation
  updateCoverFlow(0);
}

/* ═══════════════════════════════════════════════════════════
   30. APPLICATION BOOTSTRAPPER (BOTTOM INITIALIZATION)
   ═══════════════════════════════════════════════════════════ */
function startApp() {
  const sections = [
    ['CustomCursor', initCustomCursor],
    ['Navbar', initNavbar],
    ['Hamburger', initHamburger],
    ['ScrollProgress', initScrollProgress],
    ['ThemeToggle', initThemeToggle],
    ['Particles', initParticles],       
    ['TypingEffect', initTypingEffect],    
    ['SkillBars', initSkillBars],       
    ['ActiveNavLink', initActiveNavLink],   
    ['BackToTop', initBackToTop],       
    ['Achievements', initAchievements],   
    ['Projects', initProjects],
    ['Resources', initResources],
    ['Journey', initJourney],
    ['FloatingSkillIcons', initFloatingSkillIcons],
    ['CardFan', initCardFan],
    ['ResumeGallery', initResumeGallery],
    ['ContactForm', initContactForm],
    ['Footer', initFooter]
  ];

  sections.forEach(([name, fn]) => {
    try {
      if (typeof fn === 'function') fn();
    } catch (err) {
      console.warn(`[Portfolio] Error initializing ${name}:`, err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}


