import React from 'react';

const NeonGrid: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonGrid" {...props}>
      {children}
    </div>
  );
};

export default NeonGrid;
