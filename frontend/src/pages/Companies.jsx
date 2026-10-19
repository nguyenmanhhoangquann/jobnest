import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaSearch,
  FaBuilding,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCheckCircle,
  FaUsers,
  FaGlobe,
  FaArrowLeft,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowRight,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaHeartbeat,
  FaGraduationCap,
  FaUmbrellaBeach,
  FaLightbulb,
  FaHandshake,
  FaAward,
  FaFire,
  FaBolt,
  FaUserFriends,
  FaCheck,
  FaChevronRight,
} from 'react-icons/fa';
import mockCompanies from '../mock/companies.js';
import companyApi from '../api/companyApi.js';
import { showToast } from '../components/common/ToastHost.jsx';
import Pagination from '../components/common/Pagination.jsx';

const COMPANY_EXTRAS_MAP = {
  toshiba: {
    tagline: 'Tiên phong phát triển hệ thống phần mềm nhúng và giải pháp công nghệ cao chuẩn Nhật Bản.',
    founded: 2007,
    offices: 'Keangnam Hanoi Landmark Tower',
    officesCount: '2+',
    activeUsers: '10M+',
    funding: '100% Vốn Tập đoàn Toshiba (Nhật Bản)',
    ownership: 'Doanh nghiệp FDI',
    hq: 'Nam Từ Liêm, Hà Nội',
    size: '500 - 1.000 nhân sự',
    industry: 'IT - Phần mềm / Hệ thống nhúng',
    website: 'https://toshiba.com.vn',
  },
  viettel: {
    tagline: 'Tập đoàn công nghệ - viễn thông lớn nhất Việt Nam, hoạt động đa quốc gia trên 11 thị trường.',
    founded: 1989,
    offices: 'Hoạt động tại 11 Quốc gia',
    officesCount: '11+',
    activeUsers: '80M+',
    funding: 'Tập đoàn Quốc gia',
    ownership: 'Viễn thông & Công nghệ',
    hq: 'Cầu Giấy, Hà Nội',
    size: '50.000+ nhân sự',
    industry: 'Viễn thông / Công nghệ cao',
    website: 'https://viettel.com.vn',
  },
  fpt: {
    tagline: 'Tiên phong chuyển đổi số và kiến tạo tương lai bền vững cùng công nghệ AI.',
    founded: 1988,
    offices: '30+ Văn phòng toàn cầu',
    officesCount: '30+',
    activeUsers: '50M+',
    funding: 'Niêm yết HOSE (FPT)',
    ownership: 'Tập đoàn Công nghệ',
    hq: 'Cầu Giấy, Hà Nội',
    size: '10.000+ nhân sự',
    industry: 'IT - Phần mềm / Viễn thông',
    website: 'https://fpt.com.vn',
  },
  mb: {
    tagline: 'Ngân hàng số thông minh với hệ sinh thái tài chính toàn diện phục vụ hàng triệu khách hàng.',
    founded: 1994,
    offices: '300+ Chi nhánh toàn quốc',
    officesCount: '300+',
    activeUsers: '28M+',
    funding: 'Niêm yết HOSE (MBB)',
    ownership: 'Ngân hàng Thương mại',
    hq: 'Ba Đình, Hà Nội',
    size: '15.000+ nhân sự',
    industry: 'Ngân hàng / Tài chính',
    website: 'https://mbbank.com.vn',
  },
  'quân đội': {
    tagline: 'Ngân hàng số thông minh với hệ sinh thái tài chính toàn diện phục vụ hàng triệu khách hàng.',
    founded: 1994,
    offices: '300+ Chi nhánh toàn quốc',
    officesCount: '300+',
    activeUsers: '28M+',
    funding: 'Niêm yết HOSE (MBB)',
    ownership: 'Ngân hàng Thương mại',
    hq: 'Ba Đình, Hà Nội',
    size: '15.000+ nhân sự',
    industry: 'Ngân hàng / Tài chính',
    website: 'https://mbbank.com.vn',
  },
  vinamilk: {
    tagline: 'Thương hiệu sữa quốc gia với chuỗi cung ứng bền vững chuẩn quốc tế và cam kết Net Zero.',
    founded: 1976,
    offices: '15 Trang trại & 13 Nhà máy',
    officesCount: '28+',
    activeUsers: '45M+',
    funding: 'Niêm yết HOSE (VNM)',
    ownership: 'Tập đoàn Tiêu dùng',
    hq: 'Quận 7, TP.HCM',
    size: '10.000+ nhân sự',
    industry: 'Hàng tiêu dùng nhanh (FMCG)',
    website: 'https://vinamilk.com.vn',
  },
  misa: {
    tagline: 'Nền tảng phần mềm SaaS và giải pháp quản trị doanh nghiệp phục vụ hơn 350.000 tổ chức.',
    founded: 1994,
    offices: '5 Văn phòng vùng',
    officesCount: '5+',
    activeUsers: '2.5M+',
    funding: 'Cổ phần Công nghệ',
    ownership: 'Doanh nghiệp SaaS',
    hq: 'Cầu Giấy, Hà Nội',
    size: '3.000+ nhân sự',
    industry: 'Phần mềm quản trị doanh nghiệp',
    website: 'https://misa.vn',
  },
  vinhomes: {
    tagline: 'Nhà phát triển đại đô thị thông minh và hệ sinh thái bất động sản đẳng cấp quốc tế.',
    founded: 1993,
    offices: 'Đại đô thị toàn quốc',
    officesCount: '20+',
    activeUsers: '8M+',
    funding: 'Niêm yết HOSE (VHM)',
    ownership: 'Bất động sản Đô thị',
    hq: 'Gia Lâm, Hà Nội',
    size: '20.000+ nhân sự',
    industry: 'Bất động sản / Phát triển đô thị',
    website: 'https://vinhomes.vn',
  },
  'hòa phát': {
    tagline: 'Tập đoàn sản xuất công nghiệp và chế tạo thép hàng đầu Đông Nam Á.',
    founded: 1992,
    offices: 'Hệ thống khu liên hợp toàn quốc',
    officesCount: '15+',
    activeUsers: '10M+',
    funding: 'Niêm yết HOSE (HPG)',
    ownership: 'Tập đoàn Công nghiệp',
    hq: 'Hai Bà Trưng, Hà Nội',
    size: '30.000+ nhân sự',
    industry: 'Công nghiệp nặng / Sản xuất',
    website: 'https://hoaphat.com.vn',
  },
  vib: {
    tagline: 'Dẫn đầu xu hướng ngân hàng bán lẻ và công nghệ thẻ số hóa phong cách sống.',
    founded: 1996,
    offices: '170+ Chi nhánh toàn quốc',
    officesCount: '170+',
    activeUsers: '5M+',
    funding: 'Niêm yết HOSE (VIB)',
    ownership: 'Ngân hàng Thương mại',
    hq: 'Hoàn Kiếm, Hà Nội',
    size: '10.000+ nhân sự',
    industry: 'Tài chính - Ngân hàng',
    website: 'https://vib.com.vn',
  },
  ssi: {
    tagline: 'Định chế tài chính và công ty chứng khoán hàng đầu Việt Nam, quản lý tài sản chuyên nghiệp.',
    founded: 1999,
    offices: 'Chi nhánh Hà Nội & TP.HCM',
    officesCount: '10+',
    activeUsers: '1.5M+',
    funding: 'Niêm yết HOSE (SSI)',
    ownership: 'Chứng khoán & Quỹ',
    hq: 'Quận 1, TP.HCM',
    size: '2.000+ nhân sự',
    industry: 'Chứng khoán & Quản lý quỹ',
    website: 'https://ssi.com.vn',
  },
  concentrix: {
    tagline: 'Dẫn đầu trải nghiệm khách hàng (CX) toàn cầu với giải pháp công nghệ đa kênh tiên tiến.',
    founded: 1973,
    offices: '275+ Trung tâm toàn cầu',
    officesCount: '275+',
    activeUsers: '100M+',
    funding: 'Niêm yết NASDAQ (CNXC)',
    ownership: 'Tập đoàn Đa quốc gia',
    hq: 'Quận 12, TP.HCM',
    size: '5.000+ nhân sự',
    industry: 'Dịch vụ BPO / Trải nghiệm khách hàng',
    website: 'https://concentrix.com',
  },
  'k&m': {
    tagline: 'Đầu tư đa ngành, phân phối thiết bị cơ điện và chuỗi cung ứng thương mại hiện đại.',
    founded: 2012,
    offices: '3 Trụ sở miền',
    officesCount: '3+',
    activeUsers: '1.2M+',
    funding: 'Tư nhân Đầu tư',
    ownership: 'Thương mại Cơ điện',
    hq: 'Cầu Giấy, Hà Nội',
    size: '500 - 1.000 nhân sự',
    industry: 'Thương mại & Đầu tư đa ngành',
    website: 'https://kmholdings.vn',
  },
  'a.i': {
    tagline: 'Đơn vị tiên phong nghiên cứu và phát triển các giải pháp trí tuệ nhân tạo và chuyển đổi số doanh nghiệp.',
    founded: 2020,
    offices: 'Hà Nội & TP.HCM',
    officesCount: '2+',
    activeUsers: '500K+',
    funding: 'Cổ phần Công nghệ',
    ownership: 'Công nghệ AI',
    hq: 'Cầu Giấy, Hà Nội',
    size: '200 - 500 nhân sự',
    industry: 'IT - Phần mềm / Trí tuệ nhân tạo',
    website: 'https://aisoft.com.vn',
  },
  sunhouse: {
    tagline: 'Tập đoàn gia dụng hàng đầu Việt Nam sở hữu chuỗi nhà máy hiện đại quy mô hàng đầu khu vực.',
    founded: 2000,
    offices: 'Chi nhánh toàn quốc',
    officesCount: '10+',
    activeUsers: '20M+',
    funding: 'Tập đoàn Gia dụng',
    ownership: 'Tập đoàn Sản xuất',
    hq: 'Hà Nội & TP.HCM',
    size: '5.000+ nhân sự',
    industry: 'Gia dụng & Sản xuất',
    website: 'https://sunhouse.com.vn',
  },
  novaland: {
    tagline: 'Tập đoàn đầu tư và phát triển bất động sản uy tín tại Việt Nam.',
    founded: 1992,
    offices: 'TP.HCM & Toàn quốc',
    officesCount: '15+',
    activeUsers: '5M+',
    funding: 'Niêm yết HOSE (NVL)',
    ownership: 'Bất động sản',
    hq: 'Quận 1, TP.HCM',
    size: '2.000+ nhân sự',
    industry: 'Bất động sản',
    website: 'https://novaland.com.vn',
  },
  msb: {
    tagline: 'Ngân hàng TMCP Hàng Hải Việt Nam - Tiên phong số hóa tài chính toàn diện.',
    founded: 1991,
    offices: '260+ Chi nhánh toàn quốc',
    officesCount: '260+',
    activeUsers: '6M+',
    funding: 'Niêm yết HOSE (MSB)',
    ownership: 'Ngân hàng Thương mại',
    hq: 'Đống Đa, Hà Nội',
    size: '7.000+ nhân sự',
    industry: 'Ngân hàng / Tài chính',
    website: 'https://msb.com.vn',
  },
};

const getCompanyExtras = (company) => {
  if (!company) return {};
  const name = (company.name || '').toLowerCase();
  for (const [key, val] of Object.entries(COMPANY_EXTRAS_MAP)) {
    if (name.includes(key)) return val;
  }
  return {
    tagline: company.description || `${company.shortName || company.name} kiến tạo môi trường làm việc chuyên nghiệp, nuôi dưỡng nhân tài và phát triển bền vững.`,
    founded: 2015,
    offices: 'Chi nhánh toàn quốc',
    officesCount: '2+',
    activeUsers: '100K+',
    funding: 'Doanh nghiệp Hàng đầu',
    ownership: 'Doanh nghiệp Cổ phần',
    hq: company.location || 'Hà Nội',
    size: company.size || '500 - 1.000 nhân sự',
    industry: company.industry || 'Đa ngành',
    website: company.website || 'https://jobnest.vn',
  };
};

const DEFAULT_PERKS = [
  {
    icon: <FaHeartbeat size={20} className="text-danger" />,
    title: 'Sức khỏe & Bảo hiểm toàn diện',
    desc: 'Gói bảo hiểm sức khỏe cao cấp cho nhân viên và người thân, khám sức khỏe định kỳ hàng năm tại các bệnh viện quốc tế hàng đầu.',
  },
  {
    icon: <FaMoneyBillWave size={20} className="text-warning" />,
    title: 'Tài chính, Thưởng & ESOP',
    desc: 'Lương tháng 13, thưởng hiệu quả kinh doanh không giới hạn, xét tăng lương định kỳ 2 lần/năm cùng chính sách cổ phiếu thưởng ESOP.',
  },
  {
    icon: <FaUmbrellaBeach size={20} className="text-info" />,
    title: 'Thời gian & Cân bằng sống',
    desc: '15 - 20 ngày phép năm có lương, chế độ làm việc linh hoạt Hybrid / Remote kết hợp ngày nghỉ dịp sinh nhật và các kỳ nghỉ lễ dài.',
  },
  {
    icon: <FaGraduationCap size={20} className="text-primary" />,
    title: 'Đào tạo & Phát triển chuyên môn',
    desc: 'Tài trợ 100% chi phí thi chứng chỉ quốc tế (AWS, PMP, CFA...), khóa huấn luyện kỹ năng lãnh đạo và lộ trình thăng tiến rõ ràng.',
  },
  {
    icon: <FaBuilding size={20} className="text-success" />,
    title: 'Môi trường làm việc chuẩn quốc tế',
    desc: 'Văn phòng hiện đại, Pantry miễn phí đồ uống & đồ ăn nhẹ cả ngày, khu vực thư giãn giải trí và phòng tập thể thao tiện nghi.',
  },
  {
    icon: <FaAward size={20} className="text-warning" />,
    title: 'Vinh danh & Phúc lợi gia đình',
    desc: 'Chương trình khen thưởng cá nhân & tập thể xuất sắc hàng quý, Company Trip du lịch hàng năm và quà tặng ý nghĩa vào các dịp lễ tết.',
  },
];

const DEFAULT_VALUES = [
  {
    icon: <FaLightbulb size={22} className="text-warning" />,
    title: 'Đổi mới & Tiên phong (Innovation First)',
    desc: 'Không ngừng thử nghiệm công nghệ mới, khuyến khích sáng kiến đột phá và cải tiến liên tục để tạo ra giá trị khác biệt cho cộng đồng.',
  },
  {
    icon: <FaHandshake size={22} className="text-primary" />,
    title: 'Tôn trọng & Hòa nhập (Diversity & Inclusion)',
    desc: 'Xây dựng môi trường bình đẳng, tôn trọng sự đa dạng cá nhân, luôn lắng nghe và trao quyền để mỗi cá nhân phát huy tối đa tiềm năng.',
  },
  {
    icon: <FaCheckCircle size={22} className="text-success" />,
    title: 'Chính trực & Cam kết (Integrity & Excellence)',
    desc: 'Lấy sự trung thực và minh bạch làm kim chỉ nam, kiên định thực hiện cam kết với khách hàng, đối tác và đồng nghiệp.',
  },
  {
    icon: <FaUsers size={22} className="text-info" />,
    title: 'Đồng hành & Gắn kết (One Team Mindset)',
    desc: 'Cùng chung mục tiêu phụng sự xã hội, sẵn sàng sẻ chia kiến thức và tương trợ lẫn nhau để cùng tiến xa hơn.',
  },
];

const CATEGORY_TABS = [
  { id: 'ALL', label: 'Tất cả lĩnh vực' },
  { id: 'IT - Phần mềm', label: 'Công nghệ thông tin' },
  { id: 'Kinh doanh', label: 'Kinh doanh - Bán hàng' },
  { id: 'Ngân hàng', label: 'Tài chính - Ngân hàng' },
  { id: 'Sản xuất', label: 'Sản xuất - Vận hành' },
  { id: 'Dịch vụ Khách hàng', label: 'Dịch vụ - CSKH' },
  { id: 'Bất động sản', label: 'Bất động sản' },
];

const SEARCH_HINTS = ['Toshiba', 'FPT', 'Viettel', 'MB Bank', 'Vinamilk', 'MISA', 'Hà Nội', 'TP.HCM'];

const getCompanySkills = (comp) => {
  if (comp.skills && Array.isArray(comp.skills) && comp.skills.length > 0) {
    return comp.skills;
  }
  const name = (comp.name || comp.shortName || '').toLowerCase();
  if (name.includes('toshiba')) return ['C++', 'QA QC', 'Java', 'C#', 'C language', 'Embedded'];
  if (name.includes('fpt')) return ['Java', 'Spring Boot', 'ReactJS', 'AWS', 'TypeScript', 'NodeJS'];
  if (name.includes('viettel')) return ['5G / IoT', 'Embedded', 'Java', 'Linux', 'Security', 'Cloud'];
  if (name.includes('misa')) return ['NodeJS', 'ReactJS', 'SQL Server', 'C# .NET', 'Product', 'CRM'];
  if (name.includes('mb') || name.includes('quân đội')) return ['Tài chính DN', 'Ngân hàng số', 'SME', 'B2B', 'Fintech'];
  if (name.includes('vinamilk')) return ['FMCG', 'Quản lý bán hàng', 'Chuỗi cung ứng', 'Marketing', 'ERP'];
  if (name.includes('vib')) return ['Tài chính', 'Thẻ tín dụng', 'Bán lẻ', 'CSKH', 'Đàm phán'];
  if (name.includes('ssi')) return ['Chứng khoán', 'Quản lý tài sản', 'Phân tích tài chính', 'Fintech', 'Đầu tư'];
  if (name.includes('vinhomes')) return ['Bất động sản', 'Kinh doanh', 'Phân phối DA', 'Tư vấn KH', 'B2C'];
  if (name.includes('hòa phát')) return ['Cơ điện', 'Quản lý thiết bị', 'Bảo trì', 'Sản xuất thép', 'Công nghiệp'];
  if (name.includes('concentrix')) return ['Customer Support', 'Tiếng Anh', 'BPO', 'Tư vấn KH', 'Call Center'];
  if (name.includes('k&m')) return ['B2B Sales', 'Cơ điện', 'Thương mại', 'Quản lý DA', 'Chuỗi cung ứng'];
  return ['Chuyên môn cao', 'Môi trường tốt', 'Đãi ngộ cao'];
};

const getCompanyLocation = (comp) => {
  const loc = comp.location || 'Ha Noi';
  const l = loc.toLowerCase();
  if (l.includes('hà nội') && (l.includes('tp.hcm') || l.includes('hồ chí minh'))) {
    return 'Ha Noi - Ho Chi Minh';
  }
  if (l.includes('hà nội') || l.includes('ha nei') || l.includes('ha noi')) {
    return 'Ha Noi';
  }
  if (l.includes('hồ chí minh') || l.includes('tp.hcm') || l.includes('ho chi minh')) {
    return 'Ho Chi Minh';
  }
  if (l.includes('đà nẵng') || l.includes('da nang')) {
    return 'Da Nang';
  }
  return loc.split(',')[0].trim();
};

const matchLocation = (compLocation, filterLocation) => {
  if (!filterLocation || filterLocation === 'all') return true;
  const c = (compLocation || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const f = filterLocation.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (f.includes('ha noi') || f === 'hn') {
    return c.includes('ha noi') || c.includes('hn');
  }
  if (f.includes('ho chi minh') || f.includes('hcm') || f.includes('sai gon')) {
    return c.includes('ho chi minh') || c.includes('hcm') || c.includes('sai gon') || c.includes('tp.hcm');
  }
  if (f.includes('da nang') || f === 'dn') {
    return c.includes('da nang');
  }
  return c.includes(f);
};

const matchIndustry = (compIndustry, categoryId) => {
  if (!categoryId || categoryId === 'ALL') return true;
  const ind = (compIndustry || '').toLowerCase();
  switch (categoryId) {
    case 'IT - Phần mềm':
      return ind.includes('it') || ind.includes('phần mềm') || ind.includes('công nghệ') || ind.includes('viễn thông');
    case 'Kinh doanh':
      return ind.includes('kinh doanh') || ind.includes('bán hàng') || ind.includes('thương mại') || ind.includes('fmcg') || ind.includes('tiêu dùng');
    case 'Ngân hàng':
      return ind.includes('ngân hàng') || ind.includes('tài chính') || ind.includes('chứng khoán');
    case 'Sản xuất':
      return ind.includes('sản xuất') || ind.includes('công nghiệp') || ind.includes('chế tạo') || ind.includes('cơ điện') || ind.includes('gia dụng');
    case 'Dịch vụ Khách hàng':
      return ind.includes('dịch vụ') || ind.includes('bpo') || ind.includes('cskh') || ind.includes('khách hàng');
    case 'Bất động sản':
      return ind.includes('bất động sản') || ind.includes('đô thị') || ind.includes('địa ốc');
    default:
      return ind.includes(categoryId.toLowerCase());
  }
};

const matchSize = (compSize, filterSize) => {
  if (!filterSize || filterSize === 'all') return true;
  const s = (compSize || '').toLowerCase();
  if (filterSize === 'small') return s.includes('50') || s.includes('100') || s.includes('200');
  if (filterSize === 'medium') return s.includes('500') || s.includes('1.000') || s.includes('1000');
  if (filterSize === 'large') return s.includes('3.000') || s.includes('5.000') || s.includes('10.000') || s.includes('20.000') || s.includes('50.000') || s.includes('1.000+');
  return true;
};

const matchOfficeType = (comp, filterOffice) => {
  if (!filterOffice || filterOffice === 'all') return true;
  const text = `${comp.location || ''} ${comp.description || ''}`.toLowerCase();
  if (filterOffice === 'remote') return text.includes('remote') || text.includes('từ xa');
  if (filterOffice === 'hybrid') return text.includes('linh hoạt') || text.includes('hybrid') || text.includes('toàn quốc');
  if (filterOffice === 'onsite') return !text.includes('remote');
  return true;
};

const resolveCompanyLogo = (comp) => {
  const name = (comp?.name || comp?.shortName || '').toLowerCase();
  const url = comp?.logo || comp?.logoUrl || '';
  if (name.includes('fpt')) return '/images/companies/fpt.png';
  if (name.includes('mb') || name.includes('quân đội')) return '/images/companies/mb-bank.png';
  if (name.includes('vinamilk')) return '/images/companies/vinamilk.png';
  if (name.includes('toshiba')) return '/images/companies/toshiba.svg';
  if (name.includes('viettel')) return '/images/companies/viettel.svg';
  return url || '/images/companies/fpt.png';
};

const getJobSkills = (job, industry) => {
  if (job.skills && job.skills.length > 0) return job.skills;
  const t = (job.title || '').toLowerCase();
  if (t.includes('java')) return ['Java', 'Spring Boot', 'Cloud Microservices'];
  if (t.includes('frontend') || t.includes('react')) return ['ReactJS', 'Next.js', 'TypeScript'];
  if (t.includes('devops') || t.includes('cloud') || t.includes('platform')) return ['AWS', 'Kubernetes', 'Docker'];
  if (t.includes('ai') || t.includes('data')) return ['Python', 'Machine Learning', 'Data Science'];
  if (t.includes('banker') || t.includes('khách hàng')) return ['Tài chính DN', 'B2B', 'SME'];
  if (t.includes('security') || t.includes('bảo mật')) return ['An toàn thông tin', 'SOC', 'Network'];
  if (t.includes('teller') || t.includes('giao dịch')) return ['Giao dịch số', 'CSKH', 'Nghiệp vụ'];
  if (t.includes('kinh doanh') || t.includes('sales')) return ['B2B Sales', 'Đàm phán', 'CRM'];
  if (t.includes('marketing')) return ['Digital Marketing', 'SEO / Ads', 'Content'];
  if (t.includes('thiết kế') || t.includes('designer')) return ['Figma', 'UI/UX', 'Product Design'];
  return [industry || 'Chuyên môn', 'Chế độ tốt'];
};

export default function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCompanyId = searchParams.get('id');

  const [companiesList, setCompaniesList] = useState(mockCompanies);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeOfficeType, setActiveOfficeType] = useState('all');
  const [activeIndustry, setActiveIndustry] = useState('ALL');
  const [selectedSize, setSelectedSize] = useState('all');
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const [companyTab, setCompanyTab] = useState('overview');
  const [isFollowed, setIsFollowed] = useState(() => {
    if (!selectedCompanyId) return false;
    try {
      const saved = JSON.parse(localStorage.getItem('jn_followed_companies') || '[]');
      return saved.includes(Number(selectedCompanyId));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    companyApi.getCompanies().then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setCompaniesList(res);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) return;
    try {
      const saved = JSON.parse(localStorage.getItem('jn_followed_companies') || '[]');
      setIsFollowed(saved.includes(Number(selectedCompanyId)));
    } catch {
      setIsFollowed(false);
    }
  }, [selectedCompanyId]);

  const filteredCompanies = useMemo(() => {
    return companiesList.filter((c) => {
      if (!matchIndustry(c.industry, activeIndustry)) {
        return false;
      }
      if (!matchLocation(c.location, selectedLocation)) {
        return false;
      }
      if (!matchOfficeType(c, activeOfficeType)) {
        return false;
      }
      if (!matchSize(c.size, selectedSize)) {
        return false;
      }
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase().trim();
        const skills = getCompanySkills(c).map((s) => s.toLowerCase());
        const jobs = (c.jobs || []).map((j) => (j.title || '').toLowerCase());
        return (
          c.name?.toLowerCase().includes(kw) ||
          c.shortName?.toLowerCase().includes(kw) ||
          c.industry?.toLowerCase().includes(kw) ||
          c.location?.toLowerCase().includes(kw) ||
          skills.some((s) => s.includes(kw)) ||
          jobs.some((j) => j.includes(kw))
        );
      }
      return true;
    });
  }, [companiesList, searchKeyword, activeIndustry, selectedLocation, activeOfficeType, selectedSize]);

  const totalElements = filteredCompanies.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1;

  const paginatedCompanies = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCompanies.slice(start, start + PAGE_SIZE);
  }, [filteredCompanies, page, PAGE_SIZE]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const el = document.getElementById('companies-list-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedLocation('all');
    setActiveOfficeType('all');
    setActiveIndustry('ALL');
    setSelectedSize('all');
    setSearchKeyword('');
    setShowAllFilters(false);
    setPage(1);
  };

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return companiesList.find((c) => String(c.id) === String(selectedCompanyId));
  }, [companiesList, selectedCompanyId]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('success', 'Đã sao chép liên kết công ty vào bộ nhớ tạm!');
  };

  const handleToggleFollow = () => {
    if (!selectedCompany) return;
    try {
      const saved = JSON.parse(localStorage.getItem('jn_followed_companies') || '[]');
      const compId = Number(selectedCompany.id);
      let updated;
      if (saved.includes(compId)) {
        updated = saved.filter((id) => id !== compId);
        setIsFollowed(false);
        showToast('info', 'Đã hủy theo dõi công ty.');
      } else {
        updated = [...saved, compId];
        setIsFollowed(true);
        showToast('success', 'Đã lưu và theo dõi tin tuyển dụng của công ty!');
      }
      localStorage.setItem('jn_followed_companies', JSON.stringify(updated));
    } catch {
      setIsFollowed(!isFollowed);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const el = document.getElementById('companies-list-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // NẾU ĐANG CHỌN 1 CÔNG TY -> XEM CHI TIẾT CÔNG TY THEO THIẾT KẾ NOVATECH - JOBNEST
  if (selectedCompany) {
    const extras = getCompanyExtras(selectedCompany);
    const jobsList = selectedCompany.jobs || [];
    const companyWebsite = extras.website || selectedCompany.website;

    return (
      <div className="novatech-page-wrap">
        {/* 1. HERO BANNER BLOCK (NovaTech Canvas) */}
        <section className="novatech-hero-wrap">
          <div className="novatech-hero-dots-left" />
          <div className="novatech-hero-dots-right" />

          <div className="container" style={{ maxWidth: '1240px' }}>
            {/* Breadcrumb nhẹ nhàng */}
            <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-muted small fw-semibold"
                onClick={() => setSearchParams({})}
              >
                Doanh nghiệp
              </button>
              <span>›</span>
              <span className="text-secondary">{selectedCompany.shortName || selectedCompany.name}</span>
            </div>

            {/* Profile Identity Bar */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
              <div className="d-flex align-items-center" style={{ gap: '26px' }}>
                {/* Logo Box */}
                <div className="novatech-logo-box position-relative">
                  <img
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className="novatech-logo-img"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    className="fw-bold text-dark d-none align-items-center justify-content-center w-100 h-100 fs-3"
                  >
                    {(selectedCompany.shortName || selectedCompany.name).charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Company Name & Meta */}
                <div>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1.5">
                    <h1 className="h4 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.02em', fontSize: '28px' }}>
                      {selectedCompany.name}
                    </h1>
                    {selectedCompany.verified && (
                      <span className="novatech-verified-badge" title="Doanh nghiệp xác thực">
                        <FaCheck size={9} />
                      </span>
                    )}
                    <span className="novatech-badge-tag">{extras.industry || selectedCompany.industry}</span>
                    <span className="novatech-badge-tag">{extras.ownership || 'Enterprise Tech'}</span>
                  </div>

                  <p className="mb-2 fw-semibold" style={{ fontSize: '15px', maxWidth: '760px', color: '#334155', lineHeight: '1.5' }}>
                    "{extras.tagline}"
                  </p>

                  <div className="d-flex flex-wrap align-items-center gap-3" style={{ fontSize: '14.5px', color: '#334155' }}>
                    <span className="d-inline-flex align-items-center gap-1.5 fw-medium">
                      <FaMapMarkerAlt size={13} className="text-secondary" />
                      <span>{extras.hq || selectedCompany.location} • Làm việc linh hoạt</span>
                    </span>
                    <span>•</span>
                    <span className="d-inline-flex align-items-center gap-1.5 fw-medium">
                      <FaUsers size={13} className="text-secondary" />
                      <span>{extras.size || selectedCompany.size}</span>
                    </span>
                    {companyWebsite && (
                      <>
                        <span>•</span>
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="text-decoration-none d-inline-flex align-items-center gap-1 fw-bold"
                          style={{ color: '#0F172A' }}
                        >
                          <FaGlobe size={13} />
                          <span>{companyWebsite.replace('https://', '').replace(/\/$/, '')}</span>
                          <span style={{ fontSize: '11px', color: '#EA580C' }}>↗</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* CTAs bên phải */}
              <div className="d-flex align-items-center gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  className={`btn novatech-btn-follow d-inline-flex align-items-center gap-2 ${
                    isFollowed ? 'novatech-btn-follow--active' : ''
                  }`}
                  onClick={handleToggleFollow}
                >
                  {isFollowed ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
                  <span>{isFollowed ? 'Đang theo dõi' : 'Theo dõi'}</span>
                </button>

                <button
                  type="button"
                  className="btn novatech-btn-view-jobs d-inline-flex align-items-center gap-2"
                  onClick={() => {
                    const el = document.getElementById('company-jobs-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <FaBriefcase size={13} />
                  <span>Xem việc làm ({jobsList.length})</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MAIN 2-COLUMN CONTENT GRID */}
        <div className="container py-4 my-2" style={{ maxWidth: '1240px' }}>
          <div className="row g-4 align-items-start">
            {/* CỘT TRÁI (~68% width): Danh sách việc làm & vị trí nổi bật */}
            <div className="col-12 col-lg-8" id="company-jobs-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="text-uppercase fw-bold" style={{ fontSize: '12px', letterSpacing: '0.06em', color: '#475569' }}>
                    VIỆC LÀM &amp; VỊ TRÍ NỔI BẬT
                  </div>
                  <h2 className="fw-bold mb-0" style={{ fontSize: '22px', color: '#0F172A', letterSpacing: '-0.02em' }}>
                    Cơ hội nghề nghiệp tại {selectedCompany.shortName} ({jobsList.length})
                  </h2>
                </div>

                <span className="badge bg-white border px-3 py-1.5 rounded-pill fw-semibold shadow-xs" style={{ fontSize: '13px', color: '#334155' }}>
                  Đang mở tuyển dụng
                </span>
              </div>

              {jobsList.length === 0 ? (
                <div className="p-5 bg-white border rounded-4 text-center text-muted shadow-xs">
                  <FaBriefcase size={36} className="text-muted mb-2 mx-auto" />
                  <h3 className="h6 fw-bold text-dark mb-1">Hiện tại chưa có bài đăng tuyển dụng</h3>
                  <p className="text-muted small mb-0">Doanh nghiệp chưa mở đơn tuyển dụng mới nào trên hệ thống.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {jobsList.map((job) => (
                    <div key={job.id} className="novatech-featured-job-card">
                      <div className="d-flex flex-column gap-1">
                        <h3 className="fw-bold mb-1" style={{ fontSize: '18px', color: '#0F172A', lineHeight: '1.35' }}>
                          <Link to={`/jobs/${job.id}`} className="text-decoration-none hover-primary" style={{ color: '#0F172A' }}>
                            {job.title}
                          </Link>
                        </h3>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2" style={{ fontSize: '14.5px', color: '#334155' }}>
                          <span className="fw-semibold text-dark">
                            {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'INTERN' ? 'Thực tập' : 'Bán thời gian'}
                          </span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="fw-bold" style={{ fontSize: '16px', color: '#15803D' }}>
                            {job.salaryText}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-1.5">
                          {getJobSkills(job, selectedCompany.industry).map((skill, sIdx) => (
                            <span key={sIdx} className="novatech-job-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn btn-outline-dark rounded-pill fw-bold btn-sm px-4 py-2 text-nowrap align-self-center"
                        style={{ fontSize: '13.5px' }}
                      >
                        Ứng tuyển ngay →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI (~32% width): Quick Stats & Company Overview */}
            <div className="col-12 col-lg-4">
              <div className="d-flex flex-column gap-3.5">
                {/* 2 Thẻ Stats đầu tiên */}
                <div className="row g-2.5">
                  <div className="col-6">
                    <div className="novatech-stat-card">
                      <div className="fw-bold text-dark mb-0" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                        {extras.officesCount || '6+'}
                      </div>
                      <div className="small fw-semibold mt-1" style={{ fontSize: '13.5px', color: '#334155' }}>Văn phòng toàn cầu</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="novatech-stat-card">
                      <div className="fw-bold text-dark mb-0" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                        {extras.activeUsers || '14M+'}
                      </div>
                      <div className="small fw-semibold mt-1" style={{ fontSize: '13.5px', color: '#334155' }}>Khách hàng / Users</div>
                    </div>
                  </div>
                </div>

                {/* Thẻ Thông tin doanh nghiệp (Company Overview) */}
                <div className="novatech-overview-card">
                  <h3 className="fw-bold mb-3" style={{ fontSize: '18px', color: '#0F172A' }}>
                    Thông tin doanh nghiệp
                  </h3>

                  <div className="d-flex flex-column">
                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Năm thành lập</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.founded}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Hình thức</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.ownership || 'Doanh nghiệp Cổ phần'}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Vốn / Niêm yết</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.funding || 'Niêm yết HOSE'}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Lĩnh vực</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{selectedCompany.industry}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Quy mô</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{selectedCompany.size}</strong>
                    </div>

                    {companyWebsite && (
                      <div className="novatech-overview-row">
                        <span style={{ color: '#475569', fontWeight: 500 }}>Trang web</span>
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="fw-bold text-decoration-none d-inline-flex align-items-center gap-1"
                          style={{ color: '#EA580C', fontSize: '14.5px' }}
                        >
                          <span>{companyWebsite.replace('https://', '').replace(/\/$/, '')}</span>
                          <span style={{ fontSize: '11px' }}>↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH: DANH SÁCH DOANH NGHIỆP HÀNG ĐẦU
  return (
    <div className="companies-page-root">
      {/* 1. HERO SECTION (Built In Style - Compact Contained Banner) */}
      <section className="builtin-companies-hero-wrap">
        <div className="builtin-hero-card">
          <h1 className="builtin-hero-title">
            Explore top tech companies
          </h1>

          <div className="builtin-filter-bar">
            {/* Location Box (White card with GPS locator) */}
            <div className="builtin-location-box">
              <div className="builtin-location-content">
                <span className="builtin-location-label">Location</span>
                <select
                  className="builtin-location-select"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">Viet Nam</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              <button
                type="button"
                className="builtin-gps-btn"
                title="Đặt lại vị trí mặc định"
                onClick={() => {
                  setSelectedLocation('all');
                  setPage(1);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="7" />
                  <line x1="12" y1="1" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="5" y1="12" x2="1" y2="12" />
                  <line x1="23" y1="12" x2="19" y2="12" />
                  <circle cx="12" cy="12" r="2" fill="#2563EB" />
                </svg>
              </button>
            </div>

            {/* Office Type Dropdown Pill */}
            <div className="builtin-pill-wrap">
              <select
                className="builtin-pill-select"
                value={activeOfficeType}
                onChange={(e) => {
                  setActiveOfficeType(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Office Type</option>
                <option value="onsite">Tại văn phòng</option>
                <option value="hybrid">Linh hoạt (Hybrid)</option>
                <option value="remote">Làm việc từ xa</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Industry Dropdown Pill */}
            <div className="builtin-pill-wrap">
              <select
                className="builtin-pill-select"
                value={activeIndustry}
                onChange={(e) => {
                  setActiveIndustry(e.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">Industry</option>
                <option value="IT - Phần mềm">Công nghệ thông tin</option>
                <option value="Kinh doanh">Kinh doanh - Bán hàng</option>
                <option value="Ngân hàng">Tài chính - Ngân hàng</option>
                <option value="Sản xuất">Sản xuất - Vận hành</option>
                <option value="Bất động sản">Bất động sản</option>
                <option value="Dịch vụ Khách hàng">Dịch vụ - CSKH</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Company Size Dropdown Pill */}
            <div className="builtin-pill-wrap">
              <select
                className="builtin-pill-select"
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Company Size</option>
                <option value="small">50 - 200 nhân sự</option>
                <option value="medium">501 - 1.000 nhân sự</option>
                <option value="large">1.000+ nhân sự</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Vertical Divider */}
            <div className="builtin-divider" />

            {/* All Filters Button */}
            <button
              type="button"
              className={`builtin-all-filters-btn ${showAllFilters || searchKeyword ? 'builtin-all-filters-btn--active' : ''}`}
              onClick={() => setShowAllFilters(!showAllFilters)}
              title="Tìm kiếm từ khóa & bộ lọc chi tiết"
            >
              <span>All Filters</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              className="builtin-reset-btn"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>

          {/* Keyword Search Drawer when All Filters is open */}
          {(showAllFilters || searchKeyword) && (
            <div className="builtin-keyword-drawer">
              <FaSearch size={14} className="text-secondary ms-1 flex-shrink-0" />
              <input
                type="text"
                className="builtin-keyword-input"
                placeholder="Tìm theo tên công ty, từ khóa, công nghệ (Toshiba, FPT, Java, C++...)..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setPage(1);
                }}
                autoFocus
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted p-0 me-1 text-decoration-none"
                  onClick={() => {
                    setSearchKeyword('');
                    setPage(1);
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 2. CATEGORY FILTER & 3. COMPANY SECTION */}
      <div className="container py-4" id="companies-list-section" style={{ maxWidth: '1280px' }}>
        {/* Category Filter Buttons (Pill shaped) */}
        <div className="companies-filter-nav mb-4">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeIndustry === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`companies-pill-btn ${isActive ? 'companies-pill-btn--active' : ''}`}
                onClick={() => {
                  setActiveIndustry(tab.id);
                  setPage(1);
                }}
              >
                {isActive && <span className="companies-pill-accent" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="companies-section-header">
          <div>
            <h2 className="companies-section-title">Doanh nghiệp nổi bật</h2>
            <p className="companies-section-subtitle">
              Khám phá môi trường làm việc và cơ hội nghề nghiệp từ các doanh nghiệp hàng đầu.
            </p>
          </div>

          <div>
            {activeIndustry !== 'ALL' || searchKeyword || selectedLocation !== 'all' || activeOfficeType !== 'all' || selectedSize !== 'all' ? (
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-secondary small fw-semibold"
                onClick={handleResetFilters}
              >
                Xem tất cả →
              </button>
            ) : (
              <span className="small text-muted fw-semibold">
                Hiển thị {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, totalElements)} trên {totalElements} doanh nghiệp
              </span>
            )}
          </div>
        </div>

        {/* 4. COMPANY CARDS (3-COLUMN RESPONSIVE GRID - ITVIEC STYLE) */}
        {filteredCompanies.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <FaBuilding size={42} className="text-muted mb-2 mx-auto" />
            <h3 className="h6 fw-bold text-dark mb-1">Không tìm thấy công ty phù hợp</h3>
            <p className="text-muted small mb-3">Vui lòng thử lại với từ khóa tìm kiếm hoặc danh mục khác.</p>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary mx-auto"
              onClick={handleResetFilters}
            >
              Xem tất cả doanh nghiệp
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4 top-employers-container">
              {paginatedCompanies.map((comp) => {
                const compSkills = getCompanySkills(comp);
                const jobsCount = comp.jobs?.length || 0;
                const locationText = getCompanyLocation(comp);

                return (
                  <div key={comp.id} className="col-12 col-md-6 col-xl-4">
                    <Link
                      to={`/companies?id=${comp.id}`}
                      className="top-employer-item text-decoration-none"
                    >
                      {/* Background ripple vector */}
                      <div className="top-employer-bg-pattern">
                        <img src="/images/bg-top-emp.svg" alt="" aria-hidden="true" />
                      </div>

                      {/* Elevated Logo Card */}
                      <div className="top-employer-img-wrap">
                        <img
                          src={resolveCompanyLogo(comp)}
                          alt={comp.name}
                          className="top-employer-logo-img"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="top-employer-logo-fallback">
                          {(comp.shortName || comp.name).charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Centered Title & Skill Tags */}
                      <div className="top-employer-content">
                        <h3 className="top-employer-name" title={comp.name}>
                          {comp.name}
                        </h3>

                        <div className="top-employer-tags">
                          {compSkills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="top-employer-tag"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSearchKeyword(skill);
                                setPage(1);
                                const el = document.getElementById('companies-list-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              title={`Tìm các công ty với kỹ năng ${skill}`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Split Footer: Location + Jobs Count */}
                      <div className="top-employer-footer">
                        <div className="top-employer-location text-truncate" title={locationText}>
                          {locationText}
                        </div>

                        <div className="top-employer-jobs-count">
                          <span className="top-employer-online-dot">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle opacity="0.2" cx="10" cy="10" r="10" fill="#0AB305" />
                              <circle opacity="0.5" cx="10" cy="10" r="6" fill="#0AB305" />
                              <circle cx="10" cy="10" r="4" fill="#0AB305" />
                            </svg>
                          </span>
                          <span>
                            {jobsCount} {jobsCount === 1 ? 'Job' : 'Jobs'}
                          </span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="top-employer-chevron"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Phân trang chuẩn 10-20 công ty/trang */}
            <div className="d-flex justify-content-center mt-5 mb-2">
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
