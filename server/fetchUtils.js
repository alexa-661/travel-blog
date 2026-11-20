const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWithRetry = async (url, options, maxAttempts, retryDelayMS, requestTimeoutMS) =>
{
   let lastError;

   for (let attempt = 1; attempt <= maxAttempts; attempt++)
   {
      try
      {
         //ok to log URL for a non production build
         console.log(`Fetching url ${url} (attempt ${attempt}/${maxAttempts})`);
         const response = await fetchWithTimeout(url, options, requestTimeoutMS);
         return response;
      }
      catch (error)
      {
         lastError = error;

         if (error.name === 'AbortError')
         {
            console.error(`Fetch url ${url} timed out (attempt ${attempt})`);
         }
         else
         {
            console.error(`Fetch url ${url} failed (attempt ${attempt})`, error);
         }

         if (attempt < maxAttempts)
         {
            await delay(retryDelayMS);
         }
      }
   }

   throw lastError;
};

const fetchWithTimeout = async (url, options, timeoutMS) =>
{
   const controller = new AbortController();

   const timeoutId = setTimeout(() =>
   {
      controller.abort();
   }, timeoutMS);

   try
   {
      const response = await fetch(url, {
         ...options,
         signal: controller.signal,
      });

      if (!response.ok) {
         throw new Error(`Request failed: ${response.status}`);
      }

      return response;
   }
   finally
   {
      clearTimeout(timeoutId);
   }
};