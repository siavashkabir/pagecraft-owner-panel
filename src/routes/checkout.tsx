import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useCart, clearCart } from '@/lib/cart';
import { supabase } from '@/integrations/supabase/client';
import { formatToman } from '@/lib/commerce';

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const cart = useCart();
  const nav = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [options, setOptions] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [method, setMethod] = useState<'card_to_card' | 'gateway' | ''>('');

  // ۱. چک کردن لاگین و گرفتن روش‌های پرداخت
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // اگر لاگین نبود، هدایت به صفحه ورود
        nav({ to: '/auth', search: { redirect: '/checkout' } });
        return;
      }

      if (cart.length === 0) {
        nav({ to: '/cart' });
        return;
      }

      // گرفتن تنظیمات پرداخت از دیتابیس
      const { data, error } = await supabase.rpc('get_checkout_options');
      if (error) {
        setErrorMsg('خطا در دریافت روش‌های پرداخت.');
      } else {
        setOptions(data);
        // انتخاب پیش‌فرض اولین روش فعال
        if (data?.card_to_card?.enabled) setMethod('card_to_card');
        else if (data?.gateway?.enabled) setMethod('gateway');
      }
      setLoading(false);
    }
    init();
  }, [cart.length, nav]);

  // ۲. ثبت سفارش و ساخت رکورد پرداخت
  async function handleCheckout() {
    if (!method) return;
    setProcessing(true);
    setErrorMsg('');

    const items = cart.map(i => ({ bot_id: i.bot_id, plan_months: i.plan_months }));
    
    // فراخوانی تابع دیتابیس برای ساخت Payment
    const { data, error } = await supabase.rpc('create_checkout', {
      items: items,
      coupon_code: couponCode.trim() || null,
      method: method
    });

    setProcessing(false);

    if (error) {
      setErrorMsg(error.message || 'خطا در ثبت سفارش.');
      return;
    }

    // اگر موفق بود، سبد خرید را خالی کن و به صفحه پرداخت برو
    if (data?.payment_id) {
      clearCart();
      // در TanStack Router برای رفتن به مسیر داینامیک
      window.location.href = `/payment/${data.payment_id}`;
    }
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-blue-400">در حال بررسی اطلاعات...</div>;
  }

  if (!options?.card_to_card?.enabled && !options?.gateway?.enabled) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-4">روش پرداخت فعالی وجود ندارد</h2>
        <p className="text-gray-400 mb-6">لطفاً برای هماهنگی پرداخت با پشتیبانی در تلگرام در ارتباط باشید.</p>
        <a href="https://t.me/Siavashska" target="_blank" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold">ارتباط با پشتیبانی</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">تسویه حساب</h1>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* انتخاب روش پرداخت */}
        <div className="bg-[#1e2329] border border-gray-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">روش پرداخت</h2>
          
          <div className="space-y-4">
            {options?.card_to_card?.enabled && (
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${method === 'card_to_card' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
                <input type="radio" name="method" value="card_to_card" checked={method === 'card_to_card'} onChange={() => setMethod('card_to_card')} className="w-4 h-4 text-green-500" />
                <div>
                  <span className="block text-white font-bold">کارت به کارت</span>
                  <span className="block text-gray-400 text-sm mt-1">پرداخت به شماره کارت و ارسال رسید</span>
                </div>
              </label>
            )}

            {options?.gateway?.enabled && (
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${method === 'gateway' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
                <input type="radio" name="method" value="gateway" checked={method === 'gateway'} onChange={() => setMethod('gateway')} className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="block text-white font-bold">پرداخت آنلاین (درگاه)</span>
                  <span className="block text-gray-400 text-sm mt-1">پرداخت مستقیم با کارت بانکی</span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* کد تخفیف */}
        <div className="bg-[#1e2329] border border-gray-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">کد تخفیف</h2>
          <input 
            type="text" 
            placeholder="اگر کد تخفیف دارید وارد کنید..." 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full bg-[#0a0c10] border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* دکمه ثبت */}
        <button 
          onClick={handleCheckout} 
          disabled={processing || !method}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
        >
          {processing ? 'در حال ثبت...' : 'ثبت نهایی سفارش'}
        </button>
      </div>
    </div>
  );
}
