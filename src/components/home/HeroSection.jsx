import React from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaPuzzlePiece,
  FaBookOpen,
  FaChevronDown,
} from "react-icons/fa";
import heroIllustration from "../../assets/hero-illustration.png";

export default function HeroSection() {
  const scrollToNextSection = () => {
    const nextSection = document.querySelector(
      ".scroll-snap-section:nth-child(2)"
    );
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full bg-amber-100 opacity-40 top-20 -right-48 z-0"></div>
      <div className="absolute w-64 h-64 rounded-full bg-blue-100 opacity-30 bottom-32 -left-20 z-0"></div>
      <div className="absolute w-32 h-32 rounded-full bg-amber-200 opacity-20 top-48 left-24 z-0"></div>

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-full bg-amber-100 text-amber-600 font-medium mb-3 md:mb-4 text-sm md:text-base">
                Веб-портал для підготовки до співбесід
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-gray-800 leading-tight">
                Стань спроможним
                <span className="text-amber-600"> Frontend розробником</span>
              </h1>
              <p className="text-xl md:text-lg mb-4 md:mb-6 text-gray-600 max-w-lg mx-auto lg:mx-0">
                Вивчайте теорію, розв'язуйте практичні завдання, проходьте тести
                та підготуйтесь до співбесіди у провідних IT компаніях!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-8">
              <Link to="/tests" className="w-full sm:w-auto">
                <button className="w-full px-6 md:px-8 py-3 md:py-4 rounded-md text-white bg-amber-600 font-medium text-base md:text-lg hover:bg-amber-700 shadow-md hover:shadow-lg transition-all duration-300">
                  Почати підготовку
                </button>
              </Link>
              <Link to="/articles" className="w-full sm:w-auto">
                <button className="w-full px-6 md:px-8 py-3 md:py-4 rounded-md text-gray-800 bg-white border-2 border-gray-200 font-medium text-base md:text-lg hover:border-amber-600 hover:text-amber-600 transition-all duration-300">
                  Читати статті
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <FaCode size={16} className="md:text-xl" />
                </div>
                <p className="text-sm md:text-base text-gray-800 font-medium">
                  Практика
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2">
                  <FaPuzzlePiece size={16} className="md:text-xl" />
                </div>
                <p className="text-sm md:text-base text-gray-800 font-medium">
                  Тести
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <FaBookOpen size={16} className="md:text-xl" />
                </div>
                <p className="text-sm md:text-base text-gray-800 font-medium">
                  Статті
                </p>
              </div>
            </div>
          </div>

          <div className="order-first lg:order-last overflow-hidden flex justify-center">
            <div className="relative animate-float-hero w-72 h-72 md:w-[32rem] md:h-[32rem] flex items-center justify-center">
              <img
                src={heroIllustration}
                alt="Головна Ілюстрація"
                className="w-full h-full object-contain drop-shadow-xl"
              />
              {/* Плаваючі підписи */}
              <div className="hidden md:block absolute top-10 right-16 px-3 md:px-4 py-1 md:py-2 bg-white shadow-md rounded-lg text-xs md:text-sm font-medium text-gray-800 animate-float">
                HTML5 & CSS3
              </div>
              <div className="hidden md:block absolute bottom-24 left-16 px-3 md:px-4 py-1 md:py-2 bg-white shadow-md rounded-lg text-xs md:text-sm font-medium text-gray-800 animate-float-delayed">
                React.js
              </div>
              <div className="hidden md:block absolute top-1/2 left-0 px-3 md:px-4 py-1 md:py-2 bg-white shadow-md rounded-lg text-xs md:text-sm font-medium text-gray-800 animate-float-slow">
                JavaScript
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center hidden lg:block">
          <button
            className="flex flex-col items-center text-gray-500 hover:text-amber-600 transition-colors duration-300"
            onClick={scrollToNextSection}
            aria-label="Прокрутити вниз"
          >
            <span className="mb-2 text-sm font-medium">Дізнатися більше</span>
            <FaChevronDown className="animate-bounce" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
