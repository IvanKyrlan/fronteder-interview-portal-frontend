import React, { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const ForumActionBar = ({
  onCreateTopic,
  searchTerm,
  onSearchChange,
  onSearch,
  sortBy,
  onSortChange,
  isAuthenticated,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      alert('Для створення теми необхідно увійти в систему');
      return;
    }
    onCreateTopic();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(e);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    onSearch({ preventDefault: () => {} });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsDropdownOpen(false);
  };

  const sortOptions = {
    newest: 'Найновіші',
    oldest: 'Найстаріші',
    popular: 'Популярні',
    discussed: 'Обговорювані',
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
      <div className="flex w-full md:w-auto items-center gap-4 ">
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-200 shadow-sm flex items-center whitespace-nowrap text-md"
        >
          <FaPlus className="mr-2" size={18} />
          Створити тему
        </button>

        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-grow w-full md:max-w-md"
        >
          <div className="flex items-center text-gray-700">
            <input
              type="text"
              placeholder="Пошук у форумі..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none  resize-none placeholder-gray-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-10 text-gray-400 hover:text-gray-600 "
                aria-label="Очистити пошук"
              >
                <FaTimes size={18} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 text-gray-400 hover:text-amber-600 "
              aria-label="Пошук"
            >
              <FaSearch size={18} />
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2">
          <FaFilter className="text-gray-400" />
        </span>
        <select
          value={sortBy}
          onChange={(e) => handleSortSelect(e.target.value)}
          className="rounded-md px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent  text-gray-700"
          style={{ minWidth: 140 }}
        >
          {Object.entries(sortOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ForumActionBar;
