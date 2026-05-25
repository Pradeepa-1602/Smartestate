/* =========================================================
   EstateElite — Shared Utilities (utils.js)

/* ── Auth helpers ── */
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : `${window.location.origin}/api`;

const Auth = {
  save(data) { localStorage.setItem('ee_user', JSON.stringify(data)); },
  get()      { try { return JSON.parse(localStorage.getItem('ee_user')); } catch { return null; } },
  clear()    { localStorage.removeItem('ee_user'); },
  check()    {
    const u = this.get();
    if (!u) { window.location.href = '../index.html'; return null; }
    return u;
  },
  checkRole(role) {
    const u = this.get();
    if (!u) { window.location.href = '../index.html'; return null; }
    if (u.role !== role) {
      window.location.href = u.role === 'owner' ? 'owner-dashboard.html' : 'buyer-dashboard.html';
      return null;
    }
    return u;
  }
};

/* ── Wishlist helpers (localStorage) ── */
const Wishlist = {
  get()        { try { return JSON.parse(localStorage.getItem('ee_wishlist')) || []; } catch { return []; } },
  save(list)   { localStorage.setItem('ee_wishlist', JSON.stringify(list)); },
  add(prop)    { const l = this.get(); if (!l.find(x => x.property_id === prop.property_id)) { l.push(prop); this.save(l); } },
  remove(id)   { this.save(this.get().filter(x => x.property_id !== id)); },
  has(id)      { return !!this.get().find(x => x.property_id === id); },
  count()      { return this.get().length; }
};

/* ── API fetch ── */
async function apiFetch(path, options = {}) {
  const user = Auth.get();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
  try {
    const res = await fetch(API_BASE + path, { ...options, headers });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { message: 'Network error — is backend running?' } };
  }
}

/* ── Toast ── */
function showToast(msg, type = 'success') {
  document.querySelectorAll('.toast-custom').forEach(t => t.remove());
  const icon = type === 'success'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const toast = document.createElement('div');
  toast.className = `toast-custom ${type}`;
  toast.innerHTML = `${icon}<span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '0', 2800);
  setTimeout(() => toast.remove(), 3200);
}

/* ── SVG Icon generator ── */
const ICONS = {
  home:     `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>`,
  building: `<path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,
  search:   `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
  heart:    `<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>`,
  plus:     `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  logout:   `<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
  map:      `<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>`,
  phone:    `<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>`,
  trash:    `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>`,
  edit:     `<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  grid:     `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
  send:     `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
  filter:   `<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>`,
  star:     `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  check:    `<polyline points="20 6 9 17 4 12"/>`,
  x:        `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  user:     `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
};

function icon(name, size = 18, color = 'currentColor') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}

/* ── Sidebar builder ── */
function buildSidebar(user, activePage) {
  const isOwner = user.role === 'owner';
  const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const wishCount = Wishlist.count();
  const enqCount = parseInt(localStorage.getItem('ee_owner_enquiries') || '0');

  const ownerNav = [
    { id: 'owner-dashboard', label: 'Dashboard',     ico: 'grid',     href: 'owner-dashboard.html' },
    { id: 'my-properties',   label: 'My Properties', ico: 'building', href: 'my-properties.html' },
    { id: 'add-property',    label: 'Add Property',  ico: 'plus',     href: 'add-property.html' },
    { id: 'contacts',        label: 'Contacts',      ico: 'phone',    href: 'contacts.html' },
    { id: 'enquiries', label: 'Enquiries', ico: 'send', href: 'owner-enquiries.html', badge: 'enq' },
  ];
  const buyerNav = [
    { id: 'buyer-dashboard', label: 'Dashboard',   ico: 'grid',    href: 'buyer-dashboard.html' },
    { id: 'browse',          label: 'Browse',      ico: 'home',    href: 'browse.html' },
    { id: 'wishlist',        label: 'Wishlist',    ico: 'heart',   href: 'wishlist.html', badge: wishCount || null },
    { id: 'my-requests',     label: 'My Requests', ico: 'send',    href: 'my-requests.html' },
  ];
  const navItems = (isOwner ? ownerNav : buyerNav).map(n => `
    <a class="nav-item ${activePage === n.id ? 'active' : ''}" href="${n.href}">
      ${icon(n.ico, 15)}
      <span>${n.label}</span>
      ${n.badge === 'enq' && enqCount > 0 
  ? `<span class="nav-badge">${enqCount}</span>` 
  : n.badge 
    ? `<span class="nav-badge">${n.badge}</span>` 
    : ''
}
    </a>`).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="brand">EstateElite
          <span class="brand-sub">${isOwner ? 'Owner Portal' : 'Buyer Portal'}</span>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-label">Navigation</div>
        ${navItems}
      </div>
      <div class="sidebar-bottom">
        <div class="user-chip">
          <div class="avatar">${initials}</div>
          <div>
            <div class="user-name">${user.name || 'User'}</div>
            <div class="user-role">${user.role}</div>
          </div>
        </div>
        <button class="nav-item mt-2" id="logoutBtn">
          ${icon('logout', 15)} Logout
        </button>
      </div>
    </aside>
  `;
}

function initSidebar(user, activePage) {
  const wrap = document.getElementById('sidebarWrap');
  if (wrap) {
    wrap.innerHTML = buildSidebar(user, activePage);
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      Auth.clear(); window.location.href = '../index.html';
    });
  }
}

/* ── Property card builder ── */
function buildPropCard(prop, opts = {}) {
  const { showWish = false, showDelete = false, showEnquire = false, animDelay = 0 } = opts;
  const wished = Wishlist.has(prop.property_id);
  const price = Number(prop.price).toLocaleString('en-IN');
  const desc = (prop.description || '').slice(0, 85) + (prop.description?.length > 85 ? '…' : '');

  return `
    <div class="prop-card" style="animation-delay:${animDelay * 80}ms">
      <div class="prop-img">
  ${prop.image 
    ? `<img src="${API_BASE.replace('/api','')}/
    /${prop.image}" style="width:100%;height:100%;object-fit:cover;">`
    : icon('building', 52)
  }
        ${icon('building', 52, 'rgba(201,168,76,0.35)')}
        <span class="prop-type-badge">${prop.property_type}</span>
        <div class="prop-price-chip">₹${price}</div>
        ${showWish ? `<button class="wish-btn ${wished ? 'active' : ''}" data-id="${prop.property_id}" onclick="toggleWish(${prop.property_id},this,${JSON.stringify(prop).replace(/"/g,'&quot;')})">
          ${icon('heart', 15, wished ? '#E74C6C' : 'var(--stone)')}
        </button>` : ''}
      </div>
      <div class="prop-body">
        <div class="prop-title">${prop.title}</div>
        <div class="prop-loc">${icon('map', 12, 'var(--stone)')} ${prop.location}</div>
        ${desc ? `<div class="prop-desc">${desc}</div>` : ''}
        <div class="prop-footer">
          <span class="tag tag-gold">${prop.property_type === 'SALE' ? 'For Sale' : 'For Rent'}</span>
          <div class="d-flex gap-2">
            ${showDelete ? `<button class="btn-sm-danger" onclick="deleteProp(${prop.property_id})">${icon('trash', 13)}</button>` : ''}
            ${showEnquire ? `<button class="btn-outline-gold btn" onclick="openEnquiry(${JSON.stringify(prop).replace(/"/g,'&quot;')})" style="padding:.35rem .9rem;font-size:.8rem;">${icon('phone', 13)} Enquire</button>` : ''}
          </div>
        </div>
      </div>
    </div>`;
}

/* ── Wishlist toggle (used on browse page) ── */
function toggleWish(id, btn, prop) {
  if (Wishlist.has(id)) {
    Wishlist.remove(id);
    btn.classList.remove('active');
    btn.innerHTML = icon('heart', 15, 'var(--stone)');
    showToast('Removed from wishlist');
  } else {
    Wishlist.add(prop);
    btn.classList.add('active');
    btn.innerHTML = icon('heart', 15, '#E74C6C');
    showToast('Saved to wishlist!');
  }
}

/* ── Format price ── */
function fmtPrice(p) { return '₹' + Number(p).toLocaleString('en-IN'); }
