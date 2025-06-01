import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaPuzzlePiece,
  FaBookOpen,
  FaChevronDown,
  FaDatabase,
  FaComments,
} from 'react-icons/fa';
import heroIllustration from '../../assets/hero-illustration.svg';
import { SiDjango } from 'react-icons/si';
import { SiJavascript, SiReact } from 'react-icons/si';

export default function HeroSection() {
  const scrollToNextSection = () => {
    const nextSection = document.querySelector(
      '.scroll-snap-section:nth-child(2)'
    );
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="absolute w-[28rem] h-[28rem] rounded-full bg-amber-100 opacity-40 top-20 -right-48 z-0"></div>
      <div className="absolute w-80 h-80 rounded-full bg-blue-100 opacity-30 bottom-32 -left-20 z-0"></div>
      <div className="absolute w-40 h-40 rounded-full bg-amber-200 opacity-20 top-48 left-24 z-0"></div>

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-full bg-amber-100 text-amber-600  mb-3 md:mb-4 text-sm md:text-base">
                Веб-портал для підготовки до співбесід
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-gray-800 leading-tight">
                Стань спроможним
                <span className="text-amber-600"> Frontend розробником</span>
              </h1>
              <p className="text-lg font-medioum md:text-md mb-4 md:mb-6 text-gray-600 max-w-lg mx-auto lg:mx-0">
                Вивчайте теорію, розв'язуйте практичні завдання, проходьте тести
                та підготуйтесь до співбесіди у провідних IT компаніях!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-8">
              <Link to="/tests" className="w-full sm:w-auto">
                <button className="w-full px-6 md:px-8 py-3 md:py-4 rounded-md text-white bg-amber-600  text-base md:text-lg hover:bg-amber-700 shadow-md hover:shadow-lg transition-all duration-300">
                  Почати підготовку
                </button>
              </Link>
              <Link to="/articles" className="w-full sm:w-auto">
                <button className="w-full px-6 md:px-8 py-3 md:py-4 rounded-md text-gray-800 bg-white border-2 border-gray-200  text-base md:text-lg hover:border-amber-600 hover:text-amber-600 transition-all duration-300">
                  Читати статті
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-1.5 md:gap-3 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <FaBookOpen size={24} className="md:text-xl" />
                </div>
                <p className="text-sm md:text-base text-gray-800 ">Статті</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <FaPuzzlePiece size={24} className="md:text-xl" />
                </div>
                <p className="text-sm md:text-base text-gray-800 ">Тести</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <FaCode size={24} className="md:text-xl" />
                </div>
                <p className="text-sm md:text-base text-gray-800 ">Практика</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <FaComments size={24} className="md:text-xl" />
                </div>
                <p className="text-sm md:text-base text-gray-800 ">Форум</p>
              </div>
            </div>
          </div>

          <div className="order-first lg:order-last overflow-visible flex justify-center">
            <div className="relative animate-float-hero w-[30rem] h-[30rem] md:w-[38rem] md:h-[38rem] flex items-center justify-center">
              <img
                src={heroIllustration}
                alt="Головна Ілюстрація"
                className="w-[120%] h-[120%] max-w-none object-contain drop-shadow-2xl"
                rel="preload"
              />

              <Badge
                className="hidden md:flex absolute top-16 right-16 animate-float"
                icon={<SiJavascript className="text-yellow-400" />}
                label="JavaScript"
                bg="bg-white"
                text="text-gray-900"
              />
              <Badge
                className="hidden md:flex absolute bottom-28 left-16 animate-float-delayed"
                icon={<SiReact className="text-blue-400" />}
                label="React.js"
                bg="bg-white"
                text="text-gray-900"
              />
              <Badge
                className="hidden md:flex absolute top-[55%] left-0 animate-float-slow"
                icon={<FaDatabase className="text-blue-700" />}
                label="SQL"
                bg="bg-white"
                text="text-gray-900"
              />
              <Badge
                className="hidden md:flex absolute bottom-10 right-24 animate-float"
                icon={<SiDjango className="text-green-700" />}
                label="Django"
                bg="bg-white"
                text="text-gray-900"
              />
              <Badge
                className="hidden md:flex absolute top-10 left-36 animate-float-delayed"
                icon={<FaCode className="text-pink-500" />}
                label="HTML5 & CSS3"
                bg="bg-white"
                text="text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center hidden lg:block">
          <button
            className="flex flex-col items-center text-gray-500 hover:text-amber-600"
            onClick={scrollToNextSection}
            aria-label="Прокрутити вниз"
          >
            <span className="mb-2 text-sm ">Дізнатися більше</span>
            <FaChevronDown className="animate-bounce" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({
  icon,
  label,
  className = '',
  bg = 'bg-white',
  text = 'text-gray-800',
}) {
  return (
    <div
      className={`px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 font-semibold text-xs md:text-base ${bg} ${text} ${className}`}
      style={{ minWidth: '105px', minHeight: '40px' }}
    >
      {icon}
      {label}
    </div>
  );
}
