import React, { useState } from "react";
import { FaKey } from "react-icons/fa";
import authService from "../../services/authService";

export default function PasswordTab({ onMessage }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onMessage({ text: "Нові паролі не співпадають", type: "error" });
      return;
    }

    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onMessage({ text: "Пароль успішно змінено", type: "success" });
    } catch (error) {
      onMessage({
        text: error.response?.data?.message || "Помилка при зміні пароля",
        type: "error",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Змінити пароль</h2>
      <form onSubmit={handleChangePassword}>
        <div className="space-y-4 ">
          <div>
            <label className="block text-gray-700 mb-2">Поточний пароль</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Новий пароль</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Підтвердження нового пароля
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
              required
            />
          </div>
        </div>

        <div className="mt-6 text-center ">
          <button
            type="submit"
            className="px-6 py-3 flex items-center bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            <FaKey className="mr-2" /> Змінити пароль
          </button>
        </div>
      </form>
    </div>
  );
}
