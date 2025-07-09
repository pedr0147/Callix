const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="bg-base-200 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-bold mb-4">Apagar conta</h2>
        <p className="mb-6 text-base-content/70">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDeleteModal;
