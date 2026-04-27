/* ══════════════════════════════════════════════
   SUDHANSHU ASSOCIATES — script.js
   Animations, 3D Canvas, Interactions
══════════════════════════════════════════════ */

// ─────────────────────────────────────────────
// 1. SPLASH SCREEN
// ─────────────────────────────────────────────
(function initSplash() {
  document.body.classList.add('splash-active');
  const splash = document.getElementById('splash');
  const canvas = document.getElementById('splash-canvas');
  const ctx = canvas.getContext('2d');

  function resizeSplash() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeSplash();
  window.addEventListener('resize', resizeSplash);

  // Particle field on splash
  const splashParticles = [];
  for (let i = 0; i < 80; i++) {
    splashParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + .5,
      dx: (Math.random() - .5) * .6,
      dy: (Math.random() - .5) * .6,
      alpha: Math.random() * .5 + .1
    });
  }

  function drawSplash() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    splashParticles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,146,42,${p.alpha})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    if (!splash.classList.contains('hidden')) requestAnimationFrame(drawSplash);
  }
  drawSplash();

  // Hide splash after 3.2s
  setTimeout(() => {
    splash.classList.add('hidden');
    document.body.classList.remove('splash-active');
    setTimeout(() => {
      splash.style.display = 'none';
      initHeroOrb();
      initAOS();
      initCounters();
    }, 800);
  }, 3200);
})();

// ─────────────────────────────────────────────
// 2. NAVBAR
// ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

window.closeMobileMenu = function() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
};

// Active nav link on scroll
function highlightNav() {
  const sections = ['home','about','product','why-us','stats','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

// ─────────────────────────────────────────────
// 3. HERO PARTICLES (canvas dots)
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// 4. THREE.JS ORB SPHERE
// ─────────────────────────────────────────────
function initHeroOrb() {
  const canvas = document.getElementById('orb-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4);

  // Main sphere
  const geo = new THREE.SphereGeometry(1.4, 64, 64);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x1A3A5C,
    emissive: 0x0D1B2A,
    shininess: 120,
    wireframe: false,
    transparent: true,
    opacity: .85
  });
  const sphere = new THREE.Mesh(geo, mat);
  scene.add(sphere);

  // Wireframe overlay
  const wGeo = new THREE.SphereGeometry(1.42, 18, 18);
  const wMat = new THREE.MeshBasicMaterial({
    color: 0xC8922A, wireframe: true, transparent: true, opacity: .15
  });
  const wire = new THREE.Mesh(wGeo, wMat);
  scene.add(wire);

  // Ring 1
  const rGeo1 = new THREE.TorusGeometry(1.8, 0.03, 8, 80);
  const rMat  = new THREE.MeshBasicMaterial({ color: 0xC8922A, transparent: true, opacity: .5 });
  const ring1 = new THREE.Mesh(rGeo1, rMat);
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  // Ring 2
  const rGeo2 = new THREE.TorusGeometry(2.1, 0.02, 8, 80);
  const rMat2 = new THREE.MeshBasicMaterial({ color: 0x5A8FA8, transparent: true, opacity: .3 });
  const ring2 = new THREE.Mesh(rGeo2, rMat2);
  ring2.rotation.x = Math.PI / 5;
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);

  // Orbiting small spheres
  const orbitSpheres = [];
  for (let i = 0; i < 6; i++) {
    const oGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const oMat = new THREE.MeshBasicMaterial({ color: 0xE8B84B });
    const oMesh = new THREE.Mesh(oGeo, oMat);
    const angle = (i / 6) * Math.PI * 2;
    oMesh.userData = { angle, speed: .012 + Math.random()*.008, radius: 1.8 + Math.random()*.3, yOff: (Math.random()-.5)*.8 };
    orbitSpheres.push(oMesh);
    scene.add(oMesh);
  }

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dirLight = new THREE.DirectionalLight(0xC8922A, 2);
  dirLight.position.set(3, 3, 3);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0x5A8FA8, 1.5, 10);
  pointLight.position.set(-3, -2, 2);
  scene.add(pointLight);

  // Mouse tracking
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - .5) * 2;
    my = (e.clientY / window.innerHeight - .5) * 2;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    sphere.rotation.y += 0.003;
    sphere.rotation.x += 0.001;
    wire.rotation.y   += 0.004;
    wire.rotation.x   += 0.002;
    ring1.rotation.z  += 0.005;
    ring2.rotation.x  += 0.003;
    ring2.rotation.y  += 0.004;

    // Follow mouse slightly
    sphere.rotation.y += mx * 0.003;
    sphere.rotation.x += my * 0.003;

    orbitSpheres.forEach(o => {
      o.userData.angle += o.userData.speed;
      const a = o.userData.angle;
      const r = o.userData.radius;
      o.position.x = Math.cos(a) * r;
      o.position.z = Math.sin(a) * r;
      o.position.y = o.userData.yOff + Math.sin(a * 2) * .3;
    });

    renderer.render(scene, camera);
  }
  animate();
}

// ─────────────────────────────────────────────
// 5. AOS INIT
// ─────────────────────────────────────────────
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }
}

// ─────────────────────────────────────────────
// 6. COUNTER ANIMATION
// ─────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      const start = target === 1974 ? 1960 : 0;
      const duration = 1800;
      const step = (ts) => {
        if (!el._start) el._start = ts;
        const prog = Math.min((ts - el._start) / duration, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: .3 });
  counters.forEach(c => observer.observe(c));
}

// ─────────────────────────────────────────────
// 7. 3D TILT on product cards
// ─────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.product-img-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 1.5) {
      card.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg) scale(1.03)`;
    }
  });
});
document.querySelectorAll('.product-img-card').forEach(card => {
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─────────────────────────────────────────────
// 8. CONTACT FORM SUBMIT
// ─────────────────────────────────────────────
window.submitForm = function() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('⚠️ Please fill in all required fields.', true);
    return;
  }
  if (!email.includes('@')) {
    showToast('⚠️ Please enter a valid email address.', true);
    return;
  }

  // Simulate submission
  const btn = document.querySelector('.btn-submit');
  btn.innerHTML = '<span>Sending…</span>';
  btn.style.opacity = '.7';
  btn.style.pointerEvents = 'none';

  setTimeout(() => {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('company').value = '';
    document.getElementById('message').value = '';
    btn.innerHTML = '<span>Send Enquiry</span><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
    btn.style.opacity = '';
    btn.style.pointerEvents = '';
    showToast('✅ Enquiry submitted! We\'ll get back to you shortly.');
  }, 1500);
};

function showToast(msg, isError) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = isError ? '#C0392B' : '';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─────────────────────────────────────────────
// 9. WHY-CARD pulsing ring on hover
// ─────────────────────────────────────────────
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const ring = card.querySelector('.why-icon-ring');
    if (ring) {
      ring.style.animationDuration = '3s';
    }
  });
  card.addEventListener('mouseleave', () => {
    const ring = card.querySelector('.why-icon-ring');
    if (ring) ring.style.animationDuration = '12s';
  });
});

// ─────────────────────────────────────────────
// 10. SMOOTH scroll for anchor links
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─────────────────────────────────────────────
// 11. HERO HEADING text animation (letter stagger)
// ─────────────────────────────────────────────
function wrapLetters() {
  document.querySelectorAll('.hero-line-1, .hero-line-2, .hero-line-3').forEach(el => {
    const text = el.textContent;
    el.innerHTML = text.split('').map((ch, i) =>
      `<span style="display:inline-block;animation-delay:${i * 0.04}s" class="letter-anim">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
  });
}
// We skip letter wrapping to keep it clean — text animations handled by CSS

// ─────────────────────────────────────────────
// 12. PARALLAX on hero orb
// ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const orb = document.querySelector('.hero-orb-wrap');
  if (orb) {
    orb.style.transform = `translateY(calc(-50% + ${window.scrollY * .15}px))`;
  }
});

// ─────────────────────────────────────────────
// 13. BACK TO TOP / Section fade trigger
// ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  // Navbar glow rings
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  document.querySelectorAll('.oval-ring').forEach((ring, i) => {
    ring.style.opacity = 0.4 + scrolled * 0.5;
  });
});

// ─────────────────────────────────────────────
// 14. Stats section — animate SVG rings
// ─────────────────────────────────────────────
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sc-fill').forEach(circle => {
        circle.style.transition = 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
      });
    }
  });
}, { threshold: .3 });
const statsSection = document.querySelector('.stats-section');
if (statsSection) statObserver.observe(statsSection);

// ─────────────────────────────────────────────
// 15. CURSOR glow trail
// ─────────────────────────────────────────────
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(200,146,42,.06),transparent 70%);
    pointer-events:none;z-index:0;transform:translate(-50%,-50%);
    transition:left .15s ease,top .15s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

// ─────────────────────────────────────────────
// 16. BRAND PILLS hover shimmer
// ─────────────────────────────────────────────
document.querySelectorAll('.brand-pill').forEach(pill => {
  pill.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.08)';
  });
  pill.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

console.log('%c🏭 Sudhanshu Associates', 'color:#C8922A;font-size:20px;font-weight:bold;');
console.log('%cIndustrial Excellence Since 1974 | Pune, India', 'color:#3A5F7D;font-size:12px;');



function initproducttackAnimation() {
  const items = document.querySelectorAll('.stack-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const currentItem = entry.target;
      const allItems = [...items];
      const currentIndex = allItems.indexOf(currentItem);

      setTimeout(() => {
        currentItem.classList.add('show');
      }, currentIndex * 180);

      observer.unobserve(currentItem);
    });
  }, {
    threshold: 0.22
  });

  items.forEach((item) => observer.observe(item));
}

initproducttackAnimation();