import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const LoginPrompt = ({
  message = 'Для доступу до цієї функції необхідно увійти в систему',
  showRegister = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaSignInAlt className="text-amber-600 text-xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Потрібна авторизація
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700  inline-flex items-center justify-center"
          >
            <FaSignInAlt className="mr-2" />
            Увійти
          </Link>

          {showRegister && (
            <Link
              to="/register"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50  inline-flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" />
              Зареєструватися
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
