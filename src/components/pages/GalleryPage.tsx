import {useMemo, useState} from 'react';
const imageFiles = import.meta.glob<string>(
   '../assets/images/*.{png,jpg,jpeg,webp,avif}',
   {
      eager: true,
      query: '?url',
      import: 'default',
   },
)

const images = Object.entries(imageFiles).map(([path, src]) => ({
   src,
   alt: path
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '')
      .replace(/[-_]/g, ' ') ?? 'Gallery Image',
}))

const Gallery = () => {

   const [visibleCount, setVisibleCount] = useState(9);
   const visibleImages = useMemo(() => images.slice(0, visibleCount), [visibleCount]);

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
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
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

export default Gallery;