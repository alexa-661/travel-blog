import { Link } from 'react-router';
import { articles } from '../assets/articles/articles';
import CountryFilter from './CountryFilter';
import { useState } from 'react';

const Articles = () =>
{
   const [articlesToDisplay, setArticlesToDisplay] = useState(articles);

   const handleCountryChange = (country: string) =>
   {
      setArticlesToDisplay(country ? articles.filter((article) => article.country === country) : articles);
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
      <CountryFilter onCountryChange={handleCountryChange} />
      <section className="articles">{articleJSX}</section>;
   </div>
   )
};

export default Articles;
