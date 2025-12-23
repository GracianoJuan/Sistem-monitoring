import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsComponent = (rawData) => {
    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Progress Pengadaan',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                color: '#111827'
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: rawData.data.total_pengadaan,
                ticks: {
                    stepSize: 1,
                    autoSkip: true
                },
                grid: {
                    color: '#f3f4f6'
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        }
    };

    const labels = rawData.data.progress_pengadaan.map(item => item.value);
    const data = rawData.data.progress_pengadaan.map(item => item.total);
    
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Jumlah Pengadaan',
                data: data,
                backgroundColor: '#111827',
                borderRadius: 4,
                barThickness: 20
            },
        ],
    };

    return (
        <div className='mb-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='bg-white shadow-sm border border-gray-200 rounded-lg p-6'>
                    <h3 className='text-sm font-medium text-gray-600 mb-2'>
                        Total Saving RAB vs Nilai Kontrak
                    </h3>
                    <div className='text-5xl font-bold text-gray-900 mb-2'>
                        {new Intl.NumberFormat('en-EN', {
                            style: 'percent',
                            minimumFractionDigits: 2
                        }).format(rawData.data.total_saving_percentage / 100)}
                    </div>
                    <div className='text-sm text-gray-600 font-medium'>
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(rawData.data.total_saving_nominal)}
                    </div>
                </div>

                <div className='bg-white shadow-sm border border-gray-200 rounded-lg p-6'>
                    <h3 className='text-sm font-medium text-gray-600 mb-2'>
                        Total Saving RAB vs HPE
                    </h3>
                    <div className='text-5xl font-bold text-gray-900 mb-2'>
                        {new Intl.NumberFormat('en-EN', {
                            style: 'percent',
                            minimumFractionDigits: 2
                        }).format(rawData.data.total_saving_hpe_percentage / 100)}
                    </div>
                    <div className='text-sm text-gray-600 font-medium'>
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(rawData.data.total_saving_hpe_nominal)}
                    </div>
                </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <div className="h-96">
                    <Bar options={options} data={chartData} />
                </div>  
            </div>
        </div>
    );
};

export default StatsComponent;