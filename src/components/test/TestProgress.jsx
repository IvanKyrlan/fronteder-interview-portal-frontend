import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaTrophy, FaStar } from "react-icons/fa";
import testService from "../../services/testService";

export default function TestProgress({ userProgress }) {
  const [expandedTests, setExpandedTests] = useState({});
  const [testAttempts, setTestAttempts] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();

  const toggleTestDetails = (testId) => {
    setExpandedTests((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));

    if (!expandedTests[testId]) {
      loadTestAttempts(testId);
    }
  };

  const loadTestAttempts = async (testId) => {
    setLoadingStates((prev) => ({ ...prev, [testId]: true }));

    try {
      const attempts = await testService.getTestAttempts(testId);
      setTestAttempts((prev) => ({
        ...prev,
        [testId]: attempts,
      }));
    } catch (error) {
      console.error(`Failed to load attempts for test ${testId}:`, error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [testId]: false }));
    }
  };

  const handleGoToTest = (testId) => {
    navigate(`/tests/${testId}`);
  };

  const findBestScore = (attempts, currentScore) => {
    if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
      return null;
    }

    const numericScores = attempts.map((a) => Number(a.score));
    const validScores = numericScores.filter((score) => !isNaN(score));

    if (validScores.length === 0) {
      return null;
    }

    const maxScore = Math.max(...validScores);

    if (maxScore === Number(currentScore)) {
      return null;
    }

    return maxScore;
  };

  const shouldShowBestScore = (item, bestScore) => {
    const numericBestScore = Number(bestScore);
    const numericCurrentScore = Number(item.score);

    const hasMultipleAttempts = item.attempts > 1;
    const isBestScoreBetter = numericBestScore > numericCurrentScore;

    return (
      bestScore !== null &&
      !isNaN(numericBestScore) &&
      numericBestScore !== numericCurrentScore &&
      (hasMultipleAttempts || isBestScoreBetter)
    );
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-green-400 to-green-500";
    if (score >= 60) return "bg-gradient-to-r from-amber-400 to-amber-500";
    if (score >= 40) return "bg-gradient-to-r from-orange-400 to-orange-500";
    return "bg-gradient-to-r from-red-400 to-red-500";
  };

  if (userProgress.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-gray-600 mb-5 text-lg">
          Ви ще не проходили тести. Пройдіть свій перший тест, щоб побачити
          прогрес!
        </p>
        <button
          onClick={() => navigate("/tests")}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-all shadow-md font-medium"
        >
          Перейти до тестів
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {userProgress
        .sort((a, b) => b.score - a.score)
        .map((item) => {
          const testAttemptsData =
            testAttempts[item.test_id] || item.last_attempts || [];
          const isExpanded = expandedTests[item.test_id] || false;
          const bestScore = findBestScore(testAttemptsData, item.score);
          const showBestScore = shouldShowBestScore(item, bestScore);
          const isLoading = loadingStates[item.test_id] || false;

          return (
            <div
              key={item.id}
              className="rounded-xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <div
                className="p-5 cursor-pointer transition-colors"
                onClick={() => toggleTestDetails(item.test_id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-xl text-gray-800 flex items-center">
                    {item.score >= 80 && (
                      <FaTrophy className="text-amber-400 mr-2" />
                    )}
                    {item.test_title}
                  </h3>

                  <div
                    className={`px-4 py-1 rounded-full text-base font-medium ${
                      item.score >= 80
                        ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700"
                        : item.score >= 60
                        ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700"
                        : "bg-gradient-to-r from-red-50 to-red-100 text-red-700"
                    }`}
                  >
                    {item.score}%
                  </div>
                </div>

                <div className="w-full bg-gray-100 h-3 rounded-md mb-4 overflow-hidden">
                  <div
                    className={`h-3 rounded-md ${getProgressColor(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    {showBestScore && (
                      <div className="text-green-600 font-medium">
                        <FaStar className="inline mr-1 text-amber-400" />
                        Найкращий: {bestScore}%
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-md bg-amber-50 text-amber-600 font-medium hover:bg-amber-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoToTest(item.test_id);
                      }}
                    >
                      Пройти тест
                    </button>
                    <div className="text-amber-500 bg-amber-50 rounded-md p-2 transition-transform duration-200">
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <h4 className="text-lg font-medium mb-4 text-gray-700">
                    Історія спроб ({item.attempts})
                  </h4>

                  {isLoading ? (
                    <div className="text-center py-6">
                      <div className="inline-block animate-spin rounded-md h-8 w-8 border-b-2 border-amber-600 mb-2"></div>
                      <p className="text-gray-500">Завантаження...</p>
                    </div>
                  ) : !testAttemptsData || testAttemptsData.length === 0 ? (
                    <div className="text-gray-500 py-4 text-center bg-white rounded-lg">
                      Дані про попередні спроби відсутні
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg shadow-sm">
                      <table className="min-w-full">
                        <thead className="bg-gray-100 text-gray-600">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium">
                              Дата
                            </th>
                            <th className="py-3 px-4 text-center font-medium">
                              Результат
                            </th>
                            <th className="py-3 px-4 text-center font-medium">
                              Відповіді
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {testAttemptsData.map((attempt) => (
                            <tr key={attempt.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-700">
                                {attempt.completed_at}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block rounded-full px-3 py-1 ${
                                    attempt.score >= 80
                                      ? "bg-green-100 text-green-700"
                                      : attempt.score >= 50
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {attempt.score}%
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="text-gray-700 font-medium">
                                  {attempt.correct_answers}/
                                  {attempt.total_questions}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
