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


  // ===== 포트폴리오 (카테고리별 섹션) =====
  const homepageGrid = document.getElementById('portfolioHomepageGrid');
  const homepageMoreBtn = document.getElementById('homepageMoreBtn');
  const masonryGrid = document.getElementById('portfolioMasonryGrid');
  const HOMEPAGE_PAGE_SIZE = 3;

  // 작업물 추가/수정은 이 메타데이터 배열만 관리하면 됩니다.
  const homepagePortfolioItems = [
    {
      src: 'image_overclo/portfolio/러닝용품 랜딩페이지.png',
      category: '홈페이지 제작',
      title: '러닝용품 랜딩페이지',
      description: '전환 중심의 프로모션 랜딩'
    },
    {
      src: 'image_overclo/portfolio/산물.png',
      category: '홈페이지 제작',
      title: '산물 브랜드 사이트',
      description: '콘텐츠 중심 페이지 구성'
    },
    {
      src: 'image_overclo/portfolio/화장품_EN.png',
      category: '홈페이지 제작',
      title: '화장품 EN 페이지',
      description: '글로벌 타겟 제품 소개'
    },
    {
      src: 'image_overclo/portfolio/쿠키제과.jpg',
      category: '홈페이지 제작',
      title: '쿠키제과 웹페이지',
      description: '브랜드 스토리형 디자인'
    },
    {
      src: 'image_overclo/portfolio/필라jpg.jpg',
      category: '홈페이지 제작',
      title: '필라테스 사이트',
      description: '서비스 안내형 웹디자인'
    },
    {
      src: 'image_overclo/portfolio/데키랩.png',
      category: '홈페이지 제작',
      title: '데키랩 홈페이지',
      description: '브랜드 소개형 웹사이트'
    }
  ];

  const bannerAndDetailItems = [
    {
      src: 'image_overclo/portfolio/banner/KakaoTalk_20260215_173056706_02.jpg',
      category: '배너',
      title: '네이버 롤링 배너',
      description: '스마트스토어 배너 디자인'
    },
    {
      src: 'image_overclo/portfolio/detail_page/KakaoTalk_20260302_193036012_02.jpg',
      category: '상세페이지',
      title: '제품 상세페이지',
      description: '정방형 상세 콘텐츠 구성'
    },
    {
      src: 'image_overclo/portfolio/banner/03_블루베리_네이버-롤링배너_왼쪽당김.png',
      category: '배너',
      title: '네이버 롤링 배너',
      description: '스마트스토어 배너 디자인'
    },
    {
      src: 'image_overclo/portfolio/detail_page/KakaoTalk_20260302_193400933_01.jpg',
      category: '상세페이지',
      title: '브랜드 상세페이지',
      description: '제품 소개형 상세 구성'
    },
    {
      src: 'image_overclo/portfolio/banner/KakaoTalk_20260301_174546059.jpg',
      category: '배너',
      title: '네이버 롤링 배너',
      description: '스마트스토어 배너 디자인'
    },
    {
      src: 'image_overclo/portfolio/detail_page/상세포폴2.jpg',
      category: '상세페이지',
      title: '제품 상세페이지',
      description: '정방형 상세 콘텐츠 구성'
    },
    {
      src: 'image_overclo/portfolio/banner/KakaoTalk_20260215_173056706_01.jpg',
      category: '배너',
      title: '네이버 롤링 배너',
      description: '스마트스토어 배너 디자인'
    },
    {
      src: 'image_overclo/portfolio/detail_page/KakaoTalk_20260302_193036012_01.jpg',
      category: '상세페이지',
      title: '제품 상세페이지',
      description: '이미지 중심 상세 레이아웃'
    },
    {
      src: 'image_overclo/portfolio/detail_page/KakaoTalk_20260302_193400933.jpg',
      category: '상세페이지',
      title: '상세페이지 디자인',
      description: '정보 전달형 콘텐츠 구성'
    },
    {
      src: 'image_overclo/portfolio/detail_page/KakaoTalk_20260302_193036012_03.jpg',
      category: '상세페이지',
      title: '브랜드 상세페이지',
      description: '제품 기능 강조형 상세'
    },
    {
      src: 'image_overclo/portfolio/detail_page/KakaoTalk_20260302_193036012.jpg',
      category: '상세페이지',
      title: '제품 상세페이지',
      description: '구매 전환 중심 상세 구성'
    }
  ];

  const portfolioCards = [];

  function createPortfolioCard(item, cardClassName) {
    const card = document.createElement('div');
    card.className = `portfolio-item ${cardClassName}`;
    if (item.category === '배너') {
      card.classList.add('portfolio-banner-item');
    } else if (item.category === '상세페이지') {
      card.classList.add('portfolio-detail-item');
    }
    card.dataset.category = item.category;
    card.dataset.title = item.title;
    card.dataset.description = item.description;
    card.dataset.src = item.src;

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.title;

    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';
    overlay.innerHTML = `
      <div class="portfolio-overlay-content">
        <span class="portfolio-category">${item.category}</span>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      </div>
    `;

    card.append(img, overlay);
    portfolioCards.push(card);
    return card;
  }

  if (homepageGrid && homepageMoreBtn) {
    const homepageCards = homepagePortfolioItems.map(item => createPortfolioCard(item, 'portfolio-homepage-item'));
    homepageCards.forEach(card => homepageGrid.appendChild(card));

    let visibleCount = Math.min(HOMEPAGE_PAGE_SIZE, homepageCards.length);

    function updateHomepageVisibility() {
      homepageCards.forEach((card, idx) => {
        card.classList.toggle('is-hidden', idx >= visibleCount);
      });

      const hiddenCount = Math.max(homepageCards.length - visibleCount, 0);
      const remainingPages = Math.ceil(hiddenCount / HOMEPAGE_PAGE_SIZE);

      if (remainingPages > 0) {
        homepageMoreBtn.classList.remove('is-hidden');
        homepageMoreBtn.textContent = `더보기(${remainingPages})`;
      } else {
        homepageMoreBtn.classList.add('is-hidden');
      }
    }

    homepageMoreBtn.addEventListener('click', () => {
      visibleCount = Math.min(visibleCount + HOMEPAGE_PAGE_SIZE, homepageCards.length);
      updateHomepageVisibility();
    });

    updateHomepageVisibility();
  }

  if (masonryGrid) {
    const bannerLayer = document.createElement('div');
    bannerLayer.className = 'portfolio-banner-layer';

    const detailLayer = document.createElement('div');
    detailLayer.className = 'portfolio-detail-layer';

    bannerAndDetailItems.forEach(item => {
      const card = createPortfolioCard(item, 'portfolio-masonry-item');
      if (item.category === '배너') {
        bannerLayer.appendChild(card);
      } else {
        detailLayer.appendChild(card);
      }
    });

    masonryGrid.append(bannerLayer, detailLayer);
  }

  // ===== 포트폴리오 모달 슬라이더 =====
  const portfolioModal = document.getElementById('portfolioModal');
  const portfolioModalTrack = document.getElementById('portfolioModalTrack');
  const portfolioModalClose = document.getElementById('portfolioModalClose');
  const portfolioModalPrev = document.getElementById('portfolioModalPrev');
  const portfolioModalNext = document.getElementById('portfolioModalNext');
  const portfolioModalViewport = document.getElementById('portfolioModalViewport');

  if (portfolioModal && portfolioModalTrack && portfolioCards.length > 0) {
    let slides = [];
    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    function centerMobileBannerImage(slide) {
      if (!slide || window.innerWidth > 768) return;
      if (slide.dataset.category !== '배너') return;

      const media = slide.querySelector('.portfolio-modal-media--banner');
      if (!media) return;

      const applyCenter = () => {
        const maxScroll = media.scrollWidth - media.clientWidth;
        if (maxScroll > 0) {
          media.scrollLeft = maxScroll / 2;
        }
      };

      requestAnimationFrame(applyCenter);
      const img = media.querySelector('img');
      if (img && !img.complete) {
        img.addEventListener('load', applyCenter, { once: true });
      }
    }

    function sortCardsForModal(cards) {
      const homepageCardsOnly = cards.filter(card => (card.dataset.category || '') === '홈페이지 제작');
      const bannerDetailCards = cards.filter(card => (card.dataset.category || '') !== '홈페이지 제작');

      homepageCardsOnly.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (Math.abs(ra.top - rb.top) > 2) return ra.top - rb.top;
        return ra.left - rb.left;
      });

      // 열 우선 정렬: 1열 1행 -> 1열 2행 -> 2열 1행 ...
      bannerDetailCards.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (Math.abs(ra.left - rb.left) > 2) return ra.left - rb.left;
        return ra.top - rb.top;
      });

      return [...homepageCardsOnly, ...bannerDetailCards];
    }

    function rebuildModalSlides() {
      portfolioModalTrack.innerHTML = '';
      slides = [];
      const visibleCards = portfolioCards.filter(card => !card.classList.contains('is-hidden'));
      const orderedCards = sortCardsForModal(visibleCards);

      orderedCards.forEach((card, idx) => {
        card.dataset.modalIndex = String(idx);

        const slide = document.createElement('div');
        slide.className = 'portfolio-modal-slide';

        const category = card.dataset.category || '';
        slide.dataset.category = category;
        let mediaClass = 'portfolio-modal-media';
        if (category === '홈페이지 제작') {
          mediaClass += ' portfolio-modal-media--homepage';
        } else if (category === '배너') {
          mediaClass += ' portfolio-modal-media--banner';
        } else {
          mediaClass += ' portfolio-modal-media--detail';
        }

        const media = document.createElement('div');
        media.className = mediaClass;
        const img = document.createElement('img');
        img.src = card.dataset.src || '';
        img.alt = card.dataset.title || '포트폴리오 이미지';
        media.appendChild(img);
        slide.appendChild(media);
        portfolioModalTrack.appendChild(slide);
        slides.push(slide);
      });
    }

    function setSlide(index, animate = true) {
      if (slides.length === 0) return;
      currentSlide = (index + slides.length) % slides.length;
      if (!animate) portfolioModalTrack.style.transition = 'none';
      portfolioModalTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      if (!animate) {
        void portfolioModalTrack.offsetHeight;
        portfolioModalTrack.style.transition = '';
      }
      centerMobileBannerImage(slides[currentSlide]);
    }

    function openModal(index) {
      setSlide(index, false);
      portfolioModal.classList.add('is-open');
      portfolioModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      portfolioModal.classList.remove('is-open');
      portfolioModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function nextSlide() { setSlide(currentSlide + 1, true); }
    function prevSlide() { setSlide(currentSlide - 1, true); }

    document.addEventListener('click', (e) => {
      const targetCard = e.target.closest('.portfolio-item');
      if (!targetCard) return;
      rebuildModalSlides();
      const idx = Number(targetCard.dataset.modalIndex || -1);
      if (idx < 0) return;
      openModal(idx);
    });

    portfolioModalClose.addEventListener('click', closeModal);
    portfolioModalNext.addEventListener('click', nextSlide);
    portfolioModalPrev.addEventListener('click', prevSlide);

    portfolioModal.addEventListener('click', (e) => {
      const clickedMedia = e.target.closest('.portfolio-modal-media');
      const clickedControl = e.target.closest('.portfolio-modal-close, .portfolio-modal-nav');
      if (clickedMedia || clickedControl) return;

      const viewportMidX = window.innerWidth / 2;
      if (e.clientX < viewportMidX) prevSlide();
      else nextSlide();
    });

    window.addEventListener('keydown', (e) => {
      if (!portfolioModal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    portfolioModalViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    portfolioModalViewport.addEventListener('touchend', (e) => {
      if (slides[currentSlide]?.dataset?.category === '배너' && window.innerWidth <= 768) {
        return;
      }
      touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) < 50) return;
      if (deltaX < 0) nextSlide();
      else prevSlide();
    }, { passive: true });

    rebuildModalSlides();
  }


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
    '.about-text, .about-image, .service-card, .portfolio-subtitle, .portfolio-item, .portfolio-more-wrap, .contact-info, .contact-form, .section-tag, .section-title, .section-desc'
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
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfI6y8cdpUcw7W3K6XhtKFOUo0uCaaz7C9zPs-ioD6k5JJK_Q/formResponse';
  const GOOGLE_FORM_ENTRY = {
    name: 'entry.556338129',
    email: 'entry.104054847',
    message: 'entry.1214816561'
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawData = new FormData(form);
    const name = String(rawData.get('contact_name') || '').trim();
    const email = String(rawData.get('contact_email') || '').trim();
    const title = String(rawData.get('contact_title') || '').trim();
    const message = String(rawData.get('contact_message') || '').trim();

    // 새 Google Form에는 제목 필드가 없어 문의내용에 병합 전달합니다.
    const mergedMessage = title ? `[제목] ${title}\n\n${message}` : message;
    const submitData = new FormData();
    submitData.append(GOOGLE_FORM_ENTRY.name, name);
    submitData.append(GOOGLE_FORM_ENTRY.email, email);
    submitData.append(GOOGLE_FORM_ENTRY.message, mergedMessage);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '전송 중...';
    submitBtn.disabled = true;

    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: submitData,
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
