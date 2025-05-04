import React from "react";

/**
 * Component for displaying individual keyword items
 */
const KeywordItem = ({ item, index, categories }) => {
    // Get category name for display
    const getCategoryName = (categoryId) => {
        return (
            categories.find((cat) => cat.id === categoryId)?.name || categoryId
        );
    };

    // Get status CSS class
    const getStatusClass = (status) => {
        switch (status) {
            case "노출됨":
                return "bg-green-100 text-green-800";
            case "노출 안됨":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className={`p-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900 mr-2">
                        {item.keyword}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {getCategoryName(item.category)}
                    </span>
                </div>
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                        item.exposureStatus
                    )}`}
                >
                    {item.exposureStatus}
                </span>
            </div>

            {item.totalUrls > 0 ? (
                <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">
                        URL 목록 ({item.totalUrls}개):
                    </p>
                    <ul className="space-y-1">
                        {item.urls.map((urlItem, urlIndex) => (
                            <li
                                key={urlIndex}
                                className="text-sm flex items-center"
                            >
                                <span
                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                        urlItem.isExposed
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                ></span>
                                <a
                                    href={urlItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-blue-600 hover:underline ${
                                        urlItem.isExposed ? "font-medium" : ""
                                    }`}
                                >
                                    {urlItem.url}
                                </a>
                                {urlItem.isExposed && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        노출
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">URL 없음</p>
            )}
        </div>
    );
};

export default KeywordItem;
