import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ProgressTab from "../components/profile/ProgressTab";
import ProfileInfoTab from "../components/profile/ProfileInfoTab";
import PasswordTab from "../components/profile/PasswordTab";

export default function ProfilePage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("progress");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }

    document.title = "Особистий кабінет | Frontender";

    return () => {
      document.title = "Frontender";
    };
  }, [isAuthenticated, navigate]);

  const handleMessage = (msg) => {
    setMessage(msg);

    if (msg.text) {
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
          Особистий кабінет
        </h1>

        <div className="bg-white rounded-lg border border-gray-100 shadow-md">
          <div className="flex overflow-x-auto border-b border-gray-100">
            <button
              className={`px-4 py-3 text-base md:text-lg whitespace-nowrap  ${
                activeTab === "progress"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-600 hover:text-amber-600"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              Мій прогрес
            </button>
            <button
              className={`px-4 py-3 text-base md:text-lg whitespace-nowrap  ${
                activeTab === "profile"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-600 hover:text-amber-600"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Налаштування профілю
            </button>
            <button
              className={`px-4 py-3 text-base md:text-lg whitespace-nowrap  ${
                activeTab === "password"
                  ? "text-amber-600 border-b-2 border-amber-600"
                  : "text-gray-600 hover:text-amber-600"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Змінити пароль
            </button>
          </div>

          <div className="p-4 md:p-6">
            {message.text && (
              <div
                className={`p-4 mb-6 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                {message.text}
              </div>
            )}

            {activeTab === "progress" && <ProgressTab />}

            {activeTab === "profile" && (
              <ProfileInfoTab onMessage={handleMessage} />
            )}

            {activeTab === "password" && (
              <PasswordTab onMessage={handleMessage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
