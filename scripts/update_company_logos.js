const fs = require('fs');
const path = require('path');

function makeLogo(bg, fg, symbolSvg, text, subtext) {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">',
    '  <defs>',
    '    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">',
    '      <stop offset="0%" stop-color="' + bg[0] + '"/>',
    '      <stop offset="100%" stop-color="' + (bg[1] || bg[0]) + '"/>',
    '    </linearGradient>',
    '  </defs>',
    '  <rect width="120" height="120" rx="22" fill="url(#g)"/>',
    '  <g fill="' + fg + '" stroke="' + fg + '">',
    '    ' + symbolSvg,
    '  </g>',
    text ? '  <text x="60" y="' + (subtext ? 84 : 90) + '" fill="' + fg + '" font-family="system-ui, -apple-system, sans-serif" font-size="' + (text.length > 7 ? 11 : text.length > 5 ? 13 : 16) + '" font-weight="800" text-anchor="middle" letter-spacing="0.04em">' + text + '</text>' : '',
    subtext ? '  <text x="60" y="99" fill="' + fg + '" opacity="0.82" font-family="system-ui, -apple-system, sans-serif" font-size="7.5" font-weight="700" text-anchor="middle" letter-spacing="0.08em">' + subtext + '</text>' : '',
    '</svg>'
  ].join('');
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Map each company name to a custom branded logo
const companyLogos = {
  // 1. K&M Holdings
  'CÔNG TY CỔ PHẦN K&M HOLDINGS': makeLogo(
    ['#1E293B', '#0F172A'], '#FBBF24',
    '<path d="M60 20 L76 36 L68 56 L52 56 L44 36 Z" fill="none" stroke-width="4"/><circle cx="60" cy="40" r="5"/>',
    'K&M', 'HOLDINGS'
  ),

  // 2. Thiên Hy Long Telecom
  'CHI NHÁNH CÔNG TY CỔ PHẦN CÔNG NGHỆ THÔNG TIN TRUYỀN THÔNG THIÊN HY LONG VIỆT NAM': makeLogo(
    ['#0284C7', '#0369A1'], '#FFFFFF',
    '<circle cx="60" cy="42" r="6"/><path d="M44 42 A16 16 0 0 1 76 42 M36 42 A24 24 0 0 1 84 42" fill="none" stroke-width="3.5" stroke-linecap="round"/>',
    'THL', 'TELECOM'
  ),

  // 3. An Việt
  'CÔNG TY CP SẢN XUẤT VÀ THƯƠNG MẠI AN VIỆT': makeLogo(
    ['#059669', '#047857'], '#FFFFFF',
    '<path d="M60 22 C48 34 50 54 60 58 C70 54 72 34 60 22 Z M60 30 L60 56" fill="none" stroke-width="3.5"/>',
    'AN VIỆT', 'AGRI FOOD'
  ),

  // 4. VINADIC - AMACCAO
  'CÔNG TY CỔ PHẦN PHÁT TRIỂN ĐẦU TƯ XÂY DỰNG VIỆT NAM (VINADIC- THUỘC TẬP ĐOÀN AMACCAO)': makeLogo(
    ['#DC2626', '#991B1B'], '#FFFFFF',
    '<polygon points="60,20 78,54 42,54" fill="none" stroke-width="4"/><line x1="60" y1="36" x2="60" y2="54" stroke-width="3"/>',
    'VINADIC', 'AMACCAO'
  ),

  // 5. HP Pro Entertainment
  'CÔNG TY TNHH HP PRO ENTERTAINMENT': makeLogo(
    ['#7C3AED', '#5B21B6'], '#FDE047',
    '<polygon points="60,24 64,36 76,36 66,44 70,56 60,48 50,56 54,44 44,36 56,36" stroke-width="2"/>',
    'HP PRO', 'ENTERTAINMENT'
  ),

  // 6. Concentrix
  'CÔNG TY TNHH VIETNAM CONCENTRIX SERVICES': makeLogo(
    ['#0F172A', '#1E1B4B'], '#38BDF8',
    '<circle cx="60" cy="42" r="18" fill="none" stroke-width="5" stroke-dasharray="28 8"/>',
    'CONCENTRIX', 'GLOBAL BPO'
  ),

  // 7. AusSmile
  'CÔNG TY TNHH AUSSMILE': makeLogo(
    ['#0D9488', '#0F766E'], '#FFFFFF',
    '<path d="M42 38 Q60 58 78 38" fill="none" stroke-width="4.5" stroke-linecap="round"/><circle cx="44" cy="32" r="3.5"/><circle cx="76" cy="32" r="3.5"/>',
    'AusSmile', 'DENTAL CARE'
  ),

  // 8. Babylon Xanh
  'CÔNG TY CỔ PHẦN KIẾN TRÚC - XÂY DỰNG XANH BABYLON': makeLogo(
    ['#15803D', '#166534'], '#FEF08A',
    '<path d="M46 54 L60 26 L74 54 Z M52 54 L60 38 L68 54" fill="none" stroke-width="3.5"/>',
    'BABYLON', 'GREEN ARCH'
  ),

  // 9. Việt Tín
  'CÔNG TY TNHH TƯ VẤN THUÊ, KẾ TOÁN & KIỂM TOÁN VIỆT TÍN': makeLogo(
    ['#1D4ED8', '#1E40AF'], '#FFFFFF',
    '<rect x="44" y="24" width="32" height="32" rx="6" fill="none" stroke-width="3.5"/><path d="M52 40 L58 46 L68 34" fill="none" stroke-width="3.5" stroke-linecap="round"/>',
    'VIỆT TÍN', 'AUDIT & TAX'
  ),

  // 10. Simpson Strong-Tie
  'CÔNG TY TNHH SIMPSON STRONG-TIE VIỆT NAM': makeLogo(
    ['#EAB308', '#CA8A04'], '#18181B',
    '<polygon points="46,26 74,26 66,54 54,54" stroke-width="2"/>',
    'SIMPSON', 'Strong-Tie'
  ),

  // 11. Dialectica
  'CÔNG TY TNHH DIALECTICA VIETNAM': makeLogo(
    ['#1E293B', '#334155'], '#38BDF8',
    '<circle cx="50" cy="40" r="10" fill="none" stroke-width="3.5"/><circle cx="70" cy="40" r="10" fill="none" stroke-width="3.5"/>',
    'DIALECTICA', 'EXPERTS'
  ),

  // 12. Bcons
  'CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN BCONS PS': makeLogo(
    ['#2563EB', '#1D4ED8'], '#FDE047',
    '<rect x="48" y="24" width="24" height="32" rx="4" fill="none" stroke-width="3.5"/><line x1="56" y1="32" x2="64" y2="32" stroke-width="2.5"/><line x1="56" y1="42" x2="64" y2="42" stroke-width="2.5"/>',
    'BCONS', 'PROPERTY'
  ),

  // 13. ATB Global
  'CÔNG TY TNHH ATB GLOBAL': makeLogo(
    ['#EA580C', '#C2410C'], '#FFFFFF',
    '<circle cx="60" cy="40" r="16" fill="none" stroke-width="3.5"/><ellipse cx="60" cy="40" rx="7" ry="16" fill="none" stroke-width="3"/>',
    'ATB', 'GLOBAL LOGISTICS'
  ),

  // 14. Shihlin Electric
  'CÔNG TY TNHH THIẾT BỊ ĐIỆN SHIHLIN VIỆT NAM': makeLogo(
    ['#B91C1C', '#991B1B'], '#FFFFFF',
    '<polygon points="62,22 46,40 58,40 54,56 74,38 62,38" stroke-width="1.5"/>',
    'SHIHLIN', 'ELECTRIC'
  ),

  // 15. H2T
  'CÔNG TY CỔ PHẦN THƯƠNG MẠI H2T HÀ NỘI': makeLogo(
    ['#18181B', '#27272A'], '#FAFAFA',
    '<rect x="42" y="26" width="36" height="30" rx="4" fill="none" stroke-width="3.5"/><path d="M52 26 C52 20 68 20 68 26" fill="none" stroke-width="3"/>',
    'H2T', 'MENSWEAR'
  ),

  // 16. Bảo Tín
  'CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY DỰNG VÀ THƯƠNG MẠI BẢO TÍN': makeLogo(
    ['#D97706', '#B45309'], '#FFFFFF',
    '<polygon points="60,22 76,34 76,54 44,54 44,34" fill="none" stroke-width="3.5"/>',
    'BẢO TÍN', 'BUILDING'
  ),

  // 17. Tín Phát
  'CÔNG TY CỔ PHẦN HỢP TÁC ĐẦU TƯ GIÁO DỤC QUỐC TẾ TÍN PHÁT': makeLogo(
    ['#1E3A8A', '#1E40AF'], '#FEF08A',
    '<polygon points="60,26 80,36 60,46 40,36" fill="none" stroke-width="3.5"/><path d="M74 40 L74 52 Q60 60 46 52 L46 40" fill="none" stroke-width="3"/>',
    'TÍN PHÁT', 'EDUCATION'
  ),

  // 18. IDECO
  'CÔNG TY TNHH TM DV KẾT GIAO PHÁT TRIỂN QUỐC TẾ ( IDECO)': makeLogo(
    ['#0284C7', '#075985'], '#FFFFFF',
    '<path d="M46 54 L60 24 L74 54 Z" fill="none" stroke-width="3.5"/><line x1="46" y1="46" x2="74" y2="46" stroke-width="3"/>',
    'IDECO', 'INTERNATIONAL'
  ),

  // 19. Ha Le
  'CÔNG TY TNHH MỘT THÀNH VIÊN HA LE': makeLogo(
    ['#BE185D', '#9D174D'], '#FDF2F8',
    '<circle cx="60" cy="40" r="15" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="16" font-weight="800" text-anchor="middle">HL</text>',
    'HA LE', 'TRADING'
  ),

  // 20. MaxReal
  'CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN MAXREAL': makeLogo(
    ['#0F766E', '#115E59'], '#FFFFFF',
    '<path d="M42 54 L42 30 L54 42 L66 30 L66 54 M66 54 L78 30 L78 54" fill="none" stroke-width="3.5" stroke-linecap="round"/>',
    'MAXREAL', 'LAND'
  ),

  // 21. Kiến Hưng
  'CÔNG TY CỔ PHẦN DỊCH VỤ VÀ ĐỊA ỐC KIẾN HƯNG': makeLogo(
    ['#C2410C', '#9A3412'], '#FFFFFF',
    '<path d="M42 42 L60 24 L78 42 L78 54 L42 54 Z" fill="none" stroke-width="3.5"/><rect x="54" y="42" width="12" height="12" fill="none" stroke-width="2.5"/>',
    'KIẾN HƯNG', 'REAL ESTATE'
  ),

  // 22. Tây Viên
  'CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI TÂY VIÊN HÀ NỘI': makeLogo(
    ['#166534', '#14532D'], '#FDE047',
    '<circle cx="60" cy="40" r="16" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="16" font-weight="900" text-anchor="middle">TV</text>',
    'TÂY VIÊN', 'INVEST'
  ),

  // 23. BBQ Việt Nam
  'CÔNG TY TNHH BBQ VIỆT NAM': makeLogo(
    ['#DC2626', '#991B1B'], '#FACC15',
    '<path d="M42 48 C42 36 60 22 60 22 C60 22 78 36 78 48 C78 58 60 60 60 60 C60 60 42 58 42 48 Z" stroke-width="2"/>',
    'BBQ', 'CHICKEN VN'
  ),

  // 24. Sun Life
  'CÔNG TY TNHH BẢO HIỂM NHÂN THỌ SUN LIFE VIỆT NAM': makeLogo(
    ['#EAB308', '#CA8A04'], '#18181B',
    '<circle cx="60" cy="40" r="10"/><path d="M60 22 L60 28 M60 52 L60 58 M42 40 L48 40 M72 40 L78 40 M47 27 L51 31 M69 49 L73 53 M47 53 L51 49 M69 31 L73 27" stroke-width="3.5" stroke-linecap="round"/>',
    'SUN LIFE', 'INSURANCE'
  ),

  // 25. BIA Technical
  'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ KỸ THUẬT BIA': makeLogo(
    ['#1D4ED8', '#1E40AF'], '#FFFFFF',
    '<circle cx="60" cy="40" r="14" fill="none" stroke-width="4"/><circle cx="60" cy="40" r="6"/>',
    'BIA TECH', 'ENGINEERING'
  ),

  // 26. IELTS Mentor
  'CÔNG TY TNHH GIÁO DỤC IELTS MENTOR': makeLogo(
    ['#E11D48', '#BE123C'], '#FFFFFF',
    '<polygon points="60,22 66,36 80,36 68,46 72,60 60,50 48,60 52,46 40,36 54,36"/>',
    'IELTS', 'MENTOR'
  ),

  // 27. Novaland
  'NOVALAND GROUP CORP': makeLogo(
    ['#065F46', '#064E3B'], '#FBBF24',
    '<polygon points="60,20 80,38 60,56 40,38" fill="none" stroke-width="4"/><polygon points="60,28 72,38 60,48 48,38"/>',
    'NOVALAND', 'GROUP'
  ),

  // 28. Bao Lành
  'HỘ KINH DOANH BAO LÀNH': makeLogo(
    ['#4F46E5', '#4338CA'], '#FFFFFF',
    '<path d="M60 54 C40 40 40 28 50 24 C56 22 60 28 60 28 C60 28 64 22 70 24 C80 28 80 40 60 54 Z" fill="none" stroke-width="3.5"/>',
    'BAO LÀNH', 'MART'
  ),

  // 29. Ý Cường Thịnh
  'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ Ý CƯỜNG THỊNH': makeLogo(
    ['#0369A1', '#075985'], '#FFFFFF',
    '<rect x="44" y="24" width="32" height="32" rx="6" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="16" font-weight="800" text-anchor="middle">YCT</text>',
    'Ý CƯỜNG THỊNH', 'INOX KITCHEN'
  ),

  // 30. ADI Automation
  'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ TỰ ĐỘNG HÓA ADI': makeLogo(
    ['#0F172A', '#1E293B'], '#38BDF8',
    '<rect x="42" y="26" width="36" height="28" rx="6" fill="none" stroke-width="3.5"/><circle cx="52" cy="40" r="3"/><circle cx="68" cy="40" r="3"/><line x1="60" y1="20" x2="60" y2="26" stroke-width="3"/>',
    'ADI', 'AUTOMATION'
  ),

  // 31. Sunhouse
  'CHI NHÁNH CÔNG TY CỔ PHẦN TẬP ĐOÀN SUNHOUSE TẠI THÀNH PHỐ HỒ CHÍ MINH': makeLogo(
    ['#DC2626', '#B91C1C'], '#FFFFFF',
    '<polygon points="60,20 82,38 74,38 74,56 46,56 46,38 38,38" fill="none" stroke-width="4"/><circle cx="60" cy="42" r="5"/>',
    'SUNHOUSE', 'TẬP ĐOÀN'
  ),

  // 32. HSC Smart Retail
  'CÔNG TY CỔ PHẦN HSC SMART RETAIL VIỆT NAM': makeLogo(
    ['#7C3AED', '#6D28D9'], '#FDE047',
    '<circle cx="50" cy="54" r="3.5"/><circle cx="70" cy="54" r="3.5"/><path d="M40 26 L46 26 L56 48 L74 48 L80 34 L50 34" fill="none" stroke-width="3.5"/>',
    'HSC', 'SMART RETAIL'
  ),

  // 33. Thiên Thủy Mộc
  'CÔNG TY TNHH TM THIÊN THỦY MỘC': makeLogo(
    ['#047857', '#065F46'], '#A7F3D0',
    '<path d="M60 22 C48 36 48 48 60 56 C72 48 72 36 60 22 Z" fill="none" stroke-width="3.5"/>',
    'THIÊN THỦY MỘC', 'ORGANIC'
  ),

  // 34. Uri Aesthetic
  'CÔNG TY CỔ PHẦN URI AESTHETIC GROUP': makeLogo(
    ['#BE185D', '#831843'], '#FCE7F3',
    '<polygon points="46,34 54,24 60,32 66,24 74,34 70,52 50,52" fill="none" stroke-width="3.5"/>',
    'URI', 'AESTHETIC'
  ),

  // 35. King Vietnam
  'CÔNG TY TNHH KING VIỆT NAM': makeLogo(
    ['#18181B', '#27272A'], '#FBBF24',
    '<polygon points="42,32 50,22 60,30 70,22 78,32 74,54 46,54" stroke-width="2"/>',
    'KING VN', 'CORP'
  ),

  // 36. Good Food
  'GOOD FOOD CO., LTD': makeLogo(
    ['#EA580C', '#9A3412'], '#FFFFFF',
    '<circle cx="60" cy="40" r="16" fill="none" stroke-width="3.5"/><path d="M52 32 L52 48 M68 32 L68 48" stroke-width="2.5"/>',
    'GOOD FOOD', 'PREMIUM'
  ),

  // 37. FerTrade
  'CÔNG TY TNHH FERTRADE VIỆT NAM': makeLogo(
    ['#0369A1', '#075985'], '#38BDF8',
    '<rect x="42" y="28" width="36" height="26" rx="4" fill="none" stroke-width="3.5"/><line x1="54" y1="28" x2="54" y2="54" stroke-width="2.5"/><line x1="66" y1="28" x2="66" y2="54" stroke-width="2.5"/>',
    'FERTRADE', 'IMPORT EXPORT'
  ),

  // 38. Coasia
  'CÔNG TY CỔ PHẦN COASIA CM VINA': makeLogo(
    ['#1D4ED8', '#1E3A8A'], '#FFFFFF',
    '<path d="M74 30 A16 16 0 1 0 74 50" fill="none" stroke-width="5" stroke-linecap="round"/>',
    'COASIA', 'SEMICONDUCTOR'
  ),

  // 39. Envis School
  'CÔNG TY TNHH ANH NGỮ ENVIS SCHOOL': makeLogo(
    ['#4F46E5', '#3730A3'], '#FEF08A',
    '<path d="M42 50 C48 44 60 44 60 44 C60 44 72 44 78 50 L78 30 C72 26 60 26 60 26 C60 26 48 26 42 30 Z" fill="none" stroke-width="3.5"/>',
    'ENVIS', 'ENGLISH SCHOOL'
  ),

  // 40. AWE Design
  'CÔNG TY CỔ PHẦN ĐÀO TẠO VÀ THIẾT KẾ AWE': makeLogo(
    ['#18181B', '#09090B'], '#F59E0B',
    '<polygon points="60,20 78,54 42,54" fill="none" stroke-width="4"/><text x="60" y="48" font-size="14" font-weight="900" text-anchor="middle">AWE</text>',
    'AWE', 'DESIGN ACADEMY'
  ),

  // 41. MISA
  'CÔNG TY CỔ PHẦN MISA': makeLogo(
    ['#0284C7', '#0369A1'], '#FBBF24',
    '<polygon points="48,26 60,38 48,50" fill="#FBBF24"/><polygon points="72,26 60,38 72,50" fill="#38BDF8"/>',
    'MISA', 'SAAS SOFTWARE'
  ),

  // 42. TTSmart
  'CÔNG TY TNHH TTSMART': makeLogo(
    ['#0F172A', '#1E1B4B'], '#A855F7',
    '<circle cx="60" cy="40" r="14" fill="none" stroke-width="3.5"/><circle cx="60" cy="40" r="4"/>',
    'TTSMART', 'AI & IOT'
  ),

  // 43. MSB Bank
  'NGÂN HÀNG TMCP HÀNG HẢI VIỆT NAM': makeLogo(
    ['#DC2626', '#991B1B'], '#FFFFFF',
    '<circle cx="50" cy="40" r="12"/><circle cx="70" cy="40" r="12" fill="#FBBF24"/>',
    'MSB', 'MARITIME BANK'
  ),

  // 44. C&C Foods
  'CÔNG TY CỔ PHẦN THỰC PHẨM QUỐC TẾ C&C': makeLogo(
    ['#EA580C', '#C2410C'], '#FEF08A',
    '<circle cx="60" cy="40" r="16" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="16" font-weight="900" text-anchor="middle">C&amp;C</text>',
    'C&amp;C', 'FOODS'
  ),

  // 45. XHome
  'CÔNG TY CỔ PHẦN XHOME QUẢNG NINH': makeLogo(
    ['#18181B', '#27272A'], '#FBBF24',
    '<line x1="42" y1="24" x2="78" y2="56" stroke-width="5" stroke-linecap="round"/><line x1="78" y1="24" x2="42" y2="56" stroke-width="5" stroke-linecap="round"/>',
    'XHOME', 'INTERIOR'
  ),

  // 46. Galaxy Education
  'GALAXY EDUCATION JOINT STOCK COMPANY': makeLogo(
    ['#6D28D9', '#4C1D95'], '#FDE047',
    '<ellipse cx="60" cy="40" rx="20" ry="8" fill="none" stroke-width="3.5" transform="rotate(-25 60 40)"/><circle cx="60" cy="40" r="6"/>',
    'GALAXY', 'EDUCATION'
  ),

  // 47. Mac Marketing
  'MAC MARKETING': makeLogo(
    ['#2563EB', '#1D4ED8'], '#FFFFFF',
    '<path d="M42 52 L52 30 L60 44 L68 30 L78 52" fill="none" stroke-width="4" stroke-linecap="round"/>',
    'MAC', 'MARKETING'
  ),

  // 48. Phúc Lâm
  'CÔNG TY TNHH XE NÂNG PHÚC LÂM': makeLogo(
    ['#EA580C', '#C2410C'], '#FFFFFF',
    '<rect x="42" y="32" width="26" height="20" rx="3" fill="none" stroke-width="3.5"/><line x1="68" y1="22" x2="68" y2="52" stroke-width="3.5"/><line x1="68" y1="52" x2="80" y2="52" stroke-width="3.5"/>',
    'PHÚC LÂM', 'FORKLIFT'
  ),

  // 49. CD Media
  'CÔNG TY TNHH TRUYỀN THÔNG VÀ GT CD MEDIA': makeLogo(
    ['#E11D48', '#BE123C'], '#FFFFFF',
    '<rect x="40" y="28" width="28" height="24" rx="4" fill="none" stroke-width="3.5"/><polygon points="68,34 80,26 80,54 68,46"/>',
    'CD MEDIA', 'PRODUCTION'
  ),

  // 50. Việt Pháp Shal
  'CÔNG TY TNHH THƯƠNG MẠI SẢN XUẤT CÔNG NGHIỆP NHÔM VIỆT PHÁP SHAL': makeLogo(
    ['#475569', '#334155'], '#F8FAFC',
    '<rect x="44" y="24" width="32" height="32" fill="none" stroke-width="4"/><line x1="44" y1="24" x2="76" y2="56" stroke-width="3"/>',
    'VIỆT PHÁP', 'SHAL ALUMINUM'
  ),

  // 51. Saltlux
  'CÔNG TY CỔ PHẦN SALTLUX TECHNOLOGY': makeLogo(
    ['#0284C7', '#0369A1'], '#38BDF8',
    '<polygon points="60,22 76,34 76,50 60,58 44,50 44,34" fill="none" stroke-width="3.5"/><circle cx="60" cy="40" r="4"/>',
    'SALTLUX', 'AI TECH'
  ),

  // 52. Koji Sport
  'CÔNG TY CỔ PHẦN THỂ THAO KOJI': makeLogo(
    ['#DC2626', '#B91C1C'], '#FEF08A',
    '<polygon points="60,20 74,40 60,60 46,40" fill="none" stroke-width="4"/><circle cx="60" cy="40" r="5"/>',
    'KOJI', 'SPORTS'
  ),

  // 53. Trần Thành Packaging
  'CÔNG TY TNHH TRẦN THÀNH': makeLogo(
    ['#059669', '#047857'], '#FFFFFF',
    '<polygon points="60,24 78,34 60,44 42,34" fill="none" stroke-width="3.5"/><polygon points="42,34 60,44 60,58 42,48" fill="none" stroke-width="3.5"/><polygon points="78,34 60,44 60,58 78,48" fill="none" stroke-width="3.5"/>',
    'TRẦN THÀNH', 'PACKAGING'
  ),

  // 54. PSI Chứng khoán
  'CÔNG TY CỔ PHẦN CHỨNG KHOÁN DẦU KHÍ (PSI)': makeLogo(
    ['#0284C7', '#0369A1'], '#DC2626',
    '<path d="M60 22 C48 34 60 56 60 56 C60 56 72 34 60 22 Z" fill="#DC2626"/><text x="60" y="44" fill="#FFF" font-size="12" font-weight="900" text-anchor="middle">P</text>',
    'PSI', 'SECURITIES'
  ),

  // 55. CP Paper
  'CÔNG TY CỔ PHẦN GIẤY CP': makeLogo(
    ['#15803D', '#166534'], '#FFFFFF',
    '<ellipse cx="50" cy="40" rx="10" ry="16" fill="none" stroke-width="3.5"/><path d="M50 24 L70 24 L70 56 L50 56" fill="none" stroke-width="3.5"/>',
    'CP PAPER', 'PULP & PAPER'
  ),

  // 56. Hoa Việt Hưng
  'CÔNG TY TNHH GIÁO DỤC HÁN NGỮ QUỐC TẾ HOA VIỆT HƯNG': makeLogo(
    ['#B91C1C', '#7F1D1D'], '#FDE047',
    '<circle cx="60" cy="40" r="16" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="16" font-weight="900" text-anchor="middle">華</text>',
    'HOA VIỆT HƯNG', 'CHINESE EDU'
  ),

  // 57. Đệ Nhất Đỉnh
  'CÔNG TY TNHH ĐÚC ĐỒNG ĐỆ NHẤT ĐỈNH': makeLogo(
    ['#B45309', '#78350F'], '#FDE68A',
    '<polygon points="46,30 74,30 68,54 52,54" fill="none" stroke-width="3.5"/><line x1="42" y1="30" x2="78" y2="30" stroke-width="3.5"/>',
    'ĐỆ NHẤT ĐỈNH', 'BRONZE CAST'
  ),

  // 58. Tina Pet
  'CÔNG TY TNHH TINA PET VIỆT NAM': makeLogo(
    ['#DB2777', '#BE185D'], '#FFFFFF',
    '<circle cx="60" cy="46" r="8"/><circle cx="48" cy="36" r="4"/><circle cx="56" cy="30" r="4"/><circle cx="64" cy="30" r="4"/><circle cx="72" cy="36" r="4"/>',
    'TINA PET', 'PET CARE'
  ),

  // 59. Nhân Hòa Vina
  'CÔNG TY TNHH NHÂN HÒA VINA': makeLogo(
    ['#2563EB', '#1D4ED8'], '#FFFFFF',
    '<path d="M46 48 C42 48 40 44 42 40 C42 34 50 34 52 34 C54 28 64 28 66 32 C72 32 76 36 74 42 C78 44 76 48 72 48 Z" fill="none" stroke-width="3.5"/>',
    'NHÂN HÒA', 'CLOUD & WEB'
  ),

  // 60. Máy Tính Việt Nam
  'CÔNG TY TNHH ĐẦU TƯ CÔNG NGHỆ MÁY TÍNH VIỆT NAM': makeLogo(
    ['#0F172A', '#334155'], '#38BDF8',
    '<rect x="42" y="26" width="36" height="24" rx="3" fill="none" stroke-width="3.5"/><line x1="60" y1="50" x2="60" y2="56" stroke-width="3.5"/><line x1="50" y1="56" x2="70" y2="56" stroke-width="3.5"/>',
    'V-TECH', 'COMPUTERS'
  ),

  // 61. Đất Thành
  'CÔNG TY CỔ PHẦN XÂY DỰNG & THƯƠNG MẠI ĐẤT THÀNH': makeLogo(
    ['#D97706', '#92400E'], '#FFFFFF',
    '<polygon points="60,22 80,44 40,44" fill="none" stroke-width="4"/><rect x="46" y="44" width="28" height="12" fill="none" stroke-width="3"/>',
    'ĐẤT THÀNH', 'CONSTRUCTION'
  ),

  // 62. NCA Trade
  'CÔNG TY TNHH THƯƠNG MẠI NCA (VN)': makeLogo(
    ['#0369A1', '#0C4A6E'], '#FDE047',
    '<circle cx="60" cy="40" r="15" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="14" font-weight="900" text-anchor="middle">NCA</text>',
    'NCA VN', 'TRADING'
  ),

  // 63. Printek
  'CÔNG TY TNHH PRINTEK': makeLogo(
    ['#0F172A', '#1E293B'], '#06B6D4',
    '<circle cx="52" cy="34" r="5" fill="#06B6D4"/><circle cx="68" cy="34" r="5" fill="#EC4899"/><circle cx="52" cy="46" r="5" fill="#EAB308"/><circle cx="68" cy="46" r="5" fill="#10B981"/>',
    'PRINTEK', 'PRINTING TECH'
  ),

  // 64. Educa Corporation
  'CÔNG TY CỔ PHẦN GIÁO DỤC EDUCA CORPORATION': makeLogo(
    ['#4F46E5', '#3730A3'], '#FDE047',
    '<text x="60" y="48" font-size="28" font-weight="900" text-anchor="middle">E</text>',
    'EDUCA', 'EDUTECH CORP'
  ),

  // 65. AZ Nose
  'CÔNG TY TNHH THẨM MỸ AZ NOSE': makeLogo(
    ['#BE185D', '#831843'], '#FFFFFF',
    '<path d="M50 26 Q60 30 56 46 Q64 54 70 50" fill="none" stroke-width="3.5" stroke-linecap="round"/>',
    'AZ NOSE', 'CLINIC'
  ),

  // 66. Thư Kỳ Anh
  'CÔNG TY TNHH THƯ KỲ ANH': makeLogo(
    ['#7C3AED', '#5B21B6'], '#FDE047',
    '<circle cx="60" cy="40" r="16" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="15" font-weight="900" text-anchor="middle">TKA</text>',
    'THƯ KỲ ANH', 'COMMERCE'
  ),

  // 67. Crossing Travel
  'CÔNG TY TNHH DU LỊCH CROSSING VIỆT NAM': makeLogo(
    ['#0284C7', '#0369A1'], '#FEF08A',
    '<circle cx="60" cy="40" r="16" fill="none" stroke-width="3.5"/><polygon points="60,28 65,40 60,37 55,40" fill="#FEF08A"/>',
    'CROSSING', 'TRAVEL VN'
  ),

  // 68. VCI Digital
  'CÔNG TY CỔ PHẦN CÔNG NGHỆ SỐ VCI': makeLogo(
    ['#2563EB', '#1E40AF'], '#38BDF8',
    '<rect x="42" y="26" width="36" height="28" rx="6" fill="none" stroke-width="3.5"/><text x="60" y="45" font-size="14" font-weight="900" text-anchor="middle">VCI</text>',
    'VCI', 'DIGITAL'
  ),

  // 69. Premier Property
  'CÔNG TY TNHH ĐẦU TƯ PREMIER PROPERTY HOLDINGS': makeLogo(
    ['#1E293B', '#0F172A'], '#FBBF24',
    '<polygon points="60,20 78,34 78,54 42,54 42,34" fill="none" stroke-width="3.5"/><line x1="60" y1="36" x2="60" y2="54" stroke-width="3"/>',
    'PREMIER', 'PROPERTY'
  ),

  // 70. Vĩnh Kỳ
  'CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI VĨNH KỲ': makeLogo(
    ['#059669', '#047857'], '#FFFFFF',
    '<circle cx="50" cy="40" r="10" fill="none" stroke-width="3.5"/><circle cx="70" cy="40" r="10" fill="none" stroke-width="3.5"/>',
    'VĨNH KỲ', 'INDUSTRY'
  ),

  // 71. SMC Corporation
  'CHI NHÁNH CÔNG TY TNHH SMC CORPORATION ( VIỆT NAM ) TẠI BẮC NINH': makeLogo(
    ['#0284C7', '#0369A1'], '#FFFFFF',
    '<text x="60" y="47" font-size="18" font-weight="900" text-anchor="middle" letter-spacing="0.08em">SMC</text>',
    'SMC CORP', 'PNEUMATICS'
  ),

  // 72. Tây SG
  'CÔNG TY TNHH TÂY SG': makeLogo(
    ['#EA580C', '#C2410C'], '#FEF08A',
    '<circle cx="60" cy="40" r="15" fill="none" stroke-width="3.5"/><text x="60" y="46" font-size="14" font-weight="900" text-anchor="middle">TSG</text>',
    'TÂY SG', 'ENTERPRISE'
  ),

  // 73. Motif Vietnam
  'CÔNG TY CỔ PHẦN TẬP ĐOÀN MOTIF VIETNAM': makeLogo(
    ['#4F46E5', '#3730A3'], '#A5B4FC',
    '<polygon points="60,20 76,32 76,48 60,60 44,48 44,32" fill="none" stroke-width="3.5"/>',
    'MOTIF', 'VIETNAM GROUP'
  ),

  // 74. Intron Life
  'CÔNG TY TNHH INTRON LIFE SCIENCES VIỆT NAM': makeLogo(
    ['#0D9488', '#0F766E'], '#99F6E4',
    '<path d="M46 26 Q60 40 74 26 M46 54 Q60 40 74 54" fill="none" stroke-width="3.5" stroke-linecap="round"/>',
    'INTRON', 'LIFE SCIENCES'
  ),

  // 75. A.I-Soft
  'CÔNG TY CỔ PHẦN CÔNG NGHỆ A.I-SOFT': makeLogo(
    ['#0F172A', '#1E1B4B'], '#FBBF24',
    '<circle cx="60" cy="40" r="14" fill="none" stroke-width="3.5"/><text x="60" y="45" font-size="13" font-weight="900" text-anchor="middle">AI</text>',
    'A.I-SOFT', 'TECHNOLOGY'
  )
};

// Fallback generator for any other company
function getLogoForCompany(name) {
  if (companyLogos[name]) return companyLogos[name];
  // Generate deterministic branded logo
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
  const hue = Math.abs(hash) % 360;
  const c1 = 'hsl(' + hue + ', 70%, 25%)';
  const c2 = 'hsl(' + ((hue + 30) % 360) + ', 80%, 15%)';
  const words = name.replace(/CÔNG TY|CỔ PHẦN|TNHH|TẬP ĐOÀN|CHI NHÁNH/gi, '').trim().split(/\s+/).filter(Boolean);
  const shortText = words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
  return makeLogo([c1, c2], '#FFFFFF', '<circle cx="60" cy="40" r="15" fill="none" stroke-width="3.5"/>', shortText || 'JN', 'CORP');
}

// 1. Update frontend/src/mock/jobs.js
const jobsPath = path.resolve('C:/Users/A/JobNest/frontend/src/mock/jobs.js');
let jobsCode = fs.readFileSync(jobsPath, 'utf8');

const match = jobsCode.match(/export const mockJobs = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Cannot find mockJobs in jobs.js');
  process.exit(1);
}

const jobs = eval(match[1]);
let updatedCount = 0;

jobs.forEach(job => {
  if (job.company && job.company.name) {
    const newLogo = getLogoForCompany(job.company.name);
    job.company.logoUrl = newLogo;
    updatedCount++;
  }
});

const newJobsCode = 'export const mockJobs = ' + JSON.stringify(jobs, null, 2) + ';\n';
fs.writeFileSync(jobsPath, newJobsCode, 'utf8');
console.log('Successfully updated ' + updatedCount + ' jobs with matching corporate logos in mock/jobs.js!');

// 2. Also update frontend/src/mock/companies.js
const compPath = path.resolve('C:/Users/A/JobNest/frontend/src/mock/companies.js');
if (fs.existsSync(compPath)) {
  let compCode = fs.readFileSync(compPath, 'utf8');
  const cMatch = compCode.match(/export const mockCompanies = (\[[\s\S]*?\]);/);
  if (cMatch) {
    const comps = eval(cMatch[1]);
    comps.forEach(c => {
      c.logo = getLogoForCompany(c.name);
    });
    fs.writeFileSync(compPath, 'export const mockCompanies = ' + JSON.stringify(comps, null, 2) + ';\n', 'utf8');
    console.log('Successfully updated mockCompanies with matching logos!');
  }
}
