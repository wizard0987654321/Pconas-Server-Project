import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageHeading from "../components/PageHeading";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { useAuth } from "../contexts/AuthProvider";

function Homepage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const headingKey = user?.role?.toLowerCase() === "trainer"
    ? "pages.home.trainerHelloText"
    : "pages.home.traineeHelloText";

  return (
    <div className="p-4 flex flex-col items-center">
      <PageHeading heading={headingKey} />
      <PrimaryButton label={t("pages.home.button")} onClick={() => navigate("/rooms")} />
    </div>
  );
}

export default Homepage;
