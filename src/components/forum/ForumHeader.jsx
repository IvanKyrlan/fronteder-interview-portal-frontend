import React from "react";

const ForumHeader = () => {
  return (
    <>
      <section className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Форум Frontender</h1>
          <p className="text-xl max-w-4xl mx-auto text-gray-300">
            Обговорюйте питання Frontend-розробки, діліться досвідом та
            отримуйте допомогу від колег з професійної спільноти.
          </p>
        </div>
      </section>
    </>
  );
};

export default ForumHeader;
