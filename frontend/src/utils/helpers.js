// Date formatting utilities
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate days between dates
  export const daysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  // Get days since creation
  export const daysSinceCreation = (createdDate) => {
    if (!createdDate) return null;
    
    const created = new Date(createdDate);
    const now = new Date();
    const timeDiff = now.getTime() - created.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  };
  
  // Ticket status helpers
  export const getStatusColor = (status) => {
    const colors = {
      open: 'text-red-600 bg-red-50 border-red-200',
      in_progress: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      resolved: 'text-green-600 bg-green-50 border-green-200',
      closed: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status] || colors.open;
  };
  
  export const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };
  
  // File validation
  export const validateFile = (file, maxSizeInMB = 10) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/json',
      'text/xml',
      'text/csv'
    ];
    
    const maxSize = maxSizeInMB * 1024 * 1024; // Convert to bytes
    
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload TXT, PDF, DOC, DOCX, JSON, XML, or CSV files.'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeInMB}MB limit.`
      };
    }
    
    return { valid: true };
  };
  
  // Search and filter utilities
  export const filterTickets = (tickets, searchTerm, statusFilter) => {
    return tickets.filter(ticket => {
      const matchesSearch = !searchTerm || 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };
  
  // Generate ticket statistics
  export const generateTicketStats = (tickets) => {
    const stats = {
      total: tickets.length,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      by_priority: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      by_category: {},
      avg_resolution_time: 0
    };
    
    let totalResolutionDays = 0;
    let resolvedCount = 0;
    
    tickets.forEach(ticket => {
      // Count by status
      stats[ticket.status] = (stats[ticket.status] || 0) + 1;
      
      // Count by priority
      stats.by_priority[ticket.priority] = (stats.by_priority[ticket.priority] || 0) + 1;
      
      // Count by category
      stats.by_category[ticket.category] = (stats.by_category[ticket.category] || 0) + 1;
      
      // Calculate resolution time for resolved tickets
      if (ticket.status === 'resolved' && ticket.resolvedAt) {
        const resolutionDays = daysBetween(ticket.createdAt, ticket.resolvedAt);
        if (resolutionDays !== null) {
          totalResolutionDays += resolutionDays;
          resolvedCount++;
        }
      }
    });
    
    // Calculate average resolution time
    if (resolvedCount > 0) {
      stats.avg_resolution_time = Math.round(totalResolutionDays / resolvedCount);
    }
    
    return stats;
  };
  
  // Local storage utilities (for saving user preferences)
  export const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };
  
  export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return defaultValue;
    }
  };
  
  // Debounce utility for search
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };