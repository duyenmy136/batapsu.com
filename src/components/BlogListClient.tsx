'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import BlogCard from '@/components/BlogCard';
import { PostMeta } from '@/lib/posts';

interface BlogListClientProps {
    posts: PostMeta[];
    categories: { name: string; slug: string; icon: string }[];
    initialCategory?: string;
}

const POSTS_PER_PAGE = 9;

function isImagePath(icon: string): boolean {
    return icon.startsWith('/') || icon.startsWith('http');
}

export default function BlogListClient({ posts, categories, initialCategory }: BlogListClientProps) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let result = posts;

        if (activeCategory !== 'all') {
            result = result.filter((p) => p.categorySlug === activeCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.excerpt.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        return result;
    }, [posts, activeCategory, search]);

    const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

    return (
        <>
            {/* Search */}
            <div className="search-bar">
                <span className="search-bar__icon">🔍</span>
                <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Tìm kiếm bài viết..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    aria-label="Tìm kiếm bài viết"
                />
            </div>

            {/* Category Filter */}
            <div className="category-filter">
                <button
                    className={`category-filter__btn ${activeCategory === 'all' ? 'category-filter__btn--active' : ''}`}
                    onClick={() => { setActiveCategory('all'); setPage(1); }}
                >
                    Tất cả
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.slug}
                        className={`category-filter__btn ${activeCategory === cat.slug ? 'category-filter__btn--active' : ''}`}
                        onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
                    >
                        {isImagePath(cat.icon) ? (
                            <Image src={cat.icon} alt={cat.name} width={18} height={18} style={{ borderRadius: '4px' }} />
                        ) : (
                            <span>{cat.icon}</span>
                        )}
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            <section className="section container">
                {paginated.length > 0 ? (
                    <>
                        <div className="blog-grid">
                            {paginated.map((post) => (
                                <BlogCard key={post.slug} post={post} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination__btn"
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                >
                                    ←
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        className={`pagination__btn ${page === p ? 'pagination__btn--active' : ''}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="pagination__btn"
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📝</div>
                        <h3 className="empty-state__title">Chưa có bài viết nào</h3>
                        <p className="empty-state__desc">
                            {search ? `Không tìm thấy bài viết cho "${search}"` : 'Bài viết sẽ sớm được cập nhật!'}
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}
