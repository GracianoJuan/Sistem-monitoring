const Modal = ({ isOpen, onClose, title, children, size = 'max-w-6xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-brightness-25 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${size} max-h-[90vh] overflow-hidden`}>
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal };