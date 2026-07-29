import { useState } from "react";
import PageHeading from "../PageHeading";
import PrimaryButton from "../buttons/PrimaryButton";
import { useAuth } from "../../contexts/AuthProvider";

function LoginScreen() {
  const { login, isLoggingIn, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(username.trim(), password);
  };

  return (
    <div className="flex w-full justify-center p-4">
      <div className=" xl:max-w-[60%] rounded-[24px] border-4 border-[#6ADBAF] bg-white/85 p-6 shadow-lg backdrop-blur dark:bg-gray-900/85 dark:text-white">
        <PageHeading heading="pages.home.helloText" />

        <p className="mt-4 text-center font-mono text-sm uppercase tracking-[0.2em] text-[#2b6a52] dark:text-[#6ADBAF]">
          Login test screen
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 font-mono text-sm font-bold">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-[14px] border-2 border-[#6ADBAF] bg-transparent px-4 py-3 outline-none"
              autoComplete="username"
              placeholder="trainer or trainee"
            />
          </label>

          <label className="flex flex-col gap-2 font-mono text-sm font-bold">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-[14px] border-2 border-[#6ADBAF] bg-transparent px-4 py-3 outline-none"
              type="password"
              autoComplete="current-password"
              placeholder="your password"
            />
          </label>

          {error ? (
            <p className="rounded-[14px] border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <div className="flex justify-center">
            <PrimaryButton
              label={isLoggingIn ? "Checking..." : "Log in"}
              onClick={() => undefined}
              margin="m-0"
            />
          </div>

          <button type="submit" className="sr-only">
            Submit login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;