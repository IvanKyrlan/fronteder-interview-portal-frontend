import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaCode } from "react-icons/fa";
import { getIcon } from "../../utils/iconMapping";

export default function TestsContainer({ tests }) {
  const navigate = useNavigate();

  const handlePracticeClick = (e, test) => {
    e.preventDefault();
    const language = getLanguageFromTest(test);

    navigate(`/tests/${test.id}/tasks`, {
      state: { language },
    });
  };

  const getLanguageFromTest = (test) => {
    const iconName = test.icon?.toLowerCase() || "";
    const title = test.title?.toLowerCase() || "";

    if (iconName.includes("html") || title.includes("html")) return "html";
    if (iconName.includes("css") || title.includes("css")) return "css";
    if (
      iconName.includes("js") ||
      iconName.includes("javascript") ||
      title.includes("javascript")
    )
      return "javascript";
    if (iconName.includes("react") || title.includes("react"))
      return "javascript";
    if (
      iconName.includes("database") ||
      iconName.includes("sql") ||
      title.includes("sql")
    )
      return "sql";
    if (
      iconName.includes("django") ||
      iconName.includes("python") ||
      title.includes("python")
    )
      return "python";

    return "javascript";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tests.map((test) => {
        const TestIcon = getIcon(test.icon || test.title);

        const title = test.title?.toLowerCase() || "";
        const getIconBackgroundClass = () => {
          if (title.includes("html")) return "bg-orange-500";
          if (title.includes("css")) return "bg-blue-500";
          if (title.includes("react")) return "bg-blue-400";
          if (title.includes("js") || title.includes("javascript"))
            return "bg-yellow-400";
          if (title.includes("sql") || title.includes("mysql"))
            return "bg-blue-600";
          if (title.includes("django") || title.includes("python"))
            return "bg-green-600";
          if (title.includes("java")) return "bg-blue-700";
          if (title.includes("c#")) return "bg-purple-600";
          if (title.includes("angular")) return "bg-red-600";
          if (title.includes("backend")) return "bg-slate-700";
          return "bg-gray-100";
        };

        return (
          <div key={test.id} className="rounded-lg overflow-hidden group">
            <div className="px-12 py-8 group-hover:bg-amber-600 group-hover:shadow-lg">
              <div className="flex items-start mb-10">
                <div
                  className={`flex-shrink-0 w-24 h-24 ${getIconBackgroundClass()} rounded-lg flex items-center justify-center`}
                >
                  <div className="text-white text-6xl">
                    <TestIcon />
                  </div>
                </div>

                <div className="ml-6 flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white ">
                    {test.title}
                  </h3>
                  <p className="text-gray-800 group-hover:text-white/90  mt-1 text-lg font-medium">
                    Питання до співбесід
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col space-y-3">
                <Link
                  to={`/tests/${test.id}`}
                  className="text-amber-600 group-hover:text-white font-semibold flex items-center text-lg hover:text-gray-200"
                >
                  <span>Пройти тест</span>
                  <FaArrowRight
                    className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                    size={18}
                  />
                </Link>
                <Link
                  to={`/tests/${test.id}/tasks`}
                  onClick={(e) => handlePracticeClick(e, test)}
                  className="text-gray-600 group-hover:text-white font-semibold flex items-center text-lg hover:text-gray-200"
                >
                  <span>Практичні завдання</span>
                  <FaCode
                    className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                    size={18}
                  />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
