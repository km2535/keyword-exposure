import React from "react";

/**
 * Tab navigation component
 * @param {Array} tabs - Array of tab objects with id and label properties
 * @param {String} activeTab - Currently active tab ID
 * @param {Function} onTabChange - Tab change handler
 */
const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="border-b border-gray-200 mb-6">
            <ul className="flex flex-wrap -mb-px">
                {tabs.map((tab) => (
                    <li key={tab.id} className="mr-2">
                        <button
                            className={`inline-block p-4 ${
                                activeTab === tab.id
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TabNavigation;
