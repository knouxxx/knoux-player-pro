import React from 'react';

const NeonSlider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="neon-NeonSlider" {...props}>
      {children}
    </div>
  );
};

export default NeonSlider;
