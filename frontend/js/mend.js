/* ============================================================
   MEND — Shared JS Utilities
============================================================ */

const API_BASE = '/api';

// ── Auth helpers ────────────────────────────────────────────
const Auth = {
  getToken: () => localStorage.getItem('mend_token'),
  getUser:  () => { try { return JSON.parse(localStorage.getItem('mend_user')); } catch { return null; } },
  save: (token, user) => { localStorage.setItem('mend_token', token); localStorage.setItem('mend_user', JSON.stringify(user)); },
  clear: () => { localStorage.removeItem('mend_token'); localStorage.removeItem('mend_user'); },
  isLoggedIn: () => !!localStorage.getItem('mend_token'),
  requireAuth: () => {
    if (!localStorage.getItem('mend_token')) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  }
};

// ── API client ──────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 || res.status === 403) {
    if (path !== '/auth/login' && path !== '/auth/register') {
      Auth.clear();
      window.location.href = '/pages/login.html';
    }
  }
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const api = {
  get:    (path) => apiFetch(path),
  post:   (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  put:    (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => apiFetch(path, { method: 'DELETE' }),
};

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, type = '') {
  const existing = document.getElementById('mend-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'mend-toast';
  t.className = `mend-toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Navbar renderer ─────────────────────────────────────────
function renderNavbar(activePage = '') {
  const el = document.getElementById('main-navbar');
  if (!el) return;
  const user = Auth.getUser();
  const initials = user?.name ? user.name[0].toUpperCase() : '?';

  el.innerHTML = `
    <nav class="navbar navbar-expand-lg mend-navbar fixed-top py-0" style="height:56px">
      <div class="container-fluid px-4">
        <a class="navbar-brand" href="/"><span>M</span>END</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link ${activePage==='dashboard'?'active':''}" href="/pages/dashboard.html">🏠 Dashboard</a></li>
            <li class="nav-item"><a class="nav-link ${activePage==='therapy'?'active':''}" href="/pages/therapy.html">💬 Therapy</a></li>
            <li class="nav-item"><a class="nav-link ${activePage==='creative'?'active':''}" href="/pages/creative.html">✍️ Creative</a></li>
            <li class="nav-item"><a class="nav-link ${activePage==='resources'?'active':''}" href="/pages/resources.html">📚 Resources</a></li>
            <li class="nav-item"><a class="nav-link ${activePage==='career'?'active':''}" href="/pages/career.html">💼 Career</a></li>
          </ul>
          <div class="d-flex align-items-center gap-3">
            <span class="fw-600 d-none d-lg-block" style="font-size:14px; color:var(--dark)">${user?.name || 'User'}</span>
            <div class="nav-avatar" onclick="window.location.href='/pages/profile.html'">${initials}</div>
            <button class="btn btn-sm btn-outline-terra" onclick="doLogout()">Sign Out</button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

// ── Sidebar renderer ─────────────────────────────────────────
function renderSidebar(activePage = '') {
  const el = document.getElementById('main-sidebar');
  if (!el) return;
  const user = Auth.getUser();
  const initials = user?.name ? user.name[0].toUpperCase() : '?';
  const isAdmin = user?.role === 'admin';

  el.innerHTML = `
    <div class="sidebar-user">
      <div class="nav-avatar" style="width:36px;height:36px;font-size:14px">${initials}</div>
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--dark)">${user?.name || 'User'}</div>
        <div style="font-size:11px;color:var(--terracotta)">🔥 ${user?.streak || 0} day streak</div>
      </div>
    </div>

    <div class="sidebar-section">Main</div>
    <a href="/pages/dashboard.html"  class="sidebar-link ${activePage==='dashboard'?'active':''}"><span>🏠</span> Dashboard</a>
    <a href="/pages/assessment.html" class="sidebar-link ${activePage==='assessment'?'active':''}"><span>🧠</span> Assessment</a>
    <a href="/pages/therapy.html"    class="sidebar-link ${activePage==='therapy'?'active':''}"><span>💬</span> Therapy</a>

    <div class="sidebar-section">Community</div>
    <a href="/pages/creative.html"   class="sidebar-link ${activePage==='creative'?'active':''}"><span>✍️</span> Creative Space</a>
    <a href="/pages/resources.html"  class="sidebar-link ${activePage==='resources'?'active':''}"><span>📚</span> Resources</a>

    <div class="sidebar-section">Growth</div>
    <a href="/pages/career.html"     class="sidebar-link ${activePage==='career'?'active':''}"><span>💼</span> Career</a>
    <a href="/pages/profile.html"    class="sidebar-link ${activePage==='profile'?'active':''}"><span>👤</span> My Profile</a>
    ${isAdmin ? `
    <div class="sidebar-section">Admin</div>
    <a href="/pages/admin.html" class="sidebar-link ${activePage==='admin'?'active':''}"><span>⚙️</span> Admin Panel</a>
    ` : ''}

    <div class="sidebar-crisis">
      <strong>Crisis Line 🆘</strong><br>
      If you're in distress, please reach out:<br>
      <strong>+254 722 178 177</strong>
    </div>
  `;
}

// ── Logout ────────────────────────────────────────────────────
function doLogout() {
  Auth.clear();
  window.location.href = '/';
}

// ── Format date ───────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
}

// ── Greeting ──────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning 🌅';
  if (h < 17) return 'Good afternoon ☀️';
  return 'Good evening 🌙';
}
