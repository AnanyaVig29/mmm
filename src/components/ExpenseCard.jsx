import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Icon from './ui/Icon';
import styles from './ExpenseCard.module.css';
import { formatCurrency, getCategoryColor, getCategoryIcon, formatDate } from '../utils/helpers';

export default function ExpenseCard({ expense, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleDelete = () => {
    gsap.to(cardRef.current, {
      x: 60, opacity: 0, scale: 0.92,
      duration: 0.35, ease: 'power2.in',
      onComplete: () => onDelete(expense.id),
    });
  };

  const color = getCategoryColor(expense.category);
  const icon  = getCategoryIcon(expense.category);
  const dateStr = formatDate(expense.date);

  return (
    <motion.div
      ref={cardRef}
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.92 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      role="article"
      aria-label={`${expense.name} – ${formatCurrency(expense.amount)}`}
    >
      {/* Color accent bar */}
      <div className={styles.accentBar} style={{ background: color }} />

      {/* Scan line on hover */}
      {hovered && <div className={styles.scanLine} />}

      <div className={styles.inner}>
        {/* Icon */}
        <motion.div
          className={styles.iconBox}
          style={{ background: `${color}18`, color }}
          whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon name={icon} size={20} />
        </motion.div>

        {/* Info */}
        <div className={styles.info}>
          <span className={styles.name}>{expense.name}</span>
          <div className={styles.meta}>
            <span className={styles.cat} style={{ color, background: `${color}14` }}>
              {expense.category}
            </span>
            <span className={styles.sep}>·</span>
            <span className={styles.date}>{dateStr}</span>
          </div>
        </div>

        {/* Amount + delete */}
        <div className={styles.right}>
          <span className={styles.amount}>{formatCurrency(expense.amount)}</span>
          {!showConfirm ? (
            <button
              className={styles.delBtn}
              onClick={() => setShowConfirm(true)}
              aria-label={`Delete ${expense.name}`}
            >
              <Icon name="close" size={16} />
            </button>
          ) : (
            <div className={styles.confirmRow}>
              <button className={styles.yes} onClick={handleDelete} aria-label="Confirm delete">
                <Icon name="check" size={14} />
              </button>
              <button className={styles.no} onClick={() => setShowConfirm(false)} aria-label="Cancel">
                <Icon name="close" size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
