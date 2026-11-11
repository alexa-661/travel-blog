import type { Article } from '../../types/types'
import trailImage from '../images/trail-view-sheeps-creek-kluane-01.jpg'
import halifaxImage from '../images/halifax-smoky-rainbow-02.jpg'
import saguenayImage from '../images/saguenay-giants-causeway-03.jpg'
import koyasanImage from '../images/koyasan-gate-04.jpg'

export const articles: Article[] = [
   {
      slug: 'watch-for-bears',
      title: 'Watch for Bears',
      subtitle: 'Hiking in the Yukon',
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
   },
   {
      slug: 'returning-to-saguenay',
      title: 'Returning to Saguenay',
      subtitle: 'Same place, different life',
      country: 'Canada',
      city: 'Saguenay',
      excerpt: 'Saguenay appears to be frozen in time, an exact replica of the town I first stumbled upon all those years ago. For me, visiting this town is like looking at life in a rear-view mirror. Everything looks the same, and yet everything is so very different.',
      coordinates: {
         latitude: 48.428,
         longitude: -71.068,
      },
      headerImage: {
         src: saguenayImage,
         alt: 'The view from Giant\'s Causeway in the Saguenay Provincial Park.',
         caption: 'High up along the edges of the cliffs in Saguenay Provincial Park, the views are worth it.'
      }
   },
   {
      slug: 'stillness-in-koyasan',
      title: 'Stillness in Koyasan',
      subtitle: 'The space between bells',
      country: 'Japan',
      city: 'Koyasan',
      excerpt: 'On the advice of a friend who had once lived here, I make my way south. I hop on and off a series of trains, a funicular, and a bus, all steadily climbing upwards, until I stand before a giant two-story red wooden gate.',
      coordinates: {
         latitude: 34.207,
         longitude: 135.586
      },
      headerImage: {
         src: koyasanImage,
         alt: 'The Koyasan entry gate surrounded by fall leaves.',
         caption: 'A glance back at the outside world from within the Koyasan gate.'
      }
   },

]