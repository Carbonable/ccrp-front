import Image from "next/image";
import NavLinkInside from "./NavLinkInside";
import NavLinkOutside from "./NavLinkOutside";
import { links } from "./links";
export default function Menu({openMenu, setOpenMenu}: {openMenu: boolean, setOpenMenu: (open: boolean) => void}) {

    return (
        <div className={`${openMenu ? "block w-[300px] z-50 fixed bg-neutral-900 " : "hidden w-0 bg-neutral-900" } left-0 lg:w-[222px] h-[100vh] lg:block lg:fixed lg:bg-neutral-900/80 pt-4 pr4 `}>
            <Image src="/assets/logo/logo.svg" alt="Carbonable logo"  width={144} height={36} className="hidden lg:block pl-4" />
            <div className="font-extrabold uppercase text-greenish-600 pl-[70px] hidden lg:block">CCPM</div>
            <div className="mt-6 lg:mt-12 w-full">
                {links.map((link) => (      
                    <div key={`${link.label}_mobile`} className="my-2">
                        {link.outsideLink && <NavLinkOutside link={link} />}
                        {false === link.outsideLink && <NavLinkInside link={link} setOpenMenu={setOpenMenu} />}
                    </div>
                ))}
            </div>
        </div>
    )
}