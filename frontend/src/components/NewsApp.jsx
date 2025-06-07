import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { fetchNews } from '../services/api';

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      try {
        const { results, totalPages,  } = await fetchNews(searchQuery, page);
        setArticles((prev) => (page === 1 ? results : [...prev, ...results]));
        setTotalPages(totalPages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const debounce = setTimeout(getNews, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, page]);

  const handleSearch = (e) => {
    setSearchQuery(DOMPurify.sanitize(e.target.value));
    setPage(1); // Reset to first page on new search
    setArticles([]); // Clear articles for new search
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">News App Developed By Zohaib</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search news..."
            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search news articles"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Articles */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                {article.fields?.thumbnail && (
                  <img
                    src={article.fields.thumbnail}
                    alt={article.webTitle}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{article.webTitle}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{article.sectionName}</p>
                <a
                  href={article.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && page < totalPages && (
          <div className="text-center mt-6">
            <button
              onClick={loadMore}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsApp;