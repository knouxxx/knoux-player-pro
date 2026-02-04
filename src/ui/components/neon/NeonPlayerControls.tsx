import React from 'react';

const NeonPlayerControls: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonPlayerControls" {...props}>
      {children}
    </div>
  );
};

export default NeonPlayerControls;
