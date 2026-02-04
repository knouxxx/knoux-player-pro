import React from 'react';

const NeonProgressBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonProgressBar" {...props}>
      {children}
    </div>
  );
};

export default NeonProgressBar;
