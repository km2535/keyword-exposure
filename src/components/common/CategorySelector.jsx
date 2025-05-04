import React from "react";

/**
 * Component for selecting the current category
 */
const CategorySelector = ({
    activeCategory,
    setActiveCategory,
    categories,
}) => {
    return (
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
            <div className="flex items-center">
                <span className="mr-3 text-sm font-medium text-gray-700">
                    카테고리:
                </span>
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-3 py-1 text-sm rounded-full ${
                            activeCategory === "all"
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                        }`}
                        onClick={() => setActiveCategory("all")}
                    >
                        전체
                    </button>

                    {Object.entries(categories).map(([id, category]) => (
                        <button
                            key={id}
                            className={`px-3 py-1 text-sm rounded-full ${
                                activeCategory === id
                                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveCategory(id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategorySelector;
