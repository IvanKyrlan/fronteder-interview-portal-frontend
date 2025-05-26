import React from "react";
import { FaSync, FaFilter, FaInbox } from "react-icons/fa";
import TopicCard from "./TopicCard";
import EmptyState from "./EmptyState";

const TopicsList = ({
  topics,
  loading,
  error,
  resetFilters,
  searchTerm,
  activeCategory,
  categoryName = "Невідома категорія",
}) => {
  if (loading) {
    return (
      <div className="p-5">
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-600 border-t-transparent mb-3"></div>
            <p className="text-gray-600 text-sm">Завантаження тем...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-xl" />
          </div>
          <div className="text-lg text-red-500 mb-5 font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-5 py-2.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-200 text-sm font-medium"
          >
            <FaSync className="mr-2" size={14} />
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg">
          <EmptyState
            type={searchTerm ? "no-results" : "no-topics"}
            icon={searchTerm ? FaFilter : FaInbox}
            message={
              searchTerm
                ? `Теми за запитом "${searchTerm}" не знайдено`
                : activeCategory !== "all"
                ? `У категорії "${categoryName}" немає тем`
                : "Теми відсутні"
            }
            onAction={resetFilters}
            actionLabel={
              searchTerm || activeCategory !== "all"
                ? "Скинути фільтри"
                : "Створити першу тему"
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="space-y-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
};

export default TopicsList;
