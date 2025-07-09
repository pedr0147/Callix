// Mostra sobreposição de chamada em curso
const CallingOverlay = ({ calleeName, localStream, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg text-center space-y-4">
        <h2 className="text-lg font-semibold">📞 Calling to {calleeName}...</h2>
        <video
          autoPlay
          muted
          playsInline
          className="rounded w-48 h-32 mx-auto"
          ref={(video) => {
            if (video && localStream) video.srcObject = localStream;
          }}
        />
        <button onClick={onCancel} className="btn btn-error">Cancel</button>
      </div>
    </div>
  );
};

export default CallingOverlay;
