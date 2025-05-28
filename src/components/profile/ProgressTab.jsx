import React, { useState, useEffect } from 'react';
import TestProgress from '../test/TestProgress';
import TaskProgress from '../task/TaskProgress';
import userService from '../../services/userService';
import {
  FaChartLine,
  FaTrophy,
  FaRegLightbulb,
  FaGraduationCap,
  FaBook,
  FaCode,
  FaLaptopCode,
} from 'react-icons/fa';

export default function ProgressTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [taskProgress, setTaskProgress] = useState([]);
  const [activeTab, setActiveTab] = useState('test');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const loadUserProgress = async () => {
      setLoading(true);
      try {
        const progress = await userService.getUserProgress();
        setUserProgress(progress);

        const taskProgressData = await userService.getUserTaskProgress();
        setTaskProgress(taskProgressData);

        generateRecommendations(progress, taskProgressData);
      } catch (error) {
        console.error('Failed to load user progress:', error);
        setError('Не вдалося завантажити дані прогресу');
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, []);

  const generateRecommendations = (testProgress, practiceProgress) => {
    const newRecommendations = [];

    if (testProgress && testProgress.length > 0) {
      const lowScoreTests = testProgress.filter((test) => test.score < 60);

      if (lowScoreTests.length > 0) {
        newRecommendations.push({
          type: 'test_retry',
          title: 'Повторіть тести з низьким результатом',
          description: `У вас ${lowScoreTests.length} ${
            lowScoreTests.length === 1 ? 'тест' : 'тестів'
          } з результатом нижче 60%. Спробуйте пройти їх ще раз для покращення результату.`,
          tests: lowScoreTests,
          icon: <FaRegLightbulb className="text-amber-500" />,
        });
      }

      if (testProgress.length < 5) {
        newRecommendations.push({
          type: 'test_new',
          title: 'Пройдіть більше тестів',
          description:
            'Спробуйте пройти більше тестів для повного охоплення тем і кращої підготовки до співбесід.',
          icon: <FaBook className="text-blue-500" />,
        });
      }
    } else {
      newRecommendations.push({
        type: 'test_start',
        title: 'Почніть з теоретичних тестів',
        description:
          'Пройдіть декілька тестів, щоб перевірити свої теоретичні знання перед виконанням практичних завдань.',
        icon: <FaGraduationCap className="text-green-500" />,
      });
    }

    if (practiceProgress && practiceProgress.length > 0) {
      const lowCompletionTasks = practiceProgress.filter(
        (task) => task.completed_tasks / task.total_tasks < 0.5
      );

      if (lowCompletionTasks.length > 0) {
        newRecommendations.push({
          type: 'task_continue',
          title: 'Виконайте більше практичних завдань',
          description: `У ${lowCompletionTasks.length} ${
            lowCompletionTasks.length === 1 ? 'категорії' : 'категоріях'
          } ви виконали менше половини завдань. Продовжуйте практику для закріплення навичок.`,
          tasks: lowCompletionTasks,
          icon: <FaCode className="text-purple-500" />,
        });
      }

      const almostCompleteTasks = practiceProgress.filter(
        (task) =>
          task.completed_tasks / task.total_tasks >= 0.8 &&
          task.completed_tasks / task.total_tasks < 1
      );

      if (almostCompleteTasks.length > 0) {
        newRecommendations.push({
          type: 'task_finish',
          title: 'Завершіть виконання завдань',
          description: `Ви майже завершили завдання у ${
            almostCompleteTasks.length
          } ${
            almostCompleteTasks.length === 1 ? 'категорії' : 'категоріях'
          }. Залишилося зовсім трохи!`,
          tasks: almostCompleteTasks,
          icon: <FaTrophy className="text-amber-500" />,
        });
      }
    } else {
      newRecommendations.push({
        type: 'task_start',
        title: 'Почніть практичні завдання',
        description:
          'Виконання практичних завдань допоможе закріпити теоретичні знання та підготуватися до технічних завдань на співбесіді.',
        icon: <FaLaptopCode className="text-amber-600" />,
      });
    }

    const highScoreTests = (testProgress || []).filter(
      (test) => test.score >= 80
    );
    const completeTaskCategories = (practiceProgress || []).filter(
      (task) => task.completed_tasks / task.total_tasks >= 0.8
    );

    if (highScoreTests.length >= 3 && completeTaskCategories.length >= 3) {
      newRecommendations.push({
        type: 'advanced',
        title: 'Відмінний прогрес!',
        description:
          "Ви показуєте хороші результати. Спробуйте пройти інтерв'ю та подивіться наші відео з розбором типових співбесід.",
        icon: <FaTrophy className="text-amber-600" />,
      });
    }

    setRecommendations(newRecommendations);
  };

  const calculateOverallTestProgress = () => {
    if (!userProgress || userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, test) => sum + test.score, 0);
    return Math.round(totalScore / userProgress.length);
  };

  const calculateOverallTaskProgress = () => {
    if (!taskProgress || taskProgress.length === 0) return 0;
    const totalPercentage = taskProgress.reduce((sum, task) => {
      const percentage = task.total_tasks
        ? Math.round((task.completed_tasks / task.total_tasks) * 100)
        : 0;
      return sum + percentage;
    }, 0);
    return Math.round(totalPercentage / taskProgress.length);
  };

  const testPercentage = calculateOverallTestProgress();
  const taskPercentage = calculateOverallTaskProgress();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-gray-600">Завантаження прогресу...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p className="">{error}</p>
      </div>
    );
  }

  if (userProgress.length === 0 && taskProgress.length === 0) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-start">
          <FaRegLightbulb className="text-xl mr-3 mt-1 flex-shrink-0 text-blue-500" />
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Почніть свій шлях до успіху!
            </h3>
            <p className="mb-4 text-gray-600">
              Ви ще не проходили жодного тесту чи практичного завдання. Пройдіть
              наші тести та виконайте завдання, щоб відстежувати свій прогрес та
              підготуватися до технічних співбесід.
            </p>
            <a
              href="/tests"
              className="inline-flex items-center bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 "
            >
              Перейти до тестів <FaChartLine className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
          Загальний прогрес
        </h2>

        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6 text-md">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
              Персональні рекомендації
            </h3>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-3 rounded-md bg-gray-50 border-l-3 border-amber-300 hover:bg-amber-50 "
                >
                  <div className="flex items-center">
                    <div className="mt-0.5 mr-3 text-3xl flex-shrink-0">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className=" text-gray-800 mb-1">{rec.title}</h4>
                      <p className="text-gray-600 text-md">{rec.description}</p>

                      {rec.type === 'test_retry' && rec.tests && (
                        <div className="mt-2 flex flex-wrap gap-2 text-md">
                          {rec.tests.slice(0, 3).map((test, i) => (
                            <a
                              key={i}
                              href={`/tests/${test.test_id}`}
                              className=" bg-white rounded-full p-2 text-gray-700 hover:text-amber-600  border border-gray-200"
                            >
                              {test.test_title} ({test.score}%)
                            </a>
                          ))}
                          {rec.tests.length > 3 && (
                            <span className="text-md px-2 py-1 text-gray-500">
                              та ще {rec.tests.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {rec.type === 'task_continue' && rec.tasks && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {rec.tasks.slice(0, 3).map((task, i) => (
                            <a
                              key={i}
                              href={`/tests/${task.test}/tasks`}
                              className="text-xs bg-white rounded-full px-2 py-1 text-gray-700 hover:text-amber-600  border border-gray-200"
                            >
                              {task.test_title} (
                              {Math.round(
                                (task.completed_tasks / task.total_tasks) * 100
                              )}
                              %)
                            </a>
                          ))}
                          {rec.tasks.length > 3 && (
                            <span className="text-xs px-2 py-1 text-gray-500">
                              та ще {rec.tasks.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 border-b border-gray-200">
        <div className="flex flex-wrap text-lg">
          <button
            className={`px-4 py-2  text-md mr-2 -mb-px rounded-t focus:outline-none  ${
              activeTab === 'test'
                ? 'text-amber-600 border-b-2 border-amber-600 bg-white'
                : 'text-gray-600 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('test')}
          >
            <span className="flex items-center">
              <FaBook className="mr-2" />
              Прогрес тестів
            </span>
          </button>
          <button
            className={`px-4 py-2  text-md -mb-px rounded-t focus:outline-none  ${
              activeTab === 'task'
                ? 'text-amber-600 border-b-2 border-amber-600 bg-white'
                : 'text-gray-600 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('task')}
          >
            <span className="flex items-center">
              <FaLaptopCode className="mr-2" />
              Прогрес практичних завдань
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        {activeTab === 'test' ? (
          <TestProgress userProgress={userProgress} />
        ) : (
          <TaskProgress
            taskProgress={taskProgress}
            userProgress={userProgress}
          />
        )}
      </div>
    </div>
  );
}
