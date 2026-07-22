#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HEADER = '''  <nav class="yos-header" aria-label="Primary navigation">
    <a class="yos-header__brand" href="/">
      <img src="https://i.postimg.cc/438dsJnm/3-D-Electric-Blue-Y-with-Chrome-Line.png" alt="YourOS">
      <span>YourOS</span>
    </a>
    <button class="yos-header__toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-navigation">
      <span></span><span></span><span></span>
    </button>
    <div class="yos-header__links" id="primary-navigation">
      <div class="yos-header__dropdown">
        <a href="/biztechs/">BizTechs ▾</a>
        <div class="yos-header__dropdown-menu">
          <a href="/biztechs/peter/">Peter — Website Developer</a>
          <a href="/biztechs/penny/">Penny — Phone Receptionist</a>
          <a href="/biztechs/garry/">Garry — Follow-Up Closer</a>
          <a href="/custom-biztech/">Custom BizTechs</a>
        </div>
      </div>
      <a href="/how-it-works/">How It Works</a>
      <a href="/results/">Results</a>
      <a href="/pricing/">Pricing</a>
      <a href="/about/">About</a>
      <a class="yos-header__cta" href="/hire-a-biztech/?source=nav">Hire a BizTech</a>
    </div>
  </nav>'''

nav_pattern = re.compile(r'\s*<nav(?:\s[^>]*)?>.*?</nav>', re.IGNORECASE | re.DOTALL)

for path in sorted(ROOT.rglob('*.html')):
    if '.git' in path.parts:
        continue
    original = path.read_text()
    if not nav_pattern.search(original):
        continue
    updated = nav_pattern.sub('\n' + HEADER, original, count=1)
    if '/site-header.css' not in updated:
        updated = re.sub(r'</head>', '  <link rel="stylesheet" href="/site-header.css">\n</head>', updated, count=1, flags=re.IGNORECASE)
    if '/site-header.js' not in updated:
        updated = re.sub(r'</body>', '  <script src="/site-header.js"></script>\n</body>', updated, count=1, flags=re.IGNORECASE)
    path.write_text(updated)
    print(path.relative_to(ROOT))
