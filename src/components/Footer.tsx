import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/lib/posts';

export default function Footer() {
    const categories = getAllCategories();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <div className="footer__brand-logo">
                            <Image src="/logo.png" alt="BA Tập Sự" width={36} height={36} />
                            <span>BA Tập Sự</span>
                        </div>
                        <p className="footer__brand-desc">
                            Blog chia sẻ kiến thức Business Analysis cho những bạn mới bắt đầu.
                            Từ lý thuyết đến thực hành, giúp bạn tự tin trên hành trình trở thành BA chuyên nghiệp! 💜
                        </p>
                    </div>

                    <div>
                        <h4 className="footer__col-title">Chủ đề</h4>
                        <ul className="footer__links">
                            {categories.slice(0, 4).map((cat) => (
                                <li key={cat.slug}>
                                    <Link href={`/categories/${cat.slug}`} className="footer__cat-link">
                                        <Image src={cat.icon} alt={cat.name} width={20} height={20} className="footer__cat-icon" />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__col-title">Khám phá</h4>
                        <ul className="footer__links">
                            {categories.slice(4).map((cat) => (
                                <li key={cat.slug}>
                                    <Link href={`/categories/${cat.slug}`} className="footer__cat-link">
                                        <Image src={cat.icon} alt={cat.name} width={20} height={20} className="footer__cat-icon" />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__col-title">Liên kết</h4>
                        <ul className="footer__links">
                            <li><Link href="/about">Về mình</Link></li>
                            <li><Link href="/series">Series</Link></li>
                            <li><Link href="/blog">Tất cả bài viết</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright" suppressHydrationWarning>
                        © {new Date().getFullYear()} BA Tập Sự. Made with 💜 by a girl in tech.
                    </p>
                    <div className="footer__social">
                        <a href="#" aria-label="Facebook" title="Facebook">📘</a>
                        <a href="#" aria-label="LinkedIn" title="LinkedIn">💼</a>
                        <a href="#" aria-label="GitHub" title="GitHub">🐱</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
