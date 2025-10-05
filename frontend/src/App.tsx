// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
// import { Button } from "@/components/ui/button"
import { Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Dashboard from './routes/Dashboard';

function App() {
    return (
        <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        </>
    )
}

export default App
