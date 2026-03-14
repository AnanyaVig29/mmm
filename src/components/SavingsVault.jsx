import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import { useAuth } from '../hooks/useAuth';
import useVaultFeatures from '../hooks/useVaultFeatures';
import styles from './SavingsVault.module.css';

export default function VaultSavings() {
  const { savings, addSavings, withdrawSavings } = useAuth();
  const [val, setVal] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [mode, setMode] = useState('deposit');
  const { playSFX, speak } = useVaultFeatures();

  const isWithdrawing = mode === 'withdraw';
  const canWithdraw = savings.amount >= 500;

  const handleTransaction = (e) => {
    e.preventDefault();
    const amount = parseFloat(val);
    if (!amount || amount <= 0) return;

    if (isWithdrawing && amount > savings.amount) {
      speak('Insufficient funds in the vault.');
      return;
    }

    setIsDepositing(true);
    playSFX(isWithdrawing ? 'success' : 'coin');
    
    setTimeout(() => {
      if (isWithdrawing) {
        withdrawSavings(amount);
        speak(`Withdrawal complete! You removed ${amount} rupees.`);
      } else {
        addSavings(amount);
        speak(`Secured! You added ${amount} rupees to your savings.`);
      }
      setVal('');
      setIsDepositing(false);
      playSFX('vault-lock');
    }, 800);
  };

  const nextGoal = savings.amount < 50 ? 50 : savings.amount < 200 ? 200 : 500;
  const progress = Math.min((savings.amount / nextGoal) * 100, 100);

  return (
    <div className={styles.container}>
      {/* 🎡 Rotating Vault Wheel Background Decoration */}
      <motion.div 
        className={styles.vaultWheel}
        animate={{ rotate: isDepositing ? 360 : 0 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <Icon name="lock" size={120} className={styles.wheelLock} />
        <div className={styles.spokeRow}>
          <div className={styles.spoke} /> <div className={styles.spoke} /> 
          <div className={styles.spoke} /> <div className={styles.spoke} />
        </div>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <Icon name="monetization_on" size={24} style={{ color: "var(--primary)" }} />
          </div>
          <div className={styles.titleInfo}>
            <h2 className={styles.title}>My Savings</h2>
            <span className={styles.subtitle}>Saved Funds</span>
          </div>
          <motion.div 
            className={styles.statusBadge}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ACTIVE
          </motion.div>
        </div>

        <div className={styles.balanceSection}>
          <div className={styles.label}>Total Saved</div>
          <div className={styles.amountWrap}>
            <span className={styles.currency}>₹</span>
            <span className={styles.amount}>{savings.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className={styles.progressArea}>
          <div className={styles.progressHeader}>
            <span className={styles.milestone}>GOAL: ₹{nextGoal.toLocaleString('en-IN')}</span>
            <span className={styles.percent}>{progress.toFixed(0)}%</span>
          </div>
          <div className={styles.barOuter}>
            <motion.div 
              className={styles.barInner}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className={styles.modeToggle}>
          <button 
            type="button"
            className={`${styles.modeBtn} ${!isWithdrawing ? styles.activeModeDeposit : ''}`}
            onClick={() => setMode('deposit')}
          >
            <span className="material-symbols-rounded" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
              arrow_circle_up
            </span>
            Deposit
          </button>
          
          {canWithdraw && (
            <button 
              type="button"
              className={`${styles.modeBtn} ${isWithdrawing ? styles.activeModeWithdraw : ''}`}
              onClick={() => setMode('withdraw')}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 15, fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                arrow_circle_down
              </span>
              Withdraw
            </button>
          )}
        </div>

        <form onSubmit={handleTransaction} className={styles.depositForm}>
          <div className={`${styles.inputBox} ${isWithdrawing ? styles.inputWithdraw : ''}`}>
            <input 
              type="number" 
              placeholder={isWithdrawing ? "Withdraw amount..." : "Add savings..."} 
              className={styles.input}
              value={val}
              onChange={e => setVal(e.target.value)}
            />
            <button 
              type="submit" 
              className={`${styles.sendBtn} ${isWithdrawing ? styles.btnWithdraw : ''}`}
              disabled={isDepositing}
            >
              <Icon name={isWithdrawing ? "arrow_circle_down" : "arrow_circle_up"} size={22} className={isDepositing ? styles.spin : ''} />
            </button>
          </div>
        </form>


        <div className={styles.badgeStrip}>
          {savings.badges.length > 0 ? (
            <div className={styles.badges}>
              {savings.badges.map(b => (
                <div key={b} className={styles.badgeIcon} title={b}>
                  <Icon name="workspace_premium" size={14} />
                  <span>{b.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyBadges}>
              <Icon name="warning" size={14} />
              <span>No accolades recorded.</span>
            </div>
          )}
          <Icon name="chevron_right" size={14} className={styles.chevron} />
        </div>
      </div>

      <AnimatePresence>
        {isDepositing && (
          <div className={styles.coinRain}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="coin"
                initial={{ top: -20, left: Math.random() * 100 + '%', opacity: 0 }}
                animate={{ top: '100%', opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeIn' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
