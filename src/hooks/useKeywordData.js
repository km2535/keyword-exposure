import { useEffect, useState } from "react";

// Category configuration
const CATEGORIES = {
    cancer: {
        id: "cancer",
        name: "암",
        dataFile: "/data/latest_results_cancer.json",
    },
    diabetes: {
        id: "diabetes",
        name: "당뇨",
        dataFile: "/data/latest_results_diabetes.json",
    },
    cosmetics: {
        id: "cosmetics",
        name: "갱년기",
        dataFile: "/data/latest_results_cream.json",
    },
};

// Custom hook for fetching and processing keyword data
const useKeywordData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all"); // 'all', 'cancer', 'diabetes', 'cosmetics'

    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);

                // Fetch data for all categories
                const categoryPromises = Object.values(CATEGORIES).map(
                    async (category) => {
                        try {
                            const response = await fetch(category.dataFile);

                            if (!response.ok) {
                                console.warn(
                                    `Could not load data for category ${category.name}: HTTP ${response.status}`
                                );
                                return {
                                    category: category.id,
                                    data: { results: [] },
                                    timestamp: null,
                                    error: true,
                                };
                            }

                            const jsonData = await response.json();
                            return {
                                category: category.id,
                                data: jsonData,
                                timestamp: jsonData.timestamp || null,
                                error: false,
                            };
                        } catch (err) {
                            console.error(
                                `Error loading data for ${category.name}:`,
                                err
                            );
                            return {
                                category: category.id,
                                data: { results: [] },
                                timestamp: null,
                                error: true,
                            };
                        }
                    }
                );

                const results = await Promise.all(categoryPromises);

                // Combine and process all the data
                const processedData = processCategoryData(results);
                setData(processedData);
                setLoading(false);
            } catch (error) {
                console.error("데이터 로딩 중 오류 발생:", error);
                setError(
                    "데이터를 불러오는 중 오류가 발생했습니다: " + error.message
                );
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    // Process data from all categories
    const processCategoryData = (categoryResults) => {
        // Initialize container for all keywords with their category
        let allKeywordsData = [];
        const timestamps = {};
        const categoryData = {};

        // Process each category's data
        categoryResults.forEach(({ category, data, timestamp }) => {
            const results = data.results || [];
            timestamps[category] = timestamp;

            // Process the keywords for this category
            const keywordsData = results.map((result) => {
                const keyword = result.keyword;
                const urls = result.urls || [];
                const totalUrls = urls.length;

                // Exposure status
                const hasExposedUrl = urls.some((url) => url.is_exposed);
                const exposureStatus = hasExposedUrl
                    ? "노출됨"
                    : totalUrls > 0
                    ? "노출 안됨"
                    : "URL 없음";

                return {
                    keyword,
                    category,
                    totalUrls,
                    exposureStatus,
                    hasExposedUrl,
                    urls: urls.map((url) => ({
                        url: url.url,
                        isExposed: url.is_exposed,
                    })),
                };
            });

            // Add to all keywords and store category-specific data
            allKeywordsData = [...allKeywordsData, ...keywordsData];
            categoryData[category] = {
                keywordsData,
                summary: calculateSummary(keywordsData),
            };
        });

        // Calculate summary for all categories combined
        const allSummary = calculateSummary(allKeywordsData);

        return {
            timestamps,
            allKeywordsData,
            categoryData,
            allSummary,
        };
    };

    // Calculate summary statistics for a set of keywords
    const calculateSummary = (keywordsData) => {
        // Exposure status counts
        const exposedKeywords = keywordsData.filter(
            (item) => item.exposureStatus === "노출됨"
        ).length;

        const notExposedKeywords = keywordsData.filter(
            (item) => item.exposureStatus === "노출 안됨"
        ).length;

        const noUrlKeywords = keywordsData.filter(
            (item) => item.exposureStatus === "URL 없음"
        ).length;

        // Chart data
        const exposureStatsData = [
            { name: "노출됨", value: exposedKeywords },
            { name: "노출 안됨", value: notExposedKeywords },
            { name: "URL 없음", value: noUrlKeywords },
        ];

        // Summary statistics
        const totalKeywords = keywordsData.length;
        const keywordsWithUrls = keywordsData.filter(
            (item) => item.totalUrls > 0
        ).length;
        const exposureSuccessRate =
            keywordsWithUrls > 0
                ? Math.round((exposedKeywords / keywordsWithUrls) * 100)
                : 0;

        return {
            totalKeywords,
            keywordsWithUrls,
            exposedKeywords,
            notExposedKeywords,
            noUrlKeywords,
            exposureSuccessRate,
            exposureStatsData,
        };
    };

    // Get data filtered by the active category
    const getFilteredData = () => {
        if (!data) return null;

        if (activeCategory === "all") {
            return {
                keywordsData: data.allKeywordsData,
                summary: data.allSummary,
                timestamps: data.timestamps,
                categories: Object.keys(CATEGORIES).map((id) => ({
                    id,
                    name: CATEGORIES[id].name,
                })),
            };
        }

        return {
            keywordsData: data.categoryData[activeCategory].keywordsData,
            summary: data.categoryData[activeCategory].summary,
            timestamp: data.timestamps[activeCategory],
            categories: Object.keys(CATEGORIES).map((id) => ({
                id,
                name: CATEGORIES[id].name,
            })),
        };
    };

    return {
        data: getFilteredData(),
        rawData: data,
        loading,
        error,
        activeCategory,
        setActiveCategory,
        categories: CATEGORIES,
    };
};

export default useKeywordData;
