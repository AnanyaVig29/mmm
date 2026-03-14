import { useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle({ theme, toggleTheme }) {
  const wrapRef   = useRef(null);
  const cordRef   = useRef(null);
  const bulbRef   = useRef(null);
  const glowRef   = useRef(null);
  const ringRef   = useRef(null);
  const [busy, setBusy] = useState(false);
  const isDark = theme === 'dark';

  const pull = () => {
    if (busy) return;
    setBusy(true);

    const tl = gsap.timeline({ onComplete: () => setBusy(false) });

    // 1. Cord stretches down (pull)
    tl.to(cordRef.current, {
      scaleY: 1.5,
      transformOrigin: 'top center',
      duration: 0.18,
      ease: 'power2.in',
    });

    // 2. Cord snaps back elastically
    tl.to(cordRef.current, {
      scaleY: 1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.35)',
    });

    // 3. Bulb swings in arc (pendulum)
    tl.to(wrapRef.current, {
      rotation: isDark ? 12 : -12,
      duration: 0.22,
      ease: 'power2.in',
    }, '<0.1');
    tl.to(wrapRef.current, {
      rotation: 0,
      duration: 1.1,
      ease: 'elastic.out(0.8, 0.25)',
    });

    // 4. Bulb flash + glow ring burst then settle
    tl.to(bulbRef.current, {
      scale: 0.78,
      duration: 0.12,
      ease: 'power3.in',
    }, '<-0.6');
    tl.to(bulbRef.current, {
      scale: 1.18,
      duration: 0.18,
      ease: 'back.out(4)',
      onComplete: toggleTheme,   // <-- theme actually switches here
    });
    tl.to(bulbRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });

    // 5. Ring expands and fades (click-wave)
    tl.fromTo(ringRef.current,
      { scale: 0.6, opacity: 0.9 },
      { scale: 2.4, opacity: 0, duration: 0.6, ease: 'power2.out' },
      '<-0.55',
    );

    // 6. Glow pulse
    tl.to(glowRef.current, {
      opacity: isDark ? 0.85 : 0,
      scale:   isDark ? 1.8  : 0.8,
      duration: 0.45,
      ease: 'power2.out',
    }, '<-0.4');
    tl.to(glowRef.current, {
      opacity: isDark ? 0.35 : 0,
      scale: 1,
      duration: 0.8,
      ease: 'power2.in',
    });
  };

  return (
    <button
      className={`${styles.lamp} ${isDark ? styles.night : styles.day}`}
      onClick={pull}
      disabled={busy}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={isDark ? '☀️ Pull for Day Mode' : '🌙 Pull for Night Mode'}
    >
      {/* whole lamp swings from origin at top */}
      <div ref={wrapRef} className={styles.lampWrap}>

        {/* Ceiling fixture */}
        <div className={styles.fixture} />

        {/* Cord with pull-bead */}
        <div ref={cordRef} className={styles.cord}>
          <div className={styles.cordLine} />
          <div className={styles.bead} />
          <div className={styles.cordLine2} />
        </div>

        {/* Lamp shade + bulb */}
        <div className={styles.shade}>
          {/* Shade ribs decoration */}
          <div className={styles.shadeInner} />

          {/* Glow halo behind bulb */}
          <div ref={glowRef} className={styles.glow} />

          {/* Click-wave ring */}
          <div ref={ringRef} className={styles.ring} />

          {/* Bulb */}
          <div ref={bulbRef} className={styles.bulb}>
            <span className={`material-symbols-rounded ${styles.icon}`}>
              {isDark ? 'dark_mode' : 'light_mode'}
            </span>
          </div>

          {/* Cone of light (day mode only) */}
          {!isDark && <div className={styles.cone} />}
        </div>
      </div>
    </button>
  );
}
