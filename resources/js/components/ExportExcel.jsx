import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

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

const newWorksheet = (data, name, fields, workbook) => {
    const worksheet = workbook.addWorksheet(name);

    // Only slice if data has more than 2 items
    const processedData = data.length > 2 ? data.slice(0, -2) : data;

    if (fields && fields.length > 0) {
        const headers = fields.map(field => field.label);
        worksheet.addRow(headers);

        processedData.forEach((item) => {
            const row = fields.map(field => field.type == 'date' ? dayjs(item[field.key]).format('MM/DD/YYYY') : item[field.key] || '');
            worksheet.addRow(row);
        });
    } else {
        const headers = Object.keys(processedData[0] || {});
        worksheet.addRow(headers);

        processedData.forEach((item) => {
            worksheet.addRow(headers.map((h) => item[h] || ''));
        });
    }

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'left' };
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


    worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const len = cell.value ? cell.value.toString().length : 10;
            if (len > maxLength) maxLength = len;
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
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
        if (!PengadaanData || PengadaanData.length === 0 || !AmandemenData || AmandemenData.length === 0) {
            showAlert(('Tidak ada data ' +
                (PengadaanData.length === 0 && AmandemenData.length === 0 ?
                    'Pengadaan dan Amandemen' :
                    PengadaanData.length === 0 ? 'Pengadaan'
                        : 'Amandemen')
                + ' untuk diexport'), 'error');
            return;
        }

        try {
            const workbook = new ExcelJS.Workbook();

            // Add worksheets only if data exists
            if (pengadaanData && pengadaanData.length > 0) {
                newWorksheet(pengadaanData, 'Monitoring Pengadaan', PengadaanFormFields, workbook);
            }

            if (amandemenData && amandemenData.length > 0) {
                newWorksheet(amandemenData, 'Monitoring Amandemen', AmandemenFormFields, workbook);
            }

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), fileName || 'export_all.xlsx');

            if (showAlert) {
                showAlert('All data exported successfully!', 'success');
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