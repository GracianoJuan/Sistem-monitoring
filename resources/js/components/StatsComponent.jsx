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
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Progress Pengadaan',
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: rawData.data.total_pengadaan,
                ticks: {
                    stepSize: 1,
                    autoSkip: false
                }

            }
        }
    }
    const labels = rawData.data.progress_pengadaan.map(item => item.value);
    const data = rawData.data.progress_pengadaan.map(item => item.total);
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Jumlah Pengadaan',
                data: data,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className='p-2 border-0 mb-2'>
            <div className="flex">
                <Bar options={options} data={chartData}></Bar>
            </div>

            <div className='md:grid md:grid-cols-3 gap-4 text-center text-lg font-semibold'>
                <div className='bg-gray-200 shadow-md border-gray-300 rounded-md p-4 border-1'>
                    Total Saving RAB vs Nilai Kontrak <span className='block text-7xl'>{new Intl.NumberFormat('en-EN', {
                        style: 'percent'
                    }).format(rawData.data.total_saving_percentage / 100)}</span>
                    <span>
                        {new Intl.NumberFormat('en-EN', {
                            style: 'currency',
                            currency: 'IDR'
                        }).format(rawData.data.total_saving_nominal)}
                    </span>
                </div>
                <div>
                    {rawData.data.total_saving_hpe_nominal}
                </div>
                <div className='bg-gray-200 shadow-md border-gray-300 rounded-md p-4 border-1'>
                    Total Saving RAB vs HPE <span className='block text-7xl'>{new Intl.NumberFormat('en-EN', {
                        style: 'percent'
                    }).format(rawData.data.total_saving_hpe_percentage / 100)}</span>
                    <span>
                        {new Intl.NumberFormat('en-EN', {
                            style: 'currency',
                            currency: 'IDR'
                        }).format(rawData.data.total_saving_hpe_nominal)}
                    </span>
                </div>
            </div>

        </div>
    )
}
export default StatsComponent;