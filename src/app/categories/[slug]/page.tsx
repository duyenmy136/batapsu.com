import { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories, getPostsByCategory, getCategoryBySlug } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = getAllCategories();
    return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    if (!category) return { title: 'Chủ đề không tồn tại' };

    return {
        title: `${category.name} - Bài viết`,
        description: category.description,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    const posts = getPostsByCategory(slug);

    if (!category) {
        return (
            <div className="article container">
                <div className="empty-state">
                    <div className="empty-state__icon">🔍</div>
                    <h1 className="empty-state__title">Chủ đề không tồn tại</h1>
                    <p className="empty-state__desc">Chủ đề bạn tìm không tồn tại.</p>
                    <Link href="/" className="btn btn--primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                        ← Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="page-header">
                <div className="container page-header__content">
                    <h1 className="page-header__title">
                        {category.icon} {category.name}
                    </h1>
                    <p className="page-header__subtitle">{category.description}</p>
                </div>
            </section>

            <section className="section container">
                {posts.length > 0 ? (
                    <div className="blog-grid">
                        {posts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📝</div>
                        <h3 className="empty-state__title">Chưa có bài viết nào</h3>
                        <p className="empty-state__desc">
                            Bài viết cho chủ đề này sẽ sớm được cập nhật!
                        </p>
                        <Link href="/blog" className="btn btn--secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                            Xem tất cả bài viết
                        </Link>
                    </div>
                )}
            </section>
        </>
    );
}
