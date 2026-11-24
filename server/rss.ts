import Parser from 'rss-parser'
import { fetchWithRetry } from './fetchUtils.js';
import type { Article } from '../shared/types.js'

type SubstackItem =
   {
      description?: string;
      "content:encoded"?: string;
   };

const RSS_MAX_ATTEMPTS = 5;
const RSS_RETRY_DELAY_MS = 1000;
const RSS_MAX_REQUEST_TIMEOUT_MS = 3000;
const ARTICLES_CACHE_TTL_MS = 10 * 60 * 1000;


const articlesCache: { articles: Article[]; fetchedAt: number } = { articles: [], fetchedAt: 0 };
const parser = new Parser<unknown, SubstackItem>();

export const getArticles = async (): Promise<Article[]> =>
{
   const feedURL = process.env.SUBSTACK_FEED_URL;

   if (!feedURL)
   {
      throw new Error("SUBSTACK_FEED_URL env var is nto configured properly.");
   }

   const cachedFeed = articlesCache.articles.length ? articlesCache : null;

   if (cachedFeed && Date.now() - cachedFeed.fetchedAt < ARTICLES_CACHE_TTL_MS)
   {
      console.log("Return cached RSS feed");
      return cachedFeed.articles;
   }

   try
   {
      const response = await fetchWithRetry(feedURL, {}, RSS_MAX_ATTEMPTS, RSS_RETRY_DELAY_MS, RSS_MAX_REQUEST_TIMEOUT_MS);
      const xml = await response.text();
      const feed = await parser.parseString(xml);
      const articles: Article[] = feed.items.map((item) => ({
         title: item.title ?? "Somewhere In the World...",
         subTitle: item.description,
         url: item.link,
         creator: item.creator,
         publishedAt: item.pubDate,
         content: item['content:encoded'],
      }));

      console.log("Fetched new feed");
      articlesCache.articles = articles;
      articlesCache.fetchedAt = Date.now();
      return articles;
   }
   catch(error)
   {
      if (cachedFeed)
      {
         console.warn('RSS unavailiable, Returning cached articles.');
         return cachedFeed.articles;
      }

      throw error;
   }
}