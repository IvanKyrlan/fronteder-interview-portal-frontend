import React from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaEye,
  FaReply,
  FaThumbsUp,
  FaBookmark,
  FaThumbtack,
  FaCode,
} from "react-icons/fa";
import { formatDateLocale } from "../../utils/dateUtils";
import { getCategoryColor } from "../../utils/formatUtils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ShareButtons from "./ShareButtons";

const TopicContent = ({
  topic,
  commentsCount,
  isBookmarked,
  userLiked,
  likeCount,
  onToggleBookmark,
  onToggleLike,
  isAuthenticated = false,
}) => {
  const renderContent = (content) => {
    if (!content || !content.includes("```")) {
      return <p className="whitespace-pre-line">{content}</p>;
    }

    const parts = content.split("```");
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const languageMatch = part.match(/^(\w+)\n/);
        const language = languageMatch ? languageMatch[1] : "javascript";
        const code = languageMatch ? part.replace(/^\w+\n/, "") : part;

        return (
          <div
            key={index}
            className="w-full overflow-x-auto my-4"
            style={{ maxWidth: "100%" }}
          >
            <SyntaxHighlighter
              language={language}
              style={atomDark}
              customStyle={{
                borderRadius: "8px",
                fontSize: "15px",
                minWidth: 0,
                width: "100%",
                overflowX: "auto",
              }}
            >
              {code.trim()}
            </SyntaxHighlighter>
          </div>
        );
      }
      return (
        <p key={index} className="whitespace-pre-line leading-relaxed">
          {part}
        </p>
      );
    });
  };

  if (!topic) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="border-b border-gray-100 p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-sm  text-white px-2.5 py-1 rounded-full ${getCategoryColor(
              topic.category
            )}`}
          >
            {topic.category_display}
          </span>
          {topic.is_pinned && (
            <span className="ml-2 text-amber-500" title="Закріплена тема">
              <FaThumbtack size={14} />
            </span>
          )}
          {topic.has_code && (
            <span className="ml-2 text-blue-500" title="Містить код">
              <FaCode size={14} />
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3 break-words">
          {topic.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm  mb-3">
          <div className="flex items-center gap-1.5">
            <FaUser size={15} className="opacity-80" />
            <span className="">{topic.author_name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt size={15} className="opacity-80" />
            <span>{formatDateLocale(topic.created_at)}</span>
          </div>
        </div>

        <div className="flex gap-5 mt-2 text-gray-400 text-sm ">
          <div className="flex items-center gap-1.5">
            <FaEye size={13} />
            <span>{topic.views} переглядів</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaReply size={13} />
            <span>{commentsCount} відповідей</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="prose max-w-none text-gray-700 mb-6 text-lg">
          {renderContent(topic.content)}
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-4 ">
          <div className="flex items-center gap-2 w-full md:w-auto text-sm">
            <button
              onClick={onToggleLike}
              className={`flex items-center px-3 py-1.5 rounded-full transition-all duration-200 w-1/2 md:w-auto justify-center
        ${
          userLiked
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
              disabled={!isAuthenticated}
              title={
                !isAuthenticated ? "Увійдіть, щоб оцінити тему" : undefined
              }
            >
              <FaThumbsUp
                className={`mr-1.5 ${userLiked ? "text-amber-600" : ""}`}
                size={14}
              />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={onToggleBookmark}
              className={`flex items-center px-3 py-1.5 rounded-full transition-all duration-200 w-1/2 md:w-auto justify-center
        ${
          isBookmarked
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
              disabled={!isAuthenticated}
              title={
                !isAuthenticated
                  ? "Увійдіть, щоб додати до закладок"
                  : undefined
              }
            >
              <FaBookmark
                className={`mr-1.5 ${isBookmarked ? "text-blue-600" : ""}`}
                size={14}
              />
              <span>{isBookmarked ? "Збережено" : "Зберегти"}</span>
            </button>
          </div>

          <div className="w-full md:w-auto flex justify-center md:justify-end text-sm">
            <ShareButtons url={window.location.href} title={topic.title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicContent;
