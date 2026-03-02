'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Trang chủ' },
        { href: '/blog', label: 'Bài viết' },
        { href: '/about', label: 'Về mình' },
    ];

    return (
        <>
            <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
                <div className="header__inner">
                    <Link href="/" className="header__logo">
                        <Image
                            src="/logo.png"
                            alt="BA Tập Sự Logo"
                            width={44}
                            height={44}
                            className="header__logo-img"
                        />
                        <span className="header__logo-text">BA Tập Sự</span>
                    </Link>

                    <nav className="header__nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="header__nav-link"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="header__actions">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </header>

            <div className={`mobile-nav ${mobileOpen ? 'mobile-nav--open' : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="mobile-nav__link"
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </>
    );
}
