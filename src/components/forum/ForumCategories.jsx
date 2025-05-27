import React, { useState, useEffect } from "react";

const ForumCategories = ({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts = {},
  loading = false,
}) => {
  const [initialCounts, setInitialCounts] = useState({});

  useEffect(() => {
    if (
      !loading &&
      Object.keys(categoryCounts).length > 0 &&
      Object.keys(initialCounts).length === 0
    ) {
      setInitialCounts({ ...categoryCounts });
    }
  }, [loading, categoryCounts, initialCounts]);

  const displayCounts =
    Object.keys(initialCounts).length > 0 ? initialCounts : categoryCounts;

  if (loading) {
    return (
      <div className="px-5 py-6 border-b border-gray-100">
        <h2 className="text-base  text-gray-700 mb-4">Категорії</h2>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-8 w-24 rounded-full"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 border-b border-gray-100">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Категорії</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-md text-sm  transition-all duration-200 ${
              activeCategory === category.id
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-current={activeCategory === category.id ? "page" : undefined}
          >
            {category.name}
            <span className="ml-1 text-md">
              ({displayCounts[category.id] || 0})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ForumCategories;
