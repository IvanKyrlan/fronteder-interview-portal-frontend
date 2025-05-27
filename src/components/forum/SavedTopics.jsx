import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBookmark, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import forumService from "../../services/forumService";
import { formatDateLocale } from "../../utils/dateUtils";

const SavedTopics = ({ refreshTrigger = 0 }) => {
  const [savedTopics, setSavedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedTopics = async () => {
      try {
        setLoading(true);
        const data = await forumService.getUserBookmarks();
        setSavedTopics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Не вдалося завантажити збережені теми");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTopics();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaBookmark className="mr-2 text-amber-500" />
          Збережені теми
        </h3>
        <div className="flex justify-center py-6">
          <FaSpinner className="text-amber-500 animate-spin text-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaBookmark className="mr-2 text-amber-500" />
          Збережені теми
        </h3>
        <div className="text-red-500 flex items-center justify-center py-4">
          <FaExclamationTriangle className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (savedTopics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaBookmark className="mr-2 text-amber-500" />
          Збережені теми
        </h3>
        <p className="text-gray-500 text-center py-4 ">
          У вас немає збережених тем
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaBookmark className="mr-2 text-amber-600" />
        Збережені теми
      </h3>
      <div className="space-y-4">
        {savedTopics.slice(0, 5).map((topic) => (
          <div
            key={topic.id}
            className="border-b border-gray-100 pb-3 last:border-0"
          >
            <Link
              to={`/forum/topics/${topic.id}`}
              className="block hover:text-amber-600 transition-colors"
            >
              <h4 className=" text-gray-800 mb-1 line-clamp-2">
                {topic.title}
              </h4>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatDateLocale(topic.created_at)}</span>
              </div>
            </Link>
          </div>
        ))}

        {savedTopics.length > 5 && (
          <div className="text-center pt-2">
            <Link
              to="/forum/bookmarks"
              className="text-amber-600 hover:text-amber-700  text-sm"
            >
              Показати всі ({savedTopics.length})
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTopics;
