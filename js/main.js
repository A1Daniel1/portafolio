const GITHUB_USER = 'A1Daniel1';
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&type=owner`;

const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section, .hero, .skill-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

const langColors = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  'C': '#555555',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'SCSS': '#c6538c',
  'Shell': '#89e051',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'Jupyter Notebook': '#DA5B0B',
  'TeX': '#3D6117',
};

function getColor(lang) {
  return langColors[lang] || '#8892b0';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function createProjectCard(repo) {
  const card = document.createElement('div');
  card.className = 'project-card fade-in';
  card.dataset.lang = repo.language || 'Other';
  card.dataset.name = repo.name.toLowerCase();
  card.dataset.desc = (repo.description || '').toLowerCase();

  const stars = repo.stargazers_count > 0
    ? `<span class="project-stars">&#9733; ${repo.stargazers_count}</span>`
    : '';

  const lang = repo.language
    ? `<span class="project-lang" style="border-left: 3px solid ${getColor(repo.language)}">${repo.language}</span>`
    : '';

  const desc = repo.description
    ? `<p>${repo.description}</p>`
    : `<p style="opacity:0.5;font-style:italic">No description provided</p>`;

  card.innerHTML = `
    <div class="project-card-header">
      <span class="project-folder">&#128193;</span>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank" rel="noopener" title="View on GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        </a>
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" title="Live demo"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
      </div>
    </div>
    <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
    ${desc}
    <div class="project-meta">
      ${lang}
      ${stars}
      <span class="project-date">${formatDate(repo.updated_at)}</span>
    </div>
  `;

  return card;
}

async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  const loader = document.getElementById('projects-loader');

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const repos = await res.json();

    const filtered = repos.filter(r => !r.fork && r.name !== `${GITHUB_USER}.github.io`);

    loader.remove();

    const langs = new Set();
    filtered.forEach(r => { if (r.language) langs.add(r.language); });

    const filtersEl = document.getElementById('project-filters');
    [...langs].sort().forEach(lang => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.lang = lang;
      btn.textContent = lang;
      filtersEl.appendChild(btn);
    });

    filtered.forEach(repo => {
      grid.appendChild(createProjectCard(repo));
    });

    document.querySelectorAll('.project-card.fade-in').forEach(el => observer.observe(el));

    filtersEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('filter-btn')) return;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterProjects();
    });

    document.getElementById('project-search').addEventListener('input', filterProjects);

  } catch (err) {
    loader.innerHTML = `<p>Could not load projects. <a href="https://github.com/${GITHUB_USER}" target="_blank">Visit GitHub profile</a></p>`;
    console.error(err);
  }
}

function filterProjects() {
  const search = document.getElementById('project-search').value.toLowerCase();
  const activeLang = document.querySelector('.filter-btn.active')?.dataset.lang || 'all';

  document.querySelectorAll('.project-card').forEach(card => {
    const lang = card.dataset.lang;
    const text = card.dataset.name + ' ' + card.dataset.desc;
    const matchLang = activeLang === 'all' || lang === activeLang;
    const matchSearch = !search || text.includes(search);
    card.style.display = (matchLang && matchSearch) ? '' : 'none';
  });
}

loadProjects();
