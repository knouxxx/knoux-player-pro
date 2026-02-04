import React from 'react';

const NeonVolumeControl: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonVolumeControl" {...props}>
      {children}
    </div>
  );
};

export default NeonVolumeControl;
