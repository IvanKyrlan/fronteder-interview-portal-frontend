import React, { useState, useRef } from "react";
import { FaReply, FaCode, FaCheck, FaEye, FaPencilAlt } from "react-icons/fa";

const CommentEditor = ({
  value,
  onChange,
  onSubmit,
  isSubmitting = false,
  placeholder = "Введіть ваш коментар...",
  submitLabel = "Відповісти",
}) => {
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [previewMode, setPreviewMode] = useState(false);

  const textareaRef = useRef(null);

  const availableLanguages = [
    { id: "javascript", name: "JavaScript" },
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "python", name: "Python" },
    { id: "jsx", name: "React/JSX" },
    { id: "sql", name: "SQL" },
    // { id: "bash", name: "Bash" },
    { id: "json", name: "JSON" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const insertCode = () => {
    if (!code.trim()) return;

    const codeBlock = `\n\`\`\`${codeLanguage}\n${code.trim()}\n\`\`\`\n`;
    const newText = value + codeBlock;

    onChange(newText);
    setShowCodeEditor(false);
    setCode("");

    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newText.length, newText.length);
    }
  };

  const renderContent = (text) => {
    if (!text || !text.includes("```")) {
      return <p className="whitespace-pre-line">{text}</p>;
    }

    const parts = text.split("```");
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const languageMatch = part.match(/^(\w+)\n/);
        const language = languageMatch ? languageMatch[1] : "javascript";
        const code = languageMatch ? part.replace(/^\w+\n/, "") : part;

        return (
          <div
            key={index}
            className="my-3 bg-gray-800 rounded-md p-3 text-white font-mono text-md overflow-auto"
          >
            <div className="mb-1.5 text-gray-400 text-xs">{language}</div>
            <pre>{code.trim()}</pre>
          </div>
        );
      }
      return (
        <p key={index} className="whitespace-pre-line">
          {part}
        </p>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="flex justify-end mb-2 font-medium text-sm">
          <button
            type="button"
            onClick={() => setShowCodeEditor(true)}
            className="mr-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            disabled={isSubmitting}
          >
            <FaCode className="mr-1.5" size={14} />
            Додати код
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center px-3 py-1 rounded ${
              previewMode
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            } transition-colors`}
            title={
              previewMode
                ? "Перемкнутись до режиму редагування"
                : "Перемкнутись до режиму перегляду"
            }
          >
            {previewMode ? (
              <>
                <FaPencilAlt className="mr-1" size={14} />
                Редагувати
              </>
            ) : (
              <>
                <FaEye className="mr-1" size={14} />
                Перегляд
              </>
            )}
          </button>
        </div>

        {previewMode ? (
          <div className="border border-gray-200 rounded-lg p-4 min-h-[150px] overflow-auto bg-white text-md">
            <div className="prose max-w-none">{renderContent(value)}</div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500"
            rows="4"
            placeholder={placeholder}
            disabled={isSubmitting}
          ></textarea>
        )}
      </div>

      <div className="flex items-center mb-4">
        <div className="flex-grow"></div>

        <button
          type="submit"
          disabled={isSubmitting || !value.trim()}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-md font-medium"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
              Відправка...
            </>
          ) : (
            <>
              <FaReply className="mr-2" size={12} />
              {submitLabel}
            </>
          )}
        </button>
      </div>

      {showCodeEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden p-5">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Додавання блоку коду
            </h3>

            <div className="mb-3">
              <label
                htmlFor="codeLanguage"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Мова програмування
              </label>
              <select
                id="codeLanguage"
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="codeContent"
                className="block text-gray-700 text-md font-medium mb-1"
              >
                Код
              </label>
              <textarea
                id="codeContent"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500 font-mono"
                rows="10"
                placeholder="Введіть ваш код тут..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 font-medium">
              <button
                type="button"
                onClick={() => setShowCodeEditor(false)}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-md"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={insertCode}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-200 flex items-center text-md"
              >
                <FaCheck className="mr-1.5" size={12} />
                Вставити код
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CommentEditor;
