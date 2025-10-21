import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = ({ size = 'default', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const buttonSizeClasses = {
    small: 'p-1',
    default: 'p-2',
    large: 'p-3'
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className={sizeClasses[size]} />;
      case 'dark':
        return <Moon className={sizeClasses[size]} />;
      default:
        return <Monitor className={sizeClasses[size]} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to Dark Mode';
      case 'dark':
        return 'Switch to Light Mode';
      default:
        return 'Toggle Theme';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${buttonSizeClasses[size]}
        text-gray-600 dark:text-gray-300 
        hover:text-primary-600 dark:hover:text-primary-400 
        transition-colors duration-200
        rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
      `}
      title={getLabel()}
      aria-label={getLabel()}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        {showLabel && (
          <span className="text-sm font-medium">
            {theme === 'light' ? 'Light' : 'Dark'}
          </span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
