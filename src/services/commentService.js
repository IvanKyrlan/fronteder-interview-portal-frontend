import api from "./api";
import { formatDateLocale } from "../utils/dateUtils";

const commentService = {
  getComments: async (contentType, objectId) => {
    try {
      const response = await api.get("comments/", {
        params: {
          content_type: contentType,
          object_id: objectId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  },

  createComment: async (data) => {
    try {
      const response = await api.post("comments/create/", data);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  formatDateLocale: (dateString) => {
    return formatDateLocale(dateString);
  },
};

export default commentService;
