'use client';

import { useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import { NotificationProvider } from '@/context/NotificationContext';

export default function MenuWrapper() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <NotificationProvider>
      <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </NotificationProvider>
  );
}
