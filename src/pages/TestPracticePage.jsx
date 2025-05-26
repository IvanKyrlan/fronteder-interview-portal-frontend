import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaChevronRight,
  FaCheckCircle,
  FaCode,
  FaLaptopCode,
  FaChartLine,
} from "react-icons/fa";
import { toast } from "react-toastify";
import testService from "../services/testService";
import TestsContainer from "../components/test/TestsContainer";
import AuthModal from "../components/auth/AuthModal";

export default function TestPracticePage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    document.title = "Тести та практика | Frontender - Підготовка до співбесід";

    const fetchTests = async () => {
      try {
        const data = await testService.getTests();

        const priority = {
          html: 1,
          css: 2,
          javascript: 3,
          js: 3,
          react: 4,
          sql: 5,
          django: 6,
          python: 6,
        };

        const sortedTests = [...data].sort((a, b) => {
          const titleA = a.title?.toLowerCase() || "";
          const titleB = b.title?.toLowerCase() || "";
          const iconA = a.icon?.toLowerCase() || "";
          const iconB = b.icon?.toLowerCase() || "";

          let priorityA = 100;
          for (const key in priority) {
            if (titleA.includes(key) || iconA.includes(key)) {
              priorityA = priority[key];
              break;
            }
          }

          let priorityB = 100;
          for (const key in priority) {
            if (titleB.includes(key) || iconB.includes(key)) {
              priorityB = priority[key];
              break;
            }
          }

          return priorityA - priorityB;
        });

        setTests(sortedTests);
      } catch (err) {
        setError("Не вдалося завантажити тести");
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
    window.scrollTo(0, 0);

    return () => {
      document.title = "Frontender";
    };
  }, []);

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      toast.info("Ви вже зареєстровані", {
        position: "top-center",
        autoClose: 3000,
        icon: ({ theme, type }) => (
          <div className="text-amber-600">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 9C12.5523 9 13 9.44772 13 10V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V10C11 9.44772 11.4477 9 12 9ZM12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"
                fill="#d97706"
              />
            </svg>
          </div>
        ),
      });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-gray-600">Завантаження тестів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-xl text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Тести та практика</h1>
          <p className="text-xl max-w-4xl mx-auto text-gray-300">
            Перевірте свої знання та навички розв'язування практичних завдань,
            які часто зустрічаються на технічних співбесідах для Frontend
            розробників.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Доступні тести та практичні завдання
          </h2>

          <div className="">
            <TestsContainer tests={tests} />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Переваги нашої тестової платформи
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <FaLaptopCode size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Реальні питання
              </h3>
              <p className="text-gray-600">
                Тести засновані на реальних питаннях з технічних співбесід у
                провідних IT компаніях.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <FaCheckCircle size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Миттєвий зворотній зв'язок
              </h3>
              <p className="text-gray-600">
                Відразу після завершення тесту ви отримуєте детальний аналіз
                своїх відповідей.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FaCode size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Практичні завдання
              </h3>
              <p className="text-gray-600">
                Інтерактивні завдання з написання коду для закріплення
                теоретичних знань на практиці.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Як проходити тести
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: 1,
                title: "Виберіть тест",
                description:
                  "Оберіть технологію, з якої хочете перевірити свої знання, та розпочніть тест.",
              },
              {
                number: 2,
                title: "Відповідайте на питання",
                description:
                  "Дайте відповіді на запитання тесту, обираючи правильні варіанти зі списку.",
              },
              {
                number: 3,
                title: "Отримайте результат",
                description:
                  "Після завершення тесту ви отримаєте детальний аналіз своїх відповідей та бали.",
              },
              {
                number: 4,
                title: "Спробуйте практику",
                description:
                  "Переходьте до практичних завдань, щоб закріпити теоретичні знання на практиці.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white py-12 px-4 rounded-lg shadow-sm flex flex-col h-full"
              >
                <div className="w-18 h-18 text-lg rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mb-4 mx-auto">
                  {step.number}
                </div>
                <div className="h-16 flex items-center justify-center">
                  {" "}
                  <h3 className="text-xl font-bold text-gray-800 text-center">
                    {step.title}
                  </h3>
                </div>

                <div className="border-gray-200 pt-4 text-lg">
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Відстежуйте свій прогрес
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Зареєстровані користувачі можуть відстежувати свій прогрес,
                бачити історію спроб та аналізувати свої слабкі та сильні
                сторони для ефективної підготовки.
              </p>

              <ul className="space-y-4 mb-8 text-lg">
                <li className="flex items-center">
                  <FaCheckCircle
                    className="text-green-500 mt-1 mr-3"
                    size={32}
                  />
                  <span>
                    Історія всіх пройдених тестів та виконаних завдань
                  </span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle
                    className="text-green-500 mt-1 mr-3"
                    size={32}
                  />
                  <span>Графіки прогресу та статистика результатів</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle
                    className="text-green-500 mt-1 mr-3"
                    size={32}
                  />
                  <span>Рекомендації на основі ваших результатів</span>
                </li>
              </ul>

              <button
                onClick={handleRegisterClick}
                className="inline-flex font-medium items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors shadow-md"
              >
                Зареєструватися
                <FaChevronRight className="ml-2" />
              </button>
            </div>

            <div className="w-full md:w-1/2">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md flex flex-col">
                <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                  <FaChartLine className="text-gray-400" size={48} />
                </div>
                <div className="p-4 sm:p-6 bg-white flex-1 flex flex-col justify-center">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 sm:w-2/3 mb-3 sm:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/5 sm:w-5/6 mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 sm:w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Розпочніть підготовку до співбесіди прямо зараз
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Чим більше тестів ви пройдете та практичних завдань виконаєте, тим
            краще ви будете підготовлені до реальних технічних співбесід.
            Почніть прямо зараз!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() =>
                window.scrollTo({
                  top: document.querySelector(".bg-white + .py-12").offsetTop,
                  behavior: "smooth",
                })
              }
              className="bg-white text-amber-600 font-medium text-lg py-4 px-8 rounded-md hover:bg-gray-100 transition-colors shadow-md"
            >
              Почати тестування
            </button>
            <Link
              to="/interviews"
              className="bg-transparent text-white border-2 border-white font-medium text-lg py-4 px-8 rounded-md hover:bg-white hover:text-amber-600 transition-colors"
            >
              Перейти до відео співбесід
            </Link>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
      />
    </div>
  );
}
