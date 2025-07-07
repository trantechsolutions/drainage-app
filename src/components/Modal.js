const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div 
                className="modal-content bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white rounded-lg shadow-xl p-4"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-700 pb-2">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;