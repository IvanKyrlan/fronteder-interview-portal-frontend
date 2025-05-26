import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { updateProfile } from "../../store/authSlice";
import authService from "../../services/authService";

export default function ProfileInfoTab({ onMessage }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await authService.updateProfile(profileData);
      dispatch(updateProfile(updatedUser));
      setEditMode(false);
      onMessage({ text: "Профіль успішно оновлено", type: "success" });
    } catch (error) {
      onMessage({
        text: error.response?.data?.message || "Помилка при оновленні профілю",
        type: "error",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileData({
      username: user?.username || "",
      email: user?.email || "",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Налаштування профілю</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center text-amber-600 hover:text-amber-700"
          >
            <FaEdit className="mr-1" /> Редагувати
          </button>
        )}
      </div>

      <form onSubmit={handleSaveProfile}>
        <div className="space-y-4 font-medium">
          <div>
            <label className="block text-gray-700 mb-2">Логін</label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500"
              disabled={!editMode}
            />
          </div>
        </div>

        {editMode && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 flex items-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FaTimes className="mr-1" /> Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 flex items-center bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              <FaSave className="mr-1" /> Зберегти зміни
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
