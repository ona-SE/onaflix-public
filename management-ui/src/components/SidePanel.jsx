import React, { useEffect } from 'react';
import './SidePanel.css';

const SidePanel = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

    const baseRepoUrl = 'https://github.com/loujaybee/gitpodflix-demo';
  const baseAutomationUrl = 'https://github.com/loujaybee/gitpodflix-demo/blob/ba748d00cc930dba002560f8f870ef59e3d18b36/.gitpod/automations.yaml';

  // Mock data for repository and automation info
  const nodeInfo = {
    frontend: {
      repository: 'gitpodflix-demo/frontend',
      directory: '/services/frontend',
      automation: `name: frontend
description: Frontend service for Gitpod Flix
tasks:
  - init: yarn install
  - command: yarn dev
ports:
  - port: 3000
    onOpen: open-preview`,
      githubUrl: `${baseRepoUrl}/tree/main/services/frontend`,
      automationUrl: baseAutomationUrl
    },
    catalog: {
      repository: 'gitpodflix-demo/catalog',
      directory: '/services/catalog',
      automation: `name: catalog
description: Catalog service for Gitpod Flix
tasks:
  - init: npm install
  - command: npm start
ports:
  - port: 4000
    onOpen: open-preview`,
      githubUrl: `${baseRepoUrl}/tree/main/services/catalog`,
      automationUrl: baseAutomationUrl
    },
    identity: {
      repository: 'gitpodflix-demo/identity',
      directory: '/services/identity',
      automation: `name: identity
description: Identity service for Gitpod Flix
tasks:
  - init: npm install
  - command: npm start
ports:
  - port: 5000
    onOpen: open-preview`,
      githubUrl: `${baseRepoUrl}/tree/main/services/identity`,
      automationUrl: baseAutomationUrl
    },
    recommend: {
      repository: 'gitpodflix-demo/recommend',
      directory: '/services/recommend',
      automation: `name: recommend
description: Recommendation service for Gitpod Flix
tasks:
  - init: npm install
  - command: npm start
ports:
  - port: 6000
    onOpen: open-preview`,
      githubUrl: `${baseRepoUrl}/tree/main/services/recommend`,
      automationUrl: baseAutomationUrl
    },
    stream: {
      repository: 'gitpodflix-demo/stream',
      directory: '/services/stream',
      automation: `name: stream
description: Streaming service for Gitpod Flix
tasks:
  - init: npm install
  - command: npm start
ports:
  - port: 7000
    onOpen: open-preview`,
      githubUrl: `${baseRepoUrl}/tree/main/services/stream`,
      automationUrl: baseAutomationUrl
    },
    analytics: {
      repository: 'gitpodflix-demo/analytics',
      directory: '/services/analytics',
      automation: `name: analytics
description: Analytics service for Gitpod Flix
tasks:
  - init: npm install
  - command: npm start
ports:
  - port: 8000
    onOpen: open-preview`,
      githubUrl: `${baseRepoUrl}/tree/main/services/analytics`,
      automationUrl: baseAutomationUrl
    },
    database: {
      repository: 'gitpodflix-demo/database',
      directory: '/services/database',
      automation: `name: database
description: Database service for Gitpod Flix
tasks:
  - init: docker-compose up -d
  - command: npm start
ports:
  - port: 5432
    onOpen: open-preview`,
      githubUrl: `${baseRepoUrl}/tree/main/services/database`,
      automationUrl: baseAutomationUrl
    }
  };

  const info = nodeInfo[selectedNode.id] || {
    repository: 'Not available',
    directory: 'Not available',
    automation: 'No automation configuration found',
    githubUrl: '#',
    automationUrl: '#'
  };

  return (
    <div className="side-panel">
      <div className="side-panel-content">
        <div className="side-panel-header">
          <h2>{selectedNode.name}</h2>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>
        
        <div className="side-panel-section">
          <h3>Repository</h3>
          <p>{info.repository}</p>
          <a href={info.githubUrl} className="github-link" target="_blank" rel="noopener noreferrer">
            <svg className="github-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
          </a>
        </div>

        <div className="side-panel-section">
          <h3>Directory</h3>
          <p>{info.directory}</p>
        </div>

        <div className="side-panel-section">
          <h3>Automation Configuration</h3>
          <a href={info.automationUrl} className="github-link" target="_blank" rel="noopener noreferrer">
            <svg className="github-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View automation file
          </a>
          <pre className="automation-code">
            {info.automation}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SidePanel; 
