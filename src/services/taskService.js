import api from "./api";

const taskService = {
  async getInteractiveTasks(testId) {
    const response = await api.get(`tests/${testId}/tasks/`);
    return response.data;
  },

  async getTaskDetail(taskId) {
    const response = await api.get(`tasks/${taskId}/`);
    return response.data;
  },

  async submitTaskSolution(taskId, code, language = null) {
    const payload = {
      task_id: taskId,
      code: code,
    };

    if (language) {
      payload.language = language;
    }

    const response = await api.post("tasks/submit/", payload);
    return response.data;
  },

  async getTaskProgress(testId) {
    const response = await api.get(`user/task-progress/${testId}/`);
    return response.data;
  },

  async getAllTaskProgress() {
    const response = await api.get("user/task-progress/");
    return response.data;
  },

  async getTaskAttempts(testId) {
    const response = await api.get(`user/task-attempts/${testId}/`);
    return response.data;
  },

  async getTaskAttemptsByTask(taskId) {
    const response = await api.get(`user/task-attempts/task/${taskId}/`);
    return response.data;
  },
};

export default taskService;
