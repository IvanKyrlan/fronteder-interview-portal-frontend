import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ForumHeader from '../components/forum/ForumHeader';
import ForumActionBar from '../components/forum/ForumActionBar';
import ForumCategories from '../components/forum/ForumCategories';
import TopicsList from '../components/forum/TopicsList';
import CreateTopicModal from '../components/forum/CreateTopicModal';
import Pagination from '../components/common/Pagination';
import SavedTopics from '../components/forum/SavedTopics';

import forumService from '../services/forumService';
import useForum from '../hooks/useForum';

const ForumPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookmarkRefreshTrigger, setBookmarkRefreshTrigger] = useState(0);

  const { categories, categoriesLoading, getCategoryName, createTopic } =
    useForum();

  const [topics, setTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [activeCategory, setActiveCategory] = useState(
    initialCategory === 'undefined' ? 'all' : initialCategory
  );
  const [searchTerm, setSearchTerm] = useState(
    initialSearch === 'undefined' ? '' : initialSearch
  );
  const [sortBy, setSortBy] = useState(
    initialSort === 'undefined' ? 'newest' : initialSort
  );
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalTopics, setTotalTopics] = useState(0);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  const itemsPerPage = 10;

  useEffect(() => {
    const hasUndefinedParams =
      activeCategory === 'undefined' ||
      searchTerm === 'undefined' ||
      sortBy === 'undefined';

    if (hasUndefinedParams) {
      setSearchParams({
        category: activeCategory !== 'undefined' ? activeCategory : 'all',
        search: searchTerm !== 'undefined' ? searchTerm : undefined,
        sort: sortBy !== 'undefined' ? sortBy : 'newest',
      });

      if (activeCategory === 'undefined') setActiveCategory('all');
      if (searchTerm === 'undefined') setSearchTerm('');
      if (sortBy === 'undefined') setSortBy('newest');
    }
  }, [activeCategory, searchTerm, sortBy, setSearchParams]);

  const fetchAllTopics = useCallback(async () => {
    try {
      const data = await forumService.getTopics();
      setAllTopics(data);

      const counts = { all: data.length };
      categories.forEach((cat) => {
        if (cat.id !== 'all') {
          counts[cat.id] = data.filter(
            (topic) => topic.category === cat.id
          ).length;
        }
      });
      setCategoryCounts(counts);
    } catch (err) {
      console.error('Error fetching all topics:', err);
    }
  }, [categories]);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'all' && activeCategory !== 'undefined') {
        params.category = activeCategory;
      }
      if (searchTerm && searchTerm !== 'undefined') {
        params.search = searchTerm;
      }

      params.sort_by = sortBy;

      const data = await forumService.getTopics(params);
      setTopics(data);
      setTotalTopics(data.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Не вдалося завантажити теми');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, sortBy, searchTerm]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchAllTopics();
    }
  }, [categories, fetchAllTopics]);

  useEffect(() => {
    document.title = 'Форум | Frontender - Підготовка до співбесід';

    if (
      activeCategory !== 'undefined' &&
      searchTerm !== 'undefined' &&
      sortBy !== 'undefined'
    ) {
      fetchTopics();
    }

    return () => {
      document.title = 'Frontender';
    };
  }, [fetchTopics, activeCategory, searchTerm, sortBy]);

  useEffect(() => {
    if (topics.length === 0) {
      setFilteredTopics([]);
      return;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setFilteredTopics(topics.slice(indexOfFirstItem, indexOfLastItem));

    const params = {};
    if (
      activeCategory &&
      activeCategory !== 'all' &&
      activeCategory !== 'undefined'
    ) {
      params.category = activeCategory;
    }
    if (searchTerm && searchTerm !== 'undefined') {
      params.search = searchTerm;
    }
    if (sortBy && sortBy !== 'newest' && sortBy !== 'undefined') {
      params.sort = sortBy;
    }
    if (currentPage && currentPage !== 1) {
      params.page = currentPage;
    }

    setSearchParams(params);
  }, [
    topics,
    currentPage,
    activeCategory,
    sortBy,
    searchTerm,
    setSearchParams,
  ]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
    setCurrentPage(1);
  };

  const handleCreateTopic = () => {
    setIsCreateModalOpen(true);
  };

  const handleTopicCreated = async (topicData) => {
    try {
      const createdTopic = await createTopic(topicData);

      await fetchTopics();
      await fetchAllTopics();

      setIsCreateModalOpen(false);

      navigate(`/forum/topics/${createdTopic.id}`);
    } catch (error) {
      console.error('Error handling topic creation:', error);
    }
  };

  const totalPages = Math.ceil(totalTopics / itemsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ForumHeader />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-grow">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ForumActionBar
                onCreateTopic={handleCreateTopic}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onSearch={handleSearch}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                isAuthenticated={isAuthenticated}
              />

              <ForumCategories
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                categoryCounts={categoryCounts}
                loading={categoriesLoading}
              />

              <TopicsList
                topics={filteredTopics}
                loading={loading}
                error={error}
                resetFilters={handleResetFilters}
                searchTerm={searchTerm}
                activeCategory={activeCategory}
                categoryName={getCategoryName(activeCategory)}
              />

              {!loading && !error && totalPages > 1 && (
                <div className="p-5 border-t border-gray-100">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-80">
            {isAuthenticated && (
              <SavedTopics refreshTrigger={bookmarkRefreshTrigger} />
            )}
          </div>
        </div>
      </div>

      <CreateTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleTopicCreated}
        categories={categories.filter((c) => c.id !== 'all')}
      />
    </div>
  );
};

export default ForumPage;
