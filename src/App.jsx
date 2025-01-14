import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './globals.css';
import RaceTrack from './components/RaceTrack';
import BirthdayParadoxGame from './components/BirthdayParadoxGame';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Main Container */}
        <main className="container mx-auto py-10">
          {/* Routes */}
          <Routes>
            <Route path="/" element={<RaceTrack />} />
            <Route path="/presidential-experiment" element={<BirthdayParadoxGame />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
