/* ==========================================================================
   AVINASH VERMA PORTFOLIO — ANIME.JS CINEMATIC SCROLL & ANIMATIONS ENGINE
   Inspired by animejs.com — Premium Spring Physics, Stagger Waves & Micro-Motion
   ========================================================================== */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Top Scroll Progress Indicator (Anime.js Powered) ── */
  function initScrollProgress() {
    let progressBar = document.getElementById('animeScrollProgress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'animeScrollProgress';
      progressBar.className = 'anime-scroll-progress';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    let ticking = false;
    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* ── Helper: Safe Anime Invocation ── */
  function runAnime(params) {
    if (typeof anime === 'function' && !prefersReducedMotion) {
      return anime(params);
    } else if (params && params.targets) {
      // Fallback: make targets visible
      const els = typeof params.targets === 'string' ? document.querySelectorAll(params.targets) : (params.targets.length !== undefined ? params.targets : [params.targets]);
      Array.from(els).forEach(el => {
        if (el && el.style) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }
    return null;
  }

  /* ── Helper: Intersection Observer Scroll Trigger ── */
  function observeSection(selector, callback, options) {
    options = options || {};
    const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!target) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          if (options.once !== false) {
            obs.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: options.threshold || 0.12,
      rootMargin: options.rootMargin || '0px 0px -50px 0px'
    });

    observer.observe(target);
  }

  /* ── 2. Universal Section Header Entrance Animations ── */
  function initSectionHeaderScroll() {
    const headers = document.querySelectorAll('.section-header, .arc-stage-header');
    headers.forEach(header => {
      observeSection(header, () => {
        const tag = header.querySelector('.section-tag, .arc-stage-badge');
        const title = header.querySelector('.section-title, .arc-stage-title');
        const subtitle = header.querySelector('.section-subtitle, .arc-stage-desc');
        const hl = header.querySelector('.highlight');

        if (tag) {
          runAnime({
            targets: tag,
            opacity: [0, 1],
            translateY: [-18, 0],
            scale: [0.82, 1],
            letterSpacing: ['6px', '2px'],
            duration: 750,
            easing: 'spring(1, 80, 10, 0)'
          });
        }

        if (title) {
          runAnime({
            targets: title,
            opacity: [0, 1],
            translateY: [32, 0],
            duration: 900,
            delay: 100,
            easing: 'cubicBezier(0.16, 1, 0.3, 1)'
          });

          if (hl) {
            let line = hl.querySelector('.hl-line');
            if (!line) {
              line = document.createElement('span');
              line.className = 'hl-line';
              hl.appendChild(line);
            }
            runAnime({
              targets: line,
              scaleX: [0, 1],
              opacity: [0, 1],
              duration: 850,
              delay: 450,
              easing: 'easeOutExpo'
            });
          }
        }

        if (subtitle) {
          runAnime({
            targets: subtitle,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: 250,
            easing: 'easeOutCubic'
          });
        }
      });
    });
  }

  /* ── 3. Hero Section Entrance (Immediate + Parallax) ── */
  function initHeroAnime() {
    const hero = document.getElementById('home');
    if (!hero) return;

    if (typeof anime === 'function' && !prefersReducedMotion) {
      const heroTl = anime.timeline({
        easing: 'easeOutExpo'
      });

      heroTl
        .add({
          targets: '.hero-tag',
          opacity: [0, 1],
          translateY: [-24, 0],
          scale: [0.8, 1],
          duration: 900,
          easing: 'spring(1, 80, 10, 0)'
        }, 100)
        .add({
          targets: '.hero-title',
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1000,
          easing: 'cubicBezier(0.16, 1, 0.3, 1)'
        }, 220)
        .add({
          targets: '.hero-description',
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 900,
          easing: 'easeOutCubic'
        }, 380)
        .add({
          targets: '.hero-buttons .btn',
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.9, 1],
          delay: anime.stagger(120),
          duration: 800,
          easing: 'spring(1, 75, 10, 0)'
        }, 500)
        .add({
          targets: '.social-links .social-icon',
          opacity: [0, 1],
          translateY: [16, 0],
          scale: [0.75, 1],
          delay: anime.stagger(80),
          duration: 700,
          easing: 'spring(1, 85, 12, 0)'
        }, 650)
        .add({
          targets: '.hero-image-wrapper',
          opacity: [0, 1],
          translateX: [45, 0],
          scale: [0.92, 1],
          duration: 1100,
          easing: 'cubicBezier(0.16, 1, 0.3, 1)'
        }, 300);

      // Continuous ambient float for hero orbs
      anime({
        targets: '.hero-orb-1, .hero-orb-2',
        translateY: [-14, 14],
        translateX: [-10, 10],
        duration: 4800,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
    }
  }

  /* ── 4. About Section Scroll Entrance & Stat Counters ── */
  function initAboutScroll() {
    observeSection('#about', () => {
      runAnime({
        targets: '.about-text',
        opacity: [0, 1],
        translateX: [-35, 0],
        duration: 900,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.about-image-wrapper',
        opacity: [0, 1],
        translateX: [35, 0],
        scale: [0.92, 1],
        duration: 1000,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.about-stats .stat-card',
        opacity: [0, 1],
        translateY: [35, 0],
        scale: [0.85, 1],
        delay: (typeof anime === 'function' ? anime.stagger(130) : 100),
        duration: 850,
        easing: 'spring(1, 75, 10, 0)',
        complete: () => {
          // Count up numbers
          document.querySelectorAll('.about-stats .stat-card .stat-number').forEach(numEl => {
            const raw = numEl.textContent.trim();
            const val = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
            const suffix = raw.replace(/[0-9.]/g, '');
            const obj = { count: 0 };
            if (typeof anime === 'function') {
              anime({
                targets: obj,
                count: val,
                round: 1,
                duration: 1200,
                easing: 'easeOutExpo',
                update: () => {
                  numEl.textContent = obj.count + suffix;
                }
              });
            }
          });
        }
      });
    });
  }

  /* ── 5. Education Timeline Scroll Animation ── */
  function initEducationScroll() {
    observeSection('#education', () => {
      runAnime({
        targets: '.timeline-dot',
        scale: [0, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(140) : 100),
        duration: 700,
        easing: 'spring(1, 85, 12, 0)'
      });

      runAnime({
        targets: '.timeline-item:nth-child(odd) .timeline-card',
        translateX: [-40, 0],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(160) : 100),
        duration: 900,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.timeline-item:nth-child(even) .timeline-card',
        translateX: [40, 0],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(160) : 100),
        duration: 900,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.timeline-tags span',
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(50, { from: 'start' }) : 50),
        duration: 600,
        easing: 'spring(1, 80, 10, 0)'
      });
    });
  }

  /* ── 6. Skills Section Scroll & Dynamic Bar Fill ── */
  function initSkillsScroll() {
    observeSection('#skills', () => {
      runAnime({
        targets: '.skills-group',
        translateY: [40, 0],
        opacity: [0, 1],
        scale: [0.94, 1],
        delay: (typeof anime === 'function' ? anime.stagger(150) : 100),
        duration: 900,
        easing: 'spring(1, 80, 10, 0)'
      });

      // Animate skill bar fills with numerical interpolation
      document.querySelectorAll('.skill-bar-item').forEach((item, idx) => {
        const fill = item.querySelector('.skill-bar-fill');
        const percentEl = item.querySelector('.skill-percent');
        const targetWidth = fill ? (parseFloat(fill.getAttribute('data-width')) || 80) : 80;

        if (fill) {
          fill.style.width = '0%';
          runAnime({
            targets: fill,
            width: targetWidth + '%',
            duration: 1200,
            delay: 200 + (idx * 60),
            easing: 'easeOutExpo'
          });
        }

        if (percentEl && typeof anime === 'function') {
          const counter = { val: 0 };
          anime({
            targets: counter,
            val: targetWidth,
            round: 1,
            duration: 1200,
            delay: 200 + (idx * 60),
            easing: 'easeOutExpo',
            update: () => {
              percentEl.textContent = counter.val + '%';
            }
          });
        }
      });
    });
  }

  /* ── 7. Projects Section 3D Fan Entrance & Hover ── */
  function initProjectsScroll() {
    observeSection('#projects', () => {
      runAnime({
        targets: '.projects-filter-btn, .filter-btn',
        scale: [0.85, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(80) : 50),
        duration: 650,
        easing: 'spring(1, 85, 12, 0)'
      });

      runAnime({
        targets: '.project-card',
        translateY: [55, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        rotateX: [10, 0],
        delay: (typeof anime === 'function' ? anime.stagger(110, { from: 'center' }) : 100),
        duration: 950,
        easing: 'spring(1, 80, 10, 0)'
      });
    });

    // 3D Tilt on Mousemove with Anime Elastic return
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (-y / rect.height) * 12;
        const ry = (x / rect.width) * 12;
        card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-8px)';
      });

      card.addEventListener('mouseleave', () => {
        runAnime({
          targets: card,
          rotateX: 0,
          rotateY: 0,
          translateY: 0,
          duration: 700,
          easing: 'spring(1, 75, 10, 0)'
        });
      });
    });
  }

  /* ── 8. Achievements Section Counters & Badges ── */
  function initAchievementsScroll() {
    observeSection('#achievements', () => {
      runAnime({
        targets: '.achievement-card',
        translateY: [40, 0],
        scale: [0.88, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(100) : 80),
        duration: 850,
        easing: 'spring(1, 75, 10, 0)'
      });

      // Animated counters
      document.querySelectorAll('.achievement-count, .achieve-num').forEach(el => {
        const raw = el.textContent.trim();
        const val = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
        const suffix = raw.replace(/[0-9.]/g, '');
        const obj = { n: 0 };
        if (typeof anime === 'function') {
          anime({
            targets: obj,
            n: val,
            round: 1,
            duration: 1400,
            easing: 'easeOutExpo',
            update: () => {
              el.textContent = obj.n + suffix;
            }
          });
        }
      });
    });
  }

  /* ── 9. Learning Resources 3D Ribbon Stage Entrance ── */
  function initResourcesScroll() {
    observeSection('#resources', () => {
      runAnime({
        targets: '.resources-panoramic-stage',
        scale: [0.93, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.ribbon-card-wrap',
        translateY: [35, 0],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(70, { from: 'center' }) : 60),
        duration: 800,
        easing: 'spring(1, 80, 10, 0)'
      });
    });
  }

  /* ── 10. Coding Journey 3D Arc Showcase Reticle Snap ── */
  function initJourneyScroll() {
    observeSection('#journey', () => {
      runAnime({
        targets: '#journeyStageFrame .arc-corner-bracket.bracket-tl',
        translateX: [-18, 0],
        translateY: [-18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });
      runAnime({
        targets: '#journeyStageFrame .arc-corner-bracket.bracket-tr',
        translateX: [18, 0],
        translateY: [-18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });
      runAnime({
        targets: '#journeyStageFrame .arc-corner-bracket.bracket-bl',
        translateX: [-18, 0],
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });
      runAnime({
        targets: '#journeyStageFrame .arc-corner-bracket.bracket-br',
        translateX: [18, 0],
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });

      runAnime({
        targets: '#journeyStage',
        scale: [0.94, 1],
        opacity: [0, 1],
        duration: 900,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '#journey .arc-photo-round-frame',
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(80) : 50),
        duration: 750,
        easing: 'spring(1, 85, 12, 0)'
      });
    });
  }

  /* ── 11. Curated Visual Gallery Bento Stagger Entrance ── */
  function initGalleryScroll() {
    observeSection('#gallery', () => {
      runAnime({
        targets: '.gallery-filter-btn',
        scale: [0.85, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(70) : 50),
        duration: 650,
        easing: 'spring(1, 85, 12, 0)'
      });

      runAnime({
        targets: '.gallery-card',
        translateY: [45, 0],
        scale: [0.92, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(90, { from: 'start' }) : 80),
        duration: 900,
        easing: 'spring(1, 80, 10, 0)'
      });
    });
  }

  /* ── 12. Hobbies 3D Arc Showcase Reticle Snap ── */
  function initHobbiesScroll() {
    observeSection('#hobbies', () => {
      runAnime({
        targets: '#hobbiesStageFrame .arc-corner-bracket.bracket-tl',
        translateX: [-18, 0],
        translateY: [-18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });
      runAnime({
        targets: '#hobbiesStageFrame .arc-corner-bracket.bracket-tr',
        translateX: [18, 0],
        translateY: [-18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });
      runAnime({
        targets: '#hobbiesStageFrame .arc-corner-bracket.bracket-bl',
        translateX: [-18, 0],
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });
      runAnime({
        targets: '#hobbiesStageFrame .arc-corner-bracket.bracket-br',
        translateX: [18, 0],
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });

      runAnime({
        targets: '#hobbiesStage',
        scale: [0.94, 1],
        opacity: [0, 1],
        duration: 900,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });
    });
  }

  /* ── 13. Resume Section Breakdown Scroll ── */
  function initResumeScroll() {
    observeSection('#resume', () => {
      runAnime({
        targets: '.resume-profile-banner',
        translateY: [-25, 0],
        opacity: [0, 1],
        duration: 850,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.res-gallery-pill',
        scale: [0.85, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(60) : 50),
        duration: 650,
        easing: 'spring(1, 85, 12, 0)'
      });

      runAnime({
        targets: '.resume-visual-card',
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(90, { from: 'center' }) : 70),
        duration: 900,
        easing: 'spring(1, 80, 10, 0)'
      });
    });
  }

  /* ── 14. Contact Section Scroll Entrance ── */
  function initContactScroll() {
    observeSection('#contact', () => {
      runAnime({
        targets: '.contact-info-card, .contact-card',
        translateX: [-40, 0],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(100) : 80),
        duration: 850,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.contact-form-wrapper',
        translateX: [40, 0],
        opacity: [0, 1],
        duration: 850,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.form-group, .contact-form input, .contact-form textarea, .contact-form button',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(70) : 50),
        duration: 700,
        easing: 'spring(1, 80, 10, 0)'
      });
    });
  }

  /* ── 15. Footer Scroll Entrance ── */
  function initFooterScroll() {
    observeSection('.footer', () => {
      runAnime({
        targets: '.footer-col, .footer-brand',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(90) : 70),
        duration: 800,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)'
      });

      runAnime({
        targets: '.footer-social .social-icon, .footer-social a',
        scale: [0, 1],
        opacity: [0, 1],
        delay: (typeof anime === 'function' ? anime.stagger(60) : 50),
        duration: 700,
        easing: 'spring(1, 85, 12, 0)'
      });
    });
  }

  /* ── 16. Magnetic Spring Buttons & Interactive Physics (Anime.js) ── */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    const magneticSelector = '.btn, .nav-cta-btn, .arc-nav-btn, .arc-play-btn, .gallery-filter-btn, .res-nav-btn';
    document.querySelectorAll(magneticSelector).forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;

        runAnime({
          targets: btn,
          translateX: x,
          translateY: y,
          duration: 350,
          easing: 'easeOutQuad'
        });
      });

      btn.addEventListener('mouseleave', () => {
        runAnime({
          targets: btn,
          translateX: 0,
          translateY: 0,
          duration: 750,
          easing: 'spring(1, 80, 10, 0)'
        });
      });
    });
  }

  /* ── 17. Continuous Subtle Floating Animation for Badges ── */
  function initContinuousMotion() {
    if (prefersReducedMotion || typeof anime !== 'function') return;

    // Floating stat cards and badges
    anime({
      targets: '.floating-badge, .nav-glossy-badge',
      translateY: [-5, 5],
      direction: 'alternate',
      loop: true,
      duration: 2800,
      easing: 'easeInOutSine'
    });

    // Ambient glow pulse
    anime({
      targets: '.arc-ambient-glow, .resources-ambient-glow',
      scale: [0.95, 1.05],
      opacity: [0.7, 1],
      direction: 'alternate',
      loop: true,
      duration: 3500,
      easing: 'easeInOutSine'
    });
  }

  /* ── Master Orchestration ── */
  function startAnimeEngine() {
    initScrollProgress();
    initHeroAnime();
    initSectionHeaderScroll();
    initAboutScroll();
    initEducationScroll();
    initSkillsScroll();
    initProjectsScroll();
    initAchievementsScroll();
    initResourcesScroll();
    initJourneyScroll();
    initGalleryScroll();
    initHobbiesScroll();
    initResumeScroll();
    initContactScroll();
    initFooterScroll();
    initMagneticButtons();
    initContinuousMotion();
  }

  // Launch when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimeEngine);
  } else {
    startAnimeEngine();
  }
})();
