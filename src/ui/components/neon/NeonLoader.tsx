import React from 'react';

const NeonLoader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonLoader" {...props}>
      {children}
    </div>
  );
};

export default NeonLoader;
