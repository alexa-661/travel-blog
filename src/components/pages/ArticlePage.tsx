import { useAppSelector } from "../../hooks/customHooks";
import type { Article } from "../../types/types";
import { useParams } from "react-router";

import DOMPurify from 'dompurify';
import type { Image } from '../../types/types';

const renderArticleContent = (html: string, imagesById: Record<string, Image>) =>
{
   const document = new DOMParser().parseFromString(html, 'text/html');

   document.querySelectorAll('figure[data-media-id]').forEach((placeholder) =>
   {
      const id = placeholder.getAttribute('data-media-id');
      const image = id ? imagesById[id] : undefined;

      if (!image)
      {
         placeholder.remove();
         return;
      }

      const figure = document.createElement('figure');
      figure.style.width = '100%';
      figure.style.margin = '0 auto';

      const frame = document.createElement('div');
      frame.style.width = '100%';
      frame.style.height = '25rem';
      frame.style.overflow = 'hidden';

      const img = document.createElement('img');
      img.src = image.src;
      img.title = image.title;
      img.alt = image.alt ?? image.title;
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center';

      frame.append(img);
      figure.append(frame);

      const captionText = image.caption ?? image.title;
      if (captionText) {
         const caption = document.createElement('figcaption');
         caption.textContent = captionText;
         caption.style.textAlign = 'center';
         figure.append(caption);
      }

      placeholder.replaceWith(figure);
   });

   return DOMPurify.sanitize(document.body.innerHTML);
};


const ArticlePage = () => {
   const { slug } = useParams<{ slug: string }>();
   const articles = useAppSelector((state) => state.global.articles);
   const imagesById = useAppSelector((state) => state.global.imagesById);
   const article = articles.find((article: Article) => article.slug === slug);

   if (!article) {
      return <div>Article not found</div>;
   }

   const contentHtml = renderArticleContent(article.content, imagesById);

   return (
      <div style={{border: '2px solid white'}}>
         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box', padding: '1rem' }}>
            <div>
               <h2 style={{ margin: 0 }}>{article.title}</h2>
               <p>{article.subtitle}</p>
            </div>
            <p>{article.location.country}, {article.location.city}</p>
         </div>
         <div style={{ padding: '2rem', textAlign: 'left' }}>
            <article 
               style={{ maxWidth: '100%', height: 'auto' }}
               dangerouslySetInnerHTML={{ __html: contentHtml }}
               className="article-content"
            />
         </div>
      </div>
   );
};

export default ArticlePage;