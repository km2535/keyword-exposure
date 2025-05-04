import React from "react";

/**
 * Loading spinner component
 */
const LoadingSpinner = ({ message = "데이터 로딩 중..." }) => {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
