import React from "react";

/**
 * Component for displaying summary statistics cards
 */
const SummaryCards = ({ summary }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Keywords Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-sm font-medium text-gray-500">
                    총 키워드 수
                </h2>
                <p className="text-3xl font-bold text-blue-700">
                    {summary.totalKeywords}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    URL이 있는 키워드: {summary.keywordsWithUrls}
                </p>
            </div>

            {/* Exposed Keywords Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-sm font-medium text-gray-500">
                    노출된 키워드 수
                </h2>
                <p className="text-3xl font-bold text-green-600">
                    {summary.exposedKeywords}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    노출 안된 키워드: {summary.notExposedKeywords}
                </p>
            </div>

            {/* Success Rate Card */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-sm font-medium text-gray-500">
                    노출 성공률
                </h2>
                <p className="text-3xl font-bold text-amber-600">
                    {summary.exposureSuccessRate}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    (URL이 있는 키워드 기준)
                </p>
            </div>
        </div>
    );
};

export default SummaryCards;
