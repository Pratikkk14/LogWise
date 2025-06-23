// import './App.css'

// import Dashboard from './pages/Dashboard';

// function App() {
//   return <Dashboard />;
// }

// export default App;

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import InvestigationSession from './pages/InvestigationSession'
import APITester from './components/APITester'

function App() {
  return (
    <BrowserRouter>
      {/* Mount the tester so it runs once on startup */}
      <APITester />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/investigation/:sessionId"
          element={<InvestigationSession />}
        />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
