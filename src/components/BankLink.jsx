import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from './ui/Icon';
import styles from './BankLink.module.css';

const BANK_COLORS = ['#C1FF00', '#38BDF8', '#FF6B6B', '#FBBF24', '#A78BFA', '#34D399'];

const BANKS = [
  'Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'Goldman Sachs',
  'HDFC', 'SBI', 'Barclays', 'HSBC', 'Revolut', 'Monzo', 'Other',
];

function formatCardDisplay(raw = '') {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export default function BankLink() {
  const { addCard, completeOnboarding, cards } = useAuth();
  const navigate = useNavigate();

  const [bankName, setBankName]     = useState('');
  const [cardNum,  setCardNum]      = useState('');
  const [expiry,   setExpiry]       = useState('');
  const [holder,   setHolder]       = useState('');
  const [flip,     setFlip]         = useState(false);
  const [error,    setError]        = useState('');
  const [added,    setAdded]        = useState([]);

  /* Live card color — cycle through palette by index */
  const color = BANK_COLORS[cards.length % BANK_COLORS.length];

  const handleAdd = e => {
    e.preventDefault();
    if (!bankName) { setError('Please select your bank.'); return; }
    if (cardNum.replace(/\D/g, '').length < 13) { setError('Enter a valid card number.'); return; }

    addCard({
      bankName,
      lastFour: cardNum.replace(/\D/g, '').slice(-4),
      expiry,
      holder,
      color,
    });

    setAdded(p => [...p, bankName]);
    setBankName(''); setCardNum(''); setExpiry(''); setHolder('');
    setError('');
  };

  const handleDone = () => {
    completeOnboarding();
    navigate('/');
  };

  const displayNum = formatCardDisplay(cardNum);
  const displayHolder = holder || 'YOUR NAME';
  const displayExpiry = expiry || 'MM/YY';

  return (
    <div className={styles.page}>
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <div className={styles.panel}>
        {/* Left: Info */}
        <div className={styles.infoCol}>
          <div className={styles.logoRow}>
            <div className={styles.logoMark}><Icon name="payments" size={24} style={{ color: '#0A0A0A' }} /></div>
            <span className={styles.logoName}>ExpenseFlow</span>
          </div>

          <h1 className={styles.headline}>
            Link Your<br />
            <span className={styles.accent}>Bank Account</span>
          </h1>
          <p className={styles.desc}>
            Connect your cards for automatic tracking, support for all currencies, and smart savings insights.
          </p>

          <ul className={styles.features}>
            {['Secure Connection', 'Multiple Bank Support', 'Live Updates', 'Instant Growth Stats'].map(f => (
              <li key={f} className={styles.feature}>
                <span className={styles.featureDot} />
                {f}
              </li>
            ))}
          </ul>


          {/* Added cards list */}
          {added.length > 0 && (
            <div className={styles.addedList}>
              <p className={styles.addedTitle}>Linked accounts:</p>
              {added.map((b, i) => (
                <div key={i} className={styles.addedChip}>
                  ✓ {b}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Form + Card Preview */}
        <div className={styles.formCol}>
          {/* 3D Card Preview */}
          <div className={styles.cardScene}>
            <div className={`${styles.creditCard} ${flip ? styles.flipped : ''}`}
              style={{ '--card-color': color }}
              onClick={() => setFlip(f => !f)}
              title="Click to flip"
            >
              {/* Front */}
              <div className={styles.cardFront}>
                <div className={styles.cardTopRow}>
                  <div className={styles.chip}>
                    <div className={styles.chipGrid} />
                  </div>
                  <span className={styles.cardBrand}>VISA</span>
                </div>
                <div className={styles.cardNumber}>
                  {displayNum || '•••• •••• •••• ••••'}
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <span className={styles.cardMeta}>Card Holder</span>
                    <span className={styles.cardValue}>{displayHolder}</span>
                  </div>
                  <div>
                    <span className={styles.cardMeta}>Expires</span>
                    <span className={styles.cardValue}>{displayExpiry}</span>
                  </div>
                  <div className={styles.bankLabel}>{bankName || 'YOUR BANK'}</div>
                </div>
              </div>

              {/* Back */}
              <div className={styles.cardBack}>
                <div className={styles.magStripe} />
                <div className={styles.cvvRow}>
                  <span className={styles.cvvLabel}>CVV</span>
                  <div className={styles.cvvBox}>•••</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdd} className={styles.form} noValidate>
            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Bank</label>
              <select
                className={styles.input}
                value={bankName}
                onChange={e => { setError(''); setBankName(e.target.value); }}
                required
              >
                <option value="">Select bank…</option>
                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Card Holder Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="As on card"
                value={holder}
                onChange={e => setHolder(e.target.value.toUpperCase())}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Card Number</label>
              <input
                type="text"
                className={styles.input}
                placeholder="0000 0000 0000 0000"
                value={displayNum}
                onChange={e => { setError(''); setCardNum(e.target.value.replace(/\D/g, '').slice(0, 16)); }}
                inputMode="numeric"
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Expiry</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="MM/YY"
                  value={expiry}
                  maxLength={5}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '');
                    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                    setExpiry(v);
                  }}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>CVV (optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="•••"
                  maxLength={4}
                  onFocus={() => setFlip(true)}
                  onBlur={() => setFlip(false)}
                  inputMode="numeric"
                />
              </div>
            </div>

            <button type="submit" className={styles.addBtn}>
              + Link This Account
            </button>
          </form>

          {/* Actions */}
          <div className={styles.actions}>
            <button onClick={handleDone} className={styles.doneBtn}>
              {added.length > 0 ? `Continue with ${added.length} account${added.length > 1 ? 's' : ''}` : "I'll do this later →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
