import React, { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import "./KeywordStyle.css";

const KeywordExposureDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("summary");
    const [sortBy, setSortBy] = useState("keyword");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // 색상 팔레트
    const PIE_COLORS = ["#10b981", "#f87171", "#6b7280"];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await fetch("/data/latest_results.json");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();
                processData(jsonData);
            } catch (error) {
                console.error("데이터 로딩 중 오류 발생:", error);
                setError(
                    "데이터를 불러오는 중 오류가 발생했습니다: " + error.message
                );
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const processData = (rawData) => {
        const results = rawData.results || [];

        // 키워드별 URL 및 노출 상태 정보 추출
        const keywordsData = results.map((result) => {
            const keyword = result.keyword;
            const urls = result.urls || [];
            const totalUrls = urls.length;

            // 적어도 하나의 URL이 노출되면 성공으로 간주
            const hasExposedUrl = urls.some((url) => url.is_exposed);
            const exposureStatus = hasExposedUrl
                ? "노출됨"
                : totalUrls > 0
                ? "노출 안됨"
                : "URL 없음";

            return {
                keyword,
                totalUrls,
                exposureStatus,
                urls: urls.map((url) => ({
                    url: url.url,
                    isExposed: url.is_exposed,
                })),
            };
        });

        // 노출 상태별 키워드 수
        const exposedKeywords = keywordsData.filter(
            (item) => item.exposureStatus === "노출됨"
        ).length;
        const notExposedKeywords = keywordsData.filter(
            (item) => item.exposureStatus === "노출 안됨"
        ).length;
        const noUrlKeywords = keywordsData.filter(
            (item) => item.exposureStatus === "URL 없음"
        ).length;

        const exposureStatsData = [
            { name: "노출됨", value: exposedKeywords },
            { name: "노출 안됨", value: notExposedKeywords },
            { name: "URL 없음", value: noUrlKeywords },
        ];

        // 전체 키워드 수
        const totalKeywords = keywordsData.length;

        // 전체 URL이 있는 키워드 수
        const keywordsWithUrls = keywordsData.filter(
            (item) => item.totalUrls > 0
        ).length;

        // 노출 성공률 (URL이 있는 키워드 중 노출된 키워드 비율)
        const exposureSuccessRate =
            keywordsWithUrls > 0
                ? Math.round((exposedKeywords / keywordsWithUrls) * 100)
                : 0;

        // 분석된 데이터를 상태에 저장
        setData({
            timestamp: rawData.timestamp || "정보 없음",
            keywordsData,
            totalKeywords,
            keywordsWithUrls,
            exposedKeywords,
            notExposedKeywords,
            noUrlKeywords,
            exposureSuccessRate,
            exposureStatsData,
        });

        setLoading(false);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    const getSortedData = () => {
        if (!data) return [];

        const filteredData = data.keywordsData.filter((item) =>
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
    };

    const getPaginatedData = () => {
        const sortedData = getSortedData();
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    };

    const pageCount = data
        ? Math.ceil(getSortedData().length / itemsPerPage)
        : 0;

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">
                        데이터 로딩 중...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-lg">
                <h1 className="text-xl font-bold mb-2 text-red-800">
                    오류 발생
                </h1>
                <p className="text-red-700">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <h1 className="text-2xl font-bold mb-2 text-center text-blue-800">
                키워드 노출 여부 대시보드
            </h1>
            <p className="text-center text-gray-600 mb-6">
                데이터 타임스탬프: {data.timestamp}
            </p>

            {/* 탭 메뉴 */}
            <div className="border-b border-gray-200 mb-6">
                <ul className="flex flex-wrap -mb-px">
                    <li className="mr-2">
                        <button
                            className={`inline-block p-4 ${
                                activeTab === "summary"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("summary")}
                        >
                            요약
                        </button>
                    </li>
                    <li className="mr-2">
                        <button
                            className={`inline-block p-4 ${
                                activeTab === "keywordList"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("keywordList")}
                        >
                            키워드 목록
                        </button>
                    </li>
                </ul>
            </div>

            {/* 요약 탭 */}
            {activeTab === "summary" && (
                <div>
                    {/* 요약 카드 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-sm font-medium text-gray-500">
                                총 키워드 수
                            </h2>
                            <p className="text-3xl font-bold text-blue-700">
                                {data.totalKeywords}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                URL이 있는 키워드: {data.keywordsWithUrls}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-sm font-medium text-gray-500">
                                노출된 키워드 수
                            </h2>
                            <p className="text-3xl font-bold text-green-600">
                                {data.exposedKeywords}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                노출 안된 키워드: {data.notExposedKeywords}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-sm font-medium text-gray-500">
                                노출 성공률
                            </h2>
                            <p className="text-3xl font-bold text-amber-600">
                                {data.exposureSuccessRate}%
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                (URL이 있는 키워드 기준)
                            </p>
                        </div>
                    </div>

                    {/* 노출 상태 파이 차트 */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            키워드 노출 상태 분포
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.exposureStatsData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(
                                                0
                                            )}%`
                                        }
                                    >
                                        {data.exposureStatsData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        PIE_COLORS[
                                                            index %
                                                                PIE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [
                                            value,
                                            "키워드 수",
                                        ]}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 노출 상태 막대 차트 */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            키워드 노출 상태 (수치)
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data.exposureStatsData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [
                                            value,
                                            "키워드 수",
                                        ]}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6">
                                        {data.exposureStatsData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        PIE_COLORS[
                                                            index %
                                                                PIE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* 키워드 목록 탭 */}
            {activeTab === "keywordList" && (
                <div>
                    {/* 검색 및 필터 */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mr-2 px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="keyword">키워드순</option>
                                <option value="totalUrls">URL 수순</option>
                                <option value="exposureStatus">
                                    노출 상태순
                                </option>
                            </select>
                            <select
                                value={sortDirection}
                                onChange={(e) =>
                                    setSortDirection(e.target.value)
                                }
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

                    {/* 키워드 목록 (스크롤 가능한 박스) */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
                        <div className="flex items-center justify-between bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <div className="text-sm font-medium text-gray-500 uppercase">
                                총{" "}
                                <span className="font-bold text-gray-700">
                                    {getSortedData().length}
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

                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "600px" }}
                        >
                            <div className="divide-y divide-gray-200">
                                {getSortedData().map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 ${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {item.keyword}
                                            </h3>
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
                                                    URL 목록 ({item.totalUrls}
                                                    개):
                                                </p>
                                                <ul className="space-y-1">
                                                    {item.urls.map(
                                                        (urlItem, urlIndex) => (
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
                                                                    href={
                                                                        urlItem.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`text-blue-600 hover:underline ${
                                                                        urlItem.isExposed
                                                                            ? "font-medium"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {
                                                                        urlItem.url
                                                                    }
                                                                </a>
                                                                {urlItem.isExposed && (
                                                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                                        노출
                                                                    </span>
                                                                )}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">
                                                URL 없음
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeywordExposureDashboard;
