const observerOptions = {
  threshold: 0.35,
};

const timelineNodes = document.querySelectorAll('.timeline-node');
const counterElements = document.querySelectorAll('.result__value');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, index * 150);
      timelineObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

timelineNodes.forEach((el) => timelineObserver.observe(el));

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

// Hero text entrance animation with GSAP
if (typeof gsap !== 'undefined') {
  const heroElements = document.querySelectorAll('.hero-animate');
  
  if (heroElements.length > 0) {
    gsap.to(heroElements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
      delay: 0.2
    });
  }
}

// Holographic Network Animation
(function initNetwork() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  let animationId;

  // Resize canvas
  function resizeCanvas() {
    // Get computed dimensions from CSS
    const computedStyle = window.getComputedStyle(canvas);
    const width = parseInt(computedStyle.width, 10);
    const height = parseInt(computedStyle.height, 10);
    
    // Set canvas internal resolution
    canvas.width = width;
    canvas.height = height;
  }

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.radius = Math.random() * 1.5 + 1;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.amplitude = Math.random() * 15 + 8;
      this.frequency = 1 / (Math.random() * 6 + 6); // 6-12 second cycles
      this.phase = Math.random() * Math.PI * 2;
      this.glowIntensity = Math.random() * 0.3 + 0.5;
      this.glowPhase = Math.random() * Math.PI * 2;
    }

    update(time) {
      // Sine wave drift
      this.baseX += this.vx;
      this.baseY += this.vy;
      
      if (this.baseX < 0 || this.baseX > canvas.width) this.vx *= -1;
      if (this.baseY < 0 || this.baseY > canvas.height) this.vy *= -1;

      this.x = this.baseX + Math.sin(time * this.frequency + this.phase) * this.amplitude;
      this.y = this.baseY + Math.cos(time * this.frequency + this.phase) * this.amplitude;

      // Varying glow intensity
      this.glowIntensity = 0.5 + Math.sin(time * 0.5 + this.glowPhase) * 0.2;
    }

    draw() {
      const glowOpacity = 0.5 * this.glowIntensity;
      
      // Ensure no shadow effects
      ctx.shadowBlur = 0;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
      gradient.addColorStop(0, `rgba(99, 102, 241, ${glowOpacity})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${glowOpacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core node
      ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  const particleCount = 20;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connecting lines
  function drawConnections() {
    ctx.globalCompositeOperation = 'screen';
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(140, 130, 255, 0.4)';
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          // Smooth fade based on distance, but ensure lines never disappear completely
          const normalizedDistance = distance / 150;
          const baseOpacity = 0.3; // Base opacity for nearby nodes
          const fadeOpacity = Math.pow(1 - normalizedDistance, 2) * 0.25;
          const opacity = Math.max(0.25, baseOpacity - fadeOpacity); // Never go below 0.25
          
          // Blend between violet tones based on distance
          const r = Math.floor(140 - normalizedDistance * 30); // 140 → 110
          const g = Math.floor(130 - normalizedDistance * 30); // 130 → 100
          const b = 255;
          
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    ctx.shadowBlur = 0;
  }

  // Animation loop
  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update particles first
    particles.forEach(particle => {
      particle.update(time);
    });

    // Draw connections first (will set composite mode to 'screen')
    drawConnections();
    
    // Then draw all particles with their glows
    ctx.globalCompositeOperation = 'screen';
    particles.forEach(particle => {
      particle.draw();
    });
    ctx.globalCompositeOperation = 'source-over';

    time += 0.005;
    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  // Wait for layout to settle before sizing
  setTimeout(() => {
    resizeCanvas();
    
    // Reset particles to fit new canvas size
    particles.forEach(particle => {
      particle.reset();
    });
    
    animate();
  }, 0);

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      particles.forEach(particle => {
        if (particle.x > canvas.width || particle.y > canvas.height) {
          particle.reset();
        }
      });
    }, 100);
  });
})();
