import React from 'react';

const ServiceDetails = ({ node, onClose }) => {
  if (!node) return null;
  
  const getServiceDescription = (id) => {
    const descriptions = {
      catalog: 'Manages content metadata and search functionality.',
      identity: 'Handles user authentication and profile management.',
      recommend: 'Generates personalized content recommendations.',
      stream: 'Manages video streaming sessions and quality.',
      analytics: 'Collects and analyzes platform usage data.',
      database: 'Stores all platform data.',
      frontend: 'User interface for the streaming platform.'
    };
    
    return descriptions[id] || 'Service description not available.';
  };
  
  const getServiceMetrics = (id) => {
    // In a real app, these would come from the backend API
    const metrics = {
      catalog: [
        { label: 'Movies', value: '1,245' },
        { label: 'TV Shows', value: '287' },
        { label: 'Genres', value: '32' }
      ],
      identity: [
        { label: 'Users', value: '15,768' },
        { label: 'Active Now', value: '1,837' },
        { label: 'New Today', value: '124' }
      ],
      recommend: [
        { label: 'Recommendations', value: '45,621' },
        { label: 'Accuracy', value: '87%' },
        { label: 'Freshness', value: '92%' }
      ],
      stream: [
        { label: 'Active Streams', value: '1,342' },
        { label: 'HD Streams', value: '68%' },
        { label: '4K Streams', value: '24%' }
      ],
      analytics: [
        { label: 'Events/s', value: '2,456' },
        { label: 'Reports', value: '18' },
        { label: 'Insights', value: '32' }
      ],
      database: [
        { label: 'Records', value: '3.2M' },
        { label: 'Queries/s', value: '186' },
        { label: 'Size', value: '4.8 GB' }
      ],
      frontend: [
        { label: 'Users', value: '1,837' },
        { label: 'Page Views', value: '12,453' },
        { label: 'Sessions', value: '2,184' }
      ]
    };
    
    return metrics[id] || [];
  };
  
  return (
    <div className="node-detail shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-white">{node.name}</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="status-indicator flex items-center mb-3">
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${node.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className="text-sm">
          {node.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">
        {getServiceDescription(node.id)}
      </p>
      
      <h4 className="text-sm font-semibold text-gray-200 mb-2">Service Metrics</h4>
      
      <div className="grid grid-cols-3 gap-2">
        {getServiceMetrics(node.id).map((metric, index) => (
          <div key={index} className="bg-gray-800 bg-opacity-50 p-2 rounded">
            <div className="text-lg font-bold">{metric.value}</div>
            <div className="text-xs text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>
      
      {node.id === 'database' && (
        <div className="mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
            Add Content Record
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;