import * as XLSX from "xlsx";

/**
 * Export keyword data to Excel (XLSX) file
 * @param {Array} keywordsData - The keyword data to export
 * @param {String} filename - The name of the exported file
 * @param {String} categoryName - The category name to include in the filename
 */
export const exportToExcel = (
    keywordsData,
    filename = "keyword-export",
    categoryName = ""
) => {
    try {
        // Prepare the data for export
        const exportData = keywordsData.map((item) => {
            // Count exposed and non-exposed URLs
            const exposedUrls = item.urls.filter((u) => u.isExposed).length;
            const totalUrls = item.urls.length;

            // Format URL data as a string
            const urlsString = item.urls
                .map(
                    (url) => `${url.url} (${url.isExposed ? "노출" : "미노출"})`
                )
                .join(", ");

            return {
                키워드: item.keyword,
                카테고리: getCategoryLabel(item.category),
                "노출 상태": item.exposureStatus,
                "노출된 URL 수": exposedUrls,
                "전체 URL 수": totalUrls,
                "URL 리스트": urlsString,
            };
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Set column widths
        const columnWidths = [
            { wch: 20 }, // 키워드
            { wch: 10 }, // 카테고리
            { wch: 10 }, // 노출 상태
            { wch: 15 }, // 노출된 URL 수
            { wch: 15 }, // 전체 URL 수
            { wch: 70 }, // URL 리스트
        ];
        ws["!cols"] = columnWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "키워드 데이터");

        // Generate filename with timestamp and category if provided
        const timestamp = new Date().toISOString().split("T")[0];
        const finalFilename = categoryName
            ? `${filename}-${categoryName}-${timestamp}.xlsx`
            : `${filename}-${timestamp}.xlsx`;

        // Save the file
        XLSX.writeFile(wb, finalFilename);

        return true;
    } catch (error) {
        console.error("Excel 내보내기 오류:", error);
        return false;
    }
};

/**
 * Get human-readable category label
 * @param {String} categoryId - The category identifier
 * @returns {String} - The human-readable category name
 */
const getCategoryLabel = (categoryId) => {
    const categories = {
        cancer: "암",
        diabetes: "당뇨",
        cosmetics: "갱년기",
    };

    return categories[categoryId] || categoryId;
};

/**
 * Export summary data to Excel
 * @param {Object} summaryData - Summary statistics by category
 * @param {String} filename - The name of the exported file
 */
export const exportSummaryToExcel = (
    summaryData,
    filename = "keyword-summary"
) => {
    try {
        // Prepare summary data for each category
        const exportData = Object.entries(summaryData).map(
            ([category, data]) => {
                return {
                    카테고리: getCategoryLabel(category),
                    "총 키워드 수": data.totalKeywords,
                    "URL이 있는 키워드 수": data.keywordsWithUrls,
                    "노출된 키워드 수": data.exposedKeywords,
                    "노출 안된 키워드 수": data.notExposedKeywords,
                    "URL 없는 키워드 수": data.noUrlKeywords,
                    "노출 성공률": `${data.exposureSuccessRate}%`,
                };
            }
        );

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Set column widths
        const columnWidths = [
            { wch: 15 }, // 카테고리
            { wch: 15 }, // 총 키워드 수
            { wch: 20 }, // URL이 있는 키워드 수
            { wch: 15 }, // 노출된 키워드 수
            { wch: 20 }, // 노출 안된 키워드 수
            { wch: 20 }, // URL 없는 키워드 수
            { wch: 15 }, // 노출 성공률
        ];
        ws["!cols"] = columnWidths;

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "요약 데이터");

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0];
        const finalFilename = `${filename}-${timestamp}.xlsx`;

        // Save the file
        XLSX.writeFile(wb, finalFilename);

        return true;
    } catch (error) {
        console.error("Excel 요약 내보내기 오류:", error);
        return false;
    }
};
