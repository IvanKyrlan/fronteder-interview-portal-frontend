import api from "./api";

const interviewVideoService = {
  getInterviewVideos: async (params = {}) => {
    try {
      const response = await api.get("interviews/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching interview videos:", error);
      throw error;
    }
  },

  getInterviewVideo: async (id) => {
    try {
      const response = await api.get(`interviews/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching interview video ${id}:`, error);
      throw error;
    }
  },
};

export default interviewVideoService;
