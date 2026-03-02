import { Metadata } from 'next';
import { getAllSeries } from '@/lib/posts';
import SeriesCard from '@/components/SeriesCard';

export const metadata: Metadata = {
    title: 'Series - Chuỗi bài viết',
    description: 'Các chuỗi bài viết có hệ thống giúp bạn ôn thi chứng chỉ IIBA (ECBA, CCBA, CBAP) và nâng cao kiến thức BA.',
};

export default function SeriesPage() {
    const allSeries = getAllSeries();

    return (
        <>
            <section className="page-header">
                <div className="container page-header__content">
                    <h1 className="page-header__title">🎯 Series</h1>
                    <p className="page-header__subtitle">
                        Chuỗi bài viết có hệ thống, giúp bạn học theo lộ trình rõ ràng — từ ôn thi chứng chỉ IIBA đến nâng cao kỹ năng BA
                    </p>
                </div>
            </section>

            <section className="section container">
                <div className="series-grid">
                    {allSeries.map((series) => (
                        <SeriesCard key={series.slug} series={series} />
                    ))}
                </div>
            </section>
        </>
    );
}
