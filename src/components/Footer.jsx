import styles from './Footer.module.css';
import Icon from './ui/Icon';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>
              <Icon name="payments" size={14} style={{ color: '#000' }} />
            </div>
            <span className={styles.logoText}>
              Expense<span className={styles.logoAccent}>Flow</span>
            </span>
          </div>
          <div className={styles.divider} />
          <span className={styles.copyright}>© {year} ExpenseFlow, Inc. All rights reserved.</span>
        </div>

        <div className={styles.right}>
          <a href="#" className={styles.link}>Privacy</a>
          <span className={styles.dot}>•</span>
          <a href="#" className={styles.link}>Terms</a>
          <span className={styles.dot}>•</span>
          <a href="#" className={styles.link}>Help</a>
        </div>
      </div>
    </footer>
  );
}
