import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaRedo,
  FaList,
  FaChevronRight,
  FaAward,
  FaExclamationCircle,
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function TestResultContent({
  testScore,
  testTotal,
  onRetakeTest,
  onBackToTests,
  questions,
  userAnswers,
}) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    console.log('TestResultContent - Questions:', questions);
    console.log('TestResultContent - User Answers:', userAnswers);
  }, [questions, userAnswers]);

  useEffect(() => {
    if (questions && userAnswers && questions.length > 0) {
      setPercentage(Math.round((testScore / testTotal) * 100));
    }
  }, [testScore, testTotal, questions, userAnswers]);

  const isPassed = percentage >= 80;

  const toggleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const renderQuestionText = (text) => {
    if (!text || !text.includes('```')) {
      return <p className="whitespace-pre-line">{text}</p>;
    }

    const parts = text.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const languageMatch = part.match(/^(\w+)\n/);
        const language = languageMatch ? languageMatch[1] : 'javascript';
        const code = languageMatch ? part.replace(/^\w+\n/, '') : part;

        return (
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            customStyle={{
              fontSize: '16px',
              borderRadius: '8px',
              margin: '16px 0',
              padding: '16px',
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

  if (!questions || !userAnswers || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FaExclamationCircle className="text-amber-500 text-4xl mx-auto mb-4" />
        <div className="text-lg text-gray-800 mb-6">
          Немає даних для відображення результатів. Можливо, ви ще не пройшли
          тест.
        </div>
        <button
          onClick={onBackToTests}
          className="px-6 py-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white  shadow-md "
        >
          До списку тестів
        </button>
      </div>
    );
  }

  const getAnswersForQuestion = (question) => {
    if (question.answers && Array.isArray(question.answers)) {
      return question.answers;
    }
    if (question.options && Array.isArray(question.options)) {
      return question.options.map((option) =>
        typeof option === 'object' ? option.text : option
      );
    }
    return [];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-8 text-center">
        <div className="bg-gray-50 rounded-xl mb-8 max-w-2xl mx-auto p-6">
          <div className="mb-4 relative p-4">
            <div className="w-36 h-36 rounded-full flex items-center justify-center mx-auto mb-2 border-8 border-gray-100">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl
                  ${isPassed ? 'bg-green-500' : 'bg-amber-600'}`}
              >
                {percentage}%
              </div>
            </div>

            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4">
              {isPassed ? (
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <FaAward className="text-green-500 text-3xl" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                  <FaExclamationCircle className="text-amber-500 text-3xl" />
                </div>
              )}
            </div>
          </div>

          <div className="text-6xl font-bold mb-4">
            <span className={isPassed ? 'text-green-500' : 'text-amber-600'}>
              {testScore}
            </span>
            <span className="text-gray-300">/{testTotal}</span>
          </div>

          <div className="text-xl mb-4">
            {isPassed ? (
              <div className="text-green-600 ">Тест пройдено!</div>
            ) : (
              <div className="text-amber-600 ">Спробуйте ще раз</div>
            )}
          </div>

          <p className="text-gray-600 mb-4 ">
            {isPassed
              ? 'Вітаємо з успішним проходженням тесту! Ви продемонстрували хороші знання з теми.'
              : 'Не засмучуйтесь! Кожна спроба - це крок до покращення ваших знань.'}
          </p>
        </div>

        <div className="mb-10 max-w-2xl mx-auto bg-blue-50 rounded-lg p-6 border border-blue-100 ">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Що далі?</h3>
          <ul className="space-y-3 text-gray-700 text-left">
            <li className="flex items-start">
              <FaChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <span>
                Ви можете пройти цей тест знову, щоб покращити свій результат
              </span>
            </li>
            <li className="flex items-start">
              <FaChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <span>Спробуйте інші тести для розширення своїх знань</span>
            </li>
            <li className="flex items-start">
              <FaChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <span>Вивчіть додаткові матеріали з цієї теми</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onRetakeTest}
            className="px-6 py-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white  shadow-md  flex items-center"
          >
            <FaRedo className="mr-2" />
            Пройти ще раз
          </button>
          <button
            onClick={onBackToTests}
            className="px-6 py-3 rounded-md bg-gray-600 hover:bg-gray-700 text-white  shadow-md  flex items-center"
          >
            <FaList className="mr-2" />
            До списку тестів
          </button>
          <button
            onClick={toggleShowAnswers}
            className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white  shadow-md  flex items-center"
          >
            {showAnswers ? (
              <>
                <FaEyeSlash className="mr-2" />
                Сховати відповіді
              </>
            ) : (
              <>
                <FaEye className="mr-2" />
                Показати відповіді
              </>
            )}
          </button>
        </div>
      </div>

      {showAnswers && (
        <div>
          <h3 className="text-2xl font-bold mb-6 text-gray-800 pb-3">
            Відповіді на запитання
          </h3>
          <div className="space-y-8">
            {questions.map((question, qIndex) => {
              const userAnswer = userAnswers[qIndex];
              const correctAnswerIndex = question.correctAnswerId;
              const isUserAnswerCorrect = userAnswer === correctAnswerIndex;
              const answers = getAnswersForQuestion(question);

              console.log(`Question ${qIndex}:`, question);
              console.log(
                `User answer: ${userAnswer}, Correct answer: ${correctAnswerIndex}`
              );

              const questionText =
                question.question || question.text || 'Питання недоступне';

              return (
                <div
                  key={qIndex}
                  className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div
                    className={`p-4 flex items-center border-l-4 ${
                      isUserAnswerCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <div className="text-lg font-semibold text-gray-800 mr-3">
                      Завдання {qIndex + 1}
                    </div>
                    <div
                      className={`flex items-center ${
                        isUserAnswerCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isUserAnswerCorrect ? (
                        <FaCheck className="mr-2" size={18} />
                      ) : (
                        <FaTimes className="mr-2" size={18} />
                      )}
                      <span className="">
                        {isUserAnswerCorrect ? 'Правильно!' : 'Неправильно!'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 text-lg text-gray-800 ">
                      {renderQuestionText(questionText)}
                    </div>

                    {answers && answers.length > 0 ? (
                      <div className="space-y-3">
                        {answers.map((answer, aIndex) => {
                          const isUserChoice = aIndex === userAnswer;

                          const isCorrectAnswer = aIndex === correctAnswerIndex;

                          return (
                            <div
                              key={aIndex}
                              className={`p-4 border-2 rounded-md ${
                                isCorrectAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : isUserChoice && !isCorrectAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center ">
                                <div className="relative mr-4 w-6 h-6 flex-shrink-0">
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 ${
                                      isUserChoice
                                        ? isCorrectAnswer
                                          ? 'border-green-500'
                                          : 'border-red-500'
                                        : isCorrectAnswer
                                        ? 'border-green-500'
                                        : 'border-gray-300'
                                    } flex items-center justify-center`}
                                  >
                                    {isUserChoice && (
                                      <div
                                        className={`w-4 h-4 rounded-full ${
                                          isCorrectAnswer
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                        }`}
                                      ></div>
                                    )}
                                    {!isUserChoice && isCorrectAnswer && (
                                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                    )}
                                  </div>
                                </div>
                                <span className="whitespace-pre-line text-gray-800">
                                  {answer}
                                </span>
                                {isCorrectAnswer && !isUserChoice && (
                                  <span className="ml-3 text-green-600  text-sm">
                                    (Правильна відповідь)
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-red-500 bg-red-50 p-4 rounded-md">
                        Відповіді недоступні для цього питання
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onRetakeTest}
              className="px-8 py-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white  shadow-md "
            >
              Спробувати ще раз
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
