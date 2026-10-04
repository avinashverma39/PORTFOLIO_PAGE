/* 
   AVINASH VERMA PORTFOLIO — JAVASCRIPT

    */

let insforge = null;
try {
  if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
    import('https://esm.sh/@insforge/sdk@latest')
      .then(({ createClient }) => {
        insforge = createClient({
          baseUrl: 'https://r4s69m7b.ap-southeast.insforge.app',
          anonKey: 'anon_e477484020cb5f6036d7fa05715227a98204ee6b293d38ad446f77bf4dde73a2'
        });
        checkAuth();
      })
      .catch(() => {
        // Insforge offline or CDN unavailable; portfolio remains fully functional
      });
  }
} catch (_) {
  // Ignored in non-module or file:// environment
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- App Initialization ---- */
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
    ['Footer', initFooter]
  ];

  sections.forEach(([name, fn]) => {
    try {
      if (typeof fn === 'function') fn();
    } catch (err) {
      console.warn(`[Portfolio] Error initializing ${name}:`, err);
    }
  });

  checkAuth();
}

async function checkAuth() {
  const authNavLink = document.getElementById('authNavLink');
  if (authNavLink && insforge?.auth) {
    try {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        authNavLink.textContent = 'Dashboard';
        authNavLink.href = 'dashboard.html';
      }
    } catch (err) {
      console.debug('Auth check skipped:', err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp(); // Executes immediately if DOM is already ready
}


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
  const hoverSelector = 'a, button, input, textarea, .project-card, .card-fan-item, .arc-card, .arc-nav-btn, .arc-play-btn, .arc-filter-btn, .arc-btn-pill, .arc-modal-close, .project-modal-close, .arc-pill-dot, .btn, .hobby-card, .stat-card, .floating-skill-icon, .achievement-card, .detail-item, .timeline-card, .filter-btn, .resources-pill-btn, .res-filter-tab, .res-ctrl-btn, .ribbon-card, .ribbon-quick-action';

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
(function initContactForm() {
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

      // 1. Call InsForge AI Edge Function
      const edgeFunctionUrls = [
        'https://r4s69m7b.function2.insforge.app/handle-contact',
        'https://n9cxde66.function2.insforge.app/handle-contact'
      ];

      for (const url of edgeFunctionUrls) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          });

          if (response.ok) {
            const data = await response.json();
            aiResponse = data.ai_response;
            if (aiResponse) break;
          }
        } catch (fnErr) {
          console.warn(`Edge function at ${url} unavailable:`, fnErr);
        }
      }

      // 2. Direct InsForge Database Backup
      try {
        if (insforge && insforge.database) {
          const { error: dbErr } = await insforge
            .database
            .from('messages')
            .insert([{ name, email, message }]);
          if (dbErr) console.warn('InsForge database direct insert notice:', dbErr);
        }
      } catch (e) {
        console.warn('InsForge database direct insert exception:', e);
      }

      // 3. Direct Email Notification via FormSubmit
      try {
        await fetch('https://formsubmit.co/ajax/avinashverma3939@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            subject: subject || 'New Message from Portfolio',
            message,
            _captcha: 'false'
          })
        });
      } catch (e) {
        console.warn('Direct email notification notice:', e);
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
      console.error(err);
      showFieldError('message', 'messageError', 'Sorry, there was an error. Please check your network and try again.');
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
})();

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
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
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

  // Setup Project Modal listeners if needed
  initProjectModal();

  // Cards are non-clickable (display only) with dynamic 3D moving tilt animation
  projectCards.forEach(card => {
    card.style.cursor = 'default';

    // Dynamic 3D mouse movement tilt (moving card without clicking)
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
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

/* ── Achievement Data — Add your own entries here ─── */
const achievementsData = [
  {
    id: 'cert-cpp',
    title: 'C++ Programming Certificate',
    category: 'certificate',
    organization: 'Coursera',
    date: 'April 2025',
    description: 'Completed a comprehensive C++ programming course covering OOP, STL, memory management, and modern C++ features with hands-on projects.',
    skills: ['C++', 'OOP', 'STL'],
    image: null, 
    credentialUrl: '#',
    credentialId: 'CERT-CPP-2025-001'
  },
  {
    id: 'course-webdev',
    title: 'Web Development Course ',
    category: 'course',
    organization: 'Udemy',
    date: 'Mar 2026',
    description: 'Mastered full-stack web development fundamentals including HTML5, CSS3, responsive design, and JavaScript ES6+ With using AI tools for coding and debugging.',
    skills: ['HTML', 'CSS', 'JavaScript', 'AI Tools'],
    image: null,
    credentialUrl: '#',
    credentialId: 'UC-WEBDEV-2026'
  },
  {
    id: 'Summer-Internship-JAVA',
  title: 'Summer Internship — JAVA Development',
    category: 'internship',
    organization: 'TechCorp Solutions',
    date: 'Jun 2025',
    description: 'Worked as a JAVA Development Intern building scalable applications, collaborating with senior developers, and delivering Projects using AI-assisted coding tools to enhance productivity and code quality.',
    skills: ['JAVA', 'Team Collaboration', 'AI Tools'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  },
 /* {
    id: 'course-dsa',
    title: 'DSA Course ',
    category: 'course',
    organization: 'GeeksforGeeks',
    date: 'Feb 2025',
    description: 'Completed an intensive Data Structures and Algorithms course covering arrays, linked lists, trees, graphs, dynamic programming, and competitive coding strategies.',
    skills: ['C++', 'DSA', 'Algorithms'],
    image: null,
    credentialUrl: '#',
    credentialId: 'GFG-DSA-2025'
  },*/

  {
    id: 'Hack-2026',
    title: 'Hackathon -2026 RR Institute of Modern Technology',
    category: 'achievement',
    organization: 'RRGI INNOVATHON - 2026',
    date: 'Apr 2025',
    description: 'Participated in Hackthon RRGI and give our best to solve real-world problems using innovative solutions and collaborative teamwork. Our team developed a web application that addressed a pressing social issue, showcasing our technical skills and creativity.',
    skills: ['Problem Solving', 'Teamwork', 'Web Dev'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  },

 /* {
    id: 'cert-python',
    title: 'Python Programming Certificate',
    category: 'certificate',
    organization: 'Coursera',
    date: 'Dec 2024',
    description: 'Earned a certification in Python programming covering data types, control flow, functions, file handling, and introduction to libraries like NumPy and Pandas.',
    skills: ['Python', 'Automation', 'Data Analysis'],
    image: null,
    credentialUrl: '#',
    credentialId: 'CERT-PY-2024-042'
  },*/

  {
    id: 'course-git',
    title: 'Git & GitHub Masterclass',
    category: 'course',
    organization: 'Simplilearn',
    date: 'Nov 2025',
    description: 'All Basic version control with Git and GitHub including branching strategies, pull requests, collaboration workflows, and CI/CD fundamentals and push code to GitHub repository for real-world project collaboration.',
    skills: ['Git', 'GitHub', 'Version Control'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  },
  {
    id: 'award-academic',
    title: 'Academic Excellence',
    category: 'achievement',
    organization: 'R R Institute of Modern Technology',
    date: 'Aug 2025',
    description: 'Recognized for outstanding academic performance and consistent contributions to the Computer Science department through projects and Academic Results.',
    skills: ['Computer Science', 'Leadership'],
    image: null,
    credentialUrl: '#',
    credentialId: null
  }
];

function initAchievements() {
  const fan = document.getElementById('achievementsFan');
  const countersEl = document.getElementById('achievementCounters');
  const filterBtns = document.querySelectorAll('[data-achievement-filter]');
  const viewAllWrap = document.getElementById('achievementsViewAllWrap');

  if (viewAllWrap) {
    viewAllWrap.style.display = 'none';
  }

  /* ── Render Counters ─── */
  renderCounters();

  /* ── Setup Modal ─── */
  initCertModal();

  if (!fan) return;

  /* ── Attach Certificate Preview Modal Trigger to Buttons ─── */
  fan.querySelectorAll('.achievement-view-cert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-achievement-id');
      openCertModal(id);
    });
  });

  /* ── Setup Filters ─── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterVal = btn.getAttribute('data-achievement-filter');
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
    });
  });

  /* ── Render counters ─── */
  function renderCounters() {
    if (!countersEl) return;

    const counts = {};
    const labels = {
      certificate: { label: 'Certificates', icon: 'fa-certificate' },
      course: { label: 'Courses', icon: 'fa-book' },
      internship: { label: 'Internships', icon: 'fa-briefcase' },
      achievement: { label: 'Achievements', icon: 'fa-trophy' }
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
        <div class="achievement-counter-pill">
          <i class="fa-solid ${meta.icon}"></i>
          <span class="counter-num" data-count="${count}">${count}+</span>
          ${meta.label}
        </div>
      `);
    });

    countersEl.innerHTML = pills.join('');
  }
}


/* 
   23. CERTIFICATE PREVIEW MODAL
    */
function initCertModal() {
  const overlay = document.getElementById('certModalOverlay');
  const closeBtn = document.getElementById('certModalClose');
  const modalImg = document.getElementById('certModalImage');
  const modalInfo = document.getElementById('certModalInfo');
  const zoomInBtn = document.getElementById('certModalZoomIn');
  const zoomOutBtn = document.getElementById('certModalZoomOut');
  const zoomResetBtn = document.getElementById('certModalZoomReset');

  if (!overlay) return;

  let currentZoom = 1;
  const ZOOM_STEP = 0.25;
  const ZOOM_MAX = 3;
  const ZOOM_MIN = 0.5;

  /* ── Close modal ─── */
  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    currentZoom = 1;
    if (modalImg) modalImg.style.transform = `scale(1)`;
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.style.display = 'none';
      }
    }, 400);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Keyboard Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  /* ── Zoom controls ─── */
  function setZoom(level) {
    currentZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, level));
    if (modalImg) modalImg.style.transform = `scale(${currentZoom})`;
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(currentZoom + ZOOM_STEP));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(currentZoom - ZOOM_STEP));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => setZoom(1));
}

/* ── Open modal with achievement data ─── */
function openCertModal(achievementId) {
  const overlay = document.getElementById('certModalOverlay');
  const modalImg = document.getElementById('certModalImage');
  const modalInfo = document.getElementById('certModalInfo');

  if (!overlay) return;

  const achievement = achievementsData.find(a => a.id === achievementId);
  if (!achievement) return;

  // Set image
  if (achievement.image) {
    modalImg.src = achievement.image;
    modalImg.style.display = 'block';
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
      placeholder.style.minHeight = '250px';
      placeholder.innerHTML = `<i class="fa-solid ${icon} placeholder-icon" style="font-size:5rem;"></i>
        <span class="placeholder-label">Certificate image placeholder</span>`;
      wrap.appendChild(placeholder);
    }
  }

  // Set info
  const credentialHTML = achievement.credentialId
    ? `<div class="cert-modal-info-credential"><strong>Credential ID:</strong> ${achievement.credentialId}</div>`
    : '';

  const skillsHTML = achievement.skills.map(s => `<span>${s}</span>`).join('');

  modalInfo.innerHTML = `
    <h3 class="cert-modal-info-title">${achievement.title}</h3>
    <div class="cert-modal-info-org"><i class="fa-solid fa-building"></i> ${achievement.organization}</div>
    <div class="cert-modal-info-date"><i class="fa-solid fa-calendar"></i> ${achievement.date}</div>
    <p class="cert-modal-info-desc">${achievement.description}</p>
    ${credentialHTML}
    <div class="cert-modal-info-skills">${skillsHTML}</div>
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


/* 
   24. RESOURCES — NOTES, BOOKS & IMPORTANT QUESTIONS
    */

/* ── Resource Data — Add your own entries here ─── */
const resourcesData = [
  {
    id: 'res-dsa-notes',
    title: 'Data Structures & Algorithms Notes',
    category: 'notes',
    icon: 'fa-solid fa-laptop-code',
    description: 'Comprehensive handwritten and typed notes covering arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and dynamic programming.',
    content: [
      'Arrays & Strings — sliding window, two pointers, prefix sums',
      'Linked Lists — reversal, cycle detection, merge techniques',
      'Trees & Graphs — BFS, DFS, shortest path, MST',
      'Dynamic Programming — memoization, tabulation, classic problems',
      'Sorting & Searching — quicksort, mergesort, binary search variants'
    ],
    tags: ['DSA', 'C++', 'Algorithms', 'Competitive Programming'],
    actionLabel: 'Read Notes',
    actionIcon: 'fa-solid fa-book-open-reader',
    actionUrl: '#'
  },
  {
    id: 'res-os-notes',
    title: 'Operating Systems Concepts',
    category: 'notes',
    icon: 'fa-solid fa-server',
    description: 'Detailed notes on OS fundamentals including process management, memory management, file systems, CPU scheduling, and synchronization primitives.',
    content: [
      'Process Management — states, PCB, context switching',
      'CPU Scheduling — FCFS, SJF, Round Robin, Priority',
      'Memory Management — paging, segmentation, virtual memory',
      'Deadlocks — prevention, avoidance, detection, recovery',
      'File Systems — allocation methods, directory structures'
    ],
    tags: ['OS', 'Systems', 'Theory', 'BTech CS'],
    actionLabel: 'Read Notes',
    actionIcon: 'fa-solid fa-book-open-reader',
    actionUrl: '#'
  },
  {
    id: 'res-clrs-book',
    title: 'Introduction to Algorithms (CLRS)',
    category: 'books',
    icon: 'fa-solid fa-book',
    description: 'The gold-standard textbook for algorithms. Covers algorithm design, analysis, and a broad range of data structures used in computer science.',
    content: [
      'Foundations — growth of functions, recurrences, probabilistic analysis',
      'Sorting & Order Statistics — heapsort, quicksort, linear-time sorting',
      'Data Structures — hash tables, BSTs, red-black trees, B-trees',
      'Advanced Design — dynamic programming, greedy algorithms, amortized analysis',
      'Graph Algorithms — BFS, DFS, MST, shortest paths, network flow'
    ],
    tags: ['Algorithms', 'Textbook', 'CS Fundamentals'],
    actionLabel: 'View Book',
    actionIcon: 'fa-solid fa-arrow-up-right-from-square',
    actionUrl: '#'
  },
  {
    id: 'res-clean-code',
    title: 'Clean Code by Robert C. Martin',
    category: 'books',
    icon: 'fa-solid fa-broom',
    description: 'A handbook of agile software craftsmanship. Learn how to write readable, maintainable, and elegant code through real-world examples and principles.',
    content: [
      'Meaningful Names — choosing intention-revealing names',
      'Functions — small, focused, single-responsibility functions',
      'Comments — good comments vs bad comments',
      'Error Handling — exceptions over return codes',
      'Code Smells — identifying and refactoring bad patterns'
    ],
    tags: ['Software Engineering', 'Best Practices', 'Clean Code'],
    actionLabel: 'View Book',
    actionIcon: 'fa-solid fa-arrow-up-right-from-square',
    actionUrl: '#'
  },
  {
    id: 'res-dsa-interview',
    title: 'Top 50 DSA Interview Questions',
    category: 'questions',
    icon: 'fa-solid fa-code',
    description: 'Curated collection of the most frequently asked Data Structures & Algorithms questions in technical interviews at top tech companies.',
    content: [
      'Array — two sum, maximum subarray, merge intervals',
      'String — longest palindrome, anagram grouping, pattern matching',
      'Tree — level order traversal, LCA, diameter of binary tree',
      'Graph — number of islands, course schedule, detect cycle',
      'DP — longest common subsequence, coin change, 0/1 knapsack'
    ],
    tags: ['Interview Prep', 'DSA', 'Problem Solving'],
    actionLabel: 'Practice Questions',
    actionIcon: 'fa-solid fa-pen-to-square',
    actionUrl: '#'
  },
  {
    id: 'res-oop-practice',
    title: 'OOP Concepts Practice Set',
    category: 'questions',
    icon: 'fa-solid fa-cubes',
    description: 'Practice problems and conceptual questions on Object-Oriented Programming including inheritance, polymorphism, abstraction, and design patterns.',
    content: [
      'Encapsulation — access modifiers, getters/setters, data hiding',
      'Inheritance — types, method overriding, super keyword',
      'Polymorphism — compile-time vs runtime, virtual functions',
      'Abstraction — abstract classes, interfaces, real-world modeling',
      'Design Patterns — singleton, factory, observer, strategy'
    ],
    tags: ['OOP', 'Java', 'C++', 'Design Patterns'],
    actionLabel: 'Practice Questions',
    actionIcon: 'fa-solid fa-pen-to-square',
    actionUrl: '#'
  }
];

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

  /* ── State variables for continuous 3D ribbon motion ─── */
  let scrollOffset = 0;
  let targetOffset = 0;
  let isPlaying = true;
  let isHovered = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let dragDelta = 0;
  const speed = 0.55;
  const cardStep = 232; // card width + gap

  // Measure single loop width after rendering
  let singleWidth = 0;
  function updateMeasurements() {
    singleWidth = (allCards.length / 2) * cardStep;
  }
  updateMeasurements();
  window.addEventListener('resize', updateMeasurements);

  /* ── 3D Cylinder Curvature Transform Updater ─── */
  function update3DCurvature() {
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const centerX = stageRect.left + stageRect.width / 2;
    const halfWidth = Math.max(stageRect.width * 0.45, 300);

    allCards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const relDist = (cardCenter - centerX) / halfWidth;
      const clampedDist = Math.max(-1.5, Math.min(1.5, relDist));

      // Concave cylinder curve:
      // Left cards turned towards center (positive rotateY), right cards turned towards center (negative rotateY)
      const rotateY = clampedDist * 22;
      const translateZ = -Math.pow(Math.abs(clampedDist), 1.35) * 45;
      const scale = Math.max(0.86, 1 - Math.pow(Math.abs(clampedDist), 2) * 0.07);

      card.style.transform = `perspective(1200px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`;
    });
  }

  /* ── Continuous Animation Loop ─── */
  function animateRibbon() {
    if (isPlaying && !isHovered && !isDragging) {
      targetOffset -= speed;
    }

    // Smooth lerp
    scrollOffset += (targetOffset - scrollOffset) * 0.12;

    // Seamless loop wrapping
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

  /* ── Hover Pause/Resume ─── */
  stage.addEventListener('mouseenter', () => { isHovered = true; });
  stage.addEventListener('mouseleave', () => { isHovered = false; });

  /* ── Drag & Swipe Interaction ─── */
  function onDragStart(clientX) {
    isDragging = true;
    dragStartX = clientX;
    dragStartOffset = targetOffset;
    dragDelta = 0;
  }

  function onDragMove(clientX) {
    if (!isDragging) return;
    dragDelta = clientX - dragStartX;
    targetOffset = dragStartOffset + dragDelta;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
  }

  // Mouse events
  stage.addEventListener('mousedown', (e) => {
    onDragStart(e.clientX);
  });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) onDragMove(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    if (isDragging) onDragEnd();
  });

  // Touch events
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) onDragStart(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) onDragMove(e.touches[0].clientX);
  }, { passive: true });
  window.addEventListener('touchend', () => {
    if (isDragging) onDragEnd();
  });

  /* ── Cards are moving display items and do not click into modals ─── */
  track.addEventListener('click', (e) => {
    // Allow direct clicks on any standard external links if present
    if (!e.target.closest('a')) {
      e.preventDefault();
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
    prevBtn.addEventListener('click', () => {
      targetOffset += cardStep;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      targetOffset -= cardStep;
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
      playBtn.title = isPlaying ? 'Auto-moving is active' : 'Auto-moving is paused';
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

  // Cards are animated 3D curved elements (no modal popup on click)
  allCards.forEach(card => {
    card.style.cursor = 'default';
    card.addEventListener('click', (e) => {
      // Allow natural external link if specifically clicked
      const extLink = e.target.closest('a');
      if (extLink && extLink.getAttribute('href')?.startsWith('http') && !e.target.closest('.arc-card-inner')) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      // Center this card in the 3D arc without opening any modal popup
      const vIdx = visibleCards.indexOf(card);
      if (vIdx !== -1) {
        activeIndex = vIdx;
        updateArcPositions();
      }
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

/* ── Global Helper: Open Card Detail Modal ─── */
function openCardDetail(card) {
  if (!card) return;

  const certId = card.getAttribute('data-cert-id');
  if (certId && typeof openCertModal === 'function') {
    openCertModal(certId);
    return;
  }

  const modal = document.getElementById('arcDetailModal');
  const body = document.getElementById('arcModalBody');
  if (!modal || !body) return;

  // Ensure modal is visible before showing
  modal.style.display = 'flex';

  const title = card.getAttribute('data-title') || '';
  const sub = card.getAttribute('data-sub') || '';
  const org = card.getAttribute('data-org') || '';
  const desc = card.getAttribute('data-desc') || '';
  const tagsStr = card.getAttribute('data-tags') || '';
  const link = card.getAttribute('data-link') || '';
  const linkText = card.getAttribute('data-link-text') || 'Explore More';

  const tags = tagsStr.split(',').filter(Boolean);

  let actionHtml = '';
  if (certId) {
    actionHtml = `
      <button type="button" class="btn btn-primary btn-sm achievement-view-cert-btn" data-achievement-id="${certId}">
        <i class="fa-solid fa-certificate"></i> View Certificate
      </button>
    `;
  } else if (link) {
    const isExternal = link.startsWith('http');
    actionHtml = `
      <a href="${link}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn btn-primary btn-sm">
        <i class="fa-solid fa-arrow-up-right-from-square"></i> ${linkText}
      </a>
    `;
  }

  body.innerHTML = `
    <span class="arc-modal-meta-tag">${sub || 'Showcase'}</span>
    <h3 class="arc-modal-title">${title}</h3>
    ${org ? `<div class="arc-modal-sub"><i class="fa-solid fa-layer-group"></i> ${org}</div>` : ''}
    <p class="arc-modal-desc">${desc}</p>
    ${tags.length ? `
      <div class="arc-modal-tags">
        ${tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    ` : ''}
    <div class="arc-modal-actions">
      ${actionHtml}
    </div>
  `;

  // Wire cert button inside modal if present
  const modalCertBtn = body.querySelector('.achievement-view-cert-btn');
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

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Ensure custom cursor stays explicitly active and visible on top of modal
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

/* ── Arc Detail Modal Engine ─── */
function setupArcDetailModal() {
  const modal = document.getElementById('arcDetailModal');
  const closeBtn = document.getElementById('arcModalClose');
  if (!modal) return;

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 400);

    const cur = document.getElementById('cursor');
    const fol = document.getElementById('cursorFollower');
    if (cur) cur.classList.remove('cursor-hover');
    if (fol) fol.classList.remove('cursor-hover');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Explicit button clicks also open
  document.querySelectorAll('.arc-open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const card = btn.closest('.arc-card');
      openCardDetail(card);
    });
  });

  // Wire cert button triggers directly on arc cards
  document.querySelectorAll('.arc-card .achievement-view-cert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id = btn.getAttribute('data-achievement-id');
      if (typeof openCertModal === 'function') {
        openCertModal(id);
      }
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

  /* ── Close modal ─── */
  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!overlay.classList.contains('active')) {
        overlay.style.display = 'none';
      }
    }, 400);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click outside modal to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Keyboard Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ── Open modal with resource data ─── */
function openResourceModal(resourceId) {
  const overlay = document.getElementById('resourceModalOverlay');
  const modalBody = document.getElementById('resourceModalBody');

  if (!overlay || !modalBody) return;

  const resource = resourcesData.find(r => r.id === resourceId);
  if (!resource) return;

  const categoryMeta = {
    notes: { icon: 'fa-sticky-note', label: 'Notes', bgClass: 'notes-bg' },
    books: { icon: 'fa-book-open', label: 'Book', bgClass: 'books-bg' },
    questions: { icon: 'fa-circle-question', label: 'Questions', bgClass: 'questions-bg' }
  };
  const meta = categoryMeta[resource.category] || { icon: 'fa-file', label: 'Resource', bgClass: 'notes-bg' };

  const tagsHTML = resource.tags.map(t => `<span>${t}</span>`).join('');
  const contentHTML = resource.content.map(item => `<li>${item}</li>`).join('');

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
        <h4><i class="fa-solid fa-list-check"></i> Contents Overview</h4>
        <ul>${contentHTML}</ul>
      </div>
      <div class="resource-modal-tags">${tagsHTML}</div>
    </div>
    <div class="resource-modal-actions">
      <a href="${resource.actionUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
        <i class="${resource.actionIcon}"></i> ${resource.actionLabel}
      </a>
      <button class="btn btn-outline" onclick="document.getElementById('resourceModalOverlay').classList.remove('active'); document.body.style.overflow=''; setTimeout(()=>{document.getElementById('resourceModalOverlay').style.display='none'},400)">
        <i class="fa-solid fa-xmark"></i> Close
      </button>
    </div>
  `;

  // Show modal
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      overlay.focus();
    });
  });
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

