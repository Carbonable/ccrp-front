'use client';
import { MenuLink } from "@/types/link";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavLinkInside({link, setOpenMenu}: {link: MenuLink, setOpenMenu: (open: boolean) => void}) {
    const [isShown, setIsShown] = useState(true);
    const pathName = usePathname();

    const isActive = pathName === link.href;

    if (link.isOpen === false) {
        return (
            <div key={link.label} className="uppercase font-inter text-base">
                <div className="w-full flex justify-start items-center">
                    <div className="w-[3px] h-[44px] bg-transparent"></div>
                    <div className="flex justify-start items-center py-2 pl-6 text-neutral-400 cursor-default" onMouseEnter={() => setIsShown(false)} onMouseLeave={() => setIsShown(true)}>
                        <Image src={`/assets/images/menu/${link.icon}-inactive.svg`} alt={`${link.icon}_inactive`} width={24} height={24} className="w-6 h-6 " />
                        {isShown && <div className="py-3 pl-2">{link.label}</div> }
                        {!isShown && <div className="py-3 pl-2">COMING SOON</div> }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Link prefetch key={link.label} className="uppercase font-inter text-base" href={link.href} onClick={() => setOpenMenu(false)} >
            <div className={`w-full flex justify-start items-center ${isActive ? "" : "hover:brightness-125"}`}>
                <div className={`w-[3px] h-[48px] ${isActive ? "bg-primary" : "bg-transparent"}`}></div>
                <div className={`flex justify-start items-center pl-6 w-full ${isActive ? "text-primary bg-menu-selected" : "text-neutral-200"}`}>
                    <Image src={`/assets/images/menu/${link.icon}${isActive ? "-active" : ""}.svg`} alt={`${link.icon}${isActive ? "_active" : ""}`} width={6} height={6} className="w-6 h-6" />
                    <div className="py-3 pl-2">{link.label}</div>
                </div>
            </div>
        </Link>
    )
}