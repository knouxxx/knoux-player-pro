import React from 'react';

const NeonMenu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonMenu" {...props}>
      {children}
    </div>
  );
};

export default NeonMenu;
