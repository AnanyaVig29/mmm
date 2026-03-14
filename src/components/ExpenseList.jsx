import { AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExpenseCard from './ExpenseCard';
import Icon from './ui/Icon';
import styles from './ExpenseList.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function ExpenseList({ expenses, onDelete }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current || expenses.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from('.ef-item', {
        y: 24, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out',
        scrollTrigger: { trigger: listRef.current, start: 'top 92%', once: true },
      });
    }, listRef);
    return () => ctx.revert();
  }, [expenses.length]);

  return (
    <section ref={listRef} className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Transactions</h2>
        {expenses.length > 0 && (
          <span className={styles.count}>{expenses.length}</span>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><Icon name="account_balance" size={48} /></div>
          <p className={styles.emptyTitle}>Vault is empty</p>
          <p className={styles.emptySub}>Add your first expense to start tracking.</p>
        </div>
      ) : (
        <div className={styles.list}>
          <AnimatePresence mode="popLayout">
            {expenses.map(exp => (
              <div key={exp.id} className="ef-item">
                <ExpenseCard expense={exp} onDelete={onDelete} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
