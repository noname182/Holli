import { CartProvider } from '@/Contexts/CartContext';
import CheckoutPageContent from '@/Components/checkout/CheckoutPageContent';

export default function CheckoutWrapper(props) {
    return (
        <CartProvider>
            <CheckoutPageContent {...props} />
        </CartProvider>
    );
}
