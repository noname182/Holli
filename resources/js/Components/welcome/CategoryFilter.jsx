import { useState } from 'react';
import { Menu } from 'lucide-react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Botón de menú */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-gray-800 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Dropdown de categorías */}
      <div
        className={`overflow-hidden transition-all duration-300 mt-2 ${
          open ? 'max-w-xs max-h-60 opacity-100' : 'max-w-0 max-h-0 opacity-0'
        }`}
      >
        <ul className="bg-white border border-gray-300 rounded-2xl shadow-lg max-h-60 overflow-y-auto w-48 animate-slide-down">
          <li
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              selectedCategory === '' ? 'bg-gray-100 font-semibold' : ''
            }`}
            onClick={() => { onSelectCategory(''); setOpen(false); }}
          >
            Todas
          </li>
          {categories.map(cat => (
            <li
              key={cat.id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedCategory === cat.name ? 'bg-gray-100 font-semibold' : ''
              }`}
              onClick={() => { onSelectCategory(cat.name); setOpen(false); }}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
