import api from "./api";

const forumService = {
  async getTopics(params = {}) {
    try {
      const queryParams = { ...params };

      if (queryParams.sort_by) {
        if (queryParams.sort_by === "created_at") {
          queryParams.sort_by = "newest";
        } else if (queryParams.sort_by === "-created_at") {
          queryParams.sort_by = "oldest";
        }
      }

      try {
        const response = await api.get("forum/topics/", {
          params: queryParams,
        });
        return response.data;
      } catch (searchError) {
        console.error("Error with search:", searchError);

        if (queryParams.search) {
          return [];
        }
        throw searchError;
      }
    } catch (error) {
      console.error("Error fetching forum topics:", error);

      return [];
    }
  },

  async getTopic(topicId) {
    try {
      const response = await api.get(`forum/topics/${topicId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching forum topic ${topicId}:`, error);
      throw error;
    }
  },

  async createTopic(topicData) {
    try {
      const response = await api.post("forum/topics/", topicData);
      return response.data;
    } catch (error) {
      console.error("Error creating forum topic:", error);
      throw error;
    }
  },

  async updateTopic(topicId, topicData) {
    try {
      const response = await api.put(`forum/topics/${topicId}/`, topicData);
      return response.data;
    } catch (error) {
      console.error(`Error updating forum topic ${topicId}:`, error);
      throw error;
    }
  },

  async deleteTopic(topicId) {
    try {
      const response = await api.delete(`forum/topics/${topicId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting forum topic ${topicId}:`, error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await api.get("forum/categories/");
      return response.data;
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      throw error;
    }
  },

  async getComments(topicId) {
    try {
      const response = await api.get("/api/comments/", {
        params: {
          content_type: "forum.forumtopic",
          object_id: topicId,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for topic ${topicId}:`, error);
      return [];
    }
  },

  async addComment(topicId, commentData) {
    try {
      const data = {
        ...commentData,
        content_type: "forum.forumtopic",
        object_id: topicId,
        data_processing_agreed: true,
      };
      const response = await api.post("/api/comments/create/", data);
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to topic ${topicId}:`, error);
      throw error;
    }
  },

  async likeTopic(topicId) {
    try {
      const response = await api.post(`forum/topics/${topicId}/like/`);
      return response.data;
    } catch (error) {
      console.error(`Error liking forum topic ${topicId}:`, error);
      throw error;
    }
  },

  async unlikeTopic(topicId) {
    try {
      const response = await api.post(`forum/topics/${topicId}/unlike/`);
      return response.data;
    } catch (error) {
      console.error(`Error unliking forum topic ${topicId}:`, error);
      throw error;
    }
  },

  async bookmarkTopic(topicId) {
    try {
      const response = await api.post(`forum/topics/${topicId}/bookmark/`);
      return response.data;
    } catch (error) {
      console.error(`Error bookmarking forum topic ${topicId}:`, error);
      throw error;
    }
  },

  async unbookmarkTopic(topicId) {
    try {
      const response = await api.post(`forum/topics/${topicId}/unbookmark/`);
      return response.data;
    } catch (error) {
      console.error(`Error unbookmarking forum topic ${topicId}:`, error);
      throw error;
    }
  },

  async getUserBookmarks() {
    try {
      const response = await api.get("forum/user/bookmarks/");
      return response.data;
    } catch (error) {
      console.error("Error fetching user bookmarks:", error);
      return [];
    }
  },
};

export default forumService;
