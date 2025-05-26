import React from "react";
import HeroSection from "../components/home/HeroSection.jsx";
import AdvantagesSection from "../components/home/AdvantagesSection.jsx";
import PreparationSection from "../components/home/PreparationSection";
import TestsAndTasksSection from "../components/home/TestsAndTasksSection";
import LatestArticlesSection from "../components/home/LatestArticlesSection";

export default function Home() {
  React.useEffect(() => {
    document.title = "Frontender - Веб-портал для підготовки до співбесід";

    return () => {
      document.title = "Frontender";
    };
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <AdvantagesSection />
      <PreparationSection />
      <TestsAndTasksSection />
      <LatestArticlesSection />
    </div>
  );
}
