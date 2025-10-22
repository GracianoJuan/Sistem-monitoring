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
import { ChartContainer } from '../components/ChartContainer';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const ChartPage = (pengadaan, amandemen) => {
    const allOptions = {
        option1: {},
        option2: {}
    };

    const allLabels = {
        // Wait until i make the data process i backend for chart
    };

    const allData = {
        // Wait until i make the process in backend for chart
        data1: []
    }
};


const allChart = {
    // doughnut chart based on pengguna pengadaan
    chart1: function () {
        return (
            <Bar options={allOptions.option1} data={allData.data1} />
        )
    }
};

return (
    <div>
        <header className="bg-blue-600 shadow-sm sticky top-0 z-10">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-semibold text-white">Chart</h1>

                </div>
            </div>
        </header>
        <div className='grid grid-cols-2'>
            {allChart.map((chart) => (<ChartContainer chart={chart} />))}

        </div>
    </div>
)


export default ChartPage;