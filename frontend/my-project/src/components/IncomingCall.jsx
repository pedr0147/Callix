const IncomingCall = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg text-center space-y-4">
        <h2 className="text-lg font-semibold">📞 {callerName} is calling!</h2>
        <div className="flex justify-center gap-4">
          <button onClick={onAccept} className="btn btn-success">Accept</button>
          <button onClick={onReject} className="btn btn-error">Refuse</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;