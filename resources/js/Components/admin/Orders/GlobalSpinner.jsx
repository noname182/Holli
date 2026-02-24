export default function GlobalSpinner({ visible }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="w-20 h-20 border-8 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
