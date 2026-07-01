import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

type NavItemProps = {
    to: string,
    label: string
}

function NavItem (
    { to, label }: NavItemProps
) {
    const { t } = useTranslation();

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `py-2 text-sm md:text-lg transition-colors ${
                    isActive ? "font-bold text-[#6ADBAF]" : "text-black"
                }`
            }
        >
            {t(label)}
        </NavLink>
    );
}

export default NavItem;