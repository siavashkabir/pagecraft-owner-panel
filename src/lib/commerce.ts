import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ابزار کاربردی برای ادغام کلاس‌های Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ۱. فرمت کردن قیمت به تومان با جداکننده هزارگان و اعداد فارسی
export function formatToman(amount: number | null | undefined, lang: 'fa' | 'en' = 'fa'): string {
  if (amount === null || amount === undefined) return lang === 'fa' ? 'تماس بگیرید' : 'Contact Us';
  
  const formatted = amount.toLocaleString('en-US'); // جداکننده هزارگان
  
  if (lang === 'fa') {
    const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const faFormatted = formatted.replace(/\d/g, (d) => faDigits[parseInt(d)]);
    return `${faFormatted} تومان`;
  }
  
  return `${formatted} Tomans`;
}

// ۲. محاسبه تعداد روزهای باقی‌مانده تا انقضا
export function getRemainingDays(expiresAt: string | Date): number {
  const expiration = new Date(expiresAt).getTime();
  const now = new Date().getTime();
  const diff = expiration - now;
  
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ۳. محاسبه تاریخ انقضای جدید (تمدید)
export function getRenewalBaseDate(currentExpiresAt: string | Date | null): Date {
  const now = new Date();
  if (!currentExpiresAt) return now;
  
  const current = new Date(currentExpiresAt);
  return current > now ? current : now;
}

// ۴. اضافه کردن ماه به تاریخ
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
