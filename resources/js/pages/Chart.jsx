import { Bar, Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { apiService } from '../services/ApiServices';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const CollapsiblePanel = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="bg-white shadow-md rounded-md overflow-hidden self-start">
            <button
                className="w-full p-4 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-100 transition-colors focus:outline-none"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <span className="text-xl text-gray-600">
                    {isOpen ? '−' : '+'}
                </span>
            </button>
            {isOpen && (
                <div className="p-6 border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );
};

const ChartPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openPanels, setOpenPanels] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const load = await apiService.getSummary();
                setData(load);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const togglePanel = (index) => {
        setOpenPanels(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const chartColors = {
        blue: 'rgba(59, 130, 246, 0.8)',
        green: 'rgba(34, 197, 94, 0.8)',
        yellow: 'rgba(234, 179, 8, 0.8)',
        red: 'rgba(239, 68, 68, 0.8)',
        purple: 'rgba(168, 85, 247, 0.8)',
        orange: 'rgba(249, 115, 22, 0.8)',
        teal: 'rgba(20, 184, 166, 0.8)',
        pink: 'rgba(236, 72, 153, 0.8)',
        indigo: 'rgba(99, 102, 241, 0.8)',
        lime: 'rgba(132, 204, 22, 0.8)',
        cyan: 'rgba(6, 182, 212, 0.8)',
        amber: 'rgba(245, 158, 11, 0.8)',
        rose: 'rgba(244, 63, 94, 0.8)',
        sky: 'rgba(14, 165, 233, 0.8)',
        slate: 'rgba(100, 116, 139, 0.8)',
    };

    const allCharts = [
        {
            title: 'Pengadaan per Metode',
            chart: (
                <div style={{ height: '300px', width: '100%' }}>
                    <Bar
                        data={{
                            labels: data.charts.metode.map(item => item.label),
                            datasets: [{
                                label: 'Jumlah Pengadaan',
                                data: data.charts.metode.map(item => item.count),
                                backgroundColor: chartColors.blue,
                                borderColor: 'rgba(59, 130, 246, 1)',
                                borderWidth: 1
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: { stepSize: 1 }
                                }
                            }
                        }}
                    />
                </div>
            )
        },
        {
            title: 'Pengadaan per Progress',
            chart: (
                <div style={{ height: '300px', width: '100%' }}>
                    <Pie
                        data={{
                            labels: data.charts.progress.map(item => item.label),
                            datasets: [{
                                data: data.charts.progress.map(item => item.count),
                                backgroundColor: Object.values(chartColors),
                                borderWidth: 2,
                                borderColor: '#fff'
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        boxWidth: 15,
                                        padding: 15,
                                        font: { size: 12 }
                                    }
                                }
                            }
                        }}
                    />
                </div>
            )
        },
        {
            title: 'Nilai Kontrak per Pengguna',
            chart: (
                <div style={{ height: '300px', width: '100%' }}>
                    <Bar
                        data={{
                            labels: data.charts.kontrak_per_user.map(item => item.label),
                            datasets: [{
                                label: 'Nilai Kontrak (IDR)',
                                data: data.charts.kontrak_per_user.map(item => item.total),
                                backgroundColor: Object.values(chartColors),
                                borderWidth: 1
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            indexAxis: 'y',
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => formatRupiah(context.parsed.x)
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => {
                                            return new Intl.NumberFormat('id-ID', {
                                                notation: 'compact',
                                                compactDisplay: 'short'
                                            }).format(value);
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
            )
        },
        {
            title: 'Nilai Kontrak per Jenis Pengadaan',
            chart: (
                <div style={{ height: '300px', width: '100%' }}>
                    <Pie
                        data={{
                            labels: data.charts.jenis.map(item => item.label),
                            datasets: [{
                                data: data.charts.jenis.map(item => item.total),
                                backgroundColor: Object.values(chartColors),
                                borderWidth: 2,
                                borderColor: '#fff'
                            }]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: {
                                        boxWidth: 15,
                                        padding: 15,
                                        font: { size: 12 }
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const label = context.label || '';
                                            const value = formatRupiah(context.parsed);
                                            return `${label}: ${value}`;
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
            )
        },
        {
            title: 'Total RAB',
            chart: (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                            {formatRupiah(data.summary.total_rab)}
                        </div>
                        <p className="text-gray-600">Total Rencana Anggaran Biaya</p>
                    </div>
                </div>
            )
        },
        {
            title: 'Total Kontrak',
            chart: (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            {formatRupiah(data.summary.total_nilai_amandemen)}
                        </div>
                        <p className="text-gray-600">Total Nilai Kontrak (termasuk amendemen)</p>
                    </div>
                </div>
            )
        }
    ];

    return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* LEFT COLUMN */}
                <div className="flex-1 space-y-6">
                    {allCharts.filter((_, i) => i % 2 === 0).map((item, index) => {
                        const originalIndex = index * 2;
                        return (
                            <CollapsiblePanel 
                                key={originalIndex}
                                title={item.title}
                                isOpen={openPanels[originalIndex] || false}
                                onToggle={() => togglePanel(originalIndex)}
                            >
                                {item.chart}
                            </CollapsiblePanel>
                        );
                    })}
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex-1 space-y-6">
                    {allCharts.filter((_, i) => i % 2 === 1).map((item, index) => {
                        const originalIndex = (index * 2) + 1;
                        return (
                            <CollapsiblePanel 
                                key={originalIndex}
                                title={item.title}
                                isOpen={openPanels[originalIndex] || false}
                                onToggle={() => togglePanel(originalIndex)}
                            >
                                {item.chart}
                            </CollapsiblePanel>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
);
};

export default ChartPage;