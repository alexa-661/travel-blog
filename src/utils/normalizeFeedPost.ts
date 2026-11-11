const MAX_EXCERPT_WORDCOUNT = 50;
const H6_HEADING = 'Location:';
import type { Image } from '../types/types';

export const parseLocation = (content: Document) =>
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

   const headingIndex = heading.indexOf(H6_HEADING);

   return {
      country: heading.slice(headingIndex >= 0 ? headingIndex + H6_HEADING.length : 0, commaIndex).trim(),
      city: heading.slice(commaIndex + 1).trim()
   };
}

export const parseExcerpt = (content: Document) =>
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

export const parseContent = (content: Document, slug: string) =>
{
   const seen = new Set<string>();
   const images: Image[] = [];
   for (const img of content.querySelectorAll('img'))
   {
      const src = img.getAttribute('src');
      if (src === null)
      {
         continue;
      }

      if (seen.has(src)) continue;
      seen.add(src);

      const id = `${slug}:image:${images.length}`;
      const title = img.getAttribute('title');
      const alt = img.getAttribute('alt');
      const figure = img.closest('figure');
      const caption = figure?.querySelector('figcaption')?.textContent?.trim();

      images.push({
         id,
         src,
         title: title?.trim() || '',
         alt: alt?.trim() || '',
         ... (caption ? { caption } : {}), //only add caption if it is present.
      });

      const placeholder = content.createElement('figure');
      placeholder.dataset.mediaId = id;

      if (figure)
      {
         figure.replaceWith(placeholder);
      }
      else
      {
         img.replaceWith(placeholder);
      }
   }

   return {
      content: content.body.innerHTML,
      images
   };
};

