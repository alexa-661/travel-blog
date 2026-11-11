import 'dotenv/config'
import express from 'express'
import Parser from 'rss-parser'

const app = express();
const parser = new Parser();

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