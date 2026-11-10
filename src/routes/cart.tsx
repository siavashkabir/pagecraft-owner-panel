import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useCart, removeFromCart, setCartItems } from '@/lib/cart';
import { supabase } from '@/integrations/supabase/client';
import { formatToman } from '@/lib/commerce';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const [products, setProducts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (cart.length === 0) {
        setLoading(false);
        return;
      }
      const ids = cart.map((i) => i.bot_id);
      const { data } = await supabase.from('bots').select('*').in('id', ids);
      
      const map: Record<string, any> = {};
      if (data) {
        data.forEach((p) => { map[p.id] = p; });
      }
      setProducts(map);
      setLoading(false);
    }
    loadProducts();
  }, [cart.length]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-400">در حال بارگذاری...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-2">سبد خرید شما خالی است</h2>
        <p className="text-gray-400 mb-6">هنوز هیچ محصولی به سبد خرید اضافه نکرده‌اید.</p>
        <Link to="/shop" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => {
    const product = products[item.bot_id];
    if (!product) return sum;
    const price = product[`price_${item.plan_months}`] || 0;
    return sum + Number(price);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">سبد خرید</h1>
      
      <div className="space-y-4 mb-8">
        {cart.map((item) => {
          const product = products[item.bot_id];
          if (!product) return null;
          
          const price = product[`price_${item.plan_months}`] || 0;
          
          return (
            <div key={item.bot_id} className="bg-[#1e2329] border border-gray-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={product.image_url || '/placeholder.png'} alt={product.title_fa} className="w-16 h-16 object-contain bg-[#0a0c10] rounded-lg p-2" />
                <div className="text-right">
                  <h3 className="text-white font-bold">{product.title_fa}</h3>
                  <p className="text-gray-400 text-sm mt-1">پلن {item.plan_months} ماهه</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-0 border-gray-700 pt-4 sm:pt-0">
                <div className="text-blue-400 font-bold">
                  {formatToman(price, 'fa')}
                </div>
                <button 
                  onClick={() => removeFromCart(item.bot_id)}
                  className="text-red-500 hover:text-red-400 p-2"
                  title="حذف از سبد"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#1e2329] border border-gray-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-gray-400 text-sm block mb-1">مبلغ قابل پرداخت:</span>
          <span className="text-2xl font-bold text-white">{formatToman(total, 'fa')}</span>
        </div>
        <Link to="/checkout" className="w-full sm:w-auto text-center bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          ادامه فرآیند خرید
        </Link>
      </div>
    </div>
  );
}
