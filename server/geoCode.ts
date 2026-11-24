import type { ArticleLocation, Coordinates, GeoResult } from '../shared/types.js';
import { fetchWithRetry } from './fetchUtils.js';

type GeocodeRequest = ArticleLocation &
   {
      key: string;
      resolve: (value: Coordinates | null) => void;
      reject: (reason?: unknown) => void; 
   }

type NominatimResult =
   {
      lat: string;
      lon: string;
   };

const NOMINATIM_QUEUE_DELAY_MS = 1000;
const geocodeCache = new Map<string, Coordinates>(); //storage cache, holds information for as long as the service is running.
const geocodeQueue: GeocodeRequest[] = [];
let queueIsRunning = false;
let queueTimerId: ReturnType<typeof setTimeout> | null = null;
const NOMINATIM_MAX_RETRY_ATTEMPTS = 5;
const NOMINATIM_RETRY_DELAY_MS = 1000;
const NOMINATIM_MAX_REQUEST_TIME_MS = 3000;

export const getGeocodeLocations = async (locations: ArticleLocation[]): Promise<GeoResult[]> =>
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

const getGeocodeLocation = (city: string, country: string): Promise<Coordinates | null> =>
{
   const key = `${city.trim().toLowerCase()}|${country.trim().toLowerCase()}`
   const cachedResult = geocodeCache.get(key);

   if (cachedResult !== undefined)
   {
      console.log("Result is in the cache:");
      console.dir(cachedResult);
      return Promise.resolve(cachedResult);
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

      if (coordinates !== null)
      {
         geocodeCache.set(request.key, coordinates);
      }

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

const requestNominatim = async (city:string, country:string): Promise<Coordinates | null> =>
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

   const results = await response.json() as NominatimResult[];  
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
