import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const numFormat = {
    percent: '0%',
    currency: '"Rp" #,##0',
    number: '#,##0.00',
    date: 'dd-mmm-yyyy'
};

const ExportButton = ({ data, fileName, fields, showAlert }) => {
    const handleExport = async () => {
        if (!data || data.length === 0) {
            if (showAlert) {
                showAlert('No data to export!', 'error');
            }
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();
            newWorksheet(data, 'Data', fields, workbook);

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), fileName || 'export.xlsx');

            if (showAlert) {
                showAlert('Data exported successfully!', 'success');
            }
        } catch (error) {
            console.error('Export error:', error);
            if (showAlert) {
                showAlert('Error exporting data. Please try again.', 'error');
            }
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

const formatCellValue = (value, field) => {
    // Handle null/undefined
    if (value === null || value === undefined || value === '') return '';

    // Handle boolean
    if (field.type === 'boolean') {
        return value === true || value === 'true' || value === 1 ? 'Sudah' : 'Belum';
    }

    // Handle date - return as Date object for Excel to format
    if (field.type === 'date') {
        if (!value) return '';
        const date = dayjs(value);
        return date.isValid() ? date.toDate() : value;
    }

    // Handle percent - convert to decimal (e.g., 50 becomes 0.5)
    if (field.type === 'number' && field.note === 'percent') {
        const numValue = parseFloat(value);
        return isNaN(numValue) ? 0 : numValue / 100;
    }

    // Handle currency/number - return as number for Excel formatting
    if (field.note === 'currency' || field.type === 'number') {
        const numValue = parseFloat(value);
        return isNaN(numValue) ? 0 : numValue;
    }

    // Handle textarea - preserve line breaks
    if (field.type === 'textarea' && typeof value === 'string') {
        return value;
    }

    // Default: return as string
    return value;
};

const newWorksheet = (data, name, fields, workbook) => {
    const worksheet = workbook.addWorksheet(name);
    const processedData = data;

    if (!processedData || processedData.length === 0) return worksheet;

    if (fields && fields.length > 0) {
        // Add headers
        const headers = fields.map(field => field.label);
        worksheet.addRow(headers);

        // Add data rows
        processedData.forEach((item) => {
            const rowData = fields.map(field => formatCellValue(item[field.key], field));
            const row = worksheet.addRow(rowData);

            // Apply formatting to each cell based on field type
            fields.forEach((field, colIndex) => {
                const cell = row.getCell(colIndex + 1);
                
                // Apply number format
                if (field.note === 'percent') {
                    cell.numFmt = numFormat.percent;
                } else if (field.note === 'currency') {
                    cell.numFmt = numFormat.currency;
                } else if (field.type === 'date') {
                    cell.numFmt = numFormat.date;
                } else if (field.type === 'number') {
                    cell.numFmt = numFormat.number;
                }

                // Enable text wrapping for textarea fields
                if (field.type === 'textarea') {
                    cell.alignment = { 
                        wrapText: true, 
                        vertical: 'top', 
                        horizontal: 'left' 
                    };
                }
            });
        });
    } else {
        // Fallback: use object keys as headers
        const headers = Object.keys(processedData[0] || {});
        worksheet.addRow(headers);

        processedData.forEach((item) => {
            worksheet.addRow(headers.map((h) => item[h] || ''));
        });
    }

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9D9D9' },
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });

    // Auto-size columns
    worksheet.columns.forEach((column, colIndex) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const len = cell.value ? cell.value.toString().length : 10;
            if (len > maxLength) maxLength = len;
        });
        
        // For textarea fields, set a reasonable max width
        if (fields && fields[colIndex] && fields[colIndex].type === 'textarea') {
            column.width = Math.min(maxLength + 2, 50);
        } else {
            column.width = maxLength < 10 ? 10 : maxLength + 2;
        }

        // Set alignment for data cells based on type
        if (fields && fields[colIndex]) {
            const field = fields[colIndex];
            column.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
                if (rowNumber > 1) { // Skip header
                    if (field.note === 'percent' || field.note === 'currency' || field.type === 'number') {
                        cell.alignment = { horizontal: 'right', vertical: 'middle' };
                    } else if (field.type === 'date' || field.type === 'boolean') {
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    } else if (field.type === 'textarea') {
                        cell.alignment = { 
                            wrapText: true, 
                            vertical: 'top', 
                            horizontal: 'left' 
                        };
                    } else {
                        cell.alignment = { horizontal: 'left', vertical: 'middle' };
                    }
                }
            });
        }
    });

    return worksheet;
};

const ExportAll = ({
    PengadaanData,
    AmandemenData,
    fileName,
    PengadaanFormFields,
    AmandemenFormFields,
    showAlert
}) => {
    const handleExport = async () => {
        // Check if both datasets are empty
        const hasPengadaan = PengadaanData && PengadaanData.length > 0;
        const hasAmandemen = AmandemenData && AmandemenData.length > 0;

        if (!hasPengadaan && !hasAmandemen) {
            showAlert('Tidak ada data Pengadaan dan Amandemen untuk diexport', 'error');
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();

            // Add worksheets only if data exists
            if (hasPengadaan) {
                newWorksheet(PengadaanData, 'Monitoring Pengadaan', PengadaanFormFields, workbook);
            }

            if (hasAmandemen) {
                newWorksheet(AmandemenData, 'Monitoring Amandemen', AmandemenFormFields, workbook);
            }

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), fileName || 'export_all.xlsx');

            if (showAlert) {
                const message = hasPengadaan && hasAmandemen 
                    ? 'Data Pengadaan dan Amandemen berhasil diexport!'
                    : hasPengadaan 
                        ? 'Data Pengadaan berhasil diexport!'
                        : 'Data Amandemen berhasil diexport!';
                showAlert(message, 'success');
            }

        } catch (error) {
            console.error('Export error:', error);
            if (showAlert) {
                showAlert('Error exporting data. Please try again.', 'error');
            }
        }
    };

    return (
        <button
            onClick={handleExport}
            className="border-1 rounded-xl mt-3 px-2 py-0.5 text-blue-600 hover:text-white hover:bg-blue-600 active:bg-blue-800"
        >
            Export All to Excel
        </button>
    );
};

export { ExportButton, ExportAll };