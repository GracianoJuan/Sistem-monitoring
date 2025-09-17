import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

// Fixed Column Table Component
const FixedColumnTable = ({ 
  data, 
  columns, 
  fixedColumns = 2,
  onEdit, 
  onDelete, 
  onView,
  loading = false 
}) => {
  const fixedCols = columns.slice(0, fixedColumns);
  const scrollableCols = columns.slice(fixedColumns);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex">
        {/* Fixed Columns */}
        <div className="flex-shrink-0 border-r border-gray-200">
          <table className="min-w-0">
            <thead className="bg-gray-50">
              <tr>
                {fixedCols.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    {fixedCols.map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : (
                data.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50">
                    {fixedCols.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {col.render ? col.render(item[col.key], item) : item[col.key] || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => onView(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Scrollable Columns */}
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {scrollableCols.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    {scrollableCols.map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                data.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50">
                    {scrollableCols.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {col.render ? col.render(item[col.key], item) : item[col.key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Form Component
const FormComponent = ({ item, fields, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach(field => {
      initial[field.key] = item ? item[field.key] || '' : '';
    });
    return initial;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className={field.fullWidth ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={formData[field.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pengadaan');
  const [pengadaanData, setPengadaanData] = useState([]);
  const [amandemenData, setAmandemenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    item: null
  });

  // Sample data for demonstration
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPengadaanData([
        {
          id: 1,
          nama_pengadaan: 'Pembangunan Kantor',
          tgl_nodin: '2024-02-01',
          tgl_dokumen_lengkap: '2024-02-01',
          pengguna: 'PBH',
          vendor: 'PT Budi',
          jenis: 'Pengadaan Pekerjaan Konstruksi',
          metode: 'Pengadaan Langsung',
          rab: 1500000000,
          tgl_kebutuhan: '2024-02-01',
          progress: 'Kontrak',
          tgl_kontrak: '2024-02-01',
          no_kontrak: '13/bpbj/2025',
          nilai_kontrak: 2000000000,
          mulai_kontrak: '2024-02-01',
          akhir_kontrak: '2024-02-05',
          jangka_waktu: '3 bulan',
          status: 'done',
          keterangan: 'Pembangunan kantor cabang baru',
          pic: 'Pembangunan kantor cabang baru',
          saving: 35,
          selisih_hari: akhir_kontrak-mulai_kontrak,
          form_idd: true,
          penilaian_id: true

        },
        {
          id: 2,
          nama_pengadaan: 'Pembangunan Kantor',
          tgl_nodin: '2024-02-01',
          tgl_dokumen_lengkap: '2024-02-01',
          pengguna: 'PBH',
          vendor: 'PT Budi',
          jenis: 'Pengadaan Pekerjaan Konstruksi',
          metode: 'Pengadaan Langsung',
          rab: 1500000000,
          tgl_kebutuhan: '2024-02-01',
          progress: 'Kontrak',
          tgl_kontrak: '2024-02-01',
          no_kontrak: '13/bpbj/2025',
          nilai_kontrak: 2000000000,
          mulai_kontrak: '2024-02-01',
          akhir_kontrak: '2024-02-05',
          jangka_waktu: '3 bulan',
          status: 'done',
          keterangan: 'Pembangunan kantor cabang baru',
          pic: 'Pembangunan kantor cabang baru',
          saving: 35,
          selisih_hari: akhir_kontrak-mulai_kontrak,
          form_idd: true,
          penilaian_id: true
        }
      ]);

      setAmandemenData([
        {
          id: 1,
          tgl_kontrak: '2024-02-01',
          judul_kontrak: 'Penambahan Kuantitas',
          nilai_kontrak: 50000000,
          amandemen_ke: 'Penambahan Kuantitas',
          vendor: 'PT Budi',
          lingkup: 'Perpanjangan waktu pekerjaan',
          tgl_nodin_amandemen: '2024-02-15',
          tgl_spa: '2024-02-15',
          tgl_tanggapan: '2024-02-15',
          rab_amandemen: 20000000,
          no_amandemen: '2346.Amd/DAN.01.02/PLNEPI0604/2025',
          tgl_amandemen: '2024-02-15',
          nilai_amandemen: null,
          progress: 'Draft Amandemen',
          status: '',
          keterangan: '',
          pic: 'John Doe'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const pengadaanColumns = [
    { key: 'nama_pekerjaan', header: 'Nama Pekerjaan' },
    { key: 'tgl_nodin', header: 'Tanggal Nodin AMS' },
    { key: 'tgl_dokumen_lengkap', header: 'Tanggal Dok diterima lengkap' },
    { key: 'pengguna', header: 'Pengguna' },
    { key: 'vendor', header: 'Vendor' },
    { key: 'jenis', header: 'Jenis Pengadaan' },
    { key: 'metode', header: 'Metode Pengadaan' },
    { key: 'rab', header: 'Nilai RAB (Exclude PPN)', render: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val) },
    { key: 'tgl_kebutuhan', header: 'Keterangan' },
    { key: 'progress', header: 'Progress' },
    { key: 'tgl_kontrak', header: 'Tanggal Kontrak/ SPK' },
    { key: 'no_kontrak', header: 'Nomor Perjanjian/SPK' },
    { key: 'nilai_kontrak', header: 'Nilai Kontrak (exc PPN)', render: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val)  },
    { key: 'mulai_kontrak', header: 'Mulai Kontrak' },
    { key: 'akhir_kontrak', header: 'Akhir Kontrak' },
    { key: 'jangka_waktu', header: 'Jangka waktu' },
    { key: 'status', header: 'Status Dokumen' },
    { key: 'keterangan', header: 'PIC' },
    { key: 'pic', header: 'Keterangan' },
    { key: 'saving', header: 'saving' },
    { key: 'selisih_hari', header: 'Selisih Hari' },
    { key: 'form_idd', header: 'Form IDD' },
    { key: 'penilaian_id', header: 'Penilaian IDD' },
    { key: 'status', header: 'Status', render: (val) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        val === 'Aktif' ? 'bg-green-100 text-green-800' :
        val === 'Progress' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {val}
      </span>
    )}
  ];

  const amandemenColumns = [
    { key: 'no_kontrak', header: 'Nomor Kontrak/ SPK' },
    { key: 'tgl_kontrak', header: 'Tanggal Kontrak' },
    { key: 'judul_kontrak', header: 'Judul Kontrak/ SPK' },
    { key: 'nilai_kontrak', header: 'Nilai Kontrak/ SPK' },
    { key: 'amandemen_ke', header: 'Amendemen Ke' },
    { key: 'vendor', header: 'Vendor' },
    { key: 'lingkup', header: 'Lingkup Amendemen' },
    { key: 'tgl_nodin_amandemen', header: 'Tanggal Nodin Permintaan Amendemen' },
    { key: 'tgl_spa', header: 'Tanggal Surat Permintaan Amendemen' },
    { key: 'tgl_tanggapan', header: 'Tanggal Tanggapan (Surat/ Notulen)' },
    { key: 'rab_amandemen', header: 'Nilai RAB (untuk kerja tambah/kurang) exclude PPN' },
    { key: 'no_amandemen', header: 'Nomor Amandemen' },
    { key: 'tgl_amandemen', header: 'Tanggal Amandemen' },
    { key: 'nilai_amandemen', header: 'Nilai Amandemen exclude PPN' },
    { key: 'progress', header: 'Progress' },
    { key: 'status', header: 'Status Dokumen' },
    { key: 'keterangan', header: 'Keterangan ' },
    { key: 'pic', header: 'PIC' },
    { key: 'nilai_perubahan', header: 'Nilai Perubahan', render: (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val) },
    { key: 'status_approval', header: 'Status', render: (val) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        val === 'Approved' ? 'bg-green-100 text-green-800' :
        val === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {val}
      </span>
    )},
  ];

  const pengadaanFormFields = [
    { key: 'nama_pekerjaan', label: 'Nama Pekerjaan', required: true },
    { key: 'tgl_nodin', label: 'Tanggal Nodin AMS', type: 'select', options: ['Barang', 'Jasa', 'Konstruksi'], required: true },
    { key: 'tgl_dokumen_lengkap', label: 'Tanggal Dok diterima lengkap', type: 'date', required: true },
    { key: 'pengguna', label: 'Pengguna', required: true },
    { key: 'vendor', label: 'Vendor', type: 'number', required: true },
    { key: 'jenis', label: 'Status', type: 'select', options: ['Aktif', 'Progress', 'Selesai', 'Dibatalkan'], required: true },
    { key: 'metode', label: 'Metode Pengadaan', type: 'select', options: ['Aktif', 'Progress', 'Selesai', 'Dibatalkan'], required: true },
    { key: 'rab', label: 'Nilai RAB (Exclude PPN)', required: true },
    { key: 'progress', label: 'Progress', type: 'select', options: ['Tender', 'Tender Terbuka', 'Penunjukan Langsung'], required: true },
    { key: 'tgl_kontrak', label: 'Tanggal Kontrak/ SPK', type: 'textarea', fullWidth: true },
    { key: 'no_kontrak', label: 'Nomor Perjanjian/SPK', type: 'date', required: true },
    { key: 'nilai_kontrak', label: 'Nilai Kontrak (exc PPN)', type: 'textarea', fullWidth: true },
    { key: 'mulai_kontrak', label: 'Mulai Kontrakk', required: true },
    { key: 'akhir_kontrak', label: 'Akhir Kontrak', type: 'textarea', fullWidth: true },
    { key: 'jangka_waktu', label: 'Jangka waktu', required: true },
    { key: 'status', label: 'Status Dokumen', type: 'textarea', fullWidth: true },
    { key: 'keterangan', label: 'Keterangan', type: 'textarea', fullWidth: true },
    { key: 'pic', label: 'PIC', type: 'textarea', fullWidth: true },
    { key: 'saving', label: 'saving', type: 'select', options: ['CAPEX', 'OPEX'], required: true },
    { key: 'selisih_hari', label: 'Selisih Hari', type: 'textarea', fullWidth: true },
    { key: 'form_idd', label: 'Form IDD', type: 'textarea', fullWidth: true },
    { key: 'penilaian_id', label: 'Penilaian IDD', type: 'textarea', fullWidth: true },
  ];

  const amandemenFormFields = [
    { key: 'no_kontrak', label: 'Nomor Kontrak/ SPK Amandemen', required: true },
    { key: 'tgl_kontrak', label: 'Tanggal Kontrak', required: true },
    { key: 'judul_kontrak', label: 'Judul Kontrak/ SPK', type: 'number', required: true },
    { key: 'nilai_kontrak', label: 'Nilai Kontrak/ SPK', type: 'select', options: ['Penambahan Kuantitas', 'Pengurangan Kuantitas', 'Perubahan Spesifikasi', 'Perpanjangan Waktu'], required: true },
    { key: 'amandemen_ke', label: 'Amendemen Ke', type: 'number', required: true },
    { key: 'vendor', label: 'Vendor', type: 'date', required: true },
    { key: 'lingkup', label: 'Lingkup Amendemen', type: 'date', required: true },
    { key: 'tgl_nodin_amandemen', label: 'Tanggal Nodin Permintaan Amendemen', type: 'textarea', required: true, fullWidth: true },
    { key: 'tgl_spa', label: 'Tanggal Surat Permintaan Amendemen', required: true },
    { key: 'tgl_tanggapan', label: 'Tanggal Tanggapan (Surat/ Notulen)', type: 'select', options: ['Pending', 'Approved', 'Rejected'], required: true },
    { key: 'rab_amandemen', label: 'Nilai RAB (untuk kerja tambah/kurang) exclude PPN' },
    { key: 'no_amandemen', label: 'Nomor Amandemen', type: 'number', required: true },
    { key: 'tgl_amandemen', label: 'Tanggal Amandemen' },
    { key: 'nilai_amandemen', label: 'Nilai Amandemen exclude PPN' },
    { key: 'progress', label: 'Progress' },
    { key: 'status', label: 'Status Dokumen' },
    { key: 'keterangan', label: 'Keterangan' },
    { key: 'pic', label: 'PIC' }
  ];

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

  const handleDelete = (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'pengadaan') {
        setPengadaanData(prev => prev.filter(p => p.id !== item.id));
      } else {
        setAmandemenData(prev => prev.filter(a => a.id !== item.id));
      }
    }
  };

  const handleSubmit = (formData) => {
    if (modalState.mode === 'create') {
      const newItem = {
        id: Date.now(),
        ...formData
      };
      
      if (activeTab === 'pengadaan') {
        setPengadaanData(prev => [...prev, newItem]);
      } else {
        setAmandemenData(prev => [...prev, newItem]);
      }
    } else if (modalState.mode === 'edit') {
      if (activeTab === 'pengadaan') {
        setPengadaanData(prev => prev.map(p => 
          p.id === modalState.item.id ? { ...p, ...formData } : p
        ));
      } else {
        setAmandemenData(prev => prev.map(a => 
          a.id === modalState.item.id ? { ...a, ...formData } : a
        ));
      }
    }
    
    setModalState({ isOpen: false, mode: null, item: null });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: null, item: null });
  };

  const currentData = activeTab === 'pengadaan' ? pengadaanData : amandemenData;
  const currentColumns = activeTab === 'pengadaan' ? pengadaanColumns : amandemenColumns;
  const currentFormFields = activeTab === 'pengadaan' ? pengadaanFormFields : amandemenFormFields;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Pengadaan & Amandemen
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pengadaan')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pengadaan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Data Pengadaan
              </button>
              <button
                onClick={() => setActiveTab('amandemen')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'amandemen'
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
          >
            <PlusIcon size={20} />
            <span>Add New {activeTab === 'pengadaan' ? 'Pengadaan' : 'Amandemen'}</span>
          </button>
        </div>

        {/* Table */}
        <FixedColumnTable
          data={currentData}
          columns={currentColumns}
          fixedColumns={2}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
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
              {currentFormFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {modalState.item?.[field.key] || '-'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <FormComponent
              item={modalState.item}
              fields={currentFormFields}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;