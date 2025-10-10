import { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import DataTable from '../components/DataTable';
import { Modal } from '../components/Modal';
import FormComponent from '../components/FormComponent';
import { apiService } from '../services/ApiServices';
import { createPengadaanColumns, createAmandemenColumns } from '../config/tableColumns';
import { pengadaanFormFields, amandemenFormFields } from '../config/formFields';
import dayjs from 'dayjs';
import { ExportButton, ExportAll } from '../components/ExportExcel';
import { confirm, CustomAlert } from '../components/DialogComponent';

const Dashboard = ({ user, session }) => {
  const [activeTab, setActiveTab] = useState('pengadaan');
  const [pengadaanData, setPengadaanData] = useState([]);
  const [amandemenData, setAmandemenData] = useState([]);
  const [statsData, setStatsData] = useState({ data: { total_progress: 0, total_saving_percentage: 0, total_saving_hpe_percentage: 0, total_saving_hpe_nominal: 0, total_saving_nominal: 0 } });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    item: null
  }); // create , edit, view
  const [alertState, setAlert] = useState({
    show: false,
    message: '',
    type: '',
  });


  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await apiService.getStats();
      setStatsData(stats);
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
      showAlert('Data saved successfully!', 'success');

      // Refresh data to ensure consistency
      await loadData();

    } catch (error) {
      console.error('Submit error:', error);
      showAlert('Error saving data. Please try again.', 'error');
    } finally {
      setFormLoading(false);
    }
  };


  const handleDelete = async (item) => {
    const confirmed = await confirm('Apakah anda yakin anda akan menghapus data ini?');
    if (confirmed) {
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
        showAlert('Berhasil dihapus!', 'success');

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

        showAlert(errorMessage, 'error');

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

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  }


  const currentData = activeTab === 'pengadaan' ? pengadaanData : amandemenData;
  const currentFormFields = activeTab === 'pengadaan' ? pengadaanFormFields : amandemenFormFields;

  // Create columns with action handlers
  const pengadaanColumns = createPengadaanColumns(handleEdit, handleDelete, handleView);
  const amandemenColumns = createAmandemenColumns(handleEdit, handleDelete, handleView);
  const currentColumns = activeTab === 'pengadaan' ? pengadaanColumns : amandemenColumns;

  return (
    // Remove the header section and outer container styling
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* here will be the notification */}
      <CustomAlert
        message={alertState.message}
        type={alertState.type}
        show={alertState.show}
        onClose={() => setAlert({ show: false, message: '', type: '' })}
      />

      {/* Total progress and saving statistics */}
      <div className='p-2 border-0 mb-2'>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-lg font-semibold'>
          <div className='bg-gray-200 shadow-md border-gray-300 rounded-md p-4 border-1'>
            Pengadaan Selesai <span className='text-7xl block'>{statsData.data.total_selesai}</span> <span className=''>dari total {statsData.data.total_pengadaan} pengadaan</span>
          </div>
          <div className='bg-gray-200 shadow-md border-gray-300 rounded-md p-4 border-1'>
            Total Saving RAB <span className='block text-7xl'>{new Intl.NumberFormat('en-EN', {
              style: 'percent'
            }).format(statsData.data.total_saving_percentage / 100)}</span>
            <span>
              {new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'IDR'
              }).format(statsData.data.total_saving_nominal)}
            </span>
          </div>
          <div className='bg-gray-200 shadow-md border-gray-300 rounded-md p-4 border-1'>
            Total Saving HPE <span className='block text-7xl'>{new Intl.NumberFormat('en-EN', {
              style: 'percent'
            }).format(statsData.data.total_saving_hpe_percentage / 100)}</span>
            <span>
              {new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'IDR'
              }).format(statsData.data.total_saving_hpe_nominal)}
            </span>
          </div>
        </div>
      </div>


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
      <div className="mb-4">
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
                      }).format(modalState.item[field.key] / 100) : field.type === 'number' && modalState.item?.[field.key] ?
                        new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        }).format(modalState.item[field.key]) : field.type === 'date' && modalState.item?.[field.key] ?
                          dayjs(modalState.item[field.key]).format('DD-MM-YYYY') : field.type === 'checkbox' ?
                            modalState.item?.[field.key] ? 'Sudah' : 'Belum' : modalState.item?.[field.key] || '-'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <FormComponent
            item={modalState.item}
            mode={modalState.mode}
            fields={currentFormFields}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            loading={formLoading}
          />
        )}
      </Modal>
      <div className='flex gap-2'>
        <ExportButton
          data={currentData}
          fileName={`${activeTab === 'pengadaan' ? 'Data_Pengadaan' : 'Data_Amandemen'}_${dayjs().format('YYYYMMDD')}.xlsx`}
          fields={currentFormFields}
          showAlert={showAlert}
        />
        <ExportAll
          PengadaanData={pengadaanData}
          AmandemenData={amandemenData}
          fileName={`Data_Pengadaan_dan_Amandemen_${dayjs().format('YYYYMMDD')}.xlsx`}
          fields={currentFormFields}
          showAlert={showAlert}
        />
      </div>

    </div>
  );
};

export default Dashboard;