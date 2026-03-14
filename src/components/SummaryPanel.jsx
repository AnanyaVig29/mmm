import { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as ChartTooltip, Sector,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './ui/Icon';
import { getCategoryColor } from '../utils/helpers';
import { formatCurrency } from '../utils/helpers';
import styles from './SummaryPanel.module.css';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { 
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, 
    fill, payload, percent, value 
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  const textFill = 'var(--text-primary)';
  const mutedFill = 'var(--text-muted)';

  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="var(--bg-card)"
        strokeWidth={4}
      />
      <Sector
        cx={cx} cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 16}
        outerRadius={outerRadius + 20}
        fill={fill}
        opacity={0.3}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="var(--text-primary)" style={{ fontSize: '0.85rem', fontWeight: 900 }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="var(--text-muted)" style={{ fontSize: '0.7rem', fontWeight: 800 }}>
        {payload.name.toUpperCase()}
      </text>
    </g>
  );
};

export default function VaultSummary({ expenses }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const data = useMemo(() => {
    const cats = {};
    expenses.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + e.amount;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className={styles.vaultPanel}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h2 className={styles.title}><Icon name="pie_chart" size={14} /> Spending by Sector</h2>
          <span className={styles.sub}>Allocation breakdown</span>
        </div>
        <Icon name="info" size={16} className={styles.infoIcon} />
      </div>


      <div className={styles.mainArea}>
        {/* Vector Character Backdrop Decorative */}
        <div className={styles.mascotArea}>
          <svg viewBox="0 0 100 100" className={styles.mascot}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="2 4" />
            <motion.path 
              d="M30 40 Q50 20 70 40 L60 80 L40 80 Z" 
              fill="var(--primary-glow)" 
              stroke="var(--primary)" 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <circle cx="45" cy="45" r="2" fill="var(--primary)" />
            <circle cx="55" cy="45" r="2" fill="var(--primary)" />
          </svg>
        </div>

        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%" cy="50%"
                innerRadius={70}
                outerRadius={95}
                dataKey="value"
                onMouseEnter={(_, idx) => setActiveIndex(idx)}
                animationBegin={0}
                animationDuration={1500}
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getCategoryColor(entry.name)} 
                    stroke="var(--bg-card)" 
                    strokeWidth={4}
                  />
                ))}
              </Pie>
              <ChartTooltip content={() => null} />
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.centerInfo}>
            <span className={styles.centerLabel}>TOTAL SPENT</span>
            <span className={styles.centerValue}>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>

        <div className={styles.legendGrid}>
          {data.map((item, i) => (
            <motion.div 
              key={item.name}
              className={`${styles.legendItem} ${activeIndex === i ? styles.legendActive : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={styles.legendDot} style={{ background: getCategoryColor(item.name) }} />
              <div className={styles.legendInfo}>
                <span className={styles.legendName}>{item.name}</span>
                <span className={styles.legendVal}>₹{item.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className={styles.progressBack}>
                <div className={styles.progressFill} style={{ width: `${(item.value / total) * 100}%`, background: getCategoryColor(item.name) }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.statChip}>
          <Icon name="check_circle" size={14} />
          <span>-4.2% Flow</span>
        </div>
        <div className={styles.statChip}>
          <Icon name="zap" size={14} />
          <span>98.4% Efficiency</span>
        </div>
      </div>
    </div>
  );
}
