import ThemeToggle from "./toggleButtons/ThemeToggle"
import LanguageToggle from "./toggleButtons/LanguageToggle"
import logo from "../assets/pconasLogo.png"
import { Link } from "react-router-dom"
import { getDisplayLabel, useAuth } from "../contexts/AuthProvider"
import { useTranslation } from "react-i18next"

function Header() {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <>
            <header className="h-[15vh] w-full bg-[#F8FAFC] dark:bg-gray-900 border-4 border-[#6ADBAF] dark:border-[#3f8c6f] flex items-center justify-between l:px-4">
                <Link to="/">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-full max-h-12 w-auto scale-50 m:scale-75 l:scale-100 cursor-pointer"
                    />
                </Link>
                <span className="hidden m:flex flex-col items-center font-mono text-3xl font-bold text-black-700 dark:text-gray-100">
                    <span>{user ? getDisplayLabel(user) : "Login"}</span>

                </span>
                <div className="ml-auto flex items-center gap-3 pr-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>
                    {user ? (
                        <button
                            onClick={logout}
                            className="cursor-pointer rounded-[16px] border-2 border-[#6ADBAF] px-3 py-2 font-mono font-bold text-black dark:text-white"
                        >
                            {t("buttons.logOut")}
                        </button>
                    ) : null}
                </div>
            </header>
        </>
    )
}

export default Header;