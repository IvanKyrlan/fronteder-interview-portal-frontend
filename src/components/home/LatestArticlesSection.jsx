import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import articleService from '../../services/articleService';
import { formatDateLocale } from '../../utils/dateUtils';
import Pagination from '../common/Pagination';

export default function LatestArticlesSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 3;
  const totalPages = articles
    ? Math.ceil(articles.length / articlesPerPage)
    : 0;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await articleService.getArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles for homepage:', err);
        setError('Не вдалося завантажити статті');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document
      .querySelector('.latest-articles-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getCurrentArticles = () => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    return articles.slice(indexOfFirstArticle, indexOfLastArticle);
  };

  const getArticleTypeStyles = (type) => {
    return type === 'task'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  return (
    <section className="py-16 bg-white latest-articles-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Останні статті</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="text-xl text-red-500">{error}</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-xl text-gray-600">Статті відсутні</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getCurrentArticles().map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                    {article.thumbnail ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="w-full h-full object-cover transition duration-700 ease-in-out transform group-hover:scale-105"
                        />
                        <div className="absolute top-0 left-0 m-4">
                          <span
                            className={`text-xs font-semibold inline-block py-1 px-2 rounded ${getArticleTypeStyles(
                              article.article_type
                            )}`}
                          >
                            {article.article_type_display}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">
                          Зображення відсутнє
                        </span>
                        <div className="absolute top-0 left-0 m-4">
                          <span
                            className={`text-xs font-semibold inline-block py-1 px-2 rounded ${getArticleTypeStyles(
                              article.article_type
                            )}`}
                          >
                            {article.article_type_display}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-grow text-lg">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 ">
                        {article.title}
                      </h3>

                      <div
                        className="text-gray-600 mb-4 line-clamp-3 flex-grow"
                        dangerouslySetInnerHTML={{
                          __html: article.description,
                        }}
                      />

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="text-gray-500 text-sm">
                          {formatDateLocale(article.published_at)}
                        </span>

                        <span className="text-amber-600 group-hover:text-amber-700  text-sm flex items-center">
                          Читати далі
                          <FaArrowRight
                            size={12}
                            className="ml-1 group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <div className="text-center mt-12">
          <Link
            to="/articles"
            className="inline-flex items-center text-lg  text-amber-600 hover:text-amber-700 "
          >
            Переглянути всі статті
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
