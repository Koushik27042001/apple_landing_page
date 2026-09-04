/* ============================================================
   Icon Library — lightweight inline SVG line icons (Apple-like,
   SF Symbols inspired). No external icon fonts / network calls.
   Usage: icon("cart", { size: 20, class: "my-class" })
   ============================================================ */

const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bag: '<path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
  chevronRight: '<path d="M9 6l6 6-6 6"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  whatsapp: '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  truck: '<rect x="2" y="7" width="12" height="10" rx="1.2"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="1.7"/><circle cx="17.5" cy="19" r="1.7"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8.3 12.3l2.4 2.4 5-5.2"/>',
  undo: '<path d="M4 9h9a5.5 5.5 0 0 1 0 11H9"/><path d="M8 5L4 9l4 4"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.6-4.4 4 1.2 5.9L12 16.6l-5.3 2.8 1.2-5.9-4.4-4 5.9-.6L12 3.5Z" fill="currentColor" stroke="none"/>',
  starOutline: '<path d="M12 3.5l2.6 5.4 5.9.6-4.4 4 1.2 5.9L12 16.6l-5.3 2.8 1.2-5.9-4.4-4 5.9-.6L12 3.5Z"/>',
  card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 9.8h19"/><path d="M6 14.5h4"/>',
  bank: '<path d="M3 10.5L12 4l9 6.5"/><path d="M5 10.5V19"/><path d="M9.5 10.5V19"/><path d="M14.5 10.5V19"/><path d="M19 10.5V19"/><path d="M3 19.5h18"/>',
  cash: '<rect x="2.5" y="6.5" width="19" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M5.5 9v0M18.5 15v0"/>',
  upi: '<path d="M6 4.5v15M6 4.5l9 7.5-9 7.5"/><path d="M13 4.5l5 7.5-5 7.5"/>',
  pin: '<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  phone: '<path d="M6.5 3.5h4l1.3 4.6-2.4 2A13 13 0 0 0 14.9 15l2-2.4 4.6 1.3v4a2 2 0 0 1-2.1 2c-6.9-.5-12.6-6.2-13.1-13.1a2 2 0 0 1 2-2.3Z"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6.5 9-6.5"/>',
  play: '<circle cx="12" cy="12" r="9.3"/><path d="M10 8.5l6 3.5-6 3.5V8.5Z" fill="currentColor" stroke="none"/>',
  camera: '<rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 7l1.6-2.5h4.8L16 7"/><circle cx="12" cy="13.5" r="3.7"/>',
  rotate: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/>',
  compare: '<path d="M8 4v16"/><path d="M16 4v16"/><path d="M4 9h4M4 15h4"/><path d="M16 9h4M16 15h4"/>',
  idCard: '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5.5 15.8c.5-1.6 1.9-2.3 2.5-2.3s2 .7 2.5 2.3"/><path d="M14 9.5h4M14 12.5h4M14 15.5h2.5"/>',
  shieldCheck: '<path d="M12 3l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V6l7-3Z"/><path d="M9 12.2l2 2 4-4.4"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4.8c0-.4.4-.8.9-.8h4.2c.5 0 .9.4.9.8V7"/><path d="M6.5 7l.7 12.2c0 .9.8 1.6 1.7 1.6h6.2c.9 0 1.7-.7 1.7-1.6L17.5 7"/><path d="M10 11v6M14 11v6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r="0.2" fill="currentColor" stroke="currentColor"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />',
  award: '<circle cx="12" cy="9" r="5.5"/><path d="M9 13.5L7 21l5-2.5L17 21l-2-7.5"/>',
  arrowUpRight: '<path d="M7 17L17 7"/><path d="M9 7h8v8"/>',
  gauge: '<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l3.5-4.5"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/>',
  boltShield: '<path d="M12 3l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V6l7-3Z"/><path d="M13 8l-3.3 4.6H12l-1 3.9 3.3-4.7H12l1-3.8Z" fill="currentColor" stroke="none"/>',
  upload: '<path d="M12 15V4"/><path d="M7 8.5L12 4l5 4.5"/><path d="M4 15v3.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V15"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.2"/><path d="M20 5v6h-6"/>',
  store: '<path d="M3.5 9.5l1-5h15l1 5"/><path d="M4 9.5V20h16V9.5"/><path d="M9.5 20v-6h5v6"/><path d="M3.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/>',
  bagShopping: '<path d="M6 8h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9.5 11.5v2M14.5 11.5v2"/>',
  musicNote: '<path d="M9 18V5.5l10-2v12.5"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
  gameController: '<rect x="2.5" y="8" width="19" height="10" rx="5"/><path d="M7 11v4M5 13h4"/><circle cx="15.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="14.5" r="1" fill="currentColor" stroke="none"/>',
  newspaper: '<rect x="2.5" y="5" width="14" height="15" rx="1.5"/><path d="M16.5 8.5H20a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H6"/><path d="M5.5 8.5h8M5.5 11.5h8M5.5 14.5h5"/>',
  heartPulse: '<path d="M12 20.5s-7.5-4.6-9.5-9.4C1.2 7.6 3.4 4.5 6.7 4.5c1.9 0 3.4 1 4.3 2.3.9-1.3 2.4-2.3 4.3-2.3 3.3 0 5.5 3.1 4.2 6.6-2 4.8-9.5 9.4-9.5 9.4Z"/><path d="M6.5 12h2.5l1.5-3 2 6 1.5-3H16"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.2"/><path d="M10 3.5v3.5M14 3.5v3.5M10 17v3.5M14 17v3.5M3.5 10h3.5M3.5 14h3.5M17 10h3.5M17 14h3.5"/><path d="M10 10h4v4h-4z"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="0.8"/><path d="M9 3.5v2.5M12 3.5v2.5M15 3.5v2.5M9 18v2.5M12 18v2.5M15 18v2.5M3.5 9h2.5M3.5 12h2.5M3.5 15h2.5M18 9h2.5M18 12h2.5M18 15h2.5"/>',
  layers: '<path d="M12 3.5L3.5 8 12 12.5 20.5 8 12 3.5Z"/><path d="M3.5 12L12 16.5 20.5 12"/><path d="M3.5 16L12 20.5 20.5 16"/>',
  gift: '<rect x="3.5" y="10" width="17" height="11" rx="1.5"/><path d="M3.5 14h17M12 10v11"/><path d="M12 10c-2.5-4-5.5-4-5.5-2S8.5 10 12 10c2.5-4 5.5-4 5.5-2S15.5 10 12 10Z"/>',
  handshake: '<path d="M8 12.5l2.2-2.2a2 2 0 0 1 2.8 0l.7.7"/><path d="M16 11.5l-1.5 1.5a2.5 2.5 0 0 1-3.5 0l-.5-.5"/><path d="M4.5 13.5l2.8-2.8a2 2 0 0 1 2.8 0L12 12.5"/><path d="M19.5 13l-2.5-2.5a2 2 0 0 0-2.8 0"/><path d="M7 16.5c1.2 1.5 3 2.2 5 2.2s3.8-.7 5-2.2"/>',
  users: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 18.5c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5"/><path d="M14 14c2.2.2 3.8 1.4 4.5 4.5"/>'
};

const ICON_FILLED = {
  whatsapp: true,
  star: true
};

function icon(name, opts) {
  opts = opts || {};
  const size = opts.size || 20;
  const cls = opts.class ? " " + opts.class : "";
  const path = ICON_PATHS[name];
  if (!path) return "";
  const filled = !!ICON_FILLED[name] || !!opts.filled;
  const attrs = filled
    ? 'fill="currentColor" stroke="none"'
    : 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  return '<svg class="icon-svg icon-' + name + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" ' + attrs + ' aria-hidden="true">' + path + '</svg>';
}
