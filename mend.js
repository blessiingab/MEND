/* ══════════════════════════════════
   MEND.JS — Mental Wellness for African Youth
   All JavaScript logic for the MEND platform
══════════════════════════════════ */

/* ── STATE ── */
let currentUser  = null;
let pendingType  = null;
let signupType   = null;

/* ── DEMO USERS (for login simulation) ── */
const DEMO_USERS = {
  'youth@mend.com':     { name: 'Amara K.',         role: 'youth',     password: 'password' },
  'therapist@mend.com': { name: 'Dr. Amara Okonkwo', role: 'therapist', password: 'password' },
  'mentor@mend.com':    { name: 'Kwame T.',           role: 'mentor',    password: 'password' },
  'owner@mend.com':     { name: 'Platform Owner',     role: 'owner',     password: 'password' },
};

/* ── SIDEBAR NAVIGATION CONFIG ── */
const NAV_CONFIG = {
  youth: [
    { icon: '📊', label: 'Dashboard',    page: 'p-dashboard'   },
    { icon: '🧠', label: 'Assessment',   page: 'p-assessment'  },
    { icon: '❤️', label: 'Therapy',      page: 'p-therapy'     },
    { icon: '🎨', label: 'Creative Space', page: 'p-creative'  },
    { icon: '👥', label: 'Community',    page: 'p-community'   },
    { icon: '📈', label: 'Career',       page: 'p-career'      },
    { icon: '📚', label: 'Resources',    page: 'p-resources'   },
  ],
  therapist: [
    { icon: '📊', label: 'Dashboard',  page: 'p-therapist-dashboard' },
    { icon: '👥', label: 'My Clients', page: 'p-therapist-clients'   },
    { icon: '📅', label: 'Schedule',   page: 'p-therapist-schedule'  },
  ],
  mentor: [
    { icon: '🌟', label: 'Dashboard',     page: 'p-mentor-dashboard' },
    { icon: '👤', label: 'My Mentees',    page: 'p-mentor-mentees'   },
    { icon: '📅', label: 'Sessions',      page: 'p-mentor-sessions'  },
    { icon: '📈', label: 'Career Paths',  page: 'p-mentor-career'    },
    { icon: '💼', label: 'Job Board',     page: 'p-mentor-jobs'      },
    { icon: '🎯', label: 'Talent Tracker', page: 'p-mentor-talent'   },
    { icon: '🎓', label: 'Workshops',     page: 'p-mentor-workshops' },
  ],
  owner: [
    { icon: '🏠', label: 'Overview',        page: 'p-admin-dashboard' },
    { icon: '👥', label: 'All Users',        page: 'p-admin-users'     },
    { icon: '🔐', label: 'Roles & Access',   page: 'p-admin-roles'     },
    { icon: '📝', label: 'Content Review',   page: 'p-admin-content'   },
    { icon: '📊', label: 'Analytics',        page: 'p-admin-analytics' },
    { icon: '📋', label: 'Reports',          page: 'p-admin-reports'   },
    { icon: '⚙️', label: 'Settings',         page: 'p-admin-settings'  },
  ],
};

/* ══════════════════════════════════
   PUBLIC PAGE NAVIGATION
══════════════════════════════════ */

/**
 * Switch between public pages (landing, userType, authPage, contact)
 * @param {string} id - element id of the page to show
 */
function showPage(id) {
  document.querySelectorAll('#publicView .page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
  window.scrollTo(0, 0);
}

/**
 * Show the auth page and switch to a specific tab
 * @param {'signin'|'signup'} tab
 */
function showAuthPage(tab) {
  showPage('authPage');
  switchTab(tab);
}

/**
 * Scroll to a section on the landing page
 * @param {string} id - section element id
 */
function scrollTo_(id) {
  showPage('landing');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

/* ══════════════════════════════════
   USER TYPE SELECTION
══════════════════════════════════ */

/**
 * Handle user clicking a type card (youth / therapist / mentor)
 * Redirects to the auth page with signup pre-selected
 * @param {'youth'|'therapist'|'mentor'} type
 */
function selectType(type) {
  pendingType = type;
  showPage('authPage');
  switchTab('signup');
  setTimeout(() => {
    document.querySelectorAll('.signup-type-opt').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.signup-type-opt').forEach(o => {
      if (o.getAttribute('onclick') && o.getAttribute('onclick').includes("'" + type + "'")) {
        o.classList.add('selected');
      }
    });
    signupType = type;
  }, 50);
}

/** Toggle the owner access code box visibility */
function toggleOwnerBox() {
  document.getElementById('ownerBox').classList.toggle('hidden');
}

/** Verify the owner access code and log in as owner if correct */
function checkOwnerCode() {
  const code = document.getElementById('ownerCode').value.trim();
  const err  = document.getElementById('ownerErr');
  if (code === 'owner2025') {
    err.classList.add('hidden');
    loginAs({ name: 'Platform Owner', role: 'owner' });
  } else {
    err.classList.remove('hidden');
  }
}

/* ══════════════════════════════════
   AUTH — SIGN IN / SIGN UP
══════════════════════════════════ */

/**
 * Switch between sign-in and sign-up forms
 * @param {'signin'|'signup'} tab
 */
function switchTab(tab) {
  const isSignIn = tab === 'signin';
  document.getElementById('formIn').classList.toggle('hidden', !isSignIn);
  document.getElementById('formUp').classList.toggle('hidden',  isSignIn);
  document.getElementById('tabIn').classList.toggle('active',   isSignIn);
  document.getElementById('tabUp').classList.toggle('active',  !isSignIn);
}

/**
 * Select user type during sign-up
 * @param {'youth'|'therapist'|'mentor'} type
 * @param {HTMLElement} el - the clicked element
 */
function pickSignupType(type, el) {
  signupType = type;
  document.querySelectorAll('.signup-type-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

/** Handle sign-in form submission */
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pwd   = document.getElementById('loginPwd').value;

  if (!email) { alert('Please enter your email address.'); return; }

  const user = DEMO_USERS[email];
  if (user && user.password === pwd) {
    loginAs(user);
  } else {
    // Flexible demo: infer role from email keywords
    const role = email.includes('therapist') ? 'therapist'
               : email.includes('mentor')    ? 'mentor'
               : email.includes('owner')     ? 'owner'
               : 'youth';
    const name = email.split('@')[0] || 'User';
    loginAs({ name: capitalize(name), role });
  }
}

/** Handle sign-up form submission */
function doRegister() {
  const name = document.getElementById('regName').value.trim()  || 'New User';
  const email = document.getElementById('regEmail').value.trim();
  const pwd   = document.getElementById('regPwd').value;
  const conf  = document.getElementById('regConfirm').value;

  if (!email)            { alert('Please enter your email address.'); return; }
  if (pwd.length < 6)    { alert('Password must be at least 6 characters.'); return; }
  if (pwd !== conf)      { alert('Passwords do not match.'); return; }

  const role = signupType || pendingType || 'youth';
  loginAs({ name, role });
}

/**
 * Log a user into the dashboard
 * @param {{ name: string, role: string }} user
 */
function loginAs(user) {
  currentUser = user;

  // Switch views
  document.getElementById('publicView').style.display = 'none';
  document.getElementById('appView').classList.remove('hidden');
  document.getElementById('appView').style.display = 'block';

  // Populate user info in sidebar and topbar
  document.getElementById('sbName').textContent    = user.name;
  document.getElementById('sbRole').textContent    = capitalize(user.role);
  document.getElementById('topbarUser').textContent = user.name;

  // Update role-specific welcome names
  if (user.role === 'mentor') {
    const el = document.getElementById('mentorName');
    if (el) el.textContent = user.name;
  }
  if (user.role === 'owner') {
    const el = document.getElementById('ownerName');
    if (el) el.textContent = user.name;
  }

  // Build the sidebar nav for this role
  buildSidebar(user.role);

  // Navigate to the first page for this role
  const first = NAV_CONFIG[user.role][0];
  navTo(first.page);
}

/** Log out and return to the public landing page */
function doLogout() {
  currentUser = null;
  document.getElementById('appView').style.display = 'none';
  document.getElementById('publicView').style.display = 'block';
  showPage('landing');
}

/* ══════════════════════════════════
   APP — SIDEBAR & NAVIGATION
══════════════════════════════════ */

/**
 * Dynamically build sidebar nav buttons for a given role
 * @param {string} role
 */
function buildSidebar(role) {
  const nav   = NAV_CONFIG[role] || [];
  const sbNav = document.getElementById('sbNav');
  sbNav.innerHTML = `<div class="sb-label">${capitalize(role)} Menu</div>`;

  nav.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'sb-btn' + (i === 0 ? ' active' : '');
    btn.innerHTML = `<span class="icon">${item.icon}</span>${item.label}`;
    btn.onclick = () => navTo(item.page, btn);
    sbNav.appendChild(btn);
  });
}

/**
 * Navigate to an app page
 * @param {string} pageId - id of the page div to show
 * @param {HTMLElement} [btnEl] - the sidebar button that triggered this (optional)
 */
function navTo(pageId, btnEl) {
  // Hide all app content pages
  document.querySelectorAll('.app-content .page').forEach(p => p.classList.remove('active'));

  // Show the target page
  const pg = document.getElementById(pageId);
  if (pg) pg.classList.add('active');

  // Update active sidebar button
  const btn = btnEl || document.querySelector(`.sb-btn[onclick*="${pageId}"]`);
  if (btn) {
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('topbarTitle').textContent = btn.textContent.trim();
  }

  // Auto-close sidebar on mobile after navigation
  if (window.innerWidth <= 768) closeSidebar();
}

/** Toggle the sidebar open/closed (desktop: collapse, mobile: slide) */
function toggleSidebar() {
  const shell   = document.getElementById('appShell');
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('appOverlay');

  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  } else {
    shell.classList.toggle('sidebar-hidden');
  }
}

/** Close the sidebar (mobile overlay close) */
function closeSidebar() {
  document.getElementById('appSidebar').classList.remove('open');
  document.getElementById('appOverlay').classList.remove('visible');
}

/* ══════════════════════════════════
   CONTACT FORM
══════════════════════════════════ */
let selectedSubject = '';

/**
 * Select a contact subject chip
 * @param {string} subject
 * @param {HTMLElement} el
 */
function pickSubject(subject, el) {
  selectedSubject = subject;
  document.querySelectorAll('.subject-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

/** Submit the contact form */
function submitContact() {
  const firstName = document.getElementById('cFirst').value.trim();
  const email     = document.getElementById('cEmail').value.trim();

  if (!firstName || !email) {
    alert('Please fill in your name and email address.');
    return;
  }

  // Show success state
  document.getElementById('contactFormWrap').style.display = 'none';
  document.getElementById('contactSuccess').classList.remove('hidden');
}

/** Reset the contact form back to its initial state */
function resetContact() {
  document.getElementById('contactFormWrap').style.display = 'block';
  document.getElementById('contactSuccess').classList.add('hidden');
  document.getElementById('cFirst').value = '';
  document.getElementById('cLast').value  = '';
  document.getElementById('cEmail').value = '';
  document.getElementById('cMsg').value   = '';
  document.querySelectorAll('.subject-opt').forEach(o => o.classList.remove('selected'));
  selectedSubject = '';
}

/* ══════════════════════════════════
   INTERACTIVE COMPONENTS
══════════════════════════════════ */

/**
 * Handle assessment option selection (radio-style within a group)
 * @param {HTMLElement} el - the clicked option button
 */
function pickOpt(el) {
  const group = el.closest('.q-options');
  group.querySelectorAll('.q-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

/**
 * Increment the like count on a creative post
 * @param {HTMLElement} el - the like span element
 * @param {number} n - current like count
 */
function likePost(el, n) {
  el.textContent = '❤️ ' + (n + 1);
  el.style.color = 'var(--coral)';
  el.onclick = null; // prevent multiple clicks
}

/**
 * Handle filter tab selection (e.g., All Users / Youth / Therapist)
 * @param {HTMLElement} el - the clicked tab button
 */
function filterTab(el) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/**
 * Toggle a feature ON/OFF switch
 * @param {HTMLElement} btn - the toggle button
 */
function toggleFeature(btn) {
  const isOn = btn.classList.contains('on');
  btn.classList.toggle('on',  !isOn);
  btn.classList.toggle('off',  isOn);
  btn.textContent = isOn ? 'OFF' : 'ON';
}

/* ══════════════════════════════════
   UTILITIES
══════════════════════════════════ */

/**
 * Capitalise the first letter of a string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}