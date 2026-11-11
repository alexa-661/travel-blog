import { Link } from 'react-router';
import CountryFilter from './CountryFilter';
import { useMemo } from 'react';
import { useAppSelector } from '../hooks/customHooks';

const Articles = (Props: { selectedCountry: string, onCountryChange: (country: string) => void }) =>
{
   const articles = useAppSelector((state) => state.global.articles);

   const articlesToDisplay = useMemo(() =>
   {
      if (Props.selectedCountry !== '')
      {
         return articles.filter((article) => article.location.country === Props.selectedCountry);
      }
      else
      {
         return articles;
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
                        title={article.galleryImages[0].title}
                        src={article.galleryImages[0].src}
                        alt={article.galleryImages[0].alt ?? article.galleryImages[0].title}
                        loading="lazy"
                        style={{
                           width: '100%',
                           height: '100%',
                           objectFit: 'cover',
                           objectPosition: 'center'
                        }}
                     />
                  </div>
                  <figcaption style={{ textAlign: 'center' }}>
                     {article.galleryImages[0].caption ?? article.galleryImages[0].title}
                  </figcaption>                  
               </figure>
            </div>
            <div style={{ flex: '3 1 0', minWidth: 0, margin: 0, padding: '2rem', textAlign: 'left' }}>
               <Link to={`/articles/${article.slug}`}>
                  <h2>{article.title}</h2>
               </Link>
               <h3>{article.subtitle}</h3>
               <p>{article.location.country}, {article.location.city}</p>
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
