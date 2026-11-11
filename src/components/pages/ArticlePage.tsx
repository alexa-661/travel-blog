import { useAppSelector } from "../../hooks/customHooks";
import type { Article } from "../../types/types";
import { useParams } from "react-router";

const ArticlePage = () => {
   const { slug } = useParams<{ slug: string }>();
   const articles = useAppSelector((state) => state.global.articles);
   const article = articles.find((article: Article) => article.slug === slug);

   if (!article) {
      return <div>Article not found</div>;
   }

   return (
      <div style={{border: '2px solid white'}}>
         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box', padding: '1rem' }}>
            <div>
               <h2 style={{ margin: 0 }}>{article.title}</h2>
               <p>{article.subtitle}</p>
            </div>
            <p>{article.country}, {article.city}</p>
         </div>
         
         <figure style={{width: '100%', margin: '0 auto'}}>
            <div
               style={{
                  width: '100%',
                  height: '25rem',
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
            <figcaption>{article.headerImage.caption}</figcaption>
         </figure>
         <div style={{ padding: '2rem', textAlign: 'left' }}>
            <article 
               style={{ maxWidth: '100%', height: 'auto' }}
               dangerouslySetInnerHTML={{ __html: article.content }}
               className="article-content"
            />
         </div>
      </div>
   );
};

export default ArticlePage;