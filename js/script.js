/**
 * Abhinav Ashish — Portfolio Script
 * Clean, self-contained. No external dependencies.
 */

'use strict';

/* ─── Constants ─── */
const GITHUB_USER = 'Abhinav7903';
const SKIP_REPOS  = new Set(['Abhinav7903', 'Abhinav79031', 'Portfolio']);
const LANG_COLORS = {
  Go: '#00ADD8', JavaScript: '#F7DF1E', TypeScript: '#3178C6',
  Python: '#3776AB', Java: '#ED8B00', HTML: '#E34F26',
  CSS: '#1572B6', Dart: '#0175C2', Shell: '#89E051',
};

/* ─── Utility ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* ─── DOM Ready ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* ═══ THEME ═══ */
  const html  = document.documentElement;
  const tBtn  = $('#theme-btn');
  const tIcon = $('#theme-icon');

  const applyTheme = (t) => {
    html.setAttribute('data-theme', t);
    tIcon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('pf-theme', t);
  };

  applyTheme(localStorage.getItem('pf-theme') || 'dark');
  on(tBtn, 'click', () => applyTheme(html.dataset.theme === 'dark' ? 'light' : 'dark'));


  /* ═══ MOBILE NAV ═══ */
  const ham     = $('#hamburger');
  const navMenu = $('#nav-menu');
  const overlay = $('#nav-overlay');
  const closeB  = $('#close-btn');

  const openNav  = () => { ham.classList.add('open'); navMenu.classList.add('show'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; };
  const closeNav = () => { ham.classList.remove('open'); navMenu.classList.remove('show'); overlay.classList.remove('show'); document.body.style.overflow = ''; };

  on(ham, 'click', openNav);
  on(closeB, 'click', closeNav);
  on(overlay, 'click', closeNav);
  $$('.nav-link-m').forEach(l => on(l, 'click', closeNav));


  /* ═══ HEADER SCROLL ═══ */
  const header   = $('#header');
  const scrollBtn = $('#scroll-top');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    scrollBtn.classList.toggle('show', y > 450);
    updateActiveNav(y);
  };

  on(window, 'scroll', onScroll, { passive: true });
  on(scrollBtn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ═══ ACTIVE NAV ═══ */
  const sections = $$('section[id]');

  const updateActiveNav = (scrollY) => {
    const offset = scrollY + 120;
    sections.forEach(s => {
      const top    = s.offsetTop;
      const bottom = top + s.offsetHeight;
      const id     = s.id;
      const link   = $$(`.nav-link[data-section="${id}"]`);
      const active = offset >= top && offset < bottom;
      link.forEach(l => l.classList.toggle('active-link', active));
    });
  };


  /* ═══ TYPING ═══ */
  const typedEl = $('#typed');
  const phrases = [
    'code as clean as my quarters',
    'scalable backend systems',
    'architectures without a speck of dust',
    'masterpieces in Go',
    'systems that never hesitate',
  ];

  let pi = 0, ci = 0, deleting = false, delay = 80;

  const tick = () => {
    const phrase = phrases[pi];
    typedEl.textContent = deleting
      ? phrase.slice(0, ci - 1)
      : phrase.slice(0, ci + 1);

    if (deleting) { ci--; delay = 38; }
    else          { ci++; delay = 80; }

    if (!deleting && ci === phrase.length) { deleting = true; delay = 2200; }
    else if (deleting && ci === 0)         { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }

    setTimeout(tick, delay);
  };
  setTimeout(tick, 800);


  /* ═══ SCROLL REVEAL ═══ */
  // Mark items so CSS can start them as "hidden" — done after parse so no flash
  requestAnimationFrame(() => {
    $$('[data-reveal]').forEach(el => {
      el.classList.add('will-reveal');
    });

    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Small delay so the will-reveal paint has settled
          requestAnimationFrame(() => e.target.classList.add('in-view'));
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

    $$('[data-reveal]').forEach(el => revealObs.observe(el));
  });


  /* ═══ SMOOTH ANCHOR SCROLL ═══ */
  $$('a[href^="#"]').forEach(a => {
    on(a, 'click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(html).getPropertyValue('--nav-h'));
      window.scrollTo({ top: target.offsetTop - navH - 10, behavior: 'smooth' });
    });
  });


  /* ═══ GITHUB PROJECTS ═══ */

/* ═══ GITHUB PROJECTS ═══ */

const grid = $('#proj-grid');
const loading = $('#proj-loading');

const prevBtn = $('#prevPage');
const nextBtn = $('#nextPage');
const pageInfo = $('#pageInfo');

let reposData = [];
let filteredRepos = [];
let currentPage = 1;

const perPage = 6;


/* ---------- Language Color ---------- */

function getLangColor(lang){
  return LANG_COLORS[lang] || "#6b7280";
}


/* ---------- Create Project Card ---------- */

function makeCard(repo){

  const card = document.createElement("div");
  card.className = "proj-card";

  const lang = repo.language || "Other";
  const color = getLangColor(lang);

  card.innerHTML = `
  
    <div class="pc-top">

      <div class="pc-icon">
        <i class="fas fa-cube"></i>
      </div>

      <div class="pc-acts">

        <a href="${repo.html_url}" target="_blank" class="pc-act">
          <i class="fab fa-github"></i>
        </a>

        ${repo.homepage ? `
        <a href="${repo.homepage}" target="_blank" class="pc-act">
          <i class="fas fa-arrow-up-right-from-square"></i>
        </a>` : ""}

      </div>

    </div>

    <div class="pc-body">

      <h3 class="pc-title">
        ${repo.name.replace(/[-_]/g," ")}
      </h3>

      <p class="pc-desc">
        ${repo.description || "No description provided"}
      </p>

    </div>

    <div class="pc-foot">

      <span class="pc-tag">
        <span class="lang-dot" style="background:${color}"></span>
        ${lang}
      </span>

      <span class="pc-stars">
        <i class="fas fa-star"></i> ${repo.stargazers_count}
      </span>

    </div>

  `;

  return card;

}


/* ---------- Render Projects ---------- */

function renderProjects(){

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / perPage));

  /* prevent overflow page */
  if(currentPage > totalPages){
    currentPage = totalPages;
  }

  grid.innerHTML = "";

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  const pageRepos = filteredRepos.slice(start, end);

  pageRepos.forEach(repo => {
    grid.appendChild(makeCard(repo));
  });

  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;

  /* lock buttons properly */
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= totalPages;

}


/* ---------- Filters ---------- */
function applyFilter(type){

  currentPage = 1;

  if(type === "all"){
    filteredRepos = reposData;
  }
  else if(type === "other"){
    filteredRepos = reposData.filter(r =>
      r.language !== "Go" &&
      r.language !== "JavaScript"
    );
  }
  else{
    filteredRepos = reposData.filter(r =>
      r.language === type
    );
  }

  renderProjects();

}


/* ---------- Filter Buttons ---------- */
/* Scope to .proj-filter so Prev/Next pagination are never caught */

$$(".proj-filter .f-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    $$(".proj-filter .f-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    applyFilter(btn.dataset.filter);

  });

});


/* ---------- Pagination ---------- */

prevBtn.onclick = () => {

  if(currentPage > 1){
    currentPage--;
    renderProjects();
  }

};

nextBtn.onclick = () => {

  const totalPages = Math.ceil(filteredRepos.length / perPage);

  if(currentPage < totalPages){
    currentPage++;
    renderProjects();
  }

};


/* ---------- Load GitHub Repos ---------- */

async function loadProjects(){

  try{

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`
    );

    let repos = await res.json();

    repos = repos.filter(r =>
      !r.fork &&
      !SKIP_REPOS.has(r.name)
    );

    repos.sort((a,b)=>
      new Date(b.updated_at) - new Date(a.updated_at)
    );

    reposData = repos;
    filteredRepos = repos;

    if(loading){
      loading.remove();
    }

    renderProjects();

  }

  catch(err){

    console.warn("GitHub API error:",err);

    if(loading){

      loading.innerHTML = `
        <p style="color:var(--text-tertiary)">
          Could not load GitHub repos.
          <br>
          <a href="https://github.com/${GITHUB_USER}" target="_blank"
             style="color:var(--accent)">
             View on GitHub →
          </a>
        </p>
      `;

    }

  }

}

loadProjects();

  /* ═══════════════════════════════════════════════════
     PREMIUM CONTACT — cycling placeholder, magnetic btn,
     confetti burst, animated SVG checkmark modal
  ═══════════════════════════════════════════════════ */

  /* ── 1. Cycling typewriter placeholder on textarea ── */
  const cyclingEl = document.getElementById('placeholder-cycling');
  const cyclingTexts = [
    'Tch. Tell me about your project...',
    "Is your codebase a mess? Let's clean it.",
    "Need an elite Scout for your backend?",
    "Bring me your Colossal problems...",
    "Choose: build it right, or don't build it.",
  ];

  if (cyclingEl) {
    let cIdx = 0, cChar = 0, cDel = false;

    const tickPlaceholder = () => {
      const text = cyclingTexts[cIdx];
      if (!cDel) {
        cyclingEl.textContent = text.slice(0, cChar + 1);
        cChar++;
        if (cChar === text.length) {
          setTimeout(tickPlaceholder, 2600);
          cDel = true;
          return;
        }
      } else {
        cyclingEl.textContent = text.slice(0, cChar - 1);
        cChar--;
        if (cChar === 0) {
          cDel = false;
          cIdx = (cIdx + 1) % cyclingTexts.length;
        }
      }
      setTimeout(tickPlaceholder, cDel ? 32 : 72);
    };
    setTimeout(tickPlaceholder, 1400);
  }


  /* ── 2. Magnetic Send Button ── */
  const magWrap  = document.getElementById('magnetic-wrap');
  const sendBtn  = document.getElementById('submit-btn');

  if (magWrap && sendBtn) {
    let isInside = false;
    magWrap.addEventListener('mouseenter', () => { isInside = true; });
    magWrap.addEventListener('mouseleave', () => {
      isInside = false;
      sendBtn.style.transition = 'transform 0.55s var(--ease-spring), box-shadow 0.3s';
      sendBtn.style.transform  = 'translate(0,0) scale(1)';
      setTimeout(() => { if (!isInside) sendBtn.style.transition = ''; }, 560);
    });
    magWrap.addEventListener('mousemove', (e) => {
      const rect = sendBtn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.40;
      const dy = (e.clientY - cy) * 0.40;
      sendBtn.style.transition = 'transform 0.12s, box-shadow 0.3s';
      sendBtn.style.transform  = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });
  }


  /* ── 3. Confetti burst (canvas-confetti) ── */
  const confettiCanvas = document.getElementById('confetti-canvas');

  function fireConfetti() {
    if (!confettiCanvas || typeof confetti === 'undefined') return;
    const shoot = confetti.create(confettiCanvas, { resize: true, useWorker: false });
    // Centre burst
    shoot({ particleCount: 90, spread: 70, origin: { y: 0.55 },
            colors: ['#7c6fff','#00e5c0','#ff6b9d','#ffffff','#fbbf24'],
            startVelocity: 38, ticks: 200 });
    // Side bursts
    setTimeout(() => {
      shoot({ particleCount: 45, angle: 60, spread: 58,
               origin: { x: 0.1, y: 0.6 }, colors: ['#7c6fff','#00e5c0','#ff6b9d'] });
      shoot({ particleCount: 45, angle: 120, spread: 58,
               origin: { x: 0.9, y: 0.6 }, colors: ['#7c6fff','#00e5c0','#ff6b9d'] });
    }, 180);
  }


  /* ── 4. Success Modal ── */
  const successOverlay = document.getElementById('success-overlay');
  const smCloseBtn     = document.getElementById('sm-close-btn');
  const smNameEl       = document.getElementById('sm-name');
  const smBar          = document.getElementById('sm-progress-bar');
  let dismissTimer;

  function showSuccessModal(firstName) {
    if (!successOverlay) return;
    if (smNameEl) smNameEl.textContent = firstName || 'there';
    successOverlay.classList.add('visible');
    if (smBar) {
      smBar.classList.remove('running');
      void smBar.offsetWidth; // force reflow to restart animation
      smBar.classList.add('running');
    }
    dismissTimer = setTimeout(closeSuccessModal, 4500);
  }

  function closeSuccessModal() {
    if (!successOverlay) return;
    successOverlay.classList.remove('visible');
    clearTimeout(dismissTimer);
  }

  if (smCloseBtn) smCloseBtn.addEventListener('click', closeSuccessModal);
  if (successOverlay) successOverlay.addEventListener('click', (e) => {
    if (e.target === successOverlay) closeSuccessModal();
  });


  /* ── 5. Form Submit ── */
  const contactForm = document.getElementById('contact-form');

  if (contactForm && sendBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const firstName = (contactForm.elements['name']?.value || '').trim().split(' ')[0];
      const sendLabel = sendBtn.querySelector('.send-label');

      // Trigger plane fly animation
      sendBtn.classList.add('sending');
      if (sendLabel) sendLabel.textContent = 'Sending…';

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error('Send failed');

        // Success ✓
        contactForm.reset();
        setTimeout(() => { fireConfetti(); showSuccessModal(firstName); }, 300);

      } catch {
        // Error state
        sendBtn.style.background = 'linear-gradient(135deg,#ff6b9d,#e84393)';
        if (sendLabel) sendLabel.textContent = 'Failed — Try Again';
        setTimeout(() => {
          sendBtn.classList.remove('sending');
          if (sendLabel) sendLabel.textContent = 'Send Message';
          sendBtn.style.background = '';
        }, 3000);
        return;
      }

      // Reset button after plane anim resolves
      setTimeout(() => {
        sendBtn.classList.remove('sending');
        if (sendLabel) sendLabel.textContent = 'Send Message';
      }, 950);
    });
  }


  /* ═══ INITIAL SCROLL CALL ═══ */
  onScroll();

});


/* ═══════════════════════════════════════
   TERMINAL — works on desktop AND mobile
   Mobile: hidden input captures keyboard
   Desktop: document keydown (unchanged)
═══════════════════════════════════════ */
const terminalText    = document.getElementById('terminal-text');
const terminalHistory = document.getElementById('terminal-history');
const terminalBody    = document.getElementById('terminal-body');
const mobileInput     = document.getElementById('terminal-mobile-input');
const tapHint         = document.getElementById('terminal-tap-hint');

if (terminalText && terminalHistory && terminalBody) {
  let currentCmd = '';
  let prevInputVal = '';

  const responses = {
    whoami:     "Abhinav Ashish — Elite Backend Architect",
    experience: 'Cleaning up tech debt faster than you can blink',
    stack:      'Go • PostgreSQL • Redis • Earl Grey tea',
    projects:   'TermChat • Backend-For-Split • Systems as clean as my quarters',
    github:     'github.com/Abhinav7903 (Witness precision)',
    linkedin:   'linkedin.com/in/abhinav-ashish-06b87821b',
    mail:       'abhinavashish4@gmail.com',
    help:       'Commands: whoami  experience  stack  projects  github  linkedin  mail  clear',
  };

  /* ── Shared: render current command & scroll ── */
  const render = () => {
    terminalText.textContent = currentCmd;
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  /* ── Shared: execute command (Enter) ── */
  const execCmd = () => {
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="prompt">master@backend:~$</span> ${currentCmd}`;
    terminalHistory.appendChild(cmdLine);

    if (currentCmd === 'clear') {
      terminalHistory.innerHTML = '';
    } else {
      const out = document.createElement('div');
      out.className = 'terminal-output';
      out.textContent = responses[currentCmd] || "command not found — try 'help'";
      terminalHistory.appendChild(out);
    }
    currentCmd = '';
    render();

    // Hide the tap hint after first successful command
    if (tapHint) tapHint.style.display = 'none';
  };

  /* ─────────────────────────────────────
     MOBILE: tap terminal → focus hidden
     input → virtual keyboard opens
  ───────────────────────────────────── */
  if (mobileInput) {
    // Make whole terminal body tappable
    terminalBody.style.cursor = 'text';
    terminalBody.addEventListener('click', () => {
      mobileInput.style.pointerEvents = 'auto';
      mobileInput.focus();
    });

    // Show focused state on the cursor
    mobileInput.addEventListener('focus', () => {
      terminalBody.classList.add('terminal-active');
      if (tapHint) tapHint.style.display = 'none';
    });
    mobileInput.addEventListener('blur', () => {
      terminalBody.classList.remove('terminal-active');
    });

    /* input event — fires for every character on mobile (including
       autocorrect, IME, swipe keyboard, etc.) */
    mobileInput.addEventListener('input', () => {
      const val = mobileInput.value;

      if (val.length > prevInputVal.length) {
        // Characters were added
        currentCmd += val.slice(prevInputVal.length);
      } else if (val.length < prevInputVal.length) {
        // Backspace / deletion
        const removed = prevInputVal.length - val.length;
        currentCmd = currentCmd.slice(0, -removed);
      }
      prevInputVal = val;
      render();
    });

    /* keydown on hidden input — catches Enter + explicit Backspace */
    mobileInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        execCmd();
        // Reset the hidden input so future input events diff correctly
        mobileInput.value = '';
        prevInputVal = '';
      } else if (e.key === 'Backspace' && mobileInput.value === '') {
        // Edge case: cursor at start but there's still currentCmd content
        e.preventDefault();
        currentCmd = currentCmd.slice(0, -1);
        render();
      }
    });
  }

  /* ─────────────────────────────────────
     DESKTOP fallback: document keydown
     Only runs when NO input is focused.
     If mobileInput is focused (user clicked
     terminal or is on mobile), its own
     keydown/input handlers take over.
  ───────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    // Skip if ANY input/textarea has focus — those have their own handlers
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      currentCmd = currentCmd.slice(0, -1);
    } else if (e.key === 'Enter') {
      execCmd();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      currentCmd += e.key;
    } else {
      return;
    }
    render();
  });
}



/* ═══════════════════════════════════════
   3-D TECH SPHERE (about section)
═══════════════════════════════════════ */
(function buildSphere() {
  const container = document.getElementById('tech-sphere');
  if (!container) return;

  /* ── config ── */
  const TAGS = [
    'Go', 'PostgreSQL', 'Redis', 'Docker', 'Linux',
    'WebSockets', 'REST APIs', 'Git', 'React', 'Python',
    'Java', 'Bash', 'Neo4j', 'Firebase', 'TypeScript',
    'HTTP/2', 'gRPC', 'JWT', 'AWS', "GCP", "AZURE"
  ];
  const RADIUS = 190;   // sphere radius in px — fills 400px container
  const SPEED_X = 0.003;
  const SPEED_Y = 0.006;

  /* state */
  let angleX = 0.4, angleY = 0;
  let raf, paused = false;

  /* ── distribute tags on sphere via Fibonacci lattice ── */
  const items = TAGS.map((text, i) => {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / TAGS.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    const el = document.createElement('span');
    el.className   = 'sphere-tag';
    el.textContent = text;
    container.appendChild(el);

    return { el, phi, theta };
  });

  /* ── render each frame ── */
  const render = () => {
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);

    items.forEach(({ el, phi, theta }) => {
      /* unit sphere coords */
      let x = Math.sin(phi) * Math.cos(theta);
      let y = Math.cos(phi);
      let z = Math.sin(phi) * Math.sin(theta);

      /* rotate around Y */
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;
      /* rotate around X */
      let y1 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      /* perspective projection */
      const scale    = (z2 + 1.8) / 2.8;   // 0.64 … 1.0
      const opacity  = (z2 + 1.4) / 2.4;   // 0.58 … 1.0
      const px = x1 * RADIUS;
      const py = y1 * RADIUS;

      el.style.transform  = `translate(-50%,-50%) translate(${px}px,${py}px) scale(${scale})`;
      el.style.opacity    = Math.max(0.18, opacity).toFixed(2);
      el.style.zIndex     = Math.round(scale * 10);

      /* Colour + glow by depth — front = accent neon, back = muted */
      if (z2 > 0.35) {
        el.style.color       = 'var(--accent)';
        el.style.borderColor = 'rgba(124,111,255,0.55)';
        el.style.textShadow  = '0 0 8px rgba(124,111,255,0.7), 0 0 2px rgba(0,229,192,0.4)';
        el.style.background  = 'rgba(124,111,255,0.12)';
      } else if (z2 > -0.1) {
        el.style.color       = 'var(--text-secondary)';
        el.style.borderColor = 'rgba(255,255,255,0.1)';
        el.style.textShadow  = '0 0 4px rgba(124,111,255,0.25)';
        el.style.background  = 'rgba(11,11,24,0.85)';
      } else {
        el.style.color       = 'var(--text-tertiary)';
        el.style.borderColor = 'rgba(255,255,255,0.04)';
        el.style.textShadow  = 'none';
        el.style.background  = 'rgba(11,11,24,0.6)';
      }
    });

    if (!paused) {
      angleY += SPEED_Y;
      angleX += SPEED_X;
    }
    raf = requestAnimationFrame(render);
  };

  render();

  /* ── pause on hover, slow on mouse drag ── */
  let isDragging = false, lastMX = 0, lastMY = 0;

  container.addEventListener('mouseenter', () => { paused = true; });
  container.addEventListener('mouseleave', () => { paused = false; isDragging = false; });

  container.addEventListener('mousedown', (e) => {
    isDragging = true; lastMX = e.clientX; lastMY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    angleY += (e.clientX - lastMX) * 0.008;
    angleX += (e.clientY - lastMY) * 0.008;
    lastMX = e.clientX; lastMY = e.clientY;
  });
})();


/* ═══════════════════════════════════════
   COPY EMAIL TO CLIPBOARD
═══════════════════════════════════════ */
(function initCopyEmail() {
  const copyBtn  = document.getElementById('copy-email-btn');
  const copyIcon = document.getElementById('copy-email-icon');
  if (!copyBtn || !copyIcon) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('abhinavashish@gmail.com');
      copyIcon.className = 'fas fa-check';
      copyBtn.classList.add('copied');
      copyBtn.title = 'Copied!';
    } catch {
      // Fallback for browsers that block clipboard without HTTPS
      const ta = document.createElement('textarea');
      ta.value = 'abhinavashish@gmail.com';
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyIcon.className = 'fas fa-check';
      copyBtn.classList.add('copied');
    }

    setTimeout(() => {
      copyIcon.className = 'fas fa-copy';
      copyBtn.classList.remove('copied');
      copyBtn.title = 'Copy email';
    }, 2000);
  });
})();
