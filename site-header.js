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
      <div class="yos-action-bar__contact yos-action-bar__primary yos-action-bar__peter">
        <a href="mailto:peter@youros.app?subject=Hire%20Peter">
          <svg class="yos-action-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 5.5h17v13h-17z"/><path d="m4 6 8 6.4L20 6"/></svg>
          <span class="yos-action-bar__label">Hire Peter<span class="yos-action-bar__detail">peter@youros.app</span></span>
        </a>
        <button class="yos-action-bar__copy" type="button" data-copy-email="peter@youros.app" aria-label="Copy Peter's email address" title="Copy Peter's email address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
        </button>
      </div>
      <div class="yos-action-bar__contact yos-action-bar__garry">
        <a href="mailto:garry@youros.app?subject=Hire%20Garry">
          <svg class="yos-action-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 5.5h17v13h-17z"/><path d="m4 6 8 6.4L20 6"/></svg>
          <span class="yos-action-bar__label">Hire Garry<span class="yos-action-bar__detail">garry@youros.app</span></span>
        </a>
        <button class="yos-action-bar__copy" type="button" data-copy-email="garry@youros.app" aria-label="Copy Garry's email address" title="Copy Garry's email address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
        </button>
      </div>
      <a class="yos-action-bar__penny" href="tel:+13854881520">
        <svg class="yos-action-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.1 3.8 10 7.4 8.3 9.6c1.2 2.4 3.1 4.3 5.5 5.5l2.2-1.7 3.7 2.9-.7 3.2c-.2.8-.9 1.4-1.8 1.3C9.7 20 3.8 14.1 3 6.6c-.1-.8.5-1.6 1.3-1.8z"/></svg>
        <span>Call Penny</span><span class="yos-action-bar__detail">(385) 488-1520</span>
      </a>`;
    header.insertAdjacentElement('afterend', actionBar);
    document.body.classList.add('has-yos-action-bar');

    actionBar.querySelectorAll('[data-copy-email]').forEach((button) => {
      button.addEventListener('click', async () => {
        const email = button.dataset.copyEmail;
        try {
          await navigator.clipboard.writeText(email);
          button.classList.add('is-copied');
          button.setAttribute('aria-label', `${email} copied`);
          window.setTimeout(() => {
            button.classList.remove('is-copied');
            button.setAttribute('aria-label', `Copy ${email}`);
          }, 1800);
        } catch {
          window.prompt('Copy this email address:', email);
        }
      });
    });
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
