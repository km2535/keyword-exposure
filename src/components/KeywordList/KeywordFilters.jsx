import React from "react";

/**
 * Component for filtering and sorting keywords
 */
const KeywordFilters = ({
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filter,
    setFilter,
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="mr-2 px-3 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="keyword">키워드순</option>
                    <option value="exposureStatus">노출 상태순</option>
                    <option value="totalUrls">URL 수순</option>
                </select>
                <select
                    value={sortDirection}
                    onChange={(e) => setSortDirection(e.target.value)}
                    className="mr-2 px-3 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="asc">오름차순</option>
                    <option value="desc">내림차순</option>
                </select>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="키워드 검색..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>
        </div>
    );
};

export default KeywordFilters;
