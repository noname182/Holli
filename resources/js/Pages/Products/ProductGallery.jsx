import { useState } from "react";

export default function ProductGallery({ multimedia, productName }) {
  const orderedMultimedia = [
    ...multimedia.filter(m => m.type === "video"),
    ...multimedia.filter(m => m.type !== "video"),
  ];

  const [zoomIndex, setZoomIndex] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  const getMediaClass = (media, index, total) => {
    if (media.type === "video") return "h-[200px] md:h-[320px] md:col-span-2";

    if (total === 1) return "h-[400px] md:h-[500px] md:col-span-2"; // una sola imagen: ocupa todo
    if (total === 2) return "h-[350px] md:h-[400px] md:col-span-2"; // dos imágenes: una arriba, otra abajo
    if (total === 3) return "h-[280px] md:h-[320px]"; // tres: se ajustan normalmente
    return "h-[280px] md:h-[320px]"; // cuatro o más: diseño en grid normal
  };

  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4`}
      >
        {orderedMultimedia.map((media, index) => (
          <div
            key={index}
            className={`relative w-full overflow-hidden bg-white rounded-xl shadow ${getMediaClass(
              media,
              index,
              orderedMultimedia.length
            )}`}
          >
            {media.type === "video" ? (
              <video
                src={media.url}
                controls
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <img
                src={media.url}
                alt={`${productName}-${index}`}
                onMouseEnter={() =>
                  window.innerWidth >= 768 && setZoomIndex(index)
                }
                onMouseLeave={() =>
                  window.innerWidth >= 768 && setZoomIndex(null)
                }
                onMouseMove={handleMouseMove}
                onClick={() =>
                  window.innerWidth < 768 && setMobileImage(media.url)
                }
                className={`w-full h-full transition-transform duration-500 ${
                  zoomIndex === index && window.innerWidth >= 768
                    ? "scale-[1.6] cursor-crosshair object-cover"
                    : "scale-100 cursor-zoom-in object-contain"
                }`}
                style={{
                  transformOrigin: `${position.x}% ${position.y}%`,
                }}
              />
            )}
          </div>
        ))}
      </div> 

      {mobileImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[100000] p-4">
          <button
            onClick={() => setMobileImage(null)}
            className="absolute top-6 right-6 text-white text-4xl font-bold z-50"
          >
            ×
          </button>
          <img
            src={mobileImage}
            alt={productName}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-xl"
          />
        </div>
      )}
    </>
  );
}
