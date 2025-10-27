// Usando PostgreSQL com pgvector ou MongoDB com vetores
const { Pool } = require("pg");

class VectorStoreService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.initVectorExtension();
  }

  async initVectorExtension() {
    try {
      await this.pool.query("CREATE EXTENSION IF NOT EXISTS vector");
      await this.pool.query(`
                CREATE TABLE IF NOT EXISTS school_embeddings (
                    id SERIAL PRIMARY KEY,
                    school_id VARCHAR(50),
                    embedding vector(1536),
                    document_text TEXT,
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            `);
    } catch (error) {
      console.error("Erro inicializando vector store:", error);
    }
  }

  async storeEmbedding(schoolId, embedding, documentText, metadata) {
    const query = `
            INSERT INTO school_embeddings (school_id, embedding, document_text, metadata)
            VALUES ($1, $2, $3, $4)
        `;

    await this.pool.query(query, [schoolId, embedding, documentText, metadata]);
  }

  async similaritySearch(embedding, limit = 5) {
    const query = `
            SELECT school_id, document_text, metadata,
                   embedding <-> $1 as similarity
            FROM school_embeddings
            ORDER BY similarity ASC
            LIMIT $2
        `;

    const result = await this.pool.query(query, [embedding, limit]);
    return result.rows;
  }
}

module.exports = VectorStoreService;
