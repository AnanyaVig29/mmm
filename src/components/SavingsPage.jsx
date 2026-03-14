import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useAuth } from '../hooks/useAuth';
import SavingsVault from './SavingsVault';

import { useState } from 'react';
import styles from './SavingsPage.module.css';

const VAULT_IMAGE = "https://media.istockphoto.com/id/1967915091/vector/bank-money-safe-storage-room-open-door-concept-vector-graphic-design-illustration.jpg?s=612x612&w=0&k=20&c=hDIw4cbhF7JKajUzJ77PkG9g8Rys7oq3o3jBYzzAY6o=";

const statCards = [
  {
    label: 'Security Status',
    icon:  'shield',
    value: 'MAX',
    sub:   '256-bit AES Encryption',
    cls:   'statGood',
  },
  {
    label: 'Est. Growth',
    icon:  'trending_up',
    value: '+12.4%',
    sub:   'Annual yield projection',
    cls:   'statGood',
  },
  {
    label: 'Vault Tier',
    icon:  'workspace_premium',
    value: 'Pro',
    sub:   'Unlimited deposits',
    cls:   'statWarn',
  },
];

const infoChips = [
  { icon: 'verified_user', label: 'End-to-End Encrypted' },
  { icon: 'lock',          label: 'Auto-lock Enabled' },
  { icon: 'update',        label: 'Real-time Sync' },
];

export default function SavingsPage() {
  const [isDone, setIsDone] = useState(false);
  const leftDoorRef  = useRef(null);
  const rightDoorRef = useRef(null);
  const contentRef   = useRef(null);
  const imageRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setIsDone(true) });

      tl.set(imageRef.current, { scale: 1.2, filter: 'brightness(0.15)' });
      tl.to(leftDoorRef.current,  { xPercent: -100, duration: 1.8, ease: 'power4.inOut' }, 0.4);
      tl.to(rightDoorRef.current, { xPercent:  100, duration: 1.8, ease: 'power4.inOut' }, 0.4);
      tl.to(imageRef.current, { scale: 1, filter: 'brightness(0.6)', duration: 2.2, ease: 'power2.out' }, 0.4);
      tl.from(contentRef.current, { opacity: 0, y: 60, duration: 1.2, ease: 'power3.out' }, '-=1');
    });
    return () => ctx.revert();
  }, []);

  const cardVariants = {
    hidden:  { opacity: 0, y: 32, scale: 0.96 },
    visible: (i) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }
    }),
  };

  return (
    <div className={styles.page}>
      {/* Vault Doors Reveal */}
      <div className={styles.vaultWrapper}>
        <img ref={imageRef} src={VAULT_IMAGE} alt="Private Vault" className={styles.vaultBg} />
        <div ref={leftDoorRef}  className={`${styles.door} ${styles.leftDoor}`}>
          <div className={styles.doorHandle} />
        </div>
        <div ref={rightDoorRef} className={`${styles.door} ${styles.rightDoor}`}>
          <div className={styles.doorHandle} />
        </div>
      </div>

      {/* Page Content */}
      <div className={styles.contentOverlay} ref={contentRef}>
        <div className={styles.container}>

          {/* Header */}
          <motion.header
            className={styles.header}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ duration: 0.9, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={styles.title}>Your Private<br />Reserve</h1>
            <p className={styles.subtitle}>Assets secured within High-Capital Encryption</p>
          </motion.header>

          {/* Info chips */}
          <motion.div
            className={styles.infoBar}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1,  y: 0  }}
            transition={{ duration: 0.7, delay: 2.1 }}
          >
            {infoChips.map((c, i) => (
              <div key={i} className={styles.infoChip}>
                <div className={styles.chipDot} />
                <span className={`material-symbols-rounded ${styles.statIcon}`}>{c.icon}</span>
                {c.label}
              </div>
            ))}
          </motion.div>

          {/* Main grid */}
          <div className={styles.grid}>
            {/* Vault card */}
            <motion.div
              className={styles.primary}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1,  x: 0  }}
              transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <SavingsVault />
            </motion.div>

            {/* Stat cards */}
            <div className={styles.secondary}>
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  className={styles.statCard}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <span className={styles.statLabel}>
                    <span className={`material-symbols-rounded ${styles.statIcon}`}>{s.icon}</span>
                    {s.label}
                  </span>
                  <span className={`${styles.statValue} ${styles[s.cls]}`}>{s.value}</span>
                  <span className={styles.statSub}>{s.sub}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
