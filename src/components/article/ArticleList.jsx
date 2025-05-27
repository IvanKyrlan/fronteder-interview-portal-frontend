import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { formatDateLocale } from "../../utils/dateUtils";

export default function ArticleList({ articles }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {articles.map((article) => (
        <Link
          to={`/articles/${article.slug}`}
          key={article.id}
          className="bg-white rounded-lg overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full"
        >
          {article.thumbnail && (
            <div className="relative h-64 overflow-hidden">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover transition duration-700 ease-in-out transform hover:scale-105"
              />
            </div>
          )}
          <div className="p-6 flex flex-col flex-grow relative">
            <div className="flex items-center mb-2">
              <span
                className={`text-xs font-semibold inline-block py-1 px-2 rounded ${
                  article.article_type === "task"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                } mr-2`}
              >
                {article.article_type_display}
              </span>
            </div>

            <div className="h-24 mb-2">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-amber-600 hover:text-amber-600 transition duration-300 line-clamp-3">
                {article.title}
              </h2>
            </div>

            <div
              className="text-gray-600 mb-4 flex-grow h-24 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: article.description }}
            />

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className="text-gray-500 text-sm">
                {formatDateLocale(article.published_at)}
              </span>

              <span className="text-amber-600 group-hover:text-amber-700 text-md flex items-center">
                Читати далі
                <FaArrowRight
                  size={12}
                  className="ml-1 group-hover:translate-x-1 transition-transform duration-300"
                />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
