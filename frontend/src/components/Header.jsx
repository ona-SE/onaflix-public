import React from 'react';

const Header = ({ onSimulateLoad, selectedNode }) => {
  return (
    <header className="header">
      <div>
        <h1 className="text-white">Streaming Platform Development Environment</h1>
        <p className="text-gray-400 text-sm">Gitpod Flex Demonstration</p>
      </div>
      
      <div className="header-actions">
        <button 
          className={`btn ${selectedNode ? 'btn-primary' : 'bg-gray-700 cursor-not-allowed'}`}
          onClick={onSimulateLoad}
          disabled={!selectedNode}
        >
          Simulate Load on {selectedNode ? selectedNode.name : 'Service'}
        </button>
      </div>
    </header>
  );
};

export default Header;