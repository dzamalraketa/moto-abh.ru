const onHorizontalSwipe = (element, onStep) => {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  element.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) {
      tracking = false;
      return;
    }
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  element.addEventListener('touchend', (event) => {
    if (!tracking || event.changedTouches.length !== 1) {
      return;
    }
    tracking = false;
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      onStep(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
};

const hero = document.querySelector('[data-hero]');

if (hero) {
  const frames = [...hero.querySelectorAll('.hero-scene')];
  const picker = hero.querySelector('.hero-picker');
  const caption = picker.querySelector('[data-hero-caption]');
  let activeIndex = 0;
  let requestedIndex = 0;

  const formatCaption = (index, frame) => `${index + 1} / ${frames.length} · ${frame.dataset.caption}`;

  const goToHeroSlide = async (step) => {
    requestedIndex = (requestedIndex + step + frames.length) % frames.length;
    const nextIndex = requestedIndex;
    const nextFrame = frames[nextIndex];

    if (nextFrame.dataset.src) {
      nextFrame.src = nextFrame.dataset.src;
      delete nextFrame.dataset.src;
    }

    try {
      await nextFrame.decode();
    } catch {
      if (requestedIndex === nextIndex) {
        requestedIndex = activeIndex;
      }
      return;
    }

    if (requestedIndex === nextIndex && activeIndex !== nextIndex) {
      frames[activeIndex].classList.remove('is-active');
      nextFrame.classList.add('is-active');
      caption.textContent = formatCaption(nextIndex, nextFrame);
      activeIndex = nextIndex;
    }
  };

  caption.textContent = formatCaption(activeIndex, frames[activeIndex]);
  picker.hidden = false;
  for (const button of picker.querySelectorAll('[data-hero-step]')) {
    button.addEventListener('click', () => goToHeroSlide(Number(button.dataset.heroStep)));
  }
  onHorizontalSwipe(hero, goToHeroSlide);
}

const gallery = document.querySelector('[data-gallery]');
const lightbox = document.querySelector('.lightbox');

if (gallery && lightbox?.showModal) {
  const photos = [...gallery.querySelectorAll('a')];
  const preview = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox-caption');
  const count = lightbox.querySelector('.lightbox-count');
  let activeIndex = 0;

  const show = (index) => {
    activeIndex = (index + photos.length) % photos.length;
    const link = photos[activeIndex];
    const alt = link.querySelector('img').alt;
    preview.src = link.href;
    preview.alt = alt;
    preview.hidden = false;
    caption.textContent = alt;
    count.textContent = `${activeIndex + 1} / ${photos.length}`;
  };

  photos.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      show(index);
      lightbox.showModal();
    });
  });

  for (const button of lightbox.querySelectorAll('[data-gallery-step]')) {
    button.addEventListener('click', () => show(activeIndex + Number(button.dataset.galleryStep)));
  }

  onHorizontalSwipe(lightbox, (step) => show(activeIndex + step));

  lightbox.addEventListener('keydown', (event) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (step) {
      event.preventDefault();
      show(activeIndex + step);
    }
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}
