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

const defaultTrainerAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjQwIiByPSIyOCIgZmlsbD0iIzRjNGM0YyIvPjxwYXRoIGQ9Ik0yNCAxMDZjMC0yNCAyMC00NCA0NC00NHM0NCAyMCA0NCA0NCIgZmlsbD0iIzRjNGM0YyIgb3BhY2l0eT0iLjgiLz48cGF0aCBkPSJNNDIgNThjMC0xMCA4LTE4IDE4LTE4czE4IDggMTggMTgiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4zIi8+PC9zdmc+';

// ---------- LOAD TRAINERS FROM BACKEND ----------
fetch('/api/trainers').then(r => r.json()).then(trainers => {
  const grid = document.getElementById('trainerGrid');
  grid.innerHTML = trainers.map(t => `
    <div class="trainer-card">
      <div class="trainer-avatar"><img src="/static/images/IMG.jpeg" alt="Trainer"></div>
      <h3>${t.name}</h3>
      <p class="role">${t.role}</p>
      <p class="contact">Contact: ${t.contact}</p>
      <p class="exp">Experience: ${t.exp}</p>
    </div>`).join('');
});

// ---------- FORM ELEMENT REFERENCES ----------
const modal = document.getElementById('joinModal');
const jName = document.getElementById('jName');


const contactMsg = document.getElementById('contactMsg');

// ---------- JOIN MODAL ----------
function openJoin(plan) {
  document.getElementById('selectedPlan').innerText = plan;
  modal.dataset.plan = plan;
  modal.classList.add('active');
}
document.getElementById('closeModal').onclick = () => modal.classList.remove('active');
modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };

document.getElementById('submitJoin').onclick = () => {
  joinMsg.innerText = '';
function mailsend() {
      let params = {
        name1:document.getElementById("jName").value,
        email1:document.getElementById("jEmail").value,
        phone:document.getElementById("jphone").value,
        plan: modal.dataset.plan || ''
      }
      emailjs.send("service_icbvknq","template_ohcn2mt",params).then(alert("email sent successfully"))
    
  };

  if (!data.name || !data.email) {
    joinMsg.innerText = 'Please enter your name and email to join.';
    return;
  }

  fetch('/api/join', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(async response => {
      const json = await response.json();
      joinMsg.innerText = json.message || 'Unexpected server response.';
      if (response.ok && json.success) {
        jName.value = jEmail.value = jPhone.value = '';
        setTimeout(() => modal.classList.remove('active'), 2500);
      }
    })
    .catch(() => {
      joinMsg.innerText = 'Server error. Please try again later.';
    });
};

// ---------- CONTACT FORM ----------
function sendmail() {
      let parms = {
        name:document.getElementById("cName").value,
        email:document.getElementById("cEmail").value,
        message:document.getElementById("cMessage").value,
      }
      emailjs.send("service_icbvknq","template_uirhcnp",parms).then(alert("email sent successfully"))
  


  if (!data.name || !data.email || !data.message) {
    contactMsg.innerText = 'Please fill all contact fields before sending.';
    return;
  }

  fetch('/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(async response => {
      const json = await response.json();
      contactMsg.innerText = json.message || 'Unexpected server response.';
      if (response.ok && json.success) {
        document.getElementById('cName').value = '';
        document.getElementById('cEmail').value = '';
        document.getElementById('cMessage').value = '';
      }
    })
    .catch(() => {
      contactMsg.innerText = 'Server error. Please try again later.';
    });
}
