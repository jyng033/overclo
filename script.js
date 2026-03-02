// ============================================================
// OVERCLO STUDIO - script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== 히어로 슬라이더 =====
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-click--prev');
  const nextBtn = document.querySelector('.hero-click--next');
  let current = 0;
  let autoSlideTimer;
  const SLIDE_INTERVAL = 5000;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function nextSlide() { goToSlide(current + 1); }
  function prevSlide() { goToSlide(current - 1); }

  function startAuto() {
    autoSlideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  function resetAuto() {
    clearInterval(autoSlideTimer);
    startAuto();
  }

  // 화살표 클릭
  prevBtn.addEventListener('click', () => { prevSlide(); resetAuto(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });

  // 도트 클릭
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.dataset.slide);
      if (idx !== current) { goToSlide(idx); resetAuto(); }
    });
  });

  // 마우스 드래그
  const heroEl = document.querySelector('.hero');
  let isDragging = false, startX = 0, dragDist = 0;
  const DRAG_THRESHOLD = 50;

  heroEl.addEventListener('mousedown', e => {
    isDragging = true; startX = e.clientX; dragDist = 0;
    heroEl.style.cursor = 'grabbing';
  });
  heroEl.addEventListener('mousemove', e => {
    if (isDragging) dragDist = e.clientX - startX;
  });
  heroEl.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    heroEl.style.cursor = '';
    if (Math.abs(dragDist) > DRAG_THRESHOLD) {
      dragDist < 0 ? nextSlide() : prevSlide();
      resetAuto();
    }
  });
  heroEl.addEventListener('mouseleave', () => {
    isDragging = false; heroEl.style.cursor = '';
  });
  heroEl.addEventListener('dragstart', e => e.preventDefault());

  // 터치 스와이프
  let touchStartX = 0, touchDist = 0;
  heroEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX; touchDist = 0;
  }, { passive: true });
  heroEl.addEventListener('touchmove', e => {
    touchDist = e.touches[0].clientX - touchStartX;
  }, { passive: true });
  heroEl.addEventListener('touchend', () => {
    if (Math.abs(touchDist) > DRAG_THRESHOLD) {
      touchDist < 0 ? nextSlide() : prevSlide();
      resetAuto();
    }
  });

  startAuto();


  // ===== 포트폴리오 필터 =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 버튼 active 토글
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  // ===== 숫자 카운터 애니메이션 =====
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function animateCounters() {
    statNumbers.forEach(num => {
      const target = parseInt(num.dataset.target);
      const duration = 2000;
      const start = performance.now();

      const suffix = num.dataset.suffix || '';
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        num.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else num.textContent = target + suffix;
      }
      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);


  // ===== 스크롤 등장 애니메이션 =====
  const fadeElements = document.querySelectorAll(
    '.about-text, .about-image, .service-card, .portfolio-filter, .portfolio-item, .contact-info, .contact-form, .section-tag, .section-title, .section-desc'
  );

  fadeElements.forEach(el => el.classList.add('fade-up'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => fadeObserver.observe(el));


  // ===== 플로팅 스크롤 버튼 =====
  const floatingNav = document.querySelector('.floating-nav');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const scrollBottomBtn = document.getElementById('scrollBottomBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      floatingNav.classList.add('visible');
    } else {
      floatingNav.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  scrollBottomBtn.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });


  // ===== 헤더 스크롤 효과 =====
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.12)';
    } else {
      header.style.boxShadow = 'var(--header-shadow)';
    }
  });


  // ===== 모바일 메뉴 토글 =====
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');

  mobileBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // 메뉴 링크 클릭 시 닫기
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });


  // ===== 부드러운 스크롤 =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ===== 폼 제출 (Google Forms 연동) =====
  const form = document.getElementById('contactForm');
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdlijx7c9wRD24jbasObIvpCT5WfnaiuuTW7yE4XmVVniN6xA/formResponse';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '전송 중...';
    submitBtn.disabled = true;

    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    }).then(() => {
      alert('문의가 전송되었습니다. 빠른 시일 내에 답변드리겠습니다!');
      form.reset();
    }).catch(() => {
      alert('전송 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }).finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });

});
