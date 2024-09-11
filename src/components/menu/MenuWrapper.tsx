'use client';

import { useState } from 'react';
import Header from './Header';
import Menu from './Menu';

export default function MenuWrapper() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </>
  );
}
