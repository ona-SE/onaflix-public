import React from 'react';

const ServiceControls = ({ selectedService, onSelectService, onToggleTheme, isDarkMode }) => {
  const services = [
    {
      id: 'analytics',
      name: 'Analytics Service',
      color: '#ef4444', // Red color
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'identity',
      name: 'User Management',
      color: '#4f46e5', // Purple color
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: 'controls',
      name: 'Controls',
      color: '#374151', // Gray for controls
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const controlOptions = [
    {
      id: 'add',
      name: 'Add New Service',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      id: 'theme',
      name: isDarkMode ? 'Light Mode' : 'Dark Mode',
      icon: isDarkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
      onClick: onToggleTheme,
    },
    {
      id: 'reset',
      name: 'Reset Layout',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      onClick: () => {},
    },
  ];

  return (
    <div className="service-controls">
      {services.map((service) => (
        <button
          key={service.id}
          className={`service-btn ${selectedService === service.id ? 'selected' : ''}`}
          style={{
            backgroundColor: service.id === 'controls' ? undefined :
              (selectedService === service.id ? service.color : 'rgba(30, 41, 59, 0.8)'),
            borderColor: selectedService === service.id ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
          }}
          onClick={() => (service.id === 'controls' ? null : onSelectService(service.id))}
        >
          <div className="service-btn-icon" style={{color: service.id !== 'controls' ? 'white' : undefined}}>
            {service.icon}
          </div>
          <span className="service-btn-label">{service.name}</span>

          {service.id === 'controls' && (
            <div className="control-menu">
              {controlOptions.map((option) => (
                <a
                  key={option.id}
                  href="#"
                  className="control-option"
                  onClick={(e) => {
                    e.preventDefault();
                    option.onClick();
                  }}
                >
                  {option.icon}
                  <span>{option.name}</span>
                </a>
              ))}
            </div>
          )}
        </button>
      ))}

      <style jsx>{`
        .service-controls {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .service-btn {
          background-color: rgba(30, 41, 59, 0.8);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px;
          width: 45px;
          height: 45px;
          position: relative;
          overflow: visible;
          transition: background-color 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .service-btn:hover {
          background-color: rgba(30, 41, 59, 0.9);
        }

        .service-btn-icon {
          margin-bottom: 3px;
        }

        .service-btn-label {
          font-size: 7px;
          font-weight: 500;
          line-height: 1.2;
        }

        .control-menu {
          display: none;
          position: absolute;
          right: -120px;
          top: 0;
          width: 115px;
          background-color: rgba(30, 41, 59, 0.95);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 50;
          backdrop-filter: blur(4px);
        }

        .service-btn:hover .control-menu {
          display: block;
        }

        .control-option {
          display: flex;
          align-items: center;
          padding: 5px 7px;
          color: #e2e8f0;
          text-decoration: none;
          font-size: 8px;
          transition: background-color 0.2s;
        }

        .control-option:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .control-option svg {
          width: 9px;
          height: 9px;
          margin: 0 5px 0 0;
        }
      `}</style>
    </div>
  );
};

export default ServiceControls;
