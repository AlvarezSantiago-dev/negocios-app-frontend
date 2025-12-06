// components/ui/Modal.jsx
export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {children}

        <button
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
