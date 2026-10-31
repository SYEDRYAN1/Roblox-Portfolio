const themeToggle = document.querySelector('.theme-toggle');

const scriptingCarousel = document.querySelector('.scripting-carousel');

if (scriptingCarousel) {
  const slides = [
    { label: '1st One', file: '1stOne.mp4' },
    { label: '2nd One', file: '2ndOne.mp4' },
    { label: '3rd One', file: '3rdOne.mp4' },
    { label: '4th One', file: '4thOne.mp4' },
    { label: '5th One', file: '5thOne.mp4' },
  ];
  const cards = [...scriptingCarousel.querySelectorAll('.scripting-wheel-card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0;
  let isRotating = false;
  let isCarouselVisible = false;

  const setCardVideo = (card, slideIndex) => {
    const slide = slides[(slideIndex + slides.length) % slides.length];
    const video = card.querySelector('video');
    const label = card.querySelector('.scripting-video-number');
    label.textContent = slide.label;
    video.setAttribute('aria-label', `${slide.label} scripting showcase`);
    if (video.dataset.source !== slide.file) {
      video.pause();
      video.replaceChildren();
      const source = document.createElement('source');
      source.src = `ScriptingVideos/${slide.file}`;
      source.type = 'video/mp4';
      video.append(source);
      video.load();
      video.dataset.source = slide.file;
    }
  };

  const syncCardVideos = () => {
    cards.forEach((card) => {
      const position = Number(card.dataset.position);
      setCardVideo(card, currentSlide + position);
    });
  };

  const pauseSideVideos = () => {
    cards.forEach((card) => {
      if (card.dataset.position !== '0') {
        const video = card.querySelector('video');
        video.pause();
      }
    });
  };

  const releaseCardVideo = (card) => {
    const video = card.querySelector('video');
    video.pause();
    video.removeAttribute('src');
    video.replaceChildren();
    video.load();
    delete video.dataset.source;
  };

  const playActiveVideo = () => {
    if (!isCarouselVisible) return;
    const activeCard = cards.find((card) => card.dataset.position === '0');
    if (!activeCard) return;

    const activeVideo = activeCard.querySelector('video');
    activeVideo.muted = true;
    const playPromise = activeVideo.play();
    if (playPromise) {
      playPromise.catch(() => {});
    }
  };

  const rotateWheel = () => {
    if (isRotating) return;
    isRotating = true;
    currentSlide = (currentSlide + 1) % slides.length;
    const outgoingCard = cards.find((card) => card.dataset.position === '-2');
    pauseSideVideos();

    cards.forEach((card) => {
      const nextPosition = Number(card.dataset.position) - 1;
      card.dataset.position = String(nextPosition);
      if (nextPosition === -3) {
        releaseCardVideo(card);
      }
    });

    window.setTimeout(() => {
      outgoingCard.style.transition = 'none';
      outgoingCard.dataset.position = '2';
      syncCardVideos();
      pauseSideVideos();
      void outgoingCard.offsetWidth;
      outgoingCard.style.transition = '';
      playActiveVideo();
      isRotating = false;
    }, reduceMotion.matches ? 0 : 950);
  };

  cards.forEach((card) => {
    const video = card.querySelector('video');
    video.muted = true;
    const position = Number(card.dataset.position);
    setCardVideo(card, currentSlide + position);
    video.addEventListener('ended', () => {
      if (card.dataset.position === '0' && isCarouselVisible) {
        rotateWheel();
      }
    });
  });
  pauseSideVideos();

  const carouselObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    isCarouselVisible = entry.isIntersecting;

    if (isCarouselVisible) {
      playActiveVideo();
    } else {
      cards.forEach((card) => card.querySelector('video')?.pause());
    }
  }, { threshold: 0.45 });

  carouselObserver.observe(scriptingCarousel);

  window.setTimeout(() => {
    playActiveVideo();
  }, 250);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.dataset.tooltip = isLight ? 'Dark theme' : 'Light theme';
  });
}

const uiCarousel = document.querySelector('.ui-carousel');

if (uiCarousel) {
  const slides = [
    'Codes.png',
    'Egg Hatch.png',
    'Group 168.png',
    'Group 174.png',
    'Group 1001.png',
    'Group 1005.png',
    'Group 1006.png',
    'Group 1002.png',
    'Group 1008.png',
    'Group 1007.png',
    'Group 1017.png',
    'Group 111.png',
    'Group 1153.png',
    'Group 1018.png',
    'Group 116.png',
    'Group 160.png',
    'Group 132.png',
    'Group 177.png',
    'Group 209.png',
    'Group 205.png',
    'Menu.png',
    'Purchase.png',
    'Rank.png',
    'Select.png',
    'Settings-1.png',
    'Settings.png',
    'Stamina Bar.png',
    'Stats.png',
    'Upgrades.png',
    'Group 255.png',
    'Group 219.png',
    'Group 330.png',
    'Group 285.png',
    'Group 466.png',
    'Group 468.png',
    'Group 232.png',
    'Group 286.png',
    'Group 355.png',
    'Group 603.png',
    'Group 553.png',
    'Group 523.png',
    'Group 823.png',
    'Group 723.png',
    'Group 620.png',
    'Group 193.png',
    'Group 716.png',
    'Rectangle.png',
    'Group 297.png',
    'Group 568.png',
  ];
  const cards = [...uiCarousel.querySelectorAll('.ui-wheel-card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0;
  let slideOrder = [];

  const shuffleSlides = () => {
    slideOrder = slides.map((_, index) => index);
    for (let index = slideOrder.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [slideOrder[index], slideOrder[randomIndex]] = [slideOrder[randomIndex], slideOrder[index]];
    }
  };

  const setCardImage = (card, slideIndex) => {
    const normalizedIndex = ((slideIndex % slideOrder.length) + slideOrder.length) % slideOrder.length;
    const filename = slides[slideOrder[normalizedIndex]];
    card.src = `UserInterfacesImages/${encodeURIComponent(filename)}`;
  };

  const rotateWheel = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    if (currentSlide === 0) {
      shuffleSlides();
    }
    const outgoingCard = cards.find((card) => card.dataset.position === '-2');

    cards.forEach((card) => {
      card.dataset.position = String(Number(card.dataset.position) - 1);
    });

    window.setTimeout(() => {
      outgoingCard.style.transition = 'none';
      outgoingCard.dataset.position = '2';
      setCardImage(outgoingCard, currentSlide + 2);
      void outgoingCard.offsetWidth;
      outgoingCard.style.transition = '';
    }, reduceMotion.matches ? 0 : 750);
  };

  shuffleSlides();
  cards.forEach((card) => {
    setCardImage(card, currentSlide + Number(card.dataset.position));
  });

  let uiRotationTimer = null;
  const startUiRotation = () => {
    if (uiRotationTimer === null && !reduceMotion.matches) {
      uiRotationTimer = window.setInterval(rotateWheel, 5000);
    }
  };
  const stopUiRotation = () => {
    if (uiRotationTimer !== null) {
      window.clearInterval(uiRotationTimer);
      uiRotationTimer = null;
    }
  };

  const uiObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startUiRotation();
    } else {
      stopUiRotation();
    }
  }, { threshold: 0.25 });

  uiObserver.observe(uiCarousel);
}
