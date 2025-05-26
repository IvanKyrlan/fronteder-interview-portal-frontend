import api from "./api";

const cache = {
  currentTest: null,
};

const testService = {
  async getTests() {
    const response = await api.get("tests/");
    return response.data;
  },

  async getTest(testId) {
    const response = await api.get(`tests/${testId}/`);
    return response.data;
  },

  async getTestWithQuestions(testId) {
    try {
      console.log(`Fetching test with ID: ${testId}`);

      const response = await api.get(`tests/${testId}/`);
      console.log("API Response:", response.data);

      if (!response.data.questions || !Array.isArray(response.data.questions)) {
        console.error("No questions array in API response:", response.data);

        let questions = [];

        if (
          response.data.test_questions &&
          Array.isArray(response.data.test_questions)
        ) {
          questions = response.data.test_questions;
        } else {
          const questionsResponse = await api.get(`tests/${testId}/questions/`);
          questions = questionsResponse.data;
          console.log("Fetched questions separately:", questions);
        }

        const testWithQuestions = {
          ...response.data,
          questions: questions,
        };

        cache.currentTest = testWithQuestions;
        return testWithQuestions;
      }

      cache.currentTest = response.data;
      return response.data;
    } catch (error) {
      console.error("Error fetching test with questions:", error);

      if (cache.currentTest) {
        console.log("Returning cached test data");
        return cache.currentTest;
      }

      throw error;
    }
  },

  clearCurrentTestCache() {
    cache.currentTest = null;
    console.log("Test cache cleared");
  },

  async saveTestResult(testId, score, correctAnswers, totalQuestions) {
    const response = await api.post("user/progress/", {
      test_id: testId,
      score: score,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
    });
    return response.data;
  },

  async getTestProgress(testId) {
    const response = await api.get(`user/progress/${testId}/`);
    return response.data;
  },

  async getTestAttempts(testId) {
    const response = await api.get(`user/test-attempts/${testId}/`);
    return response.data;
  },

  async getUserProgress() {
    const response = await api.get("user/progress/");
    return response.data;
  },
};

export default testService;
