import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllSeries, getSeriesBySlug, getPostsInSeries } from '@/lib/posts';
import { getCategoryBySlug } from '@/lib/posts';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const series = getAllSeries();
    return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const series = getSeriesBySlug(slug);
    if (!series) return { title: 'Series không tồn tại' };

    return {
        title: `${series.icon} ${series.name}`,
        description: series.description,
    };
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export default async function SeriesDetailPage({ params }: Props) {
    const { slug } = await params;
    const series = getSeriesBySlug(slug);
    const posts = getPostsInSeries(slug);

    if (!series) {
        return (
            <div className="article container">
                <div className="empty-state">
                    <div className="empty-state__icon">🔍</div>
                    <h1 className="empty-state__title">Series không tồn tại</h1>
                    <p className="empty-state__desc">Series bạn tìm không tồn tại.</p>
                    <Link href="/series" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                        ← Quay lại danh sách series
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="series-hero" style={{ '--series-color': series.color, '--series-gradient': series.gradient } as React.CSSProperties}>
                <div className="container">
                    <div className="series-hero__content">
                        <Link href="/series" className="series-hero__back">
                            ← Tất cả Series
                        </Link>
                        <span className="series-hero__icon">{series.icon}</span>
                        <h1 className="series-hero__title">{series.name}</h1>
                        <p className="series-hero__desc">{series.description}</p>
                        <div className="series-hero__stats">
                            <span>📝 {posts.length} bài viết</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section container">
                {posts.length > 0 ? (
                    <div className="series-posts">
                        {posts.map((post, index) => {
                            const category = getCategoryBySlug(post.categorySlug);
                            return (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="series-post-item"
                                >
                                    <div className="series-post-item__number" style={{ background: series.gradient }}>
                                        {index + 1}
                                    </div>
                                    <div className="series-post-item__content">
                                        <div className="series-post-item__meta">
                                            {category && (
                                                <span className="series-post-item__category" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Image src={category.icon} alt={category.name} width={16} height={16} />
                                                    {category.name}
                                                </span>
                                            )}
                                            <span className="series-post-item__date">{formatDate(post.date)}</span>
                                            <span className="series-post-item__time">⏱ {post.readingTime}</span>
                                        </div>
                                        <h3 className="series-post-item__title">{post.title}</h3>
                                        <p className="series-post-item__excerpt">{post.excerpt}</p>
                                    </div>
                                    <span className="series-post-item__arrow">→</span>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📝</div>
                        <h3 className="empty-state__title">Đang chuẩn bị nội dung</h3>
                        <p className="empty-state__desc">
                            Bài viết cho series này sẽ sớm được cập nhật! Hãy quay lại sau nhé 💜
                        </p>
                        <Link href="/series" className="btn btn--secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                            Xem các series khác
                        </Link>
                    </div>
                )}
            </section>
        </>
    );
}
