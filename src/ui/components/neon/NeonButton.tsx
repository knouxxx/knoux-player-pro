import React from 'react';

const NeonButton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonButton" {...props}>
      {children}
    </div>
  );
};

export default NeonButton;
