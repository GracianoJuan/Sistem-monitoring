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
import StatsComponent from '../components/StatsComponent';

const Dashboard = ({ canEdit, user, session, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('pengadaan');
  const [pengadaanData, setPengadaanData] = useState([]);
  const [amandemenData, setAmandemenData] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Year filter states
  const [selectedYear, setSelectedYear] = useState(dayjs().year().toString());
  const [availableYears, setAvailableYears] = useState([]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    item: null
  });

  const [alertState, setAlert] = useState({
    show: false,
    message: '',
    type: '',
  });

  // Load available years when tab changes
  useEffect(() => {
    loadAvailableYears();
  }, [activeTab]);

  // Load data when year or tab changes
  useEffect(() => {
    loadData();
  }, [activeTab, selectedYear]);

  const loadAvailableYears = async () => {
    try {
      let years;
      if (activeTab === 'pengadaan') {
        years = await apiService.getPengadaanYears();
      } else {
        years = await apiService.getAmandemenYears();
      }

      if (!years || years.length === 0) {
        years = [dayjs().year()];
      }

      setAvailableYears(years);

      if (!years.includes(parseInt(selectedYear))) {
        setSelectedYear(years[0].toString());
      }
    } catch (error) {
      console.error('Error loading available years:', error);
      const currentYear = dayjs().year();
      setAvailableYears([currentYear]);
      setSelectedYear(currentYear.toString());
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await apiService.getStats(selectedYear);
      setStatsData(stats);

      if (activeTab === 'pengadaan') {
        const data = await apiService.getPengadaanData(selectedYear);
        setPengadaanData(data);
      } else {
        const data = await apiService.getAmandemenData(selectedYear);
        setAmandemenData(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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
        let deleteResponse;
        if (activeTab === 'pengadaan') {
          deleteResponse = await apiService.deletePengadaan(item.id);
          if (deleteResponse) {
            setPengadaanData(prev => prev.filter(p => p.id !== item.id));
          }
        } else {
          deleteResponse = await apiService.deleteAmandemen(item.id);
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
          errorMessage += `Server responded with status ${error.response.status}`;
        } else if (error.request) {
          errorMessage += 'No response from server. Please check your connection.';
        } else {
          errorMessage += error.message;
        }
        showAlert(errorMessage, 'error');
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
  };

  const currentData = activeTab === 'pengadaan' ? pengadaanData : amandemenData;
  const currentFormFields = activeTab === 'pengadaan' ? pengadaanFormFields : amandemenFormFields;

  const pengadaanColumns = createPengadaanColumns(canEdit, handleEdit, handleDelete, handleView);
  const amandemenColumns = createAmandemenColumns(canEdit, handleEdit, handleDelete, handleView);
  const currentColumns = activeTab === 'pengadaan' ? pengadaanColumns : amandemenColumns;

  return (
    <div className="min-h-full">
      <CustomAlert
        message={alertState.message}
        type={alertState.type}
        show={alertState.show}
        onClose={() => setAlert({ show: false, message: '', type: '' })}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Section */}
        {statsData?.data && <StatsComponent data={statsData.data} />}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('pengadaan')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'pengadaan'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Data Pengadaan
              </button>
              <button
                onClick={() => setActiveTab('amandemen')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'amandemen'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Data Amandemen
              </button>
            </nav>
          </div>

          {/* Filters and Actions Bar */}
          <div className="p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left side - Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  name="year"
                  id="year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent min-w-[120px]"
                >
                  {availableYears.length > 0 ? (
                    availableYears.map(year => (
                      <option key={year} value={year}>
                        Tahun {year}
                      </option>
                    ))
                  ) : (
                    <option value={dayjs().year()}>
                      Tahun {dayjs().year()}
                    </option>
                  )}
                </select>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-3 justify-end">
                <div className="flex gap-2">
                  <ExportButton
                    data={currentData}
                    fileName={`${activeTab === 'pengadaan' ? 'Data_Pengadaan' : 'Data_Amandemen'}_${selectedYear}_${dayjs().format('YYYYMMDD')}.xlsx`}
                    fields={currentFormFields}
                    showAlert={showAlert}
                  />

                  <ExportAll
                    PengadaanData={() => apiService.getPengadaanData(selectedYear)}
                    AmandemenData={() => apiService.getAmandemenData(selectedYear)}
                    fileName={`Data_Pengadaan_dan_Amandemen_${selectedYear}_${dayjs().format('YYYYMMDD')}.xlsx`}
                    PengadaanFormFields={pengadaanFormFields}
                    AmandemenFormFields={amandemenFormFields}
                    showAlert={showAlert}
                  />
                </div>

                {canEdit && (
                  <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-sm font-medium text-sm transition-colors"
                    disabled={loading}
                  >
                    <PlusIcon size={18} />
                    <span>Tambah {activeTab === 'pengadaan' ? 'Pengadaan' : 'Amandemen'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={currentData}
          columns={currentColumns}
          loading={loading}
          canEdit={canEdit}
        />

        {/* Modal */}
        <Modal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          title={`${modalState.mode === 'create' ? 'Tambah' : modalState.mode === 'edit' ? 'Edit' : 'Detail'} ${activeTab === 'pengadaan' ? 'Pengadaan' : 'Amandemen'}`}
        >
          {modalState.mode === 'view' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentFormFields.map((field) => (
                  <div key={field.key} className={field.fullWidth ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <div
                      className={`text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 ${field.type === 'textarea' ? 'whitespace-pre-wrap' : ''
                        }`}
                      style={field.type === 'textarea' ? { whiteSpace: 'pre-wrap', wordBreak: 'break-word' } : {}}
                    >
                      {field.type === 'number' && field.note === 'percent' && modalState.item?.[field.key] ?
                        new Intl.NumberFormat('en-EN', {
                          style: 'percent'
                        }).format(modalState.item[field.key] / 100)
                        : field.type === 'number' && field.note === 'currency' && modalState.item?.[field.key] ?
                          new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR'
                          }).format(modalState.item[field.key])
                          : field.type === 'date' && modalState.item?.[field.key] ?
                            dayjs(modalState.item[field.key]).format('DD-MM-YYYY')
                            : field.type === 'checkbox' ?
                              modalState.item?.[field.key] ? 'Sudah' : 'Belum'
                              : field.type === 'textarea' && modalState.item?.[field.key] ?
                                modalState.item[field.key]
                                : modalState.item?.[field.key] || '-'
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
      </div>
    </div>
  );
};

export default Dashboard;