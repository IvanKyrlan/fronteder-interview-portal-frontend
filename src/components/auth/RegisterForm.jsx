import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import authService from "../../services/authService";

export default function RegisterForm({ onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const data = await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.password_confirm
      );
      dispatch(login(data));
      onClose();
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData) {
        const newErrors = {};

        if (typeof errorData === "object") {
          Object.keys(errorData).forEach((key) => {
            if (Array.isArray(errorData[key])) {
              newErrors[key] = errorData[key][0];
            } else if (typeof errorData[key] === "string") {
              newErrors[key] = errorData[key];
            }
          });
        } else if (typeof errorData === "string") {
          newErrors.general = errorData;
        }

        setErrors(newErrors);
      } else {
        setErrors({ general: "Сталася помилка при реєстрації" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="font-medium">
      {errors.general && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {errors.general}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Логін</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
            errors.username
              ? "border-red-500"
              : "border-gray-200 focus:border-amber-600"
          }`}
          placeholder="Введіть ваш логін"
          required
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
            errors.email
              ? "border-red-500"
              : "border-gray-200 focus:border-amber-600"
          }`}
          placeholder="Введіть ваш email"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Пароль</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
              errors.password
                ? "border-red-500"
                : "border-gray-200 focus:border-amber-600"
            }`}
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
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Підтвердіть пароль</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
              errors.password_confirm
                ? "border-red-500"
                : "border-gray-200 focus:border-amber-600"
            }`}
            placeholder="Введіть пароль ще раз"
            required
          />
        </div>
        {errors.password_confirm && (
          <p className="text-red-500 text-sm mt-1">{errors.password_confirm}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        disabled={loading}
      >
        {loading ? "Обробка..." : "Зареєструватися"}
      </button>
    </form>
  );
}
