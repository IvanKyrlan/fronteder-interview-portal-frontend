import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaHome,
  FaChevronRight,
  FaArrowLeft,
  FaShareAlt,
  FaFacebook,
  FaTelegram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ArticleDetail from "../components/article/ArticleDetail";
import ArticleSidebar from "../components/article/ArticleSidebar";
import Comments from "../components/common/Comments";
import articleService from "../services/articleService";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareButtons, setShowShareButtons] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await articleService.getArticle(slug);
        setArticle(data);
        setError(null);

        document.title = `${data.title} | Frontender - IT Новини`;
      } catch (err) {
        console.error(`Error fetching article ${slug}:`, err);
        setError("Не вдалося завантажити статтю");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);

    return () => {
      document.title = "Frontender";
    };
  }, [slug]);

  const handleShare = () => {
    setShowShareButtons(!showShareButtons);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-gray-600">Завантаження статті...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-xl text-red-500 mb-4">
            {error || "Статтю не знайдено"}
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 "
          >
            <FaArrowLeft className="mr-2" />
            Повернутися до списку статей
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="py-12 bg-gradient-to-t from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <span className="inline-block px-3 py-1 bg-white text-amber-600 rounded-full text-sm font-bold mb-3">
            {article.article_type_display}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center py-4 mb-6 text-gray-600">
          <Link
            to="/"
            className="flex items-center hover:text-gray-800 transition-colors"
          >
            <FaHome className="mr-1" />
            <span>Головна</span>
          </Link>
          <FaChevronRight className="mx-2" size={12} />
          <Link
            to="/articles"
            className="hover:text-gray-800 transition-colors"
          >
            IT Статті
          </Link>
          <FaChevronRight className="mx-2" size={12} />
          <span className="text-gray-800  truncate max-w-md">
            {article.title}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <ArticleDetail article={article} />

              <div className="p-6 border-t border-gray-100 ">
                <div className="flex flex-wrap items-center justify-between">
                  <Link
                    to="/articles"
                    className="flex items-center text-amber-600 hover:text-amber-700  transition-colors text-md"
                  >
                    <FaArrowLeft className="mr-2" />
                    Назад до списку статей
                  </Link>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="flex items-center text-amber-600 hover:text-amber-700  transition-colors text-md"
                    >
                      <FaShareAlt className="mr-2" />
                      Поділитися
                    </button>

                    {showShareButtons && (
                      <div className="absolute right-0 bottom-10 bg-white rounded-lg shadow-md p-3 flex space-x-3 z-10">
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            currentUrl
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                          <FaFacebook />
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(
                            currentUrl
                          )}&text=${encodeURIComponent(article.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                        >
                          <FaTelegram />
                        </a>
                        <a
                          href={`https://x.com/intent/tweet?url=${encodeURIComponent(
                            currentUrl
                          )}&text=${encodeURIComponent(article.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                          <FaXTwitter />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 md:p-8 shadow-md mb-8">
              <Comments contentType="articles.article" objectId={article.id} />
            </div>
          </div>

          <div className="md:w-80 lg:w-96">
            <div className="sticky top-20">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                  Більше статей
                </h2>
                <ArticleSidebar currentArticleId={article.id} limit={4} />
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Готові до практики?</h3>
                <p className="mb-4">
                  Перевірте свої знання, пройшовши інтерактивні тести та
                  виконавши практичні завдання.
                </p>
                <Link
                  to="/tests"
                  className="inline-block bg-white text-amber-600  py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                >
                  Перейти до тестів
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
