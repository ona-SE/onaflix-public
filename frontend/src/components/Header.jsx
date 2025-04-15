import React from 'react';

const Header = ({ onSimulateLoad, selectedNode, onToggleTheme, isDarkMode }) => {
  return (
    <header className="header">
      <div>
        <h1 className="text-white">Streaming Platform Development Environment</h1>
        <p className="text-gray-400 text-sm">Gitpod Flex Demonstration</p>
      </div>

      <div className="header-actions">
        <button
          className={`btn ${selectedNode ? 'btn-primary pulse-button' : 'bg-gray-700 cursor-not-allowed opacity-70'} flex items-center gap-1`}
          onClick={onSimulateLoad}
          disabled={!selectedNode}
          title={selectedNode ? `Simulate load on ${selectedNode.name}` : 'Select a service first'}
        >
          {/* Load icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>

          {selectedNode ?
            <span className="font-medium text-xs">{selectedNode.name}</span> : 'Select'}

          {/* Service status indicator */}
          {selectedNode && (
            <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1 ${selectedNode.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          )}
        </button>

        <div className="control-dropdown relative ml-2">
          <button className="bg-gray-800 hover:bg-gray-700 text-white text-xs py-1.5 px-2.5 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Controls
          </button>
          <div className="control-dropdown-menu">
            <a href="#" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Service
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onToggleTheme(); }} className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isDarkMode ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                )}
              </svg>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </a>
            <a href="#" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Layout
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pulse-button {
          position: relative;
        }

        .pulse-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.25rem;
          box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.98);
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
          }

          70% {
            transform: scale(1);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0);
          }

          100% {
            transform: scale(0.98);
            box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;