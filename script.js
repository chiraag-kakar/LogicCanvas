/**
 * Portfolio Data Loader & Renderer
 * Optimized, modular, and scalable architecture
 */

// Configuration
const DATA_PATH = 'data';
const CACHE_ENABLED = false;

// Data cache
let portfolioData = null;
let config = null;

/**
 * Load all portfolio data files in parallel
 */
async function loadPortfolioData() {
  if (portfolioData && !CACHE_ENABLED) {
    return portfolioData;
  }

  try {
    const [profile, contact, skills, experience, personalProjects, education, configData] = await Promise.all([
      fetch(`${DATA_PATH}/profile.json`).then(r => r.json()),
      fetch(`${DATA_PATH}/contact.json`).then(r => r.json()),
      fetch(`${DATA_PATH}/skills.json`).then(r => r.json()),
      fetch(`${DATA_PATH}/experience.json`).then(r => r.json()),
      fetch(`${DATA_PATH}/personal-projects.json`).then(r => r.json()),
      fetch(`${DATA_PATH}/education.json`).then(r => r.json()),
      fetch(`${DATA_PATH}/config.json`).then(r => r.json())
    ]);

    config = configData;
    portfolioData = {
      ...profile,
      contact,
      skills,
      experience,
      personal_projects: personalProjects,
      education,
      ...config
    };

    return portfolioData;
  } catch (error) {
    console.error('Failed to load portfolio data:', error);
    throw error;
  }
}

/**
 * Check if images are enabled
 */
function imagesEnabled() {
  return portfolioData?.features?.images_enabled === true;
}

/**
 * Safely get image URL or return null
 */
function getImageUrl(item) {
  if (!imagesEnabled() || !item?.image) return null;
  return item.image;
}

/**
 * Render navigation menu
 */
function renderNavigation(data) {
  const nav = data.navigation?.items || [];
  const desktopNav = document.getElementById('nav-links');
  const mobileNav = document.getElementById('mobile-nav-content');
  
  // Update header name
  const headerName = document.querySelector('header .font-semibold');
  if (headerName && data.name) {
    headerName.textContent = data.name;
  }
  
  [desktopNav, mobileNav].forEach(container => {
    if (!container) return;
    container.innerHTML = '';
    nav.forEach(item => {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      if (container === desktopNav) {
        link.className = 'hover:text-cyan-300';
      }
      container.appendChild(link);
    });
  });
  
  // Update button texts
  const buttons = data.buttons || {};
  const updates = {
    'hero-primary': buttons.hero_primary,
    'hero-secondary': buttons.hero_secondary,
    'hero-download': buttons.hero_download,
    'cta-primary': buttons.header_cta
  };
  
  Object.entries(updates).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  });
}

/**
 * Render section titles from config
 */
function renderSectionTitles(data) {
  const sections = data.sections || {};
  const mappings = {
    '#about h2': sections.about?.title,
    '#skills h2': sections.skills?.title,
    '#experience h2': sections.experience?.title,
    '#personal-projects h2': sections.personal_projects?.title,
    '#personal-projects p': sections.personal_projects?.subtitle,
    '#education h2': sections.education?.title,
    '#contact h2': sections.contact?.title
  };
  
  Object.entries(mappings).forEach(([selector, text]) => {
    const el = document.querySelector(selector);
    if (el && text) el.textContent = text;
  });
  
  // Project filters
  const filters = data.project_filters || {};
  const filterButtons = document.querySelectorAll('#project-filter .tab-button');
  const filterMap = ['all', 'active', 'archived'];
  filterButtons.forEach((btn, idx) => {
    const filter = filterMap[idx];
    if (filters[filter]) {
      btn.textContent = filters[filter];
      btn.dataset.filter = filter;
    }
  });
}

/**
 * Render hero section
 */
function renderHero(data) {
  const updates = {
    'headline': data.headline,
    'subheadline': data.subheadline,
    'availability': data.availability,
    'summary': data.summary
  };
  
  Object.entries(updates).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  });
  
  const cvLink = document.getElementById('hero-download');
  if (cvLink && data.cv_link) {
    cvLink.href = data.cv_link;
  }
  
  // Quick facts
  const quickFacts = document.getElementById('quick-facts');
  if (quickFacts && data.quick_facts) {
    quickFacts.innerHTML = '';
    data.quick_facts.forEach(fact => {
      const chip = document.createElement('span');
      chip.className = 'px-3 py-2 rounded-full pill';
      chip.textContent = fact;
      quickFacts.appendChild(chip);
    });
  }
  
  // Contact cards
  const contactCards = document.getElementById('contact-cards');
  if (contactCards && data.contact) {
    contactCards.innerHTML = '';
    if (data.contact.linkedin) {
      contactCards.appendChild(createContactCard('LinkedIn', data.contact.linkedin));
    }
    if (data.contact.github) {
      contactCards.appendChild(createContactCard('GitHub', data.contact.github));
    }
  }
}

/**
 * Render about section
 */
function renderAbout(data) {
  const aboutText = document.getElementById('about-text');
  if (aboutText && data.about) {
    aboutText.textContent = data.about;
  }
}

/**
 * Render skills section
 */
function renderSkills(data) {
  const grid = document.getElementById('skills-grid');
  if (!grid || !data.skills) return;
  
  grid.innerHTML = '';
  data.skills.forEach(group => {
    const card = document.createElement('div');
    card.className = 'glass rounded-xl p-4 border border-slate-800';
    
    const title = document.createElement('div');
    title.className = 'font-semibold mb-2';
    title.textContent = group.name;
    
    const list = document.createElement('div');
    list.className = 'flex flex-wrap gap-2 text-sm text-slate-300';
    group.items.forEach(item => {
      const pill = document.createElement('span');
      pill.className = 'px-3 py-1 rounded-full bg-slate-900 border border-slate-800';
      pill.textContent = item;
      list.appendChild(pill);
    });
    
    card.appendChild(title);
    card.appendChild(list);
    grid.appendChild(card);
  });
}

/**
 * Render experience section with optional images
 */
function renderExperience(data) {
  const container = document.getElementById('experience-list');
  if (!container || !data.experience) return;
  
  container.innerHTML = '';
  
  data.experience.forEach((role, index) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'experience-timeline';
    
    const marker = document.createElement('div');
    marker.className = 'experience-marker';
    timelineItem.appendChild(marker);
    
    const card = document.createElement('div');
    card.className = 'experience-card glass rounded-2xl border border-slate-800 overflow-hidden';
    
    // Hero image (optional)
    const imageUrl = getImageUrl(role);
    if (imageUrl) {
      const imageSection = document.createElement('div');
      imageSection.className = 'experience-hero-image';
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = `${role.company} workspace`;
      img.className = 'w-full h-64 object-cover';
      img.loading = 'lazy';
      imageSection.appendChild(img);
      card.appendChild(imageSection);
    }
    
    const contentSection = document.createElement('div');
    contentSection.className = 'p-6 md:p-8';
    
    // Header
    const header = document.createElement('div');
    header.className = 'experience-header';
    header.innerHTML = `
      <div class="experience-role">${role.role}</div>
      <div class="experience-company">${role.company}</div>
      <div class="experience-meta">
        <span>${role.period}</span>
        ${role.location ? `<span class="text-slate-500">•</span><span>${role.location}</span>` : ''}
      </div>
    `;
    
    // Summary
    if (role.summary) {
      const summary = document.createElement('div');
      summary.className = 'experience-summary';
      summary.textContent = role.summary;
      contentSection.appendChild(header);
      contentSection.appendChild(summary);
    } else {
      contentSection.appendChild(header);
    }
    
    // Categorized achievements
    if (role.achievements) {
      const achievementsContainer = document.createElement('div');
      achievementsContainer.className = 'experience-achievements-container';
      
      Object.entries(role.achievements).forEach(([category, items]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'achievement-category';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'achievement-category-title';
        categoryTitle.textContent = category;
        
        const achievements = document.createElement('div');
        achievements.className = 'experience-achievements';
        
        items.forEach(item => {
          const card = document.createElement('div');
          card.className = 'achievement-card';
          const desc = document.createElement('div');
          desc.className = 'achievement-description';
          desc.textContent = item;
          card.appendChild(desc);
          achievements.appendChild(card);
        });
        
        categorySection.appendChild(categoryTitle);
        categorySection.appendChild(achievements);
        achievementsContainer.appendChild(categorySection);
      });
      
      contentSection.appendChild(achievementsContainer);
    }
    
    // Projects within experience
    if (role.projects && role.projects.length > 0) {
      const projectsSection = document.createElement('div');
      projectsSection.className = 'experience-projects';
      
      const projectsTitle = document.createElement('div');
      projectsTitle.className = 'text-lg font-semibold text-slate-100 mb-4 mt-6';
      projectsTitle.textContent = 'Key Projects';
      projectsSection.appendChild(projectsTitle);
      
      const projectsGrid = document.createElement('div');
      projectsGrid.className = 'grid md:grid-cols-2 gap-4';
      
      role.projects.forEach(proj => {
        const projectCard = document.createElement('div');
        projectCard.className = 'glass rounded-xl border border-slate-800 overflow-hidden project-card';
        
        const projImageUrl = getImageUrl(proj);
        if (projImageUrl) {
          const img = document.createElement('img');
          img.src = projImageUrl;
          img.alt = proj.title;
          img.className = 'w-full h-48 object-cover';
          img.loading = 'lazy';
          projectCard.appendChild(img);
        }
        
        const projectContent = document.createElement('div');
        projectContent.className = 'p-4 space-y-3';
        projectContent.innerHTML = `
          <div class="font-semibold text-lg text-slate-100">${proj.title}</div>
          <div class="text-sm text-slate-300 leading-relaxed">${proj.summary}</div>
          <div class="text-sm text-cyan-200 font-medium">${proj.impact}</div>
        `;
        
        const tech = document.createElement('div');
        tech.className = 'flex flex-wrap gap-2 text-xs';
        (proj.tech || []).forEach(t => {
          const pill = document.createElement('span');
          pill.className = 'px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300';
          pill.textContent = t;
          tech.appendChild(pill);
        });
        projectContent.appendChild(tech);
        projectCard.appendChild(projectContent);
        projectsGrid.appendChild(projectCard);
      });
      
      projectsSection.appendChild(projectsGrid);
      contentSection.appendChild(projectsSection);
    }
    
    // Tech stack
    if (role.tech && role.tech.length > 0) {
      const techContainer = document.createElement('div');
      techContainer.className = 'experience-tech';
      role.tech.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techContainer.appendChild(tag);
      });
      contentSection.appendChild(techContainer);
    }
    
    card.appendChild(contentSection);
    timelineItem.appendChild(card);
    container.appendChild(timelineItem);
  });
}

/**
 * Render personal projects with optional images
 */
function renderPersonalProjects(data) {
  const grid = document.getElementById('personal-project-cards');
  if (!grid || !data.personal_projects) return;
  
  grid.innerHTML = '';
  
  data.personal_projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'glass project-card rounded-xl border border-slate-800 overflow-hidden';
    card.dataset.status = proj.status || 'active';
    
    // Project image (optional)
    const imageUrl = getImageUrl(proj);
    if (imageUrl) {
      const imgSection = document.createElement('div');
      imgSection.className = 'w-full h-48 overflow-hidden bg-gradient-to-br from-cyan-500/10 to-purple-500/10';
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = proj.title;
      img.className = 'w-full h-full object-cover';
      img.loading = 'lazy';
      imgSection.appendChild(img);
      card.appendChild(imgSection);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'p-5 space-y-4';
    
    const header = document.createElement('div');
    header.className = 'flex items-start justify-between gap-3';
    header.innerHTML = `
      <div class="flex-1">
        <div class="font-semibold text-lg text-slate-100 mb-1">${proj.title}</div>
        <div class="text-sm text-slate-300 leading-relaxed">${proj.description}</div>
      </div>
      <span class="status-badge status-${proj.status || 'active'}">
        <span class="w-2 h-2 rounded-full ${proj.status === 'active' ? 'bg-cyan-400' : 'bg-slate-500'}"></span>
        ${proj.status === 'active' ? 'Active' : 'Archived'}
      </span>
    `;
    
    contentDiv.appendChild(header);
    
    // Stats
    if (proj.stars || proj.forks) {
      const stats = document.createElement('div');
      stats.className = 'flex items-center gap-3 text-xs text-slate-400';
      if (proj.stars) {
        stats.innerHTML += `<span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          ${proj.stars}
        </span>`;
      }
      if (proj.forks) {
        stats.innerHTML += `<span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          ${proj.forks}
        </span>`;
      }
      contentDiv.appendChild(stats);
    }
    
    // Tech stack
    const tech = document.createElement('div');
    tech.className = 'flex flex-wrap gap-2 text-xs';
    (proj.tech || []).forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300';
      pill.textContent = t;
      tech.appendChild(pill);
    });
    contentDiv.appendChild(tech);
    
    // Links
    const links = document.createElement('div');
    links.className = 'flex flex-wrap gap-3 text-sm';
    if (proj.github) {
      links.appendChild(createLink(proj.github, 'GitHub', 'github'));
    }
    if (proj.demo) {
      links.appendChild(createLink(proj.demo, 'Live Demo', 'external'));
    }
    if (links.childNodes.length) contentDiv.appendChild(links);
    
    card.appendChild(contentDiv);
    grid.appendChild(card);
  });
}

/**
 * Render education section
 */
function renderEducation(data) {
  const card = document.getElementById('education-card');
  if (!card || !data.education) return;
  
  const edu = data.education;
  card.innerHTML = `
    <div class="text-lg font-semibold text-slate-100">${edu.school}</div>
    <div class="text-slate-300">${edu.degree}</div>
    <div class="text-sm text-slate-400">${edu.period} · ${edu.location}</div>
    <div class="mt-2 text-sm text-slate-200">${edu.gpa}</div>
  `;
}

/**
 * Render contact section
 */
function renderContact(data) {
  const details = document.getElementById('contact-details');
  const form = document.getElementById('contact-form');
  
  if (details && data.contact) {
    details.innerHTML = `
      <div class="space-y-4">
        <div>
          <div class="text-2xl font-bold text-slate-100 mb-2">Let's Connect</div>
          <div class="text-sm text-slate-400 leading-relaxed">Open to discussing backend engineering opportunities, technical collaborations, or platform architecture challenges.</div>
        </div>
        <div class="pt-2 border-t border-slate-800">
          <div class="text-xs uppercase tracking-wide text-slate-500 mb-3">Get in Touch</div>
          <a href="mailto:${data.contact.email}" class="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition group">
            ${getIcon('Email', 'w-5 h-5 text-cyan-400 group-hover:text-cyan-300')}
            <span class="text-sm">${data.contact.email}</span>
          </a>
        </div>
      </div>
    `;
    
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 hover:border-cyan-300 text-sm text-slate-200';
    copyBtn.textContent = 'Copy email';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(data.contact.email);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy email', 1600);
      } catch (e) {
        window.location.href = `mailto:${data.contact.email}`;
      }
    });
    details.appendChild(copyBtn);
  }
  
  if (form && data.contact?.form) {
    setupContactForm(form, data);
  }
}

/**
 * Setup contact form
 */
function setupContactForm(form, data) {
  form.action = `https://formsubmit.co/a5dab1c5e8fb3e4b8f3b9f312b8df2a1`;
  form.method = 'POST';
  
  const nextInput = form.querySelector('input[name="_next"]');
  if (nextInput) {
    nextInput.value = window.location.href + '?success=true';
  }
  
  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('form-message');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...</span>';
    }
    if (messageDiv) {
      messageDiv.className = 'form-message';
      messageDiv.style.display = 'none';
    }
  });
  
  const interests = data.contact.form?.interests || [];
  const helperMessages = data.contact.form?.helper_messages || [];
  const buttons = document.getElementById('interest-buttons');
  const textarea = form.querySelector('textarea[name="message"]');
  
  if (buttons && textarea) {
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
  }
  
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn && data.buttons?.contact_submit) {
    submitBtn.textContent = data.buttons.contact_submit;
  }
  
  const formTitle = form.querySelector('.text-lg.font-semibold');
  if (formTitle && data.buttons?.form_title) {
    formTitle.textContent = data.buttons.form_title;
  }
  
  const formHelper = form.querySelector('.text-xs.text-slate-400');
  if (formHelper && data.buttons?.form_helper) {
    formHelper.textContent = data.buttons.form_helper;
  }
  
  // Check for success parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
      messageDiv.className = 'form-message success';
      messageDiv.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      messageDiv.style.display = 'block';
      form.reset();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}

/**
 * Render footer
 */
function renderFooter(data) {
  const year = document.getElementById('footer-year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
  
  const links = document.getElementById('footer-links');
  if (links && data.contact?.footer_links) {
    links.innerHTML = '';
    data.contact.footer_links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.className = 'hover:text-cyan-200 flex items-center gap-2';
      a.innerHTML = `${getIcon(link.label, 'w-4 h-4')}<span>${link.label}</span>`;
      links.appendChild(a);
    });
  }
}

/**
 * Helper: Create contact card
 */
function createContactCard(label, value) {
  const card = document.createElement('div');
  card.className = 'glass rounded-lg p-3 border border-slate-800 text-sm icon-pill flex items-center gap-3';
  const href = value.startsWith('http') ? value : 'mailto:' + value;
  const handle = label.toLowerCase() === 'linkedin' || label.toLowerCase() === 'github' ? getHandle(value) : value;
  card.innerHTML = `${getIcon(label, 'w-6 h-6 text-cyan-300')}<div><div class="text-slate-400">${label}</div><a class="text-slate-100 font-medium break-all hover:text-cyan-200" target="_blank" rel="noreferrer" href="${href}">${handle}</a></div>`;
  return card;
}

/**
 * Helper: Create link
 */
function createLink(url, label, type) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noreferrer';
  a.className = 'flex items-center gap-1 text-cyan-300 hover:text-cyan-200';
  a.innerHTML = type === 'github' 
    ? `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>${label}`
    : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>${label}`;
  return a;
}

/**
 * Helper: Get icon SVG
 */
function getIcon(label, cls = 'w-5 h-5') {
  const base = cls + ' flex-shrink-0';
  const icons = {
    'email': `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>`,
    'linkedin': `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.53h4.56V24H.22zM8.88 8.53h4.37v2.1h.06c.61-1.15 2.11-2.36 4.35-2.36 4.65 0 5.51 3.06 5.51 7.04V24h-4.56v-7.18c0-1.71-.03-3.91-2.38-3.91-2.39 0-2.75 1.86-2.75 3.78V24H8.88z"/></svg>`,
    'github': `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2C6.475 2 2 6.59 2 12.253c0 4.527 2.865 8.368 6.839 9.727.5.095.682-.222.682-.493 0-.242-.009-.883-.014-1.733-2.782.615-3.369-1.37-3.369-1.37-.455-1.178-1.11-1.493-1.11-1.493-.908-.637.069-.624.069-.624 1.003.072 1.531 1.062 1.531 1.062.892 1.563 2.341 1.112 2.91.85.091-.662.35-1.112.636-1.368-2.22-.258-4.555-1.134-4.555-5.048 0-1.115.39-2.027 1.029-2.741-.103-.258-.446-1.296.098-2.701 0 0 .84-.272 2.75 1.046A9.36 9.36 0 0112 6.844c.85.004 1.705.116 2.504.34 1.909-1.318 2.748-1.046 2.748-1.046.545 1.405.202 2.443.1 2.701.64.714 1.028 1.626 1.028 2.741 0 3.926-2.339 4.787-4.566 5.04.359.319.679.947.679 1.91 0 1.378-.012 2.49-.012 2.829 0 .273.18.593.688.492A10.015 10.015 0 0022 12.253C22 6.59 17.523 2 12 2z" clip-rule="evenodd"/></svg>`,
    'portfolio': `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M3 7l2 12h14l2-12M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`
  };
  return icons[label.toLowerCase()] || `<svg xmlns="http://www.w3.org/2000/svg" class="${base}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9" /></svg>`;
}

/**
 * Helper: Get handle from URL
 */
function getHandle(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] ? '@' + parts[parts.length - 1] : url;
  } catch {
    return url;
  }
}

/**
 * Get project icon SVG
 */
function getProjectIcon(iconName) {
  const icons = {
    integration: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/></svg>`,
    automation: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/></svg>`,
    infrastructure: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15m-15 0v18m15-18v18M4.5 9h15M4.5 15h15"/></svg>`,
    mobile: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>`,
    scheduler: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    blog: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>`,
    api: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
    logs: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>`,
    webhook: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25A2.25 2.25 0 0015.75 10.5z"/></svg>`
  };
  return icons[iconName] || icons.api;
}

/**
 * Initialize navigation
 */
function initNav() {
  const toggle = document.getElementById('menu-toggle');
  const mobile = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');
  const mobileLinks = mobile?.querySelectorAll('a') || [];
  
  function preventBodyScroll(prevent) {
    document.body.style.overflow = prevent ? 'hidden' : '';
  }
  
  function openMenu() {
    mobile?.classList.add('open');
    overlay?.classList.add('visible');
    toggle?.querySelector('.menu-icon')?.classList.add('menu-open');
    toggle?.setAttribute('aria-expanded', 'true');
    preventBodyScroll(true);
  }
  
  function closeMenu() {
    mobile?.classList.remove('open');
    overlay?.classList.remove('visible');
    toggle?.querySelector('.menu-icon')?.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    preventBodyScroll(false);
  }
  
  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    mobile?.classList.contains('open') ? closeMenu() : openMenu();
  });
  
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });
  
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => setTimeout(closeMenu, 100));
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobile?.classList.contains('open')) {
      closeMenu();
    }
  });
  
  // Active nav highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  const scrollTopBtn = document.getElementById('scroll-top');
  const progressBar = document.getElementById('progress-bar');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
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
  
  sections.forEach(sec => observer.observe(sec));
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
    
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }
  });
  
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Smooth scroll for anchor links
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

/**
 * Initialize theme toggle
 */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const body = document.body;
  const stored = localStorage.getItem('theme');
  
  if (stored === 'light') {
    body.classList.add('theme-light');
    if (icon) icon.textContent = '☀️';
  }
  
  btn?.addEventListener('click', () => {
    const isLight = body.classList.toggle('theme-light');
    if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/**
 * Initialize project filter
 */
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

/**
 * Initialize terminal animation
 */
function initTerminal() {
  if (!config?.features?.terminal_enabled) return;
  
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
    }
  ];
  
  let currentSet = 0;
  let isTyping = false;
  
  function showDataSet() {
    if (isTyping) return;
    isTyping = true;
    
    terminal.innerHTML = '';
    const data = dataSets[currentSet];
    
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">$ </span><span class="terminal-command">${data.command}</span>`;
    terminal.appendChild(cmdLine);
    
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

/**
 * Main initialization
 */
async function init() {
  try {
    const data = await loadPortfolioData();
    
    // Render all sections
    renderNavigation(data);
    renderSectionTitles(data);
    renderHero(data);
    renderAbout(data);
    renderSkills(data);
    renderExperience(data);
    renderPersonalProjects(data);
    renderEducation(data);
    renderContact(data);
    renderFooter(data);
    
    // Initialize interactions
    initNav();
    initTheme();
    initProjectFilter();
    initTerminal();
  } catch (err) {
    console.error('Failed to initialize portfolio:', err);
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
