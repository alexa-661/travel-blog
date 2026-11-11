import 'dotenv/config'
import express from 'express'
import Parser from 'rss-parser'

const app = express();
const parser = new Parser();
const GEOCODE_MAX_REQUEST_TIME = 1000; //once every 1000ms

//Substack RSS Feed
app.get('/api/posts', async (_req, res) => {
  try {
    const feed = await parser.parseURL(process.env.SUBSTACK_FEED_URL)

    res.json(
      feed.items.map((item) => ({
        title: item.title,
        subTitle: item.description,
        url: item.link,
        creator: item.creator,
        publishedAt: item.pubDate,
        content: item['content:encoded'],
      })),
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not load the Substack feed.' })
  }
})

app.listen(3001, () => {
  console.log('API listening at http://localhost:3001.')
})

//Open Street Map Nominatim
app.use(express.json({ limit: '10kb' })); //limit JSON requests

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
      queueTimerId = setTimeout(() => { queueTimerId = null; processNextGeocode()}, GEOCODE_MAX_REQUEST_TIME);
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

