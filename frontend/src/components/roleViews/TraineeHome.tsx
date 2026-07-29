import RoleLandingShell from "./RoleLandingShell";

function TraineeHome() {
  return (
    <RoleLandingShell
      accentText="Trainee mode"
      title="Trainee dashboard"
      description="This is the trainee-specific landing area. It can stay visually similar now and diverge later when the functions start changing."
    />
  );
}

export default TraineeHome;