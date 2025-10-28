const observerOptions = {
  threshold: 0.35,
};

const revealElements = document.querySelectorAll('.timeline__step');
const counterElements = document.querySelectorAll('.result__value');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counterElements.forEach((el) => counterObserver.observe(el));

function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  let current = 0;
  const duration = 1800;
  const start = performance.now();

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    current = Math.floor(target * eased);
    element.textContent = `${current}%`;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${target}%`;
    }
  }

  requestAnimationFrame(update);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Subtle glow pulse on hero actions to suggest interaction
const heroButtons = document.querySelectorAll('.hero .btn--primary');
heroButtons.forEach((btn, index) => {
  btn.style.setProperty('--delay', `${index * 0.2}s`);
  btn.classList.add('btn--animate');
});
