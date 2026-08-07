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
  whatsapp: '<path d="M17.6 6.3A8.9 8.9 0 0 0 4.1 17L3 21l4.1-1.1A8.9 8.9 0 1 0 17.6 6.3Z"/><path d="M8.5 9.3c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.4.2.5.6 1.6.7 1.7.1.1.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.4 1 1.5 2 2.3 1.1.9 1.9 1.1 2.2 1.3.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.2.5.2.6.4.1.2.1 1-.3 1.5-.4.6-1.8 1.1-2.5 1.1-.7 0-1.5 0-4.3-1.6-3.3-2-5.1-5.5-5.3-5.7-.1-.2-1.2-1.6-1.2-3.1 0-1.5.8-2.2 1.1-2.5Z" fill="currentColor" stroke="none"/>',
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
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.2"/><path d="M20 5v6h-6"/>'
};

function icon(name, opts) {
  opts = opts || {};
  const size = opts.size || 20;
  const cls = opts.class ? " " + opts.class : "";
  const path = ICON_PATHS[name];
  if (!path) return "";
  return '<svg class="icon-svg' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
}
