// resources/js/Components/Form/FormComponent.jsx
import React, { useState } from 'react';

const FormComponent = ({ item, fields, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach(field => {
      initial[field.key] = item ? item[field.key] || '' : '';
    });
    return initial;
  });

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
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[field.key] ? 'border-red-500' : 'border-gray-300'
                  }`}
                rows={4}
                required={field.required}
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
            ) : field.type === 'date' ? (
              <input
                type='date'
                value={formData[field.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[field.key] ? 'border-red-500' : 'border-gray-300'
                  }`}
                required={field.required}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={formData[field.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[field.key] ? 'border-red-500' : 'border-gray-300'
                  }`}
                required={field.required}
              />
            )}
            {errors[field.key] && (
              <p claassName="mt-1 text-sm text-red-600">{errors[field.key]}</p>
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
