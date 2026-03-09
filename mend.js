let state = { loggedIn:false, user:null, type:null };
const OWNER_CODE = 'mend2025';

// ── SCROLL TO SECTION ──
function scrollToSection(id) {
  // If not on landing page, go there first then scroll
  if (!document.getElementById('landing').classList.contains('active')) {
    goToPage('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 100);
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }
}

// ── GO TO AUTH (with tab preset) ──
function goToAuth(tab) {
  goToPage('auth');
  switchAuthTab(tab);
}

// ── SHOW SIGN IN (direct to auth page in sign-in mode) ──
function showSignIn() {
  goToPage('auth');
  switchAuthTab('signin');
}

// ── SELECT SIGNUP TYPE (inline selector) ──
function selectSignupType(type, el) {
  state.type = type;
  document.querySelectorAll('#signupTypeGrid .signup-type-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

// ── AUTH TAB SWITCHER ──
function switchAuthTab(tab) {
  const signInForm = document.getElementById('formSignIn');
  const signUpForm = document.getElementById('formSignUp');
  const tabSI = document.getElementById('tabSignIn');
  const tabSU = document.getElementById('tabSignUp');
  if (tab === 'signin') {
    signInForm.style.display = 'block';
    signUpForm.classList.add('form-signup-hidden');
    tabSI.classList.add('active');
    tabSU.classList.remove('active');
  } else {
    signInForm.style.display = 'none';
    signUpForm.classList.remove('form-signup-hidden');
    tabSI.classList.remove('active');
    tabSU.classList.add('active');
  }
}

// ── REGISTER (Sign Up) ──
function register() {
  const name    = document.getElementById('signupName').value.trim();
  const email   = document.getElementById('signupEmail').value.trim();
  const pass    = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  if (!name)              { alert('Please enter your full name.'); return; }
  if (!email)             { alert('Please enter your email address.'); return; }
  if (pass.length < 6)    { alert('Password must be at least 6 characters.'); return; }
  if (pass !== confirm)   { alert('Passwords do not match. Please try again.'); return; }
  if (!state.type)        { alert('Please select your account type above (Youth, Therapist, or Mentor).'); return; }

  // Treat registration same as login — log the user in
  document.getElementById('email').value = email;
  document.getElementById('password').value = pass;
  login();
}

function toggleOwnerAccess() {
  const box = document.getElementById('ownerAccessBox');
  box.style.display = box.style.display === 'none' || box.style.display === '' ? 'block' : 'none';
}

function verifyOwnerCode() {
  const code = document.getElementById('ownerCode').value;
  const errEl = document.getElementById('ownerCodeError');
  if (code === OWNER_CODE) {
    errEl.style.display = 'none';
    document.getElementById('ownerAccessBox').style.display = 'none';
    selectUserType('admin');
  } else {
    errEl.style.display = 'block';
    document.getElementById('ownerCode').value = '';
  }
}

function goToPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  const titles = {
    landing:'MEND Platform', auth:'Sign In', userTypeSelection:'Choose Account Type',
    contact:'Contact Us',
    dashboard:'Wellness Dashboard', assessment:'Assessment', therapy:'Therapy Sessions',
    creative:'Creative Space', community:'Community Forum', career:'Career Guidance', resources:'Resource Library',
    'therapist-dashboard':'Therapist Dashboard', 'therapist-clients':'My Clients', 'therapist-schedule':'Schedule',
    'mentor-dashboard':'Career Mentor Dashboard', 'mentor-mentees':'My Mentees', 'mentor-sessions':'Sessions',
    'mentor-career':'Career Paths', 'mentor-jobs':'Job Board', 'mentor-talent':'Talent Tracker',
    'mentor-workshops':'Workshops', 'mentor-resources':'Resources', 'mentor-profile':'My Profile',
    'admin-dashboard':'Owner Overview', 'admin-users':'All Users', 'admin-roles':'Roles & Access',
    'admin-content':'Content Review', 'admin-analytics':'Analytics', 'admin-reports':'Reports',
    'admin-settings':'Platform Settings'
  };
  document.getElementById('topbarTitle').textContent = titles[id] || 'MEND';
  if (window.innerWidth <= 768) closeSidebar();
}

function nav(id, btn) {
  goToPage(id);
  if (btn) {
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

function selectUserType(type) {
  state.type = type;
  const labels = { youth:'Youth', therapist:'Therapist', mentor:'Career Mentor', admin:'Platform Owner' };
  document.getElementById('authTitle').textContent = labels[type] + ' Sign In';
  document.getElementById('authSub').textContent = 'Welcome back to MEND';
  goToPage('auth');
}

function login() {
  const email = document.getElementById('email').value.trim();
  const pass  = document.getElementById('password').value;
  if (!email || pass.length < 6) { alert('Please enter a valid email and password (min 6 characters).'); return; }
  if (!state.type) { state.type = 'youth'; } // default for direct sign-in

  state.loggedIn = true;
  state.user = email.split('@')[0];
  const labels = { youth:'Youth', therapist:'Therapist', mentor:'Career Mentor', admin:'Owner' };

  document.getElementById('sbName').textContent = state.user;
  document.getElementById('sbBadge').textContent = labels[state.type];
  document.getElementById('topbarUser').textContent = `${labels[state.type]} · ${state.user}`;
  document.getElementById('topbarUser').style.display = 'block';
  document.getElementById('sidebar').classList.add('active');
  document.getElementById('main').classList.add('shifted');

  ['navYouth','navTherapist','navMentor','navAdmin'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  const navMap = { youth:'navYouth', therapist:'navTherapist', mentor:'navMentor', admin:'navAdmin' };
  document.getElementById(navMap[state.type]).style.display = 'block';

  const landing = { youth:'dashboard', therapist:'therapist-dashboard', mentor:'mentor-dashboard', admin:'admin-dashboard' };
  goToPage(landing[state.type]);

  const mw = document.getElementById('mentorWelcomeName');
  const mp = document.getElementById('mentorProfileName');
  const ow = document.getElementById('ownerWelcomeName');
  if (mw) mw.textContent = state.user;
  if (mp) mp.textContent = state.user;
  if (ow) ow.textContent = state.user;

  // Switch header to dashboard mode
  document.getElementById('headerPublic').style.display = 'none';
  document.getElementById('headerAnnounce').style.display = 'none';
  document.getElementById('headerMobileNav').classList.remove('open');
  document.getElementById('headerDash').classList.add('active');
  const chip = document.getElementById('topbarUser');
  chip.textContent = labels[state.type] + ' · ' + state.user;
  chip.style.display = 'block';
}

function logout() {
  state = { loggedIn:false, user:null, type:null };
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('main').classList.remove('shifted');
  document.getElementById('topbarUser').style.display = 'none';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  ['navYouth','navTherapist','navMentor','navAdmin'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  // Restore public header
  document.getElementById('headerPublic').style.display = 'flex';
  document.getElementById('headerAnnounce').style.display = 'flex';
  document.getElementById('headerDash').classList.remove('active');
  goToPage('landing');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

function toggleMobileMenu() {
  document.getElementById('headerMobileNav').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('headerMobileNav').classList.remove('open');
}

function scrollToFeatures() {
  goToPage('landing');
  setTimeout(() => {
    const el = document.querySelector('#landing .section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function scrollToTestimonials() {
  goToPage('landing');
  setTimeout(() => {
    const sections = document.querySelectorAll('#landing .section');
    if (sections.length) sections[sections.length-1].scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function toggleOpt(btn) {
  btn.closest('.q-options').querySelectorAll('.q-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function likePost(el, base) {
  if (el.dataset.liked) { el.textContent = `❤️ ${base}`; delete el.dataset.liked; }
  else { el.textContent = `❤️ ${base + 1}`; el.dataset.liked = '1'; }
}

function filterUsers(type, btn) {
  document.querySelectorAll('#admin-users .filter-tabs .btn').forEach(b => {
    b.className = 'btn btn-secondary btn-sm';
  });
  btn.className = 'btn btn-primary btn-sm';
}

// ── CONTACT FORM ──
function selectContactSubject(subject, el) {
  document.querySelectorAll('#contactSubjectGrid .contact-subject-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('contactSubject').value = subject;
}

function submitContactForm() {
  const first   = document.getElementById('contactFirstName').value.trim();
  const last    = document.getElementById('contactLastName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value.trim();

  if (!first)   { alert('Please enter your first name.'); return; }
  if (!last)    { alert('Please enter your last name.'); return; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  if (!subject) { alert('Please select a subject above.'); return; }
  if (message.length < 10) { alert('Please enter a message (at least 10 characters).'); return; }

  document.getElementById('contactFormWrap').style.display = 'none';
  document.getElementById('contactSuccess').classList.add('show');
}

function resetContactForm() {
  document.getElementById('contactFirstName').value = '';
  document.getElementById('contactLastName').value  = '';
  document.getElementById('contactEmail').value     = '';
  document.getElementById('contactMessage').value   = '';
  document.getElementById('contactSubject').value   = '';
  document.querySelectorAll('#contactSubjectGrid .contact-subject-opt').forEach(o => o.classList.remove('selected'));
  document.getElementById('contactFormWrap').style.display = 'block';
  document.getElementById('contactSuccess').classList.remove('show');
}

// ── FAQ ACCORDION ──
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
