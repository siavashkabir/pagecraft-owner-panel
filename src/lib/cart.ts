import { useSyncExternalStore } from 'react';

export type CartItem = { bot_id: string; plan_months: number };
const CART_KEY = 'sk_cart_v1';

let cachedCartString = typeof window !== 'undefined' ? (localStorage.getItem(CART_KEY) || '[]') : '[]';
let cachedCart: CartItem[] = JSON.parse(cachedCartString);

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

export function getCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  return cachedCart;
}

export function setCartItems(items: CartItem[]) {
  cachedCart = items;
  cachedCartString = JSON.stringify(items);
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_KEY, cachedCartString);
  }
  emitChange();
}

export function addToCart(bot_id: string, plan_months: number) {
  const items = [...cachedCart];
  const existing = items.findIndex((i) => i.bot_id === bot_id);
  if (existing >= 0) {
    items[existing] = { bot_id, plan_months }; // اگر محصول بود، فقط پلنش رو آپدیت کن
  } else {
    items.push({ bot_id, plan_months }); // اگر نبود، اضافه کن
  }
  setCartItems(items);
}

export function removeFromCart(bot_id: string) {
  setCartItems(cachedCart.filter((i) => i.bot_id !== bot_id));
}

export function clearCart() {
  setCartItems([]);
}

// این هوک (Hook) به کامپوننت‌های ری‌اکت اجازه می‌دهد تغییرات سبد خرید را زنده ببینند
export function useCart() {
  return useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => cachedCart,
    () => [] // Server snapshot برای جلوگیری از خطای هیدریشن
  );
}
