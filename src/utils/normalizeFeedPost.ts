const MAX_EXCERPT_WORDCOUNT = 50;
const H6_HEADING = 'Location:';

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

export const parseHeaderImage = (content: Document) =>
{
   const images = content.querySelectorAll('img');
   const firstFigureCaption = content.querySelector('figcaption')?.textContent?.trim();
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
      caption: firstFigureCaption ?? descriptiveImages[0].title
   }
}

