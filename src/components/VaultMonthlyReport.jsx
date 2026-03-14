import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid, Legend
} from 'recharts';
import Icon from './ui/Icon';
import { formatCurrency } from '../utils/helpers';
import styles from './VaultMonthlyReport.module.css';

/** Build last 6 months of data from real expenses */
function buildMonthlyData(expenses) {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
      year:  d.getFullYear(),
      mon:   d.getMonth(),
      spent: 0,
      saved: 0,
    });
  }

  expenses.forEach(e => {
    const d = new Date(e.date || e.id);
    const entry = months.find(m => m.mon === d.getMonth() && m.year === d.getFullYear());
    if (entry) entry.spent += e.amount;
  });

  return months;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <p className={styles.ttLabel}>{payload[0]?.payload?.month}</p>
      {payload.map(p => (
        <p key={p.dataKey} className={styles.ttValue} style={{ color: p.fill }}>
          {p.dataKey === 'spent' ? 'Spent' : 'Saved'}: ₹{Number(p.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  );
};

export default function VaultMonthlyReport({ expenses }) {
  const monthlyData = useMemo(() => buildMonthlyData(expenses), [expenses]);

  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const avgMonthly = monthlyData.filter(m => m.spent > 0).length
    ? totalSpent / monthlyData.filter(m => m.spent > 0).length
    : 0;

  const handleExport = () => {
    const csv = [
      'Month,Spent',
      ...monthlyData.map(m => `${m.month},${m.spent}`),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'monthly_report.csv';
    a.click();
  };

  return (
    <div className={styles.vaultPanel}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h2 className={styles.title}>Monthly Report</h2>
          <span className={styles.sub}>Last 6 Months</span>
        </div>
        <button className={styles.actionBtn} onClick={handleExport}>
          <Icon name="download" size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Spent</span>
          <span className={styles.statValue}>{formatCurrency(totalSpent)}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Monthly Avg</span>
          <span className={styles.statValue} style={{ color: 'var(--primary)' }}>
            {formatCurrency(avgMonthly)}
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Transactions</span>
          <span className={styles.statValue}>{expenses.length}</span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false} tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
              tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-surface)', radius: 6 }} />
            <Bar dataKey="spent" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={22}>
              {monthlyData.map((_, i) => (
                <Cell key={i} opacity={i === monthlyData.length - 1 ? 1 : 0.45} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.footerBtn}>
          <Icon name="calendar_month" size={13} />
          <span>FY 2025-26</span>
        </button>
        <button className={styles.footerBtn}>
          <Icon name="check_circle" size={13} />
          <span>Data Verified</span>
        </button>
      </div>
    </div>
  );
}
