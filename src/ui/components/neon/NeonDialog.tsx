import React from 'react';

const NeonDialog: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonDialog" {...props}>
      {children}
    </div>
  );
};

export default NeonDialog;
