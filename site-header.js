document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.yos-header');
  if (!header) return;

  const toggle = header.querySelector('.yos-header__toggle');
  const links = header.querySelector('.yos-header__links');

  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const willOpen = !links.classList.contains('is-open');
      links.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });
    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const navLinks = header.querySelector('.yos-header__links');
  if (navLinks && !navLinks.querySelector('a[href="/blog/"]')) {
    const blogLink = document.createElement('a');
    blogLink.href = '/blog/';
    blogLink.textContent = 'Blog';
    const aboutLink = navLinks.querySelector('a[href="/about/"]');
    if (aboutLink) aboutLink.insertAdjacentElement('afterend', blogLink);
    else navLinks.insertBefore(blogLink, navLinks.querySelector('.yos-header__cta'));
  }

  if (!document.querySelector('.yos-action-bar')) {
    const actionBar = document.createElement('aside');
    actionBar.className = 'yos-action-bar';
    actionBar.setAttribute('aria-label', 'Start an engagement');
    actionBar.innerHTML = `
      <a class="yos-action-bar__primary" href="mailto:peter@youros.app?subject=Hire%20Peter">📧 <span>Hire</span> Peter</a>
      <a href="mailto:garry@youros.app?subject=Hire%20Garry">📧 <span>Hire</span> Garry</a>
      <a href="tel:+13854881520">📞 <span>Call Penny:</span> (385) 488-1520</a>`;
    header.insertAdjacentElement('afterend', actionBar);
  }

  const footer = document.querySelector('footer');
  if (footer && !document.querySelector('.yos-page-exits')) {
    const exits = document.createElement('section');
    exits.className = 'yos-page-exits';
    exits.setAttribute('aria-label', 'Keep exploring YourOS');
    exits.innerHTML = `
      <div class="yos-page-exits__inner">
        <h2>Ready to hire your first AI Employee?</h2>
        <p>Hire Peter for website work, Garry for lead follow-up, or meet the AI Employees available from YourOS.</p>
        <div class="yos-page-exits__links">
          <a href="mailto:peter@youros.app?subject=Hire%20Peter">Hire Peter</a>
          <a href="mailto:garry@youros.app?subject=Hire%20Garry">Hire Garry</a>
          <a href="/biztechs/">Meet the AI Employees</a>
          <a href="/blog/">Read the Blog</a>
          <a href="/how-it-works/">How It Works</a>
          <a href="/results/">Results</a>
        </div>
      </div>`;
    footer.insertAdjacentElement('beforebegin', exits);
  }
});
