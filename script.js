async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();
  renderHero(data);
  renderAbout(data);
  renderSkills(data);
  renderExperience(data);
  renderProjects(data);
  renderEducation(data);
  renderContact(data);
  renderFooter(data);
  initNav();
  initTheme();
}

function renderHero(data) {
  document.getElementById('headline').textContent = data.headline;
  document.getElementById('subheadline').textContent = data.subheadline;
  document.getElementById('availability').textContent = data.availability;
  document.getElementById('summary').textContent = data.summary;
  if (data.cv_link) {
    const dl = document.getElementById('hero-download');
    dl.href = data.cv_link;
  }

  const quick = document.getElementById('quick-facts');
  data.quick_facts.forEach((fact) => {
    const chip = document.createElement('span');
    chip.className = 'px-3 py-2 rounded-full pill';
    chip.textContent = fact;
    quick.appendChild(chip);
  });

  // const signals = document.getElementById('signals');
  // const signalData = [
  //   { label: 'p95 latency', value: '< 200 ms', tone: 'good' },
  //   { label: 'ops toil', value: '↓ 30–50%', tone: 'neutral' },
  //   { label: 'throughput', value: '$5M+ TPV/mo', tone: 'good' },
  //   { label: 'incidents', value: 'RCAs & follow-through', tone: 'neutral' }
  // ];
  // signalData.forEach((s) => {
  //   const card = document.createElement('div');
  //   card.className = 'signal-card rounded-xl p-3 flex items-center justify-between text-sm';
  //   const left = document.createElement('div');
  //   left.className = 'text-slate-200';
  //   left.textContent = s.label;
  //   const right = document.createElement('div');
  //   right.className = s.tone === 'good' ? 'text-cyan-200 font-semibold' : 'text-slate-200 font-semibold';
  //   right.textContent = s.value;
  //   card.appendChild(left);
  //   card.appendChild(right);
  //   signals.appendChild(card);
  // });

  const contactCards = document.getElementById('contact-cards');
  contactCards.appendChild(makeContactCard('LinkedIn', data.contact.linkedin));
  contactCards.appendChild(makeContactCard('GitHub', data.contact.github));
}

function renderAbout(data) {
  document.getElementById('about-text').textContent = data.about;
}

function renderSkills(data) {
  const grid = document.getElementById('skills-grid');
  data.skills.forEach((group) => {
    const card = document.createElement('div');
    card.className = 'glass rounded-xl p-4 border border-slate-800';
    const title = document.createElement('div');
    title.className = 'font-semibold mb-2';
    title.textContent = group.name;
    card.appendChild(title);
    const list = document.createElement('div');
    list.className = 'flex flex-wrap gap-2 text-sm text-slate-300';
    group.items.forEach((item) => {
      const pill = document.createElement('span');
      pill.className = 'px-3 py-1 rounded-full bg-slate-900 border border-slate-800';
      pill.textContent = item;
      list.appendChild(pill);
    });
    card.appendChild(list);
    grid.appendChild(card);
  });
}

function renderExperience(data) {
  const container = document.getElementById('experience-list');
  data.experience.forEach((role) => {
    const card = document.createElement('div');
    card.className = 'glass rounded-xl p-4 border border-slate-800';
    const header = document.createElement('div');
    header.className = 'flex flex-wrap justify-between gap-2 items-start';
    header.innerHTML = `<div>
      <div class="text-lg font-semibold text-slate-100">${role.role}</div>
      <div class="text-slate-300">${role.company}</div>
    </div>
    <div class="text-sm text-slate-400 text-right">${role.period}<br>${role.location || ''}</div>`;
    const bullets = document.createElement('ul');
    bullets.className = 'mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside';
    role.bullets.forEach((b) => {
      const li = document.createElement('li');
      li.textContent = b;
      bullets.appendChild(li);
    });
    const tech = document.createElement('div');
    tech.className = 'mt-3 flex flex-wrap gap-2 text-xs text-slate-300';
    (role.tech || []).forEach((t) => {
      const pill = document.createElement('span');
      pill.className = 'px-2 py-1 rounded-full bg-slate-900 border border-slate-800';
      pill.textContent = t;
      tech.appendChild(pill);
    });
    card.appendChild(header);
    card.appendChild(bullets);
    card.appendChild(tech);
    container.appendChild(card);
  });
}

function renderProjects(data) {
  const grid = document.getElementById('project-cards');
  data.projects.forEach((proj) => {
    const card = document.createElement('div');
    card.className = 'glass project-card rounded-xl p-4 border border-slate-800 space-y-3';
    const header = document.createElement('div');
    header.className = 'flex items-start justify-between gap-2';
    header.innerHTML = `<div>
      <div class="font-semibold text-slate-100">${proj.title}</div>
      <div class="text-sm text-slate-300">${proj.summary}</div>
    </div>`;
    const impact = document.createElement('div');
    impact.className = 'text-sm text-cyan-200';
    impact.textContent = proj.impact;
    const tech = document.createElement('div');
    tech.className = 'flex flex-wrap gap-2 text-xs text-slate-300';
    (proj.tech || []).forEach((t) => {
      const pill = document.createElement('span');
      pill.className = 'px-2 py-1 rounded-full bg-slate-900 border border-slate-800';
      pill.textContent = t;
      tech.appendChild(pill);
    });
    const links = document.createElement('div');
    links.className = 'flex flex-wrap gap-3 text-sm';
    (proj.links || []).forEach((l) => {
      const a = document.createElement('a');
      a.href = l.url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.className = 'text-cyan-300 hover:text-cyan-200';
      a.textContent = l.label;
      links.appendChild(a);
    });
    card.appendChild(header);
    card.appendChild(impact);
    card.appendChild(tech);
    if (links.childNodes.length) card.appendChild(links);
    grid.appendChild(card);
  });
}

function renderAchievements(data) {
  const grid = document.getElementById('achievements-grid');
  data.achievements.forEach((ach) => {
    const card = document.createElement('div');
    card.className = 'glass rounded-xl p-4 border border-slate-800 text-sm text-slate-200';
    card.textContent = ach;
    grid.appendChild(card);
  });
}

function renderEducation(data) {
  const edu = data.education;
  const card = document.getElementById('education-card');
  card.innerHTML = `<div class="text-lg font-semibold text-slate-100">${edu.school}</div>
    <div class="text-slate-300">${edu.degree}</div>
    <div class="text-sm text-slate-400">${edu.period} · ${edu.location}</div>
    <div class="mt-2 text-sm text-slate-200">${edu.gpa}</div>`;
}

function renderContact(data) {
  const details = document.getElementById('contact-details');
  const socialRow = document.createElement('div');
  socialRow.className = 'flex flex-wrap gap-3';
  ['Email', 'LinkedIn', 'GitHub'].forEach((label) => {
    const value = data.contact[label.toLowerCase()];
    if (!value) return;
    const pill = document.createElement('a');
    pill.href = value.startsWith('http') ? value : `mailto:${value}`;
    pill.target = label === 'Email' ? '_self' : '_blank';
    pill.rel = label === 'Email' ? '' : 'noreferrer';
    pill.className = 'icon-pill flex items-center gap-2 px-3 py-2 rounded-full border border-slate-800 bg-slate-900 text-sm';
    const handle = label === 'LinkedIn' || label === 'GitHub' ? getHandle(value) : '';
    const text = label === 'Portfolio' ? '' : handle || value;
    pill.innerHTML = `${getIcon(label, 'w-5 h-5 text-cyan-300')}<span class="${text ? 'text-slate-100' : 'sr-only'}">${text || 'Portfolio'}</span>`;
    socialRow.appendChild(pill);
  });
  details.innerHTML = `
    <div class="text-lg font-semibold text-slate-100">Let’s build something reliable.</div>
    <div class="text-sm text-slate-300">Email or drop a note via the form.</div>
  `;
  details.appendChild(socialRow);
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 hover:border-cyan-300 text-sm text-slate-200';
  copyBtn.textContent = 'Copy email';
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(data.contact.email);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy email'), 1600);
    } catch (e) {
      window.location.href = `mailto:${data.contact.email}`;
    }
  });
  details.appendChild(copyBtn);
  const form = document.getElementById('contact-form');
  const endpoint = data.form?.endpoint || `mailto:${data.contact.email}`;
  form.action = endpoint;
  if (data.form?.method) form.method = data.form.method;

  const interests = data.form?.interests || ["Interested in hiring", "Some chit-chat"];
  const helperMessages = data.form?.helper_messages || [
    "Interested in hiring you for a backend/platform role.",
    "Would love to chat about reliability and serverless architectures."
  ];
  const buttons = document.getElementById('interest-buttons');
  const textarea = form.querySelector('textarea[name="message"]');
  interests.forEach((label, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-3 py-1 rounded-full border border-slate-700 bg-slate-900 hover:border-cyan-300 text-slate-200';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      textarea.value = helperMessages[idx] || label;
      textarea.focus();
    });
    buttons.appendChild(btn);
  });
}

function renderFooter(data) {
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  const links = document.getElementById('footer-links');
  data.footer_links.forEach((l) => {
    const a = document.createElement('a');
    a.href = l.url;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.className = 'hover:text-cyan-200 flex items-center gap-2';
    a.innerHTML = `${getIcon(l.label, 'w-4 h-4')}<span>${l.label}</span>`;
    links.appendChild(a);
  });
}

function makeContactCard(label, value) {
  const card = document.createElement('div');
  card.className = 'glass rounded-lg p-3 border border-slate-800 text-sm icon-pill flex items-center gap-3';
  const href = value.startsWith('http') ? value : 'mailto:' + value;
  const handle = label.toLowerCase() === 'linkedin' || label.toLowerCase() === 'github' ? getHandle(value) : value;
  const display = handle;
  const textClass = 'text-slate-100 font-medium break-all hover:text-cyan-200';
  card.innerHTML = `${getIcon(label, 'w-6 h-6 text-cyan-300')}<div><div class="text-slate-400">${label}</div><a class="${textClass}" target="_blank" rel="noreferrer" href="${href}">${display}</a></div>`;
  return card;
}

function getIcon(label, cls = 'w-5 h-5') {
  const base = cls + ' flex-shrink-0';
  switch (label.toLowerCase()) {
    case 'email':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>`;
    case 'linkedin':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.53h4.56V24H.22zM8.88 8.53h4.37v2.1h.06c.61-1.15 2.11-2.36 4.35-2.36 4.65 0 5.51 3.06 5.51 7.04V24h-4.56v-7.18c0-1.71-.03-3.91-2.38-3.91-2.39 0-2.75 1.86-2.75 3.78V24H8.88z"/></svg>`;
    case 'github':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2C6.475 2 2 6.59 2 12.253c0 4.527 2.865 8.368 6.839 9.727.5.095.682-.222.682-.493 0-.242-.009-.883-.014-1.733-2.782.615-3.369-1.37-3.369-1.37-.455-1.178-1.11-1.493-1.11-1.493-.908-.637.069-.624.069-.624 1.003.072 1.531 1.062 1.531 1.062.892 1.563 2.341 1.112 2.91.85.091-.662.35-1.112.636-1.368-2.22-.258-4.555-1.134-4.555-5.048 0-1.115.39-2.027 1.029-2.741-.103-.258-.446-1.296.098-2.701 0 0 .84-.272 2.75 1.046A9.36 9.36 0 0112 6.844c.85.004 1.705.116 2.504.34 1.909-1.318 2.748-1.046 2.748-1.046.545 1.405.202 2.443.1 2.701.64.714 1.028 1.626 1.028 2.741 0 3.926-2.339 4.787-4.566 5.04.359.319.679.947.679 1.91 0 1.378-.012 2.49-.012 2.829 0 .273.18.593.688.492A10.015 10.015 0 0022 12.253C22 6.59 17.523 2 12 2z" clip-rule="evenodd"/></svg>`;
    case 'portfolio':
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 7l2 12h14l2-12M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9" /></svg>`;
  }
}

function getHandle(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] ? '@' + parts[parts.length - 1] : url;
  } catch {
    return url;
  }
}

function initNav() {
  const toggle = document.getElementById('menu-toggle');
  const mobile = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-overlay');
  toggle.addEventListener('click', () => {
    mobile.classList.toggle('translate-x-full');
    overlay.classList.toggle('visible');
    const icon = toggle.querySelector('.menu-icon');
    icon.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', overlay.classList.contains('visible'));
  });

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  const scrollTopBtn = document.getElementById('scroll-top');
  const progressBar = document.getElementById('progress-bar');
  mobile.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      mobile.classList.add('translate-x-full');
      overlay.classList.remove('visible');
      const icon = toggle.querySelector('.menu-icon');
      icon.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', false);
    })
  );
  if (overlay) {
    overlay.addEventListener('click', () => {
      mobile.classList.add('translate-x-full');
      overlay.classList.remove('visible');
      const icon = toggle.querySelector('.menu-icon');
      icon.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', false);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === entry.target.id) {
              link.classList.add('nav-active');
            } else {
              link.classList.remove('nav-active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((sec) => observer.observe(sec));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const body = document.body;
  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    body.classList.add('theme-light');
    icon.textContent = '☀️';
  }
  btn.addEventListener('click', () => {
    const isLight = body.classList.toggle('theme-light');
    icon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

loadData().catch((err) => {
  console.error('Failed to load data.json', err);
});

