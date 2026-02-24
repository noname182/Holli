'use client';
import { Map, Pencil } from 'lucide-react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import AddressModal from './AddressFormModal';

export default function ShippingForm({
    shippingType,
    setShippingType,
    date,
    setDate,
    time,
    setTime,
    address,
    setAddress
}) {

    const [showAddressModal, setShowAddressModal] = useState(false);

    const [hours] = useState(
        Array.from({ length: 25 }, (_, i) => {
            const h = String(i).padStart(2, '0');
            return [`${h}:00`, `${h}:30`];
        }).flat()
    );

    return (
        <>
            {/* MODAL DE DIRECCIÓN */}
            <AddressModal
                open={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                setAddress={setAddress}
            />

            <div className="border border-gray-700 p-4 rounded mb-4">
                <h3 className="font-semibold mb-4 text-white">Envío *</h3>

                {/* Radios */}
                <div className="flex flex-col gap-2">
                    <label
                        className={`border p-3 rounded cursor-pointer ${
                            shippingType === 'local'
                                ? 'border-blue-500 bg-gray-800'
                                : 'border-gray-600'
                        }`}
                    >
                        <input
                            type="radio"
                            name="shipping"
                            value="local"
                            className="mr-2"
                            checked={shippingType === 'local'}
                            onChange={() => {
                                setShippingType("local");
                                setAddress("Recojo en el local");
                            }}
                        />
                        <span className="font-semibold text-white">Recojo en el local</span>
                    </label>

                    <label
                        className={`border p-3 rounded cursor-pointer ${
                            shippingType === 'envio'
                                ? 'border-blue-500 bg-gray-800'
                                : 'border-gray-600'
                        }`}
                    >
                        <input
                            type="radio"
                            name="shipping"
                            value="envio"
                            className="mr-2"
                            checked={shippingType === 'envio'}
                            onChange={() => {
                                setShippingType("envio");
                                setAddress(""); // obliga a llenar
                            }}
                        />
                        <span className="font-semibold text-white">Pedido a domicilio</span>
                    </label>
                </div>

                {/* Dirección */}
                {shippingType === 'envio' && (
                    <div className="mt-4">
                        {address ? (
                            <div className="border border-gray-700 p-3 rounded bg-gray-900">
                                <p className="text-gray-300 text-sm mb-2">
                                    <strong>Dirección:</strong> {address}
                                </p>
                                <button
                                    className="flex items-center gap-2 w-full justify-center border border-gray-600 rounded p-2 text-white hover:bg-gray-700"
                                    onClick={() => setShowAddressModal(true)}
                                >
                                    <Pencil size={16} /> Editar dirección
                                </button>
                            </div>
                        ) : (
                            <button
                                className="flex items-center gap-2 w-full justify-center border border-gray-600 rounded p-2 text-white hover:bg-gray-700"
                                onClick={() => setShowAddressModal(true)}
                            >
                                <Map size={16} /> Introduzca la dirección
                            </button>
                        )}
                    </div>
                )}

                {/* Fecha y hora */}
                <div className="mt-4 flex flex-col gap-2">
                    <label className="text-gray-300">Seleccione una fecha</label>
                    <DatePicker
                        className="w-full bg-black border border-gray-600 rounded p-2 text-white"
                        selected={date}
                        onChange={setDate}
                        minDate={new Date()}
                        placeholderText="Seleccione una fecha"
                        dateFormat="dd/MM/yyyy"
                    />

                    <label className="text-gray-300 mt-2">Seleccione una hora</label>
                    <select
                        className="w-full bg-black border border-gray-600 rounded p-2 text-white"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        disabled={!date}
                    >
                        <option value="">-- Seleccione una hora --</option>
                        {hours.map((h) => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
}
