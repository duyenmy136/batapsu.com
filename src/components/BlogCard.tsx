import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

const categoryEmojis: Record<string, string> = {
    'ba-co-ban': '📚',
    'phan-tich-yeu-cau': '🔍',
    'ux-ui-cho-ba': '🎨',
    'agile-scrum': '🚀',
    'cong-cu-ba': '🛠️',
    'sql-data': '📊',
    'soft-skills': '💬',
    'career-tips': '💡',
};

interface BlogCardProps {
    post: PostMeta;
    featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    const emoji = categoryEmojis[post.categorySlug] || '📝';

    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`blog-card ${featured ? 'blog-card--featured' : ''}`}
        >
            <div className="blog-card__thumb">
                <span className="blog-card__thumb-emoji">{emoji}</span>
            </div>

            <div className="blog-card__body">
                <div className="blog-card__meta">
                    <span className="blog-card__category">
                        {emoji} {post.category}
                    </span>
                    <span className="blog-card__date">{formatDate(post.date)}</span>
                    <span className="blog-card__reading-time">⏱ {post.readingTime}</span>
                </div>

                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>

                <div className="blog-card__footer">
                    <div className="blog-card__tags">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="blog-card__tag">#{tag}</span>
                        ))}
                    </div>
                    <span className="blog-card__read-more">
                        Đọc tiếp →
                    </span>
                </div>
            </div>
        </Link>
    );
}
