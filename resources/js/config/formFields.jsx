export const pengadaanFormFields = [
  { key: 'no_bantex', label: 'Nomor Bantex', type: 'number'},
  { key: 'nama_pekerjaan', label: 'Nama Pekerjaan', required: true },
  { key: 'tgl_nodin', label: 'Tanggal Nodin AMS', type: 'date', required: true},
  { key: 'tgl_dokumen_lengkap', label: 'Tanggal Dok diterima lengkap', type: 'date'},
  { key: 'pengguna', label: 'Pengguna', type: 'select', options: [
    'AKT', 'CRS', 'K3KL', 'KS RENKO', 'LEGAL', 'MHC', 'MRK', 'MUM', 'PBH', 'PETA','RKM','TIG'
  ]
    ,required: true },
  { key: 'jenis', label: 'Jenis', type: 'select', options: [
    'Jasa Konsultan', 'Jasa Konsultan Asing', 'Pengadaan Barang', 'Pengadaan Jasa', 'Pengadaan Jasa Lainnya', 'Pengadaan Jasa Lainnya (Sewa)'  ]
    , required: true },
  { key: 'metode', label: 'Metode Pengadaan', type: 'select', options: [
    'Pengadaan Langsung','Penunjukan Langsung', 'Tender Terbatas', 'Seleksi Terbatas', 'Tender Umum', 'Seleksi Umum'
  ], required: true },
  { key: 'rab', label: 'Nilai RAB (Exclude PPN)', type: 'number'},
  { key: 'hpe', label: 'HPE', type: 'number'},
  { key: 'saving_hpe', label: 'Saving HPE', type: 'number', note: 'percent'},
  { key: 'tgl_kebutuhan', label: 'Tanggal Kebutuhan', type: 'date'},
  { key: 'progress', label: 'Progress', type: 'select', options: [
    'Review KAK', 'Penusunan HPE HPS RKS', 'Undangan', 'Pendaftaran','Aanwijzing', 'Pemasukan Dokumen', 'Pembukaan Dokumen', 'Evaluasi', 'Klarifikasi & Negosiasi', 'Penetapan Penyedia', 'Pengumuman', 'Draft Kontrak/ SPK',
    'Finalisasi Kontrak/ SPK', 'Selesai'
  ]},
  { key: 'vendor', label: 'Vendor', required: true },
  { key: 'tgl_kontrak', label: 'Tanggal Kontrak/ SPK', type: 'date'},
  { key: 'no_perjanjian', label: 'Nomor Perjanjian/SPK', type: 'textarea', required: true },
  { key: 'nilai_kontrak', label: 'Nilai Kontrak (exc PPN)', type: 'number'},
  { key: 'mulai_kontrak', label: 'Mulai Kontrakk', type:'date'},
  { key: 'akhir_kontrak', label: 'Akhir Kontrak', type:'date'},
  { key: 'jangka_waktu', label: 'Jangka waktu'},
  { key: 'status', label: 'Status Dokumen'},
  { key: 'keterangan', label: 'Keterangan', type: 'textarea', fullWidth: true },
  { key: 'pic', label: 'PIC'},
  { key: 'saving', label: 'saving', type: 'number', note: 'percent'},
  { key: 'selisih_hari', label: 'Selisih Hari'},  
  { key: 'form_idd', label: 'Form IDD', type: 'checkbox'},
  { key: 'penilaian_idd', label: 'Penilaian IDD', type: 'checkbox'},
];

export const amandemenFormFields = [
  { key: 'no_bantex', label: 'Nomor Bantex', type:'number'},
  { key: 'no_kontrak', label: 'Nomor Kontrak/SPK', type:'textarea', required: true },
  { key: 'tgl_kontrak', label: 'Tanggal Kontrak', type: 'date', required: true},
  { key: 'judul_kontrak', label: 'Judul Kontrak/SPK', required: true },
  { key: 'nilai_kontrak', label: 'Nilai Kontrak/SPK', type: 'number'},
  { key: 'amandemen_ke', label: 'Amendemen Ke', required: true },
  { key: 'vendor', label: 'Vendor', required: true },
  { key: 'lingkup', label: 'Lingkup Amendemen'},
  { key: 'tgl_nodin_amandemen', label: 'Tanggal Nodin Permintaan Amendemen', type: 'date'},
  { key: 'tgl_spa', label: 'Tanggal Surat Permintaan Amendemen', type: 'date'},
  { key: 'tgl_tanggapan', label: 'Tanggal Tanggapan (Surat/Notulen)', type: 'date'},
  { key: 'rab_amandemen', label: 'Nilai RAB (untuk kerja tambah/kurang) exclude PPN', type: 'number' },
  { key: 'no_amandemen', label: 'Nomor Amandemen', required: true},
  { key: 'tgl_amandemen', label: 'Tanggal Amandemen', type: 'date', required:true },
  { key: 'nilai_amandemen', label: 'Nilai Amandemen exclude PPN', type: 'number' },
  { key: 'progress', label: 'Progress', type: 'select', options: [
    '','Evaluasi Usulan Amendemen', 'Negosiasi', 'Draft Amandemen', 'Tandatangan', 'Selesai'
  ] },
  { key: 'status', label: 'Status Dokumen' },
  { key: 'keterangan', label: 'Keterangan',  type: 'textarea', fullWidth: true},
  { key: 'pic', label: 'PIC' }
];