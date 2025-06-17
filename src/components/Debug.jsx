import React from 'react';

const Debug = ({ children }) => {
  console.log('Debug component rendering:', children);
  return (
    <div style={{ border: '1px solid red', padding: '10px', margin: '10px' }}>
      <h3>Debug Info:</h3>
      <pre>{JSON.stringify(children, null, 2)}</pre>
    </div>
  );
};

export default Debug; 