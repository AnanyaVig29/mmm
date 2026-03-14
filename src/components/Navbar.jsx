import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import styles from './Navbar.module.css';
import ThemeToggle from './ui/ThemeToggle';
import Icon from './ui/Icon';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/helpers';

export default function Navbar({ totalExpenses, expenseCount, theme, toggleTheme }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [sideOpen,  setSideOpen]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { user, logout }          = useAuth();
  const location                  = useLocation();
  const navRef                    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => { setSideOpen(false); }, [location.pathname]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = sideOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sideOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, { y: -24, opacity: 0, duration: 0.8, ease: 'expo.out' });
    });
    return () => ctx.revert();
  }, []);

  const navLinks = [
    { to: '/',        label: 'Dashboard',  icon: 'dashboard' },
    { to: '/savings', label: 'Savings',    icon: 'savings' },
    { to: '/profile', label: 'Profile',    icon: 'person' },
    { to: '/link-bank', label: 'Banks',    icon: 'account_balance' },
  ];

  return (
    <>
      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} role="navigation">
        <div className={styles.inner}>

          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoMark}>
              <Icon name="payments" size={20} style={{ color: '#0A0A0A' }} />
            </div>
            <span className={styles.logoText}>
              Expense<span className={styles.logoAccent}>Flow</span>
            </span>
          </Link>

          {/* Desktop Links */}
          {user && (
            <div className={styles.links}>
              {navLinks.slice(0, 3).map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`${styles.link} ${location.pathname === l.to ? styles.linkActive : ''}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Controls */}
          <div className={styles.right}>
            {user && (
              <div className={styles.statsChip}>
                <span className={styles.statsAmount}>{formatCurrency(totalExpenses)}</span>
                <span className={styles.statsDivider} />
                <span className={styles.statsCount}>{expenseCount} entries</span>
              </div>
            )}

            {/* Lamp toggle */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {/* Desktop: avatar dropdown */}
            {user ? (
              <div className={styles.userMenu}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setMenuOpen(o => !o)}
                  aria-label="User menu"
                >
                  <span className={styles.avatarInitial}>{user.name.charAt(0).toUpperCase()}</span>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, scale: 0.92, y: -8 }}
                      animate={{ opacity: 1, scale: 1,    y: 0  }}
                      exit={{   opacity: 0, scale: 0.92, y: -8  }}
                      transition={{ duration: 0.18, ease: [0.16,1,0.3,1] }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className={styles.dropdownHeader}>
                        <span className={styles.dropdownName}>{user.name}</span>
                        <span className={styles.dropdownEmail}>{user.email}</span>
                      </div>
                      <div className={styles.dropdownDivider} />
                      <Link to="/profile"   className={styles.dropdownItem}><Icon name="person" size={16} /> Profile & Rewards</Link>
                      <Link to="/link-bank" className={styles.dropdownItem}><Icon name="account_balance" size={16} /> Manage Banks</Link>
                      <div className={styles.dropdownDivider} />
                      <button onClick={logout} className={`${styles.dropdownItem} ${styles.dropdownLogout}`}>
                        <Icon name="logout" size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className={styles.loginBtn}>Sign In</Link>
            )}

            {/* Mobile: hamburger */}
            {user && (
              <button
                className={styles.burger}
                onClick={() => setSideOpen(o => !o)}
                aria-label="Open navigation"
              >
                <span className={`material-symbols-rounded`} style={{ fontSize: 26, color: 'var(--text-primary)' }}>
                  {sideOpen ? 'close' : 'menu'}
                </span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {sideOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSideOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              className={styles.sidebar}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.sideHeader}>
                <div className={styles.sideUser}>
                  <div className={styles.sideAvatar}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.sideName}>{user?.name}</div>
                    <div className={styles.sideEmail}>{user?.email}</div>
                  </div>
                </div>
                <button className={styles.sideClose} onClick={() => setSideOpen(false)}>
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className={styles.sideDivider} />

              <nav className={styles.sideNav}>
                {navLinks.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, ease: [0.16,1,0.3,1], duration: 0.4 }}
                  >
                    <Link
                      to={l.to}
                      className={`${styles.sideLink} ${location.pathname === l.to ? styles.sideLinkActive : ''}`}
                    >
                      <Icon name={l.icon} size={20} />
                      <span>{l.label}</span>
                      {location.pathname === l.to && (
                        <motion.div className={styles.sideActivePip} layoutId="sideActivePip" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className={styles.sideDivider} />

              <div className={styles.sideFooter}>
                <div className={styles.sideStats}>
                  <div className={styles.sideStat}>
                    <span className={styles.sideStatLabel}>Total Spent</span>
                    <span className={styles.sideStatValue}>{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className={styles.sideStat}>
                    <span className={styles.sideStatLabel}>Entries</span>
                    <span className={styles.sideStatValue}>{expenseCount}</span>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setSideOpen(false); }}
                  className={styles.sideLogout}
                >
                  <Icon name="logout" size={16} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
