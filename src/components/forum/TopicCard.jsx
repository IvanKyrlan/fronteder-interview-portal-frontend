import React from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaCommentAlt,
  FaThumbtack,
  FaCode,
  FaUser,
} from "react-icons/fa";
import {
  formatDateLocale,
  truncateText,
  getCategoryColor,
} from "../../utils/formatUtils";

const TopicCard = ({ topic }) => {
  return (
    <Link
      to={`/forum/topics/${topic.id}`}
      className="block bg-white border-2 border-gray-100 rounded-lg p-5 mb-4 hover:border-amber-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className={`text-sm font-medium text-white px-3 py-1 rounded-full ${getCategoryColor(
                topic.category
              )}`}
            >
              {topic.category_display}
            </span>

            <div className="flex items-center">
              {topic.is_pinned && (
                <span className="mr-1.5 text-amber-500" title="Закріплена тема">
                  <FaThumbtack size={18} />
                </span>
              )}
              {topic.has_code && (
                <span className="mr-1.5 text-blue-500" title="Містить код">
                  <FaCode size={18} />
                </span>
              )}
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-800 mb-2 leading-tight">
            {topic.title}
          </h3>

          <p className="text-gray-600 mb-3 line-clamp-2 text-md font-medium">
            {truncateText(topic.content, 180)}
          </p>
        </div>

        <div className="text-sm font-medium text-gray-500 whitespace-nowrap mb-2 sm:mb-0 sm:ml-4 mt-1">
          {formatDateLocale(topic.created_at)}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mt-3 text-md border-t border-gray-50 pt-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
            <FaUser size={12} />
          </div>
          <span className="text-gray-700 text-md">{topic.author_name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-500 flex items-center text-md">
            <FaEye className="mr-1" size={12} />
            {topic.views}
          </span>
          <span className="text-gray-500 flex items-center text-md">
            <FaCommentAlt className="mr-1" size={12} />
            {topic.comments_count || 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;
