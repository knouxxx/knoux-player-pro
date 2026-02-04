import React from 'react';

const NeonContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonContainer" {...props}>
      {children}
    </div>
  );
};

export default NeonContainer;
