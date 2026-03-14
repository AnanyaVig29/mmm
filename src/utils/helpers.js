/* Change default currency to INR */
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCategoryColor(category) {
  const colors = {
    Food:          '#34d399',
    Transport:     '#38bdf8',
    Shopping:      '#f472b6',
    Health:        '#fb7185',
    Entertainment: '#a78bfa',
    Bills:         '#fbbf24',
    Travel:        '#22d3ee',
    Other:         '#94a3b8',
  };
  return colors[category] || '#94a3b8';
}

export function getCategoryIcon(category) {
  const icons = {
    Food:          'restaurant',
    Transport:     'directions_car',
    Shopping:      'shopping_bag',
    Health:        'medical_services',
    Entertainment: 'sports_esports',
    Bills:         'receipt_long',
    Travel:        'flight',
    Other:         'category',
  };
  return icons[category] || 'label';
}

export function formatDate(dateStr) {
  return new Date(dateStr || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}
