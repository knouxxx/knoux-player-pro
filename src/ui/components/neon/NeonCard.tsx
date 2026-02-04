import React from 'react';

const NeonCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonCard" {...props}>
      {children}
    </div>
  );
};

export default NeonCard;
