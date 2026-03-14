import { useState, useMemo, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Navbar            from './components/Navbar';
import ExpenseForm       from './components/ExpenseForm';
import ExpenseList       from './components/ExpenseList';
import SummaryPanel      from './components/SummaryPanel';
import CurrencyConverter from './components/CurrencyConverter';
import TrendsGraph       from './components/TrendsGraph';
import SavingsVault      from './components/SavingsVault';
import VaultMonthlyReport from './components/VaultMonthlyReport';
import LiveBankFeed      from './components/LiveBankFeed';
import VaultBadgePopup   from './components/VaultBadgePopup';
import Login             from './components/Login';
import Signup            from './components/Signup';
import Profile           from './components/Profile';
import BankLink          from './components/BankLink';
import SavingsPage       from './components/SavingsPage';
import Footer            from './components/Footer';

import { useAuth }       from './hooks/useAuth';
import useCursor         from './hooks/useCursor';
import useVaultFeatures  from './hooks/useVaultFeatures';
import { formatCurrency } from './utils/helpers';
import Icon from './components/ui/Icon';

import styles from './App.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { user, savings } = useAuth();
  const location = useLocation();
  const { cursorRef, followerRef } = useCursor();
  const { playSFX } = useVaultFeatures();

  const [theme, setTheme] = useState(() => localStorage.getItem('ef-theme') || 'dark');
  const [expenses, setExpenses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ef-expenses') || '[]'); }
    catch { return []; }
  });
  const [recentBadge, setRecentBadge] = useState(null);

  // Badge milestone detection
  useEffect(() => {
    const lastBadge = savings.badges[savings.badges.length - 1];
    if (!lastBadge) return;
    const shown = JSON.parse(localStorage.getItem('ef-shown-badges') || '[]');
    if (!shown.includes(lastBadge)) {
      setRecentBadge(lastBadge);
      localStorage.setItem('ef-shown-badges', JSON.stringify([...shown, lastBadge]));
    }
  }, [savings.badges]);

  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Theme sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ef-theme', theme);
  }, [theme]);

  // Expense persistence
  useEffect(() => {
    localStorage.setItem('ef-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense    = (e)   => { setExpenses(p => [e, ...p]); playSFX('success'); };
  const deleteExpense = (id)  => setExpenses(p => p.filter(e => e.id !== id));
  const totalSpent    = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  const isAuthRoute = ['/login', '/signup', '/link-bank'].includes(location.pathname);

  return (
    <div className={styles.root} data-theme={theme}>
      <div ref={cursorRef}    className="cursor-dot" />
      <div ref={followerRef}  className="cursor-follower" />

      {!isAuthRoute && (
        <Navbar
          totalExpenses={totalSpent}
          expenseCount={expenses.length}
          theme={theme}
          toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        />
      )}

      <Routes>
        <Route path="/login"     element={!user ? <Login />    : <Navigate to="/" />} />
        <Route path="/signup"    element={!user ? <Signup />   : <Navigate to={user?.onboardingComplete ? '/' : '/link-bank'} />} />
        <Route path="/link-bank" element={user  ? <BankLink /> : <Navigate to="/login" />} />
        <Route path="/profile"   element={user  ? <Profile />  : <Navigate to="/login" />} />
        <Route path="/savings"   element={user  ? <SavingsPage /> : <Navigate to="/login" />} />
        <Route path="/" element={
          !user ? <Navigate to="/login" /> :
          !user.onboardingComplete ? <Navigate to="/link-bank" /> :
          <Dashboard
            expenses={expenses}
            addExpense={addExpense}
            deleteExpense={deleteExpense}
            totalSpent={totalSpent}
          />
        } />
      </Routes>

      <VaultBadgePopup
        badge={recentBadge}
        coupon={savings.coupons.find(c => c.title.includes(recentBadge?.split(' ')[0]))}
        onClose={() => setRecentBadge(null)}
      />

      {!isAuthRoute && <Footer />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Dashboard Page
   ───────────────────────────────────────────── */
function Dashboard({ expenses, addExpense, deleteExpense, totalSpent }) {
  const { cards, savings } = useAuth();
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Grid scroll reveal with stagger
      gsap.from('.js-grid-item', {
        y: 56, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.js-grid', start: 'top 88%' },
      });
      // Stats pop in
      gsap.from('.js-stat-pill', {
        scale: 0.88, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.js-stats-row', start: 'top 92%' },
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const heroVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const heroItem = {
    hidden:  { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <main ref={mainRef} className={styles.dashboard}>

      {/* ── Hero ── */}
      <motion.section
        className={`${styles.hero} js-hero`}
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.heroLeft} variants={heroItem}>
          <motion.div className={styles.statusTag} variants={heroItem}>
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            <span className="mono" style={{ fontSize: '0.65rem' }}>System Active</span>
          </motion.div>
          <motion.h1 className={styles.heroTitle} variants={heroItem}>
            Your Financial<br />
            <span className="gradient-text">Vault.</span>
          </motion.h1>
          <motion.p className={styles.heroSub} variants={heroItem}>
            Track every rupee. Build every habit. Unlock rewards as you save.
          </motion.p>

          {/* Linked Cards Strip */}
          {cards.length > 0 && (
            <motion.div className={styles.cardStrip} variants={heroItem}>
              {cards.slice(0, 3).map(c => (
                <div key={c.id} className={styles.miniCard} style={{ '--c': c.color }}>
                  <span className={styles.miniBank}>{c.bankName}</span>
                  <span className={styles.miniNum}>•••• {c.lastFour}</span>
                </div>
              ))}
              <Link to="/link-bank" className={styles.addCardChip}>+ Add</Link>
            </motion.div>
          )}
        </motion.div>

        {/* Savings Vault (hero right) — parallax wrapper */}
        <motion.div
          className={styles.heroRight}
          variants={heroItem}
          whileInView={{ y: [10, 0] }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <SavingsVault />
        </motion.div>
      </motion.section>

      {/* ── Stat Pills ── */}
      <div className={`${styles.statsRow} js-stats-row`}>
        <StatPill label="Total Spent" value={formatCurrency(totalSpent)}  icon="payments"     color="var(--danger)"  />
        <StatPill label="Total Saved" value={formatCurrency(savings.amount)} icon="savings"  color="var(--primary)" />
        <StatPill label="Entries"     value={`${expenses.length} items`}  icon="receipt_long" color="var(--accent)"  />
      </div>

      {/* ── Main Grid ── */}
      <div className={`${styles.mainGrid} js-grid`}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <div className="js-grid-item"><ExpenseForm onAddExpense={addExpense} /></div>
            <div className="js-grid-item"><LiveBankFeed /></div>
            <div className="js-grid-item"><CurrencyConverter totalExpenses={totalSpent} /></div>
          </div>
        </aside>

        {/* Feed */}
        <section className={styles.feed}>
          <div className={styles.chartsRow}>
            <div className="js-grid-item"><SummaryPanel expenses={expenses} /></div>
            <div className="js-grid-item"><TrendsGraph   expenses={expenses} /></div>
          </div>
          <div className="js-grid-item"><VaultMonthlyReport expenses={expenses} /></div>
          <div className="js-grid-item"><ExpenseList expenses={expenses} onDelete={deleteExpense} /></div>
        </section>
      </div>
    </main>
  );
}

function StatPill({ label, value, icon, color }) {
  return (
    <motion.div
      className={`${styles.statPill} js-stat-pill`}
      whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className={styles.statIcon} style={{ background: `${color}16`, color }}>
        <Icon name={icon} size={22} />
      </div>
      <div className={styles.statInfo}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
      </div>
    </motion.div>
  );
}

