import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronDown,
  FaChevronUp,
  FaCode,
  FaCheckCircle,
} from 'react-icons/fa';
import taskService from '../../services/taskService';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function TaskProgress({ taskProgress, userProgress }) {
  const [expandedTests, setExpandedTests] = useState({});
  const [taskAttempts, setTaskAttempts] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const navigate = useNavigate();

  const toggleTestDetails = (testId) => {
    setExpandedTests((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));

    if (!expandedTests[testId]) {
      loadTaskAttempts(testId);
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const loadTaskAttempts = async (testId) => {
    setLoadingStates((prev) => ({ ...prev, [testId]: true }));

    try {
      const attempts = await taskService.getTaskAttempts(testId);
      setTaskAttempts((prev) => ({
        ...prev,
        [testId]: attempts,
      }));
    } catch (error) {
      console.error(`Failed to load task attempts for test ${testId}:`, error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [testId]: false }));
    }
  };

  const handleGoToTasks = (testId) => {
    navigate(`/tests/${testId}/tasks`);
  };

  const getTestTitle = (testId) => {
    if (!testId) return 'Невідомий тест';

    const taskProg = taskProgress.find(
      (t) => t.test === testId || t.test_id === testId
    );
    if (taskProg && taskProg.test_title) return taskProg.test_title;

    const userProg = userProgress
      ? userProgress.find((t) => t.test_id === testId)
      : null;
    if (userProg) return userProg.test_title;

    return 'Невідомий тест';
  };

  const getLanguageFromTest = (test) => {
    if (!test) return 'javascript';

    const title = test.toLowerCase();

    if (title.includes('html')) return 'html';
    if (title.includes('css')) return 'css';
    if (title.includes('javascript') || title.includes('js'))
      return 'javascript';
    if (title.includes('react')) return 'javascript';
    if (title.includes('sql') || title.includes('база даних')) return 'sql';
    if (title.includes('python') || title.includes('django')) return 'python';

    return 'javascript';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (percentage >= 60) return 'bg-gradient-to-r from-amber-400 to-amber-500';
    if (percentage >= 40)
      return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  if (!taskProgress || taskProgress.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-gray-600 mb-5 text-lg">
          Ви ще не виконували практичні завдання. Почніть з вирішення першого
          завдання, щоб бачити свій прогрес!
        </p>
        <button
          onClick={() => navigate('/tests')}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-all shadow-md "
        >
          Перейти до завдань
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {taskProgress
        .sort((a, b) => {
          const completionA = (a.completed_tasks / a.total_tasks) * 100;
          const completionB = (b.completed_tasks / b.total_tasks) * 100;
          return completionB - completionA;
        })
        .map((taskProg) => {
          const isExpanded = expandedTests[taskProg.test] || false;
          const currentTaskAttempts = taskAttempts[taskProg.test] || [];
          const testTitle = getTestTitle(taskProg.test);
          const isLoading = loadingStates[taskProg.test] || false;

          const completionPercentage =
            taskProg.completion_percentage ||
            (taskProg.total_tasks > 0
              ? Math.round(
                  (taskProg.completed_tasks / taskProg.total_tasks) * 100
                )
              : 0);

          return (
            <div
              key={`task-prog-${taskProg.id}`}
              className="rounded-xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              <div
                className="p-5 cursor-pointer "
                onClick={() => toggleTestDetails(taskProg.test)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-xl text-gray-800">
                    {completionPercentage >= 80 && (
                      <FaCheckCircle className="text-green-500 inline mr-2" />
                    )}
                    {testTitle}
                  </h3>

                  <div
                    className={`px-4 py-1 rounded-full text-base  ${
                      completionPercentage >= 80
                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700'
                        : completionPercentage >= 60
                        ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700'
                    }`}
                  >
                    {completionPercentage}%
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 ">
                      {taskProg.completed_tasks} / {taskProg.total_tasks}{' '}
                      завдань виконано
                    </span>
                  </div>
                  <div className="bg-gray-100 w-full h-3 rounded-md overflow-hidden">
                    <div
                      className={`${getProgressColor(
                        completionPercentage
                      )} h-3 rounded-md`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-end items-center">
                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-md bg-amber-50 text-amber-600  hover:bg-amber-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoToTasks(taskProg.test);
                      }}
                    >
                      Перейти до завдань
                    </button>
                    <div className="text-amber-500 bg-amber-50 rounded-md p-2 transition-transform duration-200">
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 p-5 bg-gray-50">
                  <h4 className="text-lg  mb-4 text-gray-700">
                    Історія виконання завдань
                  </h4>

                  {isLoading ? (
                    <div className="text-center py-6">
                      <div className="inline-block animate-spin rounded-md h-8 w-8 border-b-2 border-amber-600 mb-2"></div>
                      <p className="text-gray-500">Завантаження...</p>
                    </div>
                  ) : !currentTaskAttempts ||
                    currentTaskAttempts.length === 0 ? (
                    <div className="text-gray-500 py-4 text-center bg-white rounded-lg">
                      Дані про спроби завдань відсутні
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[...new Set(currentTaskAttempts.map((a) => a.task))].map(
                        (taskId) => {
                          const taskAttemptsList = currentTaskAttempts.filter(
                            (a) => a.task === taskId
                          );
                          const latestAttempt = taskAttemptsList[0];
                          const isTaskExpanded = expandedTasks[taskId] || false;
                          const language = getLanguageFromTest(
                            latestAttempt.test_title || testTitle
                          );

                          return (
                            <div
                              key={taskId}
                              className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md`}
                            >
                              <div
                                className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 ${
                                  latestAttempt.is_correct
                                    ? 'bg-gradient-to-r from-green-50 to-green-100'
                                    : ''
                                }`}
                                onClick={() => toggleTaskDetails(taskId)}
                              >
                                <div>
                                  <span
                                    className={` text-lg ${
                                      latestAttempt.is_correct
                                        ? 'text-green-700'
                                        : 'text-gray-800'
                                    }`}
                                  >
                                    {latestAttempt.task_title}
                                  </span>
                                  <div
                                    className={`mt-1 ${
                                      latestAttempt.is_correct
                                        ? 'text-green-600'
                                        : 'text-amber-600'
                                    } `}
                                  >
                                    {latestAttempt.is_correct
                                      ? 'Виконано успішно'
                                      : 'Потребує доопрацювання'}
                                  </div>
                                </div>
                                <div
                                  className={
                                    latestAttempt.is_correct
                                      ? 'text-green-500'
                                      : 'text-amber-500'
                                  }
                                >
                                  {isTaskExpanded ? (
                                    <FaChevronUp />
                                  ) : (
                                    <FaChevronDown />
                                  )}
                                </div>
                              </div>

                              {isTaskExpanded && (
                                <div className="border-t border-gray-100 p-4">
                                  {latestAttempt.submitted_code && (
                                    <div className="mb-5">
                                      <h5 className="text-base  mb-3 text-gray-700">
                                        <FaCode className="inline mr-2 text-amber-600" />
                                        Ваш код:
                                      </h5>
                                      <div className="rounded-lg overflow-hidden shadow-sm">
                                        <SyntaxHighlighter
                                          language={language}
                                          style={atomDark}
                                          customStyle={{
                                            fontSize: '16px',
                                            height: 'auto',
                                            margin: 0,
                                            borderRadius: '0.5rem',
                                          }}
                                        >
                                          {latestAttempt.submitted_code ||
                                            '// Немає коду'}
                                        </SyntaxHighlighter>
                                      </div>
                                    </div>
                                  )}

                                  <div className="text-right">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleGoToTasks(taskProg.test);
                                      }}
                                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm "
                                    >
                                      {latestAttempt.is_correct
                                        ? 'Переглянути завдання'
                                        : 'Спробувати знову'}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
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
