import { CartProvider } from '@/Contexts/CartContext';
import CheckoutPageContent from '@/Pages/checkout.jsx';

export default function CheckoutWrapper(props) {
    return (
        <CartProvider>
            <CheckoutPageContent {...props} />
        </CartProvider>
    );
}
