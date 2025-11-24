const axios = require("axios");

class EmbeddingService {
  constructor() {
    // Opção 1: Usar API OpenAI
    this.apiKey = process.env.OPENAI_API_KEY;
    // Opção 2: Usar modelo local (all-MiniLM-L6-v2 via API)
    this.localEmbeddingUrl = process.env.LOCAL_EMBEDDING_URL;
  }

  async generateEmbedding(text) {
    try {
      if (this.apiKey) {
        return await this.openAIEmbedding(text);
      } else {
        return await this.localEmbedding(text);
      }
    } catch (error) {
      console.error("Erro gerando embedding:", error);
      throw error;
    }
  }

  async openAIEmbedding(text) {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: text,
        model: "text-embedding-ada-002",
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data[0].embedding;
  }

  async localEmbedding(text) {
    const response = await axios.post(this.localEmbeddingUrl, {
      text: text,
    });
    return response.data.embedding;
  }
}

module.exports = EmbeddingService;
