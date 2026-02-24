    export default function PlaceOrderButton({ handlePlaceOrder }) {
    return (
        <button
            onClick={handlePlaceOrder}
            className="block w-full py-3 text-center bg-brandGold text-brandBlack font-semibold rounded-xl hover:bg-[#bfa333] transition"
        >
            Realizar pedido
        </button>
    );
}
