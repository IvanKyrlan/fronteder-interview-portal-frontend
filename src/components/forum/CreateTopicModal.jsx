import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaPaperPlane,
  FaExclamationTriangle,
  FaCode,
  FaCheck,
  FaEye,
  FaPencilAlt,
} from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const CreateTopicModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData = null,
  isEditMode = false,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [previewMode, setPreviewMode] = useState(false);

  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const availableLanguages = [
    { id: "javascript", name: "JavaScript" },
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "python", name: "Python" },
    { id: "jsx", name: "React/JSX" },
    { id: "sql", name: "SQL" },
    { id: "bash", name: "Bash" },
    { id: "json", name: "JSON" },
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData && isEditMode) {
        setTitle(initialData.title || "");
        setContent(initialData.content || "");
        setCategory(initialData.category || "");
      } else {
        setTitle("");
        setContent("");

        if (categories && categories.length > 0) {
          const defaultCategory = categories[0];
          setCategory(defaultCategory?.id || "");
        }
      }

      setErrors({});
      setShowCodeEditor(false);
      setCode("");
      setCodeLanguage("javascript");
      setPreviewMode(false);
    }
  }, [isOpen, categories, initialData, isEditMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Заголовок теми обов'язковий";
    else if (title.length < 5)
      newErrors.title = "Заголовок повинен містити щонайменше 5 символів";
    else if (title.length > 100)
      newErrors.title = "Заголовок не повинен перевищувати 100 символів";

    if (!content.trim()) newErrors.content = "Вміст теми обов'язковий";
    else if (content.length < 10)
      newErrors.content = "Вміст повинен містити щонайменше 10 символів";

    if (!category) newErrors.category = "Виберіть категорію";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const insertCodeBlock = () => {
    if (!code.trim()) return;

    const codeBlock = `\n\`\`\`${codeLanguage}\n${code.trim()}\n\`\`\`\n`;
    const newContent = content + codeBlock;

    setContent(newContent);
    setShowCodeEditor(false);
    setCode("");

    if (contentRef.current) {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(
        newContent.length,
        newContent.length
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const hasCode = content.includes("```");

    const topicData = {
      title,
      content,
      category,
      has_code: hasCode,
    };

    if (isEditMode && initialData?.id) {
      topicData.id = initialData.id;
    }

    try {
      await onSubmit(topicData);
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Помилка при " + (isEditMode ? "оновленні" : "створенні") + " теми";
      setErrors({ submit: errorMessage });
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
          <SyntaxHighlighter
            key={index}
            language={language}
            style={oneLight}
            customStyle={{
              marginTop: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        );
      }
      return (
        <p key={index} className="whitespace-pre-line">
          {part}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Редагування теми" : "Створення нової теми"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Закрити"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div
          className="p-5 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700  mb-2 text-md"
              >
                Заголовок теми <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } text-md`}
                placeholder="Введіть заголовок теми"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-500 text-md mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" size={10} />{" "}
                  {errors.title}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700  mb-2 text-md"
              >
                Категорія <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors placeholder-gray-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } text-md`}
                disabled={isSubmitting}
              >
                <option value="" disabled>
                  Виберіть категорію
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-md mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" size={10} />{" "}
                  {errors.category}
                </p>
              )}
            </div>

            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="content"
                  className="block text-gray-700  text-md"
                >
                  Вміст теми <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center space-x-2  text-sm">
                  <button
                    type="button"
                    onClick={() => setShowCodeEditor(true)}
                    className="flex items-center text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                    disabled={isSubmitting}
                  >
                    <FaCode className="mr-1" size={18} />
                    Додати код
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center text-md px-2 py-1 rounded ${
                      previewMode
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    } transition-colors`}
                    disabled={isSubmitting}
                  >
                    {previewMode ? (
                      <>
                        <FaPencilAlt className="mr-1" size={18} />
                        Редагувати
                      </>
                    ) : (
                      <>
                        <FaEye className="mr-1" size={18} />
                        Перегляд
                      </>
                    )}
                  </button>
                </div>
              </div>

              {previewMode ? (
                <div className="border border-gray-200 rounded-md p-4 min-h-[300px] overflow-auto bg-white">
                  <div className="prose max-w-none text-md">
                    {renderContent(content)}
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    id="content"
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500 ${
                      errors.content ? "border-red-500" : "border-gray-300"
                    } `}
                    rows="12"
                    placeholder="Опишіть вашу тему детально. Використовуйте кнопку 'Додати код' для вставки блоку коду."
                    disabled={isSubmitting}
                  ></textarea>
                </>
              )}

              {errors.content && (
                <p className="text-red-500 text-md mt-1 flex items-center">
                  <FaExclamationTriangle className="mr-1" size={10} />{" "}
                  {errors.content}
                </p>
              )}
            </div>

            {showCodeEditor && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden p-5">
                  <h3 className="text-lg  text-gray-800 mb-3">
                    Додавання блоку коду
                  </h3>

                  <div className="mb-3">
                    <label
                      htmlFor="codeLanguage"
                      className="block text-gray-700 text-md  mb-1"
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
                      className="block text-gray-700 text-md  mb-1"
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

                  <div className="flex justify-end space-x-3 ">
                    <button
                      type="button"
                      onClick={() => setShowCodeEditor(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-md"
                    >
                      Скасувати
                    </button>
                    <button
                      type="button"
                      onClick={insertCodeBlock}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-200 flex items-center text-md"
                    >
                      <FaCheck className="mr-1.5" size={12} />
                      Вставити код
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end ">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-md mr-3 hover:bg-gray-50 transition-colors text-md"
                disabled={isSubmitting}
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed text-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                    {isEditMode ? "Оновлення..." : "Створення..."}
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" size={12} />
                    {isEditMode ? "Оновити тему" : "Створити тему"}
                  </>
                )}
              </button>
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-md">
                <FaExclamationTriangle
                  className="inline-block mr-2"
                  size={12}
                />
                {errors.submit}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTopicModal;
