import type { Article } from '../../types/types'
import trailImage from '../images/trail-view-sheeps-creek-kluane-01.jpg'
import halifaxImage from '../images/halifax-smoky-rainbow-02.jpg'

export const articles: Article[] = [
  {
    slug: 'watch-for-bears',
    title: 'Watch for Bears',
    subtitle: 'Hiking in the Yukon',
    continent: 'North America',
    country: 'Canada',
    city: 'Whitehorse',
    excerpt: 'When I close my eyes and think about last summer, I see myself lying diagonally across the back of a rented Bronco, attempting to sleep while sweating inside a too-warm sleeping bag.',
    coordinates: {
      latitude: 60.7212,
      longitude: -135.0568
    },
    headerImage: {
      src: trailImage,
      alt: 'A view of Kluane National Park from the top of Sheep\'s Creek hike.',
      caption: 'It just keeps going up.'
    }
  },
  {
    slug: 'smoky-rainbows-on-the-atlantic',
    title: 'Smoky Rainbows on the Atlantic',
    subtitle: 'Riding the unexpected heatwave',
    continent: 'North America',
    country: 'Canada',
    city: 'Halifax',
    excerpt: 'It’s a hazy, warm August day, the air smelling of salt. A rainbow halo circles the sun, formed from the combination of sunlight and wildfire smoke drifting in from—of all places—Newfoundland.',
    coordinates: {
      latitude: 44.6488,
      longitude: -63.5824
    },
    headerImage: {
      src: halifaxImage,
      alt: 'A view of a rainbow ring around the sun.',
      caption: 'I hope this photo didn\'t damage my camera sensor too much.'
    }
  }
]