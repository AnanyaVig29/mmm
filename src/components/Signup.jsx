import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from './ui/Icon';
import styles from './Auth.module.css';

export default function Signup() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password !== confirm)         { setError('Passwords do not match.');     return; }
    if (password.length < 6)          { setError('Password must be at least 6 characters.'); return; }

    login({ name, email, onboardingComplete: false });
    navigate('/link-bank');
  };

  return (
    <div className={styles.page}>
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}><Icon name="payments" size={24} style={{ color: '#0A0A0A' }} /></div>
          <span className={styles.logoName}>ExpenseFlow</span>
        </div>

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.subtitle}>Start tracking your finances today</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="su-name">Full Name</label>
            <input
              id="su-name"
              type="text"
              className={styles.input}
              placeholder="Jane Doe"
              value={name}
              onChange={e => { setError(''); setName(e.target.value); }}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="su-email">Email</label>
            <input
              id="su-email"
              type="email"
              className={styles.input}
              placeholder="you@email.com"
              value={email}
              onChange={e => { setError(''); setEmail(e.target.value); }}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="su-pass">Password</label>
              <input
                id="su-pass"
                type="password"
                className={styles.input}
                placeholder="Min 6 chars"
                value={password}
                onChange={e => { setError(''); setPassword(e.target.value); }}
                required
                autoComplete="new-password"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="su-confirm">Confirm</label>
              <input
                id="su-confirm"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={confirm}
                onChange={e => { setError(''); setConfirm(e.target.value); }}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Account
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
