import React from 'react';
import { BarChart3 } from 'lucide-react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          IT INCIDENT SUMMARISATION
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === 'dashboard' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-blue-500'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('analyze')}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === 'analyze' 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'hover:bg-blue-500'
            }`}
          >
            Analyze Ticket
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;