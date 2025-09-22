// resources/js/app.jsx
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import Dashboard from './pages/Dashboard';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(<Dashboard />);