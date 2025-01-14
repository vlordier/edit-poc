import React, { FC } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'medium', loading = false, ...props }) => {
  const baseClasses = 'rounded transition-colors focus:outline-none';
  const variantClasses = variant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  const sizeClasses = size === 'small' ? 'px-2 py-1 text-sm' : size === 'large' ? 'px-6 py-3 text-lg' : 'px-4 py-2';

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`}
      disabled={loading || props.disabled}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
