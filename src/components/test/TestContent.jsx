import React from "react";
import { FaCheck, FaTimes, FaRegClock, FaQuestionCircle } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function TestContent({
  questions,
  currentQuestionIndex,
  selectedAnswer,
  showResult,
  isCorrect,
  timeLeft,
  formatTime,
  onAnswerSelect,
  onNextQuestion,
}) {
  if (
    !questions ||
    questions.length === 0 ||
    !questions[currentQuestionIndex]
  ) {
    return (
      <div className="p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-gray-600">Завантаження питань...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const renderQuestionText = (text) => {
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
            language={language}
            style={atomDark}
            customStyle={{
              fontSize: "14px",
              borderRadius: "4px",
              margin: "10px 0",
              padding: "15px",
            }}
            key={index}
          >
            {code.trim()}
          </SyntaxHighlighter>
        );
      }
      return (
        <p className="whitespace-pre-line" key={index}>
          {part}
        </p>
      );
    });
  };

  const getAnswers = () => {
    if (!currentQuestion) return [];

    if (Array.isArray(currentQuestion.options)) {
      return currentQuestion.options.map((option) =>
        typeof option === "object" ? option.text : option
      );
    }

    if (Array.isArray(currentQuestion.answers)) {
      return currentQuestion.answers;
    }

    return [];
  };

  const answers = getAnswers();

  console.log("Current question structure:", currentQuestion);
  if (currentQuestion.correctAnswerId !== undefined) {
    console.log("Correct answer ID:", currentQuestion.correctAnswerId);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="bg-gray-100 rounded-lg p-4 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <div className="text-gray-800 flex items-center text-xl font-bold">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center mr-3">
              <FaQuestionCircle size={18} />
            </div>
            <div>
              Завдання{" "}
              <span className="text-amber-600">{currentQuestionIndex + 1}</span>
              <span className="mx-2">з</span>
              {questions.length}
            </div>

            {showResult && (
              <div
                className={`ml-4 flex items-center ${
                  isCorrect ? "text-green-500" : "text-red-500"
                }`}
              >
                {isCorrect ? (
                  <FaCheck className="mr-2" size={20} />
                ) : (
                  <FaTimes className="mr-2" size={20} />
                )}
                <span>{isCorrect ? "Правильно!" : "Неправильно!"}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center rounded-lg py-2 px-4">
          <FaRegClock className="text-amber-600 mr-2" size={18} />
          <div className="text-lg font-bold text-gray-800">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion && renderQuestionText(currentQuestion.question)}
        </div>

        {currentQuestion?.hint && (
          <div className="mt-2 bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-800 text-sm rounded">
            <div className="flex items-start">
              <FaQuestionCircle className="mr-2 mt-1 text-amber-600 flex-shrink-0" />
              <span>{currentQuestion.hint}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-10">
        {answers.map((answer, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedAnswer === index
                ? "border-gray-200 bg-gray-100"
                : "border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            <div className="flex items-center ">
              <div className="relative mr-4 w-6 h-6 flex-shrink-0">
                <input
                  type="radio"
                  checked={selectedAnswer === index}
                  onChange={() => onAnswerSelect(index)}
                  className="absolute opacity-0 w-6 h-6 cursor-pointer"
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedAnswer === index
                      ? "border-amber-600"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedAnswer === index && (
                    <div className="w-4 h-4 rounded-full bg-amber-600"></div>
                  )}
                </div>
              </div>
              <span className="whitespace-pre-line text-gray-800">
                {answer}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNextQuestion}
          disabled={selectedAnswer === null}
          className={`px-8 py-3 rounded-md text-white text-lg  transition-colors ${
            selectedAnswer === null
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700 "
          } flex items-center`}
        >
          {currentQuestionIndex < questions.length - 1
            ? "Наступне питання"
            : "Завершити тест"}
        </button>
      </div>
    </div>
  );
}
