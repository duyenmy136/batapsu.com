import Image from 'next/image';
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

const categoryStyles: Record<string, { emoji: string; gradient: string; pattern: string; icon: string; customIcon?: string }> = {
    'ba-co-ban': {
        emoji: '📚',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 30%, #C4B5FD 60%, #DDD6FE 100%)',
        pattern: '📊 💼 📋 📝 🎯',
        icon: '📚',
        customIcon: '/images/categories/ba-co-ban.png'
    },
    'phan-tich-yeu-cau': {
        emoji: '🔍',
        gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 30%, #FBCFE8 60%, #FCE7F3 100%)',
        pattern: '📝 ✅ 🔎 📊 🎯',
        icon: '🔍',
        customIcon: '/images/categories/phan-tich-yeu-cau.png'
    },
    'ux-ui-cho-ba': {
        emoji: '🎨',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 30%, #FDE68A 60%, #FEF3C7 100%)',
        pattern: '🎨 📱 🖥️ ✨ 🖌️',
        icon: '🎨',
        customIcon: '/images/categories/ux-ui-cho-ba.png'
    },
    'agile-scrum': {
        emoji: '🚀',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 30%, #93C5FD 60%, #DBEAFE 100%)',
        pattern: '🏃 🔄 📋 🎯 ⚡',
        icon: '🚀',
        customIcon: '/images/categories/agile-scrum.png'
    },
    'cong-cu-ba': {
        emoji: '🛠️',
        gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 30%, #6EE7B7 60%, #D1FAE5 100%)',
        pattern: '⚙️ 🔧 💻 📊 🛠️',
        icon: '🛠️',
        customIcon: '/images/categories/cong-cu-ba.png'
    },
    'sql-data': {
        emoji: '📊',
        gradient: 'linear-gradient(135deg, #6366F1 0%, #818CF8 30%, #A5B4FC 60%, #E0E7FF 100%)',
        pattern: '🗄️ 📈 💾 🔢 📊',
        icon: '📊',
        customIcon: '/images/categories/sql-data.svg'
    },
    'soft-skills': {
        emoji: '💬',
        gradient: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 30%, #FDA4AF 60%, #FFE4E6 100%)',
        pattern: '🗣️ 🤝 💡 👂 ✨',
        icon: '💬',
        customIcon: '/images/categories/soft-skills.svg'
    },
    'career-tips': {
        emoji: '💡',
        gradient: 'linear-gradient(135deg, #D946EF 0%, #E879F9 30%, #F0ABFC 60%, #FAE8FF 100%)',
        pattern: '🌟 🎓 💼 🚀 💡',
        icon: '💡',
        customIcon: '/images/categories/career-tips.svg'
    },
};

const defaultStyle = {
    emoji: '📝',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 30%, #C4B5FD 60%, #DDD6FE 100%)',
    pattern: '📝 📋 📊 ✅ 🎯',
    icon: '📝',
};

interface BlogCardProps {
    post: PostMeta;
    featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    const style = categoryStyles[post.categorySlug] || defaultStyle;

    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`blog-card ${featured ? 'blog-card--featured' : ''}`}
        >
            <div
                className="blog-card__thumb"
                style={{ background: post.thumbnail ? 'none' : style.gradient, position: 'relative' }}
            >
                {post.thumbnail ? (
                    <Image
                        src={`/images/posts/${post.thumbnail}`}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <>
                        <div className="blog-card__thumb-pattern">{style.pattern}</div>
                        <span className="blog-card__thumb-emoji">{style.icon}</span>
                    </>
                )}
            </div>

            <div className="blog-card__body">
                <div className="blog-card__meta">
                    <span className="blog-card__category" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {style.customIcon ? (
                            <Image src={style.customIcon} alt={post.category} width={16} height={16} />
                        ) : (
                            style.emoji
                        )}{' '}
                        {post.category}
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
