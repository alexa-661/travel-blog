import { useMemo, useState } from 'react';
import { articles } from '../assets/articles/articles';

const CountryFilter = (Props: { onCountryChange: (country: string) => void }) => {
   
   const [selectedCountry, setSelectedCountry] = useState<string>('');
   const countryOptions = useMemo(() => new Set(articles.map((article) => article.country)), []);

   return (
      <form>
         <label htmlFor="country" style={{ margin: '0 1rem' }}>Filter by Country:</label>
         <select
            id="country"
            value={selectedCountry}
            onChange={(e) => {
               setSelectedCountry(e.target.value);
               Props.onCountryChange(e.target.value);
            }}
            >
               <option value="">All Countries</option>
               {Array.from(countryOptions).map((country) => (
                  <option key={country} value={country}>
                     {country}
                  </option>
               ))}
            </select>
      </form>
      
   );

}

export default CountryFilter;