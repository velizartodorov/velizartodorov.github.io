import React from 'react';

const EnvBanner: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#ff000088',
      color: 'white',
      textAlign: 'center',
      padding: '4px',
      position: 'fixed',
      width: '100%',
      bottom: 0,
      zIndex: 9999,
      fontWeight: 'bold'
    }}>
      Local Development Environment
    </div>
  );
};

export default EnvBanner;
