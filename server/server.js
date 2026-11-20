import 'dotenv/config'
import express from 'express'
import { getArticles } from './rss.js';
import { getGeocodeLocations } from './geocode.js';


const app = express();
app.use(express.json({ limit: '10kb' }));

//Substack RSS Feed Endpoint
app.get('/api/posts', async (_req, res) => {  
   try {
      const articles = await getArticles();
      return res.json(articles);
   }
   catch (error)
   {
      console.error(error);
      return res.status(500).json({ error: 'Could not load the Substack feed.' });
   }
})

//Nominatim Endpoint
app.post('/api/geocode', async (req, res) =>
{
   const { locations } = req.body;
   try
   {
      const results = await getGeocodeLocations(locations);
      res.json({ results });
   }
   catch (error)
   {
      console.error(error);
      res.status(502).json({ error: 'Could not get geocode locations.' });
   }
})


// Contact Form Endpoint
app.post('/api/contact', async (_req, res) =>
{
   // const { name, email, message } = req.body;
   console.log(`Received contact form submission data.`);

   //eventually put in an email forwarding service here, but for now just return a success response.
   res.status(200).json({ message: 'Contact form submitted successfully.' });
});


app.listen(3001, () => {
  console.log('API listening at http://localhost:3001.')
})

