export const ErrorMessage = ({ message }) => {
  return (
    <div className="card bg-red-50 border-red-200">
      <div className="flex items-start space-x-3">
        <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="text-red-800 font-semibold mb-1">Error</h3>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;