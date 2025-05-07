import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleNavigateButton = ({ to, children, className, disabled }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (disabled) return;

    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default SimpleNavigateButton;
