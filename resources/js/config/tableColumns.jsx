import { createColumnHelper } from '@tanstack/react-table';
import { PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import dayjs from 'dayjs';

const columnHelper = createColumnHelper();

export const createPengadaanColumns = (onEdit, onDelete, onView) => [
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-1">
        <button
          onClick={() => onView(row.original)}
          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
          title="View"
        >
          <EyeIcon size={14} />
        </button>
        <button
          onClick={() => onEdit(row.original)}
          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
          title="Edit"
        >
          <PencilIcon size={14} />
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
          title="Delete"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    ),
  }),
  columnHelper.accessor('no_bantex', {
    header: 'Nomor Bantex',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('nama_pekerjaan', {
    header: 'Nama Pekerjaan',
    cell: ({ getValue }) => (
      <div className="max-w-xs truncate" title={getValue()}>
        {getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('tgl_nodin', {
    header: 'Tanggal Nodin AMS',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('tgl_dokumen_lengkap', {
    header: 'Tanggal Dok Lengkap',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('pengguna', {
    header: 'Pengguna',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('jenis', {
    header: 'Jenis Pengadaan',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('metode', {
    header: 'Metode Pengadaan',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('rab', {
    header: 'Nilai RAB ',
    cell: ({ getValue }) => getValue()
      ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(getValue())
      : '-',
  }),
    columnHelper.accessor('hpe', {
      header: 'HPE',
      cell: ({ getValue }) => getValue()
        ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(getValue())
        : '-',
  }),
  columnHelper.accessor('saving_hpe', {
    header: 'Saving HPE',
    cell: ({ getValue }) => getValue()
      ? new Intl.NumberFormat('en-EN', {
        style:'percent'
      }).format(getValue()/100)
      : '-',
  }),
  columnHelper.accessor('tgl_kebutuhan', {
    header: 'Tanggal Kebutuhan',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('progress', {
    header: 'Progress',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('vendor', {
    header: 'Vendor',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('tgl_kontrak', {
    header: 'Tanggal Kontrak',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('no_perjanjian', {
    header: 'Nomor Perjanjian',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('nilai_kontrak', {
    header: 'Nilai Kontrak',
    cell: ({ getValue }) => getValue()
      ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(getValue())
      : '-',
  }),
  columnHelper.accessor('mulai_kontrak', {
    header: 'Mulai Kontrak',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('akhir_kontrak', {
    header: 'Akhir Kontrak',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('jangka_waktu', {
    header: 'Jangka Waktu',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('status', {
    header: 'Status Dokumen',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('keterangan', {
    header: 'Keterangan',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('pic', {
    header: 'PIC',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('saving', {
    header: 'Saving',
    cell: ({ getValue }) => getValue()
      ? new Intl.NumberFormat('en-EN', {
        style: 'percent'
      }).format(getValue() / 100)
      : '-',
  }),
  columnHelper.accessor('selisih_hari', {
    header: 'Selisih Hari',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('form_idd', {
    header: 'Form IDD',
    cell: ({ getValue }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getValue() === true ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
        {getValue() === true ? 'Sudah' : 'Belum'}
      </span>
    ),
  }),
  columnHelper.accessor('penilaian_idd', {
    header: 'Penilaian IDD',
    cell: ({ getValue }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getValue() === true ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
        {getValue() === true ? 'Sudah' : 'Belum'}
      </span>
    ),
  }),

];

export const createAmandemenColumns = (onEdit, onDelete, onView) => [
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-1">
        <button
          onClick={() => onView(row.original)}
          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
          title="View"
        >
          <EyeIcon size={14} />
        </button>
        <button
          onClick={() => onEdit(row.original)}
          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
          title="Edit"
        >
          <PencilIcon size={14} />
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
          title="Delete"
        >
          <TrashIcon size={14} />
        </button>
        <button></button>
      </div>
    ),
  }),
  columnHelper.accessor('no_bantex', {
    header: 'Nomor Bantex',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('no_kontrak', {
    header: 'Nomor Kontrak/SPK',
    cell: ({ getValue }) => (
      <div className="max-w-xs truncate" title={getValue()}>
        {getValue() || '-'}
      </div>
    ),
  }),
  columnHelper.accessor('tgl_kontrak', {
    header: 'Tanggal Kontrak',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('judul_kontrak', {
    header: 'Judul Kontrak/SPK',
    cell: ({ getValue }) => (
      <div className="max-w-xs truncate" title={getValue()}>
        {getValue() || '-'}
      </div>
    ),
  }),
  columnHelper.accessor('nilai_kontrak', {
    header: 'Nilai Kontrak/SPK',
    cell: ({ getValue }) => getValue()
      ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(getValue())
      : '-',
  }),
  columnHelper.accessor('amandemen_ke', {
    header: 'Amandemen Ke',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('vendor', {
    header: 'Vendor',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('lingkup', {
    header: 'Lingkup Amandemen',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('tgl_spa', {
    header: 'Tanggal Nodin Permintaan Amendemen',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('tgl_tanggapan', {
    header: 'Tanggal Tanggapan (Surat/ Notulen)',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('rab_amandemen', {
    header: 'Nilai RAB (untuk kerja tambah/kurang) exclude PPN',
    cell: ({ getValue }) => getValue()
      ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(getValue())
      : '-',
  }),
  columnHelper.accessor('no_amandemen', {
    header: 'Nomor Amandemen',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('tgl_amandemen', {
    header: 'Tanggal Amandemen',
    cell: ({ getValue }) =>
      getValue() ? dayjs(getValue()).format('DD-MMM-YYYY') : '-',
  }),
  columnHelper.accessor('nilai_amandemen', {
    header: 'Nilai Amandemen exclude PPN',
    cell: ({ getValue }) => getValue()
      ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(getValue())
      : '-',
  }),
  columnHelper.accessor('progress', {
    header: 'Progress',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('status', {
    header: 'Status Dokumen',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('keterangan', {
    header: 'Keterangan',
    cell: ({ getValue }) => getValue() || '-',
  }),
  columnHelper.accessor('pic', {
    header: 'PIC',
    cell: ({ getValue }) => getValue() || '-',
  }),

];