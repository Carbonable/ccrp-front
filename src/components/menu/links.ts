export interface MenuLink {
  href: string;
  labelKey: string;
  isOpen: boolean;
  outsideLink: boolean;
  icon: string;
}

export const links: MenuLink[] = [
  {
    href: '/dashboard',
    labelKey: 'dashboard',
    isOpen: true,
    outsideLink: false,
    icon: 'dashboard',
  },
  {
    href: '/portfolio',
    labelKey: 'portfolio',
    isOpen: true,
    outsideLink: false,
    icon: 'portfolio',
  },
  {
    href: 'https://carbonable.sextan.app/public/global/custom/jqnk50pr511dah162',
    labelKey: 'impact',
    isOpen: true,
    outsideLink: true,
    icon: 'impact',
  },
  {
    href: '/calculator',
    labelKey: 'planifier',
    isOpen: true,
    outsideLink: false,
    icon: 'calculator',
  },
  {
    href: '/baseline',
    labelKey: 'baseline',
    isOpen: true,
    outsideLink: false,
    icon: 'baseline',
  },
];

export const adminLink: MenuLink = {
  href: '/admin',
  labelKey: 'admin',
  isOpen: true,
  outsideLink: false,
  icon: 'admin',
};
