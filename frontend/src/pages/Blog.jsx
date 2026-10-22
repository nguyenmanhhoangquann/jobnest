import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FaSearch,
  FaClock,
  FaCalendarAlt,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaTag,
  FaNewspaper,
  FaBookmark,
  FaFire,
} from 'react-icons/fa';
import mockBlogs from '../mock/blogs.js';

const FALLBACK_BLOG_COVER =
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_AUTHOR_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80';

const BLOG_CATEGORIES = [
  'Tất cả',
  'Kinh nghiệm ứng tuyển',
  'Công nghệ & Lập trình',
  'Xu hướng tuyển dụng AI',
  'Kỹ năng phỏng vấn',
];

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBlogId = searchParams.get('id');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Lọc bài viết
  const filteredBlogs = useMemo(() => {
    return mockBlogs.filter((post) => {
      if (activeCategory !== 'Tất cả' && post.category !== activeCategory) {
        return false;
      }
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        return (
          post.title.toLowerCase().includes(kw) ||
          post.excerpt.toLowerCase().includes(kw) ||
          post.tags?.some((t) => t.toLowerCase().includes(kw))
        );
      }
      return true;
    });
  }, [searchKeyword, activeCategory]);

  const selectedBlog = useMemo(() => {
    if (!selectedBlogId) return null;
    return mockBlogs.find((b) => String(b.id) === String(selectedBlogId));
  }, [selectedBlogId]);

  // Bài viết tiêu điểm
  const featuredBlog = useMemo(() => {
    return mockBlogs.find((b) => b.featured) || mockBlogs[0];
  }, []);

  // XEM CHI TIẾT BÀI VIẾT
  if (selectedBlog) {
    const relatedBlogs = mockBlogs
      .filter((b) => b.id !== selectedBlog.id)
      .slice(0, 3);

    return (
      <div className="awwwards-blog-root py-4">
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Nút quay lại */}
          <div className="mb-4">
            <button
              type="button"
              className="btn btn-link text-decoration-none p-0 text-muted small d-inline-flex align-items-center gap-1.5 fw-medium"
              onClick={() => setSearchParams({})}
            >
              <FaArrowLeft size={12} />
              <span>Quay lại bài viết</span>
            </button>
          </div>

          {/* Chi tiết bài viết */}
          <article className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge text-white py-1.5 px-3 rounded-pill fw-semibold" style={{ background: '#EA580C', fontSize: '11px', letterSpacing: '0.5px' }}>
                {selectedBlog.category.toUpperCase()}
              </span>
              <span className="text-muted small d-inline-flex align-items-center gap-1">
                <FaClock size={11} /> {selectedBlog.readTime}
              </span>
              <span className="text-muted small mx-1">•</span>
              <span className="text-muted small d-inline-flex align-items-center gap-1">
                <FaEye size={12} /> {selectedBlog.views} lượt xem
              </span>
            </div>

            <h1 className="display-6 fw-bold text-dark mb-3" style={{ lineHeight: '1.3', letterSpacing: '-0.02em' }}>
              {selectedBlog.title}
            </h1>

            {/* Thông tin tác giả */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 py-3 border-top border-bottom mb-4">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={selectedBlog.author.avatar}
                  alt={selectedBlog.author.name}
                  className="rounded-circle object-fit-cover shadow-sm border"
                  style={{ width: '46px', height: '46px' }}
                  onError={(e) => { e.currentTarget.src = FALLBACK_AUTHOR_AVATAR; }}
                />
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>
                    {selectedBlog.author.name}
                  </div>
                  <div className="text-muted small">{selectedBlog.author.role}</div>
                </div>
              </div>

              <div className="text-muted small d-flex align-items-center gap-2">
                <FaCalendarAlt size={12} className="text-secondary" />
                <span>Xuất bản: {selectedBlog.date}</span>
              </div>
            </div>

            {/* Ảnh bìa bài viết */}
            <div className="rounded-4 overflow-hidden mb-4 shadow-sm" style={{ maxHeight: '440px' }}>
              <img
                src={selectedBlog.cover}
                alt={selectedBlog.title}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => { e.currentTarget.src = FALLBACK_BLOG_COVER; }}
              />
            </div>

            {/* Nội dung bài viết */}
            <div
              className="blog-content-body text-dark"
              style={{ fontSize: '16.5px', lineHeight: '1.85', color: '#24292F' }}
            >
              {selectedBlog.content.split('\n\n').map((paragraph, idx) => {
                const text = paragraph.trim();
                if (!text) return null;

                if (text.startsWith('### ')) {
                  return (
                    <h2 key={idx} className="h4 fw-bold text-dark mt-4 mb-3 pt-2">
                      {text.replace('### ', '')}
                    </h2>
                  );
                }
                if (text.startsWith('#### ')) {
                  return (
                    <h3 key={idx} className="h5 fw-bold text-dark mt-3 mb-2">
                      {text.replace('#### ', '')}
                    </h3>
                  );
                }
                if (text.startsWith('> ')) {
                  return (
                    <blockquote
                      key={idx}
                      className="p-3.5 my-3.5 border-start border-4 rounded-end bg-light text-secondary fst-italic"
                      style={{ borderColor: '#111827 !important' }}
                    >
                      {text.replace('> ', '')}
                    </blockquote>
                  );
                }
                if (text.startsWith('---')) {
                  return <hr key={idx} className="my-4 text-muted opacity-25" />;
                }

                return (
                  <p key={idx} className="mb-3 text-secondary" style={{ color: '#374151' }}>
                    {text}
                  </p>
                );
              })}
            </div>

            {/* Tags bài viết */}
            <div className="pt-4 border-top mt-4 d-flex align-items-center flex-wrap gap-2">
              <span className="small text-muted fw-semibold me-1">
                <FaTag className="me-1" size={11} /> Chủ đề:
              </span>
              {selectedBlog.tags?.map((t) => (
                <span key={t} className="badge bg-light text-secondary border py-1.5 px-2.5 rounded-pill small">
                  #{t}
                </span>
              ))}
            </div>
          </article>

          {/* Bài viết liên quan */}
          <div className="mb-5">
            <h2 className="h5 fw-bold text-dark mb-3">Bài viết liên quan</h2>
            <div className="row g-3">
              {relatedBlogs.map((b) => (
                <div key={b.id} className="col-12 col-md-4">
                  <div
                    className="awwwards-card"
                    onClick={() => setSearchParams({ id: b.id })}
                  >
                    <div className="awwwards-card-media" style={{ aspectRatio: '16/9' }}>
                      <img
                        src={b.cover}
                        alt={b.title}
                        className="awwwards-card-img"
                        onError={(e) => { e.currentTarget.src = FALLBACK_BLOG_COVER; }}
                      />
                    </div>
                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <span className="badge bg-light text-dark border align-self-start mb-2" style={{ fontSize: '11px' }}>
                        {b.category}
                      </span>
                      <h3 className="h6 fw-bold text-dark text-truncate-2 mb-2" style={{ fontSize: '14.5px' }}>
                        {b.title}
                      </h3>
                      <div className="text-muted small mt-auto pt-2 border-top d-flex justify-content-between">
                        <span>{b.date}</span>
                        <span>{b.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH: THEO PHONG CÁCH AWWWARDS "Explore these popular posts."
  return (
    <div className="awwwards-blog-root">
      {/* 1. EDITORIAL HEADER SECTION */}
      <section className="awwwards-header-section">
        <div className="container" style={{ maxWidth: '1280px' }}>
          <div>
            <span className="awwwards-tagline">
              <FaFire size={13} />
              CẨM NANG SỰ NGHIỆP // KINH NGHIỆM THỰC CHIẾN
            </span>
          </div>

          <h1 className="awwwards-main-headline">
            Khám phá bài viết &amp; kinh nghiệm nổi bật
          </h1>

          <p className="awwwards-sub-desc">
            Tổng hợp kiến thức tối ưu hồ sơ chuẩn ATS, lộ trình kỹ thuật Full-Stack và bí quyết phỏng vấn thực chiến từ các chuyên gia công nghệ.
          </p>

          {/* Modern Sleek Search Wrap */}
          <div className="awwwards-search-wrap">
            <FaSearch className="text-muted flex-shrink-0" size={15} />
            <input
              type="text"
              className="awwwards-search-input"
              placeholder="Tìm theo chủ đề, công nghệ (ATS, Spring Boot, React, Lương...)..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="button"
              className="awwwards-search-btn"
              onClick={() => {}}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILL FILTER & POSTS */}
      <div className="container py-4" style={{ maxWidth: '1280px' }}>
        {/* Category Filter Pills */}
        <div className="awwwards-filters-bar mb-4">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`awwwards-pill ${isActive ? 'awwwards-pill--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* 3. FEATURED STORY HERO (Chỉ hiện khi ở tab Tất cả và chưa gõ tìm kiếm) */}
        {!searchKeyword && activeCategory === 'Tất cả' && featuredBlog && (
          <div
            className="awwwards-featured-box"
            onClick={() => setSearchParams({ id: featuredBlog.id })}
          >
            <div className="row g-0 align-items-center">
              <div className="col-12 col-lg-7">
                <div className="awwwards-featured-img-wrap">
                  <span className="awwwards-featured-badge">
                    BÀI VIẾT NỔI BẬT
                  </span>
                  <img
                    src={featuredBlog.cover}
                    alt={featuredBlog.title}
                    className="awwwards-featured-img"
                    onError={(e) => { e.currentTarget.src = FALLBACK_BLOG_COVER; }}
                  />
                </div>
              </div>

              <div className="col-12 col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-between h-100">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2.5">
                    <span className="badge text-white px-2.5 py-1 rounded-pill" style={{ background: '#EA580C', fontSize: '11px', letterSpacing: '0.5px' }}>
                      {featuredBlog.category.toUpperCase()}
                    </span>
                    <span className="text-muted small">•</span>
                    <span className="text-muted small">{featuredBlog.readTime}</span>
                  </div>

                  <h2 className="h3 fw-bold text-dark mb-3" style={{ lineHeight: '1.3', letterSpacing: '-0.02em' }}>
                    {featuredBlog.title}
                  </h2>

                  <p className="text-secondary small mb-4" style={{ lineHeight: '1.65', fontSize: '14.5px' }}>
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="pt-3.5 border-top d-flex align-items-center justify-content-between mt-auto">
                  <div className="d-flex align-items-center gap-2.5">
                    <img
                      src={featuredBlog.author.avatar}
                      alt={featuredBlog.author.name}
                      className="awwwards-author-avatar"
                      onError={(e) => { e.currentTarget.src = FALLBACK_AUTHOR_AVATAR; }}
                    />
                    <div>
                      <div className="awwwards-author-name">{featuredBlog.author.name}</div>
                      <div className="awwwards-post-date">{featuredBlog.date}</div>
                    </div>
                  </div>

                  <div className="awwwards-arrow-circle">
                    <FaArrowRight size={13} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. GRID CÁC BÀI VIẾT (AWWWARDS EDITORIAL 3 CỘT) */}
        {filteredBlogs.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <FaNewspaper size={42} className="text-muted mb-2 mx-auto" />
            <h3 className="h6 fw-bold text-dark mb-1">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-muted small mb-3">Vui lòng thử lại với từ khóa hoặc chuyên mục khác.</p>
            <button
              type="button"
              className="btn btn-sm btn-brand mx-auto rounded-pill px-4 text-white"
              style={{ background: '#EA580C' }}
              onClick={() => {
                setSearchKeyword('');
                setActiveCategory('Tất cả');
              }}
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredBlogs.map((post) => (
              <div key={post.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="awwwards-card"
                  onClick={() => setSearchParams({ id: post.id })}
                >
                  {/* Media wrapper with floating category */}
                  <div className="awwwards-card-media">
                    <img
                      src={post.cover}
                      alt={post.title}
                      className="awwwards-card-img"
                      onError={(e) => { e.currentTarget.src = FALLBACK_BLOG_COVER; }}
                    />
                    <span className="awwwards-card-category-floating">
                      {post.category}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="awwwards-card-body">
                    <div className="awwwards-meta-top">
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="awwwards-card-title text-truncate-2">
                      {post.title}
                    </h3>

                    <p className="awwwards-card-excerpt">
                      {post.excerpt}
                    </p>

                    {/* Card Footer: Author + Circular Arrow Button */}
                    <div className="awwwards-card-footer">
                      <div className="awwwards-author-meta">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="awwwards-author-avatar"
                          onError={(e) => { e.currentTarget.src = FALLBACK_AUTHOR_AVATAR; }}
                        />
                        <span className="awwwards-author-name">
                          {post.author.name}
                        </span>
                      </div>

                      <div className="awwwards-arrow-circle" title="Đọc bài viết">
                        <FaArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
