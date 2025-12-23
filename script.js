async function loadData() {
  try {
    const res = await fetch('data.json', {
      cache: 'no-cache'
    });
    if (!res.ok) {
      throw new Error(`Failed to load data: ${res.status}`);
    }
    const data = await res.json();
    renderHero(data);
    renderAbout(data);
    renderSkills(data);
    renderExperience(data);
    renderProjects(data);
    renderPersonalProjects(data);
    renderEducation(data);
    renderContact(data);
    renderFooter(data);
    initNav();
    initTheme();
    initProjectFilter();
    initTerminal();
  } catch (err) {
    console.error('Failed to load portfolio data:', err);
    // Show user-friendly error message
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <section class="section text-center py-20">
          <h2 class="text-2xl font-semibold mb-4">Unable to load content</h2>
          <p class="text-slate-300 mb-4">Please refresh the page or check your connection.</p>
          <button onclick="location.reload()" class="px-4 py-2 rounded-lg bg-cyan-400 text-slate-900 hover:bg-cyan-300 transition">Retry</button>
        </section>
      `;
    }
  }
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

function renderPersonalProjects(data) {
  const grid = document.getElementById('personal-project-cards');
  const personalProjects = data.personal_projects || [];
  
  personalProjects.forEach((proj) => {
    const card = document.createElement('div');
    card.className = 'glass project-card rounded-xl p-4 border border-slate-800 space-y-3';
    card.dataset.status = proj.status || 'active';
    
    const header = document.createElement('div');
    header.className = 'space-y-2';
    
    const titleRow = document.createElement('div');
    titleRow.className = 'flex items-start justify-between gap-2';
    
    const titleSection = document.createElement('div');
    titleSection.innerHTML = `
      <div class="font-semibold text-slate-100">${proj.title}</div>
      <div class="text-sm text-slate-300 mt-1">${proj.description}</div>
    `;
    
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${proj.status || 'active'}`;
    statusBadge.innerHTML = `
      <span class="w-2 h-2 rounded-full ${proj.status === 'active' ? 'bg-cyan-400' : 'bg-slate-500'}"></span>
      ${proj.status === 'active' ? 'Active' : 'Archived'}
    `;
    
    titleRow.appendChild(titleSection);
    titleRow.appendChild(statusBadge);
    header.appendChild(titleRow);
    
    if (proj.stars || proj.forks) {
      const stats = document.createElement('div');
      stats.className = 'flex items-center gap-3 text-xs text-slate-400';
      if (proj.stars) {
        stats.innerHTML += `
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            ${proj.stars}
          </span>
        `;
      }
      if (proj.forks) {
        stats.innerHTML += `
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            ${proj.forks}
          </span>
        `;
      }
      header.appendChild(stats);
    }
    
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
    if (proj.github) {
      const ghLink = document.createElement('a');
      ghLink.href = proj.github;
      ghLink.target = '_blank';
      ghLink.rel = 'noreferrer';
      ghLink.className = 'flex items-center gap-1 text-cyan-300 hover:text-cyan-200';
      ghLink.innerHTML = `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>
        GitHub
      `;
      links.appendChild(ghLink);
    }
    if (proj.demo) {
      const demoLink = document.createElement('a');
      demoLink.href = proj.demo;
      demoLink.target = '_blank';
      demoLink.rel = 'noreferrer';
      demoLink.className = 'flex items-center gap-1 text-cyan-300 hover:text-cyan-200';
      demoLink.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        Live Demo
      `;
      links.appendChild(demoLink);
    }
    
    card.appendChild(header);
    card.appendChild(tech);
    if (links.childNodes.length) card.appendChild(links);
    grid.appendChild(card);
  });
}

function initProjectFilter() {
  const buttons = document.querySelectorAll('#project-filter .tab-button');
  const cards = document.querySelectorAll('#personal-project-cards .project-card');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.status === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
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
  // Only add LinkedIn and GitHub, email is already shown in the main section
  ['LinkedIn', 'GitHub'].forEach((label) => {
    const value = data.contact[label.toLowerCase()];
    if (!value) return;
    const pill = document.createElement('a');
    pill.href = value.startsWith('http') ? value : `mailto:${value}`;
    pill.target = '_blank';
    pill.rel = 'noreferrer';
    pill.className = 'icon-pill flex items-center gap-2 px-3 py-2 rounded-full border border-slate-800 bg-slate-900 text-sm';
    const handle = getHandle(value);
    pill.innerHTML = `${getIcon(label, 'w-5 h-5 text-cyan-300')}<span class="text-slate-100">${handle}</span>`;
    socialRow.appendChild(pill);
  });
  details.innerHTML = `
    <div class="space-y-4">
      <div>
        <div class="text-2xl font-bold text-slate-100 mb-2">Let's Connect</div>
        <div class="text-sm text-slate-400 leading-relaxed">Open to discussing backend engineering opportunities, technical collaborations, or platform architecture challenges.</div>
      </div>
      <div class="pt-2 border-t border-slate-800">
        <div class="text-xs uppercase tracking-wide text-slate-500 mb-3">Get in Touch</div>
        <div class="space-y-2">
          <a href="mailto:${data.contact.email}" class="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition group">
            ${getIcon('Email', 'w-5 h-5 text-cyan-400 group-hover:text-cyan-300')}
            <span class="text-sm">${data.contact.email}</span>
          </a>
        </div>
      </div>
    </div>
  `;
  if (socialRow.children.length > 0) {
    const socialSection = document.createElement('div');
    socialSection.className = 'pt-3 border-t border-slate-800';
    socialSection.innerHTML = '<div class="text-xs uppercase tracking-wide text-slate-500 mb-3">Connect</div>';
    socialSection.appendChild(socialRow);
    details.querySelector('.space-y-4').appendChild(socialSection);
  }
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
  form.action = `https://formsubmit.co/a5dab1c5e8fb3e4b8f3b9f312b8df2a1`;
  form.method = 'POST';
  
  // Set redirect URL to current page with success parameter
  const nextInput = form.querySelector('input[name="_next"]');
  if (nextInput) {
    nextInput.value = window.location.href + '?success=true';
  }

  // Handle form submission - show loading state
  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('form-message');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...</span>';
    messageDiv.className = 'form-message';
    messageDiv.style.display = 'none';
  });

  const interests = data.form?.interests || ["Hiring Opportunity", "Technical Discussion"];
  const helperMessages = data.form?.helper_messages || [
    "Interested in hiring you for a backend/platform role.",
    "Would like to discuss technical architecture and engineering best practices."
  ];
  const buttons = document.getElementById('interest-buttons');
  const textarea = form.querySelector('textarea[name="message"]');
  interests.forEach((label, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-cyan-400 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all active:scale-95';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      textarea.value = helperMessages[idx] || label;
      textarea.focus();
    });
    buttons.appendChild(btn);
  });
  
  // Check for success parameter on page load (set by FormSubmit.co redirect)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const messageDiv = document.getElementById('form-message');
    messageDiv.className = 'form-message success';
    messageDiv.textContent = 'Message sent successfully! I\'ll get back to you soon.';
    messageDiv.style.display = 'block';
    form.reset();
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
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
  const closeBtn = document.getElementById('mobile-nav-close');
  const mobileLinks = mobile.querySelectorAll('a');
  
  // Prevent body scroll when menu is open
  function preventBodyScroll(prevent) {
    if (prevent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // Open menu
  function openMenu() {
    mobile.classList.add('open');
    overlay.classList.add('visible');
    const icon = toggle.querySelector('.menu-icon');
    if (icon) icon.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    preventBodyScroll(true);
  }
  
  // Close menu
  function closeMenu() {
    mobile.classList.remove('open');
    overlay.classList.remove('visible');
    const icon = toggle.querySelector('.menu-icon');
    if (icon) icon.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    preventBodyScroll(false);
  }
  
  // Toggle menu
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobile.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }
  
  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeMenu();
      }
    });
  }
  
  // Close on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      // Small delay to allow smooth scroll
      setTimeout(() => {
        closeMenu();
      }, 100);
    });
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobile.classList.contains('open')) {
      closeMenu();
    }
  });

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  const scrollTopBtn = document.getElementById('scroll-top');
  const progressBar = document.getElementById('progress-bar');

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
  
  // Smooth scroll for anchor links with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#hero') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
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

// Terminal animation - organized career data
function initTerminal() {
  const terminal = document.getElementById('terminal-content');
  if (!terminal) return;
  
  const dataSets = [
    {
      title: 'Companies',
      command: 'cat companies.txt',
      output: [
        'Coda Payments (2022 - Present)',
        'HyperVerge Inc. (2022)',
        'Sequoia Capital (2021-2022)',
        'Economize.cloud (2021)'
      ]
    },
    {
      title: 'Tech Stack',
      command: 'ls tech-stack/',
      output: [
        'Backend: Node.js, TypeScript, Java',
        'Cloud: AWS (Lambda, SQS, ECS, DynamoDB)',
        'Infra: Terraform, CI/CD',
        'Frontend: Vue.js (Quasar)'
      ]
    },
    {
      title: 'Education',
      command: 'cat education.json',
      output: [
        'Jalpaiguri Government Engineering College',
        'B.Tech, Computer Science & Engineering',
        'CGPA: 8.5/10.0 (2018-2022)'
      ]
    },
    {
      title: 'Metrics',
      command: 'curl metrics/api',
      output: [
        'Avg RPS: 100 (300 during promotions)',
        'Daily Requests: 8.64M',
        'CSv2 Latency: 6ms avg, 15ms p99',
        'CSv1 Latency: 30ms avg, 80ms p99'
      ]
    }
  ];
  
  let currentSet = 0;
  let isTyping = false;
  
  function showDataSet() {
    if (isTyping) return;
    isTyping = true;
    
    // Clear terminal but keep header
    terminal.innerHTML = '';
    
    const data = dataSets[currentSet];
    
    // Show command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">$ </span><span class="terminal-command">${data.command}</span>`;
    terminal.appendChild(cmdLine);
    
    // Show output after delay
    setTimeout(() => {
      data.output.forEach((line, idx) => {
        setTimeout(() => {
          const outputLine = document.createElement('div');
          outputLine.className = 'terminal-line terminal-output';
          outputLine.textContent = line;
          terminal.appendChild(outputLine);
          terminal.scrollTop = terminal.scrollHeight;
          
          if (idx === data.output.length - 1) {
            setTimeout(() => {
              isTyping = false;
              currentSet = (currentSet + 1) % dataSets.length;
              setTimeout(showDataSet, 2000);
            }, 1000);
          }
        }, idx * 300);
      });
    }, 800);
  }
  
  setTimeout(showDataSet, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadData);
} else {
  loadData();
}

