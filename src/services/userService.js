import api from "./api";

const userService = {
  async getUserProgress() {
    try {
      const response = await api.get("user/progress/");
      return response.data;
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return [];
    }
  },

  async getTestProgress(testId) {
    try {
      const response = await api.get(`user/progress/${testId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for test ${testId}:`, error);
      return null;
    }
  },

  async getTestAttempts(testId) {
    try {
      const response = await api.get(`user/test-attempts/${testId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attempts for test ${testId}:`, error);
      return [];
    }
  },

  async saveTestProgress(progressData) {
    try {
      const response = await api.post("user/progress/", progressData);
      console.log("Progress saved successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error saving progress:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getUserTaskProgress() {
    try {
      const response = await api.get("user/task-progress/");
      return response.data;
    } catch (error) {
      console.error("Error fetching user task progress:", error);
      return [];
    }
  },

  async getTaskProgress(testId) {
    try {
      const response = await api.get(`user/task-progress/${testId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task progress for test ${testId}:`, error);
      return {
        completed_tasks: 0,
        total_tasks: 0,
        completion_percentage: 0,
      };
    }
  },
};

export default userService;
