// Updated Dashboard.jsx - Remove the header section
import React, { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import { Modal } from '../components/Modal';
import FormComponent from '../components/FormComponent';
import { apiService } from '../services/ApiServices';
import { createPengadaanColumns, createAmandemenColumns } from '../config/tableColumns';
import { pengadaanFormFields, amandemenFormFields } from '../config/formFields';
import dayjs from 'dayjs';

const Dashboard = ({ user, session }) => {
  const [activeTab, setActiveTab] = useState('pengadaan');
  const [pengadaanData, setPengadaanData] = useState([]);
  const [amandemenData, setAmandemenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    item: null
  });

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pengadaan') {
        const data = await apiService.getPengadaanData();
        setPengadaanData(data);
      } else {
        const data = await apiService.getAmandemenData();
        setAmandemenData(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      item: null
    });
  };

  const handleEdit = (item) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      item
    });
  };

  const handleView = (item) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      item
    });
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (modalState.mode === 'create') {
        if (activeTab === 'pengadaan') {
          const newItem = await apiService.createPengadaan(formData);
          setPengadaanData(prev => [...prev, newItem]);
        } else {
          const newItem = await apiService.createAmandemen(formData);
          setAmandemenData(prev => [...prev, newItem]);
        }
      } else if (modalState.mode === 'edit') {
        if (activeTab === 'pengadaan') {
          const updatedItem = await apiService.updatePengadaan(modalState.item.id, formData);
          setPengadaanData(prev => prev.map(p =>
            p.id === modalState.item.id ? updatedItem : p
          ));
        } else {
          const updatedItem = await apiService.updateAmandemen(modalState.item.id, formData);
          setAmandemenData(prev => prev.map(a =>
            a.id === modalState.item.id ? updatedItem : a
          ));
        }
      }

      setModalState({ isOpen: false, mode: null, item: null });
      alert('Data saved successfully!');

      // Refresh data to ensure consistency
      await loadData();

    } catch (error) {
      console.error('Submit error:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);

      try {
        console.log(`Attempting to delete ${activeTab} with ID:`, item.id);

        let deleteResponse;
        if (activeTab === 'pengadaan') {
          deleteResponse = await apiService.deletePengadaan(item.id);
          console.log('Delete response:', deleteResponse);

          if (deleteResponse) {
            setPengadaanData(prev => prev.filter(p => p.id !== item.id));
          }
        } else {
          deleteResponse = await apiService.deleteAmandemen(item.id);
          console.log('Delete response:', deleteResponse);

          if (deleteResponse) {
            setAmandemenData(prev => prev.filter(a => a.id !== item.id));
          }
        }

        alert('Item deleted successfully!');

        await loadData();

      } catch (error) {
        console.error('Delete error:', error);

        let errorMessage = 'Error deleting item. ';
        if (error.response) {
          errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
        } else if (error.request) {
          errorMessage += 'No response from server. Please check your connection.';
        } else {
          errorMessage += error.message;
        }

        alert(errorMessage);

        // Refresh data anyway to show current state
        await loadData();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: null, item: null });
  };

  const currentData = activeTab === 'pengadaan' ? pengadaanData : amandemenData;
  const currentFormFields = activeTab === 'pengadaan' ? pengadaanFormFields : amandemenFormFields;

  // Create columns with action handlers
  const pengadaanColumns = createPengadaanColumns(handleEdit, handleDelete, handleView);
  const amandemenColumns = createAmandemenColumns(handleEdit, handleDelete, handleView);
  const currentColumns = activeTab === 'pengadaan' ? pengadaanColumns : amandemenColumns;

  return (
    // Remove the header section and outer container styling
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pengadaan')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'pengadaan'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Data Pengadaan
            </button>
            <button
              onClick={() => setActiveTab('amandemen')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'amandemen'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Data Amandemen
            </button>
          </nav>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          disabled={loading}
        >
          <PlusIcon size={20} />
          <span>Tambah {activeTab === 'pengadaan' ? 'Pengadaan' : 'Amandemen'}</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        data={currentData}
        columns={currentColumns}
        loading={loading}
      />

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={`${modalState.mode === 'create' ? 'Create' : modalState.mode === 'edit' ? 'Edit' : 'View'} ${activeTab === 'pengadaan' ? 'Pengadaan' : 'Amandemen'}`}
      >
        {modalState.mode === 'view' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentFormFields.map((field) => (
                <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {field.type === 'number' && field.note === 'percent' && modalState.item?.[field.key] ?
                      new Intl.NumberFormat('en-EN', {
                        style: 'percent'
                      }).format(modalState.item[field.key]/100) : field.type === 'number' && modalState.item?.[field.key] ?
                      new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(modalState.item[field.key]) : field.type === 'date' && modalState.item?.[field.key] ?
                      dayjs(modalState.item[field.key]).format('DD-MM-YYYY') :
                      modalState.item?.[field.key] || '-'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <FormComponent
            item={modalState.item}
            fields={currentFormFields}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            loading={formLoading}
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;