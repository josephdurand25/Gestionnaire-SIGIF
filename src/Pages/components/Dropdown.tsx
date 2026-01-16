import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import clsx from 'clsx';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
  buttonVariant?: 
    | 'accent'
    | 'slate'
    | 'secondary'
    | 'outline'
    | 'disabled'
    | 'ico'
    | 'danger'
    | 'success'
    | 'sivathemedark'
    | 'perso'
    | 'sivatheme';
  buttonProps?: Record<string, any>;
  [key: string]: any;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  className = '',
  menuClassName = '',
  disabled = false,
  buttonVariant = 'outline',
  buttonProps = {},
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fermeture au clic extérieur ou touche Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node) && 
          !triggerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div 
      className={clsx('relative inline-block', className)} 
      ref={dropdownRef}
      {...rest}
    >
      <Button
        ref={triggerRef}
        variant={buttonVariant}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        {...buttonProps}
      >
        {typeof trigger === 'string'
          ? trigger.charAt(0).toUpperCase() + trigger.slice(1)
          : trigger
        }
      </Button>

      {isOpen && (
        <div
          className={clsx(
            'absolute z-10 mt-1 rounded-md shadow-md',
            'border border-gray-200 dark:border-gray-700',
            'dark:bg-gray-800',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
          role="menu"
        >
          <div className="py-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onClick: (e: React.MouseEvent) => {
                    child.props.onClick?.(e);
                    setIsOpen(false);
                  },
                  className: clsx(
                    'block w-full px-4 py-2 text-left text-sm',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    child.props.className
                  ),
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Item pour faciliter l'utilisation
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  [key: string]: any;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
  children, 
  onClick, 
  className = '',
  ...rest 
}) => {
  return (
    <button
      className={clsx(
        'flex items-center gap-2 w-full text-left first-letter:uppercase',
        className
      )}
      onClick={onClick}
      role="menuitem"
      {...rest}
    >
      {children}
    </button>
  );
};