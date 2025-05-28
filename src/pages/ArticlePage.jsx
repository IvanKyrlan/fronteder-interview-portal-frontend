import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import ArticleList from '../components/article/ArticleList';
import Pagination from '../components/common/Pagination';
import articleService from '../services/articleService';
import { FaBookOpen, FaSync, FaArrowRight } from 'react-icons/fa';

export default function ArticlePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFilter = searchParams.get('filter') || 'all';
  const [activeTab, setActiveTab] = useState(initialFilter);

  const itemsPerPage = 12;
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const filterTypes = {
    all: 'Всі',
    tasks: 'Завдання',
    news: 'Новини',
    best: 'Краще',
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let data;

        switch (activeTab) {
          case 'best':
            data = await articleService.getFeaturedArticles();
            break;
          case 'tasks':
            data = await articleService.getArticlesByType('task');
            break;
          case 'news':
            data = await articleService.getArticlesByType('news');
            break;
          default:
            data = await articleService.getArticles();
        }

        if (data && data.length > 0) {
          if (activeTab === 'tasks') {
            data = data.filter((article) => article.article_type === 'task');
          } else if (activeTab === 'news') {
            data = data.filter((article) => article.article_type === 'news');
          }
        }

        setArticles(data);

        setTotalPages(Math.ceil(data.length / itemsPerPage));

        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Не вдалося завантажити статті');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    document.title = `Новини IT технологій та статті - ${
      filterTypes[activeTab] || 'Всі статті'
    } | Frontender - підготовка до співбесід`;

    setSearchParams({
      filter: activeTab !== 'all' ? activeTab : undefined,
      page: currentPage !== 1 ? currentPage : undefined,
    });
  }, [activeTab, currentPage, setSearchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const getCurrentArticles = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return articles.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-gradient-to-b from-neutral-800 to-neutral-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Новини IT технологій та статті
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            Актуальні статті, туторіали та корисні матеріали для підготовки до
            технічних співбесід та вдосконалення навичок Frontend розробки.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
            <div className="flex items-center">
              <FaBookOpen className="text-amber-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Публікації</h2>
            </div>

            <div className="flex flex-wrap gap-3 ">
              {Object.entries(filterTypes).map(([key, label]) => (
                <button
                  key={key}
                  className={`px-5 py-2 rounded-md ${
                    activeTab === key
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-600 hover:text-white'
                  }`}
                  onClick={() => handleTabChange(key)}
                  aria-current={activeTab === key ? 'page' : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
                <p className="text-gray-600">Завантаження статей...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <div className="text-xl text-red-500 mb-6">{error}</div>
              <button
                onClick={() => handleTabChange(activeTab)}
                className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700  shadow-md"
              >
                <FaSync className="mr-2" />
                Спробувати знову
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md ">
              <div className="text-lg text-gray-600 mb-6">
                {`Немає статей у категорії "${filterTypes[activeTab]}"`}
              </div>
              {activeTab !== 'all' && (
                <button
                  onClick={() => handleTabChange('all')}
                  className="text-md inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700  shadow-md"
                >
                  Показати всі статті
                </button>
              )}
            </div>
          ) : (
            <>
              <ArticleList articles={getCurrentArticles()} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Бажаєте поділитися знаннями?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Маєте досвід і хочете поділитися своїми знаннями з іншими
            розробниками? Приєднуйтесь до нашої спільноти авторів та отримайте
            можливість публікувати власні статті на Frontender.
          </p>
          <Link
            to="/contacts"
            className="inline-flex items-center px-8 py-4 bg-white text-amber-600  text-lg rounded-md hover:bg-gray-100  shadow-md"
          >
            Стати автором
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
