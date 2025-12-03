import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import 'dotenv/config';

async function testEmbeddings() {
    console.log("Testing embeddings...");
    try {
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "text-embedding-004",
        });

        console.log("Generating embedding for 'test query'...");
        const res = await embeddings.embedQuery("test query");
        console.log("Success! Embedding length:", res.length);
    } catch (error) {
        console.error("Error generating embedding:", error);
    }
}

testEmbeddings();
