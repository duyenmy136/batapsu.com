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

// Build a map of slug -> absolute file path, scanning subdirectories
function buildSlugMap(): Map<string, string> {
    const map = new Map<string, string>();
    if (!fs.existsSync(postsDirectory)) return map;

    function scan(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                scan(fullPath);
            } else if (entry.name.endsWith('.mdx')) {
                // Strip numbered prefix: "01-ccba-xxx.mdx" -> "ccba-xxx"
                const slug = entry.name.replace(/\.mdx$/, '').replace(/^\d+-/, '');
                map.set(slug, fullPath);
            }
        }
    }

    scan(postsDirectory);
    return map;
}

let _slugMap: Map<string, string> | null = null;
function getSlugMap(): Map<string, string> {
    if (!_slugMap) _slugMap = buildSlugMap();
    return _slugMap;
}

// Invalidate cache (useful in dev)
export function invalidatePostCache() {
    _slugMap = null;
}

function resolvePostPath(slug: string): string | null {
    // Try direct path first (root-level posts)
    const directPath = path.join(postsDirectory, `${slug}.mdx`);
    if (fs.existsSync(directPath)) return directPath;
    // Try slug map (subdirectory posts with numbered prefixes)
    return getSlugMap().get(slug) || null;
}

export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(postsDirectory)) return [];

    const slugMap = buildSlugMap();
    _slugMap = slugMap; // refresh cache
    const posts = Array.from(slugMap.keys())
        .map((slug) => getPostMeta(slug))
        .filter((post): post is PostMeta => post !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export function getPostMeta(slug: string): PostMeta | null {
    try {
        const fullPath = resolvePostPath(slug);
        if (!fullPath) return null;
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
        const fullPath = resolvePostPath(slug);
        if (!fullPath) return null;
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
    return Array.from(buildSlugMap().keys());
}

// ============================================
// Series
// ============================================

const seriesDirectory = path.join(process.cwd(), 'content/series');

export interface SeriesWithContent extends SeriesMeta {
    content: string;
}

export function getAllSeries(): SeriesMeta[] {
    if (!fs.existsSync(seriesDirectory)) return [];

    const fileNames = fs.readdirSync(seriesDirectory);
    return fileNames
        .filter((name) => name.endsWith('.mdx'))
        .map((fileName) => {
            const fullPath = path.join(seriesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                name: data.name || '',
                slug: data.slug || fileName.replace(/\.mdx$/, ''),
                description: data.description || '',
                icon: data.icon || '📚',
                color: data.color || '#8B5CF6',
                gradient: data.gradient || `linear-gradient(135deg, ${data.color || '#8B5CF6'} 0%, ${data.color || '#8B5CF6'}80 100%)`,
            } as SeriesMeta;
        })
        .sort((a, b) => {
            // Sort by order field if available, read from file again
            const aPath = path.join(seriesDirectory, `${a.slug}.mdx`);
            const bPath = path.join(seriesDirectory, `${b.slug}.mdx`);
            const aOrder = matter(fs.readFileSync(aPath, 'utf8')).data.order || 0;
            const bOrder = matter(fs.readFileSync(bPath, 'utf8')).data.order || 0;
            return aOrder - bOrder;
        });
}

export function getSeriesBySlug(slug: string): SeriesMeta | null {
    return getAllSeries().find((s) => s.slug === slug) || null;
}

export function getSeriesWithContent(slug: string): SeriesWithContent | null {
    try {
        const fullPath = path.join(seriesDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            name: data.name || '',
            slug: data.slug || slug,
            description: data.description || '',
            icon: data.icon || '📚',
            color: data.color || '#8B5CF6',
            gradient: data.gradient || `linear-gradient(135deg, ${data.color || '#8B5CF6'} 0%, ${data.color || '#8B5CF6'}80 100%)`,
            content,
        };
    } catch {
        return null;
    }
}

export function getAllSeriesSlugs(): string[] {
    if (!fs.existsSync(seriesDirectory)) return [];
    return fs
        .readdirSync(seriesDirectory)
        .filter((name) => name.endsWith('.mdx'))
        .map((name) => name.replace(/\.mdx$/, ''));
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
