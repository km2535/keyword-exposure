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
 * Component for displaying summary charts (pie chart and bar chart)
 */
const SummaryCharts = ({ summary }) => {
    // Color palette for charts
    const CHART_COLORS = ["#10b981", "#f87171", "#6b7280"];

    return (
        <>
            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                    키워드 노출 상태 분포
                </h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={summary.exposureStatsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {summary.exposureStatsData.map(
                                    (entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                CHART_COLORS[
                                                    index % CHART_COLORS.length
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [value, "키워드 수"]}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                    키워드 노출 상태 (수치)
                </h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={summary.exposureStatsData}
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
                                formatter={(value) => [value, "키워드 수"]}
                            />
                            <Bar dataKey="value" fill="#3b82f6">
                                {summary.exposureStatsData.map(
                                    (entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                CHART_COLORS[
                                                    index % CHART_COLORS.length
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
        </>
    );
};

export default SummaryCharts;
