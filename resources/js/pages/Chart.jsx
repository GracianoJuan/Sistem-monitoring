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

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);


const CollapsiblePanel = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md border-0.5 rounded-lg mb-4 overflow-hidden">
            <button
                className="w-full p-4 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-100 transition duration-300 focus:outline-none"
                onClick={togglePanel}
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <span className="text-2xl font-bold text-gray-600 transform transition-transform duration-300">
                    {isOpen ? '−' : '+'}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-auto' : 'max-h-0'
                    }`}
            >
                <div className="p-6 border-t border-gray-200">
                    {children}
                </div>
            </div>
        </div>
    );
};

const ChartPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 5
                                }
                            }
                        }
                    }}
                />
            )
        },
        {
            title: 'Pengadaan per Progress',
            chart: (
                <Pie
                    data={{
                        labels: data.charts.progress.map(item => item.label),
                        datasets: [{
                            label: 'Jumlah',
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
                            }
                        }
                    }}
                />
            )
        },
        {
            title: 'Nilai Kontrak per Pengguna',
            chart: (
                <Bar
                    data={{
                        labels: data.charts.kontrak_per_user.map(item => item.label),
                        datasets: [{
                            label: 'Nilai Kontrak (IDR)',
                            data: data.charts.kontrak_per_user.map(item => item.total),
                            backgroundColor: Object.values(chartColors),
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 1
                        }]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        return formatRupiah(context.parsed.y);
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => formatRupiah(value)
                                }
                            }
                        }
                    }}
                />
            )
        },
        {
            title: 'Nilai Kontrak per Jenis Pengadaan',
            chart: (
                <Pie
                    data={{
                        labels: data.charts.jenis.map(item => item.label),
                        datasets: [{
                            label: 'Nilai Kontrak',
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
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        return `${context.label}: ${formatRupiah(context.parsed)}`;
                                    }
                                }
                            }
                        }
                    }}
                />
            )
        },
        {
            title: 'Total RAB',
            chart: (
                <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                        {formatRupiah(data.summary.total_rab)}
                    </div>
                    <p className="text-gray-600">Total Rencana Anggaran Biaya</p>
                </div>
            )
        },
        {
            title: 'Total Kontrak',
            chart: (
                <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                        {formatRupiah(data.summary.total_nilai_amandemen)}
                    </div>
                    <p className="text-gray-600">Total Nilai Kontrak (termasuk amandemens)</p>
                </div>
            )
        }
    ];

    return (
        <>
            
            <div className="min-h-screen bg-gray-200 py-8 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 gap-1">

                    {allCharts.map((item, index) => (
                        <CollapsiblePanel key={index} title={item.title}>
                            {item.chart}
                        </CollapsiblePanel>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ChartPage;