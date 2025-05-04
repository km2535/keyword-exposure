import React from "react";
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

/**
 * Component for displaying category-specific charts
 */
const CategoryCharts = ({ rawData, categories }) => {
    // Color palette for charts
    const CHART_COLORS = ["#10b981", "#f87171", "#6b7280"];

    // If no data is available
    if (!rawData || !rawData.categoryData) {
        return null;
    }

    // Get category data for charts
    const getCategoryData = (categoryId) => {
        if (!rawData.categoryData[categoryId]) return null;
        return rawData.categoryData[categoryId].summary.exposureStatsData;
    };

    // Get category name
    const getCategoryName = (categoryId) => {
        return categories[categoryId]?.name || categoryId;
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
                카테고리별 노출 상태 분포
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.keys(categories).map((categoryId) => {
                    const chartData = getCategoryData(categoryId);
                    if (!chartData) return null;

                    return (
                        <div
                            key={categoryId}
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <h3 className="text-md font-medium mb-3 text-gray-700 text-center">
                                {getCategoryName(categoryId)} 카테고리
                            </h3>
                            <div className="h-60">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name}: ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        CHART_COLORS[
                                                            index %
                                                                CHART_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [
                                                value,
                                                "키워드 수",
                                            ]}
                                        />
                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-2 text-center">
                                <p className="text-sm text-gray-600">
                                    총 키워드:{" "}
                                    {
                                        rawData.categoryData[categoryId].summary
                                            .totalKeywords
                                    }
                                    개
                                </p>
                                <p className="text-sm text-gray-600">
                                    노출 성공률:
                                    <span
                                        className={`ml-1 font-medium ${
                                            rawData.categoryData[categoryId]
                                                .summary.exposureSuccessRate >
                                            70
                                                ? "text-green-600"
                                                : rawData.categoryData[
                                                      categoryId
                                                  ].summary
                                                      .exposureSuccessRate > 40
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {
                                            rawData.categoryData[categoryId]
                                                .summary.exposureSuccessRate
                                        }
                                        %
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Comparison Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-md font-medium mb-4 text-gray-700">
                    카테고리별 노출 현황 비교
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={Object.keys(categories)
                                .map((categoryId) => {
                                    const summary =
                                        rawData.categoryData[categoryId]
                                            ?.summary;
                                    if (!summary) return null;

                                    return {
                                        name: getCategoryName(categoryId),
                                        노출됨: summary.exposedKeywords,
                                        "노출 안됨": summary.notExposedKeywords,
                                        "URL 없음": summary.noUrlKeywords,
                                    };
                                })
                                .filter(Boolean)}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 60,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="노출됨"
                                stackId="a"
                                fill={CHART_COLORS[0]}
                            />
                            <Bar
                                dataKey="노출 안됨"
                                stackId="a"
                                fill={CHART_COLORS[1]}
                            />
                            <Bar
                                dataKey="URL 없음"
                                stackId="a"
                                fill={CHART_COLORS[2]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CategoryCharts;
