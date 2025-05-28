import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { FaTimes } from 'react-icons/fa';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Вхід' : 'Реєстрація'}
        </h2>

        {mode === 'login' ? (
          <LoginForm onClose={onClose} />
        ) : (
          <RegisterForm onClose={onClose} />
        )}

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <p>
              Немає облікового запису?{' '}
              <button
                className="text-amber-600 hover:text-amber-700"
                onClick={() => setMode('register')}
              >
                Зареєструватися
              </button>
            </p>
          ) : (
            <p>
              Вже маєте обліковий запис?{' '}
              <button
                className="text-amber-600 hover:text-amber-700"
                onClick={() => setMode('login')}
              >
                Увійти
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
