import React from "react";
import {
  FaPlus,
  FaFilter,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";

const EmptyState = ({
  type = "no-topics",
  message,
  onAction,
  actionLabel,
  icon: Icon = FaExclamationTriangle,
  categoryName,
  searchTerm,
}) => {
  let DisplayIcon = Icon;
  let iconColor = "text-gray-400";
  let actionIcon;

  if (!message) {
    switch (type) {
      case "no-topics":
        message = "На форумі поки що немає тем";
        DisplayIcon = FaPlus;
        iconColor = "text-amber-500";
        actionLabel = actionLabel || "Створити першу тему";
        actionIcon = <FaPlus className="mr-2" size={14} />;
        break;
      case "no-results":
        message = searchTerm
          ? `Не знайдено результатів за запитом "${searchTerm}"`
          : categoryName
          ? `У категорії "${categoryName}" немає тем`
          : "Не знайдено жодної теми";
        DisplayIcon = FaSearch;
        iconColor = "text-blue-500";
        actionLabel = actionLabel || "Скинути фільтри";
        actionIcon = <FaFilter className="mr-2" size={14} />;
        break;
      case "error":
        message = message || "Виникла помилка при завантаженні даних";
        DisplayIcon = FaExclamationTriangle;
        iconColor = "text-red-500";
        actionLabel = actionLabel || "Спробувати знову";
        break;
      default:
        break;
    }
  }

  return (
    <div className="text-center py-12">
      <div
        className={`mx-auto w-14 h-14 flex items-center justify-center rounded-full mb-4 ${
          type === "error"
            ? "bg-red-50"
            : type === "no-results"
            ? "bg-gray-100"
            : "bg-gray-100"
        }`}
      >
        <DisplayIcon className={`text-3xl ${iconColor}`} />
      </div>

      <div className="text-lg text-gray-600 mb-5">{message}</div>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className={`inline-flex items-center px-5 py-3 rounded-md transition-all duration-200 text-md font-medium ${
            type === "error"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          {actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
