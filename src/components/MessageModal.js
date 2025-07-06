import Modal from "./Modal";

const MessageModal = ({ message, onClose }) => {
    return (
        <Modal isOpen={!!message} onClose={onClose} title="Notification">
             <p className="text-lg mb-4">{message}</p>
            <div className="flex justify-end">
                <button onClick={onClose} className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-600 transition duration-300">OK</button>
            </div>
        </Modal>
    );
};

export default MessageModal;