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
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaNewspaper,
  FaQuestionCircle,
  FaHandsHelping,
} from 'react-icons/fa';
import mockCompanies from '../mock/companies.js';
import { mockBlogs } from '../mock/blogs.js';
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
  const loc = comp.location || 'Hà Nội';
  const l = loc.toLowerCase();
  if (l.includes('hà nội') && (l.includes('tp.hcm') || l.includes('hồ chí minh'))) {
    return 'Hà Nội - TP.HCM';
  }
  if (l.includes('hà nội') || l.includes('ha noi')) {
    return 'Hà Nội';
  }
  if (l.includes('hồ chí minh') || l.includes('tp.hcm') || l.includes('ho chi minh')) {
    return 'TP. Hồ Chí Minh';
  }
  if (l.includes('đà nẵng') || l.includes('da nang')) {
    return 'Đà Nẵng';
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
  if (name.includes('toshiba')) return '/images/companies/toshiba.png';
  if (name.includes('fpt')) return '/images/companies/fpt.png';
  if (name.includes('mb') || name.includes('quân đội')) return '/images/companies/mb-bank.png';
  if (name.includes('vinamilk')) return '/images/companies/vinamilk.png';
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
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [companyTab, setCompanyTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const handleScrollToSection = (tabKey, elementId) => {
    setCompanyTab(tabKey);
    const el = document.getElementById(elementId);
    if (el) {
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Đọc filters trực tiếp từ URL query params
  const filters = useMemo(() => {
    return {
      keyword: searchParams.get('keyword') || '',
      location: searchParams.get('location') || 'all',
      officeType: searchParams.get('office') || 'all',
      industry: searchParams.get('industry') || 'ALL',
      size: searchParams.get('size') || 'all',
      page: parseInt(searchParams.get('page') || '1', 10),
    };
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(filters.keyword);
  useEffect(() => {
    setSearchInput(filters.keyword);
  }, [filters.keyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ keyword: searchInput, page: 1 });
  };

  // Cập nhật URL khi thay đổi bất kỳ bộ lọc nào
  const updateFilters = (newFilters) => {
    const next = { ...filters, ...newFilters };
    const params = new URLSearchParams();
    if (selectedCompanyId) params.set('id', selectedCompanyId);
    if (next.keyword && next.keyword.trim()) params.set('keyword', next.keyword.trim());
    if (next.location && next.location !== 'all') params.set('location', next.location);
    if (next.officeType && next.officeType !== 'all') params.set('office', next.officeType);
    if (next.industry && next.industry !== 'ALL') params.set('industry', next.industry);
    if (next.size && next.size !== 'all') params.set('size', next.size);
    if (next.page && next.page > 1) params.set('page', String(next.page));
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams();
    if (selectedCompanyId) params.set('id', selectedCompanyId);
    setSearchParams(params);
    setShowAllFilters(false);
  };

  // Định vị GPS thực tế qua Browser Geolocation API
  const handleGpsDetect = () => {
    if (filters.location !== 'all') {
      updateFilters({ location: 'all', page: 1 });
      showToast('info', 'Đã đặt lại khu vực về toàn quốc.');
      return;
    }
    if (!navigator.geolocation) {
      showToast('warning', 'Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }
    showToast('info', 'Đang định vị vị trí hiện tại của bạn...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude } = pos.coords;
        let detected = 'Hà Nội';
        if (latitude < 13) {
          detected = 'Hồ Chí Minh';
        } else if (latitude < 18) {
          detected = 'Đà Nẵng';
        }
        updateFilters({ location: detected, page: 1 });
        showToast('success', `Đã định vị thành công khu vực: ${detected}!`);
      },
      () => {
        updateFilters({ location: 'Hà Nội', page: 1 });
        showToast('info', 'Không lấy được tọa độ GPS, mặc định chọn Hà Nội.');
      },
      { timeout: 8000 }
    );
  };

  const [followedIds, setFollowedIds] = useState(() => companyApi.getFollowedIds());
  const [isFollowed, setIsFollowed] = useState(() => {
    if (!selectedCompanyId) return false;
    return companyApi.isFollowed(selectedCompanyId);
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAllFilters) {
        setShowAllFilters(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (showAllFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showAllFilters]);

  const activeChips = useMemo(() => {
    const list = [];
    if (filters.keyword && filters.keyword.trim()) {
      list.push({
        key: 'keyword',
        label: `"${filters.keyword.trim()}"`,
        clearVal: () => updateFilters({ keyword: '', page: 1 }),
      });
    }
    if (filters.location && filters.location !== 'all') {
      list.push({
        key: 'location',
        label: filters.location,
        clearVal: () => updateFilters({ location: 'all', page: 1 }),
      });
    }
    if (filters.officeType && filters.officeType !== 'all') {
      const map = { onsite: 'Tại văn phòng', hybrid: 'Hybrid', remote: 'Làm việc từ xa' };
      list.push({
        key: 'officeType',
        label: map[filters.officeType] || filters.officeType,
        clearVal: () => updateFilters({ officeType: 'all', page: 1 }),
      });
    }
    if (filters.industry && filters.industry !== 'ALL') {
      list.push({
        key: 'industry',
        label: filters.industry,
        clearVal: () => updateFilters({ industry: 'ALL', page: 1 }),
      });
    }
    if (filters.size && filters.size !== 'all') {
      const map = { small: '50 - 200 nhân sự', medium: '501 - 1.000 nhân sự', large: '1.000+ nhân sự' };
      list.push({
        key: 'size',
        label: map[filters.size] || filters.size,
        clearVal: () => updateFilters({ size: 'all', page: 1 }),
      });
    }
    return list;
  }, [filters]);

  useEffect(() => {
    const handleUpdate = () => {
      setFollowedIds(companyApi.getFollowedIds());
      if (selectedCompanyId) {
        setIsFollowed(companyApi.isFollowed(selectedCompanyId));
      }
    };
    window.addEventListener('followed-companies-updated', handleUpdate);
    return () => window.removeEventListener('followed-companies-updated', handleUpdate);
  }, [selectedCompanyId]);

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
      if (!matchIndustry(c.industry, filters.industry)) {
        return false;
      }
      if (!matchLocation(c.location, filters.location)) {
        return false;
      }
      if (!matchOfficeType(c, filters.officeType)) {
        return false;
      }
      if (!matchSize(c.size, filters.size)) {
        return false;
      }
      if (filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase().trim();
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
  }, [companiesList, filters]);

  const totalElements = filteredCompanies.length;
  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1;

  const paginatedCompanies = useMemo(() => {
    const start = (filters.page - 1) * PAGE_SIZE;
    return filteredCompanies.slice(start, start + PAGE_SIZE);
  }, [filteredCompanies, filters.page, PAGE_SIZE]);

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
    const el = document.getElementById('companies-list-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    const compId = Number(selectedCompany.id);
    const nextState = companyApi.toggleFollow(compId);
    setIsFollowed(nextState);
    setFollowedIds(companyApi.getFollowedIds());
    if (nextState) {
      showToast('success', `Đã quan tâm và theo dõi tin tuyển dụng của ${selectedCompany.name}!`);
      window.dispatchEvent(new CustomEvent('open-saved-jobs', { detail: { tab: 'companies' } }));
    } else {
      showToast('info', `Đã hủy theo dõi ${selectedCompany.name}.`);
    }
  };

  const handleToggleFollowCard = (compId, compName) => {
    const nextState = companyApi.toggleFollow(compId);
    setFollowedIds(companyApi.getFollowedIds());
    if (nextState) {
      showToast('success', `Đã quan tâm và theo dõi ${compName}!`);
      window.dispatchEvent(new CustomEvent('open-saved-jobs', { detail: { tab: 'companies' } }));
    } else {
      showToast('info', `Đã bỏ quan tâm ${compName}.`);
    }
  };

  // NẾU ĐANG CHỌN 1 CÔNG TY -> XEM CHI TIẾT CÔNG TY THEO THIẾT KẾ BUILT IN (MCCAIN FOODS FORM)
  if (selectedCompany) {
    const extras = getCompanyExtras(selectedCompany);
    const jobsList = selectedCompany.jobs || [];
    const companyWebsite = extras.website || selectedCompany.website;

    // Danh mục công nghệ thực tế dựa theo lĩnh vực và jobs
    const companyTechStack = [
      'Java',
      'Spring Boot',
      'ReactJS',
      'TypeScript',
      'Cloud AWS',
      'Docker',
      'Kubernetes',
      'PostgreSQL',
      'Microservices',
      'Git / CI/CD',
      ...(selectedCompany.industry?.toLowerCase().includes('ngân hàng') || selectedCompany.industry?.toLowerCase().includes('tài chính')
        ? ['Kafka', 'Oracle DB', 'DevSecOps', 'Fintech API']
        : ['Python', 'AI / ML', 'Redis', 'RESTful API']),
    ];

    // FAQs chuẩn Built In McCain Foods
    const companyFaqs = [
      {
        q: `Môi trường làm việc thực tế tại ${selectedCompany.shortName || selectedCompany.name} như thế nào?`,
        a: `Môi trường làm việc tại ${selectedCompany.name} đề cao tính chuyên nghiệp, cởi mở và khuyến khích đổi mới sáng tạo. Đội ngũ nhân sự được trao quyền tự chủ, tạo điều kiện phát huy tối đa năng lực cá nhân cùng các chế độ đãi ngộ hàng đầu thị trường.`,
      },
      {
        q: `Văn hóa doanh nghiệp và giá trị cốt lõi là gì?`,
        a: `Văn hóa doanh nghiệp xoay quanh các giá trị trọng tâm: Tạo tác động thực tế (Impact-Driven), Tinh thần đồng đội (Collaborative) và Học hỏi không ngừng (Continuous Learning). Mọi thành viên đều được tôn trọng sự đa dạng và đóng góp vào mục tiêu chung.`,
      },
      {
        q: `Chế độ làm việc linh hoạt (Hybrid Workspace) được áp dụng ra sao?`,
        a: `Công ty áp dụng tiêu chuẩn Hybrid linh hoạt với 3 ngày làm việc tại văn phòng hiện đại và 2 ngày làm việc từ xa (Work from home), trang bị đầy đủ máy tính cấu hình cao cùng trợ cấp làm việc tiện nghi.`,
      },
      {
        q: `Cơ hội đào tạo và lộ trình thăng tiến sự nghiệp cho nhân sự?`,
        a: `Doanh nghiệp tài trợ 100% kinh phí thi các chứng chỉ chuyên môn quốc tế (AWS, GCP, PMP, Scum...), chương trình Mentorship 1-1 cùng chuyên gia cấp cao và đánh giá năng lực xét duyệt thăng chức định kỳ hàng năm.`,
      },
      {
        q: `Quy trình ứng tuyển và thời gian phản hồi hồ sơ của JobNest?`,
        a: `Quy trình tinh gọn gồm 3 vòng: Sàng lọc CV (cam kết phản hồi trong 48h) → Phỏng vấn chuyên môn / Kỹ thuật → Trao đổi văn hóa & Offer. Toàn bộ quy trình hoàn toàn miễn phí và minh bạch 100%.`,
      },
    ];

    // Lọc 2 bài viết tin tức liên quan từ mockBlogs
    const relatedArticles = mockBlogs.slice(0, 2);

    return (
      <div className="novatech-page-wrap">
        {/* 1. HERO IDENTITY CANVAS (Built In Header Form) */}
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
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-4">
              <div className="d-flex align-items-center" style={{ gap: '24px' }}>
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
                  <div className="fw-bold text-dark d-none align-items-center justify-content-center w-100 h-100 fs-3">
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

                  <p className="mb-2 fw-semibold" style={{ fontSize: '15px', maxWidth: '780px', color: '#334155', lineHeight: '1.5' }}>
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
                  className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 bg-white"
                  style={{ borderRadius: '10px', padding: '8px 16px', fontWeight: 600, fontSize: '14px', borderColor: '#CBD5E1' }}
                  onClick={handleShare}
                  title="Chia sẻ hồ sơ doanh nghiệp"
                >
                  <FaShareAlt size={13} />
                  <span>Chia sẻ</span>
                </button>

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
                  onClick={() => handleScrollToSection('jobs', 'company-jobs-section')}
                >
                  <FaBriefcase size={13} />
                  <span>Xem việc làm ({jobsList.length})</span>
                </button>
              </div>
            </div>

            {/* Built In Style Key Facts Strip */}
            <div className="novatech-keyfacts-strip">
              <div className="novatech-keyfact-pill">
                <span>📍 Trụ sở chính:</span>
                <strong>{extras.hq || selectedCompany.location}</strong>
              </div>
              <div className="novatech-keyfact-pill">
                <span>🏢 Tổng số văn phòng:</span>
                <strong>{extras.officesCount || '11+'}</strong>
              </div>
              <div className="novatech-keyfact-pill">
                <span>👥 Quy mô:</span>
                <strong>{extras.size || selectedCompany.size}</strong>
              </div>
              <div className="novatech-keyfact-pill">
                <span>📅 Năm thành lập:</span>
                <strong>{extras.founded || '1957'}</strong>
              </div>
              <div className="novatech-keyfact-pill">
                <span>🔥 Đang tuyển dụng:</span>
                <strong style={{ color: '#EA580C' }}>{jobsList.length} vị trí</strong>
              </div>
            </div>

            {/* Built In McCain Foods Signature "We're Hiring!" Department Track */}
            <div className="mccain-hiring-track">
              <span className="mccain-hiring-label">
                <FaFire size={13} className="text-danger" />
                <span>We're Hiring!</span>
              </span>
              <button
                type="button"
                className="mccain-hiring-pill"
                onClick={() => handleScrollToSection('jobs', 'company-jobs-section')}
              >
                <span>Kỹ thuật &amp; Lập trình</span>
                <span className="mccain-hiring-count">{Math.max(1, Math.round(jobsList.length * 0.4))}</span>
              </button>
              <button
                type="button"
                className="mccain-hiring-pill"
                onClick={() => handleScrollToSection('jobs', 'company-jobs-section')}
              >
                <span>Dữ liệu &amp; Trí tuệ nhân tạo</span>
                <span className="mccain-hiring-count">{Math.max(1, Math.round(jobsList.length * 0.2))}</span>
              </button>
              <button
                type="button"
                className="mccain-hiring-pill"
                onClick={() => handleScrollToSection('jobs', 'company-jobs-section')}
              >
                <span>Vận hành &amp; Hệ thống Cloud</span>
                <span className="mccain-hiring-count">{Math.max(1, Math.round(jobsList.length * 0.2))}</span>
              </button>
              <button
                type="button"
                className="mccain-hiring-pill"
                onClick={() => handleScrollToSection('jobs', 'company-jobs-section')}
              >
                <span>Sản phẩm &amp; Kinh doanh</span>
                <span className="mccain-hiring-count">{Math.max(1, Math.round(jobsList.length * 0.2))}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. STICKY SUB-NAV TABS SHELF (Built In McCain Style) */}
        <div className="novatech-subnav-bar">
          <div className="container" style={{ maxWidth: '1240px' }}>
            <div className="novatech-subnav-inner">
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'overview' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('overview', 'company-overview-section')}
              >
                Tổng quan &amp; Sứ mệnh
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'offices' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('offices', 'company-offices-section')}
              >
                Văn phòng &amp; Địa điểm
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'culture' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('culture', 'company-culture-section')}
              >
                Văn hóa &amp; Giá trị
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'jobs' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('jobs', 'company-jobs-section')}
              >
                Cơ hội việc làm ({jobsList.length})
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'perks' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('perks', 'company-perks-section')}
              >
                Chế độ đãi ngộ &amp; Phúc lợi
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'tech' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('tech', 'company-tech-section')}
              >
                Công nghệ sử dụng
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'articles' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('articles', 'company-articles-section')}
              >
                Bài viết &amp; Tin tức
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'faqs' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('faqs', 'company-faqs-section')}
              >
                Hỏi đáp &amp; Góc nhìn (FAQs)
              </button>
              <button
                type="button"
                className={`novatech-subnav-tab ${companyTab === 'info' ? 'novatech-subnav-tab--active' : ''}`}
                onClick={() => handleScrollToSection('info', 'company-info-section')}
              >
                Hồ sơ doanh nghiệp
              </button>
            </div>
          </div>
        </div>

        {/* 3. MAIN 2-COLUMN CONTENT GRID */}
        <div className="container py-4 my-2" style={{ maxWidth: '1240px' }}>
          <div className="row g-4">
            {/* CỘT TRÁI (~68% width): Chi tiết nội dung chuẩn Built In McCain Foods */}
            <div className="col-12 col-lg-8">
              {/* Mục 1: Tổng quan & Giới thiệu doanh nghiệp */}
              <div className="novatech-section-card" id="company-overview-section">
                <div className="novatech-section-eyebrow">GIỚI THIỆU DOANH NGHIỆP</div>
                <h2 className="novatech-section-title">
                  {selectedCompany.name} - Tiên phong phát triển &amp; Chuyển đổi số
                </h2>
                <p style={{ fontSize: '15px', color: '#334155', lineHeight: '1.7', marginBottom: '18px' }}>
                  {selectedCompany.description ||
                    `${selectedCompany.name} là tổ chức hàng đầu hoạt động chuyên sâu trong lĩnh vực ${selectedCompany.industry}, cung cấp các giải pháp công nghệ cao cấp và dịch vụ toàn diện cho khách hàng trên thị trường quốc tế và Việt Nam.`}
                </p>
                <div className="p-3 bg-light rounded-3 border d-flex align-items-center gap-3">
                  <div className="novatech-value-icon m-0" style={{ width: '42px', height: '42px', flexShrink: 0 }}>
                    <FaBuilding size={18} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '14.5px' }}>
                      Mô hình không gian làm việc linh hoạt (Hybrid Workspace)
                    </div>
                    <div className="text-secondary small">
                      Nhân viên kết hợp linh hoạt 3 ngày tại văn phòng hiện đại và 2 ngày làm việc từ xa, trang bị thiết bị tiêu chuẩn cao cấp.
                    </div>
                  </div>
                </div>
              </div>

              {/* Mục 2: Văn phòng & Địa điểm làm việc (Built In McCain Style) */}
              <div className="novatech-section-card" id="company-offices-section">
                <div className="novatech-section-eyebrow">KHÔNG GIAN &amp; ĐỊA ĐIỂM</div>
                <h2 className="novatech-section-title">
                  Mạng lưới văn phòng &amp; Cơ sở hoạt động
                </h2>
                <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                  Tại các cơ sở sản xuất và văn phòng làm việc, chúng tôi tin rằng sự gắn kết mang lại hiệu quả tốt nhất cho đội ngũ. Tiêu chuẩn làm việc tại văn phòng là mô hình Hybrid 3 ngày/tuần, kết hợp làm việc từ xa linh hoạt.
                </p>

                <div className="mccain-office-grid">
                  <div className="mccain-office-card">
                    <div className="d-flex align-items-center gap-2 mb-1.5">
                      <FaBuilding className="text-primary" size={15} />
                      <strong className="text-dark" style={{ fontSize: '15px' }}>Trụ sở chính (HQ)</strong>
                    </div>
                    <div className="text-secondary small mb-1">{extras.hq || selectedCompany.location}</div>
                    <div className="badge bg-white border text-dark fw-semibold" style={{ fontSize: '11.5px' }}>
                      Văn phòng điều hành trung tâm
                    </div>
                  </div>

                  <div className="mccain-office-card">
                    <div className="d-flex align-items-center gap-2 mb-1.5">
                      <FaMapMarkerAlt className="text-danger" size={15} />
                      <strong className="text-dark" style={{ fontSize: '15px' }}>Chi nhánh TP. Hồ Chí Minh</strong>
                    </div>
                    <div className="text-secondary small mb-1">Khu công nghệ cao &amp; Quận 1, TP.HCM</div>
                    <div className="badge bg-white border text-dark fw-semibold" style={{ fontSize: '11.5px' }}>
                      Trung tâm phát triển kinh doanh &amp; AI
                    </div>
                  </div>

                  <div className="mccain-office-card">
                    <div className="d-flex align-items-center gap-2 mb-1.5">
                      <FaMapMarkerAlt className="text-success" size={15} />
                      <strong className="text-dark" style={{ fontSize: '15px' }}>Chi nhánh Đà Nẵng</strong>
                    </div>
                    <div className="text-secondary small mb-1">Công viên phần mềm Đà Nẵng</div>
                    <div className="badge bg-white border text-dark fw-semibold" style={{ fontSize: '11.5px' }}>
                      Trung tâm R&amp;D công nghệ cao
                    </div>
                  </div>

                  <div className="mccain-office-card">
                    <div className="d-flex align-items-center gap-2 mb-1.5">
                      <FaGlobe className="text-warning" size={15} />
                      <strong className="text-dark" style={{ fontSize: '15px' }}>Mạng lưới quốc tế</strong>
                    </div>
                    <div className="text-secondary small mb-1">{extras.offices || 'Hoạt động trên thị trường quốc tế'}</div>
                    <div className="badge bg-white border text-dark fw-semibold" style={{ fontSize: '11.5px' }}>
                      Văn phòng đại diện toàn cầu
                    </div>
                  </div>
                </div>
              </div>

              {/* Mục 3: Văn hóa & Giá trị cốt lõi (Built In 3-Card Grid) */}
              <div className="novatech-section-card" id="company-culture-section">
                <div className="novatech-section-eyebrow">MÔI TRƯỜNG &amp; VĂN HÓA</div>
                <h2 className="novatech-section-title">
                  Văn hóa doanh nghiệp &amp; Giá trị cốt lõi
                </h2>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="novatech-value-box">
                      <div className="novatech-value-icon">
                        <FaBolt size={18} />
                      </div>
                      <h3 className="fw-bold text-dark mb-1.5" style={{ fontSize: '15px' }}>
                        Tác động thực tế
                      </h3>
                      <p className="text-secondary small mb-0" style={{ lineHeight: '1.55' }}>
                        Tập trung giải quyết các bài toán lớn, tạo ra giá trị đột phá và bền vững cho hàng triệu người dùng.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="novatech-value-box">
                      <div className="novatech-value-icon">
                        <FaUserFriends size={18} />
                      </div>
                      <h3 className="fw-bold text-dark mb-1.5" style={{ fontSize: '15px' }}>
                        Gắn kết &amp; Đồng đội
                      </h3>
                      <p className="text-secondary small mb-0" style={{ lineHeight: '1.55' }}>
                        Môi trường cởi mở, minh bạch, tôn trọng sự đa dạng cá nhân và cùng nhau chinh phục mục tiêu lớn.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="novatech-value-box">
                      <div className="novatech-value-icon">
                        <FaLightbulb size={18} />
                      </div>
                      <h3 className="fw-bold text-dark mb-1.5" style={{ fontSize: '15px' }}>
                        Học hỏi không ngừng
                      </h3>
                      <p className="text-secondary small mb-0" style={{ lineHeight: '1.55' }}>
                        Khuyến khích thử nghiệm, tài trợ ngân sách học tập và hỗ trợ thăng tiến sự nghiệp liên tục.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mục 4: Việc làm đang tuyển dụng */}
              <div className="novatech-section-card" id="company-jobs-section">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div className="novatech-section-eyebrow">CƠ HỘI NGHỀ NGHIỆP</div>
                    <h2 className="novatech-section-title mb-0">
                      Vị trí đang mở tuyển dụng tại {selectedCompany.shortName} ({jobsList.length})
                    </h2>
                  </div>
                  <span className="badge bg-white border px-3 py-1.5 rounded-pill fw-semibold shadow-xs" style={{ fontSize: '13px', color: '#EA580C', borderColor: '#FED7AA' }}>
                    Đang tuyển gấp
                  </span>
                </div>

                {jobsList.length === 0 ? (
                  <div className="p-4 bg-light border rounded-3 text-center text-muted">
                    <FaBriefcase size={32} className="text-muted mb-2 mx-auto" />
                    <h3 className="h6 fw-bold text-dark mb-1">Hiện tại chưa có vị trí mở tuyển dụng mới</h3>
                    <p className="text-muted small mb-0">Doanh nghiệp đang hoàn tất đợt tuyển dụng. Vui lòng nhấn "Theo dõi" để nhận thông báo sớm nhất.</p>
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

              {/* Mục 5: Chế độ đãi ngộ & Phúc lợi (Built In McCain Foods 6-Grid Card) */}
              <div className="novatech-section-card" id="company-perks-section">
                <div className="novatech-section-eyebrow">ĐÃI NGỘ &amp; CHẾ ĐỘ</div>
                <h2 className="novatech-section-title">
                  Phúc lợi &amp; Chế độ đãi ngộ toàn diện
                </h2>
                <div className="novatech-perks-grid">
                  <div className="novatech-perk-card">
                    <div className="novatech-perk-header">
                      <div className="novatech-perk-icon-wrap">
                        <FaMoneyBillWave />
                      </div>
                      <h3 className="novatech-perk-title">Lương &amp; Thưởng đãi ngộ</h3>
                    </div>
                    <ul className="novatech-perk-list">
                      <li className="novatech-perk-item">Thu nhập cạnh tranh, thưởng hiệu quả kinh doanh &amp; dự án</li>
                      <li className="novatech-perk-item">Lương tháng 13 &amp; thưởng dịp lễ tết hàng năm</li>
                      <li className="novatech-perk-item">Xét duyệt điều chỉnh tăng lương định kỳ theo năng lực</li>
                    </ul>
                  </div>

                  <div className="novatech-perk-card">
                    <div className="novatech-perk-header">
                      <div className="novatech-perk-icon-wrap">
                        <FaHeartbeat />
                      </div>
                      <h3 className="novatech-perk-title">Sức khỏe &amp; Bảo hiểm</h3>
                    </div>
                    <ul className="novatech-perk-list">
                      <li className="novatech-perk-item">Gói bảo hiểm sức khỏe cao cấp toàn diện (AON / Bảo Việt)</li>
                      <li className="novatech-perk-item">Khám sức khỏe tổng quát định kỳ hàng năm tại viện quốc tế</li>
                      <li className="novatech-perk-item">CLB thể thao, teambuilding, yoga và chăm sóc tinh thần</li>
                    </ul>
                  </div>

                  <div className="novatech-perk-card">
                    <div className="novatech-perk-header">
                      <div className="novatech-perk-icon-wrap">
                        <FaGraduationCap />
                      </div>
                      <h3 className="novatech-perk-title">Đào tạo &amp; Phát triển</h3>
                    </div>
                    <ul className="novatech-perk-list">
                      <li className="novatech-perk-item">Tài trợ 100% kinh phí thi các chứng chỉ quốc tế (AWS, GCP, PMP)</li>
                      <li className="novatech-perk-item">Chương trình Mentorship 1-1 đồng hành cùng chuyên gia</li>
                      <li className="novatech-perk-item">Lộ trình thăng tiến và phát triển sự nghiệp minh bạch</li>
                    </ul>
                  </div>

                  <div className="novatech-perk-card">
                    <div className="novatech-perk-header">
                      <div className="novatech-perk-icon-wrap">
                        <FaUmbrellaBeach />
                      </div>
                      <h3 className="novatech-perk-title">Cân bằng cuộc sống</h3>
                    </div>
                    <ul className="novatech-perk-list">
                      <li className="novatech-perk-item">15+ ngày nghỉ phép năm nguyên lương, chính sách hybrid linh hoạt</li>
                      <li className="novatech-perk-item">Chuyến du lịch công ty (Company Trip) nghỉ dưỡng hàng năm</li>
                      <li className="novatech-perk-item">Quà tặng và ngày hội gắn kết gia đình nhân viên (Family Day)</li>
                    </ul>
                  </div>

                  <div className="novatech-perk-card">
                    <div className="novatech-perk-header">
                      <div className="novatech-perk-icon-wrap">
                        <FaHandsHelping />
                      </div>
                      <h3 className="novatech-perk-title">Hòa nhập &amp; Đa dạng</h3>
                    </div>
                    <ul className="novatech-perk-list">
                      <li className="novatech-perk-item">Môi trường bình đẳng giới, không phân biệt đối xử</li>
                      <li className="novatech-perk-item">Tôn trọng sự đa dạng văn hóa và quốc tịch nhân viên</li>
                      <li className="novatech-perk-item">Các nhóm hỗ trợ và phát triển cộng đồng nội bộ (ERG)</li>
                    </ul>
                  </div>

                  <div className="novatech-perk-card">
                    <div className="novatech-perk-header">
                      <div className="novatech-perk-icon-wrap">
                        <FaAward />
                      </div>
                      <h3 className="novatech-perk-title">Ghi nhận &amp; Tôn vinh</h3>
                    </div>
                    <ul className="novatech-perk-list">
                      <li className="novatech-perk-item">Giải thưởng nhân viên xuất sắc hàng quý (Star of Quarter)</li>
                      <li className="novatech-perk-item">Giải thưởng sáng kiến cải tiến công nghệ (Innovation Award)</li>
                      <li className="novatech-perk-item">Khen thưởng cống hiến gắn bó lâu năm (Long Service Award)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mục 6: Công nghệ & Hệ sinh thái sử dụng */}
              <div className="novatech-section-card" id="company-tech-section">
                <div className="novatech-section-eyebrow">TECH STACK &amp; TOOLS</div>
                <h2 className="novatech-section-title">
                  Công nghệ &amp; Hệ sinh thái sử dụng (Technology We Use)
                </h2>
                <div className="d-flex flex-wrap gap-2">
                  {companyTechStack.map((tech, idx) => (
                    <span key={idx} className="novatech-tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mục 7: Bài viết & Tin tức doanh nghiệp (Built In McCain "Articles We're In") */}
              <div className="novatech-section-card" id="company-articles-section">
                <div className="novatech-section-eyebrow">BÀI VIẾT &amp; TIN TỨC</div>
                <h2 className="novatech-section-title">
                  Tin tức &amp; Góc nhìn văn hóa (Articles We're In)
                </h2>
                <div className="d-flex flex-column gap-3">
                  {relatedArticles.map((art) => (
                    <Link
                      key={art.id}
                      to={`/blog/${art.id}`}
                      className="mccain-article-card"
                    >
                      <img
                        src={art.cover}
                        alt={art.title}
                        className="mccain-article-img"
                        loading="lazy"
                      />
                      <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1.5">
                            <span className="badge bg-warning-subtle text-warning-emphasis fw-bold" style={{ fontSize: '11px' }}>
                              {art.category}
                            </span>
                            <span className="text-muted small">• {art.date}</span>
                            <span className="text-muted small">• {art.readTime}</span>
                          </div>
                          <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                            {art.title}
                          </h3>
                          <p className="text-secondary small mb-0 text-truncate-2" style={{ lineHeight: '1.5' }}>
                            {art.excerpt}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-2 text-primary fw-bold small">
                          <span>Đọc bài viết chi tiết</span>
                          <FaArrowRight size={11} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mục 8: Hỏi đáp & Góc nhìn văn hóa (Built In McCain FAQs Accordion) */}
              <div className="novatech-section-card" id="company-faqs-section">
                <div className="novatech-section-eyebrow">HỎI ĐÁP &amp; INSIGHTS</div>
                <h2 className="novatech-section-title">
                  Câu hỏi thường gặp về {selectedCompany.shortName || selectedCompany.name} (Company FAQs)
                </h2>
                <div className="d-flex flex-column">
                  {companyFaqs.map((faq, idx) => {
                    const isOpen = expandedFaq === idx;
                    return (
                      <div
                        key={idx}
                        className={`mccain-faq-item ${isOpen ? 'mccain-faq-item--open' : ''}`}
                      >
                        <button
                          type="button"
                          className="mccain-faq-header"
                          onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                          aria-expanded={isOpen}
                        >
                          <span className="d-flex align-items-center gap-2">
                            <FaQuestionCircle className="text-secondary" size={14} />
                            <span>{faq.q}</span>
                          </span>
                          {isOpen ? (
                            <FaChevronUp size={12} className="text-primary flex-shrink-0" />
                          ) : (
                            <FaChevronDown size={12} className="text-muted flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && <div className="mccain-faq-body">{faq.a}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (~32% width): Quick Stats & Company Overview */}
            <div className="col-12 col-lg-4" id="company-info-section">
              <div className="d-flex flex-column gap-3.5 novatech-sidebar-sticky">
                {/* 2 Thẻ Stats đầu tiên */}
                <div className="row g-2.5">
                  <div className="col-6">
                    <div className="novatech-stat-card">
                      <div className="fw-bold text-dark mb-0" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                        {extras.officesCount || '11+'}
                      </div>
                      <div className="small fw-semibold mt-1" style={{ fontSize: '13.5px', color: '#334155' }}>Văn phòng hoạt động</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="novatech-stat-card">
                      <div className="fw-bold text-dark mb-0" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                        {extras.activeUsers || '20M+'}
                      </div>
                      <div className="small fw-semibold mt-1" style={{ fontSize: '13.5px', color: '#334155' }}>Khách hàng / Users</div>
                    </div>
                  </div>
                </div>

                {/* Thẻ Thông tin doanh nghiệp (Company Overview) */}
                <div className="novatech-overview-card">
                  <h3 className="fw-bold mb-3" style={{ fontSize: '18px', color: '#0F172A' }}>
                    Hồ sơ doanh nghiệp
                  </h3>

                  <div className="d-flex flex-column">
                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Năm thành lập</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.founded || '1957'}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Hình thức sở hữu</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.ownership || 'Tập đoàn Tư nhân'}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Vốn / Niêm yết</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.funding || 'Niêm yết HOSE'}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Lĩnh vực kinh doanh</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{selectedCompany.industry}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Quy mô nhân sự</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{selectedCompany.size}</strong>
                    </div>

                    <div className="novatech-overview-row">
                      <span style={{ color: '#475569', fontWeight: 500 }}>Trụ sở chính</span>
                      <strong style={{ color: '#0F172A', fontWeight: 700 }}>{extras.hq || selectedCompany.location}</strong>
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

                {/* Thẻ cam kết uy tín tuyển dụng (JobNest Verified Partner) */}
                <div className="novatech-trust-box">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="novatech-verified-badge" style={{ width: '22px', height: '22px' }}>
                      <FaCheck size={11} />
                    </span>
                    <strong style={{ color: '#9A3412', fontSize: '15px' }}>Doanh nghiệp xác thực JobNest</strong>
                  </div>
                  <p className="small text-secondary mb-3" style={{ lineHeight: '1.5' }}>
                    Hồ sơ pháp lý và thông tin tuyển dụng của doanh nghiệp đã được JobNest thẩm định an toàn và minh bạch 100%.
                  </p>
                  <div className="d-flex flex-column gap-1.5 small" style={{ color: '#431407' }}>
                    <div>✓ Cam kết phản hồi ứng viên trong 48h</div>
                    <div>✓ Không phát sinh chi phí ứng tuyển</div>
                    <div>✓ Bảo mật thông tin hồ sơ tuyệt đối</div>
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
      {/* 1. HERO SECTION (Title + Search Bar - scrolls away naturally) */}
      <section className="builtin-companies-hero-wrap">
        <div className="builtin-hero-inner">
          <h1 className="builtin-hero-title">
            Khám phá các công ty công nghệ hàng đầu
          </h1>

          {/* Thanh tìm kiếm công ty (Search Bar) */}
          <form className="builtin-search-bar" onSubmit={handleSearchSubmit}>
            <FaSearch size={16} className="builtin-search-icon" />
            <input
              type="text"
              className="builtin-search-input"
              placeholder="Tìm kiếm công ty theo tên, kỹ năng, ngành nghề..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="builtin-search-clear"
                onClick={() => {
                  setSearchInput('');
                  updateFilters({ keyword: '', page: 1 });
                }}
                aria-label="Xóa từ khóa"
              >
                ✕
              </button>
            )}
            <button type="submit" className="builtin-search-submit-btn">
              Tìm công ty
            </button>
          </form>
        </div>
      </section>

      {/* 2. STICKY FILTER BAR (Cố định các button đi theo khi lướt xuống) */}
      <div className="builtin-filter-sticky-bar">
        <div className="builtin-hero-inner">
          {/* Thanh lọc chuẩn Built In theo đúng ảnh mẫu (Single-row Toolbar) */}
          <div className="builtin-filter-bar">
            {/* Thẻ Địa điểm trắng bo góc kèm icon GPS */}
            <div className={`builtin-location-box ${filters.location !== 'all' ? 'builtin-location-box--active' : ''}`}>
              <div className="builtin-location-content">
                <span className="builtin-location-label">ĐỊA ĐIỂM</span>
                <select
                  className="builtin-location-select"
                  value={filters.location}
                  onChange={(e) => updateFilters({ location: e.target.value, page: 1 })}
                >
                  <option value="all">Việt Nam</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              <button
                type="button"
                className="builtin-gps-btn"
                title={filters.location !== 'all' ? 'Đặt lại toàn quốc' : 'Định vị GPS vị trí hiện tại'}
                onClick={handleGpsDetect}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="7" />
                  <line x1="12" y1="1" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="5" y1="12" x2="1" y2="12" />
                  <line x1="23" y1="12" x2="19" y2="12" />
                  <circle cx="12" cy="12" r="2" fill="#EA580C" />
                </svg>
              </button>
            </div>

            {/* Hình thức làm việc (Office Type) */}
            <div className={`builtin-pill-wrap ${filters.officeType !== 'all' ? 'builtin-pill-wrap--active' : ''}`}>
              <select
                className="builtin-pill-select"
                value={filters.officeType}
                onChange={(e) => updateFilters({ officeType: e.target.value, page: 1 })}
              >
                <option value="all">Hình thức làm việc</option>
                <option value="onsite">Tại văn phòng</option>
                <option value="hybrid">Linh hoạt (Hybrid)</option>
                <option value="remote">Làm việc từ xa</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Ngành nghề (Industry) */}
            <div className={`builtin-pill-wrap ${filters.industry !== 'ALL' ? 'builtin-pill-wrap--active' : ''}`}>
              <select
                className="builtin-pill-select"
                value={filters.industry}
                onChange={(e) => updateFilters({ industry: e.target.value, page: 1 })}
              >
                <option value="ALL">Ngành nghề</option>
                <option value="IT - Phần mềm">Công nghệ thông tin</option>
                <option value="Kinh doanh">Kinh doanh - Bán hàng</option>
                <option value="Ngân hàng">Tài chính - Ngân hàng</option>
                <option value="Sản xuất">Sản xuất - Vận hành</option>
                <option value="Bất động sản">Bất động sản</option>
                <option value="Dịch vụ Khách hàng">Dịch vụ - CSKH</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Quy mô công ty (Company Size) */}
            <div className={`builtin-pill-wrap ${filters.size !== 'all' ? 'builtin-pill-wrap--active' : ''}`}>
              <select
                className="builtin-pill-select"
                value={filters.size}
                onChange={(e) => updateFilters({ size: e.target.value, page: 1 })}
              >
                <option value="all">Quy mô công ty</option>
                <option value="small">50 - 200 nhân sự</option>
                <option value="medium">501 - 1.000 nhân sự</option>
                <option value="large">1.000+ nhân sự</option>
              </select>
              <span className="builtin-pill-caret">▼</span>
            </div>

            {/* Phân cách đứng */}
            <div className="builtin-divider" />

            {/* Tất cả bộ lọc (All Filters Offcanvas) */}
            <button
              type="button"
              className={`builtin-all-filters-btn ${activeChips.length > 0 ? 'builtin-all-filters-btn--active' : ''}`}
              onClick={() => setShowAllFilters(true)}
              title="Mở tất cả bộ lọc"
            >
              <span>Tất cả bộ lọc</span>
              {activeChips.length > 0 && (
                <span
                  className="badge bg-white text-danger font-monospace fw-bold rounded-pill"
                  style={{ fontSize: '10px', padding: '2px 6px' }}
                >
                  +{activeChips.length}
                </span>
              )}
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

            {/* Xóa lọc (Reset) */}
            <button
              type="button"
              className="builtin-reset-btn"
              onClick={handleResetFilters}
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* OFFCANVAS ALL FILTERS DRAWER (Chuẩn phong cách BuiltIn.com/companies) */}
      {showAllFilters && (
        <div
          className="builtin-offcanvas-backdrop"
          onClick={() => setShowAllFilters(false)}
        />
      )}

      <div
        className={`builtin-offcanvas ${showAllFilters ? 'builtin-offcanvas--open' : ''}`}
        aria-hidden={!showAllFilters}
      >
        <div className="builtin-offcanvas-header">
          <h2 className="builtin-offcanvas-title">Tất cả bộ lọc</h2>
          <button
            type="button"
            className="builtin-offcanvas-close"
            onClick={() => setShowAllFilters(false)}
            aria-label="Đóng bộ lọc"
          >
            ✕
          </button>
        </div>

        <div className="builtin-offcanvas-body">
          {activeChips.length > 0 && (
            <div className="p-3 rounded-3 mb-3" style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold text-dark">
                  Đang chọn ({activeChips.length} tiêu chí)
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0 text-danger small fw-semibold"
                  onClick={handleResetFilters}
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {activeChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="badge bg-white text-dark border d-inline-flex align-items-center gap-1 py-1 px-2"
                    style={{ fontSize: '11px', cursor: 'pointer' }}
                    onClick={() => chip.clearVal()}
                    title="Nhấn để gỡ"
                  >
                    {chip.label}
                    <FaTimes size={8} className="text-muted" />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 1. Từ khóa / Tên công ty */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Tên doanh nghiệp hoặc từ khóa</span>
              {filters.keyword && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ keyword: '', page: 1 })}
                >
                  Xóa
                </button>
              )}
            </div>
            <div className="job-filter-input-wrap">
              <FaSearch size={12} className="text-muted ms-2.5 flex-shrink-0" />
              <input
                type="text"
                className="job-filter-input"
                placeholder="Nhập tên doanh nghiệp, kỹ năng, chức danh..."
                value={filters.keyword}
                onChange={(e) => updateFilters({ keyword: e.target.value, page: 1 })}
              />
              {filters.keyword && (
                <button
                  type="button"
                  className="job-filter-clear-btn"
                  onClick={() => updateFilters({ keyword: '', page: 1 })}
                  aria-label="Xóa từ khóa"
                >
                  <FaTimes size={10} />
                </button>
              )}
            </div>
          </div>

          {/* 2. Hình thức làm việc */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Hình thức làm việc (Office Type)</span>
              {filters.officeType !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ officeType: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Tất cả hình thức' },
                { value: 'onsite', label: 'Tại văn phòng (On-site)' },
                { value: 'hybrid', label: 'Linh hoạt (Hybrid)' },
                { value: 'remote', label: 'Làm việc từ xa (Fully Remote)' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.officeType === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="comp_filter_office"
                    value={opt.value}
                    checked={filters.officeType === opt.value}
                    onChange={() => updateFilters({ officeType: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Ngành nghề */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Ngành nghề kinh doanh</span>
              {filters.industry !== 'ALL' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ industry: 'ALL', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'ALL', label: 'Tất cả ngành nghề' },
                { value: 'IT - Phần mềm', label: 'Công nghệ thông tin' },
                { value: 'Kinh doanh', label: 'Kinh doanh - Bán hàng' },
                { value: 'Ngân hàng', label: 'Tài chính - Ngân hàng' },
                { value: 'Sản xuất', label: 'Sản xuất - Vận hành' },
                { value: 'Bất động sản', label: 'Bất động sản' },
                { value: 'Dịch vụ Khách hàng', label: 'Dịch vụ - CSKH' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.industry === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="comp_filter_industry"
                    value={opt.value}
                    checked={filters.industry === opt.value}
                    onChange={() => updateFilters({ industry: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Quy mô công ty */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Quy mô công ty (Company Size)</span>
              {filters.size !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ size: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Tất cả quy mô' },
                { value: 'small', label: '50 - 200 nhân sự' },
                { value: 'medium', label: '501 - 1.000 nhân sự' },
                { value: 'large', label: '1.000+ nhân sự' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.size === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="comp_filter_size"
                    value={opt.value}
                    checked={filters.size === opt.value}
                    onChange={() => updateFilters({ size: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Địa điểm */}
          <div className="builtin-offcanvas-section">
            <div className="builtin-offcanvas-section-title">
              <span>Địa điểm (Location)</span>
              {filters.location !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link text-muted p-0 text-decoration-none small"
                  style={{ fontSize: '11.5px' }}
                  onClick={() => updateFilters({ location: 'all', page: 1 })}
                >
                  Đặt lại
                </button>
              )}
            </div>
            <div className="builtin-offcanvas-radio-list">
              {[
                { value: 'all', label: 'Toàn quốc (Việt Nam)' },
                { value: 'Hà Nội', label: 'Hà Nội' },
                { value: 'Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
                { value: 'Đà Nẵng', label: 'Đà Nẵng' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`builtin-offcanvas-radio-item ${filters.location === opt.value ? 'builtin-offcanvas-radio-item--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="comp_filter_location"
                    value={opt.value}
                    checked={filters.location === opt.value}
                    onChange={() => updateFilters({ location: opt.value, page: 1 })}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="builtin-offcanvas-footer">
          <button
            type="button"
            className="btn btn-link text-uppercase text-muted fw-bold p-0 text-decoration-none"
            style={{ fontSize: '13px', letterSpacing: '0.04em' }}
            onClick={handleResetFilters}
          >
            Xóa tất cả
          </button>
          <button
            type="button"
            className="builtin-offcanvas-submit-btn"
            onClick={() => setShowAllFilters(false)}
          >
            Xem kết quả ({filteredCompanies.length})
          </button>
        </div>
      </div>

      {/* 2. COMPANY SECTION */}
      <div className="container py-4" id="companies-list-section" style={{ maxWidth: '1280px' }}>
        {/* Active chips strip */}
        {activeChips.length > 0 && (
          <div className="filter-active-chips-wrap mb-3">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                className="filter-active-chip"
                onClick={() => chip.clearVal()}
                title={`Bỏ lọc ${chip.label}`}
              >
                <span>{chip.label}</span>
                <FaTimes size={9} />
              </button>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none text-muted p-0 ms-2 small"
              onClick={handleResetFilters}
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="companies-section-header">
          <div>
            <h2 className="companies-section-title">Doanh nghiệp nổi bật</h2>
            <p className="companies-section-subtitle">
              Khám phá môi trường làm việc và cơ hội nghề nghiệp từ các doanh nghiệp hàng đầu.
            </p>
          </div>

          <div>
            {filters.industry !== 'ALL' || filters.keyword || filters.location !== 'all' || filters.officeType !== 'all' || filters.size !== 'all' ? (
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 text-secondary small fw-semibold"
                onClick={handleResetFilters}
              >
                Xem tất cả →
              </button>
            ) : (
              <span className="small text-muted fw-semibold">
                Hiển thị {(filters.page - 1) * PAGE_SIZE + 1} - {Math.min(filters.page * PAGE_SIZE, totalElements)} trên {totalElements} doanh nghiệp
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
                      className="top-employer-item text-decoration-none position-relative"
                    >
                      {/* Background ripple vector */}
                      <div className="top-employer-bg-pattern">
                        <img src="/images/bg-top-emp.svg" alt="" aria-hidden="true" />
                      </div>

                      {/* Nút Quan tâm công ty góc trên phải */}
                      <button
                        type="button"
                        className={`top-employer-follow-btn ${
                          followedIds.some((id) => Number(id) === Number(comp.id))
                            ? 'top-employer-follow-btn--active'
                            : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFollowCard(comp.id, comp.name);
                        }}
                        title={
                          followedIds.some((id) => Number(id) === Number(comp.id))
                            ? 'Bỏ quan tâm công ty'
                            : 'Quan tâm công ty này'
                        }
                      >
                        {followedIds.some((id) => Number(id) === Number(comp.id)) ? (
                          <FaBookmark size={11} />
                        ) : (
                          <FaRegBookmark size={11} />
                        )}
                        <span>
                          {followedIds.some((id) => Number(id) === Number(comp.id))
                            ? 'Đã quan tâm'
                            : 'Quan tâm'}
                        </span>
                      </button>

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
                            {jobsCount} Việc làm
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
                page={filters.page}
                totalPages={totalPages}
                onChange={handlePageChange}
                alwaysShow
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
