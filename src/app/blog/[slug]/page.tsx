import { Metadata } from 'next';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug, getPostsByCategory, getCategoryBySlug } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogCard from '@/components/BlogCard';

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
                <header className="article__header">
                    {category && (
                        <Link href={`/categories/${category.slug}`} className="article__category">
                            {category.icon} {category.name}
                        </Link>
                    )}
                    <h1 className="article__title">{post.title}</h1>
                    <div className="article__meta">
                        <span className="article__meta-item">👩‍💻 {post.author}</span>
                        <span className="article__meta-item">📅 {formatDate(post.date)}</span>
                        <span className="article__meta-item">⏱ {post.readingTime}</span>
                    </div>
                </header>

                {/* Content */}
                <div className="article__content">
                    <MDXRemote source={post.content} />
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="article__tags" style={{ maxWidth: '760px', margin: '0 auto' }}>
                        {post.tags.map((tag) => (
                            <span key={tag} className="tag">#{tag}</span>
                        ))}
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
