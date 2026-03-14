import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ef-user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem('ef-cards');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [savings, setSavings] = useState(() => {
    try {
      const saved = localStorage.getItem('ef-savings');
      return saved ? JSON.parse(saved) : { amount: 0, badges: [], coupons: [] };
    } catch { return { amount: 0, badges: [], coupons: [] }; }
  });

  /* ───── Persistance ───── */
  useEffect(() => {
    if (user) localStorage.setItem('ef-user', JSON.stringify(user));
    else localStorage.removeItem('ef-user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ef-cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('ef-savings', JSON.stringify(savings));
  }, [savings]);

  /* ───── Actions ───── */
  const login = (userData) => {
    setUser({ 
      ...userData, 
      id: userData.id || Date.now(), 
      onboardingComplete: userData.onboardingComplete ?? true 
    });
  };

  const logout = () => {
    setUser(null);
    setCards([]);
    setSavings({ amount: 0, badges: [], coupons: [] });
  };

  const addSavings = (amount) => {
    setSavings(prev => {
      const newAmount = prev.amount + amount;
      const newBadges = [...prev.badges];
      const newCoupons = [...prev.coupons];

      const milestones = [
        { amount: 500,  badge: 'Starter Saver',   coupon: { id: 1, title: '10% Off on Zomato', code: 'ZOMATO10' } },
        { amount: 2000, badge: 'Wealth Builder',  coupon: { id: 2, title: '₹200 Off on Myntra', code: 'MYNTRA200' } },
        { amount: 5000, badge: 'Savings Maestro', coupon: { id: 3, title: '₹500 Off Amazon Order', code: 'AMZN500' } },
      ];


      milestones.forEach(m => {
        if (newAmount >= m.amount && !newBadges.includes(m.badge)) {
          newBadges.push(m.badge);
          newCoupons.push({ ...m.coupon, id: Date.now() + Math.random() });
        }
      });

      return { amount: newAmount, badges: newBadges, coupons: newCoupons };
    });
  };

  const withdrawSavings = (amount) => {
    setSavings(prev => {
      const newAmount = Math.max(0, prev.amount - amount);
      return { ...prev, amount: newAmount };
    });
  };

  const addCard = (card) => {
    setCards(prev => [...prev, { ...card, id: Date.now() }]);
  };

  const removeCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const completeOnboarding = () => {
    setUser(prev => prev ? { ...prev, onboardingComplete: true } : null);
  };

  const value = useMemo(() => ({
    user, login, logout, 
    savings, addSavings, withdrawSavings,
    cards, addCard, removeCard, 
    completeOnboarding
  }), [user, savings, cards]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
