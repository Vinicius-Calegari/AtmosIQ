import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from 'react';
import { Search, X } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClear?: () => void;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onClear,
      className = '',
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <div
          className={`
            relative flex items-center bg-bg-secondary rounded-xl border transition-all duration-200
            ${error 
              ? 'border-red-500 focus-within:border-red-500' 
              : isFocused 
                ? 'border-accent-primary shadow-md shadow-accent-primary/20' 
                : 'border-white/10 hover:border-white/20'
            }
          `}
        >
          {leftIcon && (
            <span className="absolute left-4 text-text-muted">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-transparent px-4 py-3 text-text-primary placeholder-text-muted
              focus:outline-none
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon || onClear ? 'pr-12' : ''}
              ${className}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            {...props}
          />
          {(rightIcon || (onClear && value)) && (
            <span className="absolute right-4 flex items-center gap-2">
              {onClear && value && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <X size={18} />
                </button>
              )}
              {rightIcon && (
                <span className="text-text-muted">{rightIcon}</span>
              )}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input Component
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <Input
      leftIcon={<Search size={20} />}
      placeholder="Pesquisar cidade..."
      {...props}
    />
  );
}
