import Link from 'next/link';
import { SeriesMeta, PostMeta } from '@/lib/posts';

interface SeriesNavProps {
    series: SeriesMeta;
    posts: PostMeta[];
    currentIndex: number;
}

export default function SeriesNav({ series, posts, currentIndex }: SeriesNavProps) {
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    return (
        <div className="series-nav" style={{ '--series-color': series.color, '--series-gradient': series.gradient } as React.CSSProperties}>
            <div className="series-nav__header">
                <Link href={`/series/${series.slug}`} className="series-nav__title">
                    {series.icon} {series.name}
                </Link>
                <span className="series-nav__progress">
                    Bài {currentIndex + 1} / {posts.length}
                </span>
            </div>

            <div className="series-nav__progress-bar">
                <div
                    className="series-nav__progress-fill"
                    style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
                />
            </div>

            <div className="series-nav__links">
                {prevPost ? (
                    <Link href={`/blog/${prevPost.slug}`} className="series-nav__link series-nav__link--prev">
                        <span className="series-nav__link-label">← Bài trước</span>
                        <span className="series-nav__link-title">{prevPost.title}</span>
                    </Link>
                ) : (
                    <div />
                )}
                {nextPost ? (
                    <Link href={`/blog/${nextPost.slug}`} className="series-nav__link series-nav__link--next">
                        <span className="series-nav__link-label">Bài tiếp →</span>
                        <span className="series-nav__link-title">{nextPost.title}</span>
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        </div>
    );
}
