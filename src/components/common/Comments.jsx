import React, { useState, useEffect } from "react";
import { FaUser, FaReply, FaExclamationCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import commentService from "../../services/commentService";

const CommentForm = ({
  onSubmit,
  isReply = false,
  replyTo = null,
  onCancel = null,
}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState(
    isAuthenticated ? user?.username || "" : ""
  );
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!comment.trim()) newErrors.comment = "Коментар не може бути порожнім";
    if (!authorName.trim()) newErrors.authorName = "Ім'я не може бути порожнім";
    if (!agreed) newErrors.agreed = "Ви повинні погодитись на обробку даних";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      content: comment,
      author_name: authorName,
      data_processing_agreed: agreed,
      parent: replyTo,
    });

    setComment("");
    if (!isAuthenticated) setAuthorName("");
    setAgreed(false);
  };

  const handleCommentChange = (e) => {
    if (e.target.value.length <= 200) {
      setComment(e.target.value);
    }
  };

  return (
    <div className={`rounded-lg ${isReply ? "ml-4 md:ml-12 mt-4" : "mb-6"}`}>
      {isReply && (
        <div className="text-sm text-gray-500 mb-3 px-3 pt-3">
          Відповідь на коментар
        </div>
      )}

      <form onSubmit={handleSubmit} className="">
        <div className="mb-2">
          <textarea
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500 ${
              errors.comment ? "border-red-500 bg-red-50" : "border-gray-300"
            } rounded-t-lg transition-all duration-300 ease-in-out ${
              isFocused ? "h-32 md:h-24" : "h-24 md:h-16"
            } outline-none text-base`}
            placeholder="Введіть тут коментар..."
            value={comment}
            onChange={handleCommentChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={200}
          ></textarea>
          {errors.comment && (
            <div className="flex items-center mt-1 text-amber-600 px-3">
              <FaExclamationCircle className="mr-1 flex-shrink-0" />
              <p className="text-sm">{errors.comment}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 pb-3">
          <div className="flex items-center w-full sm:w-auto">
            <div className="mr-2 text-gray-500 flex-shrink-0">
              <FaUser />
            </div>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors resize-none placeholder-gray-500 ${
                errors.authorName
                  ? "border-amber-600 bg-red-50"
                  : "border-gray-300"
              } rounded-b-lg focus:outline-none text-base text-gray-500`}
              placeholder="Вкажіть ваше ім'я"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={isAuthenticated}
            />
          </div>

          {errors.authorName && (
            <div className="flex items-center text-amber-600 ml-6 -mt-2 sm:mt-0">
              <FaExclamationCircle className="mr-1 flex-shrink-0" />
              <p className="text-sm">{errors.authorName}</p>
            </div>
          )}

          <div className="flex items-center mt-3 sm:mt-0 sm:ml-auto">
            <input
              type="checkbox"
              id={isReply ? `data-agree-reply-${replyTo}` : "data-agree"}
              className="w-4 h-4 mt-1 sm:mt-0 bg-white border border-gray-400 rounded 
              checked:bg-white checked:border-gray-400 hover:bg-gray-100 
              focus:ring-0 focus:outline-none flex-shrink-0"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label
              htmlFor={isReply ? `data-agree-reply-${replyTo}` : "data-agree"}
              className="ml-3 text-sm text-gray-500"
            >
              Я погоджуюся на{" "}
              <a
                href="#"
                className="text-amber-600 hover:text-amber-700 underline-none"
              >
                обробку даних
              </a>
            </label>
          </div>

          {errors.agreed && (
            <div className="flex items-center text-amber-600 ml-7 -mt-1 sm:mt-0 w-full sm:w-auto">
              <FaExclamationCircle className="mr-1 flex-shrink-0" />
              <p className="text-sm">{errors.agreed}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          {isReply && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 mr-2 text-gray-500 hover:text-gray-400 transition text-base"
            >
              Скасувати
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition text-base"
          >
            Додати коментар
          </button>
        </div>
      </form>
    </div>
  );
};

const CommentItem = ({ comment, contentType, objectId, onNewComment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formattedDate = commentService.formatDateLocale(comment.created_at);

  const handleReplySubmit = async (formData) => {
    try {
      const newCommentData = {
        ...formData,
        content_type: contentType,
        object_id: objectId,
      };

      const newComment = await commentService.createComment(newCommentData);
      onNewComment(newComment);
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-start gap-2 sm:gap-3 ">
        <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
          <FaUser className="text-gray-700" size={16} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <h4 className="font-bold text-base">{comment.author_name}</h4>
            <span className="text-gray-500 text-xs sm:text-sm">
              {formattedDate}
            </span>
          </div>
          <p className="mt-1 text-base break-words">{comment.content}</p>

          <button
            className="text-gray-500 text-sm flex items-center gap-1 mt-2 hover:text-gray-400"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <FaReply size={14} className="flex-shrink-0" />
            <span>Відповісти</span>
          </button>
        </div>
      </div>

      {showReplyForm && (
        <CommentForm
          onSubmit={handleReplySubmit}
          isReply={true}
          replyTo={comment.id}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 sm:ml-12 mt-4 space-y-4 sm:space-y-6">
          {comment.replies.map((reply) => {
            const formattedReplyDate = commentService.formatDateLocale(
              reply.created_at
            );

            return (
              <div key={reply.id} className="flex items-start gap-2 sm:gap-3">
                <div className="bg-gray-200 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <FaUser className="text-gray-700" size={14} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <h4 className="font-bold text-base">{reply.author_name}</h4>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {formattedReplyDate}
                    </span>
                  </div>
                  <p className="mt-1 text-base break-words">{reply.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Comments = ({ contentType, objectId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await commentService.getComments(contentType, objectId);
        setComments(data);
        setCommentCount(calculateTotalComments(data));
        setError(null);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Не вдалося завантажити коментарі");
      } finally {
        setLoading(false);
      }
    };

    if (contentType && objectId) {
      fetchComments();
    }
  }, [contentType, objectId]);

  const calculateTotalComments = (commentsArray) => {
    return commentsArray.reduce((total, comment) => {
      let count = 1;

      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length;
      }
      return total + count;
    }, 0);
  };

  const handleNewComment = async (formData) => {
    try {
      const newCommentData = {
        ...formData,
        content_type: contentType,
        object_id: objectId,
      };

      const newComment = await commentService.createComment(newCommentData);

      if (!formData.parent) {
        setComments([newComment, ...comments]);
      } else {
        const updatedComments = comments.map((comment) => {
          if (comment.id === formData.parent) {
            const updatedReplies = [...(comment.replies || []), newComment];
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
        setComments(updatedComments);
      }

      setCommentCount((prev) => prev + 1);
      toast.success("Коментар успішно додано");
    } catch (error) {
      toast.error("Помилка додавання коментаря:", error);
    }
  };

  return (
    <div className="mt-4 px-2 sm:px-0">
      <div className="flex items-center justify-between pb-2 mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Коментарі ({commentCount})
        </h3>
      </div>

      <CommentForm onSubmit={handleNewComment} />

      {loading ? (
        <div className="text-center py-4">Завантаження коментарів...</div>
      ) : error ? (
        <div className="text-amber-600 text-center py-4">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500 py-4 text-center sm:text-left border-t-2 border-gray-300">
          Поки що коментарів немає
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 mt-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              contentType={contentType}
              objectId={objectId}
              onNewComment={handleNewComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
