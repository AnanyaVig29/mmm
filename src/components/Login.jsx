import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from './ui/Icon';
import styles from './Auth.module.css';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    login({ email, name: email.split('@')[0], onboardingComplete: true });
    navigate('/');
  };

  return (
    <div className={styles.page}>
      {/* Background blobs */}
      <div className={styles.blob1} aria-hidden />
      <div className={styles.blob2} aria-hidden />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <div className={styles.logoMark}><Icon name="payments" size={24} style={{ color: '#0A0A0A' }} /></div>
          <span className={styles.logoName}>ExpenseFlow</span>
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account to continue</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              placeholder="you@email.com"
              value={email}
              onChange={e => { setError(''); setEmail(e.target.value); }}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={e => { setError(''); setPassword(e.target.value); }}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <p className={styles.footer}>
          New to ExpenseFlow?{' '}
          <Link to="/signup" className={styles.footerLink}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
