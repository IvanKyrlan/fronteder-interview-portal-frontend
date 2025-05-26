import { useState, useEffect, useCallback } from "react";
import forumService from "../services/forumService";
import { toast } from "react-toastify";

export const useForum = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await forumService.getCategories();
      const allCategories = [{ id: "all", name: "Всі категорії" }, ...data];
      setCategories(allCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Не вдалося завантажити категорії");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const getCategoryColor = useCallback((categoryId) => {
    switch (categoryId) {
      case "technical":
        return "bg-blue-500";
      case "interview":
        return "bg-purple-500";
      case "career":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  }, []);

  const getCategoryName = useCallback(
    (categoryId) => {
      if (categoryId === "undefined") return "Невідома категорія";
      if (categoryId === "all") return "Всі категорії";
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.name : "Невідома категорія";
    },
    [categories]
  );

  const createTopic = useCallback(async (topicData) => {
    try {
      const result = await forumService.createTopic(topicData);
      toast.success("Тему успішно створено!");
      return result;
    } catch (error) {
      console.error("Error creating topic:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Помилка при створенні теми";
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const toggleBookmark = useCallback(async (topicId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await forumService.unbookmarkTopic(topicId);
        toast.info("Тему видалено з закладок");
        return false;
      } else {
        await forumService.bookmarkTopic(topicId);
        toast.success("Тему додано до закладок");
        return true;
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Помилка при роботі з закладками";
      toast.error(errorMessage);
      return isBookmarked;
    }
  }, []);

  const toggleLike = useCallback(async (topicId, isLiked) => {
    try {
      if (isLiked) {
        await forumService.unlikeTopic(topicId);
        return false;
      } else {
        await forumService.likeTopic(topicId);
        return true;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Помилка при роботі з лайками";
      toast.error(errorMessage);
      return isLiked;
    }
  }, []);

  const editTopic = useCallback(async (topicId, topicData) => {
    try {
      const result = await forumService.updateTopic(topicId, topicData);
      toast.success("Тему успішно оновлено!");
      return result;
    } catch (error) {
      console.error("Error updating topic:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Помилка при оновленні теми";
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    categoriesLoading,
    fetchCategories,
    getCategoryColor,
    getCategoryName,
    createTopic,
    editTopic,
    toggleBookmark,
    toggleLike,
  };
};

export default useForum;
