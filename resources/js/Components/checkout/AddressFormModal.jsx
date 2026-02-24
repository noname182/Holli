'use client';
import { X } from "lucide-react";
import { useState } from "react";

export default function AddressModal({ open, onClose, setAddress }) {
    if (!open) return null;

    const [form, setForm] = useState({
        street: "",
        city: "",
        zone: "",
        link: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        // Validar que todos los campos estén llenos
        if (!form.street.trim() || !form.city.trim() || !form.zone.trim() || !form.link.trim()) {
            alert("Por favor completa todos los campos antes de guardar.");
            return; // No hace nada si hay campos vacíos
        }

        // Crear string legible para el administrador
        const adminAddress = `
Calle: ${form.street.trim()}
Ciudad: ${form.city.trim()}
Zona: ${form.zone.trim()}
Link: ${form.link.trim()}
        `.trim();

        // Guardamos solo un string
        setAddress(adminAddress);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-96 p-5 rounded-xl shadow-2xl"
                style={{
                    background: "#0d0d16",
                    border: "1px solid #d4af37"
                }}>
                 
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">Ingresar dirección</h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-gray-300 hover:text-white" />
                    </button>
                </div>

                <div className="space-y-3">
                    {["street","city","zone","link"].map((field) => (
                        <input
                            key={field}
                            name={field}
                            placeholder={
                                field === "street" ? "Calle y número" :
                                field === "city" ? "Ciudad" :
                                field === "zone" ? "Zona / Barrio" : "Link de ubicación"
                            }
                            className="w-full p-2 rounded bg-[#141426] border border-gray-600 
                                       text-white placeholder-gray-300 
                                       focus:outline-none focus:border-[#d4af37]"
                            onChange={handleChange}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSave}
                    className="mt-5 w-full py-2 rounded text-black font-semibold"
                    style={{
                        backgroundColor: "#d4af37",
                        boxShadow: "0 0 12px rgba(212,175,55,0.45)"
                    }}
                >
                    Guardar dirección
                </button>
            </div>
        </div>
    );
}
