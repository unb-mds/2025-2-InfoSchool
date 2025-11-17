module.exports = {
  retrieval: {
    // Vector Search
    vector: {
      topK: 5,
      similarityThreshold: 0.7,
    },
    // Sparse Search (BM25)
    sparse: {
      topK: 5,
      bm25: {
        k1: 1.2,
        b: 0.75,
      },
    },
    // Hybrid Fusion
    hybrid: {
      method: "RRF", // Reciprocal Rank Fusion
      k: 60,
      finalTopK: 10,
    },
  },
  chunks: {
    size: 512,
    overlap: 50,
  },
  models: {
    embedding: "text-embedding-ada-002",
    llm: "gpt-3.5-turbo",
  },
};
