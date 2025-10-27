import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ 
  to = null, 
  onClick = null, 
  className = '',
  children = 'Back'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-50 transition-colors duration-200 ${className}`}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {children}
    </button>
  );
};

export default BackButton;
