import React from "react";
import { FaUser } from "react-icons/fa";
import { formatDateLocale } from "../../utils/dateUtils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyCodeButton from "../common/CopyCodeButton";

const renderContent = (content) => {
  if (!content || !content.includes("```")) {
    return <p className="whitespace-pre-line break-words">{content}</p>;
  }

  const parts = content.split("```");
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      const languageMatch = part.match(/^(\w+)\n/);
      const language = languageMatch ? languageMatch[1] : "javascript";
      const code = languageMatch ? part.replace(/^\w+\n/, "") : part;

      return (
        <div key={idx} className="relative my-4">
          <CopyCodeButton code={code.trim()} position="top-4 right-4" />
          <div className="w-full overflow-x-auto my-4">
            <div
              className="rounded-lg border-2 border-gray-200 bg-gray-50"
              style={{ padding: "20px 0 0 0", minWidth: 0, maxWidth: "100%" }}
            >
              <SyntaxHighlighter
                language={language}
                style={oneLight}
                customStyle={{
                  fontSize: "14px",
                  background: "transparent",
                  borderRadius: "6px",
                  margin: 0,
                  padding: "0 1.25rem 1rem 1.25rem",
                  minWidth: 0,
                  maxWidth: "100%",
                }}
                wrapLongLines={true}
                showLineNumbers={false}
                className="mb-0"
              >
                {code.trim()}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      );
    }
    return (
      <p key={idx} className="whitespace-pre-line break-words">
        {part}
      </p>
    );
  });
};

const CommentItem = ({ comment }) => (
  <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0 pt-5 first:pt-0">
    <div className="flex items-start min-w-0">
      {" "}
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <FaUser size={14} />
        </div>
      </div>
      <div className="flex-grow min-w-0">
        {" "}
        <div className="flex flex-wrap justify-between mb-1.5">
          <div className="text-gray-800 text-md">{comment.author_name}</div>
          <div className="text-sm text-gray-500">
            {formatDateLocale(comment.created_at)}
          </div>
        </div>
        <div className="text-gray-700 text-md">
          {renderContent(comment.content)}
        </div>
      </div>
    </div>

    {comment.replies && comment.replies.length > 0 && (
      <div className="mt-4 ml-11 pl-4 border-l-2 border-gray-100">
        {comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} />
        ))}
      </div>
    )}
  </div>
);

export default CommentItem;
