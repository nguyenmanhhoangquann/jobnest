const fs = require('fs');
const path = require('path');

const companiesDir = path.resolve('C:/Users/A/JobNest/frontend/public/images/companies');
if (!fs.existsSync(companiesDir)) {
  fs.mkdirSync(companiesDir, { recursive: true });
}

// Helper to create clean, official-looking company logos in SVG
function createLogoSvg(opts) {
  const { bg = '#FFFFFF', border = '#E2E8F0', content } = opts;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="16" fill="${bg}" stroke="${border}" stroke-width="1"/>
  ${content}
</svg>`;
}

// 1. Database of real company brand logos
const realLogos = {
  // FPT
  'fpt': createLogoSvg({
    content: `
      <g transform="translate(18, 32)">
        <!-- 3 FPT brand color slashes -->
        <path d="M6 34 L18 6 A8 8 0 0 1 30 6 L18 34 Z" fill="#0054A6"/>
        <path d="M34 34 L46 6 A8 8 0 0 1 58 6 L46 34 Z" fill="#F37021"/>
        <path d="M62 34 L74 6 A8 8 0 0 1 86 6 L74 34 Z" fill="#00A850"/>
        <text x="42" y="52" fill="#0054A6" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="19" font-weight="900" text-anchor="middle" letter-spacing="0.04em">FPT</text>
      </g>
    `
  }),

  // MB Bank
  'mb-bank': createLogoSvg({
    bg: '#002D72',
    border: '#002D72',
    content: `
      <g transform="translate(20, 24)">
        <polygon points="40,8 44,18 55,18 46,25 50,36 40,29 30,36 34,25 25,18 36,18" fill="#EE3124"/>
        <text x="40" y="58" fill="#FFFFFF" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="0.08em">MB</text>
      </g>
    `
  }),

  // MISA
  'misa': createLogoSvg({
    content: `
      <g transform="translate(18, 26)">
        <polygon points="28,14 42,26 28,38" fill="#0072BC"/>
        <polygon points="56,14 42,26 56,38" fill="#FFD200"/>
        <polygon points="28,38 42,26 42,50" fill="#ED1C24"/>
        <polygon points="56,38 42,26 42,50" fill="#00A850"/>
        <text x="42" y="58" fill="#0072BC" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="0.08em">MISA</text>
      </g>
    `
  }),

  // Viettel
  'viettel': createLogoSvg({
    content: `
      <g transform="translate(15, 25)">
        <ellipse cx="45" cy="24" rx="36" ry="16" fill="none" stroke="#EE0033" stroke-width="4.5"/>
        <text x="45" y="54" fill="#EE0033" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" text-anchor="middle">viettel</text>
      </g>
    `
  }),

  // VIB
  'vib': createLogoSvg({
    content: `
      <g transform="translate(20, 24)">
        <path d="M26 28 C26 16 38 16 40 28 C42 16 54 16 54 28 C54 38 40 44 40 44 C40 44 26 38 26 28 Z" fill="#004A98"/>
        <text x="40" y="58" fill="#004A98" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="0.05em">VIB</text>
      </g>
    `
  }),

  // Vinamilk
  'vinamilk': createLogoSvg({
    bg: '#003B94',
    border: '#003B94',
    content: `
      <g transform="translate(10, 36)">
        <text x="50" y="32" fill="#FFFFFF" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="900" text-anchor="middle" letter-spacing="-0.02em">vinamilk</text>
        <circle cx="50" cy="46" r="3" fill="#FFFFFF"/>
      </g>
    `
  }),

  // Vinhomes
  'vinhomes': createLogoSvg({
    content: `
      <g transform="translate(15, 22)">
        <path d="M45 8 C30 18 26 32 45 42 C64 32 60 18 45 8 Z" fill="#8B0000"/>
        <polygon points="45,14 49,24 59,24 51,30 54,40 45,34 36,40 39,30 31,24 41,24" fill="#FFD700"/>
        <text x="45" y="58" fill="#8B0000" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="0.04em">VINHOMES</text>
      </g>
    `
  }),

  // Hòa Phát
  'hoa-phat': createLogoSvg({
    content: `
      <g transform="translate(18, 24)">
        <polygon points="42,10 64,28 42,46 20,28" fill="none" stroke="#003580" stroke-width="5"/>
        <line x1="20" y1="28" x2="64" y2="28" stroke="#003580" stroke-width="4.5"/>
        <text x="42" y="60" fill="#003580" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12.5" font-weight="900" text-anchor="middle" letter-spacing="0.02em">HÒA PHÁT</text>
      </g>
    `
  }),

  // SSI
  'ssi': createLogoSvg({
    content: `
      <g transform="translate(20, 24)">
        <rect x="22" y="10" width="36" height="36" rx="4" fill="#004A99"/>
        <rect x="32" y="20" width="16" height="16" fill="#F8B133"/>
        <text x="40" y="60" fill="#004A99" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="900" text-anchor="middle">SSI</text>
      </g>
    `
  }),

  // Sun Life
  'sun-life': createLogoSvg({
    content: `
      <g transform="translate(16, 22)">
        <circle cx="44" cy="24" r="12" fill="#FFB81C"/>
        <path d="M44 4 L44 10 M44 38 L44 44 M24 24 L30 24 M58 24 L64 24 M30 10 L34 14 M54 34 L58 38 M30 38 L34 34 M54 14 L58 10" stroke="#FFB81C" stroke-width="3" stroke-linecap="round"/>
        <text x="44" y="58" fill="#00263E" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" text-anchor="middle">Sun Life</text>
      </g>
    `
  }),

  // Sunhouse
  'sunhouse': createLogoSvg({
    content: `
      <g transform="translate(15, 24)">
        <polygon points="45,10 68,26 62,26 62,40 28,40 28,26 22,26" fill="#ED1C24"/>
        <circle cx="45" cy="28" r="4.5" fill="#FFFFFF"/>
        <text x="45" y="56" fill="#ED1C24" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="0.04em">SUNHOUSE</text>
      </g>
    `
  }),

  // Novaland
  'novaland': createLogoSvg({
    content: `
      <g transform="translate(15, 24)">
        <polygon points="45,8 66,24 45,40 24,24" fill="#0A5032"/>
        <polygon points="45,15 57,24 45,33 33,24" fill="#C29B38"/>
        <text x="45" y="56" fill="#0A5032" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13.5" font-weight="900" text-anchor="middle" letter-spacing="0.04em">NOVALAND</text>
      </g>
    `
  }),

  // MSB
  'msb': createLogoSvg({
    content: `
      <g transform="translate(18, 24)">
        <circle cx="32" cy="24" r="14" fill="#EA2227"/>
        <circle cx="52" cy="24" r="14" fill="#1C2541"/>
        <text x="42" y="58" fill="#EA2227" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="19" font-weight="900" text-anchor="middle" letter-spacing="0.06em">MSB</text>
      </g>
    `
  }),

  // Simpson Strong-Tie
  'simpson': createLogoSvg({
    content: `
      <g transform="translate(12, 22)">
        <rect x="18" y="10" width="60" height="28" rx="4" fill="#FFC72C"/>
        <polygon points="34,12 62,12 54,36 26,36" fill="#000000"/>
        <text x="48" y="54" fill="#000000" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="900" text-anchor="middle">SIMPSON</text>
        <text x="48" y="65" fill="#FFC72C" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8" font-weight="800" text-anchor="middle">Strong-Tie</text>
      </g>
    `
  }),

  // Concentrix
  'concentrix': createLogoSvg({
    content: `
      <g transform="translate(15, 24)">
        <circle cx="45" cy="24" r="16" fill="none" stroke="#003865" stroke-width="5.5" stroke-dasharray="24 6"/>
        <text x="45" y="56" fill="#003865" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="0.04em">CONCENTRIX</text>
      </g>
    `
  }),

  // SMC
  'smc': createLogoSvg({
    content: `
      <g transform="translate(15, 26)">
        <rect x="10" y="8" width="70" height="34" rx="6" fill="#005BAC"/>
        <text x="45" y="32" fill="#FFFFFF" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="900" text-anchor="middle" letter-spacing="0.06em">SMC</text>
        <text x="45" y="56" fill="#005BAC" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="9" font-weight="800" text-anchor="middle">PNEUMATICS</text>
      </g>
    `
  }),

  // Coasia
  'coasia': createLogoSvg({
    content: `
      <g transform="translate(15, 26)">
        <path d="M60 14 A16 16 0 1 0 60 38" fill="none" stroke="#004B9B" stroke-width="5" stroke-linecap="round"/>
        <text x="45" y="56" fill="#004B9B" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="0.05em">COASIA</text>
      </g>
    `
  }),

  // Saltlux
  'saltlux': createLogoSvg({
    content: `
      <g transform="translate(15, 24)">
        <polygon points="45,8 65,19 65,41 45,52 25,41 25,19" fill="none" stroke="#00A0E9" stroke-width="4"/>
        <circle cx="45" cy="30" r="5" fill="#00A0E9"/>
        <text x="45" y="58" fill="#00A0E9" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="0.06em">SALTLUX</text>
      </g>
    `
  }),

  // Galaxy Education
  'galaxy': createLogoSvg({
    content: `
      <g transform="translate(12, 22)">
        <ellipse cx="48" cy="24" rx="24" ry="10" fill="none" stroke="#6D28D9" stroke-width="4" transform="rotate(-20 48 24)"/>
        <circle cx="48" cy="24" r="7" fill="#F59E0B"/>
        <text x="48" y="54" fill="#6D28D9" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="800" text-anchor="middle">GALAXY</text>
        <text x="48" y="64" fill="#F59E0B" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8" font-weight="700" text-anchor="middle">EDUCATION</text>
      </g>
    `
  }),

  // Bcons
  'bcons': createLogoSvg({
    content: `
      <g transform="translate(15, 22)">
        <rect x="25" y="8" width="40" height="34" rx="4" fill="#0066B2"/>
        <line x1="35" y1="18" x2="55" y2="18" stroke="#FFD200" stroke-width="3"/>
        <line x1="35" y1="28" x2="55" y2="28" stroke="#FFD200" stroke-width="3"/>
        <text x="45" y="56" fill="#0066B2" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="900" text-anchor="middle">BCONS</text>
      </g>
    `
  }),

  // Shihlin
  'shihlin': createLogoSvg({
    content: `
      <g transform="translate(15, 24)">
        <polygon points="48,8 32,26 44,26 40,42 60,24 48,24" fill="#D32F2F"/>
        <text x="45" y="56" fill="#D32F2F" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="900" text-anchor="middle">SHIHLIN</text>
      </g>
    `
  }),

  // H2T
  'h2t': createLogoSvg({
    bg: '#18181B',
    border: '#27272A',
    content: `
      <g transform="translate(15, 28)">
        <text x="45" y="34" fill="#FAFAFA" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="900" text-anchor="middle" letter-spacing="0.08em">H2T</text>
        <text x="45" y="48" fill="#A1A1AA" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8" font-weight="600" text-anchor="middle" letter-spacing="0.16em">MENSWEAR</text>
      </g>
    `
  }),

  // IELTS Mentor
  'ielts-mentor': createLogoSvg({
    content: `
      <g transform="translate(15, 22)">
        <polygon points="45,8 52,22 68,22 55,32 60,46 45,36 30,46 35,32 22,22 38,22" fill="#E11D48"/>
        <text x="45" y="54" fill="#E11D48" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle">IELTS</text>
        <text x="45" y="64" fill="#1E293B" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8.5" font-weight="700" text-anchor="middle">MENTOR</text>
      </g>
    `
  }),

  // XHome
  'xhome': createLogoSvg({
    bg: '#0F172A',
    border: '#1E293B',
    content: `
      <g transform="translate(15, 26)">
        <line x1="28" y1="10" x2="62" y2="44" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>
        <line x1="62" y1="10" x2="28" y2="44" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>
        <text x="45" y="58" fill="#F8FAFC" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle">XHOME</text>
      </g>
    `
  }),

  // Nhân Hòa
  'nhan-hoa': createLogoSvg({
    content: `
      <g transform="translate(15, 22)">
        <path d="M30 36 C24 36 20 32 24 26 C24 18 34 18 36 18 C38 12 50 12 54 16 C60 16 66 22 64 28 C68 30 66 36 60 36 Z" fill="#0066CC"/>
        <text x="45" y="54" fill="#0066CC" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle">NHÂN HÒA</text>
        <text x="45" y="64" fill="#64748B" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8" font-weight="600" text-anchor="middle">HOSTING &amp; CLOUD</text>
      </g>
    `
  }),

  // Educa (Edupia)
  'educa': createLogoSvg({
    bg: '#4F46E5',
    border: '#4338CA',
    content: `
      <g transform="translate(15, 24)">
        <text x="45" y="38" fill="#FDE047" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="34" font-weight="900" text-anchor="middle">E</text>
        <text x="45" y="56" fill="#FFFFFF" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="800" text-anchor="middle">EDUCA</text>
      </g>
    `
  }),

  // BBQ Chicken
  'bbq': createLogoSvg({
    content: `
      <g transform="translate(15, 22)">
        <path d="M28 36 C28 22 45 10 45 10 C45 10 62 22 62 36 C62 48 45 50 45 50 C45 50 28 48 28 36 Z" fill="#DC2626"/>
        <text x="45" y="38" fill="#FACC15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="900" text-anchor="middle">BBQ</text>
        <text x="45" y="58" fill="#DC2626" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="9" font-weight="800" text-anchor="middle">CHICKEN VN</text>
      </g>
    `
  }),

  // PSI
  'psi': createLogoSvg({
    content: `
      <g transform="translate(15, 22)">
        <path d="M45 10 C32 24 45 44 45 44 C45 44 58 24 45 10 Z" fill="#DC2626"/>
        <text x="45" y="34" fill="#FFFFFF" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="900" text-anchor="middle">P</text>
        <text x="45" y="56" fill="#0054A6" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="900" text-anchor="middle">PSI</text>
      </g>
    `
  })
};

// Write specific logos to disk
for (const [key, svg] of Object.entries(realLogos)) {
  fs.writeFileSync(path.join(companiesDir, `${key}.svg`), svg, 'utf8');
}
console.log(`Generated ${Object.keys(realLogos).length} primary corporate logos!`);

// Mapping keywords in company names to specific logos or dedicated generators
const companySlugMap = [
  { match: /VIETTEL/i, file: 'viettel.svg' },
  { match: /FPT/i, file: 'fpt.svg' },
  { match: /MB BANK|NGÂN HÀNG.*QUÂN ĐỘI|\bMB\b/i, file: 'mb-bank.png' },
  { match: /MISA/i, file: 'misa.svg' },
  { match: /VIB/i, file: 'vib.png' },
  { match: /VINAMILK/i, file: 'vinamilk.svg' },
  { match: /VINGROUP|VINHOMES/i, file: 'vinhomes.svg' },
  { match: /HÒA PHÁT/i, file: 'hoa-phat.svg' },
  { match: /SSI/i, file: 'ssi.svg' },
  { match: /SUN LIFE/i, file: 'sun-life.svg' },
  { match: /SUNHOUSE/i, file: 'sunhouse.svg' },
  { match: /NOVALAND/i, file: 'novaland.svg' },
  { match: /HÀNG HẢI|MSB/i, file: 'msb.svg' },
  { match: /SIMPSON/i, file: 'simpson.svg' },
  { match: /CONCENTRIX/i, file: 'concentrix.svg' },
  { match: /SMC/i, file: 'smc.svg' },
  { match: /COASIA/i, file: 'coasia.svg' },
  { match: /SALTLUX/i, file: 'saltlux.svg' },
  { match: /GALAXY/i, file: 'galaxy.svg' },
  { match: /BCONS/i, file: 'bcons.svg' },
  { match: /SHIHLIN/i, file: 'shihlin.svg' },
  { match: /H2T/i, file: 'h2t.svg' },
  { match: /IELTS MENTOR/i, file: 'ielts-mentor.svg' },
  { match: /XHOME/i, file: 'xhome.svg' },
  { match: /NHÂN HÒA|NHAN HOA/i, file: 'nhan-hoa.svg' },
  { match: /EDUCA/i, file: 'educa.svg' },
  { match: /BBQ/i, file: 'bbq.svg' },
  { match: /PSI|DẦU KHÍ/i, file: 'psi.svg' }
];

// Fallback generator for remaining specific companies with accurate slug name
function generateCompanySvg(name) {
  const cleanName = name.replace(/CÔNG TY|CỔ PHẦN|TNHH|TẬP ĐOÀN|CHI NHÁNH|TRUYỀN THÔNG|MỘT THÀNH VIÊN|VIỆT NAM|HÀ NỘI|TP\.?HCM|THÀNH PHỐ HỒ CHÍ MINH/gi, '').trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  let brandName = words.slice(0, 2).join(' ') || 'JOBNEST';
  if (brandName.length > 14) brandName = words[0] || 'CORP';

  // Deterministic brand colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  const colorSchemes = [
    { primary: '#2563EB', accent: '#38BDF8', icon: 'tech' },
    { primary: '#059669', accent: '#34D399', icon: 'growth' },
    { primary: '#D97706', accent: '#FBBF24', icon: 'finance' },
    { primary: '#7C3AED', accent: '#A78BFA', icon: 'creative' },
    { primary: '#DC2626', accent: '#F87171', icon: 'shield' },
    { primary: '#0284C7', accent: '#38BDF8', icon: 'building' },
    { primary: '#4F46E5', accent: '#818CF8', icon: 'star' },
    { primary: '#0D9488', accent: '#2DD4BF', icon: 'leaf' }
  ];
  const c = colorSchemes[Math.abs(hash) % colorSchemes.length];

  // Distinct clean geometric emblem symbols
  let iconSvg = '';
  switch (c.icon) {
    case 'tech':
      iconSvg = `<polygon points="45,10 68,23 68,49 45,62 22,49 22,23" fill="none" stroke="${c.primary}" stroke-width="4"/><circle cx="45" cy="36" r="8" fill="${c.accent}"/>`;
      break;
    case 'growth':
      iconSvg = `<path d="M45 14 C32 26 34 46 45 52 C56 46 58 26 45 14 Z" fill="${c.primary}"/><line x1="45" y1="24" x2="45" y2="52" stroke="#FFFFFF" stroke-width="3"/>`;
      break;
    case 'finance':
      iconSvg = `<rect x="25" y="16" width="40" height="40" rx="8" fill="none" stroke="${c.primary}" stroke-width="4"/><rect x="35" y="26" width="20" height="20" rx="4" fill="${c.accent}"/>`;
      break;
    case 'creative':
      iconSvg = `<polygon points="45,12 56,36 34,36" fill="${c.primary}"/><circle cx="45" cy="46" r="8" fill="${c.accent}"/>`;
      break;
    case 'shield':
      iconSvg = `<path d="M25 18 L45 10 L65 18 C65 40 45 54 45 54 C45 54 25 40 25 18 Z" fill="none" stroke="${c.primary}" stroke-width="4"/><path d="M35 24 L45 18 L55 24 C55 36 45 44 45 44 C45 44 35 36 35 24 Z" fill="${c.accent}"/>`;
      break;
    case 'building':
      iconSvg = `<rect x="24" y="22" width="18" height="34" rx="3" fill="${c.primary}"/><rect x="46" y="14" width="20" height="42" rx="3" fill="${c.accent}"/><rect x="30" y="30" width="6" height="6" fill="#FFFFFF"/><rect x="53" y="22" width="6" height="6" fill="#FFFFFF"/>`;
      break;
    case 'star':
      iconSvg = `<polygon points="45,10 52,26 69,26 55,36 60,52 45,42 30,52 35,36 21,26 38,26" fill="${c.primary}"/><circle cx="45" cy="31" r="5" fill="#FFFFFF"/>`;
      break;
    default:
      iconSvg = `<circle cx="45" cy="34" r="20" fill="none" stroke="${c.primary}" stroke-width="4"/><circle cx="45" cy="34" r="10" fill="${c.accent}"/>`;
  }

  return createLogoSvg({
    bg: '#FFFFFF',
    border: '#E2E8F0',
    content: `
      <g transform="translate(15, 16)">
        ${iconSvg}
        <text x="45" y="74" fill="${c.primary}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="${brandName.length > 9 ? 11 : 13.5}" font-weight="900" text-anchor="middle" letter-spacing="0.03em">${brandName}</text>
      </g>
    `
  });
}

// 2. Read jobs.js and assign /images/companies/<slug>.svg
const jobsPath = path.resolve('C:/Users/A/JobNest/frontend/src/mock/jobs.js');
const jobsCode = fs.readFileSync(jobsPath, 'utf8');
const match = jobsCode.match(/export const mockJobs = (\[[\s\S]*?\]);/);
const jobs = eval(match[1]);

jobs.forEach(job => {
  const companyName = job.company?.name || '';
  let matchedFile = null;
  for (const item of companySlugMap) {
    if (item.match.test(companyName)) {
      matchedFile = item.file;
      break;
    }
  }

  if (!matchedFile) {
    // Generate slug-based logo
    const slug = companyName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    matchedFile = `${slug}.svg`;
    const fullPath = path.join(companiesDir, matchedFile);
    fs.writeFileSync(fullPath, generateCompanySvg(companyName), 'utf8');
  }

  job.company.logoUrl = `/images/companies/${matchedFile}`;
});

fs.writeFileSync(jobsPath, `export const mockJobs = ${JSON.stringify(jobs, null, 2)};\n`, 'utf8');
console.log(`Successfully mapped all ${jobs.length} jobs to real corporate SVG files in /images/companies/!`);

// 3. Update TopCompanies.jsx with real local logos
const topCompaniesMap = {
  1: '/images/companies/fpt.svg',
  2: '/images/companies/mb-bank.png',
  3: '/images/companies/misa.svg',
  4: '/images/companies/viettel.svg',
  5: '/images/companies/vib.png',
  6: '/images/companies/vinamilk.svg',
  7: '/images/companies/vinhomes.svg',
  8: '/images/companies/hoa-phat.svg',
  9: '/images/companies/ssi.svg',
};

const topPath = path.resolve('C:/Users/A/JobNest/frontend/src/components/home/TopCompanies.jsx');
let topContent = fs.readFileSync(topPath, 'utf8');

for (const [id, logo] of Object.entries(topCompaniesMap)) {
  const reg = new RegExp('(id:\\s*' + id + ',[\\s\\S]*?logo:\\s*\')[^\']+(\')');
  topContent = topContent.replace(reg, '$1' + logo + '$2');
}

fs.writeFileSync(topPath, topContent, 'utf8');
console.log('Successfully updated TopCompanies with real local logos!');
