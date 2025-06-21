import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface CommonButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  onClick,
  variant,
  size,
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  className,
  style,
}) => {

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--primary-600)',
      borderColor: 'var(--primary-600)',
      color: '#fff',
      fontSize: '16px'
    },
    secondary: {
      backgroundColor: 'var(--neutral-400)',
      borderColor: 'var(--neutral-400)',
      color: '#fff',
      fontSize: '16px'
    },
    danger: {
      backgroundColor: 'var(--danger-400)',
      borderColor: 'var(--danger-400)',
      color: '#fff',
      fontSize: '16px'
    },
  };

  const resolvedVariant = variant || 'primary';

  return (
    <Button
      size={size}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 border-0 ${className || ''}`}
      style={{ ...variantStyles[resolvedVariant], ...style }}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
      )}
      {icon && <span className="me-2">{icon}</span>}
      {label}
    </Button>
  );
};

export default CommonButton;
