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
  gsap.registerPlugin(ScrollTrigger);

  const sections = gsap.utils.toArray('.section');

  // animate horizontal scroll
// After gsap.registerPlugin(ScrollTrigger);
// And after you have const sections = gsap.utils.toArray('.section');

ScrollTrigger.matchMedia({

  // Desktop & tablet (≥769px): horizontal scroll enabled
  "(min-width: 769px)": function() {
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-scroll-wrapper",
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => "+=" + document.querySelector(".horizontal-scroll-wrapper").offsetWidth,
      },
    });

    // highlight active section
    sections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top center",
        end: "bottom center",
        onEnter: () => sec.classList.add("active"),
        onEnterBack: () => sec.classList.add("active"),
        onLeave: () => sec.classList.remove("active"),
        onLeaveBack: () => sec.classList.remove("active"),
      });
    });
  },

  // Mobile (≤768px): disable horizontal pin, allow normal vertical scroll
  "(max-width: 768px)": function() {
    // Remove all ScrollTriggers (including pin)
    ScrollTrigger.getAll().forEach(st => st.kill());

    // Reset any inline styles set by GSAP
    const wrapper = document.querySelector(".horizontal-scroll-wrapper");
    if(wrapper){
      wrapper.style.removeProperty("overflow-x");
      wrapper.style.removeProperty("scroll-snap-type");
      gsap.set(wrapper, { x: 0 });
    }
  }

});


  const contactBtn = document.getElementById('contact-me-btn');

if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    // Get the horizontal scroll ScrollTrigger instance
    const scrollTriggerInstance = ScrollTrigger.getAll().find(st => 
      st.trigger.classList.contains('horizontal-scroll-wrapper')
    );

    if (scrollTriggerInstance) {
      // ScrollTrigger scroll range goes from 0 to scrollTriggerInstance.end
      // So scroll to the very end (last page)
      scrollTriggerInstance.scroll(scrollTriggerInstance.end);
    }
  });
}

  // highlight active section
  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top center',
      end: 'bottom center',
      onEnter:    () => sec.classList.add('active'),
      onEnterBack:() => sec.classList.add('active'),
      onLeave:    () => sec.classList.remove('active'),
      onLeaveBack:() => sec.classList.remove('active'),
    });
  });

  // fade in hero text
  gsap.from('.hero-title', {
    y: 50, opacity: 0, duration: 1, delay: 0.5,
    scrollTrigger: { trigger: '.hero', start: 'top center' }
  });
  gsap.from('.hero-subtitle', {
    y: 30, opacity: 0, duration: 1, delay: 0.8,
    scrollTrigger: { trigger: '.hero', start: 'top center' }
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
