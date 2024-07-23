import { useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { MenuLink } from "@/types/Link";

export default function NavLinkOutside({link}: {link: MenuLink}) {
    const [isShown, setIsShown] = useState(true);

    if (link.isOpen === false) {
        return (
            <div key={link.label} className="uppercase font-inter text-base">
                <div className="w-full flex justify-start items-center">
                    <div className="w-[3px] h-[44px] bg-transparent"></div>
                    <div className="flex justify-start items-center py-2 pl-6 text-neutral-400 cursor-default" onMouseEnter={() => setIsShown(false)} onMouseLeave={() => setIsShown(true)}>
                        <Image src={`/assets/images/menu/${link.icon}.svg`} alt={`${link.icon}_inactive`} width={24} height={24} className="w-6 h-6" />
                        {isShown && <div className="py-3 pl-2">{link.label}</div> }
                        {!isShown && <div className="py-3 pl-2">COMING SOON</div> }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <a key={link.label} className="uppercase font-inter text-base" href={link.href} target="_blank" rel="noreferrer">
            <div className="w-full flex justify-start items-center hover:brightness-125">
                <div className="w-[3px] h-[44px] bg-transparent"></div>
                <div className="flex justify-start items-center py-2 pl-6 text-neutral-200">
                    <Image src={`/assets/images/menu/${link.icon}.svg`} alt={`${link.icon}_active`} width={24} height={24} className="w-6 h-6" />
                    <div className="py-3 pl-2">{link.label}</div>
                    <ArrowTopRightOnSquareIcon className="ml-2 w-4" />
                </div>
            </div>
        </a>
    )
}