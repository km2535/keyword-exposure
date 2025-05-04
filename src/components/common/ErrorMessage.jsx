import React from "react";

/**
 * Error message component
 */
const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="p-6 bg-red-50 rounded-lg">
            <h1 className="text-xl font-bold mb-2 text-red-800">오류 발생</h1>
            <p className="text-red-700">{message}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    다시 시도
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
