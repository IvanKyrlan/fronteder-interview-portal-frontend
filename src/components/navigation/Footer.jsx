import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaFacebook,
  FaTelegram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import logo from '../../assets/frontender-logo.svg';

export default function Footer() {
  const sections = [
    { name: 'Головна', link: '/' },
    { name: 'ІТ статті', link: '/articles' },
    { name: 'Технічні співбесіди', link: '/interviews' },
    { name: 'Тести та практика', link: '/tests' },
    { name: 'Форум', link: '/forum' },
  ];

  const information = [
    { name: 'Про портал', link: '/about' },
    { name: 'Довідники', link: '/directories' },
    { name: 'Контакти', link: '/contacts' },
  ];

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="Frontender Logo" className="w-8 h-8" />
              <span className="text-4xl font-bold text-white">rontender</span>
            </Link>
            <p className="text-gray-300 mb-6">
              Онлайн-платформа для підготовки до співбесід на позицію Frontend
              розробника. Вивчайте теорію, проходьте тести та виконуйте
              практичні завдання.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/IvanKyrlan/fronteder-interview-portal-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white "
              >
                <FaGithub size={22} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Інформація</h3>
            <ul className="space-y-3">
              {information.map((resource, index) => (
                <li key={index}>
                  <Link
                    to={resource.link}
                    className="text-gray-300 hover:text-amber-500 "
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Розділи</h3>
            <ul className="space-y-3">
              {sections.map((section, index) => (
                <li key={index}>
                  <Link
                    to={section.link}
                    className="text-gray-300 hover:text-amber-500 "
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Контакти</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <FaEnvelope className="text-amber-500 mt-1 mr-3" />
                <a
                  href="mailto:clg-math@chnu.edu.ua"
                  className="text-gray-300 hover:text-amber-500 "
                >
                  clg-math@chnu.edu.ua
                </a>
              </li>
              <li className="flex items-start">
                <FaPhoneAlt className="text-amber-500 mt-1 mr-3" />
                <a
                  href="tel:+380123456789"
                  className="text-gray-300 hover:text-amber-500 "
                >
                  (0372) 58-48-80
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-amber-500 mt-1 mr-3" />
                <span className="text-gray-300">
                  вул. Університетська 28, Чернівці, Україна
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
