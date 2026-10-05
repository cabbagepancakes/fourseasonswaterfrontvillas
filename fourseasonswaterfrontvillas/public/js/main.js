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
  // GOOGLE RATING — Places API (New)
  // Pulls the live rating + review count for the homepage
  // "Highly rated by guests" strip. Nothing is hard-coded.
  // -----------------------------------------------
  // TODO: insert a Google Maps Platform API key with "Places API (New)"
  // enabled. Restrict the key to this website's domain (HTTP referrer
  // restriction) and to the Places API (New) only.
  const GOOGLE_PLACES_API_KEY = '';

  const googleCard  = document.getElementById('rating-google');
  const googleScore = document.querySelector('[data-google-rating]');
  const googleCount = document.querySelector('[data-google-count]');

  if (googleCard && googleScore && googleCount) {
    const placeId = googleCard.dataset.placeId;

    const showUnavailable = () => {
      googleScore.innerHTML = '<span class="rating-unavailable">&ndash;</span>';
      googleCount.textContent = 'Rating currently unavailable';
    };

    if (!GOOGLE_PLACES_API_KEY || !placeId) {
      showUnavailable();
    } else {
      fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
        headers: {
          'X-Goog-Api-Key':   GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount',
        },
      })
        .then(res => res.ok ? res.json() : Promise.reject(new Error(`Places API ${res.status}`)))
        .then(place => {
          if (typeof place.rating !== 'number') return showUnavailable();
          googleScore.innerHTML =
            `<i class="fas fa-star rating-star" aria-hidden="true"></i>${place.rating.toFixed(1)}<span class="rating-outof">/5</span>`;
          const n = place.userRatingCount;
          googleCount.textContent = n
            ? `${n.toLocaleString('en-AU')} Google reviews`
            : 'Google reviews';
        })
        .catch(showUnavailable);
    }
  }

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
  // CONTACT FORM
  // Handled by the inline script in contact.html, which posts to
  // the forms.peabodydigital.com.au endpoint with Turnstile.
  // -----------------------------------------------

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
