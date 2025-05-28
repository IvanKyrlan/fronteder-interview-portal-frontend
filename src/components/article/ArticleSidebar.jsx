import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import articleService from '../../services/articleService';

export default function ArticleSidebar({ currentArticleId, limit = 3 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setLoading(true);
        const data = await articleService.getArticles();
        const filteredArticles = data
          .filter((article) => article.id !== currentArticleId)
          .slice(0, limit);

        setArticles(filteredArticles);
        setError(null);
      } catch (err) {
        console.error('Error fetching related articles:', err);
        setError('Не вдалося завантажити рекомендовані статті');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticleId, limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded mb-4 w-3/4"></div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="mb-4">
            <div className="h-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || articles.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="">
        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.slug}`}
              className="block group"
            >
              <div className="flex flex-col">
                {article.thumbnail ? (
                  <div className="w-full overflow-hidden rounded-lg mb-3">
                    <div className="relative w-full pt-[56.25%]">
                      {' '}
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 ease-in-out transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg mb-3">
                    <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-lg">
                      {' '}
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">
                          Зображення відсутнє
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <h1 className="text-md font-semibold mb-1 group-hover:text-amber-600">
                  {article.title}
                </h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
