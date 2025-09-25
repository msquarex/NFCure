'use client';

import React from 'react';
import Threads from './Threads';

const ThreadsDemo: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Threads
        amplitude={1}
        distance={0}
        enableMouseInteraction={true}
        color={[1,0,0]}
      />
    </div>
  );
};

export default ThreadsDemo;

