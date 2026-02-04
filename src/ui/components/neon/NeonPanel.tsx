import React from 'react';

const NeonPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonPanel" {...props}>
      {children}
    </div>
  );
};

export default NeonPanel;
