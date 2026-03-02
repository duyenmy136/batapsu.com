import Link from 'next/link';
import Image from 'next/image';
import BlogCard from '@/components/BlogCard';
import Newsletter from '@/components/Newsletter';
import { getAllPosts, getAllCategories, getPostsByCategory } from '@/lib/posts';

export default function HomePage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-shapes">
          <div className="hero__shape hero__shape--1" />
          <div className="hero__shape hero__shape--2" />
          <div className="hero__shape hero__shape--3" />
        </div>

        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <span className="hero__badge">✨ Blog dành cho BA mới bắt đầu</span>
              <h1 className="hero__title">
                Hành trình trở thành{' '}
                <span className="hero__title-highlight">Business Analyst</span>{' '}
                bắt đầu từ đây
              </h1>
              <p className="hero__desc">
                Chia sẻ kiến thức, kinh nghiệm và bí kíp để bạn tự tin bước vào
                nghề BA. Từ cơ bản đến nâng cao, mình đồng hành cùng bạn! 💜
              </p>
              <div className="hero__cta">
                <Link href="/blog" className="btn btn--primary btn--lg">
                  📖 Đọc bài viết
                </Link>
                <Link href="/about" className="btn btn--secondary btn--lg">
                  👋 Về mình
                </Link>
              </div>
            </div>
            <div className="hero__image">
              <Image
                src="/logo.png"
                alt="BA Tập Sự - Cô gái BA dễ thương"
                width={380}
                height={380}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container">
        <div className="stats">
          <div className="stat-card">
            <div className="stat-card__number">{allPosts.length}+</div>
            <div className="stat-card__label">Bài viết</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">{categories.length}</div>
            <div className="stat-card__label">Chủ đề</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">100%</div>
            <div className="stat-card__label">Miễn phí</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">💜</div>
            <div className="stat-card__label">Từ trái tim</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <div className="section__header">
          <p className="section__label">Khám phá</p>
          <h2 className="section__title">8 Chủ đề dành cho bạn</h2>
          <p className="section__subtitle">
            Từ kiến thức nền tảng đến kỹ năng nâng cao, mỗi chủ đề là một viên gạch
            trên hành trình BA của bạn
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => {
            const count = getPostsByCategory(cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="category-card"
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                <span className="category-card__icon">{cat.icon}</span>
                <h3 className="category-card__name">{cat.name}</h3>
                <p className="category-card__desc">{cat.description}</p>
                <p className="category-card__count">{count} bài viết</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured & Recent Posts */}
      {allPosts.length > 0 && (
        <section className="section container">
          <div className="section__header">
            <p className="section__label">Mới nhất</p>
            <h2 className="section__title">Bài viết gần đây</h2>
            <p className="section__subtitle">
              Những bài viết mới nhất được cập nhật liên tục
            </p>
          </div>

          <div className="blog-grid">
            {featuredPost && (
              <BlogCard post={featuredPost} featured />
            )}
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {allPosts.length > 7 && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <Link href="/blog" className="btn btn--primary">
                Xem tất cả bài viết →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Newsletter */}
      <section className="container">
        <Newsletter />
      </section>
    </>
  );
}
