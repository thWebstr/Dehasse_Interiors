/**
 * De Hasse Architectural & Interior Design
 * Core JavaScript: Hero Carousel (8 slides + arrows + dots), Mobile Nav, Scroll Fade
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. MOBILE NAVIGATION TOGGLE & ACTIVE STATE
  // -------------------------------------------------------------------------
  const menuToggles = document.querySelectorAll('#menuToggle, .mobile-menu-toggle, .mobile-nav-toggle');
  const mobileNav = document.getElementById('mobileNav') || document.querySelector('.mobile-nav-overlay');
  const closeButtons = document.querySelectorAll('#mobileNavClose, .mobile-nav-close, [data-close-nav]');
  const header = document.querySelector('.site-header');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight current active link across desktop and mobile navs
  document.querySelectorAll('.header-nav a, .main-nav a, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const openNav = () => {
    if (mobileNav) {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
    }
    if (header) {
      header.classList.add('nav-open');
      header.classList.remove('header-hidden');
    }
    menuToggles.forEach(btn => {
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    });
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
    if (header) {
      header.classList.remove('nav-open');
    }
    menuToggles.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
    document.body.style.overflow = '';
  };

  menuToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = (mobileNav && mobileNav.classList.contains('open')) || (header && header.classList.contains('nav-open'));
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeNav();
    });
  });

  // Close when clicking any nav link
  document.querySelectorAll('.mobile-nav-links a, .main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });

  // -------------------------------------------------------------------------
  // 1B. SMART STICKY HEADER (Slide up on scroll-down, slide down on scroll-up)
  // -------------------------------------------------------------------------
  if (header) {
    let lastScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
    let ticking = false;
    const scrollThreshold = 8;  // min delta in pixels before triggering slide
    const topSafeZone = 80;     // within 80px from top of page, header remains anchored

    const onScroll = () => {
      const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);

      // If mobile navigation is open, never hide header
      const isMobileNavOpen = mobileNav && mobileNav.classList.contains('open');
      if (isMobileNavOpen) {
        header.classList.remove('header-hidden');
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      // Add elevated shadow/subtle blur when scrolled past top
      if (currentScrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      // At top of page: always show header
      if (currentScrollY <= topSafeZone) {
        header.classList.remove('header-hidden');
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const delta = currentScrollY - lastScrollY;

      // Only respond if delta exceeds threshold to avoid jitter
      if (Math.abs(delta) >= scrollThreshold) {
        if (delta > 0 && currentScrollY > topSafeZone) {
          // Scrolling down: slide up out of view
          header.classList.add('header-hidden');
        } else if (delta < 0) {
          // Scrolling up: slide down into view
          header.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // 2. HERO CAROUSEL (8 Slides, Left/Right Buttons, Dots, Auto-Advance, Swiping)
  // -------------------------------------------------------------------------
  const slides = document.querySelectorAll('.carousel-slide, .hero-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carouselPrev') || document.querySelector('.carousel-prev');
  const nextBtn = document.getElementById('carouselNext') || document.querySelector('.carousel-next');
  const carouselContainer = document.querySelector('.hero-carousel');
  
  if (slides.length > 0) {
    let currentIndex = 0;
    let timerId = null;
    const intervalDuration = 6000;

    const goToSlide = (newIndex) => {
      slides[currentIndex].classList.remove('active', 'is-active');
      if (dots[currentIndex]) {
        dots[currentIndex].classList.remove('active');
      }

      currentIndex = (newIndex + slides.length) % slides.length;

      slides[currentIndex].classList.add('active', 'is-active');
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add('active');
      }
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    const startAutoAdvance = () => {
      stopAutoAdvance();
      timerId = setInterval(nextSlide, intervalDuration);
    };

    const stopAutoAdvance = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    // Next / Prev button listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoAdvance();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoAdvance();
      });
    }

    // Dots listeners
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
        startAutoAdvance();
      });
    });

    // Keyboard navigation (ArrowLeft & ArrowRight)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoAdvance();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoAdvance();
      }
    });

    // Touch swipe support on mobile devices
    if (carouselContainer) {
      let touchStartX = 0;
      let touchEndX = 0;

      carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoAdvance();
        }
      }, { passive: true });

      // Pause on hover
      carouselContainer.addEventListener('mouseenter', stopAutoAdvance);
      carouselContainer.addEventListener('mouseleave', startAutoAdvance);
    }

    // Initialize auto-rotation
    startAutoAdvance();
  }

  // -------------------------------------------------------------------------
  // 3. SUBTLE SCROLL FADE-IN
  // -------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // -------------------------------------------------------------------------
  // 4. MOBILE PROJECT IMAGE CAROUSELS
  // -------------------------------------------------------------------------
  /**
   * Wraps each .project-showcase-grid in a .project-carousel-wrap and
   * injects prev/next buttons, a slide counter, and dot pagination.
   * Syncs with native CSS scroll-snap via scrollLeft.
   * Only active on viewports ≤ 767px; tears down / rebuilds on resize.
   */
  const MOBILE_BP = 768;

  function initProjectCarousels() {
    document.querySelectorAll('.project-showcase-grid').forEach(grid => {
      // Already wrapped → skip
      if (grid.closest('.project-carousel-wrap')) return;

      const items = Array.from(grid.querySelectorAll('.project-media-item'));
      if (items.length < 2) return;

      const total = items.length;

      // ── Wrap ────────────────────────────────────────────────────────────
      const wrap = document.createElement('div');
      wrap.className = 'project-carousel-wrap';
      grid.parentNode.insertBefore(wrap, grid);
      wrap.appendChild(grid);

      // ── Counter badge ────────────────────────────────────────────────────
      const counter = document.createElement('span');
      counter.className = 'carousel-counter';
      counter.setAttribute('aria-live', 'polite');
      wrap.appendChild(counter);

      // ── Prev / Next buttons ──────────────────────────────────────────────
      const svgPrev = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
      const svgNext = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

      const btnPrev = document.createElement('button');
      btnPrev.className = 'carousel-btn carousel-btn-prev';
      btnPrev.setAttribute('aria-label', 'Previous image');
      btnPrev.innerHTML = svgPrev;
      wrap.appendChild(btnPrev);

      const btnNext = document.createElement('button');
      btnNext.className = 'carousel-btn carousel-btn-next';
      btnNext.setAttribute('aria-label', 'Next image');
      btnNext.innerHTML = svgNext;
      wrap.appendChild(btnNext);

      // ── Dot indicators ───────────────────────────────────────────────────
      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'carousel-dots';
      dotsWrap.setAttribute('role', 'tablist');
      const dotEls = items.map((_, i) => {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', `Image ${i + 1}`);
        dotsWrap.appendChild(d);
        return d;
      });
      // Insert dots AFTER the wrap (not inside, so they sit below the image)
      wrap.parentNode.insertBefore(dotsWrap, wrap.nextSibling);

      // ── State ────────────────────────────────────────────────────────────
      let current = 0;
      let isScrolling = false;

      function updateUI(idx) {
        current = idx;
        counter.textContent = `${idx + 1} / ${total}`;
        dotEls.forEach((d, i) => d.classList.toggle('active', i === idx));
        btnPrev.disabled = idx === 0;
        btnNext.disabled = idx === total - 1;
      }

      function goTo(idx) {
        if (idx < 0 || idx >= total) return;
        const itemW = grid.offsetWidth;
        grid.scrollTo({ left: idx * itemW, behavior: 'smooth' });
        updateUI(idx);
      }

      // ── Event listeners ──────────────────────────────────────────────────
      btnPrev.addEventListener('click', () => goTo(current - 1));
      btnNext.addEventListener('click', () => goTo(current + 1));

      dotEls.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

      // Sync current index after native scroll-snap settles
      let scrollTimer;
      grid.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const itemW = grid.offsetWidth;
          const newIdx = Math.round(grid.scrollLeft / itemW);
          if (newIdx !== current) updateUI(newIdx);
        }, 80);
      }, { passive: true });

      // ── Init first frame ─────────────────────────────────────────────────
      updateUI(0);

      // Store teardown info on grid element
      grid._carouselTeardown = () => {
        btnPrev.remove();
        btnNext.remove();
        counter.remove();
        dotsWrap.remove();
        wrap.parentNode.insertBefore(grid, wrap);
        wrap.remove();
        delete grid._carouselTeardown;
      };
    });
  }

  function teardownProjectCarousels() {
    document.querySelectorAll('.project-showcase-grid').forEach(grid => {
      if (grid._carouselTeardown) grid._carouselTeardown();
    });
  }

  // Run on load, re-evaluate on resize
  let carouselsActive = false;

  function evaluateCarousels() {
    const isMobile = window.innerWidth < MOBILE_BP;
    if (isMobile && !carouselsActive) {
      initProjectCarousels();
      carouselsActive = true;
    } else if (!isMobile && carouselsActive) {
      teardownProjectCarousels();
      carouselsActive = false;
    }
  }

  evaluateCarousels();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(evaluateCarousels, 150);
  }, { passive: true });
});
