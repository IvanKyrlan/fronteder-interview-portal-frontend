import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function ContributionSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-amber-500 to-amber-700 text-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-4 w-full text-center">
          Зробіть свій внесок у розвиток проекту
        </h2>
        <p className="text-lg text-gray-100 mb-8 w-full text-center">
          Допоможіть зробити портал кращим! Ви можете долучитися до покращення
          платформи: оновлюйте код, додавайте новий контент, пропонуйте ідеї або
          вдосконалюйте існуючі розділи. Разом ми зможемо створити ще
          ефективніше середовище для підготовки до Frontend співбесід.
        </p>
        <div className="w-full flex justify-center mt-8">
          <a
            href="https://github.com/IvanKyrlan/fronteder-interview-portal-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="w-24 h-24 rounded-full bg-white text-neutral-800 flex items-center justify-center hover:bg-amber-500 hover:text-white  shadow-lg"
          >
            <FaGithub size={48} />
          </a>
        </div>
      </div>
    </section>
  );
}
