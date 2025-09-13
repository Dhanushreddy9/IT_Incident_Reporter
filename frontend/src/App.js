import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import AnalyzePage from './pages/AnalyzePage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [tickets, setTickets] = useState([]);

  // Sample ticket data
  useEffect(() => {
    const sampleTickets = [
      {
        id: 1,
        title: "Login Authentication Error",
        description: "Users unable to authenticate with SSO",
        status: "resolved",
        priority: "high",
        createdAt: "2025-06-15",
        resolvedAt: "2025-06-16",
        category: "Authentication"
      },
      {
        id: 2,
        title: "Database Connection Timeout",
        description: "Application experiencing database timeouts",
        status: "resolved",
        priority: "critical",
        createdAt: "2025-06-10",
        resolvedAt: "2025-06-12",
        category: "Database"
      },
      {
        id: 3,
        title: "UI Layout Breaking on Mobile",
        description: "Mobile responsive issues on dashboard",
        status: "open",
        priority: "medium",
        createdAt: "2025-06-18",
        resolvedAt: null,
        category: "UI/UX"
      },
      {
        id: 4,
        title: "Email Notifications Not Working",
        description: "System not sending automated email notifications",
        status: "resolved",
        priority: "medium",
        createdAt: "2025-06-05",
        resolvedAt: "2025-06-08",
        category: "Email"
      },
      {
        id: 5,
        title: "Performance Issues on Reports Page",
        description: "Reports loading slowly with large datasets",
        status: "in_progress",
        priority: "high",
        createdAt: "2025-06-19",
        resolvedAt: null,
        category: "Performance"
      }
    ];
    setTickets(sampleTickets);
  }, []);

  const addNewTicket = (ticketData) => {
    const newTicket = {
      id: tickets.length + 1,
      ...ticketData,
      status: "open",
      createdAt: new Date().toISOString().split('T')[0],
      resolvedAt: null,
    };
    
    setTickets([...tickets, newTicket]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'dashboard' && (
        <Dashboard tickets={tickets} />
      )}
      
      {currentPage === 'analyze' && (
        <AnalyzePage onSubmitTicket={addNewTicket} />
      )}
    </div>
  );
};

export default App;