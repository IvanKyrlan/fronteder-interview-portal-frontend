import React from "react";
import { FaRegClock } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatDateLocale } from "../../utils/dateUtils";
import CopyCodeButton from "../common/CopyCodeButton";

export default function ArticleDetail({ article }) {
  if (!article) return null;

  const renderSection = (section, sectionIndex) => {
    if (!section.content && !section.image && !section.code) return null;

    return (
      <div key={`section-${section.id}`} className="mb-8">
        {section.title && (
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {section.title}
          </h2>
        )}

        {section.content && (
          <div
            className="prose max-w-none text-gray-700 mb-4 text-justify"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}

        {section.image && (
          <div className="mb-4">
            <div className="w-full overflow-hidden rounded-lg">
              <div className="relative w-full pt-[56.25%]">
                {" "}
                <img
                  src={section.image}
                  alt={section.image_caption || section.title || article.title}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out transform hover:scale-105 rounded-lg"
                />
              </div>
            </div>
            {section.image_caption && (
              <p className="text-sm text-gray-500 mt-1 italic">
                {section.image_caption}
              </p>
            )}
          </div>
        )}

        {section.code && (
          <div className="mb-4">
            {section.code_description && (
              <div
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: section.code_description }}
              />
            )}

            <div className="relative max-w-full">
              <CopyCodeButton code={section.code} />

              <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                <div
                  style={{
                    position: "relative",
                    maxWidth: "100%",
                    overflow: "visible",
                  }}
                >
                  <SyntaxHighlighter
                    language={section.language || "javascript"}
                    style={oneLight}
                    customStyle={{
                      fontSize: "14px",
                      borderRadius: "6px",
                      paddingTop: "40px",
                      maxWidth: "100%",
                      overflowX: "visible",
                    }}
                    wrapLongLines={true}
                    showLineNumbers={false}
                    className="mb-3 border-2 border-gray-200"
                  >
                    {section.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl lg:min-w-4xl md:max-w-xl mx-auto bg-white rounded-lg overflow-hidden">
      <div className="">
        {article.thumbnail ? (
          <div className="w-full overflow-hidden">
            <div className="relative w-full pt-[56.25%]">
              {" "}
              <img
                src={article.thumbnail}
                alt={article.title}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out transform hover:scale-105"
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full pt-[56.25%] bg-gray-100">
            {" "}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-lg">Зображення відсутнє</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-4">
          <span
            className={`text-sm font-semibold inline-block py-1 px-3 rounded ${
              article.article_type === "task"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {article.article_type_display}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          {article.title}
        </h1>

        <div className="flex items-center mb-6 text-gray-500 text-sm font-medium">
          <FaRegClock className="mr-1" />
          <span>{formatDateLocale(article.published_at)}</span>
        </div>

        <div
          className="text-md mb-8 text-gray-700 border-l-4 border-gray-200 pl-4 py-2 text-justify"
          dangerouslySetInnerHTML={{ __html: article.description }}
        />

        <div className="mb-8">
          {article.sections && article.sections.length > 0 ? (
            article.sections.map((section, index) =>
              renderSection(section, index)
            )
          ) : (
            <p>Немає вмісту для відображення</p>
          )}
        </div>

        {article.summary && (
          <div className="mt-8 pt-6 text-justify">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Підсумок</h2>
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.summary }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
