import React from "react";
import {
  FaLaptopCode,
  FaPaintBrush,
  FaGlobe,
  FaMoneyBillWave,
  FaRocket,
  FaUserTie,
} from "react-icons/fa";

export default function AdvantagesSection() {
  const advantages = [
    {
      icon: <FaLaptopCode className="text-4xl" />,
      title: "Актуальність",
      description:
        "Затребуваність на ринку праці зростає з кожним роком в міру того, як все більше компаній потребують розробки веб-проектів.",
    },
    {
      icon: <FaPaintBrush className="text-4xl" />,
      title: "Креативність",
      description:
        "Можливість поєднувати технічні навички з творчістю, створюючи привабливі та функціональні інтерфейси.",
    },
    {
      icon: <FaGlobe className="text-4xl" />,
      title: "Віддалена робота",
      description:
        "Можливість працювати з будь-якої точки світу, без прив'язки до конкретного місця.",
    },
    {
      icon: <FaMoneyBillWave className="text-4xl" />,
      title: "Висока зарплата",
      description:
        "Один з найбільш високооплачуваних напрямків у IT-індустрії з хорошими перспективами зростання.",
    },
    {
      icon: <FaRocket className="text-4xl" />,
      title: "Постійний розвиток",
      description:
        "Технології веб-розробки швидко змінюються, що забезпечує постійне професійне зростання та навчання.",
    },
    {
      icon: <FaUserTie className="text-4xl" />,
      title: "Низький поріг входу",
      description:
        "Старт у професії можливий без спеціальної освіти, головне — бажання вчитися та практикуватися.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-4 py-12 z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Переваги професії Frontend-розробника
          </h2>
          <p className="text-xl text-gray-600 max-w-7xl mx-auto">
            Чому Frontend-розробка є однією з найперспективніших професій у
            світі IT?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((item, index) => (
            <div
              key={index}
              className="bg-white flex flex-col items-center p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 hover:border-amber-500 hover:border-2 border-2 border-transparent"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4 mx-auto">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center text-lg">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
