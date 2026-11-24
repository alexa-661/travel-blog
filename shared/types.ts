export type ArticleLocation =
   {
      city: string;
      country: string;
   };

export type Coordinates =
   {
      latitude: number;
      longitude: number;
   }

export type GeoResult = ArticleLocation & { coordinates: Coordinates | null };

export type Article =
   {  
      title: string;
      subTitle?: string;
      url?: string;
      creator?: string;
      publishedAt?: string;
      content?: string;
   };