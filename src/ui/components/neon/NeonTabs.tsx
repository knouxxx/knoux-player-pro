import React from 'react';

const NeonTabs: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonTabs" {...props}>
      {children}
    </div>
  );
};

export default NeonTabs;
