//File responsible for loading all our data into the datastaxdb
//We will be using the OpenAI API to generate embeddings for our text data
//We will be using the PuppeteerWebBaseLoader to scrape the web pages
//We will be using the RecursiveCharacterTextSplitter to split the text into chunks
//We will be using the DataAPIClient to connect to the database
//We will be using the DataAPIClient to create a collection in the database

import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Let's define the websites we want to scrape
const f1Data = [
  "https://en.wikipedia.org/wiki/Formula_One",
  "https://f1.fandom.com/wiki/Formula_1_Wiki",
  "https://www.formula1.com/en/latest/all",
  "https://en.wikipedia.org/wiki/List_of_Formula_One_World_Drivers%27_Champions",
  "https://en.wikipedia.org/wiki/Open-wheel_car",
  "https://en.wikipedia.org/wiki/History_of_Formula_One",
  "http://en.espn.co.uk/f1/motorsport/story/3836.html",
  "https://www.formula1.com/en/latest/article/drivers-teams-cars-circuits-and-more-everything-you-need-to-know-about.7iQfL3Rivf1comzdqV5jwc",
  "https://www.bbc.com/sport/formula1/articles/ckgde4q1pe5o",
  "https://www.bbc.com/sport/formula1/articles/cj4vknj92jpo",
  "https://www.bbc.com/sport/formula1/articles/cn8g905v04zo",
  "https://www.bbc.com/news/articles/c62lrd571dxo",
  "https://racingnews365.com/every-world-champion-in-formula-1-history",
  "https://www.skysports.com/f1/standings",
];

// Check if we connect to db
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

// These below refers to number of characters in each chunk and the overlap between them
// Meaning 512 characters in each chunk and 100 characters overlap
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  try {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 1536,
        metric: similarityMetric,
      },
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);
  for await (const url of f1Data) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const embeddings = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float",
      });

      const vector = embeddings.data[0].embedding;

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });

      console.log("res insert", res);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });

  const scrapedContent = await loader.scrape();
  return scrapedContent?.replace(/<[^>]*>?/gm, "");
};

createCollection().then(() => loadSampleData());
