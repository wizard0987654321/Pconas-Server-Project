import RoleLandingShell from "./RoleLandingShell";

function TrainerHome() {
  return (
    <RoleLandingShell
      accentText="Trainer mode"
      title="Trainer dashboard"
      description="This is the trainer-specific landing area. Later you can put trainer-only functions here, while keeping the trainee version separate."
    />
  );
}

export default TrainerHome;