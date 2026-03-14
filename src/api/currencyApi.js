/**
 * Currency API — uses Frankfurter (free, no key needed)
 * https://www.frankfurter.app/docs/
 *
 * NOTE: Frankfurter does NOT support INR as a base currency.
 * We work around this by fetching USD→target and USD→INR and computing the cross-rate.
 */

const BASE_URL = 'https://api.frankfurter.app';

// INR ≈ 0.012 USD (hardcoded fallback when API is unavailable)
const INR_TO_USD_FALLBACK = 0.01198;

/**
 * Fetch the exchange rate from `from` to `to`.
 * Handles INR base via USD cross-rate.
 */
export async function getRate(from, to) {
  if (from === to) return 1;

  try {
    if (from === 'INR') {
      // Frankfurter doesn't support INR as base. Use USD cross-rate.
      const [res1, res2] = await Promise.all([
        fetch(`${BASE_URL}/latest?from=USD&to=${to}`),
        fetch(`${BASE_URL}/latest?from=USD&to=INR`),
      ]);
      if (!res1.ok || !res2.ok) throw new Error('API error');
      const d1 = await res1.json();
      const d2 = await res2.json();
      const usdToTarget = d1.rates[to];
      const usdToInr   = d2.rates['INR'];
      // INR to Target = (USD→Target) / (USD→INR)
      return usdToTarget / usdToInr;
    }

    if (to === 'INR') {
      const [res1, res2] = await Promise.all([
        fetch(`${BASE_URL}/latest?from=${from}&to=USD`),
        fetch(`${BASE_URL}/latest?from=USD&to=INR`),
      ]);
      if (!res1.ok || !res2.ok) throw new Error('API error');
      const d1 = await res1.json();
      const d2 = await res2.json();
      return d1.rates['USD'] * d2.rates['INR'];
    }

    const res = await fetch(`${BASE_URL}/latest?from=${from}&to=${to}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.rates[to];
  } catch {
    // Fallback hardcoded approximate rates (INR base)
    const fallbacks = {
      'INR-USD': 0.01198, 'INR-EUR': 0.01104, 'INR-GBP': 0.00943,
      'INR-JPY': 1.813,   'INR-AUD': 0.01870, 'INR-CAD': 0.01638,
      'USD-INR': 83.5,    'EUR-INR': 90.6,    'GBP-INR': 106.0,
    };
    return fallbacks[`${from}-${to}`] || 1;
  }
}

/**
 * Get available currency list (static, avoids extra API call).
 */
export const CURRENCY_LIST = [
  { code: 'INR', name: 'Indian Rupee',   flag: '🇮🇳', symbol: '₹' },
  { code: 'USD', name: 'US Dollar',      flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro',           flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound',  flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen',   flag: '🇯🇵', symbol: '¥' },
  { code: 'AUD', name: 'Aus Dollar',     flag: '🇦🇺', symbol: 'A$' },
  { code: 'CAD', name: 'Can Dollar',     flag: '🇨🇦', symbol: 'C$' },
  { code: 'SGD', name: 'Singapore $',    flag: '🇸🇬', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham',     flag: '🇦🇪', symbol: 'د.إ' },
];
