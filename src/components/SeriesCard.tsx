import Link from 'next/link';
import { SeriesMeta, getPostsInSeries } from '@/lib/posts';

interface SeriesCardProps {
    series: SeriesMeta;
}

export default function SeriesCard({ series }: SeriesCardProps) {
    const posts = getPostsInSeries(series.slug);
    const postCount = posts.length;

    return (
        <Link
            href={`/series/${series.slug}`}
            className="series-card"
            style={{ '--series-color': series.color, '--series-gradient': series.gradient } as React.CSSProperties}
        >
            <div className="series-card__icon-wrap">
                <span className="series-card__icon">{series.icon}</span>
            </div>
            <div className="series-card__body">
                <h3 className="series-card__title">{series.name}</h3>
                <p className="series-card__desc">{series.description}</p>
                <div className="series-card__meta">
                    <span className="series-card__count">
                        📝 {postCount} bài viết
                    </span>
                    <span className="series-card__arrow">Xem series →</span>
                </div>
            </div>
        </Link>
    );
}
