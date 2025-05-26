import { formatDateLocale } from "../utils/dateUtils";

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";

  let cleanText = text.replace(/```[\s\S]*?```/g, "[код]");

  cleanText = cleanText.replace(/\s+/g, " ").trim();

  if (cleanText.length > maxLength) {
    return cleanText.substring(0, maxLength) + "...";
  }

  return cleanText;
};

export const getCategoryColor = (category) => {
  switch (category) {
    case "technical":
      return "bg-blue-500";
    case "interview":
      return "bg-purple-500";
    case "career":
      return "bg-green-500";
    case "other":
      return "bg-gray-500";
    default:
      return "bg-amber-500";
  }
};

export const handleError = (error) => {
  if (error.response) {
    if (error.response.data && error.response.data.detail) {
      return error.response.data.detail;
    }
    if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    if (error.response.status === 404) {
      return "Ресурс не знайдено";
    }
    if (error.response.status === 401) {
      return "Необхідна авторизація";
    }
    if (error.response.status === 403) {
      return "Доступ заборонено";
    }
    if (error.response.status === 500) {
      return "Помилка на сервері";
    }
  } else if (error.request) {
    return "Немає відповіді від сервера";
  }

  return error.message || "Сталася помилка";
};

export { formatDateLocale };
