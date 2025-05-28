import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaDatabase,
  FaPython,
  FaArrowRight,
  FaCode,
  FaLightbulb,
  FaCheckCircle,
} from 'react-icons/fa';
import testService from '../../services/testService';

export default function TestsAndTasksSection() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await testService.getTests();

        const homePageTests = data.slice(0, 6);
        setTests(homePageTests);
      } catch (err) {
        console.error('Error fetching tests for homepage:', err);
        setError('Не вдалося завантажити тести');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const getIconComponent = (test) => {
    const title = test.title?.toLowerCase() || '';
    const iconName = test.icon?.toLowerCase() || '';

    if (title.includes('html') || iconName.includes('html')) {
      return <FaHtml5 className="text-orange-500 text-6xl" />;
    } else if (title.includes('css') || iconName.includes('css')) {
      return <FaCss3Alt className="text-blue-500 text-6xl" />;
    } else if (
      title.includes('javascript') ||
      iconName.includes('javascript') ||
      title.includes('js') ||
      iconName.includes('js')
    ) {
      return <FaJs className="text-yellow-400 text-6xl" />;
    } else if (title.includes('react') || iconName.includes('react')) {
      return <FaReact className="text-blue-400 text-6xl" />;
    } else if (title.includes('sql') || iconName.includes('database')) {
      return <FaDatabase className="text-blue-600 text-6xl" />;
    } else if (
      title.includes('python') ||
      iconName.includes('python') ||
      title.includes('django') ||
      iconName.includes('django')
    ) {
      return <FaPython className="text-green-500 text-6xl" />;
    } else {
      return <FaCode className="text-gray-600 text-6xl" />;
    }
  };

  const features = [
    {
      icon: <FaLightbulb className="text-amber-500 text-6xl" />,
      title: 'Реальні запитання',
      description:
        'Наші тести та завдання створені на основі реальних запитань з технічних співбесід у провідних компаніях.',
    },
    {
      icon: <FaCheckCircle className="text-green-500 text-6xl" />,
      title: 'Детальний аналіз',
      description:
        'Після виконання завдань ви отримаєте детальний аналіз ваших відповідей та рекомендації щодо покращення.',
    },
    {
      icon: <FaCode className="text-blue-500 text-6xl" />,
      title: 'Інтерактивні завдання',
      description:
        'Практичні завдання дозволяють писати та тестувати код безпосередньо в браузері.',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-7xl w-full mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Тести та практичні завдання
          </h2>
          <p className="text-xl text-gray-600 max-w-7xl mx-auto">
            Підготуйтеся до технічних співбесід за допомогою наших тестів та
            інтерактивних завдань, створених на основі реальних запитань від
            роботодавців.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md border-t-4 border-amber-500 flex flex-col items-center text-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-600 mb-4">
            Оберіть бажану технологію та розпочинайте підготовку!
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-xl text-red-500">{error}</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 group hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6 text-lg">
                    <div className="flex items-center mb-4">
                      <div className="mr-4">{getIconComponent(test)}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-amber-600 ">
                          {test.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 line-clamp-2 ">
                      Питання до співбесід
                    </p>

                    <div className="flex flex-col space-y-2">
                      <Link
                        to={`/tests/${test.id}`}
                        className="text-amber-600 hover:text-amber-700 font-semibold flex items-center  text-lg"
                      >
                        <span>Пройти тест</span>
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>

                      <Link
                        to={`/tests/${test.id}/tasks`}
                        className="text-gray-600 hover:text-gray-800 font-semibold flex items-center "
                      >
                        <span>Практичні завдання</span>
                        <FaCode className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/tests"
                className="inline-block bg-white text-amber-600 border-2 border-amber-600  text-lg py-3 px-8 rounded-md hover:bg-amber-600 hover:text-white transition duration-300"
              >
                Переглянути всі тести та завдання
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
