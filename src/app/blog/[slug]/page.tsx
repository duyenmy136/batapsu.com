import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllSlugs, getPostBySlug, getPostsByCategory, getCategoryBySlug, getSeriesForPost } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import BlogCard from '@/components/BlogCard';
import SeriesNav from '@/components/SeriesNav';
import { mdxComponents } from '@/lib/mdx-components';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: 'Không tìm thấy bài viết' };

    const ogImage = post.thumbnail
        ? `https://batapsu.com/images/posts/${post.thumbnail}`
        : 'https://batapsu.com/og-image.png';

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            tags: post.tags,
            images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [ogImage],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return (
            <div className="article container">
                <div className="empty-state">
                    <div className="empty-state__icon">😢</div>
                    <h1 className="empty-state__title">Không tìm thấy bài viết</h1>
                    <p className="empty-state__desc">Bài viết bạn tìm không tồn tại hoặc đã bị xóa.</p>
                    <Link href="/blog" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    const category = getCategoryBySlug(post.categorySlug);
    const relatedPosts = getPostsByCategory(post.categorySlug)
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3);
    const seriesInfo = getSeriesForPost(slug);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <article className="article">
            <div className="container">
                {/* Header */}
                <header className="article__header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div className="article__meta" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)', gap: '1rem' }}>
                        {category && (
                            <Link href={`/categories/${category.slug}`} className="article__category" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-hover)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>
                                {category.icon ? (
                                    <Image src={category.icon} alt={category.name} width={20} height={20} />
                                ) : (
                                    <span>{category.name}</span>
                                )}
                                <span>{category.name}</span>
                            </Link>
                        )}
                        <span className="article__meta-item">👩‍💻 {post.author}</span>
                        <span className="article__meta-item">📅 {formatDate(post.date)}</span>
                        <span className="article__meta-item">⏱ {post.readingTime}</span>
                    </div>
                    <h1 className="article__title" style={{ fontSize: 'var(--text-4xl)', lineHeight: '1.2', marginBottom: 'var(--space-6)', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>{post.title}</h1>
                </header>

                {/* Hero Thumbnail */}
                {post.thumbnail && (
                    <div className="article__hero" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto var(--space-10) auto', aspectRatio: '16/9', position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                        <Image
                            src={`/images/posts/${post.thumbnail}`}
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div className="article__content">
                    <MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="article__tags" style={{ maxWidth: '760px', margin: '0 auto' }}>
                        {post.tags.map((tag) => (
                            <span key={tag} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Series Navigation */}
                {seriesInfo && (
                    <div style={{ maxWidth: '760px', margin: 'var(--space-8) auto 0' }}>
                        <SeriesNav
                            series={seriesInfo.series}
                            posts={seriesInfo.posts}
                            currentIndex={seriesInfo.currentIndex}
                        />
                    </div>
                )}

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="related-posts" style={{ maxWidth: '760px', margin: '0 auto' }}>
                        <div className="section__header" style={{ marginTop: 'var(--space-8)' }}>
                            <h2 className="section__title" style={{ fontSize: 'var(--text-2xl)' }}>
                                Bài viết liên quan
                            </h2>
                        </div>
                        <div className="blog-grid blog-grid--2cols">
                            {relatedPosts.map((p) => (
                                <BlogCard key={p.slug} post={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
