import * as z from "zod";
import { tool } from "@langchain/core/tools";
import vectorStore from "../../library/vector-store";

const retrieveSchema = z.object({ query: z.string() });

const retrieve = tool(
  async ({ query }: any) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      ).join("\n");
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve information related to a query.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
)

export default retrieve;