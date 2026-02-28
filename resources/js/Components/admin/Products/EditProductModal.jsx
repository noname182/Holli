import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Info, Package } from 'lucide-react';
import GeneralInfoTab from './GeneralInfoTab';
import InventoryTab from './InventoryTab';
import ImageViewer from './ImageViewer';
import { router } from '@inertiajs/react';

export default function ProductEditModal({ isOpen, onClose, product }) {
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('general');
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadingVariantIndex, setUploadingVariantIndex] = useState(null);

    // Estado inicial limpio según tu DB de productos
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        benefits: [], // <--- Inicializamos array de beneficios
        variants: []
    });

    useEffect(() => {
        if (product) {
            setFormData({ 
                id: product.id,
                name: product.name,
                description: product.description || '',
                // Mapeamos solo el texto del beneficio para el estado local
                benefits: product.benefits?.map(b => b.benefit) || [], 
                variants: product.variants || [] 
            });
        }
    }, [product]);

    const handleBenefitsChange = (newBenefits) => {
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Image = event.target.result;
            const newVariants = [...formData.variants];
            newVariants[uploadingVariantIndex].preview = base64Image;
            newVariants[uploadingVariantIndex].newFile = file; 
            setFormData({ ...formData, variants: newVariants });
            setPreviewImage(base64Image); 
        };
        reader.readAsDataURL(file);
    };

    const handleClose = () => {
        // Restauramos el formData a los valores originales del producto antes de cerrar
        if (product) {
            setFormData({ 
                id: product.id,
                name: product.name,
                description: product.description || '',
                benefits: product.benefits?.map(b => b.benefit) || [], 
                variants: product.variants || [] 
            });
        }
        onClose(); // Llamamos a la función original que cierra el modal
    };

    const handleSubmit = () => {
        if (!formData.name?.trim()) return alert("El nombre es obligatorio");

        const data = new FormData();
        data.append('_method', 'PUT'); // Spoofing para Laravel
        
        data.append('id', formData.id);
        data.append('name', formData.name);
        data.append('description', formData.description || '');

        formData.benefits.forEach((benefit, index) => {
            data.append(`benefits[${index}]`, benefit);
        });

        formData.variants.forEach((v, index) => {
            data.append(`variants[${index}][id]`, v.id);
            data.append(`variants[${index}][sku]`, v.sku);
            // Envío de precio con punto decimal
            data.append(`variants[${index}][price]`, String(v.price).replace(',', '.'));
            data.append(`variants[${index}][stock]`, v.stock);
            // CAMBIO: Enviamos weight en lugar de volume
            data.append(`variants[${index}][weight]`, v.weight || '');

            if (v.newFile) {
                data.append(`variants[${index}][newFile]`, v.newFile);
            }
        });

        router.post(route('admin.products.update', formData.id), data, {
            onSuccess: () => onClose(),
            forceFormData: true,
            preserveScroll: true
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    {/* Cambio de Título a Producto */}
                    <h2 className="text-2xl font-bold text-gray-900 text-left">Editar Producto</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
                </div>

                <div className="flex px-6 border-b border-gray-100 bg-gray-50/50">
                    <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}><Info size={18} /> Información General</button>
                    <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all ${activeTab === 'inventory' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}><Package size={18} /> Inventario y Variantes</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'general' ? (
                        <GeneralInfoTab 
                            formData={formData} 
                            onChange={handleInputChange} 
                            onBenefitsChange={handleBenefitsChange} // <--- Nueva prop
                        />
                    ) : (
                        <InventoryTab 
                            variants={formData.variants} 
                            onVariantChange={handleVariantChange}
                            onImageClick={(index) => {
                                const v = formData.variants[index];
                                console.log("el valor de v:",v);
                                // Log militar para ver el ADN del objeto
                                console.log("🔍 INSPECCIÓN DE VARIANTE:", v);
                                console.log("📸 CONTENIDO MULTIMEDIA:", v.multimedia);

                                // Intentamos extraer la URL de forma segura
                                const url = v.preview || (v.multimedia && v.multimedia.length > 0 ? v.multimedia[0].url : null);
                                
                                console.log("🚀 URL FINAL ENVIADA:", url);

                                setUploadingVariantIndex(index);
                                setPreviewImage(url);
                                setShowImageViewer(true);
                            }}
                        />
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                    <button onClick={handleClose} className="px-8 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">Cancelar</button>
                    <button 
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                    >
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            
            {showImageViewer && (
                <ImageViewer 
                    isOpen={showImageViewer} 
                    src={previewImage} 
                    onClose={() => setShowImageViewer(false)} 
                    onFileSelect={() => fileInputRef.current.click()} 
                />
            )}
        </div>
    );
}