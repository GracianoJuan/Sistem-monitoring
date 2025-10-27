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
import LoadingSpinner from '../components/LoadingSpinner';
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
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg mb-4 overflow-hidden">
            <button
                className="w-full p-4 flex justify-between items-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition duration-300 focus:outline-none"
                onClick={togglePanel}
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <span className="text-2xl font-bold text-gray-600 transform transition-transform duration-300">
                    {isOpen ? '−' : '+'}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'
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
        // Simulate API call
        setTimeout(() => {
            const summaryData = apiService.getSummary();
            setData(summaryData);
            setLoading(false);
        }, 500);
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
            title: 'Pengadaan per Pengguna',
            chart: (
                <Bar
                    data={{
                        labels: data.pengadaanPerUser.map(item => item.user),
                        datasets: [{
                            label: 'Jumlah Pengadaan',
                            data: data.pengadaanPerUser.map(item => item.count),
                            backgroundColor: chartColors.blue,
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1
                        }]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
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
                        labels: data.pengadaanPerProgress.map(item => item.status),
                        datasets: [{
                            label: 'Jumlah',
                            data: data.pengadaanPerProgress.map(item => item.count),
                            backgroundColor: [
                                chartColors.yellow,
                                chartColors.blue,
                                chartColors.green,
                                chartColors.red
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
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
                        labels: data.nilaiKontrakPerUser.map(item => item.user),
                        datasets: [{
                            label: 'Nilai Kontrak (IDR)',
                            data: data.nilaiKontrakPerUser.map(item => item.nilai),
                            backgroundColor: chartColors.green,
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 1
                        }]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
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
                        labels: data.nilaiKontrakPerJenis.map(item => item.jenis),
                        datasets: [{
                            label: 'Nilai Kontrak',
                            data: data.nilaiKontrakPerJenis.map(item => item.nilai),
                            backgroundColor: [
                                chartColors.purple,
                                chartColors.orange,
                                chartColors.blue,
                                chartColors.green
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
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
                        {formatRupiah(data.totalRAB)}
                    </div>
                    <p className="text-gray-600">Total Rencana Anggaran Biaya</p>
                </div>
            )
        }
    ];

    return (
        <>
            <header className="bg-gray-100 shadow-sm sticky top-0 z-10 border-b-1">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-semibold text-black">Chart</h1>

                    </div>
                </div>
            </header>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">

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