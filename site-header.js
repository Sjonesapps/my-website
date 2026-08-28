document.addEventListener('DOMContentLoaded', () => {
  const measurementId = 'G-Y74BBJGYND';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  if (!window.__yourosAnalyticsConfigured) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    window.__yourosAnalyticsConfigured = true;
  }
  if (!document.querySelector('script[data-youros-analytics]')) {
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.dataset.yourosAnalytics = 'true';
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(analyticsScript);
  }

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
      </div>
      <div class="yos-action-bar__contact yos-action-bar__garry">
        <a href="mailto:garry@youros.app?subject=Hire%20Garry">
          <svg class="yos-action-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 5.5h17v13h-17z"/><path d="m4 6 8 6.4L20 6"/></svg>
          <span class="yos-action-bar__label">Hire Garry<span class="yos-action-bar__detail">garry@youros.app</span></span>
        </a>
      </div>
      <a class="yos-action-bar__penny yos-action-bar__penny-call" href="tel:+14352701422">
        <svg class="yos-action-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.1 3.8 10 7.4 8.3 9.6c1.2 2.4 3.1 4.3 5.5 5.5l2.2-1.7 3.7 2.9-.7 3.2c-.2.8-.9 1.4-1.8 1.3C9.7 20 3.8 14.1 3 6.6c-.1-.8.5-1.6 1.3-1.8z"/></svg>
        <span>Call Penny</span><span class="yos-action-bar__detail">(435) 270-1422</span>
      </a>
      <a class="yos-action-bar__penny yos-action-bar__penny-text" href="sms:+14352701422">
        <svg class="yos-action-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span>Text Penny</span><span class="yos-action-bar__detail">(435) 270-1422</span>
      </a>`;
    header.insertAdjacentElement('afterend', actionBar);
    document.body.classList.add('has-yos-action-bar');
  }

  const classifyCTA = (link) => {
    const href = link.getAttribute('href') || '';
    const label = (link.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const subject = decodeURIComponent(href).toLowerCase();
    if (href.includes('peter@youros.app') || label.includes('hire peter')) return { name: 'hire_peter', biztech: 'peter', action: 'hire' };
    if (href.includes('garry@youros.app') || label.includes('hire garry')) return { name: 'hire_garry', biztech: 'garry', action: 'hire' };
    if (href.includes('/biztechs/peter/') && label.includes('hire')) return { name: 'hire_peter', biztech: 'peter', action: 'hire' };
    if (href.includes('/biztechs/penny/') && (label.includes('hire') || label.includes('penny'))) return { name: 'hire_penny', biztech: 'penny', action: 'hire' };
    if (href.startsWith('tel:') && href.includes('4352701422')) return { name: 'call_penny', biztech: 'penny', action: 'call' };
    if (href.startsWith('sms:') && href.includes('4352701422')) return { name: 'text_penny', biztech: 'penny', action: 'text' };
    if (href.includes('reason=custom') || label.includes('custom biztech') || label.includes('different job')) return { name: 'custom_job', biztech: 'custom', action: 'describe_job' };
    if (href === '/biztechs/' || href.startsWith('/biztechs/?') || label.includes('choose a biztech') || label.includes('meet the biztech')) return { name: 'choose_biztech', biztech: 'multiple', action: 'choose' };
    if (href === '#hire-your-first-employee' || label.includes('tell us what needs doing')) return { name: 'tell_us_the_job', biztech: 'multiple', action: 'qualify' };
    return null;
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const cta = classifyCTA(link);
    if (!cta || typeof window.gtag !== 'function') return;
    window.gtag('event', 'cta_click', {
      cta_name: cta.name,
      biztech: cta.biztech,
      action: cta.action,
      placement: link.closest('.yos-action-bar') ? 'sticky_action_bar' : (link.closest('header, nav') ? 'navigation' : 'page_content'),
      destination: link.getAttribute('href') || '',
      page_path: window.location.pathname,
      transport_type: 'beacon'
    });
  }, { passive: true });

  const footer = document.querySelector('footer');
  if (footer && !document.querySelector('.yos-page-exits')) {
    const exits = document.createElement('section');
    exits.className = 'yos-page-exits';
    exits.setAttribute('aria-label', 'Keep exploring YourOS');
    exits.innerHTML = `
      <div class="yos-page-exits__inner">
        <h2>Ready to hire your first BizTech?</h2>
        <p>Hire Peter for website work, Garry for lead follow-up, or meet the specialists available from YourOS.</p>
        <div class="yos-page-exits__links">
          <a href="mailto:peter@youros.app?subject=Hire%20Peter">Hire Peter</a>
          <a href="mailto:garry@youros.app?subject=Hire%20Garry">Hire Garry</a>
          <a href="/biztechs/">Choose a BizTech</a>
          <a href="/blog/">Read the Blog</a>
          <a href="/how-it-works/">How It Works</a>
          <a href="/results/">Results</a>
        </div>
      </div>`;
    footer.insertAdjacentElement('beforebegin', exits);
  }
});
