import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaFilter,
  FaExchangeAlt,
  FaAward,
  FaCode,
  FaRedo,
  FaList,
  FaChevronRight,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaRegFileCode,
} from "react-icons/fa";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export default function TaskResultContent({
  completedTasks,
  totalTasks,
  onRetakeTasks,
  onBackToTests,
  tasks,
  userSolutions,
  testType,
}) {
  const [showSolutions, setShowSolutions] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [filter, setFilter] = useState("all");
  const [activeSolutionIndexes, setActiveSolutionIndexes] = useState({});

  useEffect(() => {
    if (totalTasks > 0) {
      const calculatedPercentage = Math.round(
        (completedTasks / totalTasks) * 100
      );
      console.log(
        `Calculating percentage: ${completedTasks}/${totalTasks} = ${calculatedPercentage}%`
      );
      setPercentage(calculatedPercentage);
    }
  }, [completedTasks, totalTasks]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const indexes = {};

      tasks.forEach((task, idx) => {
        if (task.solutions && task.solutions.length > 0) {
          const primaryIndex = task.solutions.findIndex(
            (s) => s.is_primary === true
          );
          indexes[idx] = primaryIndex >= 0 ? primaryIndex : 0;
        } else {
          indexes[idx] = 0;
        }
      });

      setActiveSolutionIndexes(indexes);
    }
  }, [tasks]);

  const normalizeNewlines = (inputCode) => {
    if (!inputCode) return "";
    return inputCode
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
  };

  const isPassed = percentage >= 80;

  const getEditorLanguage = (code) => {
    if (testType) {
      const testTypeLower = testType.toLowerCase();

      if (testTypeLower.includes("html")) {
        return html();
      } else if (testTypeLower.includes("css")) {
        return css();
      } else if (
        testTypeLower.includes("javascript") ||
        testTypeLower.includes("js") ||
        testTypeLower.includes("react")
      ) {
        return javascript();
      } else if (testTypeLower.includes("sql")) {
        return sql();
      } else if (
        testTypeLower.includes("python") ||
        testTypeLower.includes("django")
      ) {
        return python();
      }
    }

    if (!code) return javascript();

    if (code.includes("<html") || code.includes("<!DOCTYPE")) {
      return html();
    } else if (
      code.includes("{") &&
      code.includes(":") &&
      !code.includes("function") &&
      !code.includes("def ")
    ) {
      return css();
    } else if (
      code.includes("def ") ||
      code.includes("import ") ||
      (code.includes("class ") && code.includes(":"))
    ) {
      return python();
    } else if (
      code.toUpperCase().includes("SELECT ") ||
      code.toUpperCase().includes("CREATE TABLE")
    ) {
      return sql();
    } else {
      return javascript();
    }
  };

  const cycleToNextSolution = (taskIndex) => {
    const task = tasks[taskIndex];
    if (!task?.solutions || task.solutions.length <= 1) return;

    const solutionsCount = task.solutions.length;
    const currentIndex = activeSolutionIndexes[taskIndex] || 0;
    const nextIndex = (currentIndex + 1) % solutionsCount;

    setActiveSolutionIndexes({
      ...activeSolutionIndexes,
      [taskIndex]: nextIndex,
    });
  };

  const getActiveSolution = (taskIndex) => {
    const task = tasks[taskIndex];
    if (!task) {
      return null;
    }

    if (
      !task.solutions ||
      !Array.isArray(task.solutions) ||
      task.solutions.length === 0
    ) {
      if (task.solution) {
        return task.solution;
      }
      return null;
    }

    const activeIndex = activeSolutionIndexes[taskIndex] || 0;
    return task.solutions[activeIndex];
  };

  const filteredTasks = tasks.filter((task, index) => {
    const userSolution = userSolutions[index];

    if (filter === "completed") {
      return userSolution && userSolution.is_correct === true;
    }

    if (filter === "incomplete") {
      return !userSolution || userSolution.is_correct !== true;
    }

    return true;
  });

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg  p-8 text-center">
        <FaExclamationCircle className="text-amber-500 text-4xl mx-auto mb-4" />
        <div className="text-lg text-gray-800 mb-6">
          Немає даних для відображення результатів практичних завдань.
        </div>
        <button
          onClick={onBackToTests}
          className="px-6 py-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium  transition-colors"
        >
          До списку тестів
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-8 text-center">
        <div className="bg-gray-50 rounded-xl mb-8 max-w-2xl mx-auto p-6">
          <div className="mb-4 relative p-4">
            <div className="w-36 h-36 rounded-full flex items-center justify-center mx-auto mb-2 border-8 border-gray-100">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl
                  ${isPassed ? "bg-green-500" : "bg-amber-600"}`}
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
                  <FaCode className="text-amber-500 text-3xl" />
                </div>
              )}
            </div>
          </div>

          <div className="text-6xl font-bold mb-4">
            <span className={isPassed ? "text-green-500" : "text-amber-600"}>
              {completedTasks}
            </span>
            <span className="text-gray-300">/{totalTasks}</span>
          </div>

          <div className="text-xl mb-2 font-medium">
            <span
              className={`font-bold ${
                isPassed ? "text-green-500" : "text-amber-600"
              }`}
            >
              {percentage}%
            </span>{" "}
            - {isPassed ? "Відмінний результат!" : "Є над чим попрацювати"}
          </div>

          <p className="text-gray-600 mb-4 font-medium">
            {isPassed
              ? "Вітаємо! Ви успішно виконали більшість практичних завдань. Продовжуйте вдосконалювати свої навички!"
              : "Практика - шлях до досконалості. Спробуйте повторити завдання, які викликали труднощі."}
          </p>
        </div>

        <div className="mb-10 max-w-2xl mx-auto bg-blue-50 rounded-lg p-6 border border-blue-100 font-medium">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Що далі?</h3>
          <ul className="space-y-3 text-gray-700 text-left">
            <li className="flex items-start">
              <FaChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <span>
                Перегляньте рішення завдань, які викликали у вас труднощі
              </span>
            </li>
            <li className="flex items-start">
              <FaChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <span>
                Спробуйте виконати завдання ще раз для закріплення навичок
              </span>
            </li>
            <li className="flex items-start">
              <FaChevronRight className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <span>
                Перейдіть до теоретичного тесту, щоб перевірити свої знання
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center space-x-4 mb-8">
          <button
            onClick={onRetakeTasks}
            className="px-6 py-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors flex items-center"
          >
            <FaRedo className="mr-2" />
            Почати знову
          </button>

          <button
            onClick={onBackToTests}
            className="px-6 py-3 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-medium  transition-colors flex items-center"
          >
            <FaList className="mr-2" />
            Пройти тест
          </button>

          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium  transition-colors flex items-center"
          >
            {showSolutions ? (
              <>
                <FaEyeSlash className="mr-2" />
                Сховати рішення
              </>
            ) : (
              <>
                <FaEye className="mr-2" />
                Показати рішення
              </>
            )}
          </button>
        </div>
      </div>

      {showSolutions && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Рішення завдань
            </h3>
            <div className="flex space-x-2 font-medium">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md flex items-center ${
                  filter === "all"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaFilter className="mr-1" size={12} /> Всі
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-md flex items-center ${
                  filter === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaCheck className="mr-1" size={12} /> Виконані
              </button>
              <button
                onClick={() => setFilter("incomplete")}
                className={`px-3 py-1 rounded-md flex items-center ${
                  filter === "incomplete"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaTimes className="mr-1" size={12} /> Невиконані
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {filteredTasks.map((task, index) => {
              const taskIndex = tasks.indexOf(task);

              const userSolution = userSolutions[taskIndex];
              const isCorrect =
                userSolution && userSolution.is_correct === true;

              const activeSolution = getActiveSolution(taskIndex);

              const hasMutlipleSolutions =
                (task.solutions &&
                  Array.isArray(task.solutions) &&
                  task.solutions.length > 1) ||
                (task.alternativeSolutions &&
                  task.alternativeSolutions.length > 0);

              const solutionsCount = task.solutions ? task.solutions.length : 0;
              const currentSolutionIndex =
                activeSolutionIndexes[taskIndex] || 0;

              let solutionCode = "";
              if (activeSolution) {
                if (
                  activeSolution.code &&
                  typeof activeSolution.code === "string"
                ) {
                  solutionCode = activeSolution.code;
                } else if (
                  activeSolution.solution_code &&
                  typeof activeSolution.solution_code === "string"
                ) {
                  solutionCode = activeSolution.solution_code;
                }
              }

              const solutionHint = activeSolution
                ? activeSolution.hint || ""
                : "";

              const isPrimarySolution =
                activeSolution && activeSolution.is_primary === true;

              return (
                <div
                  key={taskIndex}
                  className={` p-6 rounded-lg border-l-4 text-lg ${
                    isCorrect ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <div className="mb-4 flex items-center">
                    <div className="flex items-center mr-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <FaRegFileCode
                          className={
                            isCorrect ? "text-green-500" : "text-red-500"
                          }
                          size={20}
                        />
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        Завдання {taskIndex + 1}
                      </div>
                    </div>
                    <div
                      className={`flex items-center ${
                        isCorrect ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {isCorrect ? (
                        <FaCheck className="mr-1" size={16} />
                      ) : (
                        <FaTimes className="mr-1" size={16} />
                      )}
                      <span className="font-medium">
                        {isCorrect ? "Виконано" : "Не виконано"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xl font-bold mb-2 text-gray-800">
                      {task.title}
                    </h4>
                    <p className="text-gray-700 mb-4">{task.description}</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold mb-2 flex items-center text-gray-800">
                      <FaCode className="text-amber-600 mr-2" />
                      Початковий код
                    </h5>
                    <div className="rounded-lg overflow-hidden border border-gray-200 ">
                      <CodeMirror
                        value={normalizeNewlines(task.initial_code)}
                        height="auto"
                        theme={vscodeDark}
                        extensions={[getEditorLanguage(task.initial_code)]}
                        editable={false}
                        readOnly={true}
                      />
                    </div>
                  </div>

                  {userSolution && userSolution.submitted_code && (
                    <div className="mb-4">
                      <h5 className="font-semibold mb-2 flex items-center text-gray-800">
                        <FaCode
                          className={
                            isCorrect
                              ? "text-green-500 mr-2"
                              : "text-red-500 mr-2"
                          }
                        />
                        Ваш код
                      </h5>
                      <div
                        className={`rounded-lg overflow-hidden border-2 ${
                          isCorrect ? "border-green-400" : "border-red-400"
                        }`}
                      >
                        <CodeMirror
                          value={normalizeNewlines(userSolution.submitted_code)}
                          height="auto"
                          theme={vscodeDark}
                          extensions={[
                            getEditorLanguage(userSolution.submitted_code),
                          ]}
                          editable={false}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  )}

                  {solutionCode && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <h5 className="font-semibold text-gray-800 flex items-center">
                            <FaCheck className="text-green-500 mr-2" />
                            Правильне рішення
                          </h5>

                          {hasMutlipleSolutions && (
                            <button
                              onClick={() => cycleToNextSolution(taskIndex)}
                              className="ml-4 flex items-center text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              <FaExchangeAlt className="mr-2" size={14} />
                              {solutionsCount > 2 && (
                                <span className="mr-1">{`${
                                  currentSolutionIndex + 1
                                }/${solutionsCount}`}</span>
                              )}
                              {isPrimarySolution
                                ? "Інші рішення"
                                : "Основне рішення"}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="border-2 border-green-400 rounded-lg overflow-hidden ">
                        <CodeMirror
                          value={normalizeNewlines(solutionCode)}
                          height="auto"
                          theme={vscodeDark}
                          extensions={[getEditorLanguage(solutionCode)]}
                          editable={false}
                          readOnly={true}
                        />
                      </div>

                      {solutionHint && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-amber-800">
                          <p className="font-semibold mb-1">Пояснення</p>
                          <p>{solutionHint}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onRetakeTasks}
              className="px-8 py-4 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium  transition-colors"
            >
              Спробувати ще раз
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
