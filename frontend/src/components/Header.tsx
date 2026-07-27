import ThemeToggle from "./toggleButtons/ThemeToggle"
import LanguageToggle from "./toggleButtons/LanguageToggle"
import logo from "../assets/pconasLogo.png"
import darkLogo from "../assets/pconasLogoDark.png"
import { Link } from "react-router-dom"

function Header() {
    return (
        <>
            <header className="h-[15vh] w-full bg-[#F8FAFC] border-4 border-[#6ADBAF] flex items-center justify-between dark:bg-[#0E1F48] l:px-4">
                <Link to="/">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-full max-h-12 w-auto scale-50 m:scale-75 l:scale-100 cursor-pointer dark:hidden"
                    />

                {/* rendering logo for dark mode */}
                    <img
                        src={darkLogo}
                        alt="Logo"
                        className="hidden h-full max-h-12 w-auto scale-50 m:scale-75 l:scale-100 cursor-pointer dark:block"
                    />
                </Link>
                <span className="hidden m:inline font-mono text-3xl font-bold text-[#111827] dark:text-[#F9FAFB]">
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