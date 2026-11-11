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
  continent: string;
  country: string;
  city: string;
  excerpt: string;
  coordinates: {
    latitude: number;
    longitude: number;
  },
  headerImage: Image,
  galleryImages?: Image[]
}

