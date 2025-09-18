import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './App.jsx';
import '../css/app.css';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
);