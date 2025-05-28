import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaBars, FaUserCircle } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import logo from '../../assets/frontender-logo.svg';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <div
        className={`bg-neutral-800 text-white border-b-2 border-gray-500 ${
          isScrolled
            ? 'lg:hidden fixed top-0 left-0 right-0 z-50 shadow-md'
            : 'block'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Frontender Logo" className="w-8 h-8" />
            <span className="text-4xl font-bold text-white">rontender</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6 mx-auto text-lg">
            <Link to="/about" className="text-white hover:text-gray-300">
              Про портал
            </Link>
            <Link to="/directories" className="text-white hover:text-gray-300">
              Довідники
            </Link>
            <Link to="/contacts" className="text-white hover:text-gray-300">
              Контакти
            </Link>
          </div>

          <div className="hidden lg:block">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2 text-white hover:text-gray-300 text-lg"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle size={20} />
                  <span>{user?.username}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200 text-black ">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Особистий кабінет
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Вийти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white text-gray-800 rounded border-1 border-white hover:bg-transparent hover:text-white"
                >
                  Увійти
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Реєстрація
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`bg-white border-b-2 border-gray-200 hidden lg:block ${
          isScrolled
            ? 'lg:fixed lg:top-0 lg:z-50 lg:w-full lg:shadow-md'
            : 'lg:relative'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 transition-colors duration-300">
          <ul className="flex flex-row items-center space-x-6 text-gray-500  text-md justify-between">
            {isScrolled && (
              <li className="mr-4">
                <Link to="/">
                  <img src={logo} alt="Frontender Logo" className="w-6 h-6" />
                </Link>
              </li>
            )}
            <li>
              <Link to="/articles" className="hover:text-amber-600">
                ІТ статті
              </Link>
            </li>
            <li>
              <Link to="/interviews" className="hover:text-amber-600">
                Технічні співбесіди
              </Link>
            </li>
            <li>
              <Link to="/tests" className="hover:text-amber-600">
                Тести та практика
              </Link>
            </li>
            <li>
              <Link to="/forum" className="hover:text-amber-600">
                Форум
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden fixed inset-0 z-50 bg-neutral-800 text-white overflow-y-auto"
        >
          <div className="px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Frontender Logo" className="w-8 h-8" />
              <span className="text-4xl font-bold text-white">rontender</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-8 py-6 px-4">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg"
            >
              Про портал
            </Link>

            <Link
              to="/directories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg"
            >
              Довідники
            </Link>

            <Link
              to="/contacts"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg"
            >
              Контакти
            </Link>

            <Link
              to="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg"
            >
              ІТ статті
            </Link>

            <Link
              to="/interviews"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg"
            >
              Технічні співбесіди
            </Link>

            <Link
              to="/tests"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg"
            >
              Тести та практика
            </Link>

            <Link
              to="/forum"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg"
            >
              Форум
            </Link>

            {isAuthenticated ? (
              <>
                <div className="flex flex-col w-full space-y-6">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-white text-neutral-800 text-lg rounded"
                  >
                    Особистий кабінет
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-neutral-800 text-white border-1 text-lg rounded"
                  >
                    Вийти
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col w-full space-y-6">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-white text-neutral-800 text-lg rounded"
                  >
                    Увійти
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-amber-600 text-white text-lg rounded"
                  >
                    Реєстрація
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
