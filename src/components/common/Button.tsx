import { classNames } from "@/utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export default function PrimaryFormButton({ children, className, isLoading, type, ...props }: ButtonProps) {
  return (
    <button
      className={classNames('primary-button', className, isLoading && 'loading-button')}
      disabled={isLoading}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
