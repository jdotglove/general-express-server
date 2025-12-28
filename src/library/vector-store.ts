import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});
const vectorStore = new Chroma(embeddings, {
    chromaCloudAPIKey: process.env.CHROMA_API_KEY,
    collectionName: "documents-collection",
    clientParams: {
        host: "api.trychroma.com",
        port: 8000,
        ssl: true,
        tenant: process.env.CHROMA_TENANT,
        database: process.env.CHROMA_DATABASE,
      },
});

export default vectorStore;