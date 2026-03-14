import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import Icon from './ui/Icon';
import styles from './TrendsGraph.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tt}>
      <p className={styles.ttLabel}>{label}</p>
      <div className={styles.ttRow}>
        <div className={styles.ttDot} />
        <p className={styles.ttValue}>₹{payload[0].value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
      </div>
      <span className={styles.ttSub}>Daily Spending</span>
    </div>
  );
};

export default function VaultTrends({ expenses }) {
  const data = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), time: d.getTime(), total: 0 });
    }

    expenses.forEach(e => {
      const d = new Date(e.date || e.id);
      d.setHours(0,0,0,0);
      const entry = days.find(day => day.time === d.getTime());
      if (entry) entry.total += e.amount;
    });

    return days;
  }, [expenses]);

  const maxVal = Math.max(...data.map(d => d.total), 1);

  return (
    <div className={styles.vaultPanel}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h2 className={styles.title}><Icon name="monitoring" size={14} /> Spending Trends</h2>
          <span className={styles.sub}>Past 7 Days</span>
        </div>
        <div className={styles.iconBg}><Icon name="bar_chart" size={16} /></div>
      </div>


      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="vaultTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              tickFormatter={v => `₹${v.toLocaleString('en-IN')}`}
              domain={[0, maxVal * 1.2]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              strokeWidth={3}
              fill="url(#vaultTrend)"
              animationDuration={2000}
              activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--bg-card)', strokeWidth: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalBadge}>
          <span className={styles.badgeLabel}>CUMULATIVE</span>
          <span className={styles.badgeVal}>₹{data.reduce((s,d)=>s+d.total,0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className={styles.trendArrow}>
          <Icon name="trending_up" size={14} />
          <span>7-Day Total</span>
        </div>
      </div>
    </div>
  );
}
