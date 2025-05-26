import api from "./api";

const articleService = {
  async getArticles(params = {}) {
    try {
      const response = await api.get("articles/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }
  },

  async getFeaturedArticles() {
    try {
      const response = await api.get("articles/", {
        params: { featured: true },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      throw error;
    }
  },

  async getArticlesByType(type) {
    try {
      const response = await api.get("articles/", {
        params: { article_type: type },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} articles:`, error);
      throw error;
    }
  },

  async getArticle(slug) {
    try {
      const response = await api.get(`articles/${slug}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching article ${slug}:`, error);
      throw error;
    }
  },
};

export default articleService;
