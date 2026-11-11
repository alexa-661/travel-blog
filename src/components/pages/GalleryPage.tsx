import {useMemo, useState} from 'react';
import { useAppSelector } from '../../hooks/customHooks';

const GalleryPage = () => {

   const articles = useAppSelector((state) => state.global.articles);
   const images = articles.flatMap((article) => article.galleryImages ?? []);
   const [visibleCount, setVisibleCount] = useState(9);
   const visibleImages = useMemo(() => images.slice(0, visibleCount), [visibleCount, images]);

   return (
      <>
         <div
            style={{
               display: 'grid',
               gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 15rem), 1fr))',
               gap: '1rem',
               maxWidth: '60rem',
               margin: '0 auto'
            }}
         >
            {visibleImages.map((image) => (
               <img
                  key={image.title}
                  src={image.src}
                  title={image.title}
                  alt={image.alt ?? image.title}
                  loading="lazy"
                  style={{
                     display: 'block',
                     width: '100%',
                     aspectRatio: '1',
                     objectFit: 'cover',
                  }}  
               />
            ))}
         </div>
         {visibleCount < images.length && (
            <button
               onClick={() => setVisibleCount((prevCount) => prevCount + 9)}
               style={{
                  display: 'block',
                  margin: '1rem auto',
                  padding: '0.5rem 1rem',
               }}
            >
               Load More
            </button>
         )}
      </>
   )
};

export default GalleryPage;