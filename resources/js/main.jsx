// resources/js/app.jsx
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import App from './App.jsx';
import { CustomConfirm } from './components/DialogComponent.jsx';

// Make sure CSRF token is available
const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
}

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <AuthProvider>
        <RoleProvider>
            <App />
            <CustomConfirm />
        </RoleProvider>
    </AuthProvider>
);