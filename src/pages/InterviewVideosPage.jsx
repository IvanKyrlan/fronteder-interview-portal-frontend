import React, { useState, useEffect } from 'react';
import {
  FaPlay,
  FaFilter,
  FaYoutube,
  FaStar,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaVideo,
  FaChevronDown,
  FaArrowRight,
} from 'react-icons/fa';
import interviewVideoService from '../services/interviewVideoService';
import LiteYouTubeEmbed from '../components/interview/LiteYouTubeEmbed';
import { Link } from 'react-router-dom';
import ArticleSidebar from '../components/article/ArticleSidebar';

export default function InterviewVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
  });

  useEffect(() => {
    document.title =
      'Технічні співбесіди | Frontender - Підготовка до співбесід';

    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.level) params.level = filters.level;

        const data = await interviewVideoService.getInterviewVideos(params);
        setVideos(data);

        if (data.length > 0 && !selectedVideo) {
          setSelectedVideo(data[0]);
        }
      } catch (err) {
        setError('Не вдалося завантажити відео співбесід');
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    return () => {
      document.title = 'Frontender';
    };
  }, [filters, selectedVideo]);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const getLevelBadgeClass = (level) => {
    const classes = {
      junior: 'bg-green-100 text-green-800',
      middle: 'bg-blue-100 text-blue-800',
      senior: 'bg-purple-100 text-purple-800',
    };
    return classes[level] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryBadgeClass = (category) => {
    const classes = {
      frontend: 'bg-yellow-100 text-yellow-800',
      backend: 'bg-blue-100 text-blue-800',
      fullstack: 'bg-indigo-100 text-indigo-800',
      devops: 'bg-gray-100 text-gray-800',
      mobile: 'bg-green-100 text-green-800',
      qa: 'bg-red-100 text-red-800',
    };
    return classes[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading && !videos.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-gray-600">Завантаження відео...</p>
        </div>
      </div>
    );
  }

  if (error && !videos.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Технічні співбесіди</h1>
          <p className="text-xl max-w-4xl mx-auto text-gray-300">
            Підготуйтеся до технічних співбесід на позицію Frontend розробника,
            переглядаючи реальні приклади співбесід та вивчаючи ключові
            концепції.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <FaVideo className="text-amber-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                Відеозаписи співбесід
              </h2>
            </div>

            <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
              <FaFilter className="text-gray-400 mr-3" />
              <div className="flex space-x-2">
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  className="rounded-md px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent  text-gray-700"
                >
                  <option value="">Всі категорії</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="devops">DevOps</option>
                  <option value="mobile">Mobile</option>
                  <option value="qa">QA</option>
                </select>

                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="rounded-md px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent  text-gray-700"
                >
                  <option value="">Всі рівні</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-0">
              {selectedVideo ? (
                <>
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <LiteYouTubeEmbed
                      videoId={selectedVideo.youtube_id}
                      title={selectedVideo.title}
                    />

                    <div className="bg-white p-6 text-lg">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {selectedVideo.title}
                        </h2>
                        {selectedVideo.featured && (
                          <span className="flex items-center text-amber-600">
                            <FaStar className="mr-1" /> Рекомендовано
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm  ${getLevelBadgeClass(
                            selectedVideo.level
                          )}`}
                        >
                          {selectedVideo.level === 'junior'
                            ? 'Junior'
                            : selectedVideo.level === 'middle'
                            ? 'Middle'
                            : 'Senior'}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-sm  ${getCategoryBadgeClass(
                            selectedVideo.category
                          )}`}
                        >
                          {selectedVideo.category}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 text-justify">
                        {selectedVideo.description}
                      </p>

                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-amber-600 hover:text-amber-700  "
                      >
                        <FaYoutube className="mr-2 text-xl" />
                        Дивитися на YouTube
                      </a>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-lg">
                    <div className="flex items-center mb-6 border-b border-gray-100 pb-3">
                      <FaInfoCircle className="text-amber-600 mr-2 text-xl" />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Як підготуватися до технічної співбесіди?
                      </h3>
                    </div>

                    <ul className="space-y-6">
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 font-semibold rounded-full w-12 h-10 flex items-center justify-center mr-3 mt-0.5">
                          1
                        </span>
                        <div>
                          <strong className="block mb-1 text-lg">
                            Повторіть основи
                          </strong>
                          <p className="text-gray-600">
                            Зосередьтеся на фундаментальних концепціях вашої
                            галузі. Вони часто є основою технічних запитань.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 font-semibold rounded-full w-12 h-10 flex items-center justify-center mr-3 mt-0.5">
                          2
                        </span>
                        <div>
                          <strong className="block mb-1 text-lg">
                            Практикуйте алгоритмічні задачі
                          </strong>
                          <p className="text-gray-600">
                            Проходьте завдання на платформах, як LeetCode чи
                            HackerRank, щоб підготуватися до практичних завдань.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-amber-100 text-amber-800 font-semibold rounded-full w-12 h-10 flex items-center justify-center mr-3 mt-0.5">
                          3
                        </span>
                        <div>
                          <strong className="block mb-1 text-lg">
                            Потренуйте пояснення коду
                          </strong>
                          <p className="text-gray-600">
                            Навчіться чітко пояснювати свій код та процес
                            мислення — це важлива навичка для співбесіди.
                          </p>
                        </div>
                      </li>
                    </ul>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        to="/tests"
                        className="inline-flex items-center text-amber-600 hover:text-amber-700  "
                      >
                        Пройти тести для підготовки до співбесіди
                        <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[400px]">
                  <FaVideo className="text-amber-300 text-5xl mb-4" />
                  <p className="text-gray-500 text-lg mb-6">
                    Виберіть відео зі списку
                  </p>
                  <FaChevronDown className="text-gray-400 animate-bounce lg:hidden" />
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden p-5">
                <div className=" border-b border-gray-100">
                  <h3 className="font-bold mb-4 pb-2 text-lg text-gray-800">
                    Доступні відео співбесід
                  </h3>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-4 cursor-pointer hover:bg-amber-50  ${
                        selectedVideo?.id === video.id
                          ? 'bg-amber-50 border-l-4 border-amber-500'
                          : 'border-l-4 border-transparent'
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="flex">
                        <div className="w-32 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative">
                          <img
                            src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black bg-opacity-70 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-600">
                              <FaPlay className="text-white text-xs" />
                            </div>
                          </div>
                          {video.featured && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-1">
                              <FaStar />
                            </div>
                          )}
                        </div>

                        <div className="ml-3 flex-grow">
                          <h4 className=" text-lg line-clamp-3 group-hover:text-amber-600">
                            {video.title}
                          </h4>
                          <div className="flex mt-1 space-x-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${getLevelBadgeClass(
                                video.level
                              )}`}
                            >
                              {video.level}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${getCategoryBadgeClass(
                                video.category
                              )}`}
                            >
                              {video.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {videos.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-lg mb-2">
                        Відео за обраними фільтрами не знайдено
                      </p>
                      <button
                        onClick={() => setFilters({ category: '', level: '' })}
                        className="text-amber-600 hover:text-amber-700 "
                      >
                        Скинути фільтри
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-5 text-md">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-100">
                  Ресурси для підготовки
                </h3>
                <ul className="space-y-3 ">
                  <li>
                    <a
                      href="https://www.frontendmentor.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center py-2 px-3 rounded-md hover:bg-amber-50  group"
                    >
                      <div className="bg-amber-100 p-2 rounded-full mr-3 group-hover:bg-amber-200 ">
                        <FaExternalLinkAlt className="text-amber-700 text-md" />
                      </div>
                      <span className="text-gray-700 group-hover:text-amber-700 ">
                        Frontend Mentor - Практичні завдання
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://leetcode.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center py-2 px-3 rounded-md hover:bg-amber-50  group"
                    >
                      <div className="bg-amber-100 p-2 rounded-full mr-3 group-hover:bg-amber-200 ">
                        <FaExternalLinkAlt className="text-amber-700 text-md" />
                      </div>
                      <span className="text-gray-700 group-hover:text-amber-700 ">
                        LeetCode - Алгоритмічні задачі
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.hackerrank.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center py-2 px-3 rounded-md hover:bg-amber-50  group"
                    >
                      <div className="bg-amber-100 p-2 rounded-full mr-3 group-hover:bg-amber-200 ">
                        <FaExternalLinkAlt className="text-amber-700 text-md" />
                      </div>
                      <span className="text-gray-700 group-hover:text-amber-700 ">
                        HackerRank - Завдання з програмування
                      </span>
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/directories"
                      className="flex items-center py-2 px-3 rounded-md hover:bg-amber-50  group"
                    >
                      <div className="bg-amber-100 p-2 rounded-full mr-3 group-hover:bg-amber-200 ">
                        <FaExternalLinkAlt className="text-amber-700 text-md" />
                      </div>
                      <span className="text-gray-700 group-hover:text-amber-700 ">
                        Довідники
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-5">
                <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-lg">Останні новини</h3>
                </div>

                <ArticleSidebar currentArticleId={null} limit={2} />

                <div className="mt-4 text-center">
                  <Link
                    to="/articles"
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 "
                  >
                    Переглянути всі статті
                    <FaArrowRight className="ml-2 text-sm" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Готові перевірити свої знання?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Перевірте себе на реальних тестах та завданнях, які часто
            зустрічаються на технічних співбесідах.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tests"
              className="bg-white text-amber-600  text-lg py-4 px-8 rounded-md hover:bg-gray-100  shadow-md"
            >
              Пройти тести
            </Link>
            <Link
              to="/articles"
              className="bg-transparent text-white border-2 border-white  text-lg py-4 px-8 rounded-md hover:bg-white hover:text-amber-600 "
            >
              Читати статті
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
