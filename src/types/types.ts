import type { languageOptions } from "../constants/constants";

export interface Image
{
   src: string;
   alt: string;
   caption?: string;
};

export interface Article
{
   slug: string;
   title: string;
   subtitle?: string;
   location: ArticleLocation;
   content: string;
   excerpt: string;
   coordinates: Coordinates | null,
   headerImage: Image,
   galleryImages?: Image[]
}

export type FeedPost = {
   title?: string;
   subTitle?: string;
   url?: string;
   publishedAt?: string;
   content?: string; //XML string
};

export type Language = (typeof languageOptions)[number]; //the type of any element in this array. 

export type Coordinates = {
   latitude: number;
   longitude: number;
}

export type ArticleLocation = {
   city: string;
   country: string;
}

export type GeoResult = ArticleLocation & { coordinates: Coordinates };