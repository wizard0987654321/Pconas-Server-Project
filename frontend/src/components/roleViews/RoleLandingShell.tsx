type RoleLandingShellProps = {
  title: string;
  description: string;
  accentText: string;
};

function RoleLandingShell({ title, description, accentText }: RoleLandingShellProps) {
  return (
    <div className="w-full max-w-3xl rounded-[24px] border-4 border-[#6ADBAF] bg-white/85 p-6 shadow-lg dark:bg-gray-900/85 dark:text-white">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-[#2b6a52] dark:text-[#6ADBAF]">
        {accentText}
      </p>
      <h2 className="mt-3 text-3xl font-bold">{title}</h2>
      <p className="mt-3 text-base leading-7">{description}</p>
    </div>
  );
}

export default RoleLandingShell;