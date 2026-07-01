import React from 'react';

const EnvBanner: React.FC = () => {
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#ff000070',
      color: 'white',
      textAlign: 'right',
      padding: '4px',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 9999,
      fontWeight: 'bold'
    }}>
      Local Development Environment
    </div>
  );
};

export default EnvBanner;
