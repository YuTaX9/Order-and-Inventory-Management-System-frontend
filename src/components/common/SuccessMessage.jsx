export const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="card bg-green-50 border-green-200 animate-fade-in">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-green-800 font-semibold mb-1">Success!</h3>
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;
