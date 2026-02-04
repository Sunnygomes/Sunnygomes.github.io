// script.js

document.addEventListener('DOMContentLoaded', () => {
  // ————————————————————————————
  // 0. PARTICLES BACKGROUND
  // ————————————————————————————
  function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles';
    particlesContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    `;
    document.body.insertBefore(particlesContainer, document.body.firstChild);

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: radial-gradient(circle, rgba(0, 245, 255, 0.8), rgba(255, 110, 199, 0.4));
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
        box-shadow: 0 0 ${Math.random() * 10 + 5}px rgba(0, 245, 255, 0.5);
      `;
      particlesContainer.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2); }
      }
    `;
    document.head.appendChild(style);
  }
  createParticles();

  // ————————————————————————————
  // 0.5. CUSTOM CURSOR
  // ————————————————————————————
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  document.body.appendChild(cursor);

  const cursorDot = document.createElement('div');
  cursorDot.id = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects
  document.querySelectorAll('a, button, .btn, .project-card, .detail-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.borderColor = '#ff6ec7';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = '#00f5ff';
    });
  });

  // ————————————————————————————
  // 1. THEME TOGGLE
  // ————————————————————————————
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  

  const applyTheme = (dark) => {
    document.body.classList.toggle('dark-mode', dark);
    themeToggle.textContent = dark ? '🌙' : '☀️';
  };

  // On load
  if (savedTheme) {
    applyTheme(savedTheme === 'dark');
  } else {
    applyTheme(prefersDark.matches);
  }

  // On click
  themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // ————————————————————————————
  // 2. GSAP SCROLLTRIGGER FOR HORIZONTAL SCROLL
  // ————————————————————————————
  // Disabled in favor of native CSS scroll-snap for better performance
  // Using CSS scroll-snap-type: x mandatory instead
  
  const sections = gsap.utils.toArray('.section');

  // Native scroll handling
  const wrapper = document.querySelector('.horizontal-scroll-wrapper');
  let isScrolling = false;
  
  wrapper.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    e.preventDefault();
    isScrolling = true;
    
    const delta = e.deltaY || e.deltaX;
    wrapper.scrollLeft += delta;
    
    setTimeout(() => {
      isScrolling = false;
    }, 50);
  }, { passive: false });

  // Highlight active section on scroll
  wrapper.addEventListener('scroll', () => {
    const scrollLeft = wrapper.scrollLeft;
    const sectionWidth = window.innerWidth;
    const currentIndex = Math.round(scrollLeft / sectionWidth);
    
    sections.forEach((sec, idx) => {
      if (idx === currentIndex) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });
  });

  // Contact button scroll to last section
  const contactBtn = document.getElementById('contact-me-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const wrapper = document.querySelector('.horizontal-scroll-wrapper');
      wrapper.scrollTo({
        left: wrapper.scrollWidth - wrapper.clientWidth,
        behavior: 'smooth'
      });
    });
  }

  // fade in hero text
  gsap.from('.hero-title', {
    y: 50, opacity: 0, duration: 1, delay: 0.5
  });
  gsap.from('.hero-subtitle', {
    y: 30, opacity: 0, duration: 1, delay: 0.8
  });

  // ————————————————————————————
  // 3. THREE.JS DNA HELIX
  // ————————————————————————————
  const container = document.getElementById('threejs-container');
  const scene     = new THREE.Scene();
  const camera    = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  const renderer  = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  // HiDPI support
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  container.appendChild(renderer.domElement);

  // Build helix
  function createHelix() {
    const group = new THREE.Group();
    const geo   = new THREE.SphereGeometry(0.05, 16, 16);
    const mat   = new THREE.MeshBasicMaterial({ color: 0x4fc0d6, transparent: true, opacity: 0.8 });
    const count = 40;
    for (let i = 0; i < count; i++) {
      const angle = i * 0.2;
      const x = Math.sin(angle) * 0.8;
      const y = i * 0.05 - 1;
      const z = Math.cos(angle) * 0.8;
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(x, y, z);
      group.add(sphere);
      if (i > 0) {
        const prevAngle = (i - 1) * 0.2;
        const points = [
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(Math.sin(prevAngle) * 0.8, (i - 1) * 0.05 - 1, Math.cos(prevAngle) * 0.8)
        ];
        const lineMat = new THREE.LineBasicMaterial({ color: 0x4fc0d6, transparent: true, opacity: 0.5 });
        const line    = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat);
        group.add(line);
      }
    }
    return group;
  }

  const dna = createHelix();
  scene.add(dna);
  camera.position.z = 3;

  // Resize and render
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);
  onResize();

  function animate() {
    requestAnimationFrame(animate);
    dna.rotation.y += 0.003;
    renderer.render(scene, camera);
  }
  animate();
});
