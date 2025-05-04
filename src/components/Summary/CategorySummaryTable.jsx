import React from "react";
import { exportSummaryToExcel } from "../../utils/exportUtils";

/**
 * Component for displaying summary statistics by category
 */
const CategorySummaryTable = ({ rawData, categories }) => {
    // If no data is available
    if (!rawData || !rawData.categoryData) {
        return null;
    }

    // Prepare data for display in table
    const summaryData = {};
    Object.keys(categories).forEach((categoryId) => {
        if (rawData.categoryData[categoryId]) {
            summaryData[categoryId] = rawData.categoryData[categoryId].summary;
        }
    });

    // Add the all categories summary
    summaryData["all"] = rawData.allSummary;

    // Handler for exporting summary to Excel
    const handleExportSummary = () => {
        exportSummaryToExcel(summaryData);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                    카테고리별 요약
                </h2>
                <button
                    onClick={handleExportSummary}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Excel로 내보내기
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                카테고리
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                총 키워드 수
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                URL 있는 키워드
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                노출된 키워드
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                노출 성공률
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* All categories row */}
                        <tr className="bg-blue-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                전체
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {summaryData.all.totalKeywords}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {summaryData.all.keywordsWithUrls}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {summaryData.all.exposedKeywords}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {summaryData.all.exposureSuccessRate}%
                                </span>
                            </td>
                        </tr>

                        {/* Individual category rows */}
                        {Object.entries(categories).map(([id, category]) => (
                            <tr key={id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {summaryData[id]?.totalKeywords || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {summaryData[id]?.keywordsWithUrls || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {summaryData[id]?.exposedKeywords || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            (summaryData[id]
                                                ?.exposureSuccessRate || 0) > 70
                                                ? "bg-green-100 text-green-800"
                                                : (summaryData[id]
                                                      ?.exposureSuccessRate ||
                                                      0) > 40
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {summaryData[id]?.exposureSuccessRate ||
                                            0}
                                        %
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategorySummaryTable;
