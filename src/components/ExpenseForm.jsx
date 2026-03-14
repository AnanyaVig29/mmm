import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import gsap from 'gsap';
import useVaultFeatures from '../hooks/useVaultFeatures';
import styles from './ExpenseForm.module.css';

const categories = [
  { id: 'Food',          icon: 'restaurant',    color: '#34d399', sound: 'coin' },
  { id: 'Transport',     icon: 'local_shipping',color: '#38bdf8', sound: 'coin' },
  { id: 'Shopping',      icon: 'shopping_bag',  color: '#f472b6', sound: 'coin' },
  { id: 'Health',        icon: 'favorite',      color: '#fb7185', sound: 'success' },
  { id: 'Entertainment', icon: 'sports_esports',color: '#a78bfa', sound: 'coin' },
  { id: 'Bills',         icon: 'receipt_long',  color: '#fbbf24', sound: 'vault-lock' },
  { id: 'Travel',        icon: 'flight',        color: '#22d3ee', sound: 'coin' },
  { id: 'Other',         icon: 'help',          color: '#94a3b8', sound: 'coin' },
];

export default function VaultExpenseForm({ onAddExpense }) {
  const [name, setName]         = useState('');
  const [amount, setAmount]     = useState('');
  const [category, setCategory] = useState(categories[0].id);
  const [isStoring, setIsStoring] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeAnim, setActiveAnim] = useState(null);

  const { playSFX, getFunnyComment, speak } = useVaultFeatures();
  const formRef = useRef(null);
  const btnRef  = useRef(null);

  // Category loading animation
  useEffect(() => {
    const cat = categories.find(c => c.id === category);
    setActiveAnim(cat?.id);
    const t = setTimeout(() => setActiveAnim(null), 600);
    return () => clearTimeout(t);
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || isStoring) return;

    setIsStoring(true);
    playSFX('vault-lock');

    /* 1 — "slide into vault" animation on the form */
    gsap.to(formRef.current, {
      y: 60, scale: 0.93, opacity: 0,
      duration: 0.45, ease: 'power4.in',
      onComplete() {
        const comment = getFunnyComment(category);
        setFeedback(comment);
        speak(comment);

        onAddExpense({
          id:       Date.now(),
          name,
          amount:   parseFloat(amount),
          category,
          date:     new Date().toISOString(),
        });

        setName('');
        setAmount('');
        setIsStoring(false);

        /* 2 — spring back */
        gsap.to(formRef.current, {
          y: 0, scale: 1, opacity: 1,
          duration: 0.7, delay: 0.2,
          ease: 'back.out(1.8)',
          onComplete: () => setTimeout(() => setFeedback(null), 2500),
        });
      },
    });
  };

  const activeCat = categories.find(c => c.id === category);

  return (
    <div className={styles.panel}>
      {/* Panel header */}
      <div className={styles.header}>
        <div className="pulse-dot" />
        <h2 className={styles.title}>Add Expense</h2>
        <Icon name="security" size={16} className={styles.shield} />
      </div>

      {/* Funny comment toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Icon name="bolt" size={13} />
            <span>{feedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <div ref={formRef} className={styles.formWrap}>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>What did you buy?</label>
            <input
              className={styles.input}
              placeholder="e.g. Swiggy biryani…"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className={styles.field}>
            <label className={styles.label}>Amount (₹)</label>
            <div className={styles.amtRow}>
              <span className={styles.rupee}>₹</span>
              <input
                type="number"
                step="1"
                placeholder="0"
                className={`${styles.input} ${styles.amtInput}`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Categories */}
          <div className={styles.catGrid}>
            {categories.map(cat => {
              const iconName = cat.icon;
              const isActive = category === cat.id;
              const isAnimating = activeAnim === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  className={`${styles.catBtn} ${isActive ? styles.catActive : ''}`}
                  style={{ '--cat-color': cat.color }}
                  onClick={() => { setCategory(cat.id); playSFX(cat.sound); }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  animate={isAnimating ? { y: [0, -6, 0], rotate: [0, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  title={cat.id}
                >
                  <Icon name={iconName} size={16} />
                  <span>{cat.id}</span>
                  {isActive && (
                    <motion.div
                      className={styles.activeDot}
                      layoutId="activeDot"
                      style={{ background: cat.color }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Submit */}
          <motion.button
            ref={btnRef}
            type="submit"
            className={styles.submitBtn}
            style={{ '--cat-color': activeCat?.color }}
            disabled={isStoring}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97, y: 4 }}
          >
            {isStoring ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              >
                <Icon name="bolt" size={18} />
              </motion.div>
            ) : (
              <>
                <Icon name="add" size={18} />
                <span>Add to Vault</span>
              </>
            )}
          </motion.button>

        </form>
      </div>

      {/* Footer status */}
      <div className={styles.footer}>
        <div className={styles.statusDot} />
        <span>Secure • Encrypted</span>
      </div>
    </div>
  );
}
