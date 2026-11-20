import 'dotenv/config'
import express from 'express'
import Parser from 'rss-parser'

const app = express();
const parser = new Parser();
const GEOCODE_MAX_REQUEST_TIME_MS = 1000;
const ARTICLES_CACHE_TTL_MS = 10 * 60 * 1000;
const articlesCache = { articles: [], fetchedAt: 0 };
const RSS_MAX_ATTEMPTS = 5;
const RSS_RETRY_DELAY_MS = 1000;
const RSS_MAX_REQUEST_TIME_MS = 3000;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.use(express.json({ limit: '10kb' }));

const fetchFeed = async (feedUrl) =>
{
   const controller = new AbortController();

   const timeoutId = setTimeout(() =>
   {
      controller.abort();
   }, RSS_MAX_REQUEST_TIME_MS);

   try
   {
      const response = await fetch(feedUrl, {
         signal: controller.signal,
      });

      if (!response.ok) {
         throw new Error(`RSS request failed: ${response.status}`);
      }

      const xml = await response.text();

      return parser.parseString(xml);
   }
   finally
   {
      clearTimeout(timeoutId);
   }
}

const fetchFeedWithRetry = async (feedUrl) =>
{
   let lastError;

   for (let attempt = 1; attempt <= RSS_MAX_ATTEMPTS; attempt++)
   {
      try
      {
         console.log(`Fetching RSS feed (attempt ${attempt}/${RSS_MAX_ATTEMPTS})`);
         return await fetchFeed(feedUrl);
      }
      catch (error)
      {
         lastError = error;

         if (error.name === 'AbortError')
         {
            console.error(`RSS request timed out (attempt ${attempt})`);
         }
         else
         {
            console.error(`RSS fetch failed (attempt ${attempt})`, error);
         }

         if (attempt < RSS_MAX_ATTEMPTS)
         {
            await delay(RSS_RETRY_DELAY_MS);
         }
      }
   }

   throw lastError;
};

//Substack RSS Feed
app.get('/api/posts', async (_req, res) => {
   const feedUrl = process.env.SUBSTACK_FEED_URL;
   const cachedFeed = articlesCache.articles.length ? articlesCache : null;

   if (cachedFeed && Date.now() - cachedFeed.fetchedAt < ARTICLES_CACHE_TTL_MS)
   {
      console.log("Return cached RSS feed");
      return res.json(cachedFeed.articles);
   }

   try {
      const feed = await fetchFeedWithRetry(feedUrl);
      const articles = feed.items.map((item) => ({
         title: item.title,
         subTitle: item.description,
         url: item.link,
         creator: item.creator,
         publishedAt: item.pubDate,
         content: item['content:encoded'],
      }));

      console.log("Fetched new feed");

      // articles.forEach((article) => { console.log('article title: ' + article.title) });

      articlesCache.articles = articles;
      articlesCache.fetchedAt = Date.now();
      return res.json(articles);
   }
   catch (error)
   {
      console.error(error);
      if (cachedFeed)
      {
         return res.json(cachedFeed.articles);
      }
      return res.status(500).json({ error: 'Could not load the Substack feed.' });
   }
})

app.listen(3001, () => {
  console.log('API listening at http://localhost:3001.')
})

//Open Street Map Nominatim

app.post('/api/geocode', async (req, res) =>
{
   const { locations } = req.body;
   try
   {
      const results = await Promise.all(
         locations.map(async ({ city, country }) => ({
         city,
         country,
         coordinates: await geocodeLocation(city, country),
      }))
    );
      res.json({ results });
   }
   catch (error)
   {
      console.error(error);
      res.status(502).json({ error: 'Could not get geocode locations.' });
   }
})

const geocodeCache = new Map(); //storage cache, holds information for as long as the service is running.
let geocodeQueue = [];
let queueIsRunning = false;
let queueTimerId = null;

const geocodeLocation = (city, country) =>
{
  const key = `${city.trim().toLowerCase()}|${country.trim().toLowerCase()}`
  if (geocodeCache.has(key))
  {
   const result = geocodeCache.get(key);
      console.log("result is in the cache:");
      console.dir(result);
    return Promise.resolve(result);
  }

  return new Promise((resolve, reject) =>{
      geocodeQueue.push({ city, country, key, resolve, reject });
      if (!queueIsRunning && queueTimerId === null)
      {
        void processNextGeocode();
      }
  });
}

const processNextGeocode = async () =>
{
   if (queueIsRunning) return;
   const request = geocodeQueue.shift();
   if (!request) return;

   queueIsRunning = true;

   try
   {
      const coordinates = await requestNominatim(
         request.city,
         request.country
      )

      geocodeCache.set(request.key, coordinates);
      request.resolve(coordinates);
   }
   catch (error)
   {
      request.reject(error);
   }

   queueIsRunning = false;

   if (geocodeQueue.length > 0 && queueTimerId === null)
   {
      queueTimerId = setTimeout(() => { queueTimerId = null; processNextGeocode()}, GEOCODE_MAX_REQUEST_TIME_MS);
   }

}

const requestNominatim = async (city, country) =>
{
   const url = new URL('https://nominatim.openstreetmap.org/search');
   url.searchParams.set('q', `${city}, ${country}`);
   url.searchParams.set('format', 'jsonv2');
   url.searchParams.set('limit', '1');

   const response = await fetch(url, {
      headers:
      {
         'User-Agent': 'TravelBlog/1.0 (local development)', //change this to a public URL when site is live
      },
   });

   if (!response.ok)
   {
      throw new Error(`Nominatim request failed: ${response.status}`);
   }

  const results = await response.json();
  const result = results[0];

   if (!result)
   {
    return null;
   }

   const latitude = Number(result.lat);
   const longitude = Number(result.lon);

   console.log(`The fetched latitude and longitude are ${latitude}, ${longitude}`);

   if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
   {
      throw new Error('Nominatim returned invalid coordinates.');
   }

   return { latitude, longitude };
};

// contact form submission endpoint
app.post('/api/contact', async (_req, res) =>
{
   // const { name, email, message } = req.body;
   console.log(`Received contact form submission data.`);

   //eventually put in an email forwarding service here, but for now just return a success response.
   res.status(200).json({ message: 'Contact form submitted successfully.' });
});

