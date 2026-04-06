'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useI18n } from '@/lib/i18n';
import { LoginModal } from '@/components/auth/login-modal';
import { Menu, X } from 'lucide-react';
import styles from './header.module.css';

export function Header() {
    const { locale, setLocale, labels } = useI18n();
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string } | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user: u } }) => {
            setUser(u);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const toggleLocale = () => {
        setLocale(locale === 'ar' ? 'en' : 'ar');
    };

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setDrawerOpen(false);
        router.push('/');
        router.refresh();
    };

    const handleLoginClick = () => {
        setDrawerOpen(false);
        setLoginOpen(true);
    };

    const closeDrawer = () => setDrawerOpen(false);

    const navLinks = (
        <>
            <Link href="/" className={styles.navLink} onClick={closeDrawer}>
                {labels.nav.home}
            </Link>
            <Link href="/find" className={styles.navLink} onClick={closeDrawer}>
                {labels.nav.directory}
            </Link>
            <Link href="/onboarding" className={styles.navLink} onClick={closeDrawer}>
                {labels.nav.register}
            </Link>
            <Link href="/about" className={styles.navLink} onClick={closeDrawer}>
                {labels.nav.about}
            </Link>
            <Link href="/faq" className={styles.navLink} onClick={closeDrawer}>
                {labels.nav.faq}
            </Link>
        </>
    );

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <Image src="/logo.png" alt="Misbah" width={56} height={56} priority />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={styles.desktopNav}>
                        {navLinks}
                    </nav>

                    {/* Desktop Actions */}
                    <div className={styles.desktopActions}>
                        <button
                            type="button"
                            className={styles.langToggle}
                            onClick={toggleLocale}
                            aria-label="Toggle language"
                        >
                            {locale === 'ar' ? 'EN' : 'AR'}
                        </button>

                        {user ? (
                            <>
                                <Link href="/admin" className={styles.loginButton} onClick={closeDrawer}>
                                    {labels.auth?.dashboard || 'Dashboard'}
                                </Link>
                                <button
                                    type="button"
                                    className={styles.ghostButton}
                                    onClick={handleSignOut}
                                >
                                    {labels.auth?.signOut || 'Sign Out'}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className={styles.loginButton}
                                onClick={handleLoginClick}
                            >
                                {labels.nav.login}
                            </button>
                        )}
                    </div>

                    {/* Mobile: lang toggle + hamburger */}
                    <div className={styles.mobileActions}>
                        <button
                            type="button"
                            className={styles.langToggle}
                            onClick={toggleLocale}
                            aria-label="Toggle language"
                        >
                            {locale === 'ar' ? 'EN' : 'AR'}
                        </button>
                        <button
                            type="button"
                            className={styles.menuButton}
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            {drawerOpen && (
                <div className={styles.overlay} onClick={closeDrawer}>
                    <nav
                        className={styles.drawer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.drawerHeader}>
                            <div className={styles.drawerBrand}>
                                <Image src="/logo.png" alt="Misbah" width={48} height={48} />
                            </div>
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={closeDrawer}
                                aria-label="Close menu"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.drawerLinks}>
                            {navLinks}
                        </div>

                        <div className={styles.drawerFooter}>
                            {user ? (
                                <>
                                    <Link href="/admin" className={styles.drawerLoginButton} onClick={closeDrawer}>
                                        {labels.auth?.dashboard || 'Dashboard'}
                                    </Link>
                                    <button
                                        type="button"
                                        className={styles.drawerGhostButton}
                                        onClick={handleSignOut}
                                    >
                                        {labels.auth?.signOut || 'Sign Out'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.drawerLoginButton}
                                    onClick={handleLoginClick}
                                >
                                    {labels.nav.login}
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            )}

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
    );
}
