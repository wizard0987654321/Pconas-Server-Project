import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

type NavItemProps = {
    to: string,
    label: string,
    onClick?: () => void
}

function NavItem (
    { to, label, onClick }: NavItemProps
) {
    const { t } = useTranslation();

    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `py-6 font-mono text-sm m:text-lg transition-colors ${
                    isActive ? "font-bold text-[#6ADBAF]" : "text-black"
                }`
            }
        >
            {t(label)}
        </NavLink>
    );
}

export default NavItem;