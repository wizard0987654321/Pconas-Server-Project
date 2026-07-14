import ThemeToggle from "./ThemeToggle"
import LanguageToggle from "./LanguageToggle"
import logo from "../assets/pconasLogo.png"
import { Link } from "react-router-dom"
import SecondaryButton from "./buttons/SecondaryButton"

function Header() {
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
                <span className="hidden m:inline font-mono text-3xl font-bold text-black-700 dark:text-gray-100">
                    Trainer
                </span>
                <div className="flex scale-75 flex-col gap-4 m-2 items-center 
                                m:flex-row xs:scale-100">
                    <ThemeToggle />
                    <LanguageToggle />
                </div>
            </header>
        </>
    )
}

export default Header;