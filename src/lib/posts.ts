import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    category: string;
    categorySlug: string;
    excerpt: string;
    thumbnail: string;
    tags: string[];
    readingTime: string;
    author: string;
    series?: string;
    seriesOrder?: number;
}

export interface SeriesMeta {
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
}

export interface Post extends PostMeta {
    content: string;
}

export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(postsDirectory)) return [];

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .filter((name) => name.endsWith('.mdx'))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '');
            return getPostMeta(slug);
        })
        .filter((post): post is PostMeta => post !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export function getPostMeta(slug: string): PostMeta | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const stats = readingTime(content);

        return {
            slug,
            title: data.title || '',
            date: data.date || '',
            category: data.category || '',
            categorySlug: data.categorySlug || '',
            excerpt: data.excerpt || '',
            thumbnail: data.thumbnail || '',
            tags: data.tags || [],
            readingTime: stats.text.replace('read', 'đọc'),
            author: data.author || 'BA Girl',
            series: data.series || undefined,
            seriesOrder: data.seriesOrder || undefined,
        };
    } catch {
        return null;
    }
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const stats = readingTime(content);

        return {
            slug,
            title: data.title || '',
            date: data.date || '',
            category: data.category || '',
            categorySlug: data.categorySlug || '',
            excerpt: data.excerpt || '',
            thumbnail: data.thumbnail || '',
            tags: data.tags || [],
            readingTime: stats.text.replace('read', 'đọc'),
            author: data.author || 'BA Girl',
            series: data.series || undefined,
            seriesOrder: data.seriesOrder || undefined,
            content,
        };
    } catch {
        return null;
    }
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
    return getAllPosts().filter((post) => post.categorySlug === categorySlug);
}

export function getAllCategories() {
    return [
        { name: 'BA Cơ Bản', slug: 'ba-co-ban', icon: '/images/categories/ba-co-ban.png', description: 'Kiến thức nền tảng, khái niệm, thuật ngữ BA', color: '#8B5CF6' },
        { name: 'Phân Tích Yêu Cầu', slug: 'phan-tich-yeu-cau', icon: '/images/categories/phan-tich-yeu-cau.png', description: 'Kỹ thuật thu thập, phân tích & quản lý requirements', color: '#EC4899' },
        { name: 'UX/UI cho BA', slug: 'ux-ui-cho-ba', icon: '/images/categories/ux-ui-cho-ba.png', description: 'Wireframe, user story mapping, thiết kế trải nghiệm', color: '#F59E0B' },
        { name: 'Agile & Scrum', slug: 'agile-scrum', icon: '/images/categories/agile-scrum.png', description: 'Quy trình Agile, vai trò BA trong Scrum/Kanban', color: '#10B981' },
        { name: 'Công Cụ BA', slug: 'cong-cu-ba', icon: '/images/categories/cong-cu-ba.png', description: 'Jira, Confluence, Figma, Miro và các tool hữu ích', color: '#3B82F6' },
        { name: 'SQL & Data', slug: 'sql-data', icon: '/images/categories/sql-data.svg', description: 'SQL cơ bản, phân tích dữ liệu cho BA', color: '#6366F1' },
        { name: 'Soft Skills', slug: 'soft-skills', icon: '/images/categories/soft-skills.svg', description: 'Giao tiếp, thuyết trình, đàm phán, quản lý stakeholder', color: '#F97316' },
        { name: 'Career & Tips', slug: 'career-tips', icon: '/images/categories/career-tips.svg', description: 'Chia sẻ kinh nghiệm, phỏng vấn, lộ trình nghề nghiệp', color: '#14B8A6' },
    ];
}

export function getCategoryBySlug(slug: string) {
    return getAllCategories().find((cat) => cat.slug === slug) || null;
}

export function getAllSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) return [];
    return fs
        .readdirSync(postsDirectory)
        .filter((name) => name.endsWith('.mdx'))
        .map((name) => name.replace(/\.mdx$/, ''));
}

// ============================================
// Series
// ============================================

export function getAllSeries(): SeriesMeta[] {
    return [
        {
            name: 'Ôn thi ECBA',
            slug: 'on-thi-ecba',
            description: 'Lộ trình ôn thi Entry Certificate in Business Analysis (ECBA) — chứng chỉ đầu tiên của IIBA dành cho người mới bắt đầu nghề BA.',
            icon: '🎓',
            color: '#8B5CF6',
            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)',
        },
        {
            name: 'Ôn thi CCBA',
            slug: 'on-thi-ccba',
            description: 'Lộ trình ôn thi Certification of Capability in Business Analysis (CCBA) — chứng chỉ trung cấp cho BA có 2-3 năm kinh nghiệm.',
            icon: '🏅',
            color: '#EC4899',
            gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)',
        },
        {
            name: 'Ôn thi CBAP',
            slug: 'on-thi-cbap',
            description: 'Lộ trình ôn thi Certified Business Analysis Professional (CBAP) — chứng chỉ cao cấp nhất của IIBA cho Senior BA.',
            icon: '👑',
            color: '#F59E0B',
            gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FDE68A 100%)',
        },
    ];
}

export function getSeriesBySlug(slug: string): SeriesMeta | null {
    return getAllSeries().find((s) => s.slug === slug) || null;
}

export function getPostsInSeries(seriesSlug: string): PostMeta[] {
    return getAllPosts()
        .filter((post) => post.series === seriesSlug)
        .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

export function getSeriesForPost(postSlug: string): { series: SeriesMeta; posts: PostMeta[]; currentIndex: number } | null {
    const post = getPostMeta(postSlug);
    if (!post?.series) return null;

    const series = getSeriesBySlug(post.series);
    if (!series) return null;

    const posts = getPostsInSeries(post.series);
    const currentIndex = posts.findIndex((p) => p.slug === postSlug);

    return { series, posts, currentIndex };
}
