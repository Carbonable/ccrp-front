import { classNames } from '@/utils/utils';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const secondaryButton =
  'font-inter uppercase rounded-lg px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide hover:bg-opacityLight-5 ';
const greenButton =
  'font-inter uppercase rounded-lg px-4 py-2 text-sm text-neutal-500 border border-neutral-500 tracking-wide bg-greenish-500 hover:brightness-110 ';

export default function PrimaryFormButton({
  children,
  className,
  isLoading,
  type,
  ...props
}: ButtonProps) {
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
  return (
    <button className={secondaryButton + className} onClick={onClick}>
      {children}
    </button>
  );
}

export function LinkSecondary({ href, children, className }: LinkButtonProps) {
  return (
    <a href={href} target="_blank" className={secondaryButton + className} rel="noreferrer">
      {children}
    </a>
  );
}

export function BackButton({ children, href, className }: LinkButtonProps) {
  return (
    <Link
      href={href}
      prefetch
      className="flex cursor-pointer items-center text-neutral-200 hover:text-neutral-100"
    >
      <ArrowLeftIcon className={className + ' mr-2 w-4'} />
      {children}
    </Link>
  );
}

export function GreenButton({ children, className, onClick, disabled }: ButtonProps) {
  return (
    <button disabled={disabled} className={greenButton + className} onClick={onClick}>
      {children}
    </button>
  );
}

export function MapButton({ children, className, onClick }: ButtonProps) {
  return (
    <button
      className={
        `font-inter rounded-lg border border-neutral-500 bg-opacityDark-70 px-4 py-2 text-center text-neutral-50 hover:bg-opacityDark-60 focus:outline-none ` +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
