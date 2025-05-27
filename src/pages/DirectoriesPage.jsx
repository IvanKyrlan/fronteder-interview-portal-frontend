import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DiHtml5,
  DiCss3,
  DiJsBadge,
  DiReact,
  DiDatabase,
  DiDjango,
} from "react-icons/di";
import {
  FaExternalLinkAlt,
  FaBook,
  FaGraduationCap,
  FaCodeBranch,
  FaLightbulb,
  FaCode,
} from "react-icons/fa";

export default function DirectoriesPage() {
  useEffect(() => {
    document.title = "Довідники | Frontender - Підготовка до співбесід";

    window.scrollTo(0, 0);

    return () => {
      document.title = "Frontender";
    };
  }, []);

  const directories = [
    {
      id: "html",
      title: "HTML5",
      icon: DiHtml5,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      description:
        "Повний довідник з HTML тегів, атрибутів та найкращих практик розмітки.",
      url: "https://w3schoolsua.github.io/tags/index.html#gsc.tab=0",
    },
    {
      id: "css",
      title: "CSS3",
      icon: DiCss3,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      description:
        "Детальний посібник із CSS властивостей, селекторів та сучасних технік стилізації.",
      url: "https://w3schoolsua.github.io/css/index.html",
    },
    {
      id: "javascript",
      title: "JavaScript",
      icon: DiJsBadge,
      color: "text-yellow-400",
      bgColor: "bg-yellow-200",
      description:
        "Вичерпний довідник з JavaScript, включаючи основи мови, DOM API та ES6+ можливості.",
      url: "https://w3schoolsua.github.io/js/index.html",
    },
    {
      id: "react",
      title: "React",
      icon: DiReact,
      color: "text-blue-400",
      bgColor: "bg-blue-50",
      description:
        "Ресурси з React.js, включаючи хуки, компоненти, стани та життєвий цикл додатку.",
      url: "https://w3schoolsua.github.io/react/index.html",
    },
    {
      id: "sql",
      title: "SQL",
      icon: DiDatabase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description:
        "Довідник з мови SQL, включаючи команди, запити та оптимізацію баз даних.",
      url: "https://w3schoolsua.github.io/sql/index.html",
    },
    {
      id: "django",
      title: "Django",
      icon: DiDjango,
      color: "text-green-500",
      bgColor: "bg-green-100",
      description:
        "Документація з Python Django фреймворку для серверної частини веб-додатків.",
      url: "https://w3schoolsua.github.io/django/index.html",
    },
  ];

  const usefulLinks = [
    {
      title: "MDN Web Docs",
      description:
        "Довідник веб-технологій від Mozilla з детальною документацією та прикладами.",
      icon: FaBook,
      url: "https://developer.mozilla.org/",
    },
    {
      title: "DOU.ua",
      description:
        "Українська спільнота розробників з корисними статтями, форумами та навчальними матеріалами.",
      icon: FaGraduationCap,
      url: "https://dou.ua/",
    },
    {
      title: "DevDocs",
      description:
        "Зібрання документації з різних API та мов програмування в одному місці з зручним пошуком.",
      icon: FaCode,
      url: "https://devdocs.io/",
    },
    {
      title: "freeCodeCamp",
      description:
        "Безкоштовна платформа для вивчення програмування з україномовними матеріалами та завданнями.",
      icon: FaLightbulb,
      url: "https://www.freecodecamp.org/ukrainian/",
    },
    {
      title: "Prometheus",
      description:
        "Українська освітня платформа з безкоштовними курсами з програмування та ІТ від провідних викладачів.",
      icon: FaGraduationCap,
      url: "https://prometheus.org.ua/",
    },
    {
      title: "DevZone",
      description:
        "Україномовний ресурс з туторіалами та документацією з програмування для початківців та досвідчених.",
      icon: FaCodeBranch,
      url: "https://devzone.org.ua/",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Довідники</h1>
          <p className="text-xl max-w-4xl mx-auto text-gray-300">
            Доступ до найкращих ресурсів та документації для підготовки до
            технічних співбесід з Frontend розробки.
          </p>
        </div>
      </section>

      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Технічні довідники
            </h2>
            <p className="text-lg text-gray-600">
              Детальні довідники з основних технологій Frontend розробки,
              необхідних для успішного проходження технічних співбесід.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directories.map((directory) => (
              <div
                key={directory.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="p-8">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div
                      className={`w-20 h-20 ${directory.bgColor} rounded-full flex items-center justify-center mb-4`}
                    >
                      <directory.icon
                        className={`text-5xl ${directory.color}`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {directory.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-md">
                      {directory.description}
                    </p>
                  </div>

                  <div className="text-center">
                    <a
                      href={directory.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center  px-6 py-3 rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      Відкрити довідник
                      <FaExternalLinkAlt className="ml-2" size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Корисні посилання
            </h2>
            <p className="text-lg text-gray-600">
              Додаткові ресурси, які допоможуть поглибити знання та навички для
              успішного проходження співбесіди.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-balance">
            {usefulLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-50 rounded-lg p-6 flex items-start hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <link.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-amber-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-gray-600">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Готові перевірити свої знання?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Після вивчення документації переконайтеся, що ви повністю засвоїли
            матеріал, пройшовши наші тести та виконавши практичні завдання.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tests"
              className="bg-white text-amber-600  text-lg py-4 px-8 rounded-md hover:bg-gray-100 transition-colors shadow-md"
            >
              Пройти тести
            </Link>
            <Link
              to="/articles"
              className="bg-transparent text-white border-2 border-white  text-lg py-4 px-8 rounded-md hover:bg-white hover:text-amber-600 transition-colors"
            >
              Читати статті
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
