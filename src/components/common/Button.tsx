import { classNames } from "@/utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const secondaryButton = 'font-inter uppercase rounded-lg px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide hover:bg-opacityLight-5 ';

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

export function SecondaryButton({ children, className, onClick }: ButtonProps) {
  return <button className={secondaryButton + className} onClick={onClick}>{children}</button>;
}
