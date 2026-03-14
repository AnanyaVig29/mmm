import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import styles from './LiveBankFeed.module.css';

const MOCK_FEEDS = [
  { bank: 'Chase', amount: 42.50, desc: 'Amazon.com', time: 'Just now' },
  { bank: 'BofA',  amount: 12.00, desc: 'Starbucks',  time: '2m ago' },
  { bank: 'Amex',  amount: 156.00, desc: 'Apple Store', time: '5m ago' },
];

export default function LiveBankFeed() {
  const [items, setItems] = useState(MOCK_FEEDS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a random "incoming" txn
      const newTxn = {
        bank: ['Chase', 'Amex', 'BofA'][Math.floor(Math.random()*3)],
        amount: (Math.random() * 50 + 5).toFixed(2),
        desc: ['Uber', 'Doordash', 'Steam', 'Gas'][Math.floor(Math.random()*4)],
        time: 'Just now'
      };
      setItems(prev => [newTxn, ...prev.slice(0, 2)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.vaultPanel}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h2 className={styles.title}>Live Card Sync</h2>
          <span className={styles.sub}>Automated Recording Active</span>
        </div>
        <div className={styles.wifi}><Icon name="wifi" size={16} /></div>
      </div>

      <div className={styles.feedList}>
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div 
              key={`${item.desc}-${i}`}
              className={styles.feedItem}
              initial={{ height: 0, opacity: 0, x: -20 }}
              animate={{ height: 'auto', opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className={styles.bankTag} style={{ background: item.bank === 'Amex' ? '#38bdf8' : item.bank === 'Chase' ? '#1e40af' : '#ef4444' }}>
                {item.bank[0]}
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.itemDesc}>{item.desc}</span>
                <span className={styles.itemTime}>{item.time}</span>
              </div>
              <div className={styles.itemAmount}>
                <Icon name="credit_card" size={16} className={styles.cardIcon} />
                <span>+₹{item.amount}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.footer}>
        <div className={styles.scanningLine} />
        <span className={styles.footerText}>ENCRYPTED BRIDGE SECURED</span>
      </div>
    </div>
  );
}
