import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function Header({
  openMenu,
  setOpenMenu,
}: {
  openMenu: boolean;
  setOpenMenu: (open: boolean) => void;
}) {
  return (
    <div className="fixed top-0 z-50 w-full lg:hidden">
      <div className="flex w-full items-center justify-start bg-neutral-900/90 p-4 backdrop-blur-sm">
        {!openMenu && (
          <Bars3Icon
            className="h-8 w-8 cursor-pointer rounded-full border p-1 text-neutral-100"
            onClick={() => setOpenMenu(true)}
          />
        )}
        {openMenu && (
          <XMarkIcon
            className="h-8 w-8 cursor-pointer rounded-full border p-1 text-neutral-100"
            onClick={() => setOpenMenu(false)}
          />
        )}
        <Image
          src="/assets/logo/logo.svg"
          alt="Carbonable logo"
          width={144}
          height={36}
          className="ml-8"
        />
      </div>
    </div>
  );
}
