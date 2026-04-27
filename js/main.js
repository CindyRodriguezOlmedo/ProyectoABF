const WHATSAPP_NUMBER = '595985756212';
document.documentElement.classList.add('js');

const tabs = document.querySelectorAll('.tab');
const profileInput = document.querySelector('#profile');
const leadForm = document.querySelector('#leadForm');
const menuToggle = document.querySelector('.menu-toggle');
const themeToggle = document.querySelector('#themeToggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const navSectionLinks = Array.from(navLinks).filter((link) => link.hash);
const teamStory = document.querySelector('.team-story');
const mobileStoryQuery = window.matchMedia('(max-width: 720px)');

function setActiveTab(selectedTab) {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-pressed', String(isSelected));
  });

  if (profileInput) {
    profileInput.value = selectedTab.dataset.profile;
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab));
});

function syncTeamStory() {
  if (!teamStory) return;

  if (mobileStoryQuery.matches) {
    if (!teamStory.dataset.userToggled) {
      teamStory.removeAttribute('open');
    }
  } else {
    teamStory.setAttribute('open', '');
    delete teamStory.dataset.userToggled;
  }
}

if (teamStory) {
  teamStory.addEventListener('toggle', () => {
    if (mobileStoryQuery.matches) {
      teamStory.dataset.userToggled = 'true';
    }
  });

  syncTeamStory();
  mobileStoryQuery.addEventListener('change', syncTeamStory);
}

if (leadForm) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const phone = document.querySelector('#phone').value.trim();
    const age = document.querySelector('#age').value.trim();
    const level = document.querySelector('#level').value;
    const mode = document.querySelector('#mode').value;
    const message = document.querySelector('#message').value.trim();
    const profile = profileInput.value;

    const text = `Hola ABF Chess, quiero recibir información.\n\nNombre: ${name}\nWhatsApp: ${phone}\nPerfil: ${profile}\nEdad: ${age}\nNivel: ${level}\nModalidad: ${mode}\nMensaje: ${message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
}

if (themeToggle) {
  let savedTheme = 'light';

  try {
    savedTheme = localStorage.getItem('theme') || 'light';
  } catch (error) {
    savedTheme = 'light';
  }

  document.body.dataset.theme = savedTheme;

  function updateThemeButton(theme) {
    themeToggle.innerHTML = '<span>♟</span>';
    themeToggle.style.background = theme === 'dark' ? '#111' : '#fff';
    themeToggle.style.color = theme === 'dark' ? '#fff' : '#111';
    themeToggle.setAttribute('aria-label', `Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`);
  }

  updateThemeButton(savedTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = nextTheme;

    try {
      localStorage.setItem('theme', nextTheme);
    } catch (error) {
      // El tema sigue funcionando aunque el navegador bloquee localStorage.
    }

    updateThemeButton(nextTheme);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
    }
  });
});

const sections = navSectionLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

function setCurrentNav(sectionId) {
  navSectionLinks.forEach((link) => {
    const isCurrent = link.hash === `#${sectionId}`;
    if (isCurrent) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      setCurrentNav(visibleEntry.target.id);
    }
  }, {
    rootMargin: '-35% 0px -50% 0px',
    threshold: [0.08, 0.18, 0.32, 0.5],
  });

  sections.forEach((section) => sectionObserver.observe(section));
}
