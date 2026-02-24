import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';

export default function CartIconadmin({ onClick }) {
  const { cartCount } = useCart();

  return (
    <div
      className="fixed top-1/2 right-0 -translate-y-1/2 flex items-center cursor-pointer z-50"
      onClick={onClick}
    >
      <div className="bg-black w-14 h-40 rounded-l-full shadow-lg flex flex-col items-center justify-center  relative">
        <ShoppingCart size={32} className="text-white" />
        {cartCount > 0 && (
          <span className="absolute -mt-8 -right-0 bg-white text-black text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-sm">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
}
