import { fetchWithRetry } from './fetchUtils.js';

const NOMINATIM_QUEUE_DELAY_MS = 1000;
const geocodeCache = new Map(); //storage cache, holds information for as long as the service is running.
const geocodeQueue = [];
let queueIsRunning = false;
let queueTimerId = null;
const NOMINATIM_MAX_RETRY_ATTEMPTS = 5;
const NOMINATIM_RETRY_DELAY_MS = 1000;
const NOMINATIM_MAX_REQUEST_TIME_MS = 3000;

export const getGeocodeLocations = async (locations) =>
{
   return Promise.all(
      locations.map(async ({city, country}) =>
      ({
         city,
         country,
         coordinates: await getGeocodeLocation(city, country)
      }))
   );
};

const getGeocodeLocation = async (city, country) =>
{
  const key = `${city.trim().toLowerCase()}|${country.trim().toLowerCase()}`
  if (geocodeCache.has(key))
  {
      const result = geocodeCache.get(key);
      console.log("Result is in the cache:");
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
   finally
   {
      queueIsRunning = false;

      if (geocodeQueue.length > 0 && queueTimerId === null)
      {
         queueTimerId = setTimeout(() => { queueTimerId = null; processNextGeocode()}, NOMINATIM_QUEUE_DELAY_MS);
      }
   }
}

const requestNominatim = async (city, country) =>
{
   const url = new URL('https://nominatim.openstreetmap.org/search');
   url.searchParams.set('q', `${city}, ${country}`);
   url.searchParams.set('format', 'jsonv2');
   url.searchParams.set('limit', '1');

   const response = await fetchWithRetry(url,
      {
         headers:
         {
            'User-Agent': 'TravelBlog/1.0 (local development)', //change this to a public URL when site is live
         }
      },
      NOMINATIM_MAX_RETRY_ATTEMPTS,
      NOMINATIM_RETRY_DELAY_MS,
      NOMINATIM_MAX_REQUEST_TIME_MS
   );

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
