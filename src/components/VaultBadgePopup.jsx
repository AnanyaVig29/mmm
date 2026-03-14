import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import styles from './VaultBadgePopup.module.css';

export default function VaultBadgePopup({ badge, coupon, onClose }) {
  useEffect(() => {
    if (badge) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C1FF00', '#38BDF8', '#FFD700']
      });
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div 
          className={styles.modal}
          initial={{ scale: 0.8, y: 100, opacity: 0, rotateX: -45 }}
          animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, y: 100, opacity: 0, rotateX: 45 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          onClick={e => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose}><Icon name="close" size={16} /></button>
          
          <div className={styles.topDecoration}>
            <div className={styles.iconRing}><Icon name="auto_awesome" size={32} /></div>
          </div>

          <div className={styles.iconCircle}>
            <Icon name="trophy" size={48} className={styles.trophy} />
            <motion.div 
              className={styles.sparkles}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Icon name="auto_awesome" size={100} style={{ color: 'var(--primary)', opacity: 0.2 }} />
            </motion.div>
          </div>

          <h2 className={styles.title}>Vault Milestone Unlocked!</h2>
          <p className={styles.badgeName}>{badge}</p>

          <motion.div 
            className={styles.couponCard}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.couponLeft}>
              <Icon name="redeem" size={16} />
            </div>
            <div className={styles.couponRight}>
              <span className={styles.couponLabel}>EXCLUSIVE REWARD</span>
              <span className={styles.couponTitle}>{coupon?.title || 'Unknown Reward'}</span>
              <code className={styles.code}>{coupon?.code || '------'}</code>
            </div>
          </motion.div>

          <p className={styles.footer}>The vault recognizes your capital growth.</p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
