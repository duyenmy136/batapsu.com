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
        { name: 'BA Cơ Bản', slug: 'ba-co-ban', icon: '📚', description: 'Kiến thức nền tảng, khái niệm, thuật ngữ BA', color: '#8B5CF6' },
        { name: 'Phân Tích Yêu Cầu', slug: 'phan-tich-yeu-cau', icon: '🔍', description: 'Kỹ thuật thu thập, phân tích & quản lý requirements', color: '#EC4899' },
        { name: 'UX/UI cho BA', slug: 'ux-ui-cho-ba', icon: '🎨', description: 'Wireframe, user story mapping, thiết kế trải nghiệm', color: '#F59E0B' },
        { name: 'Agile & Scrum', slug: 'agile-scrum', icon: '🚀', description: 'Quy trình Agile, vai trò BA trong Scrum/Kanban', color: '#10B981' },
        { name: 'Công Cụ BA', slug: 'cong-cu-ba', icon: '🛠️', description: 'Jira, Confluence, Figma, Miro và các tool hữu ích', color: '#3B82F6' },
        { name: 'SQL & Data', slug: 'sql-data', icon: '📊', description: 'SQL cơ bản, phân tích dữ liệu cho BA', color: '#6366F1' },
        { name: 'Soft Skills', slug: 'soft-skills', icon: '💬', description: 'Giao tiếp, thuyết trình, đàm phán, quản lý stakeholder', color: '#F97316' },
        { name: 'Career & Tips', slug: 'career-tips', icon: '💡', description: 'Chia sẻ kinh nghiệm, phỏng vấn, lộ trình nghề nghiệp', color: '#14B8A6' },
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
