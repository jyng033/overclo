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
  const HOMEPAGE_PAGE_SIZE = 2;

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
      src: 'image_overclo/portfolio/화장품_KR.png',
      category: '홈페이지 제작',
      title: '화장품 KR 페이지',
      description: '국문 제품 상세 안내'
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
      src: 'image_overclo/portfolio/템플릿판매.png',
      category: '홈페이지 제작',
      title: '템플릿 판매 페이지',
      description: '구매 동선 중심 랜딩'
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
      title: '프로모션 배너',
      description: '캠페인 배너 디자인'
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
      description: '프로모션 배너 디자인'
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
      title: '이벤트 배너',
      description: '프로모션 안내 배너'
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
      title: '브랜드 배너',
      description: '콘텐츠 중심 배너 디자인'
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
    return card;
  }

  if (homepageGrid && homepageMoreBtn) {
    const homepageCards = homepagePortfolioItems.map(item => createPortfolioCard(item, 'portfolio-homepage-item'));
    homepageCards.forEach(card => homepageGrid.appendChild(card));
    let activeHomepageCard = null;
    let hoverStartScrollY = 0;
    let hoverBaseOffset = 0;
    let hoverFrameRequested = false;
    const HOMEPAGE_HOVER_EDGE_PADDING = 200;

    function getHomepageOverlayMetrics(card) {
      const overlayContent = card.querySelector('.portfolio-overlay-content');
      const overlayLayer = card.querySelector('.portfolio-overlay');
      if (!overlayContent || !overlayLayer) {
        return null;
      }

      const contentTravel = Math.max(overlayLayer.clientHeight - overlayContent.clientHeight, 0);
      const availableTravel = Math.max(contentTravel - (HOMEPAGE_HOVER_EDGE_PADDING * 2), 0);
      const maxOffset = availableTravel / 2;
      const scrollRange = Math.max(card.clientHeight * 0.8, 1);
      return { overlayContent, availableTravel, maxOffset, scrollRange };
    }

    function getViewportCenteredOffset(card, maxOffset) {
      const rect = card.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);

      if (visibleBottom <= visibleTop) {
        return 0;
      }

      const visibleCenterY = (visibleTop + visibleBottom) / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const desiredOffset = visibleCenterY - cardCenterY;
      return Math.max(-maxOffset, Math.min(maxOffset, desiredOffset));
    }

    function updateHomepageHoverScrollEffect() {
      if (!activeHomepageCard) {
        return;
      }
      const metrics = getHomepageOverlayMetrics(activeHomepageCard);
      if (!metrics) {
        return;
      }

      const scrollDelta = window.scrollY - hoverStartScrollY;
      const rawOffset = (scrollDelta / metrics.scrollRange) * metrics.availableTravel;
      const offset = Math.max(
        -metrics.maxOffset,
        Math.min(metrics.maxOffset, hoverBaseOffset + rawOffset)
      );
      metrics.overlayContent.style.setProperty('--homepage-hover-scroll-y', `${offset}px`);
    }

    function requestHomepageHoverScrollUpdate() {
      if (hoverFrameRequested) {
        return;
      }
      hoverFrameRequested = true;
      requestAnimationFrame(() => {
        hoverFrameRequested = false;
        updateHomepageHoverScrollEffect();
      });
    }

    function resetHomepageHoverScrollEffect(card) {
      const overlayContent = card?.querySelector('.portfolio-overlay-content');
      if (overlayContent) {
        overlayContent.style.setProperty('--homepage-hover-scroll-y', '0px');
      }
    }

    homepageCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const metrics = getHomepageOverlayMetrics(card);
        activeHomepageCard = card;
        hoverStartScrollY = window.scrollY;
        hoverBaseOffset = metrics ? getViewportCenteredOffset(card, metrics.maxOffset) : 0;
        if (metrics) {
          metrics.overlayContent.style.setProperty('--homepage-hover-scroll-y', `${hoverBaseOffset}px`);
        } else {
          resetHomepageHoverScrollEffect(card);
        }
      });

      card.addEventListener('mouseleave', () => {
        resetHomepageHoverScrollEffect(card);
        if (activeHomepageCard === card) {
          activeHomepageCard = null;
          hoverBaseOffset = 0;
        }
      });
    });

    window.addEventListener('scroll', requestHomepageHoverScrollUpdate, { passive: true });
    window.addEventListener('blur', () => {
      if (activeHomepageCard) {
        resetHomepageHoverScrollEffect(activeHomepageCard);
      }
      activeHomepageCard = null;
      hoverBaseOffset = 0;
    });

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
