import "dotenv/config";

import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import vectorStore from "../vector-store";

export default async function documentIngestion() {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const birthOfTragedyLoader = new TextLoader("src/library/friedrich-nietzsche/documents/birth-of-tragedy.txt");
    const birthOfTragedyDocs = await birthOfTragedyLoader.load();
    const birthOfTragedySplits = await splitter.splitDocuments(birthOfTragedyDocs);
    const stanfordEncyclopediaLoader = new TextLoader("src/library/friedrich-nietzsche/documents/stanford-encyclopedia.txt");
    const stanfordEncyclopediaDocs = await stanfordEncyclopediaLoader.load();
    const stanfordEncyclopediaSplits = await splitter.splitDocuments(stanfordEncyclopediaDocs);

    // Wrap your <add> like this to insert in batches
    const BATCH_SIZE = 300;
    for (let i = 0; i < stanfordEncyclopediaSplits.length; i += BATCH_SIZE) {
        await vectorStore.addDocuments(stanfordEncyclopediaSplits.slice(i, i + BATCH_SIZE));
    }

    for (let i = 0; i < birthOfTragedySplits.length; i += BATCH_SIZE) {
        await vectorStore.addDocuments(birthOfTragedySplits.slice(i, i + BATCH_SIZE));
    }
}