import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBookOpen,
  FaCode,
  FaLaptop,
  FaUsers,
  FaQuestion,
  FaClipboardCheck,
} from 'react-icons/fa';

export default function PreparationSection() {
  const steps = [
    {
      icon: <FaBookOpen className="text-3xl" />,
      title: 'Вивчіть основи',
      description:
        'Почніть з HTML, CSS та JavaScript — це фундамент, на якому будується frontend-розробка.',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: <FaCode className="text-3xl" />,
      title: 'Засвойте фреймворки',
      description:
        'Вивчіть популярні фреймворки, такі як React, Vue або Angular — вони часто вимагаються на співбесідах.',
      color: 'from-blue-500 to-blue-400',
    },
    {
      icon: <FaLaptop className="text-3xl" />,
      title: 'Створюйте проекти',
      description:
        'Практика — ключ до успіху. Створюйте власні проекти для закріплення навичок та формування портфоліо.',
      color: 'from-green-500 to-green-400',
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: 'Спілкуйтеся з колегами',
      description:
        'Беріть участь у професійних спільнотах, відвідуйте мітапи та вебінари для розширення знань.',
      color: 'from-purple-500 to-purple-400',
    },
    {
      icon: <FaQuestion className="text-3xl" />,
      title: 'Вирішуйте задачі',
      description:
        "Розв'язуйте алгоритмічні задачі та практичні завдання для підготовки до технічних інтерв'ю.",
      color: 'from-red-500 to-red-400',
    },
    {
      icon: <FaClipboardCheck className="text-3xl" />,
      title: 'Проходьте тести',
      description:
        'Регулярно тестуйте свої знання для виявлення прогалин, які потрібно заповнити перед справжньою співбесідою.',
      color: 'from-amber-500 to-yellow-400',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full bg-amber-100 opacity-50 -top-0 -left-20 z-0"></div>
      <div className="absolute w-64 h-64 rounded-full bg-blue-100 opacity-50 bottom-24 right-12 z-0"></div>

      <div className="max-w-7xl w-full mx-auto px-4 py-12 z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Як підготуватися до співбесід?
          </h2>
          <p className="text-xl text-gray-600 max-w-7xl mx-auto">
            Підготовка до технічних співбесід — це системний процес, який
            вимагає часу та наполегливості. <br></br>Ось 6 ключових кроків, які
            допоможуть вам успішно пройти співбесіду на позицію
            Frontend-розробника
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transform transition duration-300 hover:-translate-y-2 hover:shadow-lg group text-center"
            >
              <div
                className={`h-3 w-full bg-gradient-to-r ${step.color}`}
              ></div>
              <div className="p-6 flex flex-col items-center flex-grow">
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-lg mb-4 text-white bg-gradient-to-br ${step.color} transform transition duration-300 group-hover:scale-110 mx-auto`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg mb-4">{step.description}</p>
                <div className="mt-auto w-full">
                  <span className="text-amber-600 font-bold text-xl">
                    Крок {index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
