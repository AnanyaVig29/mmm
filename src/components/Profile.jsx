import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import { useAuth } from '../hooks/useAuth';
import styles from './Profile.module.css';
import { formatCurrency } from '../utils/helpers';

const MILESTONE_MAP = {
  'Starter Saver':   { icon: 'eco', target: 500,   desc: 'Saved your first ₹500!' },
  'Wealth Builder':  { icon: 'diamond', target: 2000,  desc: 'Hit ₹2,000 in savings.' },
  'Savings Maestro': { icon: 'workspace_premium', target: 5000,  desc: 'Crossed ₹5,000 — legendary!' },
};

export default function Profile() {
  const { user, logout, savings, cards, removeCard, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city:  user?.city  || '',
  });

  if (!user) return null;

  const nextTarget = savings.amount < 500 ? 500 : savings.amount < 2000 ? 2000 : 5000;
  const pct = Math.min((savings.amount / nextTarget) * 100, 100);
  const joinDate = new Date(user.id).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const saveEdits = () => {
    login({ ...user, ...form });
    setEditing(false);
  };

  const cancelEdits = () => {
    setForm({ name: user.name, email: user.email, phone: user.phone || '', city: user.city || '' });
    setEditing(false);
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Hero Banner ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {(form.name || user.name).charAt(0).toUpperCase()}
            </div>
            <div className={styles.avatarRing} />
            <div className={styles.avatarBadge}>
              <Icon name="shield" size={10} />
            </div>
          </div>

          <div className={styles.userInfo}>
            {editing ? (
              <div className={styles.editRow}>
                <input
                  className={styles.editInput}
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
            ) : (
              <h1 className={styles.userName}>{user.name}</h1>
            )}
            <p className={styles.userEmail}>{user.email}</p>
            <div className={styles.tagRow}>
              <span className={styles.memberTag}>Pro Member</span>
              <span className={styles.joinTag}>
                <Icon name="calendar_month" size={10} />
                Joined {joinDate}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.heroActions}>
            {editing ? (
              <>
                <button className={styles.saveBtn} onClick={saveEdits}>
                  <Icon name="check" size={15} /> Save
                </button>
                <button className={styles.cancelBtn} onClick={cancelEdits}>
                  <Icon name="close" size={15} />
                </button>
              </>
            ) : (
              <button className={styles.editBtn} onClick={() => setEditing(true)}>
                <Icon name="edit" size={15} /> Edit Profile
              </button>
            )}
            <button className={styles.logoutBtn} onClick={logout}>
              <Icon name="logout" size={15} /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <div className={styles.statsStrip}>
        {[
          { label: 'Total Saved', value: formatCurrency(savings.amount), icon: 'savings', color: 'var(--primary)' },
          { label: 'Badges',      value: savings.badges.length,           icon: 'workspace_premium', color: 'var(--gold)' },
          { label: 'Coupons',     value: savings.coupons.length,          icon: 'redeem', color: 'var(--accent)' },
          { label: 'Accounts',    value: cards.length,                    icon: 'credit_card', color: 'var(--success)' },
        ].map(s => (
          <motion.div key={s.label} className={styles.stripStat} whileHover={{ y: -4 }}>
            <span className={styles.stripIcon} style={{ background: `${s.color}14`, color: s.color }}><Icon name={s.icon} size={18} /></span>
            <div>
              <span className={styles.stripValue}>{s.value}</span>
              <span className={styles.stripLabel}>{s.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className={styles.grid}>

        {/* LEFT COL */}
        <div className={styles.col}>

          {/* Personal Details */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Icon name="person" size={14} /> Personal Details</h2>
            </div>

            <div className={styles.detailGrid}>
              <DetailField
                label="Full Name" icon={<Icon name="person" size={13} />}
                editing={editing}
                value={form.name}
                onChange={v => setForm(p => ({ ...p, name: v }))}
                placeholder="Enter your name"
              />
              <DetailField
                label="Email" icon={<Icon name="shield" size={13} />}
                editing={false}
                value={user.email}
                readonly
              />
              <DetailField
                label="Phone" icon={<Icon name="call" size={13} />}
                editing={editing}
                value={form.phone}
                onChange={v => setForm(p => ({ ...p, phone: v }))}
                placeholder="+91 XXXXX XXXXX"
              />
              <DetailField
                label="City" icon={<Icon name="location_on" size={13} />}
                editing={editing}
                value={form.city}
                onChange={v => setForm(p => ({ ...p, city: v }))}
                placeholder="Your city"
              />
            </div>
          </div>

          {/* Savings Progress */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Icon name="trending_up" size={14} /> Savings Progress</h2>
            </div>
            <div className={styles.savingsBalance}>{formatCurrency(savings.amount)}</div>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className={styles.progressLabels}>
              <span>₹0</span>
              <span className={styles.pct}>{pct.toFixed(0)}%</span>
              <span>Goal: {formatCurrency(nextTarget)}</span>
            </div>
          </div>

          {/* Linked Accounts */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Icon name="credit_card" size={14} /> Linked Accounts</h2>
              <Link to="/link-bank" className={styles.addLink}>+ Add Account</Link>
            </div>
            {cards.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}><Icon name="account_balance" size={40} /></span>
                <p>No accounts linked yet.</p>
                <Link to="/link-bank" className={styles.emptyAction}>Link Bank Account</Link>
              </div>
            ) : (
              <div className={styles.accountList}>
                {cards.map(c => (
                  <motion.div
                    key={c.id}
                    className={styles.accountCard}
                    style={{ '--acc-color': c.color }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className={styles.accLeft}>
                      <div className={styles.accDot} style={{ background: c.color }} />
                      <div className={styles.accInfo}>
                        <span className={styles.accBank}>{c.bankName}</span>
                        <span className={styles.accNum}>•••• •••• •••• {c.lastFour}</span>
                        {c.holder && <span className={styles.accHolder}>{c.holder}</span>}
                      </div>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeCard(c.id)} title="Remove"><Icon name="close" size={16} /></button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL */}
        <div className={styles.col}>

          {/* Achievements */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Icon name="workspace_premium" size={14} /> Achievements</h2>
              <span className={styles.countBadge}>{savings.badges.length} / 3</span>
            </div>

            <div className={styles.badgeGrid}>
              {Object.entries(MILESTONE_MAP).map(([name, m]) => {
                const unlocked = savings.badges.includes(name);
                return (
                  <motion.div
                    key={name}
                    className={`${styles.badgeCard} ${unlocked ? styles.badgeUnlock : styles.badgeLocked}`}
                    whileHover={{ scale: unlocked ? 1.04 : 1 }}
                  >
                    <div className={`${styles.badgeIcon} ${!unlocked ? styles.badgeIconLocked : ''}`}>
                      {unlocked ? <Icon name={m.icon} size={24} /> : <Icon name="lock" size={24} />}
                    </div>
                    <div className={styles.badgeMeta}>
                      <span className={styles.badgeName}>{name}</span>
                      <span className={styles.badgeDesc}>{unlocked ? m.desc : `Unlock at ${formatCurrency(m.target)}`}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Coupons */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Icon name="redeem" size={14} /> Reward Coupons</h2>
              <span className={styles.exclusiveTag}>Exclusive</span>
            </div>

            {savings.coupons.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}><Icon name="redeem" size={40} /></span>
                <p>Coupons unlock at savings milestones.</p>
              </div>
            ) : (
              <div className={styles.couponList}>
                {savings.coupons.map(c => (
                  <div key={c.id} className={styles.coupon}>
                    <div className={styles.couponLeft}>
                      <span className={styles.couponEmoji}><Icon name="redeem" size={20} /></span>
                      <div>
                        <span className={styles.couponTitle}>{c.title}</span>
                        <code className={styles.couponCode}>{c.code}</code>
                      </div>
                    </div>
                    <button
                      className={styles.copyBtn}
                      onClick={() => navigator.clipboard?.writeText(c.code)}
                    >Copy</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}><Icon name="shield" size={14} /> Security</h2>
              <span className={styles.verifiedTag}><Icon name="check_circle" size={12} /> Verified</span>
            </div>
            <div className={styles.securityList}>
              {[
                { label: 'Data Encryption', status: 'Active', ok: true },
                { label: 'Session Security', status: 'Active', ok: true },
                { label: 'Two-Factor Auth',  status: 'Not Set', ok: false },
              ].map(s => (
                <div key={s.label} className={styles.secRow}>
                  <span className={styles.secLabel}>{s.label}</span>
                  <span className={`${styles.secStatus} ${s.ok ? styles.secOk : styles.secWarn}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Small helper field component */
function DetailField({ label, icon, editing, value, onChange, placeholder, readonly }) {
  return (
    <div className={styles.detailField}>
      <span className={styles.detailLabel}>
        {icon} {label}
      </span>
      {editing && !readonly ? (
        <input
          className={styles.detailInput}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <span className={styles.detailValue}>{value || <span style={{ color: 'var(--text-muted)' }}>Not set</span>}</span>
      )}
    </div>
  );
}
