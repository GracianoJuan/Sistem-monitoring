import dayjs from 'dayjs';
import { useState, useEffect, use } from 'react';


const FormComponent = ({ item, mode, fields, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach(field => {
      initial[field.key] = item ? item[field.key] || '' : '';
    });
    return initial;
  });
  
  // useEffect to show date data on edit Form
  useEffect(() => {
    if (item && mode === 'edit') {
      const initialData = {};
      fields.forEach(field => {
        if (field.type === 'date' && item[field.key]) {
          initialData[field.key] = dayjs(item[field.key]).format('YYYY-MM-DD');
        } else {
          initialData[field.key] = item[field.key] || '';
        }
      });
      setFormData(initialData);
    }
  }, [item, mode]);
  
  const networkdays = function (startDate, endDate) {
    var startDate = typeof startDate == 'object' ? startDate : new Date(startDate);
    var endDate = typeof endDate == 'object' ? endDate : new Date(endDate);
    if (endDate > startDate) {
      var days = Math.ceil((endDate.setHours(23, 59, 59, 999) - startDate.setHours(0, 0, 0, 1)) / (86400 * 1000));
      var weeks = Math.floor(Math.ceil((endDate.setHours(23, 59, 59, 999) - startDate.setHours(0, 0, 0, 1)) / (86400 * 1000)) / 7);
      
      days = days - (weeks * 2);
      days = startDate.getDay() - endDate.getDay() > 1 ? days - 2 : days;
      days = startDate.getDay() == 0 && endDate.getDay() != 6 ? days - 1 : days;
      days = endDate.getDay() == 6 && startDate.getDay() != 0 ? days - 1 : days;
      
      return days;
    }
    return null;
  };
  const savingCalc = function (rab, nilai) {
    if (rab > 0) {
      return  Math.round((rab - nilai) / rab * 100);
    }
    return 0;
  };
  

  useEffect(() => {
    if (formData['rab'] && formData['nilai_kontrak']) {
      const saving = savingCalc(formData['rab'], formData['nilai_kontrak']);
      setFormData(prev => ({ ...prev, 'saving': saving || 0 }));
    }
  }, [formData['rab'], formData['nilai_kontrak']]);

  useEffect(() => {
    if (formData['rab'] && formData['hpe']) {
      const savingHpe = savingCalc(formData['rab'], formData['hpe']);
      setFormData(prev => ({ ...prev, 'saving_hpe': savingHpe || 0 }));
    }
  }, [formData['rab'], formData['hpe']]);

  // Auto calculate selisih_hari
  useEffect(() => {
    if (formData['tgl_nodin'] && formData['tgl_kontrak']) {
      const selisih = networkdays(formData['tgl_nodin'], formData['tgl_kontrak']);
      setFormData(prev => ({ ...prev, 'selisih_hari': selisih || 0 }));
    }
  }, [formData['tgl_nodin'], formData['tgl_kontrak']]);
  
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  // Handle textarea input with proper line break support
  const handleTextareaChange = (e, fieldKey) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
  };

  // Handle textarea keydown to allow Enter key for new lines
  const handleTextareaKeyDown = (e) => {
    // Allow Enter key to create new lines (don't submit form)
    if (e.key === 'Enter' && !e.shiftKey) {
      // Let the default behavior happen (new line)
      e.stopPropagation();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.key]}
                onChange={(e) => handleTextareaChange(e, field.key)}
                onKeyDown={handleTextareaKeyDown}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${errors[field.key] ? 'border-red-500' : 'border-gray-300'
                  }`}
                rows={4}
                required={field.required}
                placeholder="Press Enter for new line"
                style={{ whiteSpace: 'pre-wrap' }}
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[field.key] ? 'border-red-500' : 'border-gray-300'
                  }`}
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div><input
                type="checkbox"
                id={field.key}
                checked={!!formData[field.key]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field.key]: e.target.checked }))
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              /> <label htmlFor={field.key}>Sudah</label></div>
            ) : field.type === 'date' ? (
              <input
                type='date'
                value={formData[field.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[field.key] ? 'border-red-500' : 'border-gray-300'}`}
                required={field.required}
              />

            ) : (
              <input
                type={field.type || 'text'}
                value={formData[field.key]}
                // Need to fix automated change on selisih_hari and saving
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[field.key] ? 'border-red-500' : 'border-gray-300'
                  }`}
                required={field.required}
              />
            )}
            {errors[field.key] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : (item ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default FormComponent;