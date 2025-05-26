import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaGraduationCap,
  FaLaptopCode,
  FaUserTie,
  FaAward,
  FaRocket,
  FaChalkboardTeacher,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaDatabase,
  FaPython,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function AboutPage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Про портал | Frontender - Підготовка до співбесід";
    window.scrollTo(0, 0);
    return () => {
      document.title = "Frontender";
    };
  }, []);

  const handleRegisterClick = (e) => {
    if (isAuthenticated) {
      e.preventDefault();
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
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Про портал</h1>
          <p className="text-xl max-w-4xl mx-auto text-gray-300">
            Ласкаво просимо до Frontender – освітньої платформи, створеної для
            підготовки студентів та початківців до технічних співбесід на
            позицію Frontend розробника.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/3 flex justify-center">
                <div className="w-64 h-64 rounded-full overflow-hidden border-6 border-amber-500">
                  <img
                    src="/src/assets/author-photo.jpg"
                    alt="Фото автора"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x400/gray/white?text=Author+Photo";
                    }}
                  />
                </div>
              </div>

              <div className="md:w-2/3 text-justify">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Про автора
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  Веб-портал «Frontender» було створено студентом 4 курсу{" "}
                  <strong>Кирланом Іваном</strong> в рамках дипломної
                  кваліфікаційної роботи для здобуття ступеня Бакалавр по
                  спеціальності Системний Аналіз.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Проект розроблено з використанням сучасних технологій
                  веб-розробки, включаючи React, Redux, Django REST Framework та
                  інші. Мета проекту — надати студентам IT-спеціальностей
                  зручний інструмент для підготовки до технічних співбесід та
                  успішного старту в кар'єрі Frontend розробника.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://github.com/IvanKyrlan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-800 font-medium hover:text-amber-600 transition-colors"
                  >
                    <FaGithub className="mr-2" size={20} />
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ivan-kyrlan-356203365/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-800 font-medium hover:text-amber-600 transition-colors"
                  >
                    <FaLinkedin className="mr-2" size={20} />
                    LinkedIn
                  </a>
                  <a
                    href="mailto:ivan.kyrlan2004@gmail.com"
                    className="flex items-center text-gray-800 font-medium hover:text-amber-600 transition-colors"
                  >
                    <FaEnvelope className="mr-2" size={20} />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 text-justify">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Мета порталу
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Frontender створено з метою допомогти студентам
                IT-спеціальностей та початківцям у веб-розробці підготуватись до
                технічних співбесід та успішно розпочати кар'єру в галузі
                Frontend розробки.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Даний портал прагне надати доступні, якісні та структуровані
                матеріали, які відповідають сучасним вимогам ринку праці та
                допомагають опанувати необхідні знання та навички.
              </p>
              <div className="flex flex-wrap gap-4 items-center text-lg">
                <Link
                  to="/tests"
                  className="bg-amber-600 text-white font-medium py-3 px-6 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Почати навчання
                </Link>
                <Link
                  to="/articles"
                  className="bg-white text-gray-800 border-2 border-gray-200 font-medium py-3 px-6 rounded-md hover:border-amber-600 hover:text-amber-600 transition-colors"
                >
                  Переглянути статті
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/src/assets/mission-illustration.jpg"
                alt="Місія Frontender"
                className="max-w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400/orange/white?text=Frontender+Mission";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Чим корисний портал?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-lg">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-6">
                <FaLaptopCode size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Практичні завдання
              </h3>
              <p className="text-gray-600">
                Розв'язуйте реальні практичні завдання з HTML, CSS, JavaScript
                та React, які часто зустрічаються на технічних співбесідах.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-green-100 text-green-600 mb-6">
                <FaChalkboardTeacher size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Теоретичні тести
              </h3>
              <p className="text-gray-600">
                Перевірте свої знання через інтерактивні тести, які охоплюють
                всі ключові теми Frontend розробки від основ до просунутих
                концепцій.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-6">
                <FaUserTie size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Підготовка до співбесід
              </h3>
              <p className="text-gray-600">
                Вивчайте типові питання технічних співбесід, вдосконалюйте
                відповіді та підвищуйте впевненість у своїх знаннях.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-red-100 text-red-600 mb-6">
                <FaAward size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Відстеження прогресу
              </h3>
              <p className="text-gray-600">
                Відстежуйте свій прогрес навчання, бачте свої сильні та слабкі
                сторони, та фокусуйтесь на тому, що потребує вдосконалення.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 mb-6">
                <FaGraduationCap size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Структуровані матеріали
              </h3>
              <p className="text-gray-600">
                Отримайте доступ до чітко структурованих навчальних матеріалів,
                які допоможуть систематизувати знання з Frontend розробки.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600 mb-6">
                <FaRocket size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Актуальні технології
              </h3>
              <p className="text-gray-600">
                Вивчайте сучасні Frontend технології та фреймворки, які
                користуються попитом серед роботодавців на ринку праці.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Технології, які ви вивчите
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <FaHtml5 className="text-orange-500" size={48} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">HTML5</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FaCss3Alt className="text-blue-500" size={48} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">CSS3</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-yellow-200 flex items-center justify-center mb-4">
                <FaJs className="text-yellow-500" size={48} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">JavaScript</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <FaReact className="text-blue-400" size={48} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">React</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FaDatabase className="text-blue-600" size={48} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">SQL</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaPython className="text-green-600" size={48} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Django</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Готові почати підготовку до співбесід?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Приєднуйтесь до Frontender сьогодні та зробіть перший крок до
            успішної кар'єри Frontend розробника!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tests"
              className="bg-white text-amber-600 font-medium text-lg py-4 px-8 rounded-md hover:bg-gray-100 transition-colors shadow-md"
            >
              Почати підготовку
            </Link>
            <Link
              to="/register"
              onClick={handleRegisterClick}
              className="bg-transparent text-white border-2 border-white font-medium text-lg py-4 px-8 rounded-md hover:bg-white hover:text-amber-600 transition-colors"
            >
              Зареєструватися
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
