/* ==========================================================================
 * BOOK THREAD 0.6.1  LoginScreen   (Chapter 0: App start and layout)
 * File: src/components/auth/LoginScreen.tsx
 *
 * Login form (username + password), shown by Navigation while nobody is logged in.
 *
 * Used by: 0.6 Navigation
 * Uses: 0.3 AuthProvider, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useState } from "react";
import PageHeading from "../PageHeading"; // A.1 PageHeading
import PrimaryButton from "../buttons/PrimaryButton"; // A.2 PrimaryButton
import { useAuth } from "../../contexts/AuthProvider"; // 0.3 AuthProvider
import { useTranslation } from "react-i18next";

function LoginScreen() {
  const { login, isLoggingIn, error } = useAuth(); // 0.3 useAuth
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(username.trim(), password);
  };

  return (
    <div className="flex w-full justify-center p-4">
      <div className="xl:max-w-[60%] rounded-[24px] border-4 border-[#6ADBAF] bg-white/85 p-6 shadow-lg backdrop-blur dark:bg-[#0E1F48] dark:text-[#F8FAFC]">
        <PageHeading heading="pages.home.helloText" />

        <p className="mt-4 text-center font-mono text-sm uppercase tracking-[0.2em] text-[#2b6a52] dark:text-[#6ADBAF]">
          {t("pages.login.comment")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 font-mono text-sm font-bold">
            {t("pages.login.username")}
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-[14px] border-2 border-[#6ADBAF] bg-transparent px-4 py-3 outline-none dark:text-[#F8FAFC] dark:placeholder:text-gray-400"
              autoComplete="username"
              placeholder={t("pages.login.usernamePlaceholder")} />
          </label>

          <label className="flex flex-col gap-2 font-mono text-sm font-bold">
            {t("pages.login.password")}
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-[14px] border-2 border-[#6ADBAF] bg-transparent px-4 py-3 outline-none dark:text-[#F8FAFC] dark:placeholder:text-gray-400"
              type="password"
              autoComplete="current-password"
              placeholder={t("pages.login.passwordPlaceholder")} />
          </label>

          {error ? (
            <p className="rounded-[14px] border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <div className="flex justify-center">
            <PrimaryButton
              label={isLoggingIn ? t("pages.login.checking") : t("pages.login.loginButton")} onClick={() => undefined}
              margin="m-0"
            />
          </div>

          <button type="submit" className="sr-only">
            t("pages.login.button")
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;

// → Next in the book: 0.6.2 Header  (src/components/Header.tsx)
