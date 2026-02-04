import React from 'react';

const NeonInput: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonInput" {...props}>
      {children}
    </div>
  );
};

export default NeonInput;
