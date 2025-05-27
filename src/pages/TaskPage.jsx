import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChevronRight,
  FaCode,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import taskService from "../services/taskService";
import testService from "../services/testService";
import TaskContent from "../components/task/TaskContent";
import TaskResultContent from "../components/task/TaskResultContent";

const saveTaskSessionState = (testId, tasks, solutions) => {
  const sessionState = {
    tasks,
    solutions,
    timestamp: Date.now(),
  };
  localStorage.setItem(`task_session_${testId}`, JSON.stringify(sessionState));
};

const getTaskSessionState = (testId) => {
  const stateJson = localStorage.getItem(`task_session_${testId}`);
  if (!stateJson) return null;

  try {
    const state = JSON.parse(stateJson);

    if (Date.now() - state.timestamp > 86400000) {
      localStorage.removeItem(`task_session_${testId}`);
      return null;
    }
    return state;
  } catch (e) {
    console.error("Error parsing task session state:", e);
    localStorage.removeItem(`task_session_${testId}`);
    return null;
  }
};

const clearTaskSessionState = (testId) => {
  localStorage.removeItem(`task_session_${testId}`);
};

const countCompletedTasks = (solutions) => {
  if (!solutions || !Array.isArray(solutions)) return 0;
  return solutions.filter((solution) => solution && solution.is_correct).length;
};

export default function TaskPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { language } = location.state || { language: null };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [test, setTest] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);
  const [view, setView] = useState("tasks");
  const [userSolutions, setUserSolutions] = useState([]);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [testLanguage, setTestLanguage] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompletedTasks, setSessionCompletedTasks] = useState(0);

  useEffect(() => {
    if (test) {
      if (view === "tasks") {
        document.title = `${test.title} | Frontender - Практичні завдання`;
      } else if (view === "result") {
        document.title = `Результати практики: ${test.title} | Frontender`;
      }
    } else {
      document.title = "Практичні завдання | Frontender";
    }

    return () => {
      document.title = "Frontender";
    };
  }, [test, view]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await testService.getTest(testId);
        setTest(data);

        if (!language) {
          const detectedLanguage = getLanguageFromTest(data);
          setTestLanguage(detectedLanguage);
        } else {
          setTestLanguage(language);
        }
      } catch (err) {
        setError("Не вдалося завантажити тест");
      }
    };
    fetchTest();
  }, [testId, language]);

  const getLanguageFromTest = (testData) => {
    if (!testData) return "javascript";

    const title = testData.title ? testData.title.toLowerCase() : "";
    const icon = testData.icon ? testData.icon.toLowerCase() : "";

    if (title.includes("html") || icon.includes("html")) return "html";
    if (title.includes("css") || icon.includes("css")) return "css";
    if (
      title.includes("javascript") ||
      title.includes("js") ||
      icon.includes("js") ||
      icon.includes("javascript")
    )
      return "javascript";
    if (title.includes("react") || icon.includes("react")) return "javascript";
    if (
      title.includes("sql") ||
      title.includes("база даних") ||
      icon.includes("database") ||
      icon.includes("sql")
    )
      return "sql";
    if (
      title.includes("python") ||
      title.includes("django") ||
      icon.includes("python") ||
      icon.includes("django")
    )
      return "python";

    return "javascript";
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getInteractiveTasks(testId);
        setTasks(data);

        const savedSession = getTaskSessionState(testId);
        if (savedSession && savedSession.solutions) {
          const solutions = savedSession.solutions;
          setUserSolutions(solutions);

          const completedCount = countCompletedTasks(solutions);
          setSessionCompletedTasks(completedCount);

          const nextTaskIndex = solutions.findIndex(
            (sol) => !sol || !sol.is_correct
          );
          if (nextTaskIndex >= 0) {
            setCurrentTaskIndex(nextTaskIndex);
          }
          setSessionStarted(true);
        } else {
          setUserSolutions(new Array(data.length).fill(null));
          setSessionCompletedTasks(0);
        }

        setLoading(false);
      } catch (err) {
        setError("Не вдалося завантажити завдання");
        setLoading(false);
      }
    };
    if (test) fetchTasks();
  }, [test]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await taskService.getTaskProgress(testId);
        setProgress(data);
        if (data && tasks.length > 0) {
          setAllTasksCompleted(data.completed_tasks >= tasks.length);
        }
      } catch (err) {
        setProgress({
          completed_tasks: 0,
          total_tasks: tasks.length || 0,
          completion_percentage: 0,
        });
      }
    };
    if (test) fetchProgress();
  }, [test, tasks.length]);

  useEffect(() => {
    if (userSolutions.length > 0) {
      const completedCount = countCompletedTasks(userSolutions);
      setSessionCompletedTasks(completedCount);

      console.log("Session completed tasks updated:", {
        count: completedCount,
        solutions: userSolutions.map((s) => s?.is_correct || false),
      });
    }
  }, [userSolutions]);

  useEffect(() => {
    if (location.pathname.includes("/result")) {
      setView("result");

      if (location.state && location.state.userSolutions) {
        const solutions = location.state.userSolutions;
        setUserSolutions(solutions);

        if (location.state.completedTasks !== undefined) {
          setSessionCompletedTasks(location.state.completedTasks);
        } else {
          const completedCount = countCompletedTasks(solutions);
          setSessionCompletedTasks(completedCount);
        }
      } else {
        const savedSession = getTaskSessionState(testId);
        if (savedSession && savedSession.solutions) {
          const solutions = savedSession.solutions;
          setUserSolutions(solutions);

          const completedCount = countCompletedTasks(solutions);
          setSessionCompletedTasks(completedCount);

          navigate(location.pathname, {
            state: {
              completedTasks: completedCount,
              totalTasks: tasks.length || savedSession.tasks.length,
              userSolutions: solutions,
              language: testLanguage,
            },
            replace: true,
          });
        }
      }
    } else {
      setView("tasks");
    }
  }, [
    location.pathname,
    location.state,
    testId,
    tasks.length,
    navigate,
    testLanguage,
  ]);

  useEffect(() => {
    if (sessionStarted && tasks.length > 0) {
      saveTaskSessionState(testId, tasks, userSolutions);
    }
  }, [sessionStarted, userSolutions, tasks, testId]);

  const handleSubmitSolution = async (code) => {
    if (!tasks.length) return;
    setSubmitting(true);
    setResult(null);
    setSessionStarted(true);

    try {
      const currentTask = tasks[currentTaskIndex];

      const response = await taskService.submitTaskSolution(
        currentTask.id,
        code,
        testLanguage
      );

      setResult(response);
      const updatedSolutions = [...userSolutions];
      updatedSolutions[currentTaskIndex] = {
        task_id: currentTask.id,
        submitted_code: code,
        is_correct: response.is_correct,
      };
      setUserSolutions(updatedSolutions);

      saveTaskSessionState(testId, tasks, updatedSolutions);

      if (response.is_correct) {
        const updatedProgress = await taskService.getTaskProgress(testId);
        setProgress(updatedProgress);
        if (updatedProgress.completed_tasks >= tasks.length) {
          setAllTasksCompleted(true);
        }
      }
    } catch (err) {
      setResult({
        is_correct: false,
        hint: "Сталася помилка при відправці рішення.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextTask = () => {
    const isLastTask = currentTaskIndex === tasks.length - 1;

    if (isLastTask) {
      showResults();
    } else {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setResult(null);
    }
  };

  const handlePrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
      setResult(null);
    }
  };

  const showResults = () => {
    const completedCount = countCompletedTasks(userSolutions);

    console.log("Showing results:", {
      calculatedCompletedTasks: completedCount,
      serverProgress: progress?.completed_tasks,
      userSolutions: userSolutions.map((s) => s?.is_correct || false),
    });

    setView("result");
    navigate(`/tests/${testId}/tasks/result`, {
      state: {
        completedTasks: completedCount,
        totalTasks: tasks.length,
        userSolutions,
        language: testLanguage,
      },
      replace: true,
    });
  };

  const handleRetakeTasks = async () => {
    try {
      clearTaskSessionState(testId);

      setUserSolutions(new Array(tasks.length).fill(null));
      setSessionCompletedTasks(0);
      setCurrentTaskIndex(0);
      setResult(null);
      setSessionStarted(false);

      setView("tasks");
      navigate(`/tests/${testId}/tasks`, {
        state: { language: testLanguage },
        replace: true,
      });
    } catch (err) {
      console.error("Error restarting tasks:", err);
    }
  };

  const handleBack = () => navigate(`/tests/${testId}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-amber-600 mb-4" />
          <p className="text-xl text-gray-600">Завантаження завдань...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Помилка</h2>
          <p className="text-red-500 mb-6">{error || "Завдання не знайдено"}</p>
          <Link
            to="/tests"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Повернутися до списку тестів
          </Link>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <FaCode className="text-gray-300 text-6xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Завдання відсутні
            </h2>
            <p className="text-gray-600 mb-8">
              На жаль, для цього тесту поки що немає практичних завдань. Ви
              можете спробувати інші тести або повернутися до цього пізніше.
            </p>
            <Link
              to="/tests"
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Повернутися до списку тестів
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentTask = tasks[currentTaskIndex];

  return (
    <div className="bg-gray-50 min-h-screen">
      <section
        className={`py-20 ${
          view === "result"
            ? "bg-gradient-to-r from-amber-400 to-amber-700"
            : "bg-gradient-to-b from-neutral-800 to-neutral-900"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {view === "result"
              ? "Результати практичних завдань"
              : "Практичні завдання"}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-50">
            {view === "result"
              ? `Ви успішно виконали ${sessionCompletedTasks} з ${tasks.length} завдань по ${test.title}`
              : `Перевірте свої практичні навички розробки з ${test.title}. Виконайте завдання та отримайте миттєвий зворотній зв'язок.`}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center py-4 mb-6 text-gray-600 ">
          <Link
            to="/"
            className="flex items-center hover:text-gray-800 transition-colors"
          >
            <FaHome className="mr-1" />
            <span>Головна</span>
          </Link>
          <FaChevronRight className="mx-2" size={12} />
          <Link to="/tests/" className="hover:text-gray-800 transition-colors">
            Тести та практика
          </Link>
          <FaChevronRight className="mx-2" size={12} />
          <Link
            to={`/tests/${test.id}`}
            className="hover:text-gray-800 transition-colors"
          >
            <span className="max-w-md font-semibold">{test.title}</span>
          </Link>
          <FaChevronRight className="mx-2" size={12} />
          <span
            className={` ${
              view === "result" ? "text-amber-600" : "text-amber-600"
            }`}
          >
            {view === "tasks" ? "Практика" : "Результати"}
          </span>
        </nav>

        {view === "tasks" && (
          <TaskContent
            task={currentTask}
            onSubmit={handleSubmitSolution}
            loading={submitting}
            result={result}
            onNextTask={handleNextTask}
            onPrevTask={handlePrevTask}
            currentTaskIndex={currentTaskIndex}
            totalTasks={tasks.length}
            testType={testLanguage}
          />
        )}

        {view === "result" && (
          <TaskResultContent
            completedTasks={sessionCompletedTasks}
            totalTasks={tasks.length}
            onRetakeTasks={handleRetakeTasks}
            onBackToTests={handleBack}
            tasks={tasks}
            userSolutions={userSolutions}
            testType={testLanguage}
          />
        )}
      </div>
    </div>
  );
}
