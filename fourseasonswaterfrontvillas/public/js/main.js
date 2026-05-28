/* =====================================================
   Four Seasons Waterfront Villas - Main JS
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------
  // STICKY HEADER
  // -----------------------------------------------
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // -----------------------------------------------
  // MOBILE NAV TOGGLE
  // -----------------------------------------------
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
    });
    // Close on nav link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // -----------------------------------------------
  // HERO IMAGE SLIDER
  // -----------------------------------------------
  const slides    = document.querySelectorAll('.slide');
  const dotBtns   = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  let sliderTimer;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dotBtns[currentSlide]?.classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotBtns[currentSlide]?.classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }

  function startSlider() {
    sliderTimer = setInterval(nextSlide, 4000);
  }

  if (slides.length > 0) {
    slides[0].classList.add('active');
    dotBtns[0]?.classList.add('active');
    dotBtns.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(sliderTimer);
        goToSlide(i);
        startSlider();
      });
    });
    startSlider();
  }

  // -----------------------------------------------
  // TESTIMONIAL SLIDER
  // -----------------------------------------------
  const track    = document.querySelector('.testimonial-track');
  const tItems   = document.querySelectorAll('.testimonial-item');
  const prevBtn  = document.querySelector('.t-btn.prev');
  const nextBtn  = document.querySelector('.t-btn.next');
  let tCurrent   = 0;
  let tTimer;

  function goToTestimonial(n) {
    tCurrent = (n + tItems.length) % tItems.length;
    if (track) track.style.transform = `translateX(-${tCurrent * 100}%)`;
  }

  function startTestimonialTimer() {
    tTimer = setInterval(() => goToTestimonial(tCurrent + 1), 5000);
  }

  if (track && tItems.length > 0) {
    prevBtn?.addEventListener('click', () => {
      clearInterval(tTimer);
      goToTestimonial(tCurrent - 1);
      startTestimonialTimer();
    });
    nextBtn?.addEventListener('click', () => {
      clearInterval(tTimer);
      goToTestimonial(tCurrent + 1);
      startTestimonialTimer();
    });
    startTestimonialTimer();
  }

  // -----------------------------------------------
  // LIGHTBOX
  // -----------------------------------------------
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightbox-img');
  const lbClose     = document.getElementById('lightbox-close');
  const lbPrev      = document.getElementById('lightbox-prev');
  const lbNext      = document.getElementById('lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let lbIndex = 0;

  function openLightbox(index) {
    lbIndex = index;
    const img = galleryItems[lbIndex]?.querySelector('img');
    if (img && lbImg) {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
    }
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbNavigate(dir) {
    lbIndex = (lbIndex + dir + galleryItems.length) % galleryItems.length;
    const img = galleryItems[lbIndex]?.querySelector('img');
    if (img && lbImg) {
      lbImg.src = img.src;
      lbImg.alt = img.alt;
    }
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => lbNavigate(-1));
  lbNext?.addEventListener('click', () => lbNavigate(1));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbNavigate(-1);
    if (e.key === 'ArrowRight') lbNavigate(1);
  });

  // -----------------------------------------------
  // VILLA PAGE SLIDER
  // -----------------------------------------------
  const villaSlides = document.querySelectorAll('.villa-slide');
  const vsCounter   = document.querySelector('.vs-counter');
  const vsPrev      = document.querySelector('.vs-btn.prev');
  const vsNext      = document.querySelector('.vs-btn.next');
  let vsIndex = 0;

  function goToVillaSlide(n) {
    villaSlides[vsIndex]?.classList.remove('active');
    vsIndex = (n + villaSlides.length) % villaSlides.length;
    villaSlides[vsIndex]?.classList.add('active');
    if (vsCounter) vsCounter.textContent = `${vsIndex + 1} / ${villaSlides.length}`;
  }

  if (villaSlides.length > 0) {
    villaSlides[0].classList.add('active');
    if (vsCounter) vsCounter.textContent = `1 / ${villaSlides.length}`;
    vsPrev?.addEventListener('click', () => goToVillaSlide(vsIndex - 1));
    vsNext?.addEventListener('click', () => goToVillaSlide(vsIndex + 1));
  }

  // -----------------------------------------------
  // CONTACT FORM (basic client-side)
  // -----------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const successMsg  = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      if (successMsg) successMsg.style.display = 'none';

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm),
        });
        const data = await res.json();
        if (data.success) {
          contactForm.reset();
          if (successMsg) successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          alert(data.message || 'There was an issue sending your message. Please call us on 0488 99 45 45.');
        }
      } catch {
        alert('Network error. Please call us on 0488 99 45 45.');
      } finally {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }
    });
  }

  // -----------------------------------------------
  // SCROLL ANIMATIONS (lightweight AOS replacement)
  // -----------------------------------------------
  const aosEls = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  aosEls.forEach(el => observer.observe(el));

  // -----------------------------------------------
  // ACTIVE NAV LINK
  // -----------------------------------------------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

});
