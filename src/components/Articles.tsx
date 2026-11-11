import { Link } from 'react-router';
import {type Article} from '../types/types'
import CountryFilter from './CountryFilter';
import { useMemo } from 'react';
import { useAppSelector } from '../hooks/customHooks';

const MAX_EXCERPT_WORDCOUNT = 50;

const parseLocation = (content: Document) =>
{
   const heading = content.querySelector('h6')?.textContent?.trim();

   if (!heading)
   {
      return null;
   }

   const commaIndex = heading.indexOf(',');
   if (commaIndex === -1)
   {
      return null;
   }

   console.log("the location is " + heading);

   return {
      country: heading.slice(0, commaIndex).trim(),
      city: heading.slice(commaIndex + 1).trim()
   };
}

const parseExcerpt = (content: Document) =>
{
   const paragraphs = content.querySelectorAll('p');
   const text = Array.from(paragraphs)
      .map((paragraph) => paragraph.textContent?.trim() ?? '')
      .filter((paragraph) => paragraph.length > 0)
      .join(' ');

   const words = text.split(/\s+/).filter((word) => word.length > 0);

   if (words.length <= MAX_EXCERPT_WORDCOUNT) {
      return text;
   }

   return `${words.slice(0, MAX_EXCERPT_WORDCOUNT).join(' ')}...`;
}

const parseHeaderImage = (content: Document) =>
{
   const images = content.querySelectorAll('img');
   const descriptiveImages = Array.from(images).filter((image) => image.title.length > 0);
   if (descriptiveImages.length === 0)
   {
      return {
         src: '',
         alt: '',
         caption: 'No Image to Display'
      }
   }

   return {
      src: descriptiveImages[0].src,
      alt: descriptiveImages[0].alt ?? 'Header Image',
      caption: descriptiveImages[0].title
   }

}

const Articles = (Props: { selectedCountry: string, onCountryChange: (country: string) => void }) =>
{
   const articles = useAppSelector((state) => state.global.articles);

   const articlesToDisplay = useMemo(() =>
   {
      const displayArticles: Article[] = articles.flatMap((post) =>
      {
         const contentHTML = new DOMParser().parseFromString(post.content ?? '', 'text/html');
         const location = parseLocation(contentHTML);
         if (!location  || !post.title)
         {
            return [];
         }
         return [{
            slug: post.title.toLowerCase().trim().replace(/\s+/g, '-'),
            title: post.title,
            subtitle: post.subTitle,
            country: location.country,
            city: location.city,
            content: post.content, //may not be necessary here
            excerpt:parseExcerpt(contentHTML),
            coordinates: {
               latitude: 0, //deal with this later. 
               longitude: 0
            },
            headerImage: parseHeaderImage(contentHTML),
            // galleryImages?: Image[]
         }]
      });

      if (Props.selectedCountry !== '')
      {
         return displayArticles.filter((article) => article.country === Props.selectedCountry)
      }
      else
      {
         return displayArticles;
      }
   }, [Props.selectedCountry, articles]);

   if (articles.length === 0)
   {
      return (<div>Loading...</div>)
   }

   const articleJSX = articlesToDisplay.map((article) =>
   {
      return (
         <div
            key={article.slug}
            className="article"
            style={{ display: 'flex',
               flexDirection: 'row',
               justifyContent: 'space-between',
               width: '100%',
               boxSizing: 'border-box',
               alignItems: 'flex-start', 
               gap: '2rem', margin: '1rem' }}
         >
            <div style={{ flex: '1 1 0', minWidth: 0, margin: '1rem', textAlign: 'center' }}>
               <figure style={{ width: '20rem', maxWidth: '100%', margin: '0 auto' }}>
                  <div
                     style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        overflow: 'hidden',
                     }}
                  >
                     <img
                        src={article.headerImage.src}
                        alt={article.headerImage.alt}
                        loading="lazy"
                        style={{
                           width: '100%',
                           height: '100%',
                           objectFit: 'cover',
                           objectPosition: 'center'
                        }}
                     />
                  </div>
                  <figcaption style={{ textAlign: 'center' }}>{article.headerImage.caption}</figcaption>                  
               </figure>
            </div>
            <div style={{ flex: '3 1 0', minWidth: 0, margin: 0, padding: '2rem', textAlign: 'left' }}>
               <Link to={`/articles/${article.slug}`}>
                  <h2>{article.title}</h2>
               </Link>
               <h3>{article.subtitle}</h3>
               <p>{article.country}, {article.city}</p>
               <p>{article.excerpt}</p>
               <button>Read More</button>
            </div>
         </div>
      );
   });

   return (
      <div style={{ margin: '1rem' }}>
         <CountryFilter selectedCountry={Props.selectedCountry} onCountryChange={Props.onCountryChange} />
         <section className="articles">{articleJSX}</section>;
      </div>
   )
};

export default Articles;
