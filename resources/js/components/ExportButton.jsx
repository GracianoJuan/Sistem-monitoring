import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportButton = ({ data, fileName, fields }) => {
    const handleExport = async () => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Data");

            if (fields && fields.length > 0) {
                const headers = fields.map(field => field.label);
                worksheet.addRow(headers);

                data.forEach((item) => {
                    const row = fields.map(field => item[field.key]);
                    worksheet.addRow(row);
                });
            } else {
                const headers = Object.keys(data[0]);
                worksheet.addRow(headers);

                data.forEach((item) => {
                    worksheet.addRow(headers.map((h) => item[h]));
                });
            }

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true };
            headerRow.alignment = { horizontal: "center" };
            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFD9D9D9" },
                };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const len = cell.value ? cell.value.toString().length : 10;
                    if (len > maxLength) maxLength = len;
                });
                column.width = maxLength < 10 ? 10 : maxLength + 2;
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), fileName || 'export.xlsx');
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting data. Please try again.');
        }
    };

    return (
        <button
            onClick={handleExport}
            className="border-1 rounded-xl mt-3 px-2 py-0.5 text-green-600 hover:text-white hover:bg-green-600 active:bg-green-800"
        >
            Export to Excel
        </button>
    );
};

export default ExportButton;
