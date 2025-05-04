import React, { useMemo, useState } from "react";
import ExportButton from "./ExportButton";
import KeywordFilters from "./KeywordFilters";
import KeywordItem from "./KeywordItem";

/**
 * Component for displaying the keyword list with filtering and sorting
 */
const KeywordListView = ({ keywordsData, activeCategory, categories }) => {
    const [sortBy, setSortBy] = useState("keyword");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filter, setFilter] = useState("");

    // Get active category name for export
    const activeCategoryName = useMemo(() => {
        if (activeCategory === "all") return "전체";
        return (
            categories.find((cat) => cat.id === activeCategory)?.name ||
            activeCategory
        );
    }, [activeCategory, categories]);

    // Sort and filter keywords
    const getSortedData = useMemo(() => {
        if (!keywordsData) return [];

        const filteredData = keywordsData.filter((item) =>
            item.keyword.toLowerCase().includes(filter.toLowerCase())
        );

        return filteredData.sort((a, b) => {
            let comparison = 0;

            if (sortBy === "keyword") {
                comparison = a.keyword.localeCompare(b.keyword);
            } else if (sortBy === "totalUrls") {
                comparison = a.totalUrls - b.totalUrls;
            } else if (sortBy === "exposureStatus") {
                comparison = a.exposureStatus.localeCompare(b.exposureStatus);
            }

            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [keywordsData, sortBy, sortDirection, filter]);

    return (
        <div>
            {/* Search and filters */}
            <div className="flex justify-between items-center mb-4">
                <KeywordFilters
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    filter={filter}
                    setFilter={setFilter}
                />

                <ExportButton
                    keywordsData={getSortedData}
                    categoryName={activeCategoryName}
                />
            </div>

            {/* Keyword list */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
                <div className="flex items-center justify-between bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-500 uppercase">
                        총{" "}
                        <span className="font-bold text-gray-700">
                            {getSortedData.length}
                        </span>{" "}
                        개의 키워드
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {sortBy === "keyword"
                            ? "키워드"
                            : sortBy === "totalUrls"
                            ? "URL 수"
                            : "노출 상태"}
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                    </div>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: "600px" }}>
                    <div className="divide-y divide-gray-200">
                        {getSortedData.map((item, index) => (
                            <KeywordItem
                                key={index}
                                item={item}
                                index={index}
                                categories={categories}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeywordListView;
