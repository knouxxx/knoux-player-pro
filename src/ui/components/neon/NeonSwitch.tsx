import React from 'react';

const NeonSwitch: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonSwitch" {...props}>
      {children}
    </div>
  );
};

export default NeonSwitch;
