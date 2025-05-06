function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded p-4 max-w-3xl w-full">
          <button
            onClick={onClose}
            className="float-right text-red-500 hover:text-red-700"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  
  export default Modal;