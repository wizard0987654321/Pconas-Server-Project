/* ==========================================================================
 * BOOK THREAD 1  Homepage   (Chapter 1: Homepage)
 * File: src/pages/Homepage.tsx
 *
 * Start page after login: welcome text for trainer or trainee and a button to the rooms (chapter 2).
 *
 * Reached via: URL /  (sidebar link "Home")
 * Used by: 0.5 routes
 * Uses: 0.3 AuthProvider, A.1 PageHeading, A.2 PrimaryButton
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageHeading from "../components/PageHeading"; // A.1 PageHeading
import PrimaryButton from "../components/buttons/PrimaryButton"; // A.2 PrimaryButton
import { useAuth } from "../contexts/AuthProvider"; // 0.3 AuthProvider

function Homepage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // 0.3 useAuth
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

// → Next in the book: 2 RoomsPage  (src/pages/RoomsPage.tsx)
