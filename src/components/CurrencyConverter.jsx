import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import gsap from 'gsap';
import { getRate, CURRENCY_LIST } from '../api/currencyApi';
import { formatCurrency } from '../utils/helpers';
import styles from './CurrencyConverter.module.css';

export default function CurrencyConverter({ totalExpenses, compact = false }) {
  const [base,      setBase]      = useState('INR');
  const [target,    setTarget]    = useState('USD');
  const [rate,      setRate]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [amount,    setAmount]    = useState('');
  const resultRef = useRef(null);

  // Real API fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getRate(base, target)
      .then(r => {
        if (cancelled) return;
        setRate(r);
        setLoading(false);
        // Animate result value
        if (resultRef.current) {
          gsap.from(resultRef.current, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('Rate unavailable. Using estimate.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [base, target]);

  const inputAmount  = parseFloat(amount) || totalExpenses;
  const converted    = rate ? (inputAmount * rate) : null;
  const targetSymbol = CURRENCY_LIST.find(c => c.code === target)?.symbol || target;
  const baseSymbol   = CURRENCY_LIST.find(c => c.code === base)?.symbol || base;

  const swap = () => { setBase(target); setTarget(base); };

  return (
    <div className={`${styles.vaultPanel} ${compact ? styles.compact : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h2 className={styles.title}>Currency Converter</h2>
          <span className={styles.sub}>Real-Time Exchange Rates</span>
        </div>
        <Icon name="public" size={18} className={styles.globe} />
      </div>

      {/* Amount input */}
      <div className={styles.amountBox}>
        <label className={styles.label}>Amount to Convert</label>
        <div className={styles.amountRow}>
          <span className={styles.baseSymbol}>{baseSymbol}</span>
          <input
            type="number"
            className={styles.amtInput}
            placeholder={inputAmount.toFixed(0)}
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          {!compact && (
            <span className={styles.amountHint}>
              {amount ? '' : `using total ₹${totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            </span>
          )}
        </div>
      </div>

      {/* FROM / TO */}
      <div className={`${styles.formGrid} ${compact ? styles.formGridCompact : ''}`}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>FROM</label>
          <select value={base} onChange={e => setBase(e.target.value)} className={styles.select}>
            {CURRENCY_LIST.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        <button className={styles.swapBtn} onClick={swap} title="Swap currencies">
          <Icon name="sync_alt" size={16} />
        </button>

        <div className={styles.inputGroup}>
          <label className={styles.label}>TO</label>
          <select value={target} onChange={e => setTarget(e.target.value)} className={styles.select}>
            {CURRENCY_LIST.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      <motion.div
        className={styles.resultCard}
        animate={loading ? { opacity: 0.6 } : { opacity: 1 }}
      >
        <div className={styles.topRow}>
          <span className={styles.resultLabel}>CONVERTED AMOUNT</span>
          <div className={styles.tickerBadge}>
            {loading
              ? <><Icon name="autorenew" size={11} className="spin" /><span>Fetching</span></>
              : <><Icon name="trending_up" size={11} /><span>LIVE</span></>
            }
          </div>
        </div>

        <div className={styles.amountDisplay} ref={resultRef}>
          <span className={styles.targetCode}>{targetSymbol}</span>
          <span className={styles.mainAmount}>
            {loading
              ? '——'
              : converted !== null
                ? converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '——'}
          </span>
        </div>

        {/* Rate info */}
        <div className={styles.metaRow}>
          <div className={styles.rateInfo}>
            <span className={styles.rateLabel}>1 {base} =</span>
            <span className={styles.rateVal}>
              {rate ? rate.toFixed(4) : '—'}
            </span>
            <span className={styles.rateTarget}>{target}</span>
          </div>
          <Icon name="bolt" size={13} className={styles.zap} />
        </div>

        {error && <p className={styles.errorNote}>{error}</p>}

        {/* Decorative */}
        {!compact && <div className={styles.coinDeco}><Icon name="bolt" size={90} /></div>}
      </motion.div>

      {/* Footer */}
      {!compact && (
        <div className={styles.footer}>
          <div className={styles.dot} />
          <span className={styles.footerText}>Powered by Frankfurter API • Updated live</span>
        </div>
      )}
    </div>
  );
}
