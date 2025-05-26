import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

import TopicContent from "../components/forum/TopicContent";
import CommentEditor from "../components/forum/CommentEditor";
import CommentItem from "../components/forum/CommentItem";
import AuthorInfo from "../components/forum/AuthorInfo";
import CreateTopicModal from "../components/forum/CreateTopicModal";

import forumService from "../services/forumService";
import commentService from "../services/commentService";
import useForum from "../hooks/useForum";
import { handleError } from "../utils/formatUtils";

const ForumTopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { toggleBookmark, toggleLike, editTopic } = useForum();

  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const commentInputRef = useRef(null);

  useEffect(() => {
    const fetchTopicData = async () => {
      setLoading(true);
      try {
        const topicData = await forumService.getTopic(topicId);

        document.title = `${topicData.title} | Frontender - Підготовка до співбесід`;

        const commentsData = await commentService.getComments(
          "forum.forumtopic",
          topicId
        );

        if (isAuthenticated) {
          try {
            const userBookmarks = await forumService.getUserBookmarks();
            setIsBookmarked(userBookmarks.some((t) => t.id === topicData.id));

            setUserLiked(topicData.user_has_liked || false);
          } catch (e) {
            console.error("Error getting user preferences:", e);
          }
        }

        setTopic(topicData);
        setComments(commentsData);
        setLikeCount(topicData.likes_count || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching topic:", err);
        setError(handleError(err));
        setLoading(false);
      }
    };

    fetchTopicData();

    return () => {
      document.title = "Frontender";
    };
  }, [topicId, isAuthenticated]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.warning("Для додавання в закладки необхідно увійти в систему");
      return;
    }

    const newState = await toggleBookmark(topicId, isBookmarked);
    setIsBookmarked(newState);
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.warning("Для оцінки теми необхідно увійти в систему");
      return;
    }

    const newLiked = await toggleLike(topicId, userLiked);
    if (newLiked !== userLiked) {
      setUserLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    }
  };

  const handleEditClick = () => {
    if (!isAuthenticated || !user || user.username !== topic?.author_name) {
      toast.warning("У вас немає прав для редагування цієї теми");
      return;
    }

    setIsEditModalOpen(true);
  };

  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    if (isEditModalOpen) {
      const loadCategories = async () => {
        try {
          const categoryData = await forumService.getCategories();
          setAllCategories(categoryData);
        } catch (error) {
          console.error("Error loading categories for edit:", error);
          toast.error("Не вдалося завантажити категорії");
        }
      };

      loadCategories();
    }
  }, [isEditModalOpen]);

  const handleTopicEdited = async (topicData) => {
    try {
      const updatedTopic = await editTopic(topicId, topicData);
      setTopic(updatedTopic);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating topic:", error);
      toast.error("Не вдалося оновити тему");
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.warning("Для додавання коментарів необхідно увійти в систему");
      return;
    }

    if (!commentText.trim()) {
      toast.warning("Коментар не може бути порожнім");
      return;
    }

    setSubmittingComment(true);

    try {
      const newComment = {
        content: commentText,
        author_name: user.username,
        content_type: "forum.forumtopic",
        object_id: topicId,
        data_processing_agreed: true,
        has_code: commentText.includes("```"),
      };

      const createdComment = await commentService.createComment(newComment);
      setComments([createdComment, ...comments]);

      if (topic && typeof topic.comments_count !== "undefined") {
        setTopic({
          ...topic,
          comments_count: (topic.comments_count || 0) + 1,
        });
      }

      setCommentText("");
      toast.success("Коментар успішно додано");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error(handleError(error));
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-600 border-t-transparent mb-3"></div>
          <p className="text-gray-500 text-sm">Завантаження теми...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-md w-full">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-3" />
          <div className="text-lg text-red-500 mb-4 font-medium">
            {error || "Тему не знайдено"}
          </div>
          <Link
            to="/forum"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" size={14} />
            Повернутися до списку тем
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <TopicContent
          topic={topic}
          commentsCount={comments.length}
          isBookmarked={isBookmarked}
          userLiked={userLiked}
          likeCount={likeCount}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          isAuthenticated={isAuthenticated}
        />

        <AuthorInfo
          authorName={topic.author_name}
          authorId={topic.author}
          joinDate={null}
          canEdit={
            isAuthenticated && user && user.username === topic.author_name
          }
          onEditClick={handleEditClick}
        />

        {isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Додати коментар
            </h3>

            <CommentEditor
              value={commentText}
              onChange={setCommentText}
              onSubmit={handleSubmitComment}
              isSubmitting={submittingComment}
              placeholder="Введіть ваш коментар..."
              submitLabel="Відповісти"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center font-medium">
            <p className="text-gray-500 mb-4">
              Для додавання коментарів необхідно увійти в систему
            </p>
            <Link
              to="/login"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-200 inline-block text-md font-medium"
            >
              Увійти
            </Link>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 font-medium">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
            Відповіді ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Поки що немає відповідей. Будьте першим, хто залишить коментар!
            </div>
          ) : (
            <div className="space-y-5 w-full">
              {" "}
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between mb-8">
          <Link
            to="/forum"
            className="flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors text-md"
          >
            <FaArrowLeft className="mr-2" size={14} />
            Повернутися до списку тем
          </Link>
        </div>
      </div>

      {isEditModalOpen && (
        <CreateTopicModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleTopicEdited}
          categories={
            allCategories.length > 0
              ? allCategories
              : [{ id: topic.category, name: topic.category_display }]
          }
          initialData={topic}
          isEditMode={true}
        />
      )}
    </div>
  );
};

export default ForumTopicPage;
