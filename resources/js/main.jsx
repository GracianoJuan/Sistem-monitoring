// resources/js/app.jsx
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.jsx';


// Make sure CSRF token is available
const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
}

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);