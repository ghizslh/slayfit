// ============================================================
// SLAYFIT GYM — Interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 500);
  });
  // Fallback in case load event already fired
  setTimeout(() => loader.classList.add('hide'), 2200);

  /* ---------- SCROLL PROGRESS ---------- */
  const progressBar = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');
  const navbar = document.getElementById('navbar');

  /* ---------- MOBILE NAV ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- ACTIVE NAV LINK ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.id;
    });
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    navbar.classList.toggle('scrolled', scrollTop > 40);
    scrollTopBtn.classList.toggle('show', scrollTop > 500);

    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Hero elements reveal immediately with stagger (not scroll-dependent)
  const heroEls = document.querySelectorAll('.hero [data-reveal]');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 300 + i * 160);
  });

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const slides = track ? track.children.length : 0;
  let current = 0;
  let autoTimer;

  if (track) {
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    function goTo(index) {
      current = (index + slides) % slides;
      track.style.transform = `translateX(-${current * 100}%)`;
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 5500);
    }
    function stopAuto() {
      clearInterval(autoTimer);
    }

    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);

    startAuto();
  }

  /* ---------- NEWSLETTER FORM ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      input.value = '';
      input.placeholder = 'Merci pour ton inscription !';
    });
  }

  /* ---------- SLAYFOOD MENU MODAL ---------- */
  const openMenuBtn = document.getElementById('openMenuBtn');
  const menuModal = document.getElementById('menuModal');
  const menuModalOverlay = document.getElementById('menuModalOverlay');
  const menuModalClose = document.getElementById('menuModalClose');
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuGrids = document.querySelectorAll('.menu-grid');

  function openMenuModal() {
    menuModal.classList.add('open');
    menuModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenuModal() {
    menuModal.classList.remove('open');
    menuModal.setAttribute('aria-hidden', 'true');
    if (!lightbox.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  if (openMenuBtn) {
    openMenuBtn.addEventListener('click', openMenuModal);
    menuModalOverlay.addEventListener('click', closeMenuModal);
    menuModalClose.addEventListener('click', closeMenuModal);

    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        menuTabs.forEach(t => t.classList.toggle('active', t === tab));
        menuGrids.forEach(grid => {
          grid.hidden = grid.dataset.panel !== target;
        });
      });
    });
  }

  /* ---------- LIGHTBOX (zoom on menu photos) ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const menuPhotos = document.querySelectorAll('.menu-photo');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (!menuModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  menuPhotos.forEach(photo => {
    photo.addEventListener('click', () => {
      const img = photo.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  /* ---------- PROGRAM CARDS → LIGHTBOX ---------- */
  const programCards = document.querySelectorAll('.program-card');
  programCards.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('click', () => openLightbox(img.src, img.alt));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('open')) closeLightbox();
      else if (menuModal.classList.contains('open')) closeMenuModal();
    }
  });

  /* ---------- SMOOTH ANCHOR OFFSET FOR FIXED NAV ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});