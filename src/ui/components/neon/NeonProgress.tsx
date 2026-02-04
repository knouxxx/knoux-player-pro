import React from 'react';

const NeonProgress: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonProgress" {...props}>
      {children}
    </div>
  );
};

export default NeonProgress;
