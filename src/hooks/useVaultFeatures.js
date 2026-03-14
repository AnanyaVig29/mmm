import { useState, useCallback } from 'react';

/**
 * ══════════════════════════════════════════════════════════════
 *  useVaultFeatures — SFX, Voice Feedback & Funny Comments
 * ══════════════════════════════════════════════════════════════
 *
 *  🔊 VOICE / SPEECH CONFIGURATION
 *  ─────────────────────────────────
 *  The `speak()` function uses the browser's built-in
 *  Web Speech API (SpeechSynthesisUtterance).
 *
 *  YOU CAN CHANGE THESE SETTINGS inside the `speak` function:
 *
 *   utterance.pitch  — 0 (deep) to 2 (high-pitched). Default: 1.2
 *   utterance.rate   — 0.1 (slow) to 10 (fast).      Default: 1.1
 *   utterance.volume — 0 (mute) to 1 (full).          Default: 0.4
 *   utterance.voice  — pick from window.speechSynthesis.getVoices()
 *
 *  To disable voice entirely, set: utterance.volume = 0
 *  To change the voice:
 *    const voices = window.speechSynthesis.getVoices();
 *    utterance.voice = voices.find(v => v.name.includes('Google'));
 *
 *  🔈 SFX CONFIGURATION (Web Audio API)
 *  ────────────────────────────────────
 *  The `playSFX(type)` function generates tones using Web Audio API.
 *  Available types: 'coin', 'vault-lock', 'success'
 *  Adjust gain.gain.setValueAtTime(X) to change volume (0–1).
 */

export default function useVaultFeatures() {
  const [toast, setToast] = useState(null);

  /* ──────────────── SFX (Web Audio API) ──────────────── */
  const playSFX = useCallback((type) => {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'coin') {
        // 🪙 Bright coin ping
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);

      } else if (type === 'vault-lock') {
        // 🔐 Low vault thud (when adding expense)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);

      } else if (type === 'success') {
        // ✅ Happy three-note arpeggio
        [440, 550, 660].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
          g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.09);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.15);
          o.start(ctx.currentTime + i * 0.09);
          o.stop(ctx.currentTime + i * 0.09 + 0.15);
        });
        return; // Return early (no single osc start/stop needed)
      }
    } catch {
      // Audio context blocked (requires user interaction) — silently ignore
    }
  }, []);

  /* ──────────────── Funny Comments (per category) ──────────────── */
  const getFunnyComment = useCallback((category) => {
    const comments = {
      Food:          ['Feeding the beast again? 🍔', 'Gordon Ramsay would not approve.', 'Is it organic at least?', 'Your fridge is crying.'],
      Transport:     ['Ola/Uber CEO thanks you. 🚕', 'Walking is free, you know.', 'Fuel for the carbon footprint.', 'Even autocorrect says "bus".'],
      Shopping:      ['Amazon CEO just smiled. 😏', 'Buying happiness, one click at a time.', 'Empty wallet, full wardrobe.', 'Retail therapy: Stage 4.'],
      Health:        ['Body maintenance. Fair enough.', 'Doctor said this, not you.', 'Insurance rejected this, huh?', 'Healthy body, lighter wallet.'],
      Entertainment: ['Netflix & Debt.', 'Are you not entertained?! 🎭', 'Cinema popcorn is the real theft.', 'Levelling up your subscription count.'],
      Bills:         ['The government thanks you. 📜', 'Signed, sealed, delivered.', 'Adulting: -1 fun, +1 bill.', 'So this is what being responsible feels like.'],
      Travel:        ['Jet-setter! ✈️', 'The runway is cheaper than this hotel.', 'Miles for your smile.', 'Geography is expensive.'],
      Other:         ['Money vanishes mysteriously.', 'A classic "I need this" purchase.', 'Vault balance is sweating.', 'Filing under: questionable decisions.'],
    };
    const list = comments[category] || comments.Other;
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  /* ──────────────── Voice Feedback (Web Speech API) ──────────────── */
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // ── CHANGE VOICE SETTINGS HERE ──
    utterance.pitch  = 1.1;   // 0=deepest, 2=highest
    utterance.rate   = 1.05;  // 0.1=slowest, 3=fastest
    utterance.volume = 0.45;  // 0=mute, 1=max

    // Optional: pick a specific voice
    // const voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices.find(v => v.lang === 'en-IN') || voices[0];

    window.speechSynthesis.speak(utterance);
  }, []);

  return { playSFX, getFunnyComment, speak, toast, setToast };
}
