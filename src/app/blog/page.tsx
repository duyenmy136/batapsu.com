import { Metadata } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/posts';
import BlogListClient from '@/components/BlogListClient';

export const metadata: Metadata = {
    title: 'Tất cả bài viết',
    description: 'Tổng hợp tất cả bài viết về Business Analysis - từ kiến thức cơ bản đến nâng cao.',
};

export default function BlogPage() {
    const posts = getAllPosts();
    const categories = getAllCategories();

    return (
        <>
            <section className="page-header">
                <div className="container page-header__content">
                    <h1 className="page-header__title">📖 Tất cả bài viết</h1>
                    <p className="page-header__subtitle">
                        Khám phá kiến thức BA từ cơ bản đến nâng cao, được viết dễ hiểu và thực tế
                    </p>
                    <BlogListClient posts={posts} categories={categories} />
                </div>
            </section>
        </>
    );
}
