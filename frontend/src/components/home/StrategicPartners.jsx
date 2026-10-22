import React from 'react';
import { Link } from 'react-router-dom';

const PARTNERS = [
  { id: 1, name: 'FPT', fullName: 'Tập đoàn FPT', logo: '/images/companies/fpt.svg', search: 'FPT' },
  { id: 2, name: 'Viettel', fullName: 'Tập đoàn Công nghiệp - Viễn thông Quân đội Viettel', logo: '/images/companies/viettel.svg', search: 'Viettel' },
  { id: 3, name: 'MB Bank', fullName: 'Ngân hàng TMCP Quân đội', logo: '/images/companies/mb-bank.svg', search: 'MB' },
  { id: 4, name: 'Vinamilk', fullName: 'Công ty Cổ phần Sữa Việt Nam', logo: '/images/companies/vinamilk.svg', search: 'Vinamilk' },
  { id: 5, name: 'MISA', fullName: 'Công ty Cổ phần MISA', logo: '/images/companies/misa.svg', search: 'MISA' },
  { id: 6, name: 'VIB', fullName: 'Ngân hàng Quốc tế VIB', logo: '/images/companies/vib.svg', search: 'VIB' },
  { id: 7, name: 'Toshiba', fullName: 'Toshiba Software Development', logo: '/images/companies/toshiba.svg', search: 'Toshiba' },
  { id: 8, name: 'Vinhomes', fullName: 'Công ty Cổ phần Vinhomes', logo: '/images/companies/vinhomes.svg', search: 'Vinhomes' },
  { id: 9, name: 'Hòa Phát', fullName: 'Tập đoàn Hòa Phát', logo: '/images/companies/hoa-phat.svg', search: 'Hòa Phát' },
  { id: 10, name: 'SSI', fullName: 'Chứng khoán SSI', logo: '/images/companies/ssi.svg', search: 'SSI' },
  { id: 11, name: 'MSB', fullName: 'Ngân hàng Hàng Hải Việt Nam', logo: '/images/companies/msb.svg', search: 'MSB' },
  { id: 12, name: 'Sunhouse', fullName: 'Tập đoàn Sunhouse', logo: '/images/companies/sunhouse.svg', search: 'Sunhouse' },
];

export default function StrategicPartners() {
  const displayPartners = [...PARTNERS, ...PARTNERS];

  return (
    <section className="strategic-partners-section">
      <div className="strategic-partners-header">
        <span className="strategic-partners-eyebrow">ĐỐI TÁC CHIẾN LƯỢC</span>
        <h2 className="strategic-partners-title">Được tin chọn bởi những thương hiệu dẫn đầu</h2>
      </div>

      <div className="strategic-partners-marquee-wrap">
        <div className="strategic-partners-track">
          {displayPartners.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              to={`/jobs/search?keyword=${encodeURIComponent(item.search)}`}
              className="strategic-partner-card"
              title={`${item.fullName} - Xem việc làm`}
            >
              <img
                src={item.logo}
                alt={item.name}
                className="strategic-partner-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
              <span className="strategic-partner-fallback">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
