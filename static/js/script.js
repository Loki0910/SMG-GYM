// ---------- PARTICLES ----------
const particles = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
  const s = document.createElement('span');
  const size = Math.random() * 8 + 3;
  s.style.width = s.style.height = size + 'px';
  s.style.left = Math.random() * 100 + 'vw';
  s.style.animationDuration = (Math.random() * 15 + 10) + 's';
  s.style.animationDelay = Math.random() * 5 + 's';
  particles.appendChild(s);
}

// ---------- NAVBAR SCROLL ----------
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- BURGER MENU ----------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('toggle');
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('toggle');
  })
);

// ---------- REVEAL ON SCROLL ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- ANIMATED COUNTERS ----------
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      let count = 0;
      const step = target / 100;
      const update = () => {
        count += step;
        if (count < target) { el.innerText = Math.ceil(count); requestAnimationFrame(update); }
        else el.innerText = target + '+';
      };
      update();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ---------- LOAD PLANS FROM BACKEND ----------
fetch('/api/plans').then(r => r.json()).then(plans => {
  const grid = document.getElementById('planGrid');
  grid.innerHTML = plans.map(p => `
    <div class="plan-card ${p.popular ? 'popular' : ''}">
      ${p.popular ? '<div class="badge">MOST POPULAR</div>' : ''}
      <h3>${p.name}</h3>
      <div class="price">₹${p.price}<span>/mo</span></div>
      <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <button class="btn-primary" style="animation:none;opacity:1;transform:none"
        onclick="openJoin('${p.name}')">Choose Plan</button>
    </div>`).join('');
});

// ---------- LOAD TRAINERS FROM BACKEND ----------
fetch('/api/trainers').then(r => r.json()).then(trainers => {
  const grid = document.getElementById('trainerGrid');
  grid.innerHTML = trainers.map(t => `
    <div class="trainer-card">
      <div class="trainer-avatar">${t.name.split(' ').map(n => n[0]).join('')}</div>
      <h3>${t.name}</h3>
      <p class="role">${t.role}</p>
      <p class="exp">Experience: ${t.exp}</p>
    </div>`).join('');
});

// ---------- JOIN MODAL ----------
const modal = document.getElementById('joinModal');
function openJoin(plan) {
  document.getElementById('selectedPlan').innerText = plan;
  modal.dataset.plan = plan;
  modal.classList.add('active');
}
document.getElementById('closeModal').onclick = () => modal.classList.remove('active');
modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };

document.getElementById('submitJoin').onclick = () => {
  const data = {
    name: jName.value, email: jEmail.value,
    phone: jPhone.value, plan: modal.dataset.plan
  };
  fetch('/api/join', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()).then(res => {
    document.getElementById('joinMsg').innerText = res.message;
    if (res.success) {
      jName.value = jEmail.value = jPhone.value = '';
      setTimeout(() => modal.classList.remove('active'), 2500);
    }
  });
};

// ---------- CONTACT FORM ----------
document.getElementById('sendContact').onclick = () => {
  const data = { name: cName.value, email: cEmail.value, message: cMessage.value };
  fetch('/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()).then(res => {
    document.getElementById('contactMsg').innerText = res.message;
    cName.value = cEmail.value = cMessage.value = '';
  });
};