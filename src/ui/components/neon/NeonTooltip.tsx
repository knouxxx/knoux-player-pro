import React from 'react';

const NeonTooltip: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonTooltip" {...props}>
      {children}
    </div>
  );
};

export default NeonTooltip;
