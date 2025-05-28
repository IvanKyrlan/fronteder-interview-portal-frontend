import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import authService from '../../services/authService';
import emailjs from 'emailjs-com';

export default function LoginForm({ onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(
        formData.username,
        formData.password
      );
      dispatch(login(data));
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Невірний логін або пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotStatus({ loading: true, success: false, error: null });

    emailjs
      .send(
        'service_3qwujrv',
        'template_65wzh2p',
        {
          user_email: forgotEmail,
        },
        'qC5RZCUAxKKqq4MNX'
      )
      .then(() => {
        setForgotStatus({ loading: false, success: true, error: null });
        setForgotEmail('');
      })
      .catch(() => {
        setForgotStatus({
          loading: false,
          success: false,
          error: 'Не вдалося надіслати лист. Спробуйте ще раз.',
        });
      });
  };

  return !showForgot ? (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email або логін</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
          placeholder="Введіть email або логін"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Пароль</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
            placeholder="Введіть пароль"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg "
        disabled={loading}
      >
        {loading ? 'Обробка...' : 'Увійти'}
      </button>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-800"
          onClick={() => setShowForgot(true)}
        >
          Забули пароль?
        </button>
      </div>
    </form>
  ) : (
    <form onSubmit={handleForgotSubmit}>
      <div className="mb-4 text-center text-lg font-semibold text-gray-700">
        Відновлення пароля
      </div>
      {forgotStatus.success ? (
        <div className="bg-green-50 text-green-700 p-3 rounded mb-4">
          Інструкція надіслана на вашу пошту!
        </div>
      ) : (
        <>
          <input
            type="email"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 mb-4"
            placeholder="Введіть ваш email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
          {forgotStatus.error && (
            <div className="text-red-600 mb-2">{forgotStatus.error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg mb-2"
            disabled={forgotStatus.loading}
          >
            {forgotStatus.loading ? 'Відправка...' : 'Надіслати'}
          </button>
          <button
            type="button"
            className="w-full text-gray-600 hover:text-gray-800 py-2"
            onClick={() => setShowForgot(false)}
          >
            Назад до входу
          </button>
        </>
      )}
    </form>
  );
}
