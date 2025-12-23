// ExcelImport.jsx
import React, { useState } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { pengadaanFormFields, amandemenFormFields } from '../config/formFields';
import { apiClient } from '../services/ApiServices';

const ExcelImport = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('pengadaan');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formFields = type === 'pengadaan' ? pengadaanFormFields : amandemenFormFields;

  // Helper function to validate and convert data types
  const validateAndConvert = (value, field) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    try {
      switch (field.type) {
        case 'number':
          const num = Number(value);
          if (isNaN(num)) {
            console.warn(`Skipping invalid number for ${field.key}: ${value}`);
            return null;
          }
          return num;

        case 'date':
          if (typeof value === 'number') {
            // Excel date serial number
            const date = XLSX.SSF.parse_date_code(value);
            return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
          }
          if (typeof value === 'string') {
            // Handle string dates - avoid timezone issues
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) {
              // Use local date to avoid timezone conversion
              const year = parsed.getFullYear();
              const month = String(parsed.getMonth() + 1).padStart(2, '0');
              const day = String(parsed.getDate()).padStart(2, '0');
              return `${year}-${month}-${day}`;
            }
          }
          console.warn(`Skipping invalid date for ${field.key}: ${value}`);
          return null;

        case 'checkbox':
          if (typeof value === 'boolean') return value;
          if (typeof value === 'string') {
            const lower = value.toLowerCase().trim();
            if (lower === 'true' || lower === 'yes' || lower === 'ya' || lower === '1' || lower === 'sudah') {
              return true;
            }
            if (lower === 'false' || lower === 'no' || lower === 'tidak' || lower === '0' || lower === 'belum') {
              return false;
            }
          }
          if (typeof value === 'number') {
            return value === 1;
          }
          return false;

        case 'select':
          const strValue = String(value).trim();
          if (field.options && field.options.length > 0) {
            const matchedOption = field.options.find(
              opt => opt.toLowerCase() === strValue.toLowerCase()
            );
            return matchedOption || null;
          }
          return strValue;

        case 'textarea':
          return String(value).trim();

        default:
          return String(value).trim();
      }
    } catch (err) {
      console.warn(`Error converting ${field.key}:`, err);
      return null;
    }
  };

  const createColumnMapping = () => {
    const mapping = {};
    formFields.forEach(field => {
      mapping[field.label.toLowerCase().trim()] = field;
    });
    return mapping;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess('');
    parseExcelFile(selectedFile);
  };

  const parseExcelFile = (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          raw: false,
          defval: null 
        });

        if (jsonData.length === 0) {
          setError('The Excel file is empty');
          setLoading(false);
          return;
        }

        const processedData = processImportData(jsonData);
        
        setPreview({
          total: jsonData.length,
          valid: processedData.valid.length,
          invalid: processedData.invalid.length,
          data: processedData.valid,
          sample: processedData.valid.slice(0, 5)
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error parsing Excel:', err);
        setError('Failed to parse Excel file. Please check the file format.');
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const processImportData = (rawData) => {
    const columnMapping = createColumnMapping();
    const valid = [];
    const invalid = [];

    rawData.forEach((row, index) => {
      const processedRow = {};
      let hasRequiredFields = true;
      let missingFields = [];

      // Process all columns - skip only invalid values, not entire row
      Object.keys(row).forEach(header => {
        const normalizedHeader = header.toLowerCase().trim();
        const field = columnMapping[normalizedHeader];

        if (field) {
          const value = row[header];
          const convertedValue = validateAndConvert(value, field);
          
          // Check required fields
          if (field.required && (convertedValue === null || convertedValue === '')) {
            hasRequiredFields = false;
            missingFields.push(field.label);
          }

          // Always set the value, even if null (skip invalid conversion)
          processedRow[field.key] = convertedValue;
        }
      });

      const hasData = Object.values(processedRow).some(val => val !== null && val !== '');
      
      // Include row even if some fields are invalid, as long as required fields exist
      if (hasData && hasRequiredFields) {
        valid.push(processedRow);
      } else if (hasData) {
        invalid.push({ 
          row: index + 2, 
          data: processedRow, 
          reason: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }
    });

    console.log('Processed data:', { valid, invalid }); // Debug log
    return { valid, invalid };
  };

  const handleImport = async () => {
    if (!preview || preview.valid === 0) {
      setError('No valid data to import');
      return;
    }

    setImporting(true);
    setError('');

    try {
      const endpoint = type === 'pengadaan' ? '/pengadaan/bulk' : '/amandemen/bulk';
      
      console.log('Sending data to:', endpoint);
      console.log('Data:', preview.data);
      
      const response = await apiClient.post(endpoint, { data: preview.data });

      console.log('Response:', response.data);

      setSuccess(`Successfully imported ${response.data.imported || preview.valid} records!`);
      
      // Show any failed imports
      if (response.data.failed > 0) {
        console.warn('Some imports failed:', response.data.errors);
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Import error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to import data. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError('');
    setSuccess('');
  };

  const downloadTemplate = () => {
    const headers = formFields.map(field => field.label);
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `template_${type}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Import Data from Excel</h1>
          <p className="text-gray-600 mt-2">Upload and import your data in bulk</p>
        </div>

        {/* Type Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Data Type
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setType('pengadaan');
                handleRemove();
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                type === 'pengadaan'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pengadaan
            </button>
            <button
              onClick={() => {
                setType('amandemen');
                handleRemove();
              }}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                type === 'amandemen'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Amandemen
            </button>
          </div>

          <button
            onClick={downloadTemplate}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Download size={16} className="mr-2" />
            Download Excel Template
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="excel-upload"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
              <label htmlFor="excel-upload" className="cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload Excel file
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: .xlsx, .xls, .csv
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="text-green-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  disabled={importing}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Processing Excel file...</p>
                </div>
              )}

              {/* Preview */}
              {preview && !loading && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900">
                          File processed successfully
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Found {preview.total} rows • {preview.valid} valid • {preview.invalid} skipped
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Preview (First 5 rows)
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {formFields.slice(0, 6).map((field) => (
                                <th
                                  key={field.key}
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {field.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {preview.sample.map((row, idx) => (
                              <tr key={idx}>
                                {formFields.slice(0, 6).map((field) => (
                                  <td key={field.key} className="px-4 py-3 text-sm text-gray-900">
                                    {row[field.key] !== null && row[field.key] !== undefined
                                      ? String(row[field.key])
                                      : '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Import Button */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleRemove}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      disabled={importing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={importing || preview.valid === 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {importing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Importing...
                        </>
                      ) : (
                        `Import ${preview.valid} Records`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelImport;