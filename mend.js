/* ============================================================
   MEND PLATFORM — Shared JavaScript  (main.js)
   Loaded on every page for API calls, auth, and utilities
============================================================ */

const API = "http://localhost:3000/api";

// ── Auth Helpers ─────────────────────────────────────────────
function getToken()      { return localStorage.getItem("mend_token"); }
function getUser()       { try { return JSON.parse(localStorage.getItem("mend_user")); } catch { return null; } }
function setAuth(token, user) { localStorage.setItem("mend_token", token); localStorage.setItem("mend_user", JSON.stringify(user)); }
function clearAuth()     { localStorage.removeItem("mend_token"); localStorage.removeItem("mend_user"); }

function requireAuth() {
  if (!getToken()) { window.location.href = "/public/login.html"; return false; }
  return true;
}
function requireAdmin() {
  const u = getUser();
  if (!u || u.role !== "admin") { window.location.href = "/public/dashboard.html"; return false; }
  return true;
}
function redirectIfLoggedIn() {
  if (getToken()) { window.location.href = "/public/dashboard.html"; }
}

// ── API Fetch Wrapper ────────────────────────────────────────
async function api(method, endpoint, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  const token = getToken();
  if (token) opts.headers["Authorization"] = "Bearer " + token;
  if (body)  opts.body = JSON.stringify(body);

  const res = await fetch(API + endpoint, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

const GET    = (ep)       => api("GET",    ep);
const POST   = (ep, body) => api("POST",   ep, body);
const PUT    = (ep, body) => api("PUT",    ep, body);
const DELETE = (ep)       => api("DELETE", ep);

// ── Toast ────────────────────────────────────────────────────
function toast(msg, type = "success") {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = (type === "success" ? "✓ " : "✗ ") + msg;
  el.className = type === "error" ? "error" : "";
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 3500);
}

// ── Navbar Builder ───────────────────────────────────────────
function buildNav(activePage) {
  const user = getUser();
  if (!user) return;

  const nav = document.getElementById("navbar");
  if (!nav) return;

  const links = [
    { href: "/public/dashboard.html",  label: "Dashboard",  page: "dashboard"  },
    { href: "/public/assessment.html", label: "Assessment",  page: "assessment" },
    { href: "/public/therapy.html",    label: "Therapy",     page: "therapy"    },
    { href: "/public/creative.html",   label: "Creative",    page: "creative"   },
    { href: "/public/resources.html",  label: "Resources",   page: "resources"  },
    { href: "/public/career.html",     label: "Career",      page: "career"     },
  ];

  const linksHTML = links.map(l =>
    `<a href="${l.href}" class="nav-link${activePage === l.page ? " active" : ""}">${l.label}</a>`
  ).join("");

  nav.innerHTML = `
    <a href="/dashboard.html" class="nav-logo">M<span>END</span></a>
    <div class="nav-links">
      ${linksHTML}
      ${user.role === "admin" ? `<a href="/admin.html" class="nav-link${activePage === "admin" ? " active" : ""}">⚙ Admin</a>` : ""}
      <span class="nav-user-name">${user.name.split(" ")[0]}</span>
      <div class="nav-avatar" onclick="window.location='/public/profile.html'">${user.name[0].toUpperCase()}</div>
      <button class="btn btn-ghost btn-sm" onclick="logout()">Logout</button>
    </div>
  `;
}

// ── Sidebar Builder ──────────────────────────────────────────
function buildSidebar(activePage) {
  const user = getUser();
  const sb = document.getElementById("sidebar");
  if (!sb || !user) return;

  const links = [
    { href: "/public/dashboard.html",  icon: "🏠", label: "Home",        page: "dashboard"  },
    { href: "/public/assessment.html", icon: "🧠", label: "Assessment",  page: "assessment" },
    { href: "/public/therapy.html",    icon: "💬", label: "Therapy",     page: "therapy"    },
    { href: "/public/creative.html",   icon: "🎨", label: "Creative",    page: "creative"   },
    { href: "/public/resources.html",  icon: "📚", label: "Resources",   page: "resources"  },
    { href: "/public/career.html",     icon: "🚀", label: "Career",      page: "career"     },
    { href: "/public/profile.html",    icon: "👤", label: "Profile",     page: "profile"    },
  ];
  if (user.role === "admin") {
    links.push({ href: "/public/admin.html", icon: "⚙️", label: "Admin Panel", page: "admin" });
  }

  sb.innerHTML = `
    <div class="sidebar-user">
      <div class="avatar avatar-sm">${user.name[0].toUpperCase()}</div>
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--dark)">${user.name}</div>
        <div style="font-size:12px;color:var(--green-mid)">● Active</div>
      </div>
    </div>
    <div class="sidebar-section">Navigation</div>
    ${links.map(l => `
      <a href="${l.href}" class="sidebar-link${activePage === l.page ? " active" : ""}">
        <span class="icon">${l.icon}</span> ${l.label}
      </a>
    `).join("")}
    <div class="sidebar-crisis" style="margin-top:24px">
      <div style="font-size:13px;font-weight:700;color:var(--terracotta);margin-bottom:6px">🆘 Crisis Support</div>
      <p>Feeling overwhelmed? Immediate help is one click away.</p>
      <button class="btn btn-primary btn-sm btn-full" style="margin-top:10px" onclick="toast('Connecting to support line…')">Get Help Now</button>
    </div>
    <button class="btn btn-ghost btn-full" style="margin-top:16px" onclick="logout()">← Logout</button>
  `;
}

// ── Logout ───────────────────────────────────────────────────
function logout() {
  clearAuth();
  window.location.href = "/index.html";
}

// ── Helpers ──────────────────────────────────────────────────
function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)   return "just now";
  if (s < 3600) return Math.floor(s/60) + "m ago";
  if (s < 86400)return Math.floor(s/3600) + "h ago";
  return Math.floor(s/86400) + "d ago";
}

function escHtml(str = "") {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function loading(id, msg = "Loading…") {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--muted)">${msg}</div>`;
}

function empty(id, msg = "Nothing here yet.") {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div style="text-align:center;padding:48px;color:var(--muted);font-size:15px">${msg}</div>`;
}