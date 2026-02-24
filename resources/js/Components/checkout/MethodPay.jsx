'use client';
import React from "react";

export default function MethodPay({ method, setMethod }) {
    return (
        <div className="bg-white border border-grayCustom rounded-2xl p-6 mb-6 shadow-lg">
            <h3 className="text-darkGray font-bold text-2xl mb-5 border-b border-grayCustom pb-3">
                Método de Pago
            </h3>

            {/* Transferencia Bancaria */}
            <div className="mb-4">
                <label
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setMethod("transfer")}
                >
                    <input
                        type="radio"
                        value="transfer"
                        checked={method === "transfer"}
                        readOnly
                        className="w-5 h-5 text-turquoise accent-turquoise"
                    />
                    <span className="text-darkGray font-medium">
                        Transferencia Bancaria
                    </span>
                </label>

                <div
                    className={`mt-3 border border-grayCustom rounded-xl bg-gray-50 overflow-hidden transition-all duration-500 ease-out ${
                        method === "transfer" ? "max-h-[600px]" : "max-h-0"
                    }`}
                >
                    <div className="p-5 space-y-3">
                        <p className="text-darkGray font-semibold text-lg">
                            Realiza tu pago mediante transferencia bancaria:
                        </p>

                        <div className="text-darkGray text-sm space-y-1">
                            <p><span className="font-semibold">Titular:</span> Mackarena Soledad Rojas Aedo</p>
                            <p><span className="font-semibold">RUT:</span> 16.674.889-5</p>
                            <p><span className="font-semibold">Banco:</span> Mercado Pago</p>
                            <p><span className="font-semibold">Tipo de cuenta:</span> Cuenta Vista</p>
                            <p><span className="font-semibold">N° de cuenta:</span> 1017445099</p>
                            <p><span className="font-semibold">Correo:</span> rojasaedomackarena@gmail.com</p>
                        </div>

                        <p className="text-grayCustom text-sm leading-relaxed pt-2">
                            Por favor, utiliza el <strong>número del pedido mandado al correo registrado</strong> como referencia de pago.<br />
                            El pedido será procesado una vez confirmado el pago.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
