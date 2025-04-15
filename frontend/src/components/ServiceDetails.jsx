import React, { useState, useEffect } from 'react';

const ServiceDetails = ({ node, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!node) return null;

  const getServiceDescription = (id) => {
    const descriptions = {
      catalog: 'Manages content metadata, search functionality, and media asset categorization. Provides APIs for content discovery and filtering.',
      identity: 'Handles user authentication, profile management, subscription status, and access control across the platform.',
      recommend: 'Generates personalized content recommendations based on viewing history, preferences, and trending content.',
      stream: 'Manages video streaming sessions, quality selection, buffering, and content delivery optimization.',
      analytics: 'Collects and analyzes platform usage data to generate insights on content performance and user behavior.',
      database: 'Central data storage system for all platform information including user data, content metadata, and operational logs.',
      frontend: 'User interface for the streaming platform, responsible for rendering content and handling user interactions.'
    };

    return descriptions[id] || 'Service description not available.';
  };

  const getServiceMetrics = (id) => {
    // More detailed metrics for each service
    const metrics = {
      catalog: [
        { label: 'Movies', value: '1,245' },
        { label: 'TV Shows', value: '287' },
        { label: 'Genres', value: '32' },
        { label: 'Queries/s', value: '124' },
        { label: 'Response Time', value: '45ms' },
        { label: 'Cache Hit Rate', value: '87%' }
      ],
      identity: [
        { label: 'Users', value: '15,768' },
        { label: 'Active Now', value: '1,837' },
        { label: 'New Today', value: '124' },
        { label: 'Auth Requests/s', value: '87' },
        { label: 'Success Rate', value: '99.8%' },
        { label: 'Session Duration', value: '42m' }
      ],
      recommend: [
        { label: 'Recommendations', value: '45,621' },
        { label: 'Accuracy', value: '87%' },
        { label: 'Freshness', value: '92%' },
        { label: 'Model Size', value: '4.2GB' },
        { label: 'Inference Time', value: '35ms' },
        { label: 'Update Frequency', value: '4h' }
      ],
      stream: [
        { label: 'Active Streams', value: '1,342' },
        { label: 'HD Streams', value: '68%' },
        { label: '4K Streams', value: '24%' },
        { label: 'Bandwidth', value: '42.7 Gbps' },
        { label: 'Buffering Events', value: '42' },
        { label: 'CDN Regions', value: '8' }
      ],
      analytics: [
        { label: 'Events/s', value: '2,456' },
        { label: 'Reports', value: '18' },
        { label: 'Insights', value: '32' },
        { label: 'Data Volume', value: '1.8TB' },
        { label: 'Active Dashboards', value: '14' },
        { label: 'User Segments', value: '28' }
      ],
      database: [
        { label: 'Records', value: '3.2M' },
        { label: 'Queries/s', value: '186' },
        { label: 'Size', value: '4.8 GB' },
        { label: 'Read Ops', value: '124/s' },
        { label: 'Write Ops', value: '62/s' },
        { label: 'Cache Size', value: '1.2GB' }
      ],
      frontend: [
        { label: 'Users', value: '1,837' },
        { label: 'Page Views', value: '12,453' },
        { label: 'Sessions', value: '2,184' },
        { label: 'Load Time', value: '1.24s' },
        { label: 'Error Rate', value: '0.3%' },
        { label: 'Client Memory', value: '312MB' }
      ]
    };

    return metrics[id] || [];
  };

  const getServiceLogs = (id) => {
    // Sample logs for each service
    const logs = {
      catalog: [
        { time: '14:23:12', level: 'INFO', message: 'Content update completed: 15 new items added' },
        { time: '14:10:05', level: 'INFO', message: 'Search index rebuilt successfully' },
        { time: '13:58:42', level: 'WARN', message: 'API rate limit reached for client 482' },
        { time: '13:45:31', level: 'ERROR', message: 'Failed to retrieve metadata for content ID 82731' }
      ],
      identity: [
        { time: '14:22:18', level: 'INFO', message: 'New user registered: user_5481' },
        { time: '14:15:27', level: 'WARN', message: 'Multiple failed login attempts: user_2314' },
        { time: '14:05:03', level: 'INFO', message: 'Password reset completed for user_3829' },
        { time: '13:58:41', level: 'ERROR', message: 'OAuth provider unavailable: provider_2' }
      ],
      recommend: [
        { time: '14:21:08', level: 'INFO', message: 'Model training completed, accuracy: 87.2%' },
        { time: '14:12:56', level: 'INFO', message: 'Generated 1,284 new recommendations' },
        { time: '14:00:23', level: 'WARN', message: 'Insufficient data for new users segment' },
        { time: '13:45:12', level: 'ERROR', message: 'Feature extraction pipeline failed for batch 28' }
      ],
      stream: [
        { time: '14:20:45', level: 'INFO', message: 'CDN failover completed successfully for region EU-3' },
        { time: '14:10:37', level: 'WARN', message: 'Bandwidth throttling active for 82 users' },
        { time: '14:00:18', level: 'INFO', message: 'Streaming quality optimized for peak hours' },
        { time: '13:52:29', level: 'ERROR', message: 'Media segment 47892 unavailable in all regions' }
      ],
      analytics: [
        { time: '14:22:59', level: 'INFO', message: 'Daily report generation completed' },
        { time: '14:15:02', level: 'INFO', message: 'User segment analysis updated' },
        { time: '14:00:12', level: 'WARN', message: 'Incomplete data from stream service' },
        { time: '13:45:37', level: 'ERROR', message: 'Data pipeline failure in step transform_3' }
      ],
      database: [
        { time: '14:24:03', level: 'INFO', message: 'Backup completed successfully' },
        { time: '14:15:27', level: 'INFO', message: 'Index optimization completed' },
        { time: '14:05:12', level: 'WARN', message: 'High read latency detected: 120ms' },
        { time: '13:50:24', level: 'ERROR', message: 'Connection pool exhausted, increasing capacity' }
      ],
      frontend: [
        { time: '14:23:45', level: 'INFO', message: 'Client update v2.3.4 deployed to all users' },
        { time: '14:10:23', level: 'INFO', message: 'UI performance optimization completed' },
        { time: '13:58:16', level: 'WARN', message: 'Elevated error rates in Safari browsers' },
        { time: '13:45:02', level: 'ERROR', message: 'API gateway timeout on content fetch operation' }
      ]
    };

    return logs[id] || [];
  };

  const getServiceConfig = (id) => {
    // Configuration details for each service
    const configs = {
      catalog: [
        { key: 'Service Type', value: 'REST API' },
        { key: 'Language', value: 'Node.js' },
        { key: 'Cache Provider', value: 'Redis' },
        { key: 'Search Engine', value: 'Elasticsearch' },
        { key: 'Instances', value: '4' },
        { key: 'API Version', value: 'v2.1.0' }
      ],
      identity: [
        { key: 'Service Type', value: 'REST API' },
        { key: 'Language', value: 'Go' },
        { key: 'Auth Provider', value: 'JWT + OAuth' },
        { key: 'Storage', value: 'PostgreSQL' },
        { key: 'Instances', value: '6' },
        { key: 'API Version', value: 'v3.0.2' }
      ],
      recommend: [
        { key: 'Service Type', value: 'gRPC' },
        { key: 'Language', value: 'Python' },
        { key: 'ML Framework', value: 'TensorFlow' },
        { key: 'Feature Store', value: 'Redis' },
        { key: 'Instances', value: '3' },
        { key: 'API Version', value: 'v1.4.5' }
      ],
      stream: [
        { key: 'Service Type', value: 'WebSocket' },
        { key: 'Language', value: 'Rust' },
        { key: 'CDN', value: 'CloudFront' },
        { key: 'Protocol', value: 'HLS/DASH' },
        { key: 'Instances', value: '8' },
        { key: 'API Version', value: 'v2.0.1' }
      ],
      analytics: [
        { key: 'Service Type', value: 'Batch + Stream' },
        { key: 'Language', value: 'Scala' },
        { key: 'Framework', value: 'Spark' },
        { key: 'Data Lake', value: 'S3' },
        { key: 'Instances', value: '4' },
        { key: 'API Version', value: 'v1.2.8' }
      ],
      database: [
        { key: 'Database Type', value: 'PostgreSQL + MongoDB' },
        { key: 'Shards', value: '5' },
        { key: 'Replicas', value: '3' },
        { key: 'Backup Frequency', value: '6 hours' },
        { key: 'Storage', value: '4.8 TB' },
        { key: 'Version', value: 'PostgreSQL 14.2, MongoDB 5.0' }
      ],
      frontend: [
        { key: 'Framework', value: 'React' },
        { key: 'Hosting', value: 'CloudFront + S3' },
        { key: 'Build System', value: 'Webpack' },
        { key: 'Analytics', value: 'Google Analytics' },
        { key: 'CDN Regions', value: '12' },
        { key: 'Version', value: 'v2.3.4' }
      ]
    };

    return configs[id] || [];
  };

  const handleSimulateLoad = () => {
    setIsSimulating(true);

    // Dispatch event for parent component to handle
    window.dispatchEvent(new CustomEvent('simulate-load', { detail: node.id }));

    // Reset after animation
    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'metrics':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {getServiceMetrics(node.id).map((metric, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 p-2 rounded">
                <div className="text-lg font-bold">{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.label}</div>
              </div>
            ))}
          </div>
        );

      case 'logs':
        return (
          <div className="logs-container">
            {getServiceLogs(node.id).map((log, index) => (
              <div key={index} className={`log-entry py-1 border-b border-gray-800 ${
                log.level === 'ERROR' ? 'text-red-400' :
                log.level === 'WARN' ? 'text-amber-400' : 'text-gray-300'
              }`}>
                <span className="text-xs text-gray-500 mr-2">{log.time}</span>
                <span className="text-xs font-mono px-1 mr-1 rounded" style={{
                  backgroundColor: log.level === 'ERROR' ? 'rgba(220, 38, 38, 0.2)' :
                                  log.level === 'WARN' ? 'rgba(245, 158, 11, 0.2)' :
                                  'rgba(107, 114, 128, 0.2)'
                }}>
                  {log.level}
                </span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        );

      case 'config':
        return (
          <div className="config-container">
            <table className="w-full text-sm">
              <tbody>
                {getServiceConfig(node.id).map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800 bg-opacity-30' : ''}>
                    <td className="py-1 px-2 text-gray-400">{item.key}</td>
                    <td className="py-1 px-2 font-mono">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default: // overview
        return (
          <>
            <p className="text-gray-300 text-sm mb-4">
              {getServiceDescription(node.id)}
            </p>

            <h4 className="text-sm font-semibold text-gray-200 mb-2">Key Metrics</h4>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {getServiceMetrics(node.id).slice(0, 3).map((metric, index) => (
                <div key={index} className="bg-gray-800 bg-opacity-50 p-2 rounded">
                  <div className="text-lg font-bold">{metric.value}</div>
                  <div className="text-xs text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => setActiveTab('metrics')}
                className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-xs">
                View All Metrics
              </button>

              <button
                onClick={handleSimulateLoad}
                disabled={isSimulating}
                className={`simulate-load-btn text-xs ${isSimulating ? 'simulating' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                {isSimulating ? 'Simulating...' : 'Simulate Load'}
              </button>
            </div>
          </>
        );
    }
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

      <div className="tabs mb-4 border-b border-gray-700">
        <div className="flex space-x-4">
          <button
            className={`pb-2 text-sm ${activeTab === 'overview'
              ? 'text-white border-b-2 border-blue-500 font-medium'
              : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`pb-2 text-sm ${activeTab === 'metrics'
              ? 'text-white border-b-2 border-blue-500 font-medium'
              : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics
          </button>
          <button
            className={`pb-2 text-sm ${activeTab === 'logs'
              ? 'text-white border-b-2 border-blue-500 font-medium'
              : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('logs')}
          >
            Logs
          </button>
          <button
            className={`pb-2 text-sm ${activeTab === 'config'
              ? 'text-white border-b-2 border-blue-500 font-medium'
              : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('config')}
          >
            Config
          </button>
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default ServiceDetails;